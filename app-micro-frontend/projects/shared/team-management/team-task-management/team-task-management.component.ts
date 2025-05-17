import { Component, Input, OnInit } from '@angular/core';
import { GraphqlService } from '../../../services/graphql.service';
import { GET_MY_TEAM_TASKS } from '../store/team.graphql';
import { getEntityName } from '../store/team.helpers';
import { TeamTypeEnum, EntityObjectTypeEnum } from '../store/team.model';
import { TeamDetailComponent } from '../team-detail/team-detail.component';
import { WorkFlowMainComponent } from '../../components/work-flow-main/work-flow-main.component';
import { NormalTableExpandableRowComponent } from '../../components/normal-table-expandable-row/normal-table-expandable-row.component';
import { SharedLayoutComponent } from '../../components/shared-layout/shared-layout.component';
import {ApolloNamespace} from "../../../apollo.config";

@Component({
    selector: 'app-team-task-management',
    templateUrl: './team-task-management.component.html',
    styleUrls: ['./team-task-management.component.scss'],
    standalone: true,
    imports: [SharedLayoutComponent, NormalTableExpandableRowComponent, WorkFlowMainComponent, TeamDetailComponent]
})
export class TeamTaskManagementComponent implements OnInit {
  @Input() teamType: TeamTypeEnum;
  @Input() entityType: EntityObjectTypeEnum;
  tableConfigurations = {
    tableColumns: [
      { name: 'entityNumber', label: 'Entity Number' },
      { name: 'teamName', label: 'Team Name' },
      { name: 'members', label: 'Members' }
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
    hideExport: false,
    customPrimaryMessage: 'Manage Team',
    empty_msg: 'No Categories found',
  };
  entityName: string;
  viewDetails: boolean;
  viewDetailsTitle: string;
  tableList: any[] = [];
  toggleLoader: boolean = false;
  constructor(private apollo: GraphqlService) { }

  ngOnInit(): void {
    this.entityName = getEntityName(this.entityType);
    this.getTask();

  }

  async getTask() {
    const response: any = await this.apollo.fetchData({
      query: GET_MY_TEAM_TASKS,
      apolloNamespace: ApolloNamespace.submission,
      variables: {
        teamType: this.teamType
      }
    });
    try {
      this.tableList = response.data.getMyTeamTasks;
    } catch (e) {
      console.error(e);
    }
    // this.loadingTender = false;
  }

  closeDetails() {

  }

  mapFunction(item) {
    return {
      ...item,
      members: item.members.length
    }
  }

  taskIsCompleted() {
    this.getTask().then();
  }

}
