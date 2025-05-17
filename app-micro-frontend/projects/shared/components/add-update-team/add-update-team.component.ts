import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  GET_CURRENT_FINANCIAL_YEAR_SIMPLIFIED
} from "src/app/modules/nest-app/store/tender-creation/tender-creation.graphql";
import {
  GET_PROCURING_ENTITY_PAGINATED_EVALUATION
} from "src/app/modules/nest-pe-management/store/institution/institution.graphql";
import { User, UserAccountTeam } from "src/app/modules/nest-uaa/store/user-management/user/user.model";
import { GraphqlService } from "../../../services/graphql.service";
import { NotificationService } from "../../../services/notification.service";
import { StorageService } from "../../../services/storage.service";
import { TeamSelectionModal, TeamService, TeamTypeEnum } from "../../../services/team.service";
import { FieldConfig, FieldType } from "../dynamic-forms-components/field.interface";
import * as _ from "lodash";
import {
  GET_PROCURING_ENTITY_USER_FOR_EVALUATION_UUID
} from "src/app/modules/nest-uaa/store/user-management/user/user.graphql";
import { Subscription } from "rxjs";
import * as moment from "moment";
import {
  GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI
} from "src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql";
import {
  GET_FRAMEWORKS_MAIN_WITHOUT_TEAMS,
  GET_TENDER_ENTITIES_WITHOUT_TEAM
} from "../../team-management/store/team.graphql";
import { EntityObjectTypeEnum } from "../../team-management/store/team.model";
import { CustomAlertBoxModel } from "../custom-alert-box/custom-alert-box.model";
import { SearchPipe } from "../../pipes/search.pipe";
import { SaveAreaComponent } from "../save-area/save-area.component";
import { HasPermissionDirective } from "../../directives/has-permission.directive";
import { NestMultiSelectComponent } from "../nest-multi-select/nest-multi-select.component";
import { PaginatedSelectComponent } from "../dynamic-forms-components/paginated-select/paginated-select.component";
import { MatDividerModule } from "@angular/material/divider";
import { CustomAlertBoxComponent } from "../custom-alert-box/custom-alert-box.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { LoaderComponent } from "../loader/loader.component";
import { JsonPipe, NgTemplateOutlet } from "@angular/common";
import { PaginatedDataTableComponent } from "../paginated-data-table/paginated-data-table.component";
import { ApolloNamespace } from "../../../apollo.config";
import { GET_THREE_RECENT_FINANCIAL_YEARS } from "../../../modules/nest-reports/store/reports/reports.graphql";

export enum CommitteeMemberPosition {
  CHAIRPERSON = 'CHAIRPERSON',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  PE_REPRESENTATIVE = 'PE_REPRESENTATIVE',
  MEMBER = 'MEMBER'
}

@Component({
  selector: 'app-add-update-team',
  templateUrl: './add-update-team.component.html',
  styleUrls: ['./add-update-team.component.scss'],
  standalone: true,
  imports: [LoaderComponent, NgTemplateOutlet, MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatInputModule, MatDatepickerModule, CustomAlertBoxComponent, MatDividerModule, PaginatedSelectComponent, NestMultiSelectComponent, HasPermissionDirective, SaveAreaComponent, SearchPipe, PaginatedDataTableComponent, JsonPipe]
})
export class AddUpdateTeamComponent implements OnInit, OnDestroy {

  @Input() type: string;
  @Input() team: any;
  financialYears: {
    uuid: string,
    code: string,
    active: boolean
  }[];
  selectedTeamEntityType: TeamSelectionModal;
  teamDto: {
    uuid?: string,
    entityType: string,
    mainEntityUuid: string,
    plannedEvaluationEndDate: string,
    plannedEvaluationStartDate: string,
    teamMemberDtos: {
      position: CommitteeMemberPosition,
      userUuid: string
    }[]
  } =
    {
      entityType: null,
      mainEntityUuid: '',
      plannedEvaluationEndDate: null,
      plannedEvaluationStartDate: null,
      teamMemberDtos: [{
        position: CommitteeMemberPosition.MEMBER,
        userUuid: ''
      }]
    };
  @Output() closeForm: EventEmitter<any> = new EventEmitter();
  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  institutionField: any = {
    type: FieldType.select,
    label: 'Select Institution',
    key: 'institutionUuid',
    query: GET_PROCURING_ENTITY_PAGINATED_EVALUATION,
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
  chairmanInstitutionField: FieldConfig = {
    type: FieldType.select,
    label: 'Select Chairman Institution',
    key: 'chairmanInstitutionUuid',
    query: GET_PROCURING_ENTITY_PAGINATED_EVALUATION,
    apolloNamespace: ApolloNamespace.uaa,
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

  yesterday = new Date();
  uatUsers: UserAccountTeam[] = [];
  uatChairmanUsers: UserAccountTeam[] = [];
  users: User[] | any[] = [];
  chairmanUsers: User[] | any[] = [];
  isValidSelection: boolean = false;
  loadingMembers: boolean = false;
  loadingChairmanUsers: boolean = false;
  selectedMembers: any[];
  loading: boolean = false;
  isSaving: boolean = false;
  tenderUuid: string;
  institutionUuid: string;
  chairmanInstitutionUuid: string;
  members: any[] = [];
  hasChairman: boolean = false;
  commiteeChairmanUuid: string;
  commiteeChairman: User | any;
  viewType: string;
  selectedUuid: string;
  viewDetails: boolean;
  currentSelectedFinancialYear?: string;
  loadingMessage?: string = '';
  loadingTenders: boolean = false;
  fetchingTenderDetail: boolean = false;
  tendersList: { name: string, uuid: string }[] = [];

  noDataAlert: CustomAlertBoxModel = {
    title: 'No Data found',
    buttonTitle: 'Try again',
    showButton: true,
    details: [
      {
        icon: 'info',
        message: 'No data found, Please click try again button to try again'
      },
      {
        icon: 'info',
        message: 'If this message still persist after refresh, Please check if you have tenders that are pending in opening.'
      }
    ]
  };

  selectedTeamType: string;
  entityTypeList: TeamSelectionModal[] = [
    {
      name: 'Tender',
      value: 'Evaluation',
      type: TeamTypeEnum.EVALUATION_TEAM,
      objectType: EntityObjectTypeEnum.TENDER
    },
    {
      name: 'Pre Qualification',
      value: 'Evaluation',
      type: TeamTypeEnum.EVALUATION_TEAM,
      objectType: EntityObjectTypeEnum.PLANNED_TENDER
    },
    {
      name: 'Framework',
      value: 'Framework',
      type: TeamTypeEnum.EVALUATION_TEAM,
      objectType: EntityObjectTypeEnum.FRAMEWORK
    },
  ]
  currentTender: any; /// to be mapped to Merged Requisition model
  searchChairPersonString: string;
  startDate: string;
  endDate: string;
  routeSub = Subscription.EMPTY;

  constructor(
    private apollo: GraphqlService,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private teamService: TeamService
  ) {

    this.yesterday.setDate(this.yesterday.getDate());

    this.getFinancialYears().then();
    this.getCurrentFinancialYear().then();
    this.routeSub = this.activeRoute.queryParams.subscribe(items => {
      this.viewDetails = !!items['action'];
      this.viewType = items['action'] ?? '';
      this.selectedUuid = items['id'] ?? '';
      this.type = items['type'] ?? '';
      this.tenderUuid = items['tenderUuid'] ?? '';
      this.institutionUuid = items['institutionUuid'] ?? '';

      this.teamDto.mainEntityUuid = this.tenderUuid;

      if (this.selectedUuid && this.type) {
        this.getTeam(this.type, this.selectedUuid).then();
      }
      if (this.tenderUuid) {
        this.getCurrentTender().then();
      }
    });

    // this.institutionField = {
    //   ...this.institutionField,
    //   disabled: true
    // };

    this.selectionOfItem(this.mapUpdatedUsers(this.members));
    this.hasChairman = this.hasChairmanMember(this.selectedMembers);
    this.commiteeChairman = this.selectedMembers.find((member: any) => member.position == 'CHAIRPERSON');
    // }
    this.sortMembers();
  }


  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  async getCurrentFinancialYear() {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_CURRENT_FINANCIAL_YEAR_SIMPLIFIED
      });
      this.currentSelectedFinancialYear = response.data.getCurrentFinancialYear.data.financialYear.code;
    } catch (e) {
      console.error(e);
    }
  }

  async getCurrentTender() {
    try {
      this.fetchingTenderDetail = true;
      this.loadingMessage = "Fetching tender details, Please wait...";
      const response: any = await this.apollo.fetchData({
        query: GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: this.tenderUuid
        }
      });
      if (response.data.getMergedProcurementRequisitionByUuid.code === 9000) {
        this.currentTender = response.data.getMergedProcurementRequisitionByUuid.data;
      } else {
        console.error(response.data.getMergedProcurementRequisitionByUuid.message);
      }
      this.fetchingTenderDetail = false;
    } catch (e) {
      console.error(e);
      this.fetchingTenderDetail = false;
    }
  }

  // async getValidTenders() {
  //
  //   this.loadingTenders = true;
  //   this.tendersList = await this.teamService.getValidTenderers(
  //     this.selectedTeamEntityType.value,
  //     this.currentSelectedFinancialYear
  //   );
  //   this.loadingTenders = false;
  // }

  async getTeam(type: string, uuid: string) {
    this.loading = true;
    this.loadingMessage = 'Fetching details, please wait';
    const response: any = await this.teamService.getTeamByUuid(type, uuid);

    if (response.data) {
      const data = response.data;
      this.teamDto.plannedEvaluationStartDate = data.plannedEvaluationStartDate;
      this.teamDto.plannedEvaluationEndDate = data.plannedEvaluationEndDate;
      this.selectedMembers = data.members.map((user: any) => {
        return {
          ...user,
          uuid: user.userUuid
        }
      });
      this.members = data.members.map((user: any) => {
        return {
          ...user,
          uuid: user.userUuid
        }
      });
      this.hasChairman = this.hasChairmanMember(this.selectedMembers);
      this.commiteeChairman = this.selectedMembers.find((member: any) => member.position == 'CHAIRPERSON');
      this.isValidSelection = this.checkValidSelection(this.selectedMembers);
      this.sortMembers();
      this.loading = false;
    }
  }

  sortMembers() {
    this.members = _.orderBy(this.members, ['position'], ['asc']);
    this.selectedMembers = _.orderBy(this.selectedMembers, ['position'], ['asc']);
  }


  mapUpdatedUsers(members: any[]) {
    return members.map((member: any) => {
      return {
        active: member.active,
        checkNumber: member.checkNumber,
        deleted: member.deleted,
        designation: member.designation,
        email: member.email,
        financialYearId: member.financialYearId,
        financialYearUuid: member.financialYearUuid,
        firstName: member.firstName,
        hasConflict: member.hasConflict,
        id: member.id,
        isExternal: member.isExternal,
        lastName: member.lastName,
        memberInstitution: member.memberInstitution,
        middleName: member.middleName,
        phoneNumber: member.phoneNumber,
        position: member.position,
        procuringEntityId: member.procuringEntityId,
        tenderId: member.tenderId,
        tenderNumber: member.tenderNumber,
        tenderUuid: member.tenderUuid,
        userId: member.userId,
        uuid: member.userUuid
      }
    });
  }

  ngOnInit(): void {

    if (this.team) {
      this.teamDto.uuid = this.team.uuid;
    }
  }

  ngOnChanges(): void {
    this.selectionOfItem(this.mapUpdatedUsers(this.members));
    this.hasChairman = this.hasChairmanMember(this.selectedMembers);
  }


  // Selected Items should be atleast 3 and in odd numbers
  checkValidSelection(items: any[]): boolean {
    return items.length % 2 != 0 && items.length > 1 && this.checkAppointments(items) && this.checkChairPerson(items);
  }

  // Check is appointment positon are selected
  checkAppointments(items: any[]) {
    let valid = true;
    try {
      items.forEach((item: any) => {
        if (!item.position) {
          valid = false;
        }
      });
    } catch (e) {
      return false;
    }
    return valid;
  }

  checkChairPerson(items: any[]) {
    let chairCount = 0;
    items.forEach((item: any) => {
      if (item.position == "CHAIRPERSON") {
        chairCount += 1;
      }
    });
    return chairCount == 1;
  }

  onSelectedChairman(event: any) {
    try {
      this.selectedMembers = this.selectedMembers.filter((member: any) => {
        return member.position != "CHAIRPERSON";
      });

      this.members = this.members.filter((member: any) => {
        return member.position != "CHAIRPERSON";
      });

      this.commiteeChairman = this.chairmanUsers.find((user: User) => user.uuid == event.value);

      this.members = [
        ...(this.members || []),
        { ...this.commiteeChairman, position: 'CHAIRPERSON' }
      ];
      this.hasChairman = true;
    } catch (e) {
      this.hasChairman = false;
      this.commiteeChairman = null;
    }
  }


  async getInstitutionMembers(event: any, eventType: any) {
    if (!event?.value) return;
    try {
      this.resetLoading(true, eventType);
      const response: any = await this.apollo.fetchData({
        query: GET_PROCURING_ENTITY_USER_FOR_EVALUATION_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          procuringEntityUuid: event.value,
          roleNames: event.value != localStorage.getItem('institutionUuid') ? [] : ['HEAD_OF_PMU', 'AUDITOR', 'ACCOUNTING_OFFICER'] // not user with these roles
        },
      });
      if (response.data?.getProcuringEntityUsersForEvaluation.code === 9000) {
        const data: UserAccountTeam[] =
          response?.data?.getProcuringEntityUsersForEvaluation?.dataList || [];
        const filteredUsers = (this.members.length > 0) ? data.filter((dataItem: any) =>
          !_.find(this.members, (member: any) => member.email == dataItem.email)) : data;

        if (eventType == 'chairMan') {
          this.uatChairmanUsers = filteredUsers
          this.chairmanUsers = this.uatChairmanUsers.map(user => ({
            procuringEntity: {
              id: user.procuringEntityId,
              uuid: user.procuringEntityUuid,
              name: user.procuringEntityName
            },
            uuid: user.uuid,
            phone: user.phoneNumber,
            department: {
              id: null,
              name: user.departmentName
            },
            jobTitle: user.jobTitle,
            fullName: user.fullName,
            designation: {
              designationName: user.jobTitle
            },
            email: user.email
          }));
        } else {
          this.uatUsers = filteredUsers;
          this.users = this.uatUsers.map(user => ({
            procuringEntity: {
              id: user.procuringEntityId,
              uuid: user.procuringEntityUuid,
              name: user.procuringEntityName
            },
            uuid: user.uuid,
            phone: user.phoneNumber,
            department: {
              id: null,
              name: user.departmentName
            },
            jobTitle: user.jobTitle,
            fullName: user.fullName,
            designation: {
              designationName: user.jobTitle
            },
            email: user.email
          }))
        }
      }
      this.resetLoading(false, eventType);
    } catch (e) {
      console.error(e);
      this.resetLoading(false, eventType);
    }
  }

  resetLoading(action: boolean, eventType: any) {
    if (eventType == 'chairMan') {
      this.loadingChairmanUsers = action;
    } else {
      this.loadingMembers = action;
    }
  }


  changeChairperson() {
    this.hasChairman = false;
    this.commiteeChairman = null;
  }

  filterPELeaders(users: any[]) {
    const institutionUuid = this.storageService.getItem('institutionUuid');
    if (institutionUuid != null) {
      /** To filter HPMU and AO also filter deleted accounts */
      users = users.filter(user => {
        if (user.procuringEntity.uuid == institutionUuid && !user.email.startsWith('DELETED_')) {
          return !(
            user.rolesListStrings.includes('HEAD_OF_PMU') ||
            user.rolesListStrings.includes('AUDITOR') ||
            user.rolesListStrings.includes('ACCOUNTING_OFFICER'
            )
          );
        } else if (user.procuringEntity.uuid != institutionUuid && !user.email.startsWith('DELETED_')) {
          return user;
        }
      });
    }
    return users;
  }

  async onSelectedTender(event: any) {
    this.teamDto.mainEntityUuid = event.value;
    this.teamDto = this.prepareDto(this.selectedMembers, this.teamDto);
  }

  selectionOfItem(event: any) {
    this.isValidSelection = this.checkValidSelection(event);
    this.selectedMembers = event;
    this.teamDto = this.prepareDto(this.selectedMembers, this.teamDto);
    this.hasChairman = this.hasChairmanMember(this.selectedMembers);
  }

  closeOpenModal(load = false) {
    this.closeForm.emit(load);
  }

  cancel() {
    this.onCancel.emit();
  }

  async save() {
    try {
      this.isSaving = true;
      const data: any = await this.teamService.createTeamByEntityType(
        this.selectedTeamEntityType.objectType,
        this.teamDto
      );

      if (data.code == 9000) {
        this.notificationService.successMessage("Evaluation team created successfully");
        this.closeOpenModal(true);
      } else {
        console.error(data.message);
        this.notificationService.errorMessage(data.message ?? 'Problem occurred, please try again');
      }
      this.isSaving = false;
    } catch (e) {
      console.error(e.message);
      this.isSaving = false;
      this.notificationService.errorMessage('Problem occurred, please try again');

    }
  }

  positionChanged(event: any) {
    this.isValidSelection = this.checkValidSelection(event);
    this.selectedMembers = event;
    this.teamDto = this.prepareDto(this.selectedMembers, this.teamDto);
    this.hasChairman = this.hasChairmanMember(this.selectedMembers);
  }

  prepareDto(selectedMembers: any[], teamDto: any, flag = 'add'): any {
    teamDto.teamMemberDtos = (selectedMembers || []).map((userItem: any) => {
      return {
        userUuid: flag == 'update' ? userItem.uuid : userItem.uuid,
        position: userItem.position
      };
    });
    return teamDto;
  }

  onCancelForm() {
    this.closeOpenModal();
  }

  hasChairmanMember(items: any): boolean {
    return _.find(items, (item: any) => item.position == 'CHAIRPERSON') != null;
  }

  onSelectedEntityType(event) {
    this.selectedTeamEntityType = event;
    this.teamDto.plannedEvaluationStartDate = null;
    this.teamDto.plannedEvaluationEndDate = null;
    this.teamDto.mainEntityUuid = null;
    this.teamDto.teamMemberDtos = [];
  }

  updatePlannedDate(value, input) {
    if (input == 'startDate') {
      this.teamDto.plannedEvaluationStartDate = this.formatDate(value);
    } else {
      this.teamDto.plannedEvaluationEndDate = this.formatDate(value);
    }

    if (this.teamDto.plannedEvaluationStartDate && this.teamDto.plannedEvaluationEndDate) {
      this.getTeamsBasedOnEntityType(this.selectedTeamEntityType.objectType).then();
    }
  }

  formatDate(dateReceived: any, format: string = 'YYYY-MM-DD') {
    if (typeof dateReceived === 'string' && dateReceived !== '') {
      dateReceived = new Date(dateReceived);
    }
    return dateReceived ? moment(dateReceived).format(format) : undefined;
  }

  async getTeamsBasedOnEntityType(entityType: EntityObjectTypeEnum) {
    switch (entityType) {
      case EntityObjectTypeEnum.FRAMEWORK: {
        await this.getFrameworksMainWithoutTeams();
        break;
      }
      default:
        await this.getEntitiesWithoutTeamType(this.currentSelectedFinancialYear);
        break;
    }
  }

  async getFrameworksMainWithoutTeams() {
    try {
      this.loadingTenders = true;
      let response: any = await this.apollo.fetchData({
        query: GET_FRAMEWORKS_MAIN_WITHOUT_TEAMS,
        apolloNamespace: ApolloNamespace.submission,
      });
      const dataList = response.data.getFrameworksMainWithoutTeams.data || [];
      this.tendersList = dataList.map((tender: any) => {
        return {
          name: "(" + tender.lotNumber + ") - " + tender.lotDescription,
          uuid: tender.uuid
        }
      });

      this.loadingTenders = false;
    } catch (e) {
      console.error(e);
      this.loadingTenders = false;
    }
  }


  async getEntitiesWithoutTeamType(financialYear: string) {
    try {
      this.loadingTenders = true;
      let response: any = await this.apollo.fetchData({
        query: GET_TENDER_ENTITIES_WITHOUT_TEAM,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          teamType: this.selectedTeamEntityType.type,
          entityObjectType: this.selectedTeamEntityType.objectType,
          financialYearCode: financialYear,
        },
      });
      const dataList = response.data.getEntitiesWithoutTeamAssignment.dataList || [];

      this.tendersList = dataList.map((tender: any) => {
        return {
          name: "(" + tender.identificationNumber + ") - " + tender.name,
          uuid: tender.uuid
        }
      });
      this.loadingTenders = false;
    } catch (e) {
      console.error(e);
      this.loadingTenders = false;
    }
  }

  refreshData() {
    this.getTeamsBasedOnEntityType(this.selectedTeamEntityType.objectType).then();
  }

  async getFinancialYears() {
    try {
      this.loading = true;
      const finaResults: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_THREE_RECENT_FINANCIAL_YEARS
      });

      this.financialYears = finaResults?.data?.getThreeRecentFinancialYears?.dataList;
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  selectFinancialYear(event: string) {
    this.currentSelectedFinancialYear = event;
  }
}
