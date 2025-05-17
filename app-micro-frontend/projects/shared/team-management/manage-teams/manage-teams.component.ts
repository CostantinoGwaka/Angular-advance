import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from '../../../services/graphql.service';
import { GET_TEAMS } from '../store/team.graphql';
import { TeamTypeEnum, EntityObjectTypeEnum } from '../store/team.model';

@Component({
  selector: 'app-manage-teams',
  templateUrl: './manage-teams.component.html',
  styleUrls: ['./manage-teams.component.scss'],
  standalone: true
})
export class ManageTeamsComponent implements OnInit {

  @Input() teamType: TeamTypeEnum;
  @Input() entityType: EntityObjectTypeEnum;
  tableConfigurations = {
    tableColumns: [
      { name: 'entityNumber', label: 'Entity Number' },
      { name: 'teamName', label: 'Team Name' },
      { name: 'startDate', label: 'Registration Number' },
      { name: 'endDate', label: 'Email' },
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
      more: true,
      print: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: false,
    customPrimaryMessage: 'Approve',
    empty_msg: 'No Categories found',
  };

  query = GET_TEAMS;
  constructor(private apollo: GraphqlService) { }

  ngOnInit(): void {
    this.getTask();
  }

  async getTask() {
    // const response: any = await this.apollo.fetchData({
    //   query: GET_PRE_QUALIFIATION_TEAM_TASKS
    // });
    //
    // try {
    // this.tenders = response.data.getMyPrequalificationTasks;
    // } catch (e) {
    //   console.error(e);
    // }
    // this.loadingTender = false;

  }

}
