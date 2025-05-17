import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import {
  TendererContractRole,
  TendererWorkExperience
} from "../../../../../modules/nest-tenderer/store/settings/tenderer-work-experience/tenderer-work-experience.model";
import * as fromGraphql from "../../../../../modules/nest-tenderer/store/settings/tenderer-work-experience/tenderer-work-experience.graphql";
import { TableConfiguration } from "../../../paginated-data-table/paginated-table-configuration.model";
import { ReplacePipe } from '../../../../pipes/replace.pipe';
import { FullDataTableComponent } from '../../../full-data-table/full-data-table.component';
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';



@Component({
  selector: 'view-work-experience',
  templateUrl: './view-work-experience.component.html',
  styleUrls: ['./view-work-experience.component.scss'],
  standalone: true,
  imports: [ViewDetailsItemComponent, FullDataTableComponent, ReplacePipe]
})
export class ViewWorkExperienceComponent implements OnInit {
  @Input() selectedUuid: string;
  @Input() selectedWorkExperience: TendererWorkExperience;
  @Output() closeForm = new EventEmitter<boolean>();
  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'contractRole', label: 'Role Performed' },
      { name: 'contractActivity', label: 'Activity performed' },
    ],
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: true,
    useFullObject: true,
    showBorder: false,
    allowPagination: false,
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
    empty_msg: 'No data found',
  };
  fetchingItem = false;
  fetchingAttachment: boolean;
  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    if (this.selectedUuid) {
      this.initiateUpdate().then();
    }
  }

  async initiateUpdate() {
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: fromGraphql.GET_TENDERER_WORK_EXPERIENCE_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.selectedUuid,
        }
      });
      if (response?.data?.findTendererWorkExperienceByUuid?.code === 9000) {
        const values: TendererWorkExperience = response?.data?.findTendererFinancialStatementByUuid?.data;
        if (values) {
          this.selectedWorkExperience = values;
        }
      } else {
        this.notificationService.errorMessage('Failed to fetch records');
      }
      this.fetchingItem = false;
    } catch (e) {
      this.notificationService.errorMessage('Failed to fetch records');
      this.fetchingItem = false;
      throw new Error(e);
    }
  }

  mapFunction(item: TendererContractRole) {
    return {
      ...item,
      contractRole: item.contractRole.name
    };
  }

}
