import {
  Component,
  EventEmitter,
  OnChanges,
  Input,
  Output, OnInit,
} from '@angular/core';
import { CheckBoxOption, CustomCheckBoxInputComponent } from '../custom-check-box-input/custom-check-box-input.component';
import { fadeIn } from '../../animations/basic-animation';
import {
  GET_DISCOUNT_PERCENTAGE_FOR_CONSULTANCY,
  GET_DISCOUNT_PERCENTAGE_FOR_GOODS,
  GET_DISCOUNT_PERCENTAGE_FOR_PRICE_SCHEDULE,
  GET_DISCOUNT_PERCENTAGE_FOR_WORKS,
} from './discount.graphql';
import { GraphqlService } from '../../../services/graphql.service';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';

import { ApolloNamespace } from "../../../apollo.config";
export interface Discount {
  hasDiscount: boolean;
  discountPercentage: number;
}

export enum TenderType {
  GOODS = 'GOODS',
  WORKS = 'WORKS',
  CONSULTANCY = 'CONSULTANCY',
  NON_CONSULTANCY = 'NON_CONSULTANCY',
}
@Component({
    selector: 'app-discount-container',
    templateUrl: './discount-container.component.html',
    styleUrls: ['./discount-container.component.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [
    CustomCheckBoxInputComponent,
    FormsModule,
    LoaderComponent
],
})
export class DiscountContainerComponent implements OnInit, OnChanges {
  isOfferingDiscount: boolean = false;

  @Input() readOnly: boolean = false;
  @Input() discountData: Discount = {
    hasDiscount: null,
    discountPercentage: null,
  };
  @Output() onDiscountEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() pendingDiscountUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() tenderType: TenderType;
  @Input() isEvaluating: boolean;
  @Input() submissionCriteriaUuid: string;
  previousDiscountData: Discount;
  isDiscountDifferent = false;
  message: string;
  loading: boolean = false;

  checkOptions: CheckBoxOption[] = [
    {
      id: 'OFFER',
      label: 'I offer discount',
      value: 'OFFER',
      selected: false,
    },
    {
      id: 'NO_OFFER',
      label: "I don't offer discount",
      value: 'NO_OFFER',
      selected: false,
    },
  ];

  constructor(private apollo: GraphqlService) {}

  ngOnInit(): void {
    this.previousDiscountData = {...this.discountData};
  }

  onCheckChanges(event: any) {
    this.implementExclusiveness(event.item);
    this.isOfferingDiscount = event.item.value == 'OFFER';
    this.discountData.hasDiscount = this.isOfferingDiscount;
    this.checkDiscountDifferent(this.previousDiscountData,this.discountData);
  }

  checkDiscountDifferent(previousData: Discount, newData: Discount) {
    this.isDiscountDifferent =  (
      previousData.hasDiscount !== newData.hasDiscount ||
      previousData.discountPercentage !== newData.discountPercentage
    );

    this.pendingDiscountUpdate.emit(this.isDiscountDifferent);
  }

  implementExclusiveness(selectedItem: CheckBoxOption) {
    selectedItem.selected = true;
    this.checkOptions = this.checkOptions.map((checkItem) => {
      if (checkItem.value == selectedItem.value) {
        return selectedItem;
      } else {
        checkItem.selected = false;
        return checkItem;
      }
    });
  }

  getEndpoint(tenderType: TenderType): any {
    switch (tenderType) {
      case TenderType.WORKS:
        return GET_DISCOUNT_PERCENTAGE_FOR_WORKS;
      case TenderType.GOODS:
        return GET_DISCOUNT_PERCENTAGE_FOR_GOODS;
      case TenderType.CONSULTANCY:
        return GET_DISCOUNT_PERCENTAGE_FOR_CONSULTANCY;
      case TenderType.NON_CONSULTANCY:
        return GET_DISCOUNT_PERCENTAGE_FOR_PRICE_SCHEDULE;
      default:
        break;
    }
  }
  async saveDiscount() {
    this.loading = true;
    const response = await this.apollo.mutate({
      mutation: this.getEndpoint(this.tenderType),
      apolloNamespace: ApolloNamespace.submission,
      variables: {
        submissionCriteriaUuid: this.submissionCriteriaUuid,
        hasDiscount: this.discountData.hasDiscount,
        discountPercentage: this.discountData.discountPercentage ?? 0,
      },
    });
    if (response.data[this.getResponse(this.tenderType)].code == 9000) {
      this.message = null;
      this.onDiscountEvent.emit(this.discountData);
      this.previousDiscountData = {...this.discountData};
      this.loading = false;
      this.checkDiscountDifferent(this.previousDiscountData,this.discountData);
    } else {
      this.loading = false;
      this.message = response.data[this.getResponse(this.tenderType)].message;
    }
  }

  getResponse(tenderType: TenderType): any {
    switch (tenderType) {
      case TenderType.WORKS:
        return 'saveDiscountPercentageForWorkSubFinancial';
      case TenderType.GOODS:
        return 'saveDiscountPercentageForGoodFinancial';
      case TenderType.CONSULTANCY:
        return 'saveDiscountPercentageForReImbursementExpense';
      case TenderType.NON_CONSULTANCY:
        return 'saveDiscountPercentageForPriceSchedule';
      default:
        break;
    }
  }

  valueChanged(event: any) {
    if (event.target.value >= 1 && event.target.value <= 100) {
    } else {
      this.discountData.discountPercentage = null;
    }

    this.checkDiscountDifferent(this.previousDiscountData,this.discountData);
  }

  ngOnChanges(): void {
    if (this.discountData) {
      this.isOfferingDiscount = this.discountData.hasDiscount;
      this.checkOptions = this.checkOptions.map((checkItem) => {
        if (this.discountData.hasDiscount && checkItem.value === 'OFFER') {
          checkItem.selected = true;
        } else if (
          this.discountData.hasDiscount == false &&
          checkItem.value === 'NO_OFFER'
        ) {
          checkItem.selected = true;
        } else {
          checkItem.selected = false;
        }
        return checkItem;
      });

    //
    //   if (this.discountData.hasDiscount && checkItem.value === 'OFFER') {
    //     checkItem.selected = true;
    //   } else checkItem.selected = this.discountData.hasDiscount == false &&
    //     checkItem.value === 'NO_OFFER';
    //   return checkItem;
    // }
    }


    if(this.discountData.hasDiscount == null && this.isEvaluating == true){
      this.discountData.hasDiscount = false;
      this.discountData.discountPercentage = 0;
      this.saveDiscount().then();
    }
  }
}
