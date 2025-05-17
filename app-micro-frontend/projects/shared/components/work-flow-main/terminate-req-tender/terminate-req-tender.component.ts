import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FieldConfig } from "../../dynamic-forms-components/field.interface";
// import {
//   cancellationRequestFormFields
// } from "../../../../modules/nest-tender-initiation/approved-requisitions/initiate-req-tender-cancellation-form/initiate-req-tender-cancellation-form";
import { Subscription } from "rxjs";
import {
  ReasonTypeEnum,
  TenderCancellationReason
} from "../../../../modules/nest-tender-initiation/store/settings/tender-cancellation-reason/tender-cancellation-reason.model";
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";
import { GraphqlService } from "../../../../services/graphql.service";
import { Actions } from "@ngrx/effects";
import { DynamicFormService } from "../../dynamic-forms-components/dynamic-form.service";
import { NotificationService } from "../../../../services/notification.service";
import {
  TenderCancellationRequestDtoInput
} from "../../../../modules/nest-tender-initiation/store/tender-cancellation-request/tender-cancellation-request.model";
import {
  COMPLETE_PROCUREMENT_TENDER_REQUISITION_TASKS
} from "../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql";
import { MainDynamicFormComponent } from '../../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';
import { LoaderComponent } from '../../loader/loader.component';


@Component({
  selector: 'app-terminate-req-tender',
  templateUrl: './terminate-req-tender.component.html',
  styleUrls: ['./terminate-req-tender.component.scss'],
  standalone: true,
  imports: [LoaderComponent, MainDynamicFormComponent]
})
export class TerminateReqTenderComponent implements OnInit {

  @Input() modelUuid: string;
  @Output() closeForm = new EventEmitter<boolean>();
  @Output() reloadRequisitionTender = new EventEmitter<string>();
  loadingDistricts: boolean;
  supportForm: UntypedFormGroup;
  // fields: FieldConfig[] = cancellationRequestFormFields;
  fields: FieldConfig[] = [];
  confirmTitle: string = 'You\'re about initiate tender TERMINATION. Do you want to continue?';
  loading: boolean;
  fetchingItem: boolean;
  subscription: Subscription = new Subscription();
  tenderCancellationReason: TenderCancellationReason

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<ApplicationState>,
    private apollo: GraphqlService,
    private actions$: Actions,
    private dynamicFormService: DynamicFormService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.initialization().then();

    this.fields = this.fields.map(field => {
      if (field.key === 'tenderCancellationRequestReasonsUuids') {
        field.additionalVariables = {
          reasonTypeEnum: ReasonTypeEnum.TERMINATION,
        };
        field.label = 'Select Withdrawal/Termination Reasons';
      }
      if (field.key === 'otherTenderCancellationRequestReason') {
        field.label = 'Other Withdrawal/Termination reason';
      }
      return field;
    })
  }

  async initialization() {
    this.supportForm = this.dynamicFormService.createControl(this.fields, null);
    if (this.tenderCancellationReason) {
      this.supportForm.patchValue(this.tenderCancellationReason);
      this.supportForm.get('reasonOrJustification').patchValue(this.tenderCancellationReason.reason);
    }
  }

  close(shouldUpdate = false) {
    this.closeForm.emit(shouldUpdate);
  }

  async submitForm(formValues: TenderCancellationRequestDtoInput) {
    this.loading = true;
    const dataToSave = {
      reasonUuids: formValues?.tenderCancellationRequestReasonsUuids?.filter(uuid => uuid !== 'Other'),
      modelUid: this.modelUuid,
      action: 'TERMINATE',
      comment: null,
      additionalDetails: formValues?.additionalDetails,
      otherTenderCancellationRequestReason: formValues?.otherTenderCancellationRequestReason
    };
    try {
      const response: any = await this.apollo.mutate({
        mutation: COMPLETE_PROCUREMENT_TENDER_REQUISITION_TASKS,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          taskData: [dataToSave]
        }
      });
      if (response?.data?.completeMergedProcurementRequisitionTask?.code === 9000) {
        this.notificationService.successMessage('Action completed successfully');
        this.reloadRequisitionTender.emit(this.modelUuid);
      } else {
        throw new Error(response?.data?.completeMergedProcurementRequisitionTask?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage(e.message);
    }
    this.loading = false;
  }
}
