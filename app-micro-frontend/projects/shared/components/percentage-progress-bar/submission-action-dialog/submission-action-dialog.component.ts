import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  CANCEL_SUBMISSION_MODIFICATION
} from "../../../../modules/nest-tenderer/store/submission/submission.graphql";
import { NotificationService } from "../../../../services/notification.service";
import { GraphqlService } from "../../../../services/graphql.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";
import { CustomAlertBoxModel } from "../../custom-alert-box/custom-alert-box.model";
import { SaveAreaComponent } from '../../save-area/save-area.component';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomAlertBoxComponent } from '../../custom-alert-box/custom-alert-box.component';
import { ModalHeaderComponent } from '../../modal-header/modal-header.component';

@Component({
    selector: 'app-submission-action-dialog',
    templateUrl: './submission-action-dialog.component.html',
    styleUrls: ['./submission-action-dialog.component.scss'],
    standalone: true,
    imports: [ModalHeaderComponent, CustomAlertBoxComponent, MatFormFieldModule, MatInputModule, FormsModule, SaveAreaComponent]
})

export class SubmissionActionDialogComponent implements OnInit {
  entityNumber: string;
  submissionUuid: string;
  isLoading: boolean = false;
  reasonUuid: string;
  withdrawReason: string;
  confirmKey: string;
  alertClass = 'bg-red-100 border-red-300  rounded';
  alertTextClass: string;
  actionBidModify: boolean = false;

  cancellationAlert: CustomAlertBoxModel = {
    title: 'Disclaimer',
    buttonTitle: '',
    showButton: false,
    details: [
      {
        icon: 'info',
        message: 'You are about to cancel pending modification request'
      }
    ]
  };


  savingMessage: string;
  confirmMessage: string;

  constructor(
    private notificationService: NotificationService,
    private apollo: GraphqlService,
    private dialogRef: MatBottomSheetRef<SubmissionActionDialogComponent>,
    private store: Store<ApplicationState>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data
  ) {
    this.submissionUuid = data.submissionUuid;
    this.entityNumber = data.entityNumber;
  }

  ngOnInit(): void {
    this.savingMessage = 'cancelling modification request, please be patient...';
    this.confirmMessage = 'You are about to cancel your modification request. Do you want to continue?';
  }

  async cancelSubmissionModification() {
    try {
      this.isLoading = true;
      const response = await this.apollo.mutate({
        mutation: CANCEL_SUBMISSION_MODIFICATION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionUuid: this.submissionUuid
        },
      });
      if (response.data.cancelSubmissionModification.code == 9000) {
        this.notificationService.successMessage(
          'Modification Request Cancelled Successfully'
        );
        this.closeModal(true);
      } else {
        console.error(response.data);
        this.notificationService.errorMessage('Failed to perform cancellation, Please try again');
      }
      this.isLoading = false;

    } catch (e) {
      console.error(e);
      this.isLoading = false;
      this.notificationService.errorMessage('Failed to perform cancellation, Please try again');
    }
  }

  closeModal(close?: boolean): void {
    this.dialogRef.dismiss(close);
  }

}
