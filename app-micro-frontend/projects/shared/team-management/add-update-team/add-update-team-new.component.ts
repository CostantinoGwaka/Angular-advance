import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	QueryList,
	ViewChildren
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { GET_CURRENT_FINANCIAL_YEAR_SIMPLIFIED } from 'src/app/modules/nest-app/store/tender-creation/tender-creation.graphql';
import { GET_PROCURING_ENTITY_PAGINATED_EVALUATION } from 'src/app/modules/nest-pe-management/store/institution/institution.graphql';
import {
	GET_MERGED_PROCUREMENT_REQUISITION_DATA_FOR_TEAM_PAGINATED,
	GET_MERGED_REQUISITION_PENDING_AWARD_PAGINATED_BY_TENDER_STATE,
	GET_MERGED_REQUISITION_PENDING_AWARD_PAGINATED_BY_TENDER_STATE_NEGOTIATION,
} from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { GET_TENDER_WINNER_FOR_NEGOTIATION } from 'src/app/modules/nest-tenderer/store/submission/submission.graphql';
import { GET_USERS_BY_INSTITUTION_BY_UUID } from 'src/app/modules/nest-uaa/store/user-management/user/user.graphql';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import { StorageService } from '../../../services/storage.service';
import { TeamSelectionModal, TeamService } from '../../../services/team.service';
import {
	FieldConfig,
	FieldType,
} from '../../components/dynamic-forms-components/field.interface';
import {
	GET_ENTITIES_WITHOUT_TEAM,
	GET_FRAMEWORKS_WITHOUT_TEAMS,
} from '../store/team.graphql';
import { getEntityName } from '../store/team.helpers';
import {
	EntityObjectTypeEnum,
	NegotiationTeamDto,
	TeamDto,
	TeamTypeEnum,
} from '../store/team.model';
import { TeamManageService } from '../team-manage.service';
import { SettingsService } from '../../../services/settings.service';
import { SaveAreaComponent } from '../../components/save-area/save-area.component';
import { NestMultiSelectComponent } from '../../components/nest-multi-select/nest-multi-select.component';
import { SelectComponent } from '../../components/dynamic-forms-components/select/select.component';
import {
	PaginatedSelectComponent
} from '../../components/dynamic-forms-components/paginated-select/paginated-select.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LoaderComponent } from '../../components/loader/loader.component';

import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe, JsonPipe, NgTemplateOutlet } from '@angular/common';
import { DateViewerComponent } from "../date-viewer/date-viewer.component";
import {
	MainDynamicFormComponent
} from "../../components/dynamic-forms-components/main-dynamic-form/main-dynamic-form.component";
import { NegoDatePickerComponent } from "./nego-date-picker/nego-date-picker.component";
import {
	GET_FRAMEWORK_LOTS_BY_FRAMEWORK_NEGOTIATION
} from '../../../modules/nest-tender-award/store/pending-tender-award/pending-tender-awards.graphql';

@Component({
	selector: 'app-add-update-team-new',
	templateUrl: './add-update-team-new.component.html',
	styleUrls: ['./add-update-team-new.component.scss'],
	standalone: true,
	imports: [
		MatDividerModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		FormsModule,
		LoaderComponent,
		MatSelectModule,
		MatOptionModule,
		PaginatedSelectComponent,
		SelectComponent,
		NestMultiSelectComponent,
		SaveAreaComponent,
		JsonPipe,
		DateViewerComponent,
		MainDynamicFormComponent,
		NegoDatePickerComponent,
		CurrencyPipe,
		NgTemplateOutlet,
	],
})
export class AddUpdateTeamNewComponent implements OnInit, OnChanges {
	@Input() entityType: EntityObjectTypeEnum;
	@Input() teamType: any;
	@Input() team: any;
	teamDto: TeamDto = {
		entityType: null,
		entityUuid: null,
		teamType: null,
		submissionUuid: null,
		plannedNumberOfDays: null,
		plannedEvaluationEndDate: null,
		plannedEvaluationStartDate: null,
		teamMemberDtos: [],
	};
	@Output() closeForm: EventEmitter<any> = new EventEmitter();
	@Output() onCancel: EventEmitter<any> = new EventEmitter();
	@Output() onSave: EventEmitter<any> = new EventEmitter();
	@ViewChildren('pickerRefs') pickerRefs!: QueryList<ElementRef>;
	institutionField: any = {
		type: FieldType.select,
		label: 'Select Institution',
		key: 'institutionUuid',
		query: GET_PROCURING_ENTITY_PAGINATED_EVALUATION,
		apolloNamespace: ApolloNamespace.uaa,
		searchFields: ['name'],
		options: [],
		optionName: 'name',
		optionValue: 'uuid',
		mapFunction: (item) => {
			return {
				uuid: item.uuid,
				name: item.name,
			};
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
			return {
				uuid: item.uuid,
				name: item.name,
			};
		},
		useObservable: true,
		validations: [],
		rowClass: 'col12',
	};

	secretaryInstitutionField: FieldConfig = {
		type: FieldType.select,
		label: 'Select Secretary Institution',
		key: 'secretaryInstitutionUuid',
		query: GET_PROCURING_ENTITY_PAGINATED_EVALUATION,
		apolloNamespace: ApolloNamespace.uaa,
		searchFields: ['name'],
		options: [],
		optionName: 'name',
		optionValue: 'uuid',
		mapFunction: (item) => {
			return {
				uuid: item.uuid,
				name: item.name,
			};
		},
		useObservable: true,
		validations: [],
		rowClass: 'col12',
	};
	tenderField?: FieldConfig;
	usersField: FieldConfig = {
		type: FieldType.select,
		label: 'Select',
		key: 'userUid',
		options: [],
		rowClass: 'col12',
	};
	secretaryUserField: FieldConfig = {
		type: FieldType.select,
		label: 'Select',
		key: 'userUid',
		options: [],
		rowClass: 'col12',
	};

	entityTypeList: TeamSelectionModal[] = [
		{
			name: 'Tender',
			value: 'Evaluation',
			type: TeamTypeEnum.NEGOTIATION_TEAM,
			objectType: EntityObjectTypeEnum.TENDER
		},
		{
			name: 'Framework',
			value: 'Framework',
			type: TeamTypeEnum.NEGOTIATION_TEAM,
			objectType: EntityObjectTypeEnum.FRAMEWORK
		},
	]

	@Input() entityName: string;
	@Input() teamTypeName: string;
	yesterday = new Date();
	chairmanField: FieldConfig;
	users: User[] = [];
	chairmanUsers: User[] = [];
	secretaryUsers: User[] = [];
	isValidSelection: boolean = false;
	loadingChairmanUsers: boolean = false;
	loadingSecretaryUsers: boolean = false;
	loadSubmissions: boolean = false;
	winner: any;
	selectedMembers: any[];
	loading: boolean = false;
	isSaving: boolean = false;
	entityUuid: string;
	defaultInstitutionUuid: string;
	institutionUuid: string;
	chairmanInstitutionUuid: string;
	secretaryInstitutionUuid: string;
	members: any[] = [];
	hasChairman: boolean = false;
	hasSecretary: boolean = false;
	commiteeChairmanUuid: string;
	committeeSecretaryUuid: string;
	commiteeChairman: User | any;
	committeeSecretary: User | any;
	submissionUuid: string;
	viewType: string;
	selectedUuid: string;
	selectedTeamEntityType: string;
	viewDetails: boolean;
	currentSelectedFinancialYear?: string;
	loadingTenders: boolean = false;
	tendersList: {
		name: string;
		uuid: string;
		entityUuid?: string;
		identificationNumber?: string;
		description?: string;
	}[] = [];
	currentTender: any; /// to be mapped to Merged Requisition model
	searchChairpesonString: string;
	searchSecretaryString: string;
	startDate: string;
	endDate: string;
	routeSub = Subscription.EMPTY;

	constructor(
		private apollo: GraphqlService,
		private activeRoute: ActivatedRoute,
		private notificationService: NotificationService,
		private storageService: StorageService,
		private teamService: TeamService,
		private teamManageService: TeamManageService,
		private settingsService: SettingsService,
	) {
		this.yesterday.setDate(this.yesterday.getDate());

		this.getCurrentFinancialYear().then();
		this.routeSub = this.activeRoute.queryParams.subscribe((items) => {
			this.viewDetails = !!items['action'];
			this.viewType = items['action'] ?? '';
			this.selectedUuid = items['id'] ?? '';
			this.teamType = items['teamType'] ?? '';
			this.entityUuid = items['entityUuid'] ?? '';
			this.entityType = items['entityType'] ?? '';
			this.institutionUuid = items['institutionUuid'] ?? '';
			this.defaultInstitutionUuid = items['institutionUuid'] ?? null;

			if (this.selectedUuid) {
				this.getTeam(this.selectedUuid).then();
				// this.entityUuid = this.selectedUuid;
			}

			if (this.entityUuid && this.teamType && this.entityUuid) {
				this.getCurrentEntity(
					this.teamType,
					this.entityType,
					this.entityUuid,
				).then();
			}
			this.teamDto.entityUuid = this.entityUuid;
			this.teamDto.teamType = this.teamType;
			this.teamDto.entityType = this.entityType;
		});

		this.selectionOfItem(this.mapUpdatedUsers(this.members));
		this.hasChairman = this.hasChairmanMember(this.selectedMembers);
		this.commiteeChairman = this.selectedMembers.find(
			(member: any) => member.position == 'CHAIRPERSON',
		);
		this.sortMembers();
	}

	ngOnDestroy(): void {
		this.routeSub.unsubscribe();
	}

	ngAfterViewInit() {
		// Access each date picker instance dynamically
		this.pickerRefs.forEach((picker, index) => {
			console.log(`Date picker for element ${index + 1}:`, picker);
		});
	}


	async getCurrentFinancialYear() {
		this.loadingTenders = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_CURRENT_FINANCIAL_YEAR_SIMPLIFIED,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					procuringEntityUuid: this.storageService.getItem('institutionUuid'),
				},
			});

			if (
				response.data.getCurrentFinancialYearSimplified?.data?.financialYearCode
			) {
				this.currentSelectedFinancialYear =
					response.data.getCurrentFinancialYearSimplified.data.financialYearCode;

				if (this.teamType !== 'NEGOTIATION_TEAM') {
					this.tenderField = {
						type: FieldType.paginatedselect,
						query: GET_MERGED_PROCUREMENT_REQUISITION_DATA_FOR_TEAM_PAGINATED,
						apolloNamespace: ApolloNamespace.app,
						optionName: 'description',
						optionValue: 'uuid',
						searchFields: ['lotNumber', 'lotDescription'],
						// sortField: 'description',
						dynamicPipes: [],
						fetchPolicy: 'network-only',
						label: 'Select Tender',
						key: 'entityUuid',
						rowClass: 'col-span-12 md:col-span-6',
						value: this.entityUuid,
						mapFunction: (item) => ({
							...item,
							description: item?.lotNumber + ' - ' + item?.lotDescription,
						}),
						mustHaveFilters: [
							{
								fieldName: 'tenderState',
								operation: 'EQ',
								value1: 'AWARDED',
							},
							{
								fieldName: 'financialYearCode',
								operation: 'EQ',
								value1: this.currentSelectedFinancialYear,
							},
						],
					};

					/*** added this function in case we would want to separate team getting queries **/
					this.getTeamsBasedOnEntityType(this.entityType).then();
				}
			}
			this.loadingTenders = false;
		} catch (e) {
			console.error(e);
		}
	}


	onSelectedEntityType(event) {
		this.selectedTeamEntityType = event.objectType;
		this.entityUuid = null;
		const query = this.selectedTeamEntityType === 'TENDER'
			? GET_MERGED_REQUISITION_PENDING_AWARD_PAGINATED_BY_TENDER_STATE_NEGOTIATION
			: GET_FRAMEWORK_LOTS_BY_FRAMEWORK_NEGOTIATION;
		this.getTenderFieldsBasedOnSelectedTeamEntityType(this.selectedTeamEntityType, this.currentSelectedFinancialYear, query);
	}


	getTenderFieldsBasedOnSelectedTeamEntityType(selectedTeamEntityType: string, currentSelectedFinancialYear: any, query: any) {
		this.tenderField = {
			type: FieldType.paginatedselect,
			query: query,
			apolloNamespace: selectedTeamEntityType === 'TENDER' ? ApolloNamespace.app : ApolloNamespace.submission,
			optionName: 'description',
			optionValue: 'uuid',
			searchFields: ['lotNumber', 'lotDescription'],
			dynamicPipes: [],
			label: selectedTeamEntityType === 'TENDER' ? 'Select Tender' : 'Select Framework',
			key: 'entityUuid',
			rowClass: 'col-span-12 md:col-span-6',
			mapFunction: (item) => {
				return {
					...item,
					description: item?.lotNumber + ' - ' + item?.lotDescription,
				};
			},
			mustHaveFilters: [
				{
					fieldName: selectedTeamEntityType === 'TENDER' ? 'tenderState' : 'frameworkStatus',
					operation: 'EQ',
					value1: 'NEGOTIATION_INITIATED'
				},
				{
					fieldName: 'financialYearCode',
					operation: 'EQ',
					value1: currentSelectedFinancialYear,
				},
			],
		};
	}

	async getCurrentEntity(
		teamType: TeamTypeEnum,
		entityType: EntityObjectTypeEnum,
		entityUuid: string,
	) {
		try {
			const res: any = await this.teamManageService.getEntityByUuid(
				entityType,
				teamType,
				entityUuid,
			);
			if (entityType != 'NEGOTIATION') {
				this.currentTender = res;
			} else if (entityType == 'NEGOTIATION') {
				const planned =
					(res.negotiationPlanList || []).length > 0
						? res.negotiationPlanList[0]
						: null;
				this.teamDto = {
					...this.teamDto,
					plannedEvaluationStartDate: planned.startDate,
					plannedEvaluationEndDate: planned.endDate,
					submissionUuid: res?.submission?.uuid,
				};

				this.submissionUuid = res?.submission?.uuid;
				this.entityUuid = res.entityUuid;
				this.commiteeChairman = (
					res.negotiationMemberAssignmentList || []
				).find((i) => i.position == 'CHAIRPERSON');
				this.commiteeChairmanUuid = this.commiteeChairman?.userUuid;
				this.hasChairman = !!this.commiteeChairmanUuid;
				this.committeeSecretary = (
					res.negotiationMemberAssignmentList || []
				).find((i) => i.position == 'SECRETARY');
				this.committeeSecretaryUuid = this.committeeSecretary?.userUuid;

				this.members = (res.negotiationMemberAssignmentList || []).map(
					(user: any) => {
						return {
							...user,
							uuid: user.userUuid,
						};
					},
				);
			}
		} catch (e) {
			console.error(e);
		}
	}

	async getTeamsBasedOnEntityType(entityType) {
		switch (entityType) {
			case 'FRAMEWORK': {
				await this.getFrameworksWithoutTeams();
				break;
			}
			default:
				await this.getEntitiesWithoutTeamType(
					this.currentSelectedFinancialYear,
				);
				break;
		}
	}

	// entityType teamType
	async getFrameworksWithoutTeams() {
		try {
			this.loadingTenders = true;
			let response: any = await this.apollo.fetchData({
				query: GET_FRAMEWORKS_WITHOUT_TEAMS,
				apolloNamespace: ApolloNamespace.submission,
			});
			this.tendersList = response.data.getFrameworksWithoutTeams.data;
			this.loadingTenders = false;
		} catch (e) {
			console.error(e);
			this.loadingTenders = false;
		}
	}

	// entityType teamType
	async getEntitiesWithoutTeamType(financialYear: string) {
		try {
			this.loadingTenders = true;
			let response: any = await this.apollo.fetchData({
				query: GET_ENTITIES_WITHOUT_TEAM,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					teamType: this.teamType,
					entityObjectType: this.entityType,
					financialYearCode: financialYear,
				},
			});
			this.tendersList = response.data.getEntitiesWithoutTeamType.dataList;

			this.loadingTenders = false;
		} catch (e) {
			console.error(e);
			this.loadingTenders = false;
		}
	}


	// TODO: improve this function to use resources form TeamManageService instead of TeamService
	async getTeam(uuid: string) {
		this.loading = true;
		const team: any = await this.teamManageService.getTeam(uuid, this.teamType);
		if (team) {
			this.selectedMembers = team.members.map((user: any) => {
				return {
					...user,
					uuid: user.userUuid,
				};
			});
			this.members = team.members.map((user: any) => {
				return {
					...user,
					uuid: user.userUuid,
				};
			});
			this.hasChairman = this.hasChairmanMember(this.selectedMembers);
			this.commiteeChairman = this.selectedMembers.find(
				(member: any) => member.position == 'CHAIRPERSON',
			);

			this.committeeSecretary = this.selectedMembers.find(
				(member: any) => member.position == 'SECRETARY',
			);
			this.isValidSelection = this.checkValidSelection(this.selectedMembers);
			this.teamDto = this.prepareDtoFromObject(
				this.selectedMembers,
				team,
				'update',
			);
			this.sortMembers();
		}
	}

	sortMembers() {
		this.members = this.settingsService.sortArray(
			this.members,
			'position',
			'ASC',
		);
		this.selectedMembers = this.settingsService.sortArray(
			this.selectedMembers,
			'position',
			'ASC',
		);
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
				entityUuid: member.entityUuid,
				userId: member.userId,
				uuid: member.userUuid,
			};
		});
	}

	ngOnInit(): void {
		if (this.team) {
			this.teamDto.uuid = this.team.uuid;
		}
		this.entityName = getEntityName(this.entityType);
	}

	ngOnChanges(): void {
		if (this.team) {
			this.teamDto.uuid = this.team.uuid;
			this.entityUuid = this.team.entityUuid;
		}

		this.entityName = getEntityName(this.entityType);

		this.selectionOfItem(this.mapUpdatedUsers(this.members));
		this.hasChairman = this.hasChairmanMember(this.selectedMembers);
		if (this.teamType == 'NEGOTIATION_TEAM' && this.team) {
			this.assignNegotiationTeam(this.team).then();
		}
	}

	async assignNegotiationTeam(team: any) {
		if (team) {
			this.selectedMembers = team.negotiationMemberAssignmentList.map(
				(user: any) => {
					return {
						...user,
						uuid: user.userUuid,
					};
				},
			);
			this.members = team.negotiationMemberAssignmentList.map((user: any) => {
				return {
					...user,
					uuid: user.userUuid,
				};
			});
			this.hasChairman = this.hasChairmanMember(this.selectedMembers);
			this.commiteeChairman = this.selectedMembers.find(
				(member: any) => member.position == 'CHAIRPERSON',
			);
			this.isValidSelection = this.checkValidSelection(this.selectedMembers);
			this.teamDto = this.prepareDtoFromObject(
				this.selectedMembers,
				team,
				'update',
			);
			this.sortMembers();
			this.teamDto.entityUuid = this.entityUuid;
			await this.getTenderWinner(this.teamDto.entityUuid);
			this.teamDto = this.prepareDto(this.selectedMembers, this.teamDto);
		}
	}

	// Selected Items should be least 3 and in odd numbers
	checkValidSelection(items: any[]): boolean {
		const isNegotiationTeam = this.teamType === 'NEGOTIATION_TEAM';
		const hasOddLength = items.length % 2 !== 0;
		const hasValidLength =
			items.length > 1 && items.length <= (isNegotiationTeam ? 5 : Infinity);
		const hasValidAppointments = this.checkAppointments(items);
		const hasValidChairPerson = this.checkChairPerson(items);

		if (isNegotiationTeam) {
			return (
				hasOddLength &&
				hasValidLength &&
				hasValidAppointments &&
				hasValidChairPerson
			);
		} else {
			return (
				hasOddLength &&
				hasValidLength &&
				hasValidAppointments &&
				hasValidChairPerson
			);
		}
	}

	// Check is appointment position are selected
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
			if (item.position == 'CHAIRPERSON') {
				chairCount += 1;
			}
		});
		return chairCount == 1;
	}

	onSelectedChairman(event: any) {
		try {
			this.selectedMembers = this.selectedMembers.filter((member: any) => {
				return member.position != 'CHAIRPERSON';
			});

			this.members = this.members.filter((member: any) => {
				return member.position != 'CHAIRPERSON';
			});

			if (event.object) {
				this.commiteeChairman = {
					...event.object,
					position: 'CHAIRPERSON',
					procuringEntityName: event.object?.procuringEntity?.name,
					departmentName: event.object?.department?.name,
					designationName: event.object?.jobTitle,
				};
				this.members = [...(this.members || []), ...[this.commiteeChairman]];
				this.hasChairman = true;
			}
		} catch (e) {
			this.hasChairman = false;
			this.commiteeChairman = null;
		}
	}

	onSelectedSecretary(event: any) {
		try {
			this.selectedMembers = this.selectedMembers.filter((member: any) => {
				return member.position != 'SECRETARY';
			});

			this.members = this.members.filter((member: any) => {
				return member.position != 'SECRETARY';
			});
			if (event.object) {
				this.committeeSecretary = {
					...event.object,
					position: 'SECRETARY',
					procuringEntityName: event.object?.procuringEntity?.name,
					departmentName: event.object?.department?.name,
					designationName: event.object?.jobTitle,
				};

				this.members = [...(this.members || []), ...[this.committeeSecretary]];
				this.hasSecretary = true;
			}
		} catch (e) {
			this.hasSecretary = false;
			this.committeeSecretary = null;
		}
	}

	async getTenderWinner(tenderUuid: string) {
		try {
			this.loadSubmissions = true;
			const response: any = await this.apollo.fetchData({
				query: GET_TENDER_WINNER_FOR_NEGOTIATION,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					tenderUuid,
				},
			});
			if (response.data.getTenderWinner.code === 9000) {
				this.winner = response?.data?.getTenderWinner?.data || null;
			} else {
				this.winner = null;
			}
			this.loadSubmissions = false;
		} catch (e) {
			this.winner = null;
			this.loadSubmissions = false;
		}
	}

	async getInstitutionMembers(event, eventType) {
		if (!event?.value) return;
		try {
			this.resetLoading(true, eventType);

			const response: any = await this.apollo.fetchData({
				query: GET_USERS_BY_INSTITUTION_BY_UUID,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					procuringEntityId: event.value,
				},
			});
			if (response.data.getAllUsersByProcuringEntityUuid.code === 9000) {
				const data =
					response?.data?.getAllUsersByProcuringEntityUuid?.data || [];
				const filteredUsers = this.filterPELeaders(
					this.members.length > 0
						? data.filter(
							(dataItem: any) =>
								this.members.findIndex(
									(member: any) => member.email == dataItem.email,
								) == -1,
						)
						: data,
				);
				this.usersField = {
					...this.usersField,
					options: filteredUsers.map((user) => ({
						...user,
						name:
							user?.fullName +
							' -' +
							(user?.jobTitle || '') +
							' - ' +
							user?.department?.name,
						value: user.uuid,
					})),
				};
				if (eventType == 'chairMan') {
					this.chairmanUsers = filteredUsers;
				} else if (eventType == 'secretary') {
					this.secretaryUsers = filteredUsers;
					this.secretaryUserField = {
						...this.secretaryUserField,
						options: filteredUsers.map((user) => ({
							...user,
							name:
								user?.fullName +
								' -' +
								(user?.jobTitle || '') +
								' - ' +
								user?.department?.name,
							value: user.uuid,
						})),
					};
				} else {
					this.users = filteredUsers;
				}
			}

			this.resetLoading(false, eventType);
		} catch (e) {
			console.error(e);
			this.resetLoading(false, eventType);
		}
	}

	resetLoading(action: boolean, eventType) {
		if (eventType == 'chairMan') {
			this.loadingChairmanUsers = action;
		} else if (eventType == 'secretary') {
			this.loadingSecretaryUsers = action;
		} else {
			this.loading = action;
		}
	}

	changeChairperson() {
		this.hasChairman = false;
		this.commiteeChairman = null;
		this.commiteeChairmanUuid = null;
	}

	changeSecretary() {
		this.hasSecretary = false;
		this.committeeSecretary = null;
		this.committeeSecretaryUuid = null;
	}

	filterPELeaders(users: any[]) {
		const institutionUuid = this.storageService.getItem('institutionUuid');
		if (institutionUuid != null) {
			/** To filter HPMU and AO also filter deleted accounts */
			users = users
				.filter((user) => {
					console.log(user);
					if (
						user.procuringEntity.uuid == institutionUuid &&
						!user.email.startsWith('DELETED_')
					) {
						return !(
							user.rolesListStrings.includes('HEAD_OF_PMU') ||
							user.rolesListStrings.includes('AUDITOR') ||
							user.rolesListStrings.includes('ACCOUNTING_OFFICER')
						);
					} else if (
						user.procuringEntity.uuid != institutionUuid &&
						!user.email.startsWith('DELETED_')
					) {
						return user;
					}
				})
				.map((user) => ({ ...user, designation: user.jobTitle }));
		}
		return users;
	}

	async onSelectedTender(event: any) {
		this.teamDto.entityUuid = event.value;
		this.teamDto = this.prepareDto(this.selectedMembers, this.teamDto);
	}

	async onSelectedNegotiationTender(event: any) {
		if (event.value) {
			this.teamDto.entityUuid = event.value;
			await this.getTenderWinner(event.value);
			this.teamDto = this.prepareDto(this.selectedMembers, this.teamDto);
		}

	}

	async onSelectedWinner(event: any) {
		this.teamDto.submissionUuid = event.value;
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
			let data: any;
			if (this.teamType == TeamTypeEnum.NEGOTIATION_TEAM) {
				data = await this.teamManageService.createNegotiationTeam(
					this.prepareDtoToSave() as NegotiationTeamDto,
				);
			} else {
				data = await this.teamManageService.createEntityTeam(
					this.prepareDtoToSave() as TeamDto,
				);
			}
			if (data.code == 9000) {
				this.notificationService.successMessage(
					this.entityName + ' team created successfully',
				);
				this.closeOpenModal(true);
			} else {
				console.error(data.message);
				this.notificationService.errorMessage(data.message);
			}
			this.isSaving = false;
		} catch (e) {
			console.error(e);
			this.isSaving = false;
			this.notificationService.errorMessage(
				'Problem occurred, please try again',
			);
		}
	}

	private prepareDtoToSave(): TeamDto | NegotiationTeamDto {
		if (this.teamType != TeamTypeEnum.NEGOTIATION_TEAM) {
			// remove submissionUuid on this.teamDto for other teams
			let { submissionUuid, ...theRestProperties } = this.teamDto;
			return theRestProperties;
		}
		const members = this.teamDto?.teamMemberDtos as any[];

		const dto = {
			endDate: this.teamDto?.plannedEvaluationEndDate,
			entityUuid: this.teamDto?.entityUuid,
			memberDto: members?.map((member) => {
				return {
					checkNumber: member?.checkNumber,
					departmentId: member?.department?.id,
					departmentName: member?.department?.name,
					departmentUuid: member?.department?.uuid,
					designation: member?.designationName,
					email: member?.email,
					firstName: member?.firstName,
					lastName: member?.lastName,
					middleName: member?.middleName,
					phoneNumber: member?.phone,
					position: member?.position,
					procuringEntityId: member?.procuringEntity?.id,
					procuringEntityName: member?.procuringEntity?.name,
					procuringEntityUuid: member?.procuringEntity?.uuid,
					userId: member?.id,
					userUuid: member?.userUuid,
				};
			}),
			startDate: this.teamDto.plannedEvaluationStartDate,
			submissionUuid: this.teamDto?.submissionUuid ?? this.winner?.uuid,
		};

		if (this.teamType == TeamTypeEnum.NEGOTIATION_TEAM) {
			delete dto.endDate;
			delete dto.startDate;
		}
		return dto;
	}

	positionChanged(event: any) {
		this.isValidSelection = this.checkValidSelection(event);
		this.selectedMembers = event;
		this.teamDto = this.prepareDto(this.selectedMembers, this.teamDto);
		this.hasChairman = this.hasChairmanMember(this.selectedMembers);
	}

	prepareDto(selectedMembers: any[], teamDto: any, flag = 'add'): any {
		teamDto.teamMemberDtos = (selectedMembers || []).map((userItem: any) => {
			if (this.teamType != TeamTypeEnum.NEGOTIATION_TEAM) {
				return {
					userUuid: flag == 'update' ? userItem.uuid : userItem.uuid,
					position: userItem.position,
				};
			} else {
				return {
					userUuid: flag == 'update' ? userItem.uuid : userItem.uuid,
					...userItem,
				};
			}
		});
		return teamDto;
	}

	prepareDtoFromObject(selectedMembers: any[], team: any, flag = 'add'): any {
		let teamDto: TeamDto | any = {};
		Object.keys(this.teamDto).forEach((key) => {
			teamDto[key] = team[key];
		});
		teamDto.teamMemberDtos = (selectedMembers || []).map((userItem: any) => {
			return {
				userUuid: flag == 'update' ? userItem.uuid : userItem.uuid,
				position: userItem.position,
			};
		});
		return teamDto;
	}

	onCancelForm() {
		this.closeOpenModal();
	}

	hasChairmanMember(items: any[]): boolean {
		return items.find((item: any) => item.position == 'CHAIRPERSON') != null;
	}

	updatePlannedDate(inputEvent: any) {
		if (inputEvent.type == 'Start') {
			this.teamDto.plannedEvaluationStartDate = this.formatDate(
				inputEvent.value,
			);
		} else {
			this.teamDto.plannedEvaluationEndDate = this.formatDate(inputEvent.value);
		}
	}

	formatDate(dateReceived: any, format: string = 'YYYY-MM-DD') {
		if (typeof dateReceived === 'string' && dateReceived !== '') {
			dateReceived = new Date(dateReceived);
		}
		return dateReceived ? moment(dateReceived).format(format) : undefined;
	}

	shouldShowContent(): boolean {
		return (
			(this.teamType !== 'NEGOTIATION_TEAM' &&
				this.teamDto.plannedEvaluationStartDate &&
				this.teamDto.plannedEvaluationEndDate) ||
			this.teamType === 'NEGOTIATION_TEAM'
		);
	}
}
