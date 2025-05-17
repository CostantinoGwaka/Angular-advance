import {
	COMPLETE_MICRO_PROCUREMENT_TASK,
	COMPLETE_RETIRE_MICRO_PROCUREMENT_TASK,
} from '../../../modules/nest-framework-agreement/agreements/agreements.graphql';
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	COMPLETE_TEAM_ASSIGNMENT_TASK,
	COMPLETE_USER_TASK_NEGOTIATION_TEAM,
	COMPLETE_USER_TASK_POST_QUALIFICATION_TEAM,
} from 'src/app/modules/nest-tender-evaluation/store/evaluation-commitee/evaluation-commitee.graphql';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import {
	COMPLETE_GOVERNMENT_SERVICE_REQUISITION_TASKS,
	COMPLETE_MANUFACTURER_INVITATION_TASK,
	COMPLETE_NEGOTIATION_MINUTE_TASK,
	COMPLETE_NEGOTIATION_PLAN_TASK,
	COMPLETE_NEGOTIATION_TEAM_TASK,
	COMPLETE_ORDER_REQUEST_REQUISITION_TASKS,
	COMPLETE_REJECT_AWARD_TASK,
	COMPLETE_SPECIFIC_AUDIT_PLAN_TASK,
	COMPLETE_USER_TASK,
	GET_TASK_OUT_OF_PHASE_FOR_APP,
	GET_USER_TASKS,
	SYNC_MODEL_WITH_WORKFLOW_FOR_APP,
} from 'src/app/store/work-flow/work-flow.graphql';
import { fadeIn } from '../../animations/basic-animation';
import {
	WorkFlow,
	WorkflowApproval,
	WorkflowTask,
} from '../../../store/work-flow/work-flow-interfaces';
import {
	COMPLETE_PROCUREMENT_REQUISITION_TASK_SIMPLIFIED,
	GET_PROCURING_ENTITY_USERS_BY_UUID_AND_ROLE_NAME_DATA,
	GET_USERS_ASSIGNED_TO_TENDER,
	SET_PROCUREMENT_REQUISITION_MARKET,
} from '../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.graphql';
import {
	ApprovalModelNameEnum,
	AssignmentParam,
	GroupTasksParam,
	ProcurementRequisition,
} from '../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.model';
import { fadeSmooth } from '../../animations/router-animation';
import {
	COMPLETE_PROCUREMENT_TENDER_REQUISITION_TASKS,
	GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI,
} from '../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { COMPLETE_TENDER_CANCELLATION_REQUEST_TASK } from '../../../modules/nest-tender-initiation/store/tender-cancellation-request/tender-cancellation-request.graphql';
import { COMPLETE_TENDER_RE_ADVERTISEMENT_REQUEST_TASK } from '../../../modules/nest-tender-initiation/store/tender-re-advertisement-request/tender-re-advertisement-request.graphql';
import {
	MergedMainProcurementRequisition,
	MergedProcurementRequisition,
} from '../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model';
import { COMPLETE_TENDER_TERMINATION_REQUEST_TASK } from '../../../modules/nest-tender-initiation/store/tender-termination-request/tender-termination-request.graphql';
import { COMPLETE_TENDER_REJECTION_REQUEST_TASK } from '../../../modules/nest-tender-initiation/store/tender-rejection-request/tender-rejection-request.graphql';
import { COMPLETE_EVALUATION_REPORT_TASK } from '../../../modules/nest-tender-evaluation/store/evaluation-report/evaluation-report.graphql';
import { COMPLETE_NEGOTIATION_REPORT_TASK } from '../../../modules/nest-tenderer-negotiation/store/negotiation-report/negotiation-report.graphql';
import { COMPLETE_POST_QUALIFICATION_REPORT_TASK } from '../../../modules/nest-tenderer-post-qualification/store/post-qualification-report/post-qualification-report.graphql';
import { getClarificationNotifications } from '../store/clarification-notification/clarification-notification.actions';
import {
	clearNotifications,
	getNotifications,
} from '../store/notification/notification.actions';
import { select, Store } from '@ngrx/store';
import * as fromState from '../../../modules/nest-app/store/nest-app.reducer';
import { COMPLETE_TENDER_BOARD_TEAM_TASK } from '../../../modules/nest-tender-board/store/tender-board/tender-board.graphql';
import { COMPLETE_PRE_QUALIFICATIONS_TASK } from 'src/app/modules/nest-pre-qualification/store/pre-qualification.graphql';
import { COMPLETE_PUBLISHED_ENTITY_ADDENDUM_TASK } from 'src/app/modules/nest-tender-initiation/tender-modification/tender-modification.graphql';
import { SystemPaymentCodeEnum } from '../../../modules/nest-billing/billing-settings/payment-code/upsert-payment-code/payment-code-form';
import { GET_GLOBAL_SETTING_BY_SETTING_KEY } from '../../../modules/nest-settings/store/global-settings/global-settings.graphql';
import { PaymentCode } from '../../../modules/nest-billing/store/billing-settings/payment-code/payment-code.model';
import { FIND_PAYMENT_CODE_BY_SYSTEM_CODE } from '../../../modules/nest-billing/store/billing-settings/payment-code/payment-code.graphql';
import { CHECK_PAYMENT_BY_ENTITY_UUID } from '../../../modules/nest-app/store/annual-procurement-plan/annual-procurement-plan.graphql';
import { firstValueFrom, Observable } from 'rxjs';
import { filter, first, map, pairwise } from 'rxjs/operators';
import { selectModifiedAuthUsers } from '../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { AuthUser } from '../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import {
	GeneratedBill,
	GeneratedGPNBill,
	ViewServiceBillComponent,
} from '../view-service-bill/view-service-bill.component';
import { GENERATE_BILL_FOR_TENDER_PUBLISHING_BY_TENDER_NUMBER } from '../../../modules/nest-billing/store/billing-settings/spn-charges/spn-charges.graphql';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { COMPLETE_FRAMEWORK_TASK } from 'src/app/modules/nest-framework-agreement/agreements/agreements.graphql';
import { BillPaymentCheck } from '../../../modules/nest-app/store/tender/tender.model';
import { environment } from '../../../../environments/environment';
import { COMPLETE_SUCCESSFUL_BIDDER_CHANGE_REQUEST_TASK } from '../../../modules/nest-tender-award/store/successfull-tenders-modification/modify-successful-tenderer.graphql';
import { COMPLETE_EVALUATION_STAGE_REPORT_TASK } from '../../../modules/nest-tender-evaluation/store/evaluation/consultancy/consultancy-evaluation.graphql';
import { EntityTypeEnum } from '../../../services/team.service';
import { GET_TENDER_SUB_CATEGORY_BY_UUID } from '../../../modules/nest-tenderer-management/store/tender-sub-category/tender-sub-category.graphql';
import {
	TenderSubCategory,
	TenderSubCategoryProcessApplicableToEntityTypeEnum,
} from '../../../modules/nest-tenderer-management/store/tender-sub-category/tender-sub-category.model';
import { FormsModule, UntypedFormGroup } from '@angular/forms';
import { GraphqlOperationService } from '../../../services/graph-operation.service';
import { DynamicFormService } from '../dynamic-forms-components/dynamic-form.service';
import { GET_BILLING_GLOBAL_SETTING_BY_KEY } from '../../../modules/nest-billing/store/billing-global-setting/billing-global-setting.graphql';
import { GeneralService } from '../../../services/general.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
	COMPLETE_CONTRACT_CESSATION_TASK,
	COMPLETE_CONTRACT_PAYMENT_TASK,
	COMPLETE_CONTRACT_TASK,
	COMPLETE_CONTRACT_VARIATION_REQUEST_TASK,
	COMPLETE_CONTRACT_VARIATION_TASK,
	CREATE_UPDATE_CONTRACT_VARIATION_REQUEST,
	GET_CONTRACT_VARIATION_REQUEST_BY_UUID,
} from 'src/app/modules/nest-contracts/store/contract.graphql';
import { CustomAlertBoxModel } from '../custom-alert-box/custom-alert-box.model';
import { COMPLETE_CONTRACT_VETTING_TASK } from 'src/app/modules/nest-contracts/store/vetting.graphql';
import {
	COMPLETE_CALL_OF_ORDER_REQUISITION_TASK,
	COMPLETE_CALL_OF_ORDER_TASK,
} from 'src/app/modules/nest-call-off-order/call-off-order.graphql';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatButtonModule } from '@angular/material/button';
import { WorkFlowActionSelectorComponent } from './work-flow-action-selector/work-flow-action-selector.component';
import { CustomAlertBoxComponent } from '../custom-alert-box/custom-alert-box.component';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharableCommentsViewerComponent } from '../sharable-comments-viewer/sharable-comments-viewer.component';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import {
	COMPLETE_CONTRACT_TEAM_DETAIL_TASK,
	COMPLETE_INSPECTION_TEAM_DETAIL_TASK,
} from 'src/app/modules/nest-contracts/store/team-contract/team-contract.graphql';
import { COMPLETE_PRE_QUALIFICATION_RE_ADVERTISEMENT_REQUEST_TASK } from '../../../modules/nest-pre-qualification/store/pre-qualification-re-advertisement-request/pre-qualification-re-advertisement-request.graphql';
import { ApolloNamespace } from 'src/app/apollo.config';
import { StorageService } from '../../../services/storage.service';
import { COMPLETE_CONFIRMATION_TASK } from '../../../modules/nest-tenderer-negotiation/abnomally-high/store/graphql';
import { COMPLETE_CONTRACT_EXTENSION_TASK } from '../../../modules/nest-contracts/nest-contract-extensions/store/graphql';
import { COMPLETE_CONTRACT_ADDENDUM_TASK } from '../../../modules/nest-contracts/store/contract-addendum/contract-addendum.graphql';
import { AttentionMessageComponent } from '../attention-message/attention-message.component';
import { COMPLETE_CONTRACT_SIGNING_TASK } from 'src/app/modules/nest-contracts/store/signing.graphql';
import { HttpClient } from '@angular/common/http';
import { ContractVariationRequest } from 'src/app/modules/nest-contracts/store/contract.model';
import { NavigationServicesService } from './navigation-services.service';
import { OnDoneSubmitTaskComponent } from './on-done-submit-task/on-done-submit-task.component';

export const negativeActions: string[] = [
	'DELETE',
	'REMOVE',
	'REJECT',
	'CANCEL',
	'REVOKE',
	'DENY',
	'ABORT',
	'DROP',
	'FORGET',
	'RETURN',
	'TERMINATE',
	'OPPOSE',
];
export const positiveActions: string[] = [
	'CREATE',
	'ADD',
	'SUBMIT',
	'APPROVE',
	'PROCEED',
	'KEEP',
	'ACCEPT',
	'CONTINUE',
	'KEEP UP',
	'RECALL',
	'REVIEW',
	'ENDORSE',
	'PUBLISH',
	'CONSENT',
];

@Component({
	selector: 'app-work-flow-main',
	templateUrl: './work-flow-main.component.html',
	styleUrls: ['./work-flow-main.component.scss'],
	animations: [fadeIn, fadeSmooth],
	standalone: true,
	imports: [
		NgTemplateOutlet,
		SharableCommentsViewerComponent,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
		MatOptionModule,
		MatInputModule,
		LoaderComponent,
		MatIconModule,
		CustomAlertBoxComponent,
		WorkFlowActionSelectorComponent,
		MatButtonModule,
		TranslatePipe,
		AttentionMessageComponent,
	],
})
export class WorkFlowMainComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() modelUuid: string;
	@Input() comments: WorkflowApproval[] = [];
	@Input() type: string = 'APP';
	@Input() cancelAction?: string;
	@Output() onTaskComplete: EventEmitter<boolean> = new EventEmitter();
	@Input() iSNavigateBackUrl: boolean = false;
	@Output() onTaskDelegated: EventEmitter<any> = new EventEmitter();
	@Input() possibleActions: string[] = [];
	@Input() tenderCalendars: {
		dataTime: string;
		name: string;
		orderNumber: number;
	}[] = [];
	@Input() approvalModelName: ApprovalModelNameEnum | any = null;
	@Input() procurementReq: ProcurementRequisition = null;
	@Input() agreement: any = null;
	@Input() mergedProcurementReq: MergedMainProcurementRequisition | any = null;
	@Input() approvalWorkflowStartDate: any = null;
	@Input() hideCommentInput = false;
	@Input() showCompleteTaskButton = true;
	@Input() showCheckDetailsWarning = true;
	task: any;
	message: string;
	@Input() loading: boolean;
	@Input() allowWorkflowSubmission: boolean = true;
	@Input() hideAction: boolean = false;
	@Input() reasonForHideAction =
		'You are not permitted to perform this action.';
	@Input() hideCommentSection: boolean = false;
	@Input() usesCustomForm: boolean = false;
	@Input() saveButtonText: string = 'Save';
	@Input() workflowTask: WorkflowTask = null;
	@Input() minimumCommentsCount: number = 2;
	@Input() usePossibleFlows: boolean = false;
	@Input() hideActions: boolean = false;
	@Input() possibleFlowsMapFunction: Function;
	@Input() stageName: string;
	@Input() additionalDetails: string = null;

	@Output() onPossibleActionChanged: EventEmitter<String> = new EventEmitter();
	@Output() onPossibleFlowChanged: EventEmitter<WorkFlow> = new EventEmitter();
	@Output() onCanRespond: EventEmitter<boolean> = new EventEmitter();
	@ViewChild('sound') soundPlayer!: ElementRef;
	@ViewChild('soundApprove') soundPlayerApprove!: ElementRef;
	@ViewChild('soundReview') soundPlayerReview!: ElementRef;
	@ViewChild('doneTask') doneTask!: ElementRef;
	audioElement: HTMLAudioElement;

	isNegative: boolean;
	comment: string;
	hasAttempted: boolean = false;
	terminationActionAttempt = '';
	loadingTermination: boolean;
	assigneeId: number;
	taskAction: string;
	selectedWorkFlow: WorkFlow;
	assigneeUuid: string;
	selectedGroupTaskParam?: GroupTasksParam;
	selectedAssignTaskParam?: AssignmentParam;
	departmentUsers: DepartmentUser[] = [];
	paymentCode: PaymentCode;
	contractVariation: ContractVariationRequest;
	requestSaveLoading: boolean = false;

	user$: Observable<AuthUser>;
	currentUser: AuthUser;
	showInvitationDateError: boolean = false;
	market: any;
	flowForm: UntypedFormGroup;
	endorsed: boolean;
	errorMessage: CustomAlertBoxModel;
	tenderSubCategory: TenderSubCategory;
	onSelectionChangeLoading: boolean = false;

	checkingWorkflow = false;
	updatingWorkflow = false;

	canRespond: boolean = false;
	queryParams = {};
	private previousUrl: string | null = null;
	private currentUrl: string | null = null;

	constructor(
		private graphqlService: GraphqlService,
		private dialog: MatDialog,
		private router: Router,
		private navTracker: NavigationServicesService,
		private generalService: GeneralService,
		private store: Store<fromState.State>,
		private notificationService: NotificationService,
		private http: HttpClient,
	) {
		this.user$ = this.store.pipe(
			select(selectModifiedAuthUsers),
			map((users) => users[0]),
		);



	}

	ngOnInit(): void {
		this.init();
	}

	getPreviousUrl(): string | null {
		return this.previousUrl;
	}

	getCurrentUrl(): string | null {
		return this.currentUrl;
	}

	async init() {
		this.currentUser = await firstValueFrom(this.user$.pipe(first((i) => !!i)));
		this.generatePossibleActionsBasedOnCurrentTime();

		this.errorMessage = {
			title: 'Attention',
			buttonTitle: '',
			showButton: false,
			details: [
				{
					icon: 'info',
					message:
						'Prior to proceeding with the task, kindly conduct a through review of all details. Any inaccuracies or errors may result in avoidable inconveniences. Ensure utmost certainty regarding the accuracy of the provided information. Your diligence is appreciated.',
				},
			],
		};

		this.currentUrl = this.router.url;

		this.getTenderSubCategoryByUuid(
			this.mergedProcurementReq?.tender?.tenderSubCategoryUuid ??
			this.procurementReq?.tender?.tenderSubCategoryUuid ??
			this.agreement?.tender?.tenderSubCategoryUuid,
		).then();
		this.setCanRespond();
	}

	setCanRespond() {
		if (this.workflowTask) {
			this.canRespond = false;
			let keepChecking = true;
			this.currentUser.rolesList?.forEach((role) => {
				if (role.id == this.workflowTask.groupId) {
					this.canRespond = true;
					keepChecking = false;
				}
			});
			if (keepChecking && this.workflowTask.assigneeId) {
				if (this.workflowTask.assigneeId == this.currentUser.id) {
					this.canRespond = true;
				} else {
					this.canRespond = false;
					keepChecking = false;
				}
			}
			if (keepChecking && !this.workflowTask.groupId) {
				this.canRespond = true;
			}
		} else {
			this.canRespond = true;
		}
		this.onCanRespond?.emit(this.canRespond);
	}

	ngAfterViewInit() {
		if (this.saveButtonText.toLocaleLowerCase() == 'cancel') {
			this.saveButtonText = 'Save';
		}
		this.user$ = this.store.pipe(
			select(selectModifiedAuthUsers),
			map((users) => users[0]),
		);
		// this.generateAudioForWorkFlow();

	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['modelUuid']) {
			this.modelUuid = changes['modelUuid'].currentValue;
			if (
				this.type == 'ProcurementRequisition' ||
				this.type == 'TenderCancellationRequest'
			) {
				this.checkTaskOutOfPhase().then();
			}
		}
		if (changes['possibleActions']) {
			this.possibleActions = changes['possibleActions'].currentValue;
			// update possible actions base on current time
		}
		if (changes['comments']) {
			this.comments = changes['comments'].currentValue;
		}
		if (changes['approvalModelName']) {
			this.approvalModelName = changes['approvalModelName'].currentValue;
		}
		if (changes['procurementReq']) {
			this.procurementReq = changes['procurementReq'].currentValue;
		}
		if (changes['approvalWorkflowStartDate']) {
			this.approvalWorkflowStartDate =
				changes['approvalWorkflowStartDate'].currentValue;
		}
		if (changes['autoSetComment']) {
			this.comment = changes['autoSetComment'].currentValue;
		}
	}

	getUrlWithoutQueryParams(): string {
		const urlTree = this.router.parseUrl(this.router.url);
		return urlTree.root.children['primary'].segments
			.map((it) => it.path)
			.join('/');
	}

	async checkTaskOutOfPhase() {
		try {
			this.checkingWorkflow = true;
			const response: any = await this.graphqlService.fetchData({
				query: GET_TASK_OUT_OF_PHASE_FOR_APP,
				apolloNamespace: ApolloNamespace.app,
				variables: { approvalModelUuid: this.modelUuid },
			});
			this.checkingWorkflow = false;

			if (response.data.getTaskOutOfPhaseForApp.code == 9000) {
				const notOutOfPhase = response.data.getTaskOutOfPhaseForApp.data;

				if (!notOutOfPhase) {
					this.updatingWorkflow = true;
					const res: any = await this.graphqlService.mutate({
						apolloNamespace: ApolloNamespace.app,
						mutation: SYNC_MODEL_WITH_WORKFLOW_FOR_APP,
						variables: { approvalModelUuid: this.modelUuid },
					});
					this.updatingWorkflow = false;
					if (res.data.syncModelWithWorkflowForApp.code == 9000) {
						this.notificationService.successMessage(
							'Workflow Synced, Please Respond Again',
						);
						const currentUrl = this.getUrlWithoutQueryParams();
						this.router.navigate([currentUrl]);
					}
				}
			}
		} catch (error) {
			this.notificationService.warningSnackbar(
				'Checking workflow sync, Failed',
			);
			this.checkingWorkflow = false;
			this.updatingWorkflow = false;
			console.error(error);
		}
	}

	generatePossibleActionsBasedOnCurrentTime() {
		let currentDate = new Date().toISOString().substring(0, 10);
		let invitationDate = this.tenderCalendars
			.find((calendar) => calendar.orderNumber === 1)
			?.dataTime?.substring(0, 10);
		if (invitationDate) {
			if (!(invitationDate >= currentDate)) {
				this.showInvitationDateError = true;
				this.possibleActions = this.possibleActions.filter(
					(possibleAction) => !positiveActions.includes(possibleAction),
				);
			}
		}
	}

	//generate audio SUBMIT || CANCEL || REJECT || APPROVE || FORWARD
	generateAudioForWorkFlow() {
		if (
			this.soundPlayer &&
			this.possibleActions?.length > 0 &&
			(this.possibleActions.includes('SUBMIT') ||
				this.possibleActions.includes('CANCEL'))
		) {
			const audioElement: HTMLAudioElement = this.soundPlayer.nativeElement;
			audioElement.play();
		}

		if (
			this.soundPlayerApprove &&
			this.possibleActions?.length > 0 &&
			(this.possibleActions.includes('REJECT') ||
				this.possibleActions.includes('APPROVE'))
		) {
			const audioElement: HTMLAudioElement =
				this.soundPlayerApprove.nativeElement;
			audioElement.play();
		}

		if (
			this.soundPlayerReview &&
			this.possibleActions?.length > 0 &&
			(this.possibleActions.includes('FORWARD') ||
				this.possibleActions.includes('REVIEW') ||
				this.possibleActions.includes('RETURN'))
		) {
			const audioElement: HTMLAudioElement =
				this.soundPlayerReview.nativeElement;
			audioElement.play();
		}

		this.audioElement = this.doneTask.nativeElement;
		this.audioElement.preload = 'auto';
		this.audioElement.load();
	}

	filterResponse(response: any[], forbiddenValues: string[]): any[] {
		return response
			.map((item) => ({ ...item }))
			.filter((item) => !forbiddenValues.includes(item?.value));
	}

	transformResponse(response: any): any[] {
		return response.map((item) => ({
			...item,
			name: item.name.replace(/_/g, ' ').toUpperCase(),
		}));
	}

	async getAPPTasks() {
		const response: any = await this.graphqlService.fetchData({
			query: GET_USER_TASKS,
			apolloNamespace: ApolloNamespace.app,
		});
		return response.data.getMyTask;
	}

	getComment(taskName: string) {
		return 'Action ' + taskName.toLowerCase() + '';
	}

	isNegativeAction(action: string): boolean {
		return !!negativeActions.find((negativeAction) => action == negativeAction);
	}

	getNegativeLabel(possibleActions: string[]) {
		return possibleActions.find((negativeAction: string) =>
			negativeActions.includes(negativeAction),
		);
	}

	getPositiveLabel(possibleActions: string[]) {
		return possibleActions.find((positiveAction: string) =>
			positiveActions.includes(positiveAction),
		);
	}

	getCompleteTaskEndPoint() {
		let ENDPOINT: any;
		switch (this.type) {
			case 'APP':
				ENDPOINT = COMPLETE_USER_TASK;
				break;
			case 'EvaluationTeam':
				ENDPOINT = COMPLETE_TEAM_ASSIGNMENT_TASK;
				break;
			case 'PRE_QUALIFICATION_TEAM':
				ENDPOINT = COMPLETE_TEAM_ASSIGNMENT_TASK;
				break;
			case 'PostQualificationTeam':
				ENDPOINT = COMPLETE_USER_TASK_POST_QUALIFICATION_TEAM;
				break;
			case 'NegotiationTeam':
				ENDPOINT = COMPLETE_USER_TASK_NEGOTIATION_TEAM;
				break;
			case 'ProcurementRequisition':
				ENDPOINT = COMPLETE_PROCUREMENT_REQUISITION_TASK_SIMPLIFIED;
				break;
			case 'MergedMainProcurementRequisition':
				ENDPOINT = COMPLETE_PROCUREMENT_TENDER_REQUISITION_TASKS;
				break;
			case 'TenderCancellationRequest':
				ENDPOINT = COMPLETE_TENDER_CANCELLATION_REQUEST_TASK;
				break;
			case 'TenderReAdvertisementRequest':
				ENDPOINT = COMPLETE_TENDER_RE_ADVERTISEMENT_REQUEST_TASK;
				break;
			case 'TenderWithdrawRequest':
				ENDPOINT = COMPLETE_TENDER_TERMINATION_REQUEST_TASK;
				break;
			case 'TenderRejectionRequest':
				ENDPOINT = COMPLETE_TENDER_REJECTION_REQUEST_TASK;
				break;
			case 'evaluationReport':
				ENDPOINT = COMPLETE_EVALUATION_REPORT_TASK;
				break;
			case 'EvaluationReport':
				ENDPOINT = COMPLETE_EVALUATION_REPORT_TASK;
				break;
			case 'TechnicalEvaluationReport':
				ENDPOINT = COMPLETE_EVALUATION_STAGE_REPORT_TASK;
				break;
			case 'NegotiationReport':
				ENDPOINT = COMPLETE_NEGOTIATION_REPORT_TASK;
				break;
			case 'ContractTeam':
				ENDPOINT = COMPLETE_CONTRACT_TEAM_DETAIL_TASK;
				break;
			case 'PostQualificationReport':
				ENDPOINT = COMPLETE_POST_QUALIFICATION_REPORT_TASK;
				break;
			case 'PreQualificationTeam':
				ENDPOINT = COMPLETE_TEAM_ASSIGNMENT_TASK;
				break;
			case 'PreQualification':
				ENDPOINT = COMPLETE_PRE_QUALIFICATIONS_TASK;
				break;
			case 'TenderBoard':
				ENDPOINT = COMPLETE_TENDER_BOARD_TEAM_TASK;
				break;
			case 'TenderModificationRequest':
				ENDPOINT = COMPLETE_PUBLISHED_ENTITY_ADDENDUM_TASK;
				break;
			case 'FrameworkMain':
				ENDPOINT = COMPLETE_FRAMEWORK_TASK;
				break;
			case 'CallOffOrderRequisition':
				ENDPOINT = COMPLETE_CALL_OF_ORDER_REQUISITION_TASK;
				break;
			case 'CallOffOrder':
				ENDPOINT = COMPLETE_CALL_OF_ORDER_TASK;
				break;
			case 'MicroProcurement':
				ENDPOINT = COMPLETE_MICRO_PROCUREMENT_TASK;
				break;
			case 'MicroProcurementRetirement':
				ENDPOINT = COMPLETE_RETIRE_MICRO_PROCUREMENT_TASK;
				break;
			case 'WinnerModificationRequest':
				ENDPOINT = COMPLETE_SUCCESSFUL_BIDDER_CHANGE_REQUEST_TASK;
				break;
			case 'Manufacturer':
				ENDPOINT = COMPLETE_MANUFACTURER_INVITATION_TASK;
				break;
			case 'GovernmentServiceRequisition':
				ENDPOINT = COMPLETE_GOVERNMENT_SERVICE_REQUISITION_TASKS;
				break;
			case 'OrderRequestRequisition':
				ENDPOINT = COMPLETE_ORDER_REQUEST_REQUISITION_TASKS;
				break;
			case 'Contract':
				ENDPOINT = COMPLETE_CONTRACT_TASK;
				break;
			case 'VettingAdvice':
				ENDPOINT = COMPLETE_CONTRACT_VETTING_TASK;
				break;
			case 'NegotiationTeamDetail':
				ENDPOINT = COMPLETE_NEGOTIATION_TEAM_TASK;
				break;
			case 'NegotiationPlan':
				ENDPOINT = COMPLETE_NEGOTIATION_PLAN_TASK;
				break;
			case 'NegotiationMinute':
				ENDPOINT = COMPLETE_NEGOTIATION_MINUTE_TASK;
				break;
			case 'CancellationAwardTask':
				ENDPOINT = COMPLETE_REJECT_AWARD_TASK;
				break;
			case 'AuditPlanTask':
				ENDPOINT = COMPLETE_SPECIFIC_AUDIT_PLAN_TASK;
				break;
			case 'PrequalificationReAdvertisementRequest':
				ENDPOINT = COMPLETE_PRE_QUALIFICATION_RE_ADVERTISEMENT_REQUEST_TASK;
				break;
			case 'UserBudgetConfirmation':
				ENDPOINT = COMPLETE_CONFIRMATION_TASK;
				break;
			case 'ContractExtensionRequest':
				ENDPOINT = COMPLETE_CONTRACT_EXTENSION_TASK;
				break;
			case 'ContractAddendum':
				ENDPOINT = COMPLETE_CONTRACT_ADDENDUM_TASK;
				break;
			case 'Inspection':
				ENDPOINT = COMPLETE_INSPECTION_TEAM_DETAIL_TASK;
				break;
			case 'ContractSigning':
				ENDPOINT = COMPLETE_CONTRACT_SIGNING_TASK;
				break;
			case 'ContractPayment':
				ENDPOINT = COMPLETE_CONTRACT_PAYMENT_TASK;
				break;
			case 'ContractVariationRequest':
				ENDPOINT = COMPLETE_CONTRACT_VARIATION_REQUEST_TASK;
				break;
			case 'ContractVariation':
				ENDPOINT = COMPLETE_CONTRACT_VARIATION_TASK;
				break;
			case 'ContractCessation':
				ENDPOINT = COMPLETE_CONTRACT_CESSATION_TASK;
				break;
			default:
				break;
		}
		return ENDPOINT;
	}

	getCompleteTaskApolloNamespace() {
		let ENDPOINT: ApolloNamespace;
		switch (this.type) {
			case 'APP':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'EvaluationTeam':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'PRE_QUALIFICATION_TEAM':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'PostQualificationTeam':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'NegotiationTeam':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'ProcurementRequisition':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'MergedMainProcurementRequisition':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'TenderCancellationRequest':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'TenderReAdvertisementRequest':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'TenderWithdrawRequest':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'TenderRejectionRequest':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'evaluationReport':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'EvaluationReport':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'TechnicalEvaluationReport':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'NegotiationReport':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'ContractTeam':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'PostQualificationReport':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'PreQualificationTeam':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'PreQualification':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'TenderBoard':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'TenderModificationRequest':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'FrameworkMain':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'CallOffOrderRequisition':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'CallOffOrder':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'MicroProcurement':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'MicroProcurementRetirement':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'WinnerModificationRequest':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'Manufacturer':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'GovernmentServiceRequisition':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'OrderRequestRequisition':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'Contract':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'VettingAdvice':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'NegotiationTeamDetail':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'NegotiationPlan':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'NegotiationMinute':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'CancellationAwardTask':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'AuditPlanTask':
				ENDPOINT = ApolloNamespace.nestAuditTool;
				break;
			case 'PrequalificationReAdvertisementRequest':
				ENDPOINT = ApolloNamespace.app;
				break;
			case 'UserBudgetConfirmation':
				ENDPOINT = ApolloNamespace.submission;
				break;
			case 'ContractExtensionRequest':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'ContractAddendum':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'Inspection':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'ContractSigning':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'ContractPayment':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'ContractVariationRequest':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'ContractVariation':
				ENDPOINT = ApolloNamespace.contract;
				break;
			case 'ContractCessation':
				ENDPOINT = ApolloNamespace.contract;
				break;
			default:
				break;
		}
		return ENDPOINT;
	}

	getResponseCode(data: any): number {
		switch (this.type) {
			case 'APP':
				return data.completeTask.code;
			case 'EvaluationTeam':
				return data.completeTeamAssignmentTask.code;
			case 'PRE_QUALIFICATION_TEAM':
				return data.completeTeamAssignmentTask.code;
			case 'PostQualificationTeam':
				return data.completePostQualificationTeamTask.code;
			case 'NegotiationTeam':
				return data.completeNegotiationTeamTask.code;
			case 'ProcurementRequisition':
				return data.completeProcurementRequisitionTaskSimplified.code;
			case 'MergedMainProcurementRequisition':
				return data.completeMergedProcurementRequisitionTask.code;
			case 'TenderCancellationRequest':
				return data.completeTenderCancellationRequestTask.code;
			case 'TenderReAdvertisementRequest':
				return data.completeTenderReAdvertisementRequestTask.code;
			case 'TenderWithdrawRequest':
				return data.completeTenderWithdrawRequestTask.code;
			case 'TenderRejectionRequest':
				return data.completeTenderRejectionRequestTask.code;
			case 'EvaluationReport':
				return data.completeEvaluationReportTask.code;
			case 'TechnicalEvaluationReport':
				return data.completeEvaluationStageReportTask.code;
			case 'NegotiationReport':
				return data.completeNegotiationReportTask.code;
			case 'PostQualificationReport':
				return data.completePostQualificationReportTask.code;
			case 'PreQualificationTeam':
				return data.completeTenderEvaluationTeamTask.code;
			case 'ContractTeam':
				return data.completeContractTeamDetailTask.code;
			case 'PreQualification':
				return data.completePrequalificationTask.code;
			case 'TenderBoard':
				return data.completeTenderBoardTeamTask.code;
			case 'TenderModificationRequest':
				return data.completePublishedEntityAddendumTask.code;
			case 'FrameworkMain':
				return data.completeFrameworkTask.code;
			case 'CallOffOrderRequisition':
				return data.completeCallOfOrderRequisitionTask.code;
			case 'CallOffOrder':
				return data.completeCallOfOrderTask.code;
			case 'MicroProcurement':
				return data.completeMicroProcurementTask.code;
			case 'MicroProcurementRetirement':
				return data.completeMicroProcurementRetirementTask.code;
			case 'WinnerModificationRequest':
				return data.completeSuccessFulBidderChangeRequestTask.code;
			case 'Manufacturer':
				return data.completeManufacturerInvitationApprovalTask.code;
			case 'GovernmentServiceRequisition':
				return data.completeGovernmentServiceRequisitionTasks.code;
			case 'OrderRequestRequisition':
				return data.completeOrderRequestRequisitionTasks.code;
			case 'Contract':
				return data.completeContractTask.code;
			case 'VettingAdvice':
				return data.completeContractVettingTask.code;
			case 'NegotiationTeamDetail':
				return data.completeNegotiationTeamDetailTask.code;
			case 'NegotiationPlan':
				return data.completeNegotiationPlanTask.code;
			case 'NegotiationMinute':
				return data.completeNegotiationMinuteTask.code;
			case 'CancellationAwardTask':
				return data.completeRejectedAwardTasks.code;
			case 'AuditPlanTask':
				return data.completeSpecificAuditPlanTask.code;
			case 'PrequalificationReAdvertisementRequest':
				return data.completePrequalificationReAdvertisementRequestTask.code;
			case 'UserBudgetConfirmation':
				return data.completeUserBudgetConfirmationTasks.code;
			case 'ContractExtensionRequest':
				return data.completeContractExtensionRequestTask.code;
			case 'ContractAddendum':
				return data.completeContractAddendumTask.code;
			case 'Inspection':
				return data.completeInspectionTeamDetailTask.code;
			case 'ContractSigning':
				return data.completeContractSigningTask.code;
			case 'ContractPayment':
				return data.completeContractPaymentTask.code;
			case 'ContractVariationRequest':
				return data.completeContractVariationRequestTask.code;
			case 'ContractVariation':
				return data.completeContractVariationTask.code;
			case 'ContractCessation':
				return data.completeContractCessationTask.code;
			default:
				return 99999;
		}
	}

	getMessage(data: any): string {
		switch (this.type) {
			case 'APP':
				return data.completeTask.message;
			case 'EvaluationTeam':
				return data.completeTeamAssignmentTask.message;
			case 'PostQualificationTeam':
				return data.completeTeamAssignmentTask.message;
			case 'NegotiationTeam':
				return data.completeNegotiationTeamTask.message;
			case 'ContractTeam':
				return data.completeContractTeamDetailTask.message;
			case 'ProcurementRequisition':
				return data.completeProcurementRequisitionTaskSimplified.message;
			case 'MergedMainProcurementRequisition':
				return data.completeMergedProcurementRequisitionTask.message;
			case 'TenderCancellationRequest':
				return data.completeTenderCancellationRequestTask.message;
			case 'TenderReAdvertisementRequest':
				return data.completeTenderReAdvertisementRequestTask.message;
			case 'TenderWithdrawRequest':
				return data.completeTenderWithdrawRequestTask.message;
			case 'TenderRejectionRequest':
				return data.completeTenderRejectionRequestTask.message;
			case 'EvaluationReport':
				return data.completeEvaluationReportTask.message;
			case 'NegotiationReport':
				return data.completeNegotiationReportTask.message;
			case 'PostQualificationReport':
				return data.completePostQualificationReportTask.message;
			case 'TenderBoard':
				return data.completeTenderBoardTeamTask.message;
			case 'TenderModificationRequest':
				return data.completePublishedEntityAddendumTask.message;
			case 'FrameworkMain':
				return data.completeFrameworkTask.message;
			case 'CallOffOrderRequisition':
				return data.completeCallOfOrderRequisitionTask.message;
			case 'CallOffOrder':
				return data.completeCallOfOrderTask.message;
			case 'MicroProcurement':
				return data.completeMicroProcurementTask.message;
			case 'MicroProcurementRetirement':
				return data.completeMicroProcurementRetirementTask.message;
			case 'WinnerModificationRequest':
				return data.completeSuccessFulBidderChangeRequestTask.message;
			case 'Manufacturer':
				return data.completeManufacturerInvitationApprovalTask.message;
			case 'Contract':
				return data.completeContractTask.message;
			case 'VettingAdvice':
				return data.completeContractVettingTask.message;
			case 'GovernmentServiceRequisition':
				return data.completeGovernmentServiceRequisitionTasks.message;
			case 'OrderRequestRequisition':
				return data.completeOrderRequestRequisitionTasks.message;
			case 'NegotiationMinute':
				return data.completeNegotiationMinuteTask.message;
			case 'NegotiationPlan':
				return data.completeNegotiationPlanTask.message;
			case 'CancellationAwardTask':
				return data.completeRejectedAwardTasks.message;
			case 'AuditPlanTask':
				return data.completeSpecificAuditPlanTask.message;
			case 'PrequalificationReAdvertisementRequest':
				return data.completePrequalificationReAdvertisementRequestTask.message;
			case 'UserBudgetConfirmation':
				return data.completeUserBudgetConfirmationTasks.message;
			case 'ContractExtensionRequest':
				return data.completeContractExtensionRequestTask.message;
			case 'ContractAddendum':
				return data.completeContractAddendumTask.message;
			case 'Inspection':
				return data.completeInspectionTeamDetailTask.message;
			case 'ContractSigning':
				return data.completeContractSigningTask.message;
			case 'ContractPayment':
				return data.completeContractPaymentTask.message;
			case 'ContractVariationRequest':
				return data.completeContractVariationRequestTask.message;
			case 'ContractVariation':
				return data.completeContractVariationTask.message;
			case 'ContractCessation':
				return data.completeContractCessationTask.message;
			default:
				return '';
		}
	}

	async completeTask(
		taskSelectedActionName,
		callbackFunction: Function = null,
	) {
		this.loading = true;
		this.message =
			this.formatTaskName(taskSelectedActionName) +
			' task execution, please wait.... ';
		let dataToSave: {
			isAssigning?: boolean;
			assigneeUuid?: string;
			action?: any;
			comment?: string;
			modelUid?: string;
		} = {
			modelUid: this.modelUuid,
			action: taskSelectedActionName,
			comment: this.comment ?? this.getComment(taskSelectedActionName),
			assigneeUuid: null,
			isAssigning: !!this.getCurrentObject()?.assignmentParams,
		};

		if (this.assigneeUuid) {
			dataToSave = {
				...dataToSave,
				assigneeUuid: this.assigneeUuid,
			};
		}

		if (
			taskSelectedActionName == 'APPROVE' &&
			['MergedMainProcurementRequisition', 'FrameworkMain'].includes(this.type)
		) {
			//perform billing actions
			await this.processSPNPayment(dataToSave, taskSelectedActionName);
		} else if (
			(taskSelectedActionName == 'APPROVE' ||
				taskSelectedActionName == 'RETURN') &&
			['ContractVariationRequest'].includes(this.type)
		) {
			//perform billing actions
			await this.processContractVariationRequest(
				dataToSave,
				taskSelectedActionName,
			);
		} else {
			//Set Market Approach
			if (this.approvalModelName === 'ProcurementRequisition') {
				const defaultMarketApproach = {
					uuid: this.modelUuid,
					marketApproach: this.tenderSubCategory?.marketApproach || 'TENDER',
					tenderUuid: '',
					type: 'GOODS',
					businessLineUuids: [],
				};
				this.setMarketApproach(defaultMarketApproach).then();
			}
			await this.saveWorkflowData(
				dataToSave,
				taskSelectedActionName,
				callbackFunction,
			);
		}
	}

	onDoneSubmitTask() {
		this.playSound();
		const dialogConfig = new MatDialogConfig();
		dialogConfig.width = '540';
		dialogConfig.height = '300';
		dialogConfig.minWidth = '540px';
		dialogConfig.minHeight = '300px';
		dialogConfig.autoFocus = true;
		dialogConfig.disableClose = true;
		const dialogRef = this.dialog.open(OnDoneSubmitTaskComponent, dialogConfig);

		// Automatically close the dialog after 5 seconds
		setTimeout(() => {
			dialogRef.close(); // Close the dialog
		}, 4000); // 4000ms = 4 seconds

		// Handle the dialog close event
		dialogRef.afterClosed().subscribe((result: any) => {
			window.location.reload(); // Reload the page
			this.onTaskComplete.emit(true); // Emit task complete event
		});
	}


	playSound() {
		if (!this.doneTask?.nativeElement) {
			setTimeout(() => {
				if (this.doneTask?.nativeElement) {
					this.playAudio();
				}
			}, 500);
		} else {
			this.playAudio();  // If initialized, play sound
		}
	}

	private playAudio() {
		const audioElement: HTMLAudioElement = this.doneTask.nativeElement;
		audioElement.muted = false;
		audioElement.play().catch(error => {
			console.error('Playback failed:', error);
		});
	}

	async saveWorkflowData(
		dataToSave: any,
		taskSelectedActionName: string,
		callbackFunction: Function = null,
	) {
		try {

			const response: any = await this.graphqlService.mutate({
				mutation: this.getCompleteTaskEndPoint(),
				apolloNamespace: this.getCompleteTaskApolloNamespace(),
				variables: {
					workingFlowTaskListDto: [dataToSave],
				},
			});

			if (callbackFunction) {
				callbackFunction(response);
			}

			if (this.getResponseCode(response.data) == 9000) {
				this.updateNotificationCount();
				this.notificationService.successMessage(
					this.formatTaskName(taskSelectedActionName) == 'Approve'
						? this.formatTaskName(taskSelectedActionName) + 'd successfully'
						: this.formatTaskName(taskSelectedActionName) + 'ed successfully',
				);


				if (this.iSNavigateBackUrl) {
					this.navTracker.urlsReady$.subscribe(isReady => {
						if (isReady) {
							const previousUrl = this.navTracker.getPreviousUrl();
							const currentUrl = this.navTracker.getCurrentUrl();

							if (previousUrl) {
								window.location.href = previousUrl;
							} else {
								window.location.reload();
							}
						} else {
							window.location.reload();
						}
					});
				} else {
					this.onTaskComplete.emit(true);
					this.loading = false;
					this.message = '';
					this.isNegative = null;
					this.comment = '';
				}


			} else {
				this.loading = false;
				this.message = '';
				this.isNegative = null;
				this.comment = '';
				this.notificationService.errorMessage(this.getMessage(response.data));
			}
		} catch (e) {
			this.loading = false;
			this.message = '';
			this.isNegative = null;
			this.comment = '';
			this.notificationService.errorMessage(
				'Problem occurred, please try again',
			);
			console.error(e);
		}
	}

	async setMarketApproach(dataToSave: any) {
		try {
			const response: any = await this.graphqlService.mutate({
				mutation: SET_PROCUREMENT_REQUISITION_MARKET,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					input: dataToSave,
				},
			});
			const data = response.data.setProcurementRequisitionMarketApproach;
			if (data?.code == 9000) {
			} else {
				this.notificationService.errorMessage(this.getMessage(response.data));
			}
		} catch (e) {
			console.error(e);
		}
	}

	updateNotificationCount() {
		this.store.dispatch(clearNotifications());
		this.store.dispatch(getNotifications());
		this.store.dispatch(getClarificationNotifications());
	}

	async onSelectingTaskAction(event: any) {
		if (this.onPossibleActionChanged) {
			this.onPossibleActionChanged.emit(event.value);
		}
		this.selectedAssignTaskParam = null;
		this.selectedGroupTaskParam = null;
		let currentObject = this.getCurrentObject();
		let departmentUsers: DepartmentUser[] = [];
		this.onSelectionChangeLoading = true;
		this.endorsed = event.value === 'ENDORSE';
		let relatedTenderAssignedEmail: string[] = [];

		this.selectedGroupTaskParam =
			currentObject?.groupTasksParams?.find(
				(param) => param.action == event.value,
			) ?? null;

		if (currentObject?.assignmentParams?.action == event.value) {
			this.selectedAssignTaskParam = currentObject?.assignmentParams ?? null;
		}

		if (this.selectedGroupTaskParam) {
			departmentUsers = await this.getAllUsersByGroupAndProcuringEntity(
				this.selectedGroupTaskParam.locationId,
				this.selectedGroupTaskParam.group,
			);
		} else if (!this.selectedGroupTaskParam && this.selectedAssignTaskParam) {
			departmentUsers = await this.getAllUsersByGroupAndProcuringEntity(
				null,
				this.selectedAssignTaskParam.group,
			);
			if (this.type == 'ProcurementRequisition') {
				relatedTenderAssignedEmail = await this.getRelatedTenderAssigned(
					currentObject.uuid,
				);
			}
		} else {
			departmentUsers = [];
			relatedTenderAssignedEmail = [];
		}

		this.departmentUsers = departmentUsers;

		// if (relatedTenderAssignedEmail.length) {
		//   this.departmentUsers = departmentUsers.filter(user => relatedTenderAssignedEmail.includes(user.email));
		// } else {
		// }

		// select default assignee
		this.assigneeUuid = (this.departmentUsers || []).find((user) =>
			relatedTenderAssignedEmail?.includes(user.email),
		)?.uuid;
		if (!this.assigneeUuid) {
			this.assigneeUuid = (this.departmentUsers || []).find(
				(user) => user.email == this.getCurrentObject()?.createdBy,
			)?.uuid;
		}
		this.hasAttempted = true;
		this.onSelectionChangeLoading = false;
	}

	async onSelectingFlow(flow: any) {
		let _flow: WorkFlow = flow.value;
		this.onPossibleFlowChanged.emit(_flow);
		this.taskAction = _flow.action;
		this.onSelectingTaskAction({
			value: _flow.action,
		}).then();
	}

	async onFlowSelected(flow: WorkFlow) {
		this.onPossibleFlowChanged.emit(flow);
		this.taskAction = flow.action;
		this.onSelectingTaskAction({
			value: flow.action,
		}).then();
	}

	async getRelatedTenderAssigned(
		procurementRequisitionUuid: string,
	): Promise<string[]> {
		try {
			const response: any = await this.graphqlService.fetchData({
				query: GET_USERS_ASSIGNED_TO_TENDER,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					procurementRequisitionUuid: procurementRequisitionUuid,
				},
			});
			if (response.data.getUsersAssignedToTender.code === 9000) {
				return response.data.getUsersAssignedToTender.dataList;
				// select default assignee
			} else {
				return [];
			}
		} catch (e) {
			return [];
		}
	}

	attemptComplete(sign: boolean) {
		this.isNegative = sign;
		this.hasAttempted = true;
	}

	formatTaskName(taskName: string) {
		return taskName.charAt(0) + taskName.substring(1).toLocaleLowerCase();
	}

	// attemptTermination(attemptTo: 'TERMINATE' | 'CONTINUE') {
	//   this.terminationActionAttempt = attemptTo;
	// }

	// REFRESH VIEW WITH CURRENT DATA
	async getTenderRequisitionByUuid(reqUuid: string) {
		this.loadingTermination = true;
		try {
			const response: any = await this.graphqlService.fetchData({
				query: GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					uuid: reqUuid,
				},
			});
			if (response.data.getMergedProcurementRequisitionByUuid.code === 9000) {
				this.mergedProcurementReq = (await response.data
					.getMergedProcurementRequisitionByUuid
					.data) as MergedProcurementRequisition;
				this.possibleActions = this.mergedProcurementReq
					? this.mergedProcurementReq.mergedMainProcurementRequisition?.possibleActions?.split(
						',',
					)
					: [];
			} else {
				throw new Error(
					response.data.getMergedProcurementRequisitionByUuid?.message,
				);
			}
		} catch (e) {
			console.error(e);

			this.notificationService.errorMessage(
				'Failed to get requisition... ' + e.message,
			);
		}
		this.loadingTermination = false;
	}

	async getAllUsersByGroupAndProcuringEntity(
		locationId: any,
		commonName: string,
	): Promise<DepartmentUser[]> {
		this.currentUser = await firstValueFrom(
			this.user$.pipe(first((i) => !!i && !!i.procuringEntity)),
		);
		try {
			let mustHaveFilters = [];
			if (this.currentUser?.procuringEntity?.uuid) {
				mustHaveFilters.push({
					fieldName: 'procuringEntityUuid',
					value1: this.currentUser?.procuringEntity?.uuid,
					operation: 'EQ',
				});
			}
			if (locationId) {
				mustHaveFilters.push({
					fieldName: 'department.id',
					value1: locationId + '',
					operation: 'EQ',
				});
			}
			if (commonName) {
				mustHaveFilters.push({
					fieldName: 'roleName',
					value1: commonName,
					operation: 'EQ',
				});
			}
			const response: any = await this.graphqlService.fetchData({
				query: GET_PROCURING_ENTITY_USERS_BY_UUID_AND_ROLE_NAME_DATA,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					input: {
						fields: [],
						mustHaveFilters: mustHaveFilters,
						page: 1,
						pageSize: 100,
					},
				},
			});
			return response?.data?.items?.rows || [];
		} catch (e) {
			return [];
		}
	}

	getCurrentObject() {
		let object: any;
		if (
			this.type == 'ProcurementRequisition' ||
			this.type == 'CallOffOrderRequisition'
		) {
			object = this.procurementReq;
		} else if (
			this.type == 'MergedProcurementRequisition' ||
			this.type == 'MergedMainProcurementRequisition'
		) {
			object = this.mergedProcurementReq;
		} else if (this.type == 'FrameworkMain') {
			object = this.agreement;
		}

		if (
			object?.groupTasksParams &&
			typeof object?.groupTasksParams == 'string'
		) {
			object.groupTasksParams = JSON.parse(object?.groupTasksParams);
		}
		return object;
	}

	async getTenderSubCategoryByUuid(uuid: string): Promise<void> {
		if (uuid) {
			try {
				this.tenderSubCategory = null;
				const response: any = await this.graphqlService.fetchData({
					apolloNamespace: ApolloNamespace.uaa,
					query: GET_TENDER_SUB_CATEGORY_BY_UUID,
					variables: {
						uuid,
					},
				});

				if (response.data.findTenderSubCategoryByUuid.code === 9000) {
					this.tenderSubCategory =
						response.data.findTenderSubCategoryByUuid.data;
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	//update tenderer variation requests
	async processContractVariationRequest(
		dataToSaveFromTask: any,
		taskSelectedActionName: string,
	) {
		//get contract variation request by uuid
		await this.getContractVariationByUuid(dataToSaveFromTask.modelUid);

		if (this.contractVariation) {
			try {
				const dataToSave = {
					attachmentUuid: this.contractVariation.attachmentUuid,
					description: this.contractVariation.description,
					title: this.contractVariation.title,
					contractUuid: this.contractVariation.contract.uuid,
					variationStatus:
						taskSelectedActionName == 'APPROVE' ? 'APPROVED' : 'REJECTED',
					uuid: this.contractVariation.uuid,
				};

				const response = await this.graphqlService.mutate({
					apolloNamespace: ApolloNamespace.contract,
					mutation: CREATE_UPDATE_CONTRACT_VARIATION_REQUEST,
					variables: {
						contractVariationRequestDto: dataToSave,
					},
				});

				if (response.data.createUpdateContractVariationRequest.code === 9000) {
					this.requestSaveLoading = false;
					await this.saveWorkflowData(
						dataToSaveFromTask,
						taskSelectedActionName,
					);
				} else {
					this.requestSaveLoading = false;
					this.notificationService.errorMessage(
						response.data.createUpdateContractVariationRequest.message ??
						'Failed to save contract variation request. Please try again',
					);
				}
			} catch (e) {
				this.requestSaveLoading = false;
				console.error(e.message);
				this.notificationService.errorMessage(
					e.message ?? 'Problem occurred while Saving',
				);
			}
			this.requestSaveLoading = false;
		} else {
			this.notificationService.errorMessage(
				'Failed to save contract variation request. Please try again',
			);
		}
	}

	// SPN payment Functions
	async processSPNPayment(dataToSave: any, taskSelectedActionName: string) {
		this.currentUser = await firstValueFrom(
			this.user$.pipe(first((i) => !!i && !!i.procuringEntity)),
		);
		const { billingStatus, failedToGetBillingStatus } =
			await this.getBillingStatus();
		if (billingStatus && !failedToGetBillingStatus) {
			// check for NEST Institution
			if (
				this.currentUser?.procuringEntity?.uuid === environment.NEST_ENTITY_UUID
			) {
				await this.saveWorkflowData(dataToSave, taskSelectedActionName);
			} else {
				this.paymentCode = await this.getPaymentCodeByServiceCode(
					SystemPaymentCodeEnum.SPN_PUBLISHING,
				);

				if (this.paymentCode) {
					await this.manageSPNPayments(dataToSave, taskSelectedActionName);
					this.loading = false;
				} else {
					this.notificationService.errorMessage(
						'SPN publishing code is not available. Please contact system administrator for further assistance',
					);
					this.loading = false;
				}
			}
		} else if (!billingStatus && !failedToGetBillingStatus) {
			await this.saveWorkflowData(dataToSave, taskSelectedActionName);
		} else {
			console.error('Failed to get billing Status');
			this.notificationService.errorMessage(
				'Something went wrong. Please refresh...',
			);
		}
	}

	async getBillingStatus(): Promise<{
		billingStatus: boolean;
		failedToGetBillingStatus: boolean;
	}> {
		try {
			// const result: any = await this.graphqlService.fetchData({
			// 	query: GET_GLOBAL_SETTING_BY_SETTING_KEY,
			// 	apolloNamespace: ApolloNamespace.uaa,
			// 	variables: { settingKey: 'ALLOW_BILLING' },
			// });

			// if (result.data.findGlobalSettingByKey.code === 9000) {
			// 	const billingSettingsData = result.data.findGlobalSettingByKey.data;
			// const data: any = await firstValueFrom(
			// 	this.http.get<any>(
			// 		environment.AUTH_URL + `/nest-cache/settings/by/key/ALLOW_BILLING`
			// 	)
			// );
			//
			// const billingSettingsData = data?.value;

			const billingSettingsData = environment.ALLOW_BILLING_SERVICE;
			if (billingSettingsData) {
				return {
					billingStatus: billingSettingsData,
					failedToGetBillingStatus: false,
				};
			} else {
				return {
					billingStatus: false,
					failedToGetBillingStatus: false,
				};
			}
		} catch (e) {
			return {
				billingStatus: false,
				failedToGetBillingStatus: true,
			};
		}
	}

	async getDenyServiceForPendingBills(): Promise<{
		denyServiceForPendingBills: boolean;
		failedToGetDenyServiceForPendingBillsStatus: boolean;
	}> {
		try {
			const result: any = await this.graphqlService.fetchData({
				query: GET_BILLING_GLOBAL_SETTING_BY_KEY,
				apolloNamespace: ApolloNamespace.billing,
				variables: { key: 'DENY_SERVICE_FOR_PENDING_BILLS' },
			});

			if (result.data.findBillingGlobalSettingByKey.code === 9000) {
				const billingGlobalSetting =
					result.data.findBillingGlobalSettingByKey.data;
				return {
					denyServiceForPendingBills: billingGlobalSetting.value === 'ON',
					failedToGetDenyServiceForPendingBillsStatus: false,
				};
			} else {
				return {
					denyServiceForPendingBills: false,
					failedToGetDenyServiceForPendingBillsStatus: true,
				};
			}
		} catch (e) {
			return {
				denyServiceForPendingBills: false,
				failedToGetDenyServiceForPendingBillsStatus: true,
			};
		}
	}

	async getPaymentCodeByServiceCode(serviceCode: string): Promise<PaymentCode> {
		try {
			const result: any = await this.graphqlService.fetchData({
				apolloNamespace: ApolloNamespace.billing,
				query: FIND_PAYMENT_CODE_BY_SYSTEM_CODE,
				variables: { systemPaymentCode: serviceCode },
			});

			if (result.data.findPaymentCodeBySystemCode.code === 9000) {
				return result.data.findPaymentCodeBySystemCode.data;
			}
			return null;
		} catch (e) {
			return null;
		}
	}

	async manageSPNPayments(dataToSave: any, taskSelectedActionName: string) {
		const denyService = await this.getDenyServiceForPendingBills();
		let hasPendingBills = false;
		let isPaid = false;
		let hasBeenWaived = false;
		if (
			denyService.denyServiceForPendingBills &&
			!denyService.failedToGetDenyServiceForPendingBillsStatus
		) {
			// consider checking if user has pending bill.
			const billPaymentCheck: BillPaymentCheck =
				await this.checkForSPNPayments();
			hasPendingBills = billPaymentCheck.pendingBillStatus;
			hasBeenWaived = billPaymentCheck.hasBeenWaived;
			isPaid = billPaymentCheck.itemPaymentStatus;
		}

		if (hasPendingBills && !hasBeenWaived) {
			const isClosed = await this.generalService.customAlertBoxDialog({
				alertInfo: {
					title:
						'Failed to publish SPN. Please settle your pending bill(s) before proceeding',
					buttonTitle: 'View Pending Bill(s)',
					showButton: true,
				},
				alertClass: 'bg-red-100 border-red-300  rounded',
				alertButtonClass: 'border-grey !bg-white',
				alertTextClass: 'text-[#302e2e] text-lg',
			});
			if (isClosed) {
				await this.router.navigate(['modules/bills/pending-bills']);
			}
		} else if (!hasPendingBills || (hasPendingBills && hasBeenWaived)) {
			if (!isPaid) {
				// GENERATE BILL FOR PAYMENT
				await this.generateBillForPayment(dataToSave, taskSelectedActionName);
			} else {
				await this.saveWorkflowData(dataToSave, taskSelectedActionName);
			}
		} else {
			this.notificationService.errorMessage(
				'Failed to generate SPN bill please try again',
			);
		}
	}

	async getContractVariationByUuid(uuid: string) {
		try {
			const response: any = await this.graphqlService.fetchData({
				apolloNamespace: ApolloNamespace.contract,
				query: GET_CONTRACT_VARIATION_REQUEST_BY_UUID,
				variables: {
					uuid: uuid,
				},
			});
			if (response.data.getContractVariationRequestByUuid.code === 9000) {
				this.contractVariation = await response.data
					.getContractVariationRequestByUuid.data;
				//
			} else {
				this.notificationService.errorMessage(
					'Failed to get payment request workflow data...',
				);
			}
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'Failed to get payment request workflow data...',
			);
		}
	}

	// {
	//   "billableEntityType": "PE",
	//   "billableEntityUuid": "909213a5-d69b-433f-aa3b-e4b753fb8ce5",
	//   "entityName": "MergedMainProcurementRequisition",
	//   "serviceFeeType": "SPN_CHARGES",
	//   "servicePaymentCode": "140207"
	// }
	async checkForSPNPayments(): Promise<BillPaymentCheck> {
		let tenderNumber: string;
		let financialYear: string;
		let entityUuid: string;
		if (this.mergedProcurementReq) {
			tenderNumber = this.mergedProcurementReq?.tender?.tenderNumber;
			financialYear = this.mergedProcurementReq?.tender?.financialYearCode;
			entityUuid = this.mergedProcurementReq?.uuid;
		}
		if (this.agreement) {
			tenderNumber = this.agreement?.tenderNumber;
			financialYear = this.agreement?.financialYearCode;
			entityUuid = this.agreement?.uuid;
		}

		const response: any = await this.graphqlService.fetchData({
			query: CHECK_PAYMENT_BY_ENTITY_UUID,
			apolloNamespace: ApolloNamespace.billing,
			variables: {
				verifyingPaymentDto: {
					billableEntityType: 'PE',
					billableEntityUuid: this.currentUser?.procuringEntity?.uuid,
					entityUuid: entityUuid,
					entityName: this.type,
					serviceFeeType: 'SPN_CHARGES',
					tenderNumber: tenderNumber,
					financialYear: financialYear,
					servicePaymentCode: this.paymentCode.code,
				},
			},
		});
		if (
			[9000, 9005].includes(
				response.data.getCurrentBillAndPendingBillsPaymentStatus.code,
			)
		) {
			return response.data.getCurrentBillAndPendingBillsPaymentStatus.data;
		} else {
			return null;
		}
	}

	async generateBillForPayment(
		dataToSave: any,
		taskSelectedActionName: string,
	) {
		this.currentUser = await firstValueFrom(
			this.user$.pipe(first((i) => !!i && !!i.procuringEntity)),
		);
		let entityType = null;
		if (this.mergedProcurementReq?.tender?.isCuis) {
			entityType =
				TenderSubCategoryProcessApplicableToEntityTypeEnum[
				this.tenderSubCategory?.processApplicableTo
				];
		}

		if (
			this.agreement?.tender?.isCuis &&
			this.agreement?.tender?.frameworkType == 'OWN_FRAMEWORK'
		) {
			entityType = 'FRAMEWORK';
		} else {
			entityType = EntityTypeEnum.TENDER;
		}

		const response: any = await this.graphqlService.fetchData({
			query: GENERATE_BILL_FOR_TENDER_PUBLISHING_BY_TENDER_NUMBER,
			apolloNamespace: ApolloNamespace.billing,
			variables: {
				tenderPublishingBillDto: {
					billableEntityUuid: this.currentUser?.procuringEntity?.uuid,
					entityName: 'FrameworkMain',
					entityType: entityType,
					entityUuid: this.mergedProcurementReq?.uuid ?? this.agreement?.uuid,
					financialYearCode:
						this.mergedProcurementReq?.tender?.financialYearCode ??
						this.agreement?.financialYearCode,
					entityDescription:
						this.mergedProcurementReq?.tender?.descriptionOfTheProcurement ??
						this.agreement?.description,
					entityNumber:
						this.mergedProcurementReq?.tender?.tenderNumber ??
						this.agreement?.tenderNumber,
					tenderNumber:
						this.mergedProcurementReq?.tender?.tenderNumber ??
						this.agreement?.tenderNumber,
					paymentCode: this.paymentCode.code,
					procurementMethodUuid:
						this.mergedProcurementReq?.tender?.procurementMethod?.uuid ??
						this.agreement?.procurementMethodUuid,
					numberOfTender: 1,
				},
			},
		});
		if (
			response.data.generateBillForTenderPublishingByTenderNumber.code == 9000
		) {
			const bill: GeneratedGPNBill =
				response.data.generateBillForTenderPublishingByTenderNumber.data;
			this.openBillDialog(bill, dataToSave, taskSelectedActionName);
		} else {
			if (
				response.data?.generateBillForTenderPublishingByTenderNumber?.message
			) {
				this.notificationService.errorMessage(
					response.data?.generateBillForTenderPublishingByTenderNumber?.message,
				);
			}
		}
	}

	openBillDialog(
		bill: GeneratedBill,
		dataToSave: any,
		taskSelectedActionName: string,
	): void {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80%';
		dialogConfig.data = {
			bill: bill,
			type: 'PE',
		};
		this.dialog
			.open(ViewServiceBillComponent, dialogConfig)
			.afterClosed()
			.subscribe(async (result) => {
				if (result) {
					await this.saveWorkflowData(dataToSave, taskSelectedActionName);
				} else {
					/// TODO to be removed if not implemented
				}
			});
	}

	async completeTaskWithAdditionalDetails(
		taskSelectedActionName: string,
		additionalDetails: string,
		callbackFunction: Function = null,
	) {
		this.loading = true;
		this.message =
			this.formatTaskName(taskSelectedActionName) + 'ing please wait.... ';
		let dataToSave: {
			isAssigning?: boolean;
			assigneeUuid?: string;
			action?: any;
			comment?: string;
			modelUid?: string;
			additionalDetails: string;
		} = {
			modelUid: this.modelUuid,
			action: taskSelectedActionName,
			comment: this.comment ?? this.getComment(taskSelectedActionName),
			assigneeUuid: null,
			isAssigning: !!this.getCurrentObject()?.assignmentParams,
			additionalDetails,
		};

		if (this.assigneeUuid) {
			dataToSave = {
				...dataToSave,
				assigneeUuid: this.assigneeUuid,
			};
		}

		if (
			taskSelectedActionName == 'APPROVE' &&
			this.type == 'MergedMainProcurementRequisition'
		) {
			//perform billing actions
			await this.processSPNPayment(dataToSave, taskSelectedActionName);
		} else {
			await this.saveWorkflowData(
				dataToSave,
				taskSelectedActionName,
				callbackFunction,
			);
		}
	}

	goBack() {
		window.history.back();
	}
}

export interface DepartmentUser {
	firstName: string;
	lastName: string;
	middleName: string;
	email: string;
	uuid: string;
}
