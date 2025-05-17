import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Subject } from 'rxjs';
import { BoqsService } from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs.service';
import {
  BOQItem,
  BOQItemsGroup,
} from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import { BOQSubItem } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-sub-items/boq-sub-item.model';
import {
  EditableSpecificationItem,
  FlatNestedSpecificationItemView,
  FlatNestedSpecificationItemViewChangeTypes,
  Formula,
  FormulaNames,
  ItemsStateCodes,
  NestedSpecificationItem,
} from './store/model';

export interface NestedSpecificationChange {
  items?: FlatNestedSpecificationItemView[];
  item?: EditableSpecificationItem | NestedSpecificationItem;
  changeType: FlatNestedSpecificationItemViewChangeTypes;
}

export interface AddItemResults {
  addedItem: FlatNestedSpecificationItemView;
  items: FlatNestedSpecificationItemView[];
}

@Injectable({
  providedIn: 'root',
})
export class NestedSpecificationsService {
  nestedSpecificationItems: NestedSpecificationItem[] = [];

  private changesEvent = new Subject<NestedSpecificationChange>();

  constructor(private boqsService: BoqsService) {}

  updateItemState(
    item: EditableSpecificationItem,
    stateCode: ItemsStateCodes,
    message: string
  ) {
    item['state'] = {
      code: stateCode,
      message: message,
    };
    this.broadcastChange({
      item: item,
      changeType: FlatNestedSpecificationItemViewChangeTypes.STATE_CHANGE,
    });
  }

  refresh(items: FlatNestedSpecificationItemView[]) {
    this.broadcastChange({
      items: items,
      changeType: FlatNestedSpecificationItemViewChangeTypes.REFRESH,
    });
  }

  broadcastChange(change: NestedSpecificationChange) {
    this.changesEvent.next(change);
  }

  getChange() {
    return this.changesEvent.asObservable();
  }

  flattenNestedSpecificationItems(
    nestedSpecificationItems: NestedSpecificationItem[]
  ): FlatNestedSpecificationItemView[] {
    let results: FlatNestedSpecificationItemView[] = [];
    for (let item of nestedSpecificationItems) {
      this.addItem(results, item);
      if (item.children) {
        results = results.concat(
          this.flattenNestedSpecificationItems(item.children)
        );
      }
      if (item.specifications) {
        this.addSpecifications(results, item);
      }
    }
    return results;
  }

  getUnitRateFromPSFormula(formula: Formula): number {
    let formulaString = formula?.formula;
    let unitRate: number = formulaString?.replace('amount=', '') as unknown as
      | number
      | null;
    return unitRate;
  }

  setPSFormula(amount: number): Formula {
    let formulaString = 'amount=' + amount;
    let formula: Formula = {
      formulaName: FormulaNames.PROVISION_SUM_AMOUNT,
      formula: formulaString,
      inputFields: [
        {
          itemId: 'self',
        },
      ],
    };
    return formula;
  }

  addItem(
    list: FlatNestedSpecificationItemView[],
    item: NestedSpecificationItem,
    foundParentItemRowId = null
  ): AddItemResults {
    let itemToAdd: FlatNestedSpecificationItemView = {
      type: 'ItemDescription',
      id: item?.id,
      uuid: item.rowId,
      level: item.level,
      parentId: item.parentId,
      parentIsExpanded: true,
      nestedSpecificationItem: {
        ...item,
        children: null,
        specifications: null,
      },
    };

    if (!foundParentItemRowId) {
      list.push(itemToAdd);
    } else {
      let lastChild = this.getLastChildIndexByParentId(
        foundParentItemRowId,
        list
      );

      let targetIndex = 0;

      if (lastChild != null) {
        targetIndex = list.indexOf(lastChild);
      } else {
        targetIndex = list.findIndex(
          (item) => item.uuid == foundParentItemRowId
        );
      }

      list.splice(targetIndex + 1, 0, itemToAdd);
    }
    return {
      addedItem: itemToAdd,
      items: list,
    };
  }

  addFirstSpecification(
    list: FlatNestedSpecificationItemView[],
    item: FlatNestedSpecificationItemView,
    parentItem: FlatNestedSpecificationItemView,
    parentIndex: number
  ) {
    list.splice(
      parentIndex + 1,
      0,
      this.getSpecificationHeader(parentItem.uuid, parentItem.level)
    );
    item.level = parentItem.level + 1;
    list.splice(parentIndex + 2, 0, item);
    list.splice(
      parentIndex + 3,
      0,
      this.getSpecificationFooter(parentItem.uuid, parentItem.level)
    );
  }

  addMoreSpecification(
    list: FlatNestedSpecificationItemView[],
    item: FlatNestedSpecificationItemView,
    parentItem: FlatNestedSpecificationItemView
  ) {
    let lastChild = list.filter(
      (listItem) =>
        listItem.type == 'NestedSpecificationFooter' &&
        listItem.parentId == item.parentId
    )[0];

    item.level = parentItem.level + 1;
    let targetIndex = list.indexOf(lastChild);
    list.splice(targetIndex, 0, item);
  }

  addSpecification(
    list: FlatNestedSpecificationItemView[],
    item: EditableSpecificationItem,
    groupId: number
  ): FlatNestedSpecificationItemView {
    let itemToAdd: FlatNestedSpecificationItemView = {
      type: 'NestedSpecificationItem',
      id: item?.id,
      uuid: item.rowId,
      level: item.level,
      parentId: item.parentId,
      parentIsExpanded: true,
      groupId,
      editableSpecificationItem: {
        ...item,
      },
    };

    let children = list.filter(
      (listItem) =>
        listItem.parentId == item.parentId &&
        listItem.type == 'NestedSpecificationItem'
    );

    let parentIndex = list.findIndex(
      (listItem) => listItem.uuid == item.parentId
    );

    if (parentIndex != -1) {
      let parentItem = list.filter(
        (listItem) => listItem.uuid == item.parentId
      )[0];

      if (children.length == 0) {
        this.addFirstSpecification(list, itemToAdd, parentItem, parentIndex);
      } else {
        this.addMoreSpecification(list, itemToAdd, parentItem);
      }
    } else {
      console.error('Could not find parent of ' + item.parentId, 'comparing ');
    }

    return itemToAdd;
  }

  getLastChildIndexByParentId(
    parentId: string,
    items: FlatNestedSpecificationItemView[],
    previousLastChild: FlatNestedSpecificationItemView = null
  ): FlatNestedSpecificationItemView {
    const itemMap = new Map();
    items.forEach((item) => {
      const parentChildren = itemMap.get(item.parentId) || [];
      parentChildren.push(item);
      itemMap.set(item.parentId, parentChildren);
    });

    let lastChild = previousLastChild;
    let children = itemMap.get(parentId) || [];
    let i = children.length - 1;

    while (i >= 0 && (!lastChild || children[i].level > lastChild.level)) {
      const child = children[i];
      lastChild = this.getLastChildIndexByParentId(child.uuid, items, child);
      i--;
    }

    return lastChild;
  }

  getItemsMap(
    items: FlatNestedSpecificationItemView[]
  ): Map<string, FlatNestedSpecificationItemView> {
    const itemMap = new Map<string, FlatNestedSpecificationItemView>();
    for (let i = 0; i < items.length; i++) {
      if (
        items[i].nestedSpecificationItem ||
        items[i].editableSpecificationItem
      ) {
        itemMap.set(items[i].uuid, items[i]);
      }
    }
    return itemMap;
  }

  calculateFlatNestedSpecificationItemViewTotals(
    items: FlatNestedSpecificationItemView[]
  ) {
    let groupItemsItems = items.filter((item) => item.type == 'GroupItem');

    for (let i = 0; i < groupItemsItems.length; i++) {
      let itemsForTotal = items.filter(
        (item) => item.groupId == groupItemsItems[i].groupId
      );
      this.calculateTotals(itemsForTotal, groupItemsItems[i].groupId);
    }
  }

  calculateTotals(
    items: FlatNestedSpecificationItemView[],
    groupId: number,
    parentId: string = null,
    specsTotal = null
  ): number {
    let total: number = 0;
    let grandTotal: number = 0;

    if (specsTotal == null) {
      specsTotal = this.getAndCalculateSpecsTotal(items, groupId);
    }

    for (let i = 0; i < items.length; i++) {
      if (
        ((items[i].parentId == null && parentId == null) ||
          items[i].parentId == parentId) &&
        groupId == items[i].groupId
      ) {
        let specsTotalForItem = specsTotal.get(items[i].uuid) || 0;

        let itemChildrenTotal = this.calculateTotals(
          items,
          groupId,
          items[i].uuid,
          specsTotal
        );

        total = specsTotalForItem + itemChildrenTotal;

        items[i].nestedSpecificationItem = {
          ...items[i].nestedSpecificationItem,
          total,
        };

        grandTotal += total;
      }
    }

    return grandTotal;
  }

  appendSpecifications = (
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
    fetchedSubBOQItems: Map<string, BOQSubItem[]>,
    parentUuid: string,
    parentLevel: number,
    groupId: number
  ) => {
    let boqSubItems: BOQSubItem[] = fetchedSubBOQItems.get(parentUuid);

    let level = parentLevel + 1;

    if (boqSubItems?.length > 0) {
      flatNestedSpecificationItemView.push({
        type: 'NestedSpecificationTableHeader',
        id: 'header-' + parentUuid,
        uuid: 'header-' + parentUuid,
        level: level,
        groupId,
        parentId: parentUuid,
        parentIsExpanded: true,
      });
      for (let i = 0; i < boqSubItems?.length; i++) {
        try {
          flatNestedSpecificationItemView.push({
            type: 'NestedSpecificationItem',
            id: boqSubItems[i].id,
            uuid: boqSubItems[i].uuid,
            level,
            groupId,
            parentIsExpanded: true,
            parentId: parentUuid,
            editableSpecificationItem:
              this.convertBOQSubItemToNestedSpecificationItem(
                boqSubItems[i],
                parentUuid,
                level
              ),
          });
        } catch (e) {
          console.error(e);
        }
      }

      flatNestedSpecificationItemView.push({
        type: 'NestedSpecificationFooter',
        id: 'footer-' + parentUuid,
        uuid: 'footer-' + parentUuid,
        level: level,
        groupId,
        parentId: parentUuid,
        parentIsExpanded: true,
      });
    }
  };

  public convertBOQSubItemToNestedSpecificationItem(
    boqSubItem: BOQSubItem,
    parentId: string,
    level: number,
    isEditable = false,
    selectedUuids: string[] = []
  ): EditableSpecificationItem {
    return {
      parentId,
      id: boqSubItem.id,
      uuid: boqSubItem.uuid,
      rowId: boqSubItem.uuid,
      description: boqSubItem.name,
      code: boqSubItem.code,
      sourceUuid: boqSubItem?.sourceUuid
        ? boqSubItem.sourceUuid
        : boqSubItem.uuid,
      isEditable,
      level,
      unitOfMeasure: boqSubItem.unitOfMeasure,
      total: boqSubItem?.total,
      unitRate: boqSubItem?.unitRate,
      value: boqSubItem?.quantity ? boqSubItem?.quantity + '' : null,
      isSelected: selectedUuids?.includes(boqSubItem.uuid),
      formula: boqSubItem.formula ? JSON.parse(boqSubItem.formula) : null,
    };
  }

  appendChildren(
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
    fetchedBOQItems: Map<string, BOQItem[]>,
    fetchedSubBOQItems: Map<string, BOQSubItem[]>,
    parentUuid: string,
    parentLevel: number,
    groupId: number
  ) {
    let level = parentLevel + 1;

    let childBOQItems: BOQItem[] = fetchedBOQItems.get(parentUuid);

    for (let i = 0; i < childBOQItems?.length; i++) {
      flatNestedSpecificationItemView.push({
        type: 'ItemDescription',
        id: childBOQItems[i].id,
        uuid: childBOQItems[i].uuid,
        level,
        groupId,
        parentId: parentUuid,
        parentIsExpanded: true,
        nestedSpecificationItem: this.convertBOQItemToNestedSpecificationItem(
          childBOQItems[i],
          level
        ),
      });

      this.appendSpecifications(
        flatNestedSpecificationItemView,
        fetchedSubBOQItems,
        childBOQItems[i].uuid,
        level,
        groupId
      );

      this.appendChildren(
        flatNestedSpecificationItemView,
        fetchedBOQItems,
        fetchedSubBOQItems,
        childBOQItems[i].uuid,
        level,
        groupId
      );
    }
  }

  convertBOQItemToNestedSpecificationItem(
    boqItem: BOQItem,
    level = 0
  ): NestedSpecificationItem {
    let result: NestedSpecificationItem = {
      id: boqItem.id,
      uuid: boqItem.uuid,
      level: level,
      parentId: boqItem?.boqItem?.uuid,
      description: boqItem.description,
      sourceUuid: boqItem.sourceUuid ? boqItem.sourceUuid : boqItem.uuid,
      code: boqItem.code,
      children: [],
      isNew: false,
      rowId: boqItem.uuid,
      isEditable: false,
      isSelected: false,
      total: boqItem.total,
    };

    return result;
  }

  getAndCalculateSpecsTotal(
    items: FlatNestedSpecificationItemView[],
    groupId: number
  ): Map<string, number> {
    const parentTotals = new Map<string, number>();

    for (const item of items) {
      if (
        item?.editableSpecificationItem &&
        item?.parentId &&
        item.groupId == groupId
      ) {
        const parentId = item.parentId;
        const total = item.editableSpecificationItem.total ?? 0;
        parentTotals.set(parentId, (parentTotals.get(parentId) ?? 0) + total);
      }
    }

    return parentTotals;
  }

  convertBOQsToFlatNestedSpecificationView(
    boqItems: BOQItem[],
    groupId: number,
    parentsInitialised = true
  ): FlatNestedSpecificationItemView[] {
    let firstParents = parentsInitialised
      ? boqItems
      : boqItems.filter((item) => item?.boqItem === null);

    let flatNestedSpecificationItemView: FlatNestedSpecificationItemView[] = [];

    const boqItemsMap = this.convertBOQItemsToMaps(boqItems);
    const childBOQItems = this.getChildBOQItemsMapFromBOQItems(boqItems);
    const boqSubItemsMap = this.getBOQSubItemsMapFromBOQItemsMap(boqItemsMap);
    for (let i = 0; i < firstParents.length; i++) {
      this.setParentBOQItemToFlatView(
        flatNestedSpecificationItemView,
        firstParents[i],
        groupId,
        childBOQItems,
        boqSubItemsMap
      );
    }

    return flatNestedSpecificationItemView;
  }

  convertGruopedBOQsToFlatNestedSpecificationView(
    boqItems: BOQItem[],
    boqGroup: BOQItemsGroup,
    parentsInitialised = true
  ): FlatNestedSpecificationItemView[] {
    let firstParents = parentsInitialised
      ? boqItems
      : boqItems.filter((item) => item?.boqItem === null);

    let flatNestedSpecificationItemView: FlatNestedSpecificationItemView[] = [];

    flatNestedSpecificationItemView.push({
      type: 'GroupItem',
      level: 0,
      groupId: boqGroup.id,
      nestedSpecificationGroupItem: {
        id: boqGroup.id,
        uuid: boqGroup.uuid,
        name: boqGroup.name,
      },
      parentIsExpanded: true,
    });

    const boqItemsMap = this.convertBOQItemsToMaps(boqItems);
    const childBOQItems = this.getChildBOQItemsMapFromBOQItems(boqItems);
    const boqSubItemsMap = this.getBOQSubItemsMapFromBOQItemsMap(boqItemsMap);
    for (let i = 0; i < firstParents.length; i++) {
      this.setParentBOQItemToFlatView(
        flatNestedSpecificationItemView,
        firstParents[i],
        boqGroup.id,
        childBOQItems,
        boqSubItemsMap
      );
    }

    return flatNestedSpecificationItemView;
  }

  getBOQSubItemsMapFromBOQItemsMap(
    boqItemsMap: Map<string, BOQItem>
  ): Map<string, BOQSubItem[]> {
    const boqSubItemsMap: Map<string, BOQSubItem[]> = new Map();

    boqItemsMap.forEach(
      (boqItem: BOQItem, uuid: string, map: Map<string, BOQItem>) => {
        if (boqItem?.boqSubItems?.length > 0) {
          boqSubItemsMap.set(uuid, boqItem.boqSubItems);
        }
      }
    );

    return boqSubItemsMap;
  }

  getChildBOQItemsMapFromBOQItems(
    boqItems: BOQItem[],
    boqItemsMap: Map<string, BOQItem[]> = null
  ): Map<string, BOQItem[]> {
    if (boqItemsMap == null) {
      boqItemsMap = new Map();
    }
    for (let boqItem of boqItems) {
      let linkedBOQItems = boqItem.linkedBOQItems;
      if (linkedBOQItems?.length > 0) {
        boqItemsMap.set(boqItem.uuid, linkedBOQItems);
        boqItemsMap = this.getChildBOQItemsMapFromBOQItems(
          linkedBOQItems,
          boqItemsMap
        );
      }
    }
    return boqItemsMap;
  }

  convertBOQItemsToMaps(
    boqItems: BOQItem[],
    boqItemsMap: Map<string, BOQItem> = null
  ): Map<string, BOQItem> {
    if (boqItemsMap == null) {
      boqItemsMap = new Map();
    }
    for (let boqItem of boqItems) {
      let _boqItem = { ...boqItem };
      let linkedBOQItems = boqItem.linkedBOQItems;
      _boqItem.linkedBOQItems = null;
      boqItemsMap.set(boqItem.uuid, _boqItem);

      if (linkedBOQItems?.length > 0) {
        boqItemsMap = this.convertBOQItemsToMaps(linkedBOQItems, boqItemsMap);
      }
    }

    return boqItemsMap;
  }

  setParentBOQItemToFlatView(
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
    parent: BOQItem,
    groupId: number,
    childBOQItems: Map<string, BOQItem[]>,
    boqSubItemsMap: Map<string, BOQSubItem[]>
  ) {
    let level = 0;
    flatNestedSpecificationItemView.push({
      type: 'ItemDescription',
      id: parent.id,
      uuid: parent.uuid,
      level,
      parentId: null,
      groupId,
      parentIsExpanded: true,
      nestedSpecificationItem: this.convertBOQItemToNestedSpecificationItem(
        parent,
        level
      ),
    });
    this.appendSpecifications(
      flatNestedSpecificationItemView,
      boqSubItemsMap,
      parent.uuid,
      level,
      groupId
    );
    this.appendChildren(
      flatNestedSpecificationItemView,
      childBOQItems,
      boqSubItemsMap,
      parent.uuid,
      level,
      groupId
    );
  }

  addSpecificationTableHeader(
    list: FlatNestedSpecificationItemView[],
    item: NestedSpecificationItem
  ) {
    list.push(this.getSpecificationHeader(item.uuid, item.level));
  }

  mergeOldItemsWithNewlySelectedItems(
    oldItems: FlatNestedSpecificationItemView[],
    newItems: FlatNestedSpecificationItemView[]
  ) {
    const oldItemsMap = this.convertItemViewToMap(oldItems);

    let editableSpecificationItemMatched = false;

    for (let i = 0; i < newItems.length; i++) {
      let newItem = newItems[i];

      if (
        newItem.type == 'ItemDescription' ||
        newItem.type == 'NestedSpecificationItem'
      ) {
        let oldItem = oldItemsMap.get(newItem.uuid);
        if (oldItem) {
          if (newItem.type == 'ItemDescription') {
            newItem.nestedSpecificationItem.total =
              oldItem.nestedSpecificationItem.total;
            newItem.nestedSpecificationItem.isSelected = true;
          }
          if (newItem.type == 'NestedSpecificationItem') {
            editableSpecificationItemMatched = true;
            newItem.editableSpecificationItem.total =
              oldItem.editableSpecificationItem.total;

            newItem.editableSpecificationItem.value =
              oldItem.editableSpecificationItem.value;

            newItem.editableSpecificationItem.unitRate =
              oldItem.editableSpecificationItem.unitRate;

            newItem.editableSpecificationItem.formula =
              oldItem.editableSpecificationItem.formula;

            newItem.editableSpecificationItem.isSelected = true;
          }
        }
      }
    }

    // TODO must be deleted
    // FOR BACKWARD COMPATIBILITY
    if (
      !editableSpecificationItemMatched &&
      oldItems.filter((item) => item.type == 'NestedSpecificationItem').length >
        0
    ) {
      newItems = this.mergeForItemsWhichWereNotSavingSourceUuid(
        oldItems,
        newItems
      );
    }
    return newItems;
  }

  mergeForItemsWhichWereNotSavingSourceUuid(
    oldItems: FlatNestedSpecificationItemView[],
    newItems: FlatNestedSpecificationItemView[]
  ) {
    const oldItemsMap = this.convertItemViewToMap(oldItems);

    for (let i = 0; i < newItems.length; i++) {
      let newItem = newItems[i];

      try {
        if (
          newItem.type == 'ItemDescription' ||
          newItem.type == 'NestedSpecificationItem'
        ) {
          const specsMatch = oldItems.filter(
            (item) =>
              item.type == 'NestedSpecificationItem' &&
              item.nestedSpecificationItem.description ==
                newItem.nestedSpecificationItem.description &&
              item.nestedSpecificationItem.code ==
                newItem.nestedSpecificationItem.code &&
              item.nestedSpecificationItem.level ==
                newItem.nestedSpecificationItem.level
          );

          if (specsMatch.length > 0) {
            newItem.editableSpecificationItem.total =
              specsMatch[0].editableSpecificationItem.total;

            newItem.editableSpecificationItem.value =
              specsMatch[0].editableSpecificationItem.value;

            newItem.editableSpecificationItem.unitRate =
              specsMatch[0].editableSpecificationItem.unitRate;

            newItem.editableSpecificationItem.isSelected = true;
          }

          if (newItem.type == 'ItemDescription') {
            let oldItem = oldItemsMap.get(newItem.uuid);
            newItem.nestedSpecificationItem.total =
              oldItem.nestedSpecificationItem.total;
            newItem.nestedSpecificationItem.isSelected = true;
          }
        }
      } catch (e) {}
    }

    return newItems;
  }

  convertItemViewToMap(
    items: FlatNestedSpecificationItemView[]
  ): Map<string, FlatNestedSpecificationItemView> {
    let map: Map<string, FlatNestedSpecificationItemView> = new Map();

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.type == 'ItemDescription') {
        map.set(item.nestedSpecificationItem.sourceUuid, item);
      }
      if (item.type == 'NestedSpecificationItem') {
        map.set(item.editableSpecificationItem.sourceUuid, item);
      }
    }

    return map;
  }

  _calculatePercentTotalByFormValue(
    sourceItem: EditableSpecificationItem,
    percentValue: number,
    item: EditableSpecificationItem
  ) {
    let _sourceItem = Object.assign({}, sourceItem);

    item.unitRate =
      isNaN(_sourceItem.unitRate) || isNaN(parseFloat(_sourceItem.value))
        ? null
        : _sourceItem.unitRate * parseFloat(_sourceItem.value);
    item.total = isNaN(_sourceItem.total)
      ? null
      : (_sourceItem.total * percentValue) / 100;

    return item;
  }

  calculatePercentTotalByFormValue(
    item: EditableSpecificationItem,
    sourceItem: EditableSpecificationItem,
    quantity: number
  ): EditableSpecificationItem {
    this._calculatePercentTotalByFormValue(sourceItem, quantity, item);

    item.value = isNaN(quantity) ? null : quantity.toString();

    return item;
  }

  getSpecificationHeader(
    parentId: string,
    parentLevel: number
  ): FlatNestedSpecificationItemView {
    return {
      type: 'NestedSpecificationTableHeader',
      id: 'header-' + parentId,
      uuid: 'header-' + parentId,
      level: parentLevel + 1,
      parentId: parentId,
      parentIsExpanded: true,
    };
  }

  getSpecificationFooter(
    parentId: string,
    parentLevel: number
  ): FlatNestedSpecificationItemView {
    return {
      type: 'NestedSpecificationFooter',
      id: 'footer-' + parentId,
      uuid: 'footer-' + parentId,
      level: parentLevel + 1,
      parentId: parentId,
      parentIsExpanded: true,
    };
  }

  addSpecifications(
    list: FlatNestedSpecificationItemView[],
    item: NestedSpecificationItem
  ) {
    if (item.specifications.length > 0) {
      this.addSpecificationTableHeader(list, item);
    }
    for (let specification of item.specifications) {
      this.addSpecificationItem(list, item, specification);
    }
    if (item.specifications.length > 0) {
      this.addSpecificationFooter(list, item);
    }
  }

  addSpecificationItem(
    list: FlatNestedSpecificationItemView[],
    item: NestedSpecificationItem,
    spacefication: EditableSpecificationItem
  ) {
    list.push({
      type: 'NestedSpecificationItem',
      id: item.id,
      uuid: item.uuid,
      level: item.level + 1,
      parentId: item.uuid,
      editableSpecificationItem: spacefication,
      parentIsExpanded: true,
    });
  }

  addSpecificationFooter(
    list: FlatNestedSpecificationItemView[],
    item: NestedSpecificationItem
  ) {
    list.push(this.getSpecificationFooter(item.parentId, item.level - 1));
  }
}
