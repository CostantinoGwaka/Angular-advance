import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FieldConfig } from "../../dynamic-forms-components/field.interface";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { DynamicFormService } from "../../dynamic-forms-components/dynamic-form.service";
import { NotificationService } from "../../../../services/notification.service";
import { GraphqlService } from "../../../../services/graphql.service";
import { assignSubordinateFields } from "./assign-task-to-subordinate.form";
import {
  AssignProcurementRequisitionDtoInput
} from "../../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.model";
import { User } from "../../../../modules/nest-uaa/store/user-management/user/user.model";
import { GET_SUBORDINATE_USERS } from "../../../../modules/nest-uaa/store/user-management/user/user.graphql";
import {
  ASSIGN_PROCUREMENT_REQ_TASK
} from "../../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.graphql";
import { MainDynamicFormComponent } from '../../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';

@Component({
  selector: 'app-assign-task-to-subordinate',
  templateUrl: './assign-task-to-subordinate.component.html',
  styleUrls: ['./assign-task-to-subordinate.component.scss'],
  standalone: true,
  imports: [MainDynamicFormComponent]
})
export class AssignTaskToSubordinateComponent implements OnInit, OnChanges {

  @Input() modelUid: string;
  @Output() taskDelegated: EventEmitter<any> = new EventEmitter();

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
    this.fields = assignSubordinateFields;

    this.fields = this.fields.map(field => {
      if (field.key == 'assigneeId') {
        this.getSubordinates().then((users: User[]) => {
          field.options = users.map((user: User) => ({
            name: user?.firstName + ' ' + user?.middleName + ' ' + user.lastName,
            value: user?.id
          }));
        })
      }

      if (field.key === 'modelUid')
        field.value = this.modelUid;

      return field;
    })

    this.supportForm = this.dynamicFormService.createControl(this.fields, null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modelUid'])
      this.modelUid = changes['modelUid'].currentValue;
  }

  async getSubordinates(): Promise<User[]> {
    let users: User[] = []
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_SUBORDINATE_USERS,
        apolloNamespace: ApolloNamespace.uaa,
      });
      if (response?.data?.getSubordinateUsers?.code === 9000) {
        users = response?.data?.getSubordinateUsers?.dataList;
      } else {
        throw new Error(response.data.getSubordinateUsers?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage(e.message);
    }
    return users;
  }

  async submitForm(formData: AssignProcurementRequisitionDtoInput) {
    this.loading = true;
    try {
      const response: any = await this.apollo.mutate({
        mutation: ASSIGN_PROCUREMENT_REQ_TASK,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          assignment: formData
        }
      });
      if (response?.data?.assignProcurementRequisitionTask?.code === 9000) {
        this.notificationService.successMessage('Task assigned successfully');
        this.loading = false;
        this.taskDelegated.emit();
      } else {
        throw new Error(response.data.assignProcurementRequisitionTask?.message);
      }
    } catch (e) {
      this.loading = false;
      this.notificationService.errorMessage(e.message);
    }
  }
}
