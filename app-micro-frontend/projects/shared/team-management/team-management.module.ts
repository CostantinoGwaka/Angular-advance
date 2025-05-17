import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { SharedModule } from '../shared.module';
import { AddUpdateTeamNewComponent } from './add-update-team/add-update-team-new.component';
import { DateViewerComponent } from './date-viewer/date-viewer.component';
import { DeclarationOfInterestComponent } from './declaration-of-interest/declaration-of-interest.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { ManageTeamsComponent } from './manage-teams/manage-teams.component';
import { ReplaceTeamMemberComponent } from './replace-team-member/replace-team-member.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamManagementComponent } from './team-management.component';
import { TeamMemberViewComponent } from './team-member-view/team-member-view.component';
import { TeamTaskManagementComponent } from './team-task-management/team-task-management.component';

@NgModule({
    imports: [CommonModule, SharedModule, TeamManagementComponent,
        AddUpdateTeamNewComponent,
        TeamTaskManagementComponent,
        ManageTeamsComponent,
        TeamDetailComponent,
        ManageTeamComponent,
        DeclarationOfInterestComponent,
        TeamMemberViewComponent,
        ReplaceTeamMemberComponent,
        DateViewerComponent],
    exports: [
        TeamManagementComponent,
        AddUpdateTeamNewComponent,
        TeamTaskManagementComponent,
        DeclarationOfInterestComponent,
        DateViewerComponent,
        SharedModule,
    ],
})
export class TeamManagementModule { }
