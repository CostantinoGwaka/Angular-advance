import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges
} from "@angular/core";
import { ApolloNamespace } from "src/app/apollo.config";
import { MatDialog } from "@angular/material/dialog";
import { Tender } from "src/app/modules/nest-app/store/tender/tender.model";
import { GraphqlService } from "../../../services/graphql.service";
import { NotificationService } from "../../../services/notification.service";
import { StorageService } from "../../../services/storage.service";
import { fadeIn } from "src/app/shared/animations/basic-animation";
import { fadeInOut } from "src/app/shared/animations/router-animation";
import {
	FIND_TEAM_ASSIGNMENT_BY_UUID,
	GET_EVALUATION_COMMITEE_BY_UUID, REFRESH_SIGNING_APPOINTMENT_LETTERS,
	SEND_APPOINTMENT_LETTERS
} from "../../../modules/nest-tender-evaluation/store/evaluation-commitee/evaluation-commitee.graphql";
import {
	CustomAlertBoxModel
} from "../custom-alert-box/custom-alert-box.model";
import { AuthService } from "../../../services/auth.service";
import {
	EntityInfoSummary
} from "../tender-info-summary/store/entity-info-summary.model";
import { SettingsService } from "../../../services/settings.service";
import { EntityTypeEnum } from "../../../services/team.service";
import {
	GET_ONE_FRAMEWORK_LOT_SUBMISSION_VIEW, GET_ONE_FRAMEWORK_SUBMISSION_VIEW
} from "../../../modules/nest-framework-agreement/agreements/agreements.graphql";
import {
	FIND_PRE_QUALIFICATIONS_BY_UID
} from "../../../modules/nest-pre-qualification/store/pre-qualification.graphql";
import {
	GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_MINI_FOR_EVALUATION_TASK
} from "../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql";
import {
	NormalTableExpandableRow2Component
} from "../normal-table-expandable-row2/normal-table-expandable-row2.component";
import {
	SharableCommentsViewerComponent
} from "../sharable-comments-viewer/sharable-comments-viewer.component";
import { ConfirmAreaComponent } from "../confirm-area/confirm-area.component";
import {
	TeamMemberViewerComponent
} from "../team-member-view/team-member-view.component";
import { MatButtonModule } from "@angular/material/button";
import {
	HasPermissionDirective
} from "../../directives/has-permission.directive";
import { MatIconModule } from "@angular/material/icon";
import {
	CustomAlertBoxComponent
} from "../custom-alert-box/custom-alert-box.component";
import { LoaderComponent } from "../loader/loader.component";
import {
	WorkFlowMainComponent
} from "../work-flow-main/work-flow-main.component";
import {
	PaginatedTableExpandableRowComponent
} from "../paginated-table-expandable-row/paginated-table-expandable-row.component";
import { NgClass, NgTemplateOutlet, JsonPipe } from "@angular/common";
import {
	upsertTenderEntityDetail
} from "../percentage-progress-bar/store/submission-progress/submission-progress.actions";
import {
	PREPARE_TEAM_MEMBER_APPOINTMENT_LETTER
} from "../invitation-letter/store/invitation-letter.graph";
import { List } from "postcss/lib/list";
import {
	PerformanceSecurityDialogViewComponent
} from "../../../modules/nest-contracts/contracts/contract-viewer/performance-security-dialog-view/performance-security-dialog-view.component";
import {
	AppointmentLetterDataDialogComponent, GeneralStatusModel
} from "./appointment-letter-data-dialog/appointment-letter-data-dialog.component";

export const negativeActions: string[] = [
	"DELETE",
	"REMOVE",
	"REJECT",
	"CANCEL",
	"REVOKE",
	"DENY",
	"ABORT",
	"DROP",
	"FORGET"
];
export const positiveActions: string[] = [
	"CREATE",
	"ADD",
	"SUBMIT",
	"APPROVE",
	"PROCEED",
	"KEEP",
	"ACCEPT",
	"CONTINUE",
	"KEEP UP",
	"RECALL",
	"REVIEW"
];

@Component({
	selector: "app-team-view-task-manager",
	templateUrl: "./team-view-task.component.html",
	styleUrls: ["./team-view-task.component.scss"],
	animations: [fadeIn, fadeInOut],
	standalone: true,
	imports: [
		PaginatedTableExpandableRowComponent,
		WorkFlowMainComponent,
		LoaderComponent,
		CustomAlertBoxComponent,
		NgClass,
		MatIconModule,
		NgTemplateOutlet,
		HasPermissionDirective,
		MatButtonModule,
		TeamMemberViewerComponent,
		ConfirmAreaComponent,
		SharableCommentsViewerComponent,
		NormalTableExpandableRow2Component,
		JsonPipe
	]
})
export class TeamViewTaskManagementComponent implements OnInit, OnChanges {
	@Input() committeeList: any[] = [];
	@Input() loadingTeams = false;
	@Input() type: string;
	@Input() query: any;
	@Input() financialYearCode: string;
	@Input() additionalVariables: any;
	@Input() entityType: string;
	@Input() viewOnly = false;
	@Input() useQuery = false;
	@Input() apolloNamespace: ApolloNamespace = ApolloNamespace.submission;
	@Output() onUpdate: EventEmitter<any> = new EventEmitter();
	@Output() onViewMemberLetter: EventEmitter<any> = new EventEmitter();
	@Output() closeForm: EventEmitter<any> = new EventEmitter();
	@Output() onTeamUpdate: EventEmitter<any> = new EventEmitter();

	committee: any = {};
	selectedIndex: number = 2;
	loadingTrnder = false;
	currentTender: Tender | any;
	showDeclaredForm = false;
	task: any;
	possibleActions: string[] = [];
	message: string;
	entityUuid: string;
	loading: boolean;
	isNegative: boolean;
	comment: string;
	userSystemAccessRoles: string;
	viewLetter = false;
	showConfirm = false;
	resetTable = false;
	sendingLetters = false;
	showNoticeBox = false;
	lettersNotPrepared: number = 0;
	lettersNotSigned: number = 0;
	allowTaskFix = false;

	tableConfigurations = {
		tableColumns: [
			{ name: "tenderNumber", label: "Tender Number" },
			{ name: "descriptionOfProcurement", label: "Tender Title" },
			{ name: "members", label: "Members" },
			{ name: "createdAt", label: "Created At", type: "date" },
			{ name: "teamRequestType", label: "Request Type" },
			{ name: "entityTypeLabel", label: "Entity Type", type: "html" }
		],
		tableCaption: "",
		showNumbers: true,
		tableNotifications: "",
		showSearch: true,
		useFullObject: true,
		showBorder: true,
		allowPagination: true,
		actionIcons: {
			edit: false,
			delete: false,
			more: false,
			print: false,
			customPrimary: false
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: false,
		customPrimaryMessage: "Manage Team",
		empty_msg: "No Task found"
	};

	noticeAlert: CustomAlertBoxModel = {
		title: "Important Notice",
		buttonTitle: "",
		showButton: false,
		details: []
	};

	badTaskAlert: CustomAlertBoxModel = {
		title: "Important Notice",
		buttonTitle: "Fix Task Data",
		showButton: true,
		details: [
			{
				icon: "info",
				message: "System have detected that this task has problems," +
					"you may nit be able to approve until you fix this issue." +
					"Click fix task data button to fix this issue."
			}
		]
	};

	categoryMap = {
		"G": "Goods",
		"W": "Works",
		"C": "Consultancy",
		"NC": "Non Consultancy"
	};

	entityInfoSummary: EntityInfoSummary;
	displayInfoList: {
		title: string,
		info: string
	}[] = [];

	constructor(
		private dialog: MatDialog,
		private apollo: GraphqlService,
		private authService: AuthService,
		private settingService: SettingsService,
		private notificationService: NotificationService,
		private storageService: StorageService
	) {
	}

	ngOnInit(): void {
		if (this.viewOnly) {
			this.tableConfigurations.customPrimaryMessage = "View Team";
		}
		this.initAccess();
	}

	initAccess() {
		this.userSystemAccessRoles = this.storageService.getItem(
			"userSystemAccessRoles"
		);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["financialYearCode"]) {
			this.resetTable = true;
			this.delay(300).then(_ => {
				this.resetTable = false;
			});
		}
	}

	delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	ofPE() {
		return true;
	}

	viewMemberLetter(member: any) {
		this.viewLetter = true;
		this.onViewMemberLetter.emit(member);
	}

	onAdd(tenderUuid: string, commitee: any) {
		let institutionUuid: string =
			this.storageService.getItem("institutionUuid");
		this.onTeamUpdate.emit({
			uuid: this.committee.uuid,
			tenderUuid,
			institutionUuid,
			name: commitee.tenderNumber + " " + commitee.descriptionOfProcurement,
			members: commitee.tenderEvaluationCommitteeInfos
		});
	}

	downloadFile() {
		const documentContainer = document.getElementById("invitation_letter");
		const WindowObject = window.open("", "PrintWindow");
		WindowObject.document.writeln(documentContainer.innerHTML);
		WindowObject.document.head.innerHTML = window.document.head.innerHTML;
		WindowObject.focus();
		setTimeout(() => {
			WindowObject.print();
			WindowObject.close();
		}, 100);
	}

	async toggleView(event: any) {
		this.committee = event;
		this.entityType = this.committee.entityType;
		this.entityUuid = this.committee.tenderUuid;
		this.showNoticeBox = false;
		this.handleTaskViewRefresh();
		if (this.entityUuid) {
			this.getEntityByUuid(this.entityType as EntityTypeEnum).then(_ => {
				this.generateDisplayInfo();
			});
		}
	}

  loadCommitee() {

  }

	handleTaskViewRefresh() {
		const possibleActionCache = this.refreshActionTask();
		this.prepareAlertBoxInfo(possibleActionCache);

	}

	refreshActionTask() {
		let possibleActionCache: string[] = [];
		if (this.committee?.possibleActions) {
			this.possibleActions = this.committee?.possibleActions.split(",");
			possibleActionCache = this.possibleActions;
		}
		this.lettersNotPrepared = this.committee.teamMembers.filter(
			(committee) => !committee.hasAppointmentLetter).length;

		this.lettersNotSigned = this.committee.teamMembers.filter(
			(committee) => !committee.appointmentLetterSigned).length;

		return possibleActionCache;
	}

	prepareAlertBoxInfo(possibleActionCache: string[]) {
		this.allowTaskFix = (!this.committee.allAppointmentLettersSigned && this.lettersNotSigned == 0);
		console.log("this.allowTaskFix", this.allowTaskFix);

		if (this.lettersNotPrepared == 0) {
			if (this.authService.hasPermission("ROLE_TNDR_EVL_TEAM_MANAGEMENT_SEND_APPTMNT_LETTER")) {
				this.possibleActions = (this.committee.allAppointmentLettersSigned) ? possibleActionCache :
					this.possibleActions.filter(action => !positiveActions.includes(action));
				this.showNoticeBox = true;
				this.noticeAlert.details = [
					{
						icon: "info",
						message: "Before starting the approval process, all appointment letters for " +
							"members of the evaluation committee must be signed." +
							"\"Click to Task action\" to either approve or reject the appointment letters." +
							"\nInsert Comments to clarify reasons for approval or rejection." +
							"\nSave the progress and continue with the process or " +
							"Cancel it to potentially start over Task action or make changes."
					}
				];

			} else if (this.authService.hasPermission("ROLE_TNDR_EVL_TEAM_MANAGEMENT_SEND_APPTMNT_LETTER") && !this.committee.appointmentLettersSent) {
				this.showNoticeBox = true;
				this.noticeAlert.details = [
					{
						icon: "info",
						message: "Please make sure all members have appointment letters signed," +
							" Send appointment letters button will appear below. You can then send letters to members."
					}
				];
			}
		} else if (this.authService.hasPermission("ROLE_TNDR_EVL_TEAM_MANAGEMENT_PRAPR_APPTMNT_LETTER")) {
			this.showNoticeBox = true;
			this.noticeAlert.details = [
				{
					icon: "info",
					message: "Please make sure all members have" +
						" appointment letters before proceeding."
				},
				{
					icon: "info",
					message: "When all members have appointment letters," +
						" Task action box will appear below." +
						"Then you can complete the task"
				}
			];
		}
	}


	async getEntityByUuid(entityType: EntityTypeEnum) {
		switch (entityType) {
			case EntityTypeEnum.PLANNED_TENDER:
				await this.getPreQualificationByUuid();
				break;
			case EntityTypeEnum.TENDER:
				await this.getMergedMainProcurementRequisitionByUuid();
				break;
			case EntityTypeEnum.FRAMEWORK:
				await this.getOneFrameworkLot();
				break;
			default:
				break;
		}
	}


	async getOneFrameworkLot() {
		try {
			this.loadingTrnder = true;
			let response: any = await this.apollo.fetchData({
				query: GET_ONE_FRAMEWORK_LOT_SUBMISSION_VIEW,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					uuid: this.entityUuid
				}
			});
			if (response.data.getOneFrameworkLot?.code == 9000) {
				const lotDetail = response.data.getOneFrameworkLot.data;
				const framework = lotDetail.frameworkMain;
				this.entityInfoSummary = {
					...this.entityInfoSummary,
					entityUuid: framework.uuid,
					mainEntityUuid: framework.uuid,
					hasAddendum: framework.hasAddendum,
					financialYearCode: framework.financialYearCode,
					entityNumber: framework.frameworkNumber,
					lotNumber: lotDetail.lotNumber,
					lotDescription: lotDetail.lotDescription,
					description: framework.description,
					procurementCategoryAcronym: framework.tenderCategoryName,
					entitySubCategoryName: framework.tenderSubCategoryName,
					procuringEntityName: framework.procuringEntityName,
					procurementMethodName: framework.procurementMethodName,
					invitationDate: null,
					numberOfLots: 1,
					deadline: null
				};
				this.loadingTrnder = false;
			} else {
				console.error(response.data.getOneFrameworkLot.message);
				await this.getOneFramework();
				this.loadingTrnder = false;
			}
		} catch (e) {
			console.error(e);
			this.loadingTrnder = false;
		}
	}

	async getOneFramework() {
		try {
			let response: any = await this.apollo.fetchData({
				query: GET_ONE_FRAMEWORK_SUBMISSION_VIEW,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					uuid: this.entityUuid
				}
			});
			if (response.data.getOneFramework?.code == 9000) {
				const framework = response.data.getOneFramework.data;
				this.entityInfoSummary = {
					...this.entityInfoSummary,
					entityUuid: framework.uuid,
					mainEntityUuid: framework.uuid,
					hasAddendum: framework.hasAddendum,
					financialYearCode: framework.financialYearCode,
					entityNumber: framework.frameworkNumber,
					lotNumber: framework.frameworkNumber,
					entityStatus: framework.frameworkStatus,
					lotDescription: framework.description,
					description: framework.description,
					procurementCategoryAcronym: framework.tenderCategoryName,
					entitySubCategoryName: framework.tenderSubCategoryName,
					procuringEntityName: framework.procuringEntityName,
					procurementMethodName: framework.procurementMethodName,
					numberOfLots: framework.numberOfLots,
					invitationDate: null,
					deadline: null
				};

				this.loadingTrnder = false;

			} else {
				console.error(response.data.getOneFramework.message);
			}
		} catch (e) {
			console.error(e);
			this.loadingTrnder = false;
		}
	}

	async getPreQualificationByUuid() {
		try {
			this.loadingTrnder = true;
			const response: any = await this.apollo.fetchData({
				query: FIND_PRE_QUALIFICATIONS_BY_UID,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					uuid: this.entityUuid
				}
			});
			if (response.data.findPreQualificationByUuid?.code == 9000) {
				const preQualification = response.data.findPreQualificationByUuid.data;
				this.entityInfoSummary = {
					...this.entityInfoSummary,
					entityUuid: preQualification.uuid,
					mainEntityUuid: preQualification.uuid,
					hasAddendum: preQualification.hasAddendum,
					financialYearCode: preQualification.tender.financialYearCode,
					entityNumber: preQualification.identificationNumber,
					lotNumber: preQualification.identificationNumber,
					lotDescription: preQualification.tender.descriptionOfTheProcurement,
					description: preQualification.tender.descriptionOfTheProcurement,
					procurementCategoryAcronym: preQualification.tender.procurementCategoryAcronym,
					entitySubCategoryName: preQualification.tender.tenderSubCategoryName,
					procuringEntityName: preQualification.tender.procuringEntityName,
					procurementMethodName: preQualification.tender.procurementMethod.description,
					invitationDate: null,
					numberOfLots: 1,
					deadline: null
				};

				this.loadingTrnder = false;
			}

		} catch (e) {
			this.loadingTrnder = false;
		}
	}

	async getMergedMainProcurementRequisitionByUuid() {
		this.loadingTrnder = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_MINI_FOR_EVALUATION_TASK,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					uuid: this.entityUuid
				}
			});

			if (response.data.getMergedMainProcurementRequisitionByUuid?.code === 9000) {
				const mergedMainProcurementRequisition = response.data.getMergedMainProcurementRequisitionByUuid?.data;
				const mergedMainProcurementRequisitionTender = mergedMainProcurementRequisition?.tender;
				this.entityInfoSummary = {
					...mergedMainProcurementRequisition,
					mainEntityUuid: mergedMainProcurementRequisition?.uuid,
					entityUuid: mergedMainProcurementRequisition?.uuid,
					financialYearCode: mergedMainProcurementRequisition.financialYearCode,
					entityNumber: mergedMainProcurementRequisition.lotNumber,
					lotNumber: mergedMainProcurementRequisition.lotNumber,
					description: mergedMainProcurementRequisition.lotDescription,
					lotDescription: mergedMainProcurementRequisition.lotDescription,
					hasAddendum: mergedMainProcurementRequisitionTender?.hasAddendum,
					procurementMethodName: mergedMainProcurementRequisitionTender?.procurementMethod.description,
					procurementCategoryAcronym: mergedMainProcurementRequisitionTender?.procurementCategoryAcronym,
					entitySubCategoryName: mergedMainProcurementRequisitionTender?.tenderSubCategoryName,
					procuringEntityName: mergedMainProcurementRequisitionTender?.procuringEntityName,
					numberOfLots: mergedMainProcurementRequisitionTender?.numberOfLots,
					invitationDate: null,
					deadline: null
				};
				this.loadingTrnder = false;
			} else {
				this.loadingTrnder = false;
				console.error(response?.data?.getMergedMainProcurementRequisitionByUuid?.message);
			}
		} catch (e) {
			console.error(e);
		}
	}

	getNegativeLabel(possibleActions: string[]) {
		return possibleActions.find((negaviteAction: string) =>
			negativeActions.includes(negaviteAction)
		);
	}

	getPosiviteLabel(possibleActions: string[]) {
		return possibleActions.find((positiveAction: string) =>
			positiveActions.includes(positiveAction)
		);
	}

	async completeTask(isNegative: any, possibleActionList: string[]) {
		let taskName =
			isNegative == false
				? this.getPosiviteLabel(possibleActionList)
				: this.getNegativeLabel(possibleActionList);

		if (taskName) {
			this.loading = true;
			this.message = "Action in progress , Please wait.... ";
			try {
				// const response: any = await this.apollo.mutate({
				//   mutation: COMPLETE_USER_TASK_EVALUATION_TEAM,
				//   variables: {
				//     workingFlowTaskListDto: {
				//       modelUid: this.committee.uuid,
				//       action: taskName,
				//       comment: 'Action Pushed Forward'
				//     }
				//   }
				// });
				// if (response.data.completeTenderEvaluationTeamTask.code == 9000) {
				//   this.notificationService.successMessage('Aciton completed successfully');
				//   this.loadCommitee();
				// }
			} catch (e) {
				this.notificationService.errorMessage(e);
				this.loading = false;
				this.message = "";
				this.isNegative = null;
				this.comment = "";
			}
		}
	}

	async fixTaskData(teamAssignmentUuid: String) {
		this.loading = true;
		this.message = "Task fixing in progress , Please wait.... ";
		try {
			const response: any = await this.apollo.mutate({
				mutation: REFRESH_SIGNING_APPOINTMENT_LETTERS,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					teamAssignmentUuid: teamAssignmentUuid
				}
			});
			if (response.data.refreshSigningAppointmentLetters.code == 9000) {
				this.notificationService.successMessage("Task fix completed successfully");
				await this.fetchCommitteeDetails();
			}
		} catch (e) {
			this.notificationService.errorMessage(e);
			this.loading = false;
			this.message = "";
			this.isNegative = null;
			this.comment = "";
		}
	}

	async onTaskComplete(event: any) {
		await this.fetchCommitteeDetails();
		// this.handleTaskViewRefresh();
	}

	mapFunction(item) {
		let entityTypeLabel = "N/A";
		if (item.entityType) {
			let colors = "bg-green-200 text-green-800";
			let label = "TENDER";
			if (item.entityType === "PLANNED_TENDER") {
				label = "PRE QUALIFICATION";
				colors = "bg-orange-200 text-orange-800";
			} else if (item.entityType === "TENDER") {
				colors = "bg-green-200 text-green-800";
				label = "TENDER";
			} else if (item.entityType === "FRAMEWORK") {
				colors = "bg-yellow-200 text-yellow-800";
				label = "FRAMEWORK";
			} else if (item.entityType === "CONTRACT") {
				colors = "bg-indigo-200 text-indigo-800";
				label = "CONTRACT";
			}

			entityTypeLabel = `<div class="inline-block px-2 py md:break-words  rounded-full ${colors}">${label}</div>`;

		}

		return {
			...item,
			entityTypeLabel: entityTypeLabel,
			members: item.teamMembers.length
		};
	}

	async sendAppointmentLetters() {
		try {
			this.sendingLetters = true;
			const response: any = await this.apollo.mutate({
				mutation: SEND_APPOINTMENT_LETTERS,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					evaluationTeamUuid: this.committee.uuid
				}
			});
			if (response?.data?.sendAppointmentLetters?.code === 9000) {
				this.notificationService.successMessage("Appointment letters sent, successfully");
				this.showConfirm = false;
				this.sendingLetters = false;
				await this.fetchCommitteeDetails();
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
			this.loading = true;
			const response: any = await this.apollo.fetchData({
				query: FIND_TEAM_ASSIGNMENT_BY_UUID,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					uuid: this.committee.uuid
				}
			});
			this.committee = response?.data?.findTeamAssignmentByUuid?.data;
			this.lettersNotPrepared = this.committee.teamMembers.filter(
				(committee: any) => !committee.hasAppointmentLetter).length;

			this.lettersNotSigned = this.committee.teamMembers.filter(
				(committee: any) => !committee.appointmentLetterSigned).length;
			this.loading = false;
			this.handleTaskViewRefresh();
		} catch (e) {
			this.loading = false;
		}
	}

	setSelectedIndex(index: number) {
		this.selectedIndex = index;
	}

	generateDisplayInfo() {
		this.displayInfoList = [
			{
				title: "Financial Year",
				info: this.entityInfoSummary.financialYearCode
			},
			{
				title: "Tender Number",
				info: this.entityInfoSummary.entityNumber
			},
			{
				title: "Institution / Organization",
				info: this.entityInfoSummary.procuringEntityName
			},
			{
				title: "Tender Description",
				info: this.entityInfoSummary.description
			},

			{
				title: "Procurement Method",
				info: this.entityInfoSummary.procurementMethodName
			},

			{
				title: "Procurement Category",
				info: this.categoryMap[this.entityInfoSummary?.procurementCategoryAcronym]
			},
			{
				title: "Tender Sub Category",
				info: this.entityInfoSummary.entitySubCategoryName
			},

			{
				title: "invitationDate",
				info: this.settingService.formatDate(this.entityInfoSummary.invitationDate)
			},
			{
				title: "Deadline",
				info: this.settingService.formatDate(this.entityInfoSummary.deadline)
			}
		];

		if (this.entityInfoSummary.numberOfLots > 1) {
			this.displayInfoList.splice(4, 0, {
				title: "Number of Lots",
				info: `${this.entityInfoSummary.numberOfLots}`
			});
		}

		if (this.entityInfoSummary.entityNumber !== this.entityInfoSummary.lotNumber) {
			this.displayInfoList.splice(2, 0, {
				title: "Lot Number",
				info: this.entityInfoSummary.lotNumber
			});

			this.displayInfoList.splice(5, 0, {
				title: "Lot Description",
				info: this.entityInfoSummary.lotDescription
			});
		}
	}

	prepareAppointmentLetters(
		members: any,
		action: "PREPARE" | "SIGN" = "PREPARE",
		title = "Prepare All Appointment Letters") {
		const generalStatus: GeneralStatusModel = {
			title: title,
			action: action,
			errorMessage: "",
			hasError: false,
			loadingMessage: "loading",
			allowClose: false,
			isLoading: true,
			keyPhrase: null,
			retriesCount: 0,
			result: [],
			members: members
		};

		const dialogRef = this.dialog.open(AppointmentLetterDataDialogComponent, {
			width: "50%",
			data: generalStatus
		});
		return dialogRef.afterClosed()
			.subscribe((status: any): void => {
				if (status) {
					this.fetchCommitteeDetails().then();
				}
			});
	}
}
