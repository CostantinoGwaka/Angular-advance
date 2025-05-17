import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GraphqlService } from '../../services/graphql.service';
import { LayoutService } from '../../services/layout.service';
import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { ApplicationState } from 'src/app/store';
import { entityLabelConfig, EntityObjectTypeEnum, teamConfig, teamLabelConfig, TeamTypeEnum } from './store/team.model';
import { TableConfiguration } from "../components/paginated-data-table/paginated-table-configuration.model";
import {
  GET_TEAMS_BY_CHAIRMAN
} from "../../modules/nest-tender-evaluation/store/evaluation-commitee/evaluation-commitee.graphql";
import { InvitationLetterComponent } from '../components/invitation-letter/invitation-letter.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { AddUpdateTeamNewComponent } from './add-update-team/add-update-team-new.component';

import { TeamDetailComponent } from './team-detail/team-detail.component';
import { PaginatedTableExpandableRowComponent } from '../components/paginated-table-expandable-row/paginated-table-expandable-row.component';
import { SharedLayoutComponent } from '../components/shared-layout/shared-layout.component';
import {ApolloNamespace} from "../../apollo.config";

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss'],
  standalone: true,
  imports: [SharedLayoutComponent, PaginatedTableExpandableRowComponent, TeamDetailComponent, AddUpdateTeamNewComponent, ManageTeamComponent, InvitationLetterComponent]
})
export class TeamManagementComponent implements OnInit {
  @Input() teamType: TeamTypeEnum;
  @Input() entityType: EntityObjectTypeEnum;
  viewDetails: any;
  viewDetailsTitle: string = '';
  viewType = '';
  teamConfigValue: any = teamConfig;
  teamLabelValue: any = teamLabelConfig;
  entityLabelValue: any = entityLabelConfig;
  permissions = {
    delete: ''
  };
  tableConfigurations: TableConfiguration = {
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
      more: false,
      print: false,
      customPrimary: true,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: false,
    customPrimaryMessage: '',
    empty_msg: 'No Categories found',
  };

  teams: any[] = [];

  loadTeam: boolean = false;
  routeSub = Subscription.EMPTY;
  selectedUuid: string;
  memberUuid: string;

  query = GET_TEAMS_BY_CHAIRMAN;
  apolloNamespace = ApolloNamespace.submission;
  constructor(
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activeRoute.queryParams.subscribe(items => {
      this.viewDetails = !!items['action'];
      this.viewType = items['action'] ?? '';
      this.selectedUuid = items['id'] ?? '';
      this.memberUuid = items['member'] ?? '';
      if (this.viewType == 'add') {
        this.viewDetailsTitle = (this.selectedUuid ? ' Update ' : 'Create New ') + this.teamConfigValue[this.teamType];
      }
      // this.tableConfigurations.actionIcons.delete = this.isHPMU();
    })
  }

  mapFunction(item) {
    return {
      ...item,
      members: (item.members ?? []).length,
      customPrimaryMessage: 'Manage Team',
      actionButtons: {
        delete: item.approvalStatus == null,
      },
    }
  }

  isHPMU() {
    return this.storageService.getItem('userSystemAccessRoles').indexOf('HEAD_OF_PMU') >= 0;
  }
  onAdd() {
    let institutionUuid: string = this.storageService.getItem('institutionUuid');
    this.layoutService.openPanel({ action: 'add', teamType: this.teamType, entityType: this.entityType, institutionUuid: institutionUuid });
    this.viewDetailsTitle = 'Create New ' + this.teamConfigValue[this.teamType];
  }

  closeDetails(shouldUpdate: any = false) {
    this.layoutService.closePanel();
    if (shouldUpdate == true) {
      // this.getTasks();
    }
  }

  setPanelTitle(event: any) {
    this.viewDetailsTitle = event;
  }

  getTeams() {
    this.loadTeam = true;

    this.loadTeam = false;
  }

  getTasks() {
    // this.teams;
  }

  viewItem(event: any) {
    this.layoutService.openPanel({ action: 'view', id: event.uuid });
    this.viewDetailsTitle = 'View Team: ' + event.teamName;
  }

  updateItem(event: any) {
    this.layoutService.openPanel(
      {
        action: 'add',
        id: event.uuid,
        teamType: this.teamType,
        entityType: this.entityType,
        institutionUuid: event.institutionUuid
      });
    this.viewDetailsTitle = `Update Team: ${event.teamName}`;
  }

  customPrimary(event: any) {
    if (event.customPrimaryMessage == 'Manage Team') {
      this.layoutService.openPanel(
        {
          action: 'manage-team',
          id: event.uuid,
          teamType: this.teamType,
          entityType: this.entityType,
          institutionUuid: event.institutionUuid
        });
      this.viewDetailsTitle = `Manage Team: ${event.teamName}`;
    }
  }

  delete(event: any) {

  }

}
