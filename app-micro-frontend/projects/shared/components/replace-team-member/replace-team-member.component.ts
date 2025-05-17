import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GET_PROCURING_ENTITY_PAGINATED } from 'src/app/modules/nest-pe-management/store/institution/institution.graphql';
import { GET_USERS_BY_INSTITUTION_BY_UUID } from 'src/app/modules/nest-uaa/store/user-management/user/user.graphql';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import { StorageService } from '../../../services/storage.service';
import { FieldConfig, FieldType } from 'src/app/shared/components/dynamic-forms-components/field.interface';
import * as _ from 'lodash';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { GET_REPLACEMENT_REASONS } from 'src/app/modules/nest-tender-evaluation/store/team-replacement-reason/team-replacement-reason.graphql';
import { TeamService } from '../../../services/team.service';
import { SearchPipe } from '../../pipes/search.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderComponent } from '../loader/loader.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatedSelectComponent } from '../dynamic-forms-components/paginated-select/paginated-select.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-replace-team-member-form',
  templateUrl: './replace-team-member.component.html',
  styleUrls: ['./replace-team-member.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatDividerModule, PaginatedSelectComponent, FormsModule, LoaderComponent, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, SearchPipe]
})
export class ReplaceTeamMemberFormComponent implements OnInit {
  @Input() memberToReplace: any;
  @Input() commitee: string;
  @Input() type: string;
  @Output() onCloseForm: EventEmitter<any> = new EventEmitter();
  @Output() onUserReplaced: EventEmitter<any> = new EventEmitter();
  institutionUuid: string;
  institutionField: FieldConfig = {
    type: FieldType.select,
    label: 'Select Institution',
    key: 'institutionUuid',
    query: GET_PROCURING_ENTITY_PAGINATED,
    searchFields: ['name'],
    options: [],
    optionName: 'name',
    optionValue: 'uuid',
    mapFunction: (item) => {
      return ({
        uuid: item.uuid,
        name: item.name
      });
    },
    useObservable: true,
    validations: [],
    rowClass: 'col12',
  };

  replacementReasonUuid: string;
  replacementReasonField: FieldConfig = {
    type: FieldType.select,
    label: 'Select Replacement Reason',
    key: 'institutionUuid',
    query: GET_REPLACEMENT_REASONS,
    searchFields: ['name'],
    options: [],
    optionName: 'name',
    optionValue: 'uuid',
    mapFunction: (item) => {
      return ({
        uuid: item.uuid,
        name: item.name
      });
    },
    useObservable: true,
    validations: [],
    rowClass: 'col12',
  };

  replacementReasons: { uuid: string, name: string, description: string }[] = [];
  users: User[] = [];
  searchString: string;
  selected: any = {};
  replacementReason: string;
  selectedUuid: string;
  institutionName: string;

  loadingInstitution: boolean = false;
  replacingmember: boolean = false;
  constructor(
    private apollo: GraphqlService,
    private teamService: TeamService,
    private notificationService: NotificationService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
  }

  async onSelectedInstitution(event: any) {
    this.loadingInstitution = true;
    const response: any = await this.apollo.fetchData({
      query: GET_USERS_BY_INSTITUTION_BY_UUID,
      apolloNamespace: ApolloNamespace.uaa,
      variables: {
        procuringEntityId: event.value
      }
    });
    try {
      const data = response?.data?.getAllUsersByProcuringEntityUuid?.data;
      if (data) {
        this.users = this.filterPELeaders(data);
      }
    } catch (e) {
      this.notificationService.errorMessage(e);
    }

    this.loadingInstitution = false;
  }

  onSelectedReplacement($event: any) {
    // this.replacementReasonUuid = $event.value;
  }

  // async replaceMember(){
  //   const response: any = await this.apollo.mutate({
  //     mutation: REPLACE_EVALUATION_COMMITTE,
  //     variables: {
  //       memberDto:{
  //         position:'',
  //         userUuid:'',

  //       },
  //       committeeUuid:''
  //     }
  //   });
  //
  // }

  filterPELeaders(users: any) {
    const institutionUuid = this.storageService.getItem('institutionUuid');
    if (institutionUuid != null) {
      users = _.filter(users, (user: any) => {
        return (user.procuringEntity.uuid == institutionUuid && !_.find(user.rolesList, (role: any) => {
          return role.displayName == 'HEAD OF PMU' || role.displayName == 'ACCOUNTING OFFICER';
        }) || user.procuringEntity.uuid != institutionUuid);
      });
    }
    return users;
  }

  checkChanged(event: any) {
    this.selected = {};
    if (event.checked == true) {
      this.selected[event.source.value] = event.checked;
      this.selectedUuid = event.source.value;
    } else {
      this.selectedUuid = null;
    }
  }

  closeForm() {
    this.selectedUuid = null;
    this.onCloseForm.emit();
  }

  async saveReplacement() {
    this.replacingmember = true;
    const response: any = await this.teamService.teamMemberReplacement(this.type, {
      memberToReplace: this.memberToReplace,
      selectedUuid: this.selectedUuid,
      replacementReasonUuid: this.replacementReasonUuid
    })
    // const response: any = await this.apollo.mutate({
    //   mutation: REPLACE_EVALUATION_COMMITTE,
    //   variables:{
    //     memberDto:{
    //       position: this.memberToReplace.position,
    //       userUuid:this.selectedUuid,
    //       replacementReasonUuid:this.replacementReasonUuid
    //     },
    //     committeeUuid:this.memberToReplace.uuid
    //   }
    // });
    // if (response.data.replaceTenderEvaluationCommitteeMember.code == 9000){
    //   this.notificationService.successMessage(response.data.replaceTenderEvaluationCommitteeMember.message);
    //   this.onUserReplaced.emit();
    // } else {
    //   this.notificationService.errorMessage(response.data.replaceTenderEvaluationCommitteeMember.message);
    // }
    if (response.code == 9000) {
      this.notificationService.successMessage(response.message);
      this.onUserReplaced.emit();
    } else {
      this.notificationService.errorMessage(response.message);
    }
    this.replacingmember = false;
  }
}
