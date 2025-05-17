import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GraphqlService } from "../../../services/graphql.service";
import {
  CHECK_PENDING_BILLS_PAYMENT_BY_ENTITY_UUID,
  PROCESS_ACCOUNT_PAYMENT
} from "../../../modules/nest-app/store/annual-procurement-plan/annual-procurement-plan.graphql";
import { NotificationService } from "../../../services/notification.service";
import { MustHaveFilter } from '../paginated-data-table/must-have-filters.model';
import { DataRequestInput } from '../paginated-data-table/data-page.model';
import { FieldRequestInput } from '../paginated-data-table/field-request-input.model';
import { GET_BILLABLE_ENTITY_BY_STATUS_DATA } from 'src/app/modules/nest-billing/store/transcations/transcations.graphql';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';
import { ViewDetailsItemComponent } from '../view-details-item/view-details-item.component';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-view-service-bill',
    templateUrl: './view-service-bill.component.html',
    styleUrls: ['./view-service-bill.component.scss'],
    standalone: true,
    imports: [ViewDetailsItemComponent, LoaderComponent, MatIconModule, DecimalPipe]
})
export class ViewServiceBillComponent implements OnInit {
  loading: boolean;
  input: any;
  type: string;
  previousBill: number = 0;
  bill: GeneratedBill | GeneratedGPNBill;
  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    public matDialogRef: MatDialogRef<ViewServiceBillComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bill = data.bill;
    this.type = data.type;
  }

  ngOnInit(): void {
    this.checkPreviousBill().then();
  }

  async checkPreviousBill() {
    const response: any = await this.apollo.fetchData({
      query: CHECK_PENDING_BILLS_PAYMENT_BY_ENTITY_UUID,
      apolloNamespace: ApolloNamespace.billing,
      variables: {
        billableEntityType: this.type,
      }
    });

    if (response.data.findPendingBillsValue.code == 9000) {
      this.previousBill = response.data?.findPendingBillsValue?.data;
    } else {
      this.previousBill = 0;
    }
  }

  goToBills() {
    this.close(false);
    if (this.type == "TENDERER") {
      this.router.navigateByUrl('/nest-tenderer/wallet/pending-bills').then();
    } else {
      this.router.navigateByUrl('/modules/bills/pending-bills').then();
    }
  }

  goToWallet() {
    this.close(false);
    if (this.type == "TENDERER") {
      this.router.navigateByUrl('/nest-tenderer/wallet/dashboard').then();
    } else {
      this.router.navigateByUrl('/modules/bills/bills-wallet').then();
    }
  }

  async onPayNow() {
    this.loading = true;
    const response: any = await this.apollo.mutate({
      mutation: PROCESS_ACCOUNT_PAYMENT,
      apolloNamespace: ApolloNamespace.billing,
      variables: {
        billUuid: this.bill?.billUuid
      }
    });
    if (response.data?.confirmPaymentForService?.code == 9000 && response.data?.confirmPaymentForService?.data?.status == true) {
      this.notificationService.successMessage(response.data.confirmPaymentForService?.data?.message);
      this.close(true);
    } else {
      this.notificationService.errorMessage(response.data.confirmPaymentForService?.data?.message);
      this.close(false);
    }
  }

  close(refresh: boolean = false) {
    this.matDialogRef.close(refresh);
  }

  continue() {
    this.close(true);
  }

}


export interface GeneratedBill {
  billUuid: string;
  billReferenceNumber: string;
  billableEntityTypeEnum: string;
  billableEntityUuid: string;
  billedAmount: number;
  billingCycle: string;
  controlNumber: string;
  currency: string;
  hasBeenWaived: boolean;
  isBalanceSufficient: boolean;
  payerName: string;
  price: number;
  serviceName: string;
  userAccountBalance: number;
}

export interface GenerateBillItem {
  hasBeenWaived: boolean;
  price: number;
  serviceName: string;
}



export interface GeneratedGPNBill extends GeneratedBill {

}
