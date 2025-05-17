import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FieldConfig } from "../../dynamic-forms-components/field.interface";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { DynamicFormService } from "../../dynamic-forms-components/dynamic-form.service";
import { NotificationService } from "../../../../services/notification.service";
import { GraphqlService } from "../../../../services/graphql.service";
import { completeSubtaskFields } from "./complete-subtask-form";
import {
  WorkingFlowSubTaskDtoInput
} from "../../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.model";
import {
  COMPLETE_PROCUREMENT_REQUISITION_SUB_TASK
} from "../../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.graphql";
import { MainDynamicFormComponent } from '../../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';

@Component({
  selector: 'app-complete-subtask',
  templateUrl: './complete-subtask.component.html',
  styleUrls: ['./complete-subtask.component.scss'],
  standalone: true,
  imports: [MainDynamicFormComponent]
})
export class CompleteSubtaskComponent implements OnInit, OnChanges {

  @Input() subTaskUid: string;
  @Output() subTaskClosed: EventEmitter<any> = new EventEmitter();

  fields: FieldConfig[];
  supportForm: UntypedFormGroup;
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    private dynamicFormService: DynamicFormService,
    private notificationService: NotificationService,
    private apollo: GraphqlService,
  ) {
  }

  ngOnInit(): void {
    this.fields = completeSubtaskFields;

    this.fields = this.fields.map(field => {

      if (field.key === 'subTaskUid')
        field.value = this.subTaskUid;

      return field;
    })

    this.supportForm = this.dynamicFormService.createControl(this.fields, null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subTaskUid'])
      this.subTaskUid = changes['subTaskUid'].currentValue;
  }

  async submitForm(formData: WorkingFlowSubTaskDtoInput) {
    this.loading = true;
    try {
      const response: any = await this.apollo.mutate({
        mutation: COMPLETE_PROCUREMENT_REQUISITION_SUB_TASK,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          workingFlowSubTaskDto: formData
        }
      });
      if (response?.data?.completeProcurementRequisitionSubTask?.code === 9000) {
        this.notificationService.successMessage('Subtask closed successfully');
        this.loading = false;
        this.subTaskClosed.emit();
      } else {
        throw new Error(response.data.completeProcurementRequisitionSubTask?.message);
      }
    } catch (e) {
      this.loading = false;
      this.notificationService.errorMessage(e.message);
    }
  }
}
