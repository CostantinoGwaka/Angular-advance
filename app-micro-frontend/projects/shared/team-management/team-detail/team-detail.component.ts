import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GET_REPLACEMENT_AUDIT_LOGS, SEND_APPOINTMENT_LETTERS } from 'src/app/modules/nest-tender-evaluation/store/evaluation-commitee/evaluation-commitee.graphql';
import { GraphqlService } from '../../../services/graphql.service';
import { LayoutService } from '../../../services/layout.service';
import { NotificationService } from '../../../services/notification.service';
import { StorageService } from '../../../services/storage.service';
import { GET_TEAM_BY_UUID } from '../store/team.graphql';
import { getEntityName } from '../store/team.helpers';
import { EntityObjectTypeEnum, EntitySummary, Team, TeamTypeEnum } from '../store/team.model';
import { TeamManageService } from '../team-manage.service';
import { DateViewerComponent } from '../date-viewer/date-viewer.component';
import { ViewDetailsItemComponent } from '../../components/view-details-item/view-details-item.component';
import { TeamMemberViewerComponent } from '../../components/team-member-view/team-member-view.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';


@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  standalone: true,
  imports: [MatStepperModule, MatButtonModule, MatIconModule, LoaderComponent, TeamMemberViewerComponent, ViewDetailsItemComponent, DateViewerComponent, DatePipe]
})
export class TeamDetailComponent implements OnInit {
  team: Team;
  @Input() entityType: EntityObjectTypeEnum;
  @Input() teamType: TeamTypeEnum;
  @Input() selectedUuid: string;
  @Input() readOnly: boolean = false;
  entity: EntitySummary;
  userSystemAccessRoles: string;
  viewDetailsTitle: string;
  showConfirm: boolean;
  sendingLetters: boolean;
  entityName: string;
  member;
  replaceMember: boolean;
  loadingTender: boolean;
  committee: any;
  auditLogs = [];
  loadingAuditLogs: boolean;
  loadingMembers: boolean = false;
  constructor(
    private apollo: GraphqlService,
    private teamService: TeamManageService,
    private notificationService: NotificationService,
    private layoutService: LayoutService,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.entityName = getEntityName(this.entityType);
    if (this.selectedUuid) {
      this.getTeam().then();
      this.userSystemAccessRoles = this.storageService.getItem('userSystemAccessRoles');
    }
  }

  async getTeam() {
    this.loadingMembers = true;
    const response: any = await this.apollo.fetchData({
      query: GET_TEAM_BY_UUID,
      apolloNamespace: ApolloNamespace.submission,
      variables: {
        uuid: this.selectedUuid
      }
    });
    this.team = response.data.findTeamByUuid.data;
    if (this.team) {

      this.getEntity(this.team.entityUuid).then();
    }
    this.loadingMembers = false;
  }

  async getEntity(entityUuid: string): Promise<void> {
    this.entity = await this.teamService.getEntityByUuid(this.entityType, this.teamType, entityUuid);
  }

  viewMemberLetter(member: any): void {
    this.layoutService.openPanel({ action: 'letter', id: this.selectedUuid, member: member.uuid });
    this.viewDetailsTitle = 'Invitation letter';
  }

  replaceMemberAction(member: any): void {
    this.replaceMember = true;
    this.member = member;
  }

  onFormClosing(): void {
    this.replaceMember = false;
  }

  async afterUserReplaced(event: any) {
    await this.fetchCommitteeDetails();
    this.replaceMember = false;
  }

  updateItem(event: any) {
    this.layoutService.openPanel({
      action: 'add',
      entityType: this.entityType,
      id: event.uuid,
      entityUuid: this.entity.uuid,
      institutionUuid: event.procuringEntityUuid
    });
    this.viewDetailsTitle = `Update ${getEntityName(this.entityType)} Team: ${event.entityNumber}`;
  }

  isHPMU() {
    return this.userSystemAccessRoles?.indexOf('HEAD_OF_PMU') >= 0;
  }

  isPMU() {
    return this.userSystemAccessRoles?.indexOf('PROCUREMENT_OFFICER') >= 0;
  }

  isAO() {
    return this.userSystemAccessRoles?.indexOf('ACCOUNTING_OFFICER') >= 0;
  }

  isUser() {
    return this.userSystemAccessRoles?.indexOf('HEAD_OF_PMU') >= 0;
  }

  async sendAppointmentLetters() {
    try {
      this.sendingLetters = true;
      const response: any = await this.apollo.mutate({
        mutation: SEND_APPOINTMENT_LETTERS,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          evaluationTeamUuid: this.team.uuid
        }
      });
      if (response?.data?.sendAppointmentLetters?.code === 9000) {
        this.notificationService.successMessage("Appointment letters sent, successfully");
        this.showConfirm = false;
        this.sendingLetters = false;
        // await this.fetchCommitteeDetails();
      } else {
        this.showConfirm = false;
        this.sendingLetters = false;
        console.error(response?.data?.sendAppointmentLetters?.message);
        this.notificationService.errorMessage("Problem occurred while sending appointment letters, please try again....");
      }
    } catch (e) {
      console.error(e);
      this.showConfirm = false;
      this.sendingLetters = false;
      this.notificationService.errorMessage("Problem occurred while sending appointment letters, please try again....");
    }
  }

  async fetchCommitteeDetails() {
    try {
      this.loadingTender = true;
      const response: any = await this.apollo.fetchData({
        query: GET_TEAM_BY_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.selectedUuid
        }
      });
      this.committee = response?.data?.findTeamByUuid?.data;
      if (this.committee) {
        this.getEvaluationTeamsAuditLogs().then();
      }
      if (this.committee.tenderUuid) {
        await this.fetchTenderDetails(this.committee.tenderUuid);
      }
    } catch (e) {
      this.loadingTender = false;
    }
  }

  async getEvaluationTeamsAuditLogs() {
    this.auditLogs = [];
    this.loadingAuditLogs = true;
    if (this.committee) {
      try {
        const response: any = await this.apollo.fetchData({
          query: GET_REPLACEMENT_AUDIT_LOGS,
          apolloNamespace:ApolloNamespace.submission,
          variables: {
            committeeUuid: this.committee.uuid
          },
        });
        this.auditLogs = (response?.data?.getReplacedMembersByCommitteeUuid || [])
          .map((replacement: any) => {
            return {
              uuid: replacement.uuid,
              replacingUser: replacement.firstName + ' ' + replacement.middleName + ' ' + replacement.lastName,
              replacedBy: replacement.replacedBy.firstName + ' ' + replacement.replacedBy.middleName + ' ' + replacement.replacedBy.lastName,
              replacementReason: replacement.teamReplacementReason ? replacement.teamReplacementReason.name : '',
              createdAt: replacement.replacedBy.createdAt
            }
          });
        this.loadingAuditLogs = false;

      } catch (e) {
        console.error(e);
        this.loadingAuditLogs = false;
      }
    }
  }

  async fetchTenderDetails(tenderUuid: string) {

    this.getEntity(tenderUuid).then();
    // this.teamService.getEntityByUuid(

    // )
    // try {
    //   const response: any = await this.apollo.fetchData({
    //     query: GET_ENTIT,
    //     variables: {
    //       uuid: tenderUuid
    //     }
    //   });
    //   if (response?.data?.getMergedProcurementRequisitionByUuid?.code === 9000) {
    //     this.currentTender = response?.data?.getMergedProcurementRequisitionByUuid?.data?.mergedMainProcurementRequisition?.tender;
    //   } else {
    //     console.error(response?.data?.getMergedProcurementRequisitionByUuid?.message);
    //   }
    //   this.loadingTender = false;
    // } catch (e) {
    //   this.loadingTender = false;
    //   console.error(e);
    // }
  }



}
