import { FormulaNames } from './../../nested-specifications-builder/store/model';
import { BOQsCompletionStatusChangeEvent } from './../../nested-specifications-builder/nested-specifications-info-bar/nested-specifications-info-bar.component';
import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  BoqsService,
  BOQSummarySums,
} from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs.service';
import { GroupedBOQ } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import {
  NestedSpecificationActionResults,
  NestedSpecificationsViewMode,
} from '../../nested-specifications-builder/group-item/group-item.component';

import { BoqSummaryComponent } from '../boq-summary/boq-summary.component';
import {
  BOQFetchingConfiguration,
  BoqFetcherComponent,
} from '../boq-fetcher/boq-fetcher.component';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import {
  NestedSpecificationChange,
  NestedSpecificationsService,
} from '../../nested-specifications-builder/nested-specifications.service';
import { BOQSubItem } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-sub-items/boq-sub-item.model';
import {
  BOQItemChangeType,
  BOQSubItemChange,
} from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs-selector/boqs-selector.component';
import {
  EditableSpecificationItem,
  FlatNestedSpecificationItemView,
  FlatNestedSpecificationItemViewChangeTypes,
  ItemsStateCodes,
} from '../../nested-specifications-builder/store/model';
import { FlatNestedSpecificationsComponent } from '../../nested-specifications-builder/flat-nested-specifications/flat-nested-specifications.component';



export interface FilledBOQSubItems {
  description: string;
  isPredefined: boolean;
  name: string;
  quantity: string;
  subBoqItemUuid: string;
  submissionCriteria: {
    uuid: string;
  };
  total: number;
  unitOfMeasure: string;
  unitRate: number;
  uuid: string;
}

interface FilledBOQSubItemsMap {
  [subBoqItemUuid: string]: FilledBOQSubItems;
}

@Component({
  selector: 'app-tenderer-boq-view-only',
  standalone: true,
  imports: [
    BoqFetcherComponent, FlatNestedSpecificationsComponent
  ],
  templateUrl: './tenderer-boq-view-only.component.html',
})
export class TendererBoqViewOnlyComponent {

  @Input()
  onBOQSubItemChange: (
    args: BOQSubItemChange
  ) => Promise<NestedSpecificationActionResults>;

  @Output()
  onComplete: EventEmitter<BOQsCompletionStatusChangeEvent> =
    new EventEmitter();

  @Output()
  onBoqSummarySumsChange = new EventEmitter<BOQSummarySums>();

  @Input()
  requisitionUuid: string;

  @Input()
  itemUuid: string;

  @Input()
  forPPRAAdmin: boolean = false;

  @Input()
  filledBOQSubItems: FilledBOQSubItems[];

  @Input()
  currencyCode: string;

  @Input()
  exchangeRate: number;

  @Input()
  boqSummarySums: BOQSummarySums = null;

  @Input()
  viewMode: NestedSpecificationsViewMode = 'tendererEditing';

  requisitionDate = input.required<Date>();

  @Input()
  saveCustomSpecificationFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  fetchingConfiguration: BOQFetchingConfiguration;

  endPointName: string = 'getMergedMainProcurementRequisitionDataForEvaluation';

  requisitionObjectFieldName: string = 'mergedProcurementRequisitions';

  requisitionItemsFieldName: string = 'mergedProcurementRequisitionItems';

  exchangeRateIsSet: boolean = false;

  requisitionItemsItemizationsFieldName: string =
    'worksRequisitionItemItemizations';

  itemsHash: string = null;

  items: GroupedBOQ[] = [];

  provisionSumPhysicalContingencyPercent: number = 2;

  vatRequired: boolean = true;

  provisionSumVariationOfPricesPercent: number = 2;

  flatNestedSpecificationItemsView: FlatNestedSpecificationItemView[] = [];

  showBOQFetcher = true;

  localCurrency = 'TZS';

  private debouncedOnExchangeRateChangedTimeoutId: any;

  @ViewChild(FlatNestedSpecificationsComponent, { static: false })
  flatNestedSpecificationsComponent: FlatNestedSpecificationsComponent;

  @ViewChild(BoqSummaryComponent, { static: false })
  boqSummaryComponent: BoqSummaryComponent;

  constructor(
    private boqsService: BoqsService,
    private nestedSpecificationsService: NestedSpecificationsService
  ) { }

  ngOnInit(): void {
    // this.onExchangeRateChanged();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['requisitionItemUuid'] || changes['itemUuid']) {
      if (this.requisitionUuid != null && this.itemUuid != null) {
        this.setItems();
      }
    }
    if (changes['exchangeRate']) {
      this.debouncedOnExchangeRateChanged();
    }
  }

  onExchangeRateChanged = () => {
    if (
      (this.currencyCode != this.localCurrency && this.exchangeRate > 0) ||
      this.currencyCode == this.localCurrency
    ) {
      this.exchangeRateIsSet = true;
    } else {
      this.exchangeRateIsSet = false;
    }
  };

  onTotalCalculated(event: any) {
    this.flatNestedSpecificationsComponent.calculateTotal();
  }

  debouncedOnExchangeRateChanged() {
    if (this.debouncedOnExchangeRateChangedTimeoutId) {
      clearTimeout(this.debouncedOnExchangeRateChangedTimeoutId);
    }
    this.debouncedOnExchangeRateChangedTimeoutId = setTimeout(
      () => this.onExchangeRateChanged(),
      500
    );
  }

  onItemChange = async (
    change: NestedSpecificationChange
  ): Promise<NestedSpecificationActionResults> => {
    let res: NestedSpecificationActionResults = null;

    const changeType = change.changeType;
    const item = change.item as EditableSpecificationItem;

    if (!item) {
      return res;
    }

    let boqSubItem: BOQSubItem;

    if (changeType != FlatNestedSpecificationItemViewChangeTypes.REFRESH) {
      boqSubItem =
        this.boqsService.setBOQSubItemFromNestedSpecificationItem(item);
    }

    switch (changeType) {
      case FlatNestedSpecificationItemViewChangeTypes.UPDATE:
        this.nestedSpecificationsService.updateItemState(
          item,
          ItemsStateCodes.LOADING,
          'Saving item'
        );

        if (item?.formula?.formulaName != FormulaNames.PROVISION_SUM_PERCENT) {
          delete boqSubItem.quantity;
        }

        res = await this.onBOQSubItemChange({
          changeType: BOQItemChangeType.UPDATE,
          item: boqSubItem,
        });

        break;
    }

    return res;
  };

  onBOQFinishedLoading = (
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
    summary: BOQSummarySums
  ) => {
    if (!summary) {
      return;
    }

    this.showBOQFetcher = false;

    this.flatNestedSpecificationItemsView = flatNestedSpecificationItemView;

    this.provisionSumVariationOfPricesPercent =
      summary?.provisionSumVariationOfPricesPercent ?? 0;
    this.provisionSumPhysicalContingencyPercent =
      summary?.provisionSumPhysicalContingencyPercent ?? 0;
    this.vatRequired = summary?.vatRequired;

    this.setSubBOQItemsValuesFromFilledBOQSubItems(
      flatNestedSpecificationItemView,
      this.filledBOQSubItems
    );

    setTimeout(() => {
      this.flatNestedSpecificationsComponent?.calculateTotal();
    }, 200);
  };

  async getSummary(): Promise<BOQSummarySums> {
    return this.flatNestedSpecificationsComponent.getBOQSummarySums();
  }

  setSubBOQItemsValuesFromFilledBOQSubItems = (
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
    filledBOQSubItems: FilledBOQSubItems[]
  ) => {
    let filledBOQSubItemsMap: FilledBOQSubItemsMap = filledBOQSubItems?.reduce(
      (acc: FilledBOQSubItemsMap, item: FilledBOQSubItems) => {
        acc[item.subBoqItemUuid] = item;
        return acc;
      },
      {}
    );

    //remove item if filledBOQSubItemsMap[].editableSpecificationItem.unitOfMeasure == PS

    for (let i = 0; i < flatNestedSpecificationItemView.length; i++) {
      let item = flatNestedSpecificationItemView[i];
      if (item.type == 'NestedSpecificationItem') {
        let subBoqItemUuid = item?.editableSpecificationItem?.uuid;
        if (subBoqItemUuid) {
          if (
            flatNestedSpecificationItemView[i]?.editableSpecificationItem
              ?.formula?.formulaName == FormulaNames.PROVISION_SUM_AMOUNT
          ) {
            item.editableSpecificationItem.value = this.getQuantity(
              item,
              null
            )?.toString();
            item.editableSpecificationItem.unitRate = this.getUnitRate(
              item,
              null
            );
          } else {
            if (filledBOQSubItemsMap[subBoqItemUuid]) {
              let filledQuantity: number =
                parseFloat(filledBOQSubItemsMap[subBoqItemUuid].quantity) ||
                null;
              item.editableSpecificationItem.value = this.getQuantity(
                item,
                filledQuantity
              )?.toString();
              item.editableSpecificationItem.unitRate = this.getUnitRate(
                item,
                filledBOQSubItemsMap[subBoqItemUuid].unitRate
              );
            } else {
              item.editableSpecificationItem.value = this.getQuantity(
                item,
                null
              )?.toString();
              item.editableSpecificationItem.unitRate = this.getUnitRate(
                item,
                null
              );
            }
          }
        }
        if (
          item.editableSpecificationItem?.formula?.formulaName ==
          FormulaNames.PROVISION_SUM_AMOUNT
        ) {
          item.editableSpecificationItem.total =
            item.editableSpecificationItem?.unitRate *
            (parseFloat(item.editableSpecificationItem?.value) || 0);
        } else {
          try {
            item.editableSpecificationItem.total =
              filledBOQSubItemsMap[subBoqItemUuid]?.total;
          } catch (e) { }
        }
      }
    }
  };

  getUnitRate = (
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView,
    filledUnitRate: number
  ): number => {
    let formula =
      flatNestedSpecificationItemView?.editableSpecificationItem?.formula;

    if (formula?.formulaName == FormulaNames.PROVISION_SUM_AMOUNT) {
      return this.nestedSpecificationsService.getUnitRateFromPSFormula(formula);
    }
    return filledUnitRate;
  };

  getQuantity = (
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView,
    filledValue: number
  ): number => {
    let formula =
      flatNestedSpecificationItemView?.editableSpecificationItem?.formula;

    if (formula?.formulaName == FormulaNames.PROVISION_SUM_PERCENT) {
      return filledValue;
    } else
      return (
        parseFloat(
          flatNestedSpecificationItemView?.editableSpecificationItem?.value
        ) || null
      );
  };

  onCompleteFunction = (completionStatus: BOQsCompletionStatusChangeEvent) => {
    this.onComplete.emit(completionStatus);
  };

  setItems() {
    this.fetchingConfiguration = {
      fetchBy: 'query',
      fetchByValue: this.itemUuid,
      fetchByParentValue: this.requisitionUuid,
      endPointName: this.endPointName,
      requisitionObjectFieldName: this.requisitionObjectFieldName,
      requisitionItemsFieldName: this.requisitionItemsFieldName,
      requisitionItemsItemizationsFieldName:
        this.requisitionItemsItemizationsFieldName,
      isFilled: false,
    };
    this.showBOQFetcher = false;

    setTimeout(() => {
      this.showBOQFetcher = true;
    }, 100);
  }

  _onBoqSummarySumsChange(bOQSummarySums: BOQSummarySums) {
    this.onBoqSummarySumsChange.emit(bOQSummarySums);
  }

}
