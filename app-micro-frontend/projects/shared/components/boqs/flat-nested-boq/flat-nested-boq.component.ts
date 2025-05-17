import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  EditableSpecificationItem,
  FlatNestedSpecificationItemView,
  FlatNestedSpecificationItemViewChangeTypes,
  FlatNestedSpecificationItemViewType,
  ItemsStateCodes,
  NestedSpecificationItem,
} from '../../nested-specifications-builder/store/model';
import {
  SpecificationDescriptionEditorComponent,
  SpecificationDescriptionItemManagerDialogResults,
} from '../../nested-specifications-builder/specification-description-editor/specification-description-editor.component';
import {
  NestedSpecificationActionResults,
  NestedSpecificationsViewMode,
} from '../../nested-specifications-builder/group-item/group-item.component';
import {
  BOQSummarySums,
  BoqsService,
} from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs.service';
import {
  BOQsCompletionStatusChangeEvent,
  FilteredItem,
  NestedSpecificationsInfoBarComponent,
} from '../../nested-specifications-builder/nested-specifications-info-bar/nested-specifications-info-bar.component';
import {
  ExcelUploaderComponent,
  ExcelUploaderData,
} from '../../excel-uploader/excel-uploader.component';
import { SortingResults } from '../../nested-specifications-builder/flat-nested-specifications/flat-nested-specifications.component';
import { EditableSpecsItemSizes } from '../../nested-specifications-builder/editable-specs-table/editable-specs-item/editable-specs-item.component';
import {
  AddItemResults,
  NestedSpecificationChange,
  NestedSpecificationsService,
} from '../../nested-specifications-builder/nested-specifications.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BoqSummaryComponent } from '../boq-summary/boq-summary.component';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../../services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { debounce } from 'lodash';
import {
  SpecificationItemManagerDialogComponent,
  SpecificationItemManagerDialogResults,
} from '../../nested-specifications-builder/specification-item-manager-dialog/specification-item-manager-dialog.component';
import {
  ItemsSorterComponent,
  SortRequestData,
  SortResults,
} from '../../items-sorter/items-sorter.component';

@Component({
  selector: 'app-flat-nested-boq',
  templateUrl: './flat-nested-boq.component.html',
  styleUrls: ['./flat-nested-boq.component.scss'],
})
export class FlatNestedBoqComponent implements OnInit {
  @Input()
  viewMode: NestedSpecificationsViewMode = 'view';

  @Input()
  isExpandable = true;

  @Input()
  showBoqSummary = false;

  @Input()
  provisionSumPhysicalContingencyPercent: number;

  @Input()
  provisionSumVariationOfPricesPercent: number;

  @Input()
  vatRequired: boolean;

  @Output()
  onBoqSummarySumsChange = new EventEmitter<BOQSummarySums>();

  @Input()
  onBOQsCompletionStatusChange: (
    completionStatus: BOQsCompletionStatusChangeEvent
  ) => void;

  @Input()
  saveCustomSubBOQItemFunction: (
    item: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  saveParentFunction: (
    item: NestedSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  saveSpecificationFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  onItemChange: (
    change: NestedSpecificationChange
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  initialMode: NestedSpecificationsViewMode = 'view';

  @Input()
  addSpecificationText: string = 'Add Specification';

  @Input()
  saveFunction: Function;

  @Input()
  moveFunction: Function;

  @Output()
  onSelectBOQItemsClick: EventEmitter<FlatNestedSpecificationItemView> =
    new EventEmitter();

  @Output()
  onItemAdded: EventEmitter<FlatNestedSpecificationItemView> =
    new EventEmitter();

  @Output()
  onListUpdated: EventEmitter<FlatNestedSpecificationItemView[]> =
    new EventEmitter();

  @Input()
  deleteFunction: (
    args: NestedSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  excelUploaderData: ExcelUploaderData;

  @Input()
  editable;

  expandedItemId: string;

  editableSpecsItemSizes: EditableSpecsItemSizes = {
    codeWidth: 'w-36',
    descriptionWidth: '',
    unitOfMeasureWidth: 'w-44',
    quantityWidth: 'w-44',
    unitRateWidth: 'w-44',
    totalWidth: 'w-44',
  };

  @Input()
  deleteSpecificationFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  moveSpecificationFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  nestedSpecificationItems: NestedSpecificationItem[] = [];

  @Input()
  sortFunction: (
    items: FlatNestedSpecificationItemView[]
  ) => Promise<SortingResults>;

  @Input()
  refetchData: (itemToScrollToUuid: string) => void;

  @Input()
  showValueColumn: boolean = true;

  @Input()
  showUnitOfMeasureColumn: boolean = true;

  @Input()
  showCodeOrSNColumn: boolean = false;

  @Input()
  showUnitRateColumn: boolean = false;

  @Input()
  showTotalColumn: boolean = false;

  @Input()
  canAddSpecs: boolean = false;

  @Input()
  flatNestedSpecificationItemsView: FlatNestedSpecificationItemView[] = [];

  itemSize = 60;
  heightOffset = 30;
  height = 600;

  updated = true;

  show = true;

  isSorting = false;

  itemsUpdated = false;
  currentEditingItem: NestedSpecificationItem = null;
  currentFocusedEditingItem: EditableSpecificationItem = null;
  currentGroupEditingGroupId: number = null;
  currentEditingSpecificationItem: EditableSpecificationItem = null;

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  itemsListViewPort: CdkVirtualScrollViewport;

  @ViewChild('infoBar')
  infoBar: NestedSpecificationsInfoBarComponent;

  @ViewChild('itemElement') itemElementRef: ElementRef;
  @ViewChild('boqSummaryComponent') boqSummaryComponent: BoqSummaryComponent;

  private documentClickListener!: (event: MouseEvent) => void;

  currentExpandedParentUuid: string = null;
  currentExpandedParentGroupId: number = null;

  scrolledToTop = false;

  lastViewPortScrolPosition = 0;

  topPosition = 0;

  itemChangeDebounceSeconds = 1 * 1000;

  changeSubscription: Subscription;

  constructor(
    private nestedSpecificationsService: NestedSpecificationsService,
    private settingsService: SettingsService,
    public dialog: MatDialog,
    public boqsService: BoqsService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.show = true;
    }, 500);

    this.changeSubscription = this.nestedSpecificationsService
      .getChange()
      .subscribe((change: NestedSpecificationChange) => {
        this.onItemChanges(change);
      });
  }

  onItemChanges(change: NestedSpecificationChange) {
    if (this.onItemChange) {
      if (
        change.changeType == FlatNestedSpecificationItemViewChangeTypes.REFRESH
      ) {
        this.flatNestedSpecificationItemsView = change.items;
        this.calculateTotal();
      }
      NestUtils.debounce(() => {
        this.onItemChange(change);
      }, this.itemChangeDebounceSeconds);
    }
  }

  filterItemsToShow(
    items: FlatNestedSpecificationItemView[]
  ): FlatNestedSpecificationItemView[] {
    return items.filter((item) => item.level == 0 || item.parentIsExpanded);
  }

  _onBoqSummarySumsChange($event) {
    if (this._onBoqSummarySumsChange) {
      this.onBoqSummarySumsChange.emit($event);
    }
  }

  async getBOQSummarySums(): Promise<BOQSummarySums> {
    return await this.boqSummaryComponent.calculateItemsTotal();
  }

  ngAfterViewInit() {
    this.initialExampansion();

    this.setInitialTopPosition();

    setTimeout(() => {
      this.setHeightToFit();
    }, 200);

    this.initSearchResultsListners();
  }

  setInitialTopPosition() {
    const virtualScrollWrapper = document.getElementById(
      'flat-nested-specification'
    );
    this.topPosition = virtualScrollWrapper.getBoundingClientRect().top;
  }

  debouncedScroll = debounce(() => {
    if (this.initialMode == 'select') {
      return;
    }

    const offset = 0;
    const parentElement = document.getElementById(
      'shared-layout-content-wrapper'
    );
    const submissionProgressBar = document.getElementById(
      'submission-progress-bar'
    );
    const childElement = document.getElementById('flat-nested-specification');
    const distance =
      childElement.getBoundingClientRect().top -
      parentElement.getBoundingClientRect().top;

    const parentScrollableWrapper = document.getElementById('content_wrapper');

    const viewPortOffset = this.itemsListViewPort.measureScrollOffset();

    if (viewPortOffset > 0 && distance > offset) {
      parentScrollableWrapper.scrollTo({
        top: distance - offset,
        behavior: 'smooth',
      });
    }
  }, 100);

  onViewportScroll(event: any) {
    this.debouncedScroll();
  }

  exportData() {
    this.boqsService.exportBOQsToExcel(
      this.flatNestedSpecificationItemsView,
      this.provisionSumPhysicalContingencyPercent,
      this.provisionSumVariationOfPricesPercent,
      this.vatRequired,
      null
    );
  }

  getScrollDirection(viewPortOffset: number) {
    const offsetDiff = this.lastViewPortScrolPosition - viewPortOffset;
    this.lastViewPortScrolPosition = viewPortOffset;

    let direction = 'down';

    if (offsetDiff < 0) {
      direction = 'up';
    }
    return direction;
  }

  selectBOQItems(flatNestedSpecificationItem: FlatNestedSpecificationItemView) {
    this.onSelectBOQItemsClick.emit(flatNestedSpecificationItem);
  }

  setHeightToFit() {
    const wrapperElement = document.querySelector(
      '#flat-nested-specification .cdk-virtual-scroll-content-wrapper'
    );

    let itemsToShow = this.filterItemsToShow(
      this.flatNestedSpecificationItemsView
    );

    let itemsToShowToRemove = itemsToShow.filter(
      (item) => item.type == 'NestedSpecificationFooter'
    );

    let totalItemsToShow = itemsToShow.length - itemsToShowToRemove.length;

    const windowHeight = window.innerHeight;
    let heightToSet = totalItemsToShow * this.itemSize;

    if (wrapperElement) {
      if (heightToSet > windowHeight) {
        heightToSet = windowHeight - 125;
      }

      this.height = heightToSet + this.heightOffset;
    }
  }

  public getCompletionStatus = (): BOQsCompletionStatusChangeEvent => {
    return this.infoBar.getCompletionStatus();
  };

  initSearchResultsListners() {
    if (!this.documentClickListener) {
      this.documentClickListener = (event: MouseEvent) => {
        const clickedElement = event.target as HTMLElement;
        this.unSelectCurrentItem(clickedElement);
      };
      document.addEventListener('click', this.documentClickListener);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.documentClickListener);
    this.changeSubscription.unsubscribe();
  }

  resetView() {
    this.show = false;
  }

  initialExampansion() {
    if (!this.isExpandable || this.initialMode == 'tendererEditing') {
      this.expandAll(true);
    } else {
      this.expandByParentUuid();
    }
  }

  collapseDescriptionFunction = (itemUuid: string) => {
    let item = this.flatNestedSpecificationItemsView.filter(
      (item) => item.uuid == itemUuid
    )[0];
    item.editableSpecificationItem.showFullDescription =
      !item.editableSpecificationItem.showFullDescription;
  };

  goToIncompleteItem(incompleteEditableItem: FilteredItem) {
    if (incompleteEditableItem.type != 'GroupItem') {
      let parentUuid = incompleteEditableItem.parents[0].uuid;
      this.expandByParentUuid(parentUuid, incompleteEditableItem.groupId, true);
    }

    setTimeout(() => {
      this.scrollToItemByUuid(incompleteEditableItem.uuid);
    }, 200);
  }

  scrollToItemByUuid(uuid: string, groupId: number = null) {
    const items = this.filterItemsToShow(this.flatNestedSpecificationItemsView);
    const itemIndex = items.findIndex((item) => item.uuid === uuid);

    this.currentFocusedEditingItem = this.flatNestedSpecificationItemsView.find(
      (item) => item.uuid == uuid
    ).editableSpecificationItem;

    if (itemIndex !== -1) {
      this.itemsListViewPort.scrollToIndex(itemIndex);
      const element = this.itemElementRef.nativeElement.querySelector(
        `#v-item-${uuid}`
      );
      if (element) {
        element.scroll({
          top: element.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }

  unSelectCurrentItem(clickedElement: HTMLElement) {
    if (
      clickedElement.classList.contains('add_button') ||
      clickedElement.closest('.my-class')
    ) {
      return;
    }
    let targetRowId =
      this.currentEditingItem?.rowId ||
      this.currentEditingSpecificationItem?.rowId;

    if (targetRowId) {
      let targetId = '#v-item-' + targetRowId;

      if (clickedElement.closest(targetId) == null) {
        if (this.currentEditingItem) {
          if (this.currentEditingItem?.isNew) {
            this.onItemRemove(this.currentEditingItem.rowId);
          }
        }

        if (this.currentEditingSpecificationItem) {
          if (this.currentEditingSpecificationItem?.isNew) {
            this.onItemRemove(this.currentEditingSpecificationItem.rowId);
          }
        }

        this.currentEditingItem = null;
        this.currentEditingSpecificationItem = null;
      }
    }
  }

  onItemSaved = (details: { rowId: string; uuid: string; id: any }) => {
    const indexToUpdate = this.flatNestedSpecificationItemsView.findIndex(
      (item) => item.uuid === details.rowId
    );

    if (indexToUpdate !== -1) {
      let savedItem = this.flatNestedSpecificationItemsView[indexToUpdate];
      savedItem.isNew = false;
      savedItem.id = details.id;
      savedItem.uuid = details.uuid;
      savedItem.nestedSpecificationItem.rowId = details.uuid;
      savedItem.nestedSpecificationItem.id = details.id;
      savedItem.nestedSpecificationItem.uuid = details.uuid;

      this.updateView(this.flatNestedSpecificationItemsView, savedItem);
    }
  };

  onEditableSpecificationItemSaved = (details: {
    rowId: string;
    uuid: string;
    id: any;
  }) => {
    const indexToUpdate = this.flatNestedSpecificationItemsView.findIndex(
      (item) => item.uuid === details.rowId
    );
    if (indexToUpdate !== -1) {
      let savedItem = this.flatNestedSpecificationItemsView[indexToUpdate];
      savedItem.isNew = false;
      savedItem.id = details.id;
      savedItem.uuid = details.uuid;
      savedItem.editableSpecificationItem.rowId = details.uuid;
      savedItem.editableSpecificationItem.id = details.id;
      savedItem.editableSpecificationItem.uuid = details.uuid;
      this.updateView(this.flatNestedSpecificationItemsView, savedItem);
    }
  };

  onItemEditing = (item: NestedSpecificationItem, groupId: number) => {
    this.currentEditingItem = { ...item };
    this.currentGroupEditingGroupId = groupId;
  };

  onSpecificationItemEditing = (
    item: EditableSpecificationItem,
    groupId: number
  ) => {
    this.currentGroupEditingGroupId = groupId;
    this.currentEditingSpecificationItem = { ...item };
  };

  onDescriptionItemSelection = (
    item: NestedSpecificationItem,
    isSelected: boolean
  ) => {
    this.setSelected(item, this.flatNestedSpecificationItemsView, isSelected);

    this.setParentsSelected(
      item,
      this.flatNestedSpecificationItemsView,
      isSelected
    );
  };

  onEditableItemSelection = (
    item: EditableSpecificationItem,
    isSelected: boolean
  ) => {
    this.setSelected(item, this.flatNestedSpecificationItemsView, isSelected);
    this.setParentsSelected(
      item,
      this.flatNestedSpecificationItemsView,
      isSelected
    );
  };

  getAllSelectedParentsAndTheirChildren(): Map<string, string[]> {
    let selectedParents: Map<string, string[]> = new Map();
    for (let i = 0; i < this.flatNestedSpecificationItemsView.length; i++) {
      let item = this.flatNestedSpecificationItemsView[i];
      if (item?.nestedSpecificationItem) {
        selectedParents.set(
          item.uuid,
          this.flatNestedSpecificationItemsView
            .filter(
              (child) =>
                child.parentId == item.uuid &&
                (child?.nestedSpecificationItem?.isSelected ||
                  child?.editableSpecificationItem?.isSelected)
            )
            ?.map((item) => item.uuid)
        );
      }
    }
    return selectedParents;
  }

  refreshView() {
    this.updateView(this.flatNestedSpecificationItemsView, null);
  }

  updateInfoBar() {
    this.infoBar.updateView();
  }

  updateView(
    items: FlatNestedSpecificationItemView[],
    updatedItem: FlatNestedSpecificationItemView = null,
    scrollToParent = true
  ) {
    this.flatNestedSpecificationItemsView = [...items];
    const targetIndex = this.flatNestedSpecificationItemsView.findIndex(
      (item) => item.uuid === updatedItem?.uuid
    );

    if (targetIndex != -1) {
      let item = this.flatNestedSpecificationItemsView[targetIndex];

      if (item.editableSpecificationItem?.isNew !== false) {
        item.editableSpecificationItem.isNew = true;
      }

      if (item.nestedSpecificationItem) {
        item.nestedSpecificationItem.isNew = true;
      }

      this.expandByParentUuid(
        this.currentExpandedParentUuid,
        this.currentExpandedParentGroupId,
        true
      );
    }
    this.infoBar?.updateView();

    if (scrollToParent) {
      setTimeout(() => {
        this.itemsListViewPort.scrollToIndex(targetIndex);
      }, 200);
    }
  }

  setSelected(
    item: NestedSpecificationItem | EditableSpecificationItem,
    items: FlatNestedSpecificationItemView[],
    isSelected: boolean
  ) {
    for (let i = 0; i < items.length; i++) {
      if (item.rowId == items[i].parentId) {
        if (items[i].type == 'ItemDescription') {
          items[i].nestedSpecificationItem.isSelected = isSelected;
          this.setSelected(items[i].nestedSpecificationItem, items, isSelected);
        }
        if (items[i].type == 'NestedSpecificationItem') {
          items[i].editableSpecificationItem.isSelected = isSelected;
        }
      }
    }
  }

  setParentsSelected(
    item: NestedSpecificationItem | EditableSpecificationItem,
    items: FlatNestedSpecificationItemView[],
    isSelected: boolean
  ) {
    let parentId = item.parentId;
    while (parentId) {
      const parent = items.find((i) => i.uuid === parentId);
      if (!parent) {
        break;
      }
      const hasSelectedDescendant = items.some(
        (i) =>
          i.parentId === parent.uuid &&
          (i.editableSpecificationItem?.isSelected ||
            i.nestedSpecificationItem?.isSelected)
      );

      if (isSelected) {
        parent.nestedSpecificationItem.isSelected = true;
      } else {
        if (!hasSelectedDescendant) {
          parent.nestedSpecificationItem.isSelected = false;
        }
      }
      parentId = parent.nestedSpecificationItem?.parentId;
    }
  }

  import(parentUuid: string) {
    if (this.excelUploaderData) {
      this.excelUploaderData.identifier = parentUuid;
      let dialogRef = this.dialog.open(ExcelUploaderComponent, {
        width: '600px',
        data: this.excelUploaderData,
      });
      dialogRef?.afterClosed().subscribe((data: any) => { });
    }
  }

  addSpecsFromFooter(item: FlatNestedSpecificationItemView) {
    let parent: FlatNestedSpecificationItemView =
      this.flatNestedSpecificationItemsView.filter(
        (listItem) => listItem.uuid == item.parentId
      )[0];

    parent.nestedSpecificationItem.level = item.level;
    this.onMenuAction({
      action: 'add_specifications',
      item: parent.nestedSpecificationItem,
      groupId: item.groupId,
    });
  }

  addCustomDescription = (item: FlatNestedSpecificationItemView) => {
    let id = this.settingsService.makeId();

    let itemToAdd: EditableSpecificationItem = {
      description: '',
      code: '',
      level: item.level,
      parentId: item.parentId,
      rowId: id,
    };

    let dialogRef = this.dialog.open(SpecificationItemManagerDialogComponent, {
      width: '600px',
      data: {
        item: itemToAdd,
        saveFunction: this.saveCustomSubBOQItemFunction,
      },
    });

    dialogRef
      ?.afterClosed()
      .subscribe((data: SpecificationItemManagerDialogResults) => {
        if (data.isSuccessful) {
          let addedItem = this.nestedSpecificationsService.addSpecification(
            this.flatNestedSpecificationItemsView,
            data.item,
            item.groupId
          );
          this.doOnItemChanges(addedItem.editableSpecificationItem);
        }
      });
  };

  addNewSpecification = (item: FlatNestedSpecificationItemView) => {
    let id = this.settingsService.makeId();

    let itemToAdd: EditableSpecificationItem = {
      description: '',
      code: '',
      level: item.level,
      parentId: item.uuid,
      rowId: id,
    };

    let dialogRef = this.dialog.open(SpecificationItemManagerDialogComponent, {
      width: '600px',
      data: {
        item: itemToAdd,
        saveFunction: this.saveSpecificationFunction,
      },
    });

    dialogRef
      ?.afterClosed()
      .subscribe((data: SpecificationItemManagerDialogResults) => {
        if (data.isSuccessful) {
          let addedItem = this.nestedSpecificationsService.addSpecification(
            this.flatNestedSpecificationItemsView,
            data.item,
            item.groupId
          );
          this.doOnItemChanges(addedItem.editableSpecificationItem);
        }
      });
  };

  editSpecificationItem = (
    item: EditableSpecificationItem,
    groupId: number = null
  ) => {
    let itemIndex = this.flatNestedSpecificationItemsView.findIndex(
      (specsItemView) =>
        specsItemView?.editableSpecificationItem?.uuid === item.uuid
    );

    let dialogRef = this.dialog.open(SpecificationItemManagerDialogComponent, {
      width: '600px',
      data: {
        item,
        saveFunction: this.saveCustomSubBOQItemFunction
          ? this.saveCustomSubBOQItemFunction
          : this.saveSpecificationFunction,
      },
    });

    dialogRef
      ?.afterClosed()
      .subscribe((data: SpecificationItemManagerDialogResults) => {
        if (data) {
          if (data.isSuccessful) {
            this.flatNestedSpecificationItemsView[itemIndex] = {
              ...this.flatNestedSpecificationItemsView[itemIndex],
              editableSpecificationItem: {
                ...this.flatNestedSpecificationItemsView[itemIndex]
                  .editableSpecificationItem,
                ...data.item,
              },
            };
            this.doOnItemChanges(
              this.flatNestedSpecificationItemsView[itemIndex]
                .editableSpecificationItem
            );
          }
        }
      });
  };

  onViewItemsFilter = (
    filter_type: string,
    selectedItemUuid: string
  ): FlatNestedSpecificationItemView[] => {
    let filterResults: FlatNestedSpecificationItemView[] = [];

    switch (filter_type) {
      case 'get_child_views':
        filterResults = this.flatNestedSpecificationItemsView.filter(
          (item) =>
            item.parentId == selectedItemUuid &&
            item.type != 'NestedSpecificationFooter' &&
            item.type != 'NestedSpecificationTableHeader'
        );
        break;
    }

    return filterResults;
  };

  onMenuAction = (payload: {
    action: string;
    item: NestedSpecificationItem;
    groupId: number;
  }) => {
    let addedItem: FlatNestedSpecificationItemView = null;
    let addItemResults: AddItemResults = null;

    switch (payload.action) {
      case 'add_sub_item':
        this.addPatentSubItem(payload.item);
        break;

      case 'add_specifications':
        var parent: FlatNestedSpecificationItemView =
          this.flatNestedSpecificationItemsView.filter(
            (listItem) => listItem.uuid == payload.item.uuid
          )[0];

        this.addNewSpecification(parent);
        break;

      case 'import_specifications':
        var parent: FlatNestedSpecificationItemView =
          this.flatNestedSpecificationItemsView.filter(
            (listItem) => listItem.uuid == payload.item.uuid
          )[0];

        this.import(parent.uuid);
        break;

      case 'delete_item':
        this.flatNestedSpecificationItemsView =
          this.flatNestedSpecificationItemsView.filter(
            (item) => item.uuid !== payload.item.rowId
          );

        this.flatNestedSpecificationItemsView =
          this.flatNestedSpecificationItemsView.filter(
            (item) => item.parentId !== payload.item.uuid
          );
        break;
    }
    this.updateChanges(addedItem);
  };

  onExpand(item: NestedSpecificationItem, groupId: number) {
    this.resetCurrentItem();

    this.expandByParentUuid(item.uuid, groupId);
  }

  resetCurrentItem() {
    this.currentEditingItem = null;
    this.currentGroupEditingGroupId = null;
    this.currentEditingSpecificationItem = null;
  }

  expandByParentUuid(
    parentUuid: string = null,
    groupId: number = null,
    forceExpand = false
  ) {
    if (this.isExpandable) {
      if (parentUuid) {
        this.currentExpandedParentUuid = parentUuid;
        this.currentExpandedParentGroupId = groupId;
        let expand = !this.flatNestedSpecificationItemsView.filter(
          (item) =>
            item.uuid == this.currentExpandedParentUuid &&
            item.groupId == groupId
        )[0].parentIsExpanded;

        if (forceExpand) {
          expand = true;
        }

        this.expandAll(false);

        const expandedItems: any[] = [];

        const stack: any[] = this.flatNestedSpecificationItemsView.filter(
          (item) =>
            item.uuid == this.currentExpandedParentUuid &&
            item.groupId == groupId
        );

        while (stack.length > 0) {
          const currentItem = stack.pop();
          currentItem.parentIsExpanded = expand;
          expandedItems.push(currentItem.uuid);
          stack.push(
            ...this.flatNestedSpecificationItemsView.filter(
              (item) =>
                item.parentId == currentItem.uuid && item.groupId == groupId
            )
          );
        }

        setTimeout(() => {
          this.setHeightToFit();
          this.scrollToItemByUuid(parentUuid, groupId);
        }, 100);
      } else {
        this.expandAll(false);
      }
    }
  }

  expandAll(expand = true) {
    this.flatNestedSpecificationItemsView =
      this.flatNestedSpecificationItemsView.map((item) => ({
        ...item,
        parentIsExpanded: expand,
      }));

    this.setHeightToFit();
  }

  onItemRemove = (itemId: string) => {
    this.flatNestedSpecificationItemsView =
      this.flatNestedSpecificationItemsView.filter(
        (item) => item.uuid !== itemId
      );
    this.doOnItemChanges();
  };

  sortParents() {
    this.sortItems({
      parentId: null,
      description: 'Sort parent items',
      type: 'ItemDescription',
    });
  }

  sortItems(request: {
    parentId: string;
    description: string;
    type: FlatNestedSpecificationItemViewType;
  }) {
    const children = this.flatNestedSpecificationItemsView.filter(
      (item) => item.parentId == request.parentId && item.type == request.type
    );

    const uniqueChildren = Array.from(
      new Set(children.map((item) => JSON.stringify(item)))
    ).map((itemString) => JSON.parse(itemString));

    let sortRequestData: SortRequestData = {
      title: request.description,
      fields: {
        id: 'uuid',
        weight: 'weight',
        text: (item: FlatNestedSpecificationItemView) =>
          item.type == 'ItemDescription'
            ? (item.nestedSpecificationItem.code
              ? item.nestedSpecificationItem.code + ': '
              : '') + item.nestedSpecificationItem.description
            : (item.editableSpecificationItem.code
              ? item.editableSpecificationItem.code + '. '
              : '') + item.editableSpecificationItem.description,
      },
      items: uniqueChildren,
    };

    const dialogRef = this.dialog.open(ItemsSorterComponent, {
      width: '70%',
      data: sortRequestData,
    });

    dialogRef.afterClosed().subscribe((result: SortResults) => {
      if (result.sorted) {
        this.doSorting(result.sortedItems);
      }
    });
  }

  async doSorting(items: FlatNestedSpecificationItemView[]) {
    this.isSorting;

    if (this.sortFunction) {
      let res = await this.sortFunction(items);
      this.isSorting = false;
      if (res.success) {
        if (this.refetchData) {
          this.refetchData(items[0].parentId);
        }
      }
    }
  }

  getPercentItemSource = (
    itemUuid: string,
    sourceId: string,
    groupId: number
  ): EditableSpecificationItem => {
    let results: EditableSpecificationItem = null;
    for (let i = 0; i < this.flatNestedSpecificationItemsView.length; i++) {
      if (
        this.flatNestedSpecificationItemsView[i].type ==
        'NestedSpecificationItem' &&
        (this.flatNestedSpecificationItemsView[i].uuid == sourceId ||
          this.flatNestedSpecificationItemsView[i].editableSpecificationItem
            .sourceUuid == sourceId) &&
        this.flatNestedSpecificationItemsView[i].editableSpecificationItem
          .value != null &&
        this.flatNestedSpecificationItemsView[i].groupId == groupId &&
        this.flatNestedSpecificationItemsView[i].uuid != itemUuid
      ) {
        results =
          this.flatNestedSpecificationItemsView[i].editableSpecificationItem;
        break;
      }
    }
    return results;
  };

  getPercentItemChild = (sourceId: string): EditableSpecificationItem => {
    let results: EditableSpecificationItem = null;
    for (let i = 0; i < this.flatNestedSpecificationItemsView.length; i++) {
      if (
        this.flatNestedSpecificationItemsView[i].type ==
        'NestedSpecificationItem' &&
        (this.flatNestedSpecificationItemsView[i].uuid == sourceId ||
          this.flatNestedSpecificationItemsView[i].editableSpecificationItem
            .sourceUuid == sourceId) &&
        this.flatNestedSpecificationItemsView[i].editableSpecificationItem
          .value != null
      ) {
        results =
          this.flatNestedSpecificationItemsView[i].editableSpecificationItem;
        break;
      }
    }
    return results;
  };

  calculateTotal = (
    sourceItem: EditableSpecificationItem = null,
    groupId: number = null
  ) => {
    this.doOnItemChanges(sourceItem, groupId);
  };

  doOnItemChanges(
    sourceItem: EditableSpecificationItem = null,
    groupId: number = null
  ) {
    if (sourceItem) {
      this.calculatePercentageValueForReferringItems(sourceItem, groupId);
    }

    if (groupId) {
      this.nestedSpecificationsService.calculateTotals(
        this.flatNestedSpecificationItemsView,
        groupId
      );
    } else {
      let groupIds = Array.from(
        this.flatNestedSpecificationItemsView,
        (item) => item.groupId
      );
      let uniqueGroupIds = Array.from(new Set(groupIds));

      for (let groupId of uniqueGroupIds) {
        let groupItems = this.flatNestedSpecificationItemsView.filter(
          (items) => items.groupId == groupId
        );
        this.nestedSpecificationsService.calculateTotals(groupItems, groupId);
      }
    }
    this.infoBar?.updateView();
    this.onTotalCalculated({
      changeType: FlatNestedSpecificationItemViewChangeTypes.UPDATE,
      item: sourceItem,
    });
  }

  calculatePercentageValueForReferringItems(
    sourceItem: EditableSpecificationItem,
    groupId: number
  ) {
    let referringFields = this.flatNestedSpecificationItemsView.filter(
      (item) =>
        item?.editableSpecificationItem?.formula?.inputFields.filter(
          (field) => field.itemId == sourceItem.sourceUuid
        ).length > 0 && item.groupId == groupId
    );

    for (let referringField of referringFields) {
      this.nestedSpecificationsService.calculatePercentTotalByFormValue(
        referringField.editableSpecificationItem,
        sourceItem,
        parseFloat(referringField.editableSpecificationItem.value)
      );
    }
  }

  async onTotalCalculated(change: NestedSpecificationChange) {
    if (this.onItemChange) {
      let results = await this.onItemChange(change);

      if (results) {
        if (results.isSuccessful) {
          this.nestedSpecificationsService.updateItemState(
            change.item,
            ItemsStateCodes.SUCCESS,
            'Item saved'
          );
        } else {
          this.nestedSpecificationsService.updateItemState(
            change.item,
            ItemsStateCodes.SAVE_ERROR,
            'Failed to save item'
          );
        }
      }
    }
  }

  blankSpecs(parentId: string = null): EditableSpecificationItem {
    return {
      isNew: true,
      code: '',
      description: '',
      isEditable: true,
      parentId,
      rowId: this.settingsService.makeId(),
    };
  }

  addSpecification(parentItem: NestedSpecificationItem) {
    if (parentItem.specifications) {
      parentItem.specifications.push(this.blankSpecs(parentItem.rowId));
    } else {
      parentItem['specifications'] = [this.blankSpecs(parentItem.rowId)];
    }
  }

  editParentItem(item: EditableSpecificationItem) {
    let dialogRef = this.dialog.open(SpecificationDescriptionEditorComponent, {
      width: '600px',
      data: {
        item,
        saveFunction: this.saveParentFunction,
      },
    });

    dialogRef
      ?.afterClosed()
      .subscribe((data: SpecificationDescriptionItemManagerDialogResults) => {
        if (data) {
          if (data.isSuccessful) {
            let index = this.flatNestedSpecificationItemsView.findIndex(
              (item) => item.uuid == data.item.uuid
            );

            this.flatNestedSpecificationItemsView[index] = {
              ...this.flatNestedSpecificationItemsView[index],
              nestedSpecificationItem: {
                ...data.item,
              },
            };

            this.updateChanges(this.flatNestedSpecificationItemsView[index]);
          }
        }
      });
  }

  addPatentSubItem(source: NestedSpecificationItem) {

    let parent = this.flatNestedSpecificationItemsView.find(
      (item) => item.uuid == source.uuid
    );
    let parentIndex = this.flatNestedSpecificationItemsView.findIndex(
      (item) => item.uuid == source.uuid
    );
    this.addParentItem(
      parentIndex,
      'after',
      parent.nestedSpecificationItem.level + 1,
      parent.uuid
    );
  }

  addParentItem = (
    currentPos: number,
    direction: 'after' | 'before',
    level = 0,
    parentId = null
  ) => {
    let itemToAdd: NestedSpecificationItem = {
      description: '',
      code: '',
      level,
      isEditable: false,
      parentId: parentId,
    };

    let dialogRef = this.dialog.open(SpecificationDescriptionEditorComponent, {
      width: '600px',
      data: {
        item: itemToAdd,
        saveFunction: this.saveParentFunction,
      },
    });

    dialogRef
      ?.afterClosed()
      .subscribe((data: SpecificationDescriptionItemManagerDialogResults) => {
        if (data) {
          if (data.isSuccessful) {
            let itemToAdd = {
              isNew: false,
              level,
              code: data.item.code,
              description: data.item.description,
              parentId,
              children: [],
              specifications: [],
              isEditable: false,
              rowId: data.item.rowId,
              uuid: data.item.uuid,
              id: data.item.id as number,
            };
            let addItemResults = null;
            if (currentPos == -1) {
              addItemResults = this.nestedSpecificationsService.addItem(
                this.flatNestedSpecificationItemsView,
                itemToAdd
              );
            } else {
              addItemResults = this.nestedSpecificationsService.addItem(
                this.flatNestedSpecificationItemsView,
                itemToAdd,
                parentId
              );
            }
            this.updateChanges(addItemResults.addedItem);
          }
        }
      });
  };

  blankItem(parentId = null, level = 0): NestedSpecificationItem {
    let id = this.settingsService.makeId();
    return {
      isNew: true,
      level,
      code: '',
      description: '',
      parentId,
      children: [],
      specifications: [],
      isEditable: true,
      rowId: id,
    };
  }

  updateChanges(updatedItem: FlatNestedSpecificationItemView = null) {
    this.flatNestedSpecificationItemsView = [
      ...this.flatNestedSpecificationItemsView,
    ];

    //

    setTimeout(() => {
      this.setHeightToFit();
    }, 500);

    //this.onListUpdated.emit(this.flatNestedSpecificationItemsView);

    this.doOnItemChanges();
  }
}
