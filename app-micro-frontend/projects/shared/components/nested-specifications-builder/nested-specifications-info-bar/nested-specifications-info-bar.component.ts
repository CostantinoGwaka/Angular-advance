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
import { colors } from 'src/app/shared/colors';
import { NestedSpecificationsViewMode } from '../group-item/group-item.component';
import { CircularProgressBarComponent } from '../../circular-progress-bar/circular-progress-bar.component';
import { Subscription } from 'rxjs';
import {
  NestedSpecificationChange,
  NestedSpecificationsService,
} from '../nested-specifications.service';
import {
  EditableSpecificationItem,
  FlatNestedSpecificationItemView,
  FlatNestedSpecificationItemViewType,
  FormulaNames,
  ItemsStateCodes,
} from '../store/model';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';


export interface FilteredItem {
  uuid: string;
  groupId: number;
  type: FlatNestedSpecificationItemViewType;
  itemDescription: string;
  parentBreadCrumb: string;
  parents: FlatNestedSpecificationItemView[];
  incompleteReasons?: string[];
}

export interface BOQsCompletionStatusChangeEvent {
  isCompleted: boolean;
  completedItems: number;
  inCompleteItems: number;
  inCompleteMainItems: number;
  totalItems: number;
  totalMainItems: number;
  fillableItemsPercentProgress: number;
  mainItemsPercentProgress: number;
  percentProgress: number;
}

@Component({
  selector: 'app-nested-specifications-info-bar',
  templateUrl: './nested-specifications-info-bar.component.html',
  styleUrls: ['./nested-specifications-info-bar.component.scss'],
  standalone: true,
  imports: [
    CircularProgressBarComponent,
    MatRippleModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf
  ],
})
export class NestedSpecificationsInfoBarComponent implements OnInit {
  colors = colors;

  @Input()
  viewMode: NestedSpecificationsViewMode = 'view';

  @Input()
  items: FlatNestedSpecificationItemView[] = [];

  @Input() showUnitRateColumn: boolean = true;

  @Input()
  onBOQsCompletionStatusChange: (
    completionStatus: BOQsCompletionStatusChangeEvent
  ) => void;

  @Input()
  getPercentItemSource: (
    itemUuid: string,
    sourceId: string,
    groupId: number
  ) => EditableSpecificationItem;

  @Output()
  onGoToItem: EventEmitter<FilteredItem> = new EventEmitter();

  @Output()
  exportData: EventEmitter<FilteredItem> = new EventEmitter();

  fillableItems: FlatNestedSpecificationItemView[] = [];
  unfilledItems: FlatNestedSpecificationItemView[] = [];
  unfilledMainItems: FlatNestedSpecificationItemView[] = [];

  isCompleted = false;

  boqsFillingCompletionStatus: BOQsCompletionStatusChangeEvent = {
    isCompleted: false,
    completedItems: 0,
    inCompleteMainItems: 0,
    inCompleteItems: 0,
    totalItems: 0,
    percentProgress: 0,
    totalMainItems: 0,
    fillableItemsPercentProgress: 0,
    mainItemsPercentProgress: 0,
  };

  completedItems: number = 0;
  inCompleteItems: number = 0;
  inCompleteMainItems: number = 0;
  totalItems: number = 0;
  percentProgress: number = 0;
  totalMainItems: number = 0;
  fillableItemsPercentProgress: number = 0;
  mainItemsPercentProgress: number = 0;

  filteredItems: FilteredItem[] = [];

  @ViewChild('progressBar')
  progressBar: CircularProgressBarComponent;

  @ViewChild('filterResults')
  filterResults!: ElementRef;

  parentItems: Map<string, FlatNestedSpecificationItemView>;

  showIncompleteItems = false;
  showSearchResults = false;

  searchKeyword = null;

  debounceTimerId: any;

  private documentClickListener!: (event: any) => void;

  changeSubscription: Subscription;

  constructor(
    private nestedSpecificationsService: NestedSpecificationsService
  ) { }

  ngOnInit(): void {
    this.changeSubscription = this.nestedSpecificationsService
      .getChange()
      .subscribe((change: NestedSpecificationChange) => {
        this.onItemChanges(change);
      });

    this.updateView();
    this.setBOQsFillingCompletionStatus();
  }

  onItemChanges(change: NestedSpecificationChange) {
    if (change?.items) {
      this.items = change.items;
    }
    this.updateView();
  }

  isTenderEditingViewMode() {
    return this.viewMode == 'tendererEditing';
  }

  _exportData() {
    if (this.exportData) {
      this.exportData.emit();
    }
  }

  verifyItems() {
    if (this.viewMode == 'manage') {
      return;
    }

    this.fillableItems = this.items.filter(
      (item) => item.type == 'NestedSpecificationItem'
    );

    for (let i = 0; i < this.fillableItems.length; i++) {
      let itemIsFullyFilled = true;
      let hasProvisionalSumError = false;
      let hasPercentUnitOfMeasureButHasNoFormula = false;
      let hasPercentFormulaButHasNoReferringItemError = false;
      let hasZeroTotalError = false;
      let hasTotalLessThanZeroError = false;
      let itemHasSaveErrorState = false;
      let itemIsLoading = false;
      let itemWaitingToSave = false;

      let item = this.fillableItems[i];

      let unitRate =
        parseFloat(item.editableSpecificationItem?.unitRate?.toString()) ||
        null;
      let total =
        parseFloat(item.editableSpecificationItem?.total?.toString()) || null;

      let value = parseFloat(item.editableSpecificationItem?.value?.toString());

      //If item is not filled
      if (unitRate == null || total == null || value == null) {
        itemIsFullyFilled = false;
      }

      //If item has zero total
      if (total == 0 && !this.isTenderEditingViewMode()) {
        hasZeroTotalError = true;
      }

      if (total < 0 && !this.isTenderEditingViewMode()) {
        hasTotalLessThanZeroError = true;
      }

      //Has no PS % item
      if (NestUtils.isProvisionSumItem(item.editableSpecificationItem)) {
      }

      //if has percentage unit of measure but has no formula
      if (
        item.editableSpecificationItem.unitOfMeasure?.trim() == '%' &&
        item.editableSpecificationItem?.formula?.formulaName !=
        FormulaNames.PROVISION_SUM_PERCENT
      ) {
        hasPercentUnitOfMeasureButHasNoFormula = true;
      }

      //if has percentage formula but has no referring item
      if (
        item.editableSpecificationItem?.formula?.formulaName ==
        FormulaNames.PROVISION_SUM_PERCENT
      ) {
        let psItem: EditableSpecificationItem = null;

        try {
          const referringItemId =
            item.editableSpecificationItem?.formula?.inputFields?.[0]?.itemId;
          psItem = this.getPercentItemSource(
            item.uuid,
            referringItemId,
            item.groupId
          );
        } catch (e: any) { }
        if (psItem == null || psItem == undefined) {
          hasPercentFormulaButHasNoReferringItemError = true;
        }
      }

      //item has save error state
      if (
        item.editableSpecificationItem?.state?.code ==
        ItemsStateCodes.SAVE_ERROR
      ) {
        itemHasSaveErrorState = true;
      }

      //item is loading
      if (
        item.editableSpecificationItem?.state?.code == ItemsStateCodes.LOADING
      ) {
        itemIsLoading = true;
      }

      //item is waiting to save
      if (
        item.editableSpecificationItem?.state?.code == ItemsStateCodes.MODIFIED
      ) {
        itemWaitingToSave = true;
      }

      item.editableSpecificationItem.incompleteReasons = [];

      if (!itemIsFullyFilled) {
        item.editableSpecificationItem.incompleteReasons.push(
          'Item is not fully filled'
        );
      }

      if (hasProvisionalSumError) {
        item.editableSpecificationItem.incompleteReasons.push(
          'Has Provisional Sum Error'
        );
      }

      if (hasPercentUnitOfMeasureButHasNoFormula) {
        item.editableSpecificationItem.incompleteReasons.push(
          'Has % unit of measure but has no referring item'
        );
      }

      if (hasTotalLessThanZeroError) {
        item.editableSpecificationItem.incompleteReasons.push(
          'Has negative total'
        );
      }

      if (hasZeroTotalError) {
        item.editableSpecificationItem.incompleteReasons.push('Has 0 total');
      }

      if (hasPercentFormulaButHasNoReferringItemError) {
        let text = !this.isTenderEditingViewMode()
          ? 'Broken formula, re-link referring item'
          : 'Broken formula, please contact us';
        item.editableSpecificationItem.incompleteReasons.push(text);
      }

      if (itemHasSaveErrorState) {
        item.editableSpecificationItem.incompleteReasons.push(
          'Item not saved due to error'
        );
      }

      if (itemIsLoading) {
        item.editableSpecificationItem.incompleteReasons.push(
          'Item is loading'
        );
      }

      if (itemWaitingToSave) {
        item.editableSpecificationItem.incompleteReasons.push(
          'Item is waiting to save'
        );
      }
    }
  }

  getUnfilledMainItems() {
    let mainItems = this.items.filter((item) => item.type == 'GroupItem');
    this.totalMainItems = mainItems.length;
    return mainItems.filter(
      (item) =>
        this.fillableItems.some((i) => i.groupId == item.groupId) == false
    );
  }

  calculateFilledMainItemsPercentage() {
    let percentage = Math.floor(
      ((this.totalMainItems - this.unfilledMainItems.length) /
        this.totalMainItems) *
      100
    );
    return percentage;
  }

  updateView() {
    this.verifyItems();

    this.unfilledItems = this.fillableItems.filter(
      (item) => item.editableSpecificationItem.incompleteReasons.length > 0
    );

    this.unfilledMainItems = this.getUnfilledMainItems();

    this.inCompleteItems = this.unfilledItems.length;
    this.totalItems = this.fillableItems.length;
    this.completedItems = this.totalItems - this.inCompleteItems;

    if (this.totalItems > 0) {
      this.fillableItemsPercentProgress = Math.floor(
        (this.completedItems / this.totalItems) * 100
      );
    } else {
      this.fillableItemsPercentProgress = 0;
    }

    this.mainItemsPercentProgress = this.calculateFilledMainItemsPercentage();

    if (this.onBOQsCompletionStatusChange) {
      this.onBOQsCompletionStatusChange(this.boqsFillingCompletionStatus);
    }

    if (!this.isTendererViewMode()) {
      this.percentProgress = Math.floor(
        (this.fillableItemsPercentProgress + this.mainItemsPercentProgress) / 2
      );
    } else {
      this.percentProgress = this.fillableItemsPercentProgress;
    }

    if (this.percentProgress >= 100) {
      this.isCompleted = true;
    } else {
      this.isCompleted = false;
    }

    this.setBOQsFillingCompletionStatus();
    this.progressBar?.updateValue(this.percentProgress);
  }

  public getCompletionStatus = (): BOQsCompletionStatusChangeEvent => {
    this.updateView();
    return this.boqsFillingCompletionStatus;
  };

  isTendererViewMode() {
    return this.viewMode == 'tendererEditing';
  }

  goToItem(item: FilteredItem) {
    this.hideResults();
    if (this.goToItem) {
      this.onGoToItem.emit(item);
    }
  }

  setBOQsFillingCompletionStatus() {
    this.boqsFillingCompletionStatus = {
      isCompleted: this.isCompleted,
      completedItems: this.completedItems,
      inCompleteItems: this.inCompleteItems,
      inCompleteMainItems: this.unfilledMainItems.length,
      totalItems: this.totalItems,
      totalMainItems: this.totalMainItems,
      fillableItemsPercentProgress: this.fillableItemsPercentProgress,
      mainItemsPercentProgress: this.mainItemsPercentProgress,
      percentProgress: this.percentProgress,
    };
    if (this.onBOQsCompletionStatusChange) {
      this.onBOQsCompletionStatusChange(this.boqsFillingCompletionStatus);
    }
  }

  adjustCompletionPercentageToAccountForMainItems(
    filledItemsPercentage: number,
    mainItemsPercentage: number
  ) {
    let adjustedPercentage = filledItemsPercentage;

    if (mainItemsPercentage > 0) {
      adjustedPercentage = Math.floor(
        (filledItemsPercentage * (100 - mainItemsPercentage)) / 100
      );
    }
    return adjustedPercentage;
  }

  ngAfterViewInit() { }

  initSearchResultsListeners() {
    if (!this.documentClickListener) {
      setTimeout(() => {
        this.documentClickListener = (event) => {
          if (this.filterResults && this.filterResults.nativeElement) {
            const filterResultsEl = this.filterResults.nativeElement;

            if (!filterResultsEl.contains(event.target)) {
              // this.hideResults();
            }
          }
        };
        document.addEventListener('click', this.documentClickListener);
      }, 1000);
    }
  }

  ngOnDestroy() {
    this.changeSubscription.unsubscribe();
    document.removeEventListener('click', this.documentClickListener);
  }

  setParentItems() {
    this.parentItems = new Map(
      this.items
        .filter((item) => item.type == 'ItemDescription')
        .map((item) => [item.uuid, item])
    );
  }

  hideResults() {
    this.hideIncompletItemsResults();
    this.hideSearchResults();
  }

  hideSearchResults() {
    this.showSearchResults = false;
    this.searchKeyword = null;
  }

  hideIncompletItemsResults() {
    this.showIncompleteItems = false;
    this.filteredItems = [];
  }

  setIncompleteItems() {
    this.hideSearchResults();
    if (this.showIncompleteItems) {
      this.showIncompleteItems = false;
      return;
    }
    this.showIncompleteItems = true;

    this.setParentItems();

    this.filteredItems = [];

    for (let i = 0; i < this.unfilledMainItems.length; i++) {
      let item = this.unfilledMainItems[i];
      this.filteredItems.push({
        uuid: item.uuid,
        type: item.type,
        groupId: item.groupId,
        parentBreadCrumb: null,
        parents: [],
        itemDescription: item.nestedSpecificationGroupItem.name,
        incompleteReasons: ['No BOQs items added yet'],
      });
    }

    for (let i = 0; i < this.unfilledItems.length; i++) {
      let parents = this.getParentsList(this.unfilledItems[i].uuid);
      let item = this.unfilledItems[i];
      this.filteredItems.push({
        uuid: item.uuid,
        type: item.type,
        groupId: item.groupId,
        parentBreadCrumb: this.createParentBreadCrumb(parents),
        itemDescription:
          (item.editableSpecificationItem.code
            ? item.editableSpecificationItem.code + '. '
            : '') + item.editableSpecificationItem.description,
        parents,
        incompleteReasons: item.editableSpecificationItem.incompleteReasons,
      });
    }

    this.initSearchResultsListeners();
  }

  search() {
    this.hideIncompletItemsResults();

    let timeout = 300;

    if (this.searchKeyword == null || this.searchKeyword == '') {
      this.showSearchResults = false;
    } else {
      this.showSearchResults = true;

      this.initSearchResultsListeners();

      clearTimeout(this.debounceTimerId);
      this.debounceTimerId = setTimeout(() => {
        this.filteredItems = this.searchForKeyword(
          this.items,
          this.searchKeyword
        );
      }, timeout);
    }
  }

  searchForKeyword(
    items: FlatNestedSpecificationItemView[],
    keyword: string
  ): FilteredItem[] {
    const filteredItems: FilteredItem[] = [];
    const keywordLowerCase = keyword.toLowerCase();

    for (const item of items) {
      const codeMatch =
        item.nestedSpecificationItem?.code
          ?.toLowerCase()
          ?.includes(keywordLowerCase) ||
        item.editableSpecificationItem?.code
          ?.toLowerCase()
          ?.includes(keywordLowerCase);

      const descriptionMatch =
        item.nestedSpecificationItem?.description
          ?.toLowerCase()
          ?.includes(keywordLowerCase) ||
        item.editableSpecificationItem?.description
          ?.toLowerCase()
          ?.includes(keywordLowerCase) ||
        item.nestedSpecificationGroupItem?.name
          ?.toLowerCase()
          ?.includes(keywordLowerCase);

      const unitOfMeasureMatch = item.editableSpecificationItem?.unitOfMeasure
        ?.toLowerCase()
        ?.includes(keywordLowerCase);

      if (codeMatch || descriptionMatch || unitOfMeasureMatch) {
        const parents = this.getParentsList(item.uuid);
        const parentBreadCrumb = this.createParentBreadCrumb(parents);

        let itemDescription = null;

        let _item: any = null;
        if (item?.editableSpecificationItem) {
          _item = item.editableSpecificationItem;
          itemDescription = `${_item?.code ? _item.code + '. ' : ''}${_item?.description + ' (' + _item?.unitOfMeasure + ')' ?? ''
            }`;
        } else if (item?.nestedSpecificationGroupItem) {
          _item = item.nestedSpecificationGroupItem;
          itemDescription = `${_item?.name ?? ''}`;
        } else {
          _item = item.nestedSpecificationItem;

          itemDescription = `${_item?.code ? _item.code + '. ' : ''}${_item?.description ?? ''
            }`;
        }

        filteredItems.push({
          uuid: item.uuid,
          groupId: item.groupId,
          type: item.type,
          parentBreadCrumb,
          itemDescription,
          parents,
        });
      }
    }

    return filteredItems;
  }

  createParentBreadCrumb(parents: FlatNestedSpecificationItemView[]): string {
    parents.shift();
    const reversedParents = parents.reverse();

    let breadCrumb = '';
    for (let i = 0; i < reversedParents.length; i++) {
      breadCrumb += reversedParents[i].nestedSpecificationItem.code;
      if (i < reversedParents.length - 1) {
        breadCrumb += ' > ';
      }
    }
    return breadCrumb;
  }

  getParentsList(
    childUuid: string,
    parents: FlatNestedSpecificationItemView[] = []
  ) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].uuid == childUuid) {
        parents.push(this.items[i]);
        if (this.items[i].parentId) {
          parents = this.getParentsList(this.items[i].parentId, parents);
        }
      }
    }
    return parents;
  }
}
