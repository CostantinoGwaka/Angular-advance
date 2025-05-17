import { Component, Inject, Input, OnInit } from '@angular/core';
import { CONTRACT_GET_PE_USERS_BY_INSTITUTION_AND_ROLE_NAME } from 'src/app/modules/nest-contracts/store/vetting.graphql';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { GraphqlService } from '../../../../services/graphql.service';
import { NotificationService } from '../../../../services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { WorkflowTaskDefinition } from 'src/app/store/work-flow/work-flow-interfaces';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../loader/loader.component';

import { ApolloNamespace } from 'src/app/apollo.config';

export interface WorkflowUsersListData {
  task: WorkflowTaskDefinition;
  institutionUuid: String;
}

@Component({
  selector: 'app-workflow-users-list',
  templateUrl: './workflow-users-list.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    LoaderComponent,
    MatButtonModule
],
})
export class WorkflowUsersListComponent implements OnInit {
  loadingUsers: boolean = false;

  errorMessage: string = '';
  users: User[] = [];

  task: WorkflowTaskDefinition;
  institutionUuid: String;

  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) private _data: WorkflowUsersListData
  ) {
    this.task = _data.task;
    this.institutionUuid = _data.institutionUuid;
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    this.errorMessage = '';
    this.loadingUsers = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: CONTRACT_GET_PE_USERS_BY_INSTITUTION_AND_ROLE_NAME,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          procuringEntityUuid: this.institutionUuid,
          roleName: this.task.groupCommonName,
        },
      });
      if (response.data.results?.dataList) {
        this.users = response.data.results.dataList;

        if (this.users.length === 0) {
          this.errorMessage =
            'No users found for this task in your institution. You cannot see users of other institutions if this task is not assigned to your institution.';
        }


      }
    } catch (e) {

      this.notificationService.errorMessage('Error in getting users');
    }
    this.loadingUsers = false;
  }
}
