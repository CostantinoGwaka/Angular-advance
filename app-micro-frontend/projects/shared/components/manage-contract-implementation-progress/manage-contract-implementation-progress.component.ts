import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ContractImplementationActivity, ContractImplementationProgressRequestDtoInput
} from "../../../modules/nest-contracts/store/contract-implementation/contract-implementation.model";
import {
  MainDynamicFormComponent
} from "../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component";
import {FieldConfig} from "../dynamic-forms-components/field.interface";
import * as formConfigs
  from "../../../modules/nest-contracts/contracts-implementation/contract-implementation-activity-dialog/contract-implementation-activity-dialog.form";
import {UntypedFormGroup} from "@angular/forms";
import {DynamicFormService} from "../dynamic-forms-components/dynamic-form.service";
import {GraphqlService} from "../../../services/graphql.service";
import {
  CREATE_CONTRACT_IMPLEMENTATION_PROGRESS, GET_CONTRACT_IMPLEMENTATION_PROGRESS_DATA
} from "../../../modules/nest-contracts/store/contract-implementation/contract-implementation.graph";
import {NotificationService} from "../../../services/notification.service";
import { AsyncPipe, JsonPipe } from "@angular/common";
import {
  DepartmentalNeedDetailComponent
} from "../../../modules/nest-app/app-departmental-need/departmental-need-detail/departmental-need-detail.component";
import {
  PaginatedTableExpandableRowComponent
} from "../paginated-table-expandable-row/paginated-table-expandable-row.component";
import {ApolloNamespace} from "../../../apollo.config";
import {MatIcon} from "@angular/material/icon";
import {ViewDetailsItemComponent} from "../view-details-item/view-details-item.component";
import {MustHaveFilter} from "../paginated-data-table/must-have-filters.model";

@Component({
  selector: 'app-manage-contract-implementation-progress',
  standalone: true,
  imports: [
    MainDynamicFormComponent,
    AsyncPipe,
    DepartmentalNeedDetailComponent,
    PaginatedTableExpandableRowComponent,
    JsonPipe,
    MatIcon,
    ViewDetailsItemComponent
],
  templateUrl: './manage-contract-implementation-progress.component.html',
  styleUrl: './manage-contract-implementation-progress.component.scss'
})
export class ManageContractImplementationProgressComponent implements OnInit{
  @Input()
  contractImplementationActivity: ContractImplementationActivity;

  loading: boolean = false;
  showAddForm: boolean = false;
  fields: FieldConfig[] = formConfigs.contractImplementationProgressFields;
  form: UntypedFormGroup;
  contractImplementationProgress = GET_CONTRACT_IMPLEMENTATION_PROGRESS_DATA;
  apolloNamespace = ApolloNamespace.contract;
  resetTable: boolean = false;
  @Output()
  emitTotalRecords: EventEmitter<number> = new EventEmitter();
  tableConfigurations = {
    tableColumns: [
      { name: 'progressStartDate', label: 'Progress Start Date' },
      { name: 'progressEndDate', label: 'Progress End Date' },
      { name: 'percentageCompleted', label: 'Percent Completed' },
    ],
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: true,
    useFullObject: true,
    showBorder: true,
    allowPagination: true,
    actionIcons: {
      edit: false,
      delete: false,
      more: false,
      print: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    customPrimaryMessage: 'Activate',
    empty_msg: 'No record found',
  };
  mustHaveFilters: MustHaveFilter[] = [];
  @Input() readOnly: boolean = false;

  constructor(
    private dynamicFormService: DynamicFormService,
    private apollo: GraphqlService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.initializer().then()
  }

  async initializer() {
    this.mustHaveFilters = [
      {
        fieldName: 'contractImplementationActivity.uuid',
        operation: 'EQ',
        value1: this.contractImplementationActivity?.uuid
      }
    ]
  }

  onAddContractActivityProgress() {
    this.form = this.dynamicFormService.createControl(this.fields, null);
    this.showAddForm = true;
  }

  closeForm() {
    this.showAddForm = false;
    this.form = undefined;
  }

  async createContractImplementationProgress(formData: any) {
    try {
      this.loading = true;
      const dataToSave: ContractImplementationProgressRequestDtoInput = {
        ...formData
      }
      const response: any = await this.apollo.mutate({
        mutation: CREATE_CONTRACT_IMPLEMENTATION_PROGRESS,
        apolloNamespace: ApolloNamespace.contract,
        variables: {
          implementationActivityUuid: this.contractImplementationActivity?.uuid,
          contractImplementationProgressRequestDto: [
            {
              ...dataToSave
            }
          ]
        }
      });
      if (response.data.createContractImplementationProgress.code == 9000) {
        this.notificationService.successMessage(
          'Contract activity implementation progress has been saved successfully.'
        );
        this.closeForm();
      } else {
        this.notificationService.errorMessage(
          response?.data?.createContractImplementationProgress?.message ??
          'Failed to create activity implementation progress, Please try again');
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
      this.notificationService.errorMessage('Failed to create activity implementation progress, Please try again');
    }
  }

  checkTotalRecords(totalRecords: number) {
    this.emitTotalRecords.emit(totalRecords);

  }
}
