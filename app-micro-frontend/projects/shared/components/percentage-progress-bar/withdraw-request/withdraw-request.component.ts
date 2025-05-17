import { Component, Inject, OnInit } from "@angular/core";
import { ApolloNamespace } from "src/app/apollo.config";
import {
  MODIFY_SUBMISSION,
  WITHDRAW_SUBMISSION
} from "../../../../modules/nest-tenderer/store/submission/submission.graphql";
import { NotificationService } from "../../../../services/notification.service";
import { GraphqlService } from "../../../../services/graphql.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";
import { FieldConfig, FieldType } from "../../dynamic-forms-components/field.interface";
import {
  GET_TENDER_WITHDRAW_REASONS_PAGINATED
} from "../../../../modules/nest-tender-initiation/store/settings/tender-withdraw-reason/tender-withdraw-reason.graphql";
import { CustomAlertBoxModel } from "../../custom-alert-box/custom-alert-box.model";
import {
  GET_SUBMISSION_MODIFICATION_REASONS_PAGINATED
} from "src/app/modules/nest-tender-initiation/store/settings/submission-modification-reason/submission-modification-reason.graphql";
import { SaveAreaComponent } from "../../save-area/save-area.component";

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { PaginatedSelectComponent } from "../../dynamic-forms-components/paginated-select/paginated-select.component";
import { CustomAlertBoxComponent } from "../../custom-alert-box/custom-alert-box.component";
import { ModalHeaderComponent } from "../../modal-header/modal-header.component";

@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.scss'],
  standalone: true,
  imports: [ModalHeaderComponent, CustomAlertBoxComponent, PaginatedSelectComponent, FormsModule, MatFormFieldModule, MatInputModule, SaveAreaComponent]
})
export class WithdrawRequestComponent implements OnInit {
  entityNumber: string;
  submissionUuid: string;
  isLoading: boolean = false;
  reasonUuid: string;
  withdrawReason: string;
  confirmKey: string;
  alertClass: string;
  alertTextClass: string;
  actionBidModify: boolean = false;

  modifyAlert: CustomAlertBoxModel = {
    title: 'Disclaimer',
    buttonTitle: '',
    showButton: false,
    details: [
      {
        icon: 'info',
        message: 'You are about to modify/substitute some contents of your tender. Upon modification/substitution, the earlier contents will be overridden and the current version will take over'
      }
    ]
  };

  withdrawAlert: CustomAlertBoxModel = {
    title: 'Disclaimer',
    buttonTitle: '',
    showButton: false,
    details: [
      {
        icon: 'info',
        message: 'You are about to withdraw your tender. Upon withdrawing the tender you will not be allowed to participate again in this tender.'
      }
    ]
  };

  field: FieldConfig = {
    query: GET_TENDER_WITHDRAW_REASONS_PAGINATED,
    apolloNamespace: ApolloNamespace.submission,
    optionName: 'reason',
    optionValue: 'uuid',
    searchFields: ['reason'],
    dynamicPipes: [],
    label: 'Withdraw reason',
    key: 'reasonUuid',
    mapFunction: (item) => ({ ...item }),
    mustHaveFilters: [
      { fieldName: 'active', value1: 'true', operation: 'EQ' }
    ],
    validations: []
  };

  field2: FieldConfig = {
    query: GET_SUBMISSION_MODIFICATION_REASONS_PAGINATED,
    apolloNamespace: ApolloNamespace.submission,
    optionName: 'reason',
    optionValue: 'uuid',
    searchFields: ['reason'],
    dynamicPipes: [],
    label: 'Modification reason',
    key: 'reasonUuid',
    mapFunction: (item) => ({ ...item }),
    mustHaveFilters: [
      { fieldName: 'active', value1: 'true', operation: 'EQ' }
    ],
    validations: []
  };
  savingMessage: string;
  confirmMessage: string;

  constructor(
    private notificationService: NotificationService,
    private apollo: GraphqlService,
    private dialogRef: MatBottomSheetRef<WithdrawRequestComponent>,
    private store: Store<ApplicationState>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data
  ) {
    this.actionBidModify = data.actionBidModify;
    this.submissionUuid = data.submissionUuid;
    this.entityNumber = data.entityNumber;
  }

  ngOnInit(): void {

    this.savingMessage = (this.actionBidModify) ? 'sending modification request, please be patient...' : 'sending withdraw request, please be patient...';
    this.confirmMessage = (this.actionBidModify) ? 'You are about to modify your bid. Do you want to continue?' : 'You are about to withdraw your bid. Do you want to continue?';

    if (!this.actionBidModify) {
      this.alertClass = 'bg-red-100 border-red-300  rounded';
      this.alertTextClass = '';
    }
  }

  async modifyBid() {
    try {
      this.isLoading = true;
      const response = await this.apollo.mutate({
        mutation: MODIFY_SUBMISSION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          modifySubmissionDTO: {
            submissionUuid: this.submissionUuid,
            modificationReasonUuid: this.reasonUuid,
            modificationReasonInfo: this.withdrawReason
          },
        },
      });
      if (response.data.initiateSubmissionModification.code == 9000) {
        this.notificationService.successMessage('Congratulations! modification confirmation request is sent to Tenderer Email. Check email to confirm');
        this.closeModal(true);
      } else {
        console.error(response.data);
        this.notificationService.errorMessage('Failed to send modification request your bid, Please try again');
      }
      this.isLoading = false;

    } catch (e) {
      console.error(e);
      this.isLoading = false;
      this.notificationService.errorMessage('Failed to send modification request your bid, Please try again');
    }
  }

  async withdrawBid() {
    try {
      this.isLoading = true;
      const response = await this.apollo.mutate({
        mutation: WITHDRAW_SUBMISSION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          withdrawSubmissionDTO: {
            submissionUuid: this.submissionUuid,
            withdrawReasonUuid: this.reasonUuid,
            withdrawReasonInfo: this.withdrawReason
          },
        },
      });
      if (response.data.initiateWithdrawSubmission.code == 9000) {
        this.notificationService.successMessage('Congratulations! withdraw confirmation request is sent to Tenderer Email. Check email to confirm');
        this.closeModal(true);
      } else {
        console.error(response.data);
        this.notificationService.errorMessage('Failed to send withdraw request of your bid, Please try again');
      }
      this.isLoading = false;

    } catch (e) {
      console.error(e);
      this.isLoading = false;
      this.notificationService.errorMessage('Failed to send withdraw request of your bid, Please try again');
    }
  }

  setSelectedReason(event) {

  }

  closeModal(close?: boolean): void {
    this.dialogRef.dismiss(close);
  }

  addConfirmKey(key) {

    this.confirmKey = key;
  }

}
