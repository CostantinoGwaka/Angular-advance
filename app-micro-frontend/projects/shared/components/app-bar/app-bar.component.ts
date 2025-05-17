import { UserHandOverComponent } from '../../../modules/nest-uaa/user-hand-over/user-hand-over.component';
import { selectAllUsers } from '../../../modules/nest-uaa/store/user-management/user/user.selectors';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import {
	selectAllAuthUsers,
	selectModifiedAuthUsers,
} from '../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { AlertNotification } from '../../../store/alert/alert.model';
import { SettingsService } from '../../../services/settings.service';
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	NgZone,
	OnInit,
	Output,
	Signal,
	ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
	firstValueFrom,
	fromEvent,
	merge,
	Observable,
	of,
	Subscription,
} from 'rxjs';
import { first, map } from 'rxjs/operators';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { AuthUser } from '../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../store';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserChangePasswordComponent } from '../../../modules/nest-uaa/user-change-password/user-change-password.component';
import { GraphqlService } from '../../../services/graphql.service';
import {
	Notification,
	NotificationsComponent,
} from '../notifications/notifications.component';
import { Go } from 'src/app/store/router/router.action';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import * as moment from 'moment';
import { UserChangeKeyphraseComponent } from '../../../modules/nest-uaa/user-change-keyphrase/user-change-keyphrase.component';
import { UserDocumentVerificationComponent } from '../../../modules/nest-uaa/user-document-verification/user-document-verification.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../../services/translation.service';
import {
	clearNotifications,
	getNotifications,
} from '../store/notification/notification.actions';
import { selectAllNotification } from '../store/notification/notification.selectors';
import { selectAllClarificationNotification } from '../store/clarification-notification/clarification-notification.selectors';
import { getClarificationNotifications } from '../store/clarification-notification/clarification-notification.actions';
import { UserSwitchAccountComponent } from 'src/app/modules/nest-uaa/user-switch-account/user-switch-account.component';
import {
	COUNT_AUDIT_PLAN_EXECUTION_INITIATION_BY_AUDIT_STAGE,
	COUNT_CUIS_REPORT_AO,
	COUNT_TENDER_REQUESTED_FOR_EDITING,
	GET_COUNT_FOR_EXTENSION_TASK,
	GET_COUNT_FOR_FORM_EIGHT_TASK,
	GET_COUNT_FOR_FORM_SEVEN_TASK,
	GET_COUNT_FOR_TASK,
	GET_MY_SPECIFIC_AUDIT_PLAN_TASKS_SUMMARY,
} from '../store/clarification-notification/clarification-notification.graphql';
import { COUNT_SUBMMISSION_CHANGE_WINNER_REQUEST } from 'src/app/modules/nest-app/store/micro-procurement/micro-procurement.graphql';
import { NotificationService } from '../../../services/notification.service';
import { UserRevokeKeyphraseComponent } from '../../../modules/nest-uaa/user-revoke-keyphrase/user-revoke-keyphrase.component';
import { DeliveryNoteApprovalStatusEnum } from '../../../modules/nest-government/store/delivery-note/delivery-note.model';
import {
	GET_DELIVERY_NOTE_COUNT,
	GET_DELIVERY_NOTE_FOR_PE_COUNT,
} from '../../../modules/nest-government/store/delivery-note/delivery-note.graphql';
import { SearchOperation } from '../../../store/global-interfaces/organizationHiarachy';
import { ApprovalStatusEnum } from '../../../modules/nest-government/store/delivery-advise/delivery-advise.model';
import {
	GET_DELIVERY_ADVISE_COUNT,
	GET_DELIVERY_ADVISE_FOR_PE_COUNT,
} from '../../../modules/nest-government/store/delivery-advise/delivery-advise.graphql';
import { selectAlLGovernmentServiceNotifications } from '../store/government-service-notification/government-service-notification.selectors';
import { GovernmentServiceNotification } from '../store/government-service-notification/government-service-notification.model';

import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { LoaderComponent } from '../loader/loader.component';
import { CustomNotificationComponent } from './custom-notification/custom-notification.component';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InputHintComponent } from '../input-hint/input-hint.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SystemSearchAreaComponent } from './system-search-area/system-search-area.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { InternetStatusBarComponent } from '../internet-status-bar/internet-status-bar.component';
import { GovernmentServiceNotificationService } from '../store/government-service-notification/government-service-notification.service';
import { ContractGenerationTasksService } from 'src/app/modules/nest-contracts/contract-generation-tasks.service';
import { ContractSigningTasksService } from 'src/app/modules/nest-contracts/contract-signinig-tasks.service';
import { ContractVettingTasksService } from 'src/app/modules/nest-contracts/contract-vetting-tasks.service';
import { ContractPreconditionsTasksService } from 'src/app/modules/nest-contracts/contract-preconditions-tasks.service';
import { TendererContractSigningTasksService } from 'src/app/modules/nest-contracts/tenderer-contract-signinig-tasks.service';
import { NestLaucheComponent } from '../nest-lauche/nest-lauche.component';
import { ApolloNamespace } from 'src/app/apollo.config';
import { CLEAR_ALL_CLARIFICATIONS } from 'src/app/modules/nest-tenderer/store/submission/submission.graphql';
import { SaveLoaderComponent } from "../save-loader/save-loader.component";
import { SignalsStoreService } from 'src/app/services/signals-store.service';

@Component({
	selector: 'app-app-bar',
	templateUrl: './app-bar.component.html',
	styleUrls: ['./app-bar.component.scss'],
	standalone: true,
	imports: [
		InternetStatusBarComponent,
		MatButtonModule,
		MatIconModule,
		SystemSearchAreaComponent,
		MatProgressSpinnerModule,
		MatMenuModule,
		MatBadgeModule,
		InputHintComponent,
		MatSidenavModule,
		MatToolbarModule,
		HasPermissionDirective,
		CustomNotificationComponent,
		LoaderComponent,
		RouterLink,
		NotificationsComponent,
		MatRippleModule,
		MatDividerModule,
		AsyncPipe,
		JsonPipe,
		TranslatePipe,
		NestLaucheComponent,
		SaveLoaderComponent,
	],
})
export class AppBarComponent implements OnInit, AfterViewInit {
	@Output() public sidenavToggle = new EventEmitter();
	@ViewChild(MatMenuTrigger) profileMenuTrigger: MatMenuTrigger;
	@ViewChild('sound', { static: false }) soundPlayer!: ElementRef<HTMLAudioElement>;
	audioElement: HTMLAudioElement;
	@Input() usedInApps = false;
	@Input() url: string;
	hideUserDiv: boolean = true;
	@Input() showHome = true;
	loadingVideo: boolean = false;
	landing: boolean = false;
	@Output() showHelp = new EventEmitter();
	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(map((result) => result.matches));

	lastDayToShowLaunchCelebration = new Date('2024-09-17');
	canCelebrate = true;

	loading$!: Observable<boolean>;
	user$: Observable<AuthUser>;
	users: User;
	institutionName: string;
	serviceUserType: string;
	token: string;
	showSearchbar: boolean;
	callShowBanner: boolean = false;
	userName = '';
	email: any;
	@ViewChild('sideNav') sideNav: MatSidenav;
	projectName = 'National e-Procurement System';
	helpOpened$: Observable<boolean>;
	notifications: Notification[] = [];
	governmentServiceNotifications: GovernmentServiceNotification[] = [];
	countMyAlert: number = 0;
	countCuisReport: number = 0;
	loadinArets: boolean = false;
	alertNotifications?: AlertNotification[] = [];
	alertMyAlert?: any[] = [];
	countTenderUpdate = 0;
	countAuditTask = 0;
	// countMicroProcurementUpdate = 0;
	countSubmissionResultWinnerChangeRequest = 0;
	subjectMin: string = '';
	showMenuToggle: boolean = true;
	checkRole: boolean = false;
	startPingAnimation = true;
	user: User;
	itemData;
	videoId: string;
	startVideo: number = 0.0;
	endVideo: number = 0.0;

	countTaskAudit: number = 0;

	countTaskEsAppeal: number = 0;
	countTaskDstAppeal: number = 0;
	countTaskLOAppeal: number = 0;

	countTaskEsEOT: number = 0;
	countTaskDstEOT: number = 0;
	countTaskLOEOT: number = 0;

	countTaskEsf8: number = 0;
	countTaskDstf8: number = 0;
	countTaskLOf8: number = 0;

	countTaskEsf7: number = 0;
	countTaskDstf7: number = 0;
	countTaskLOf7: number = 0;

	networkStatus: boolean = false;
	networkStatus$: Subscription = Subscription.EMPTY;

	replayCelebrate: boolean = false;

	languages = [
		{ id: 'gb', name: 'English', key: 'ENGLISH', code: 'en' },
		{
			id: 'tz',
			name: 'Swahili',
			key: 'SWAHILI',
			code: 'sw',
		},
	];
	defaultLanguage: string;
	currentFlag: string;
	currentLabel: string;
	userSystemAccessRoles: string;
	timeRemaining: Signal<number>;
	signalsStoreService = inject(SignalsStoreService);


	ngOnDestroy(): void {
		this.networkStatus$.unsubscribe();
	}

	authUserData: any;

	constructor(
		private apollo: GraphqlService,
		private breakpointObserver: BreakpointObserver,
		public authService: AuthService,
		private storageService: StorageService,
		private dialog: MatDialog,
		private activatedRoute: ActivatedRoute,
		private settings: SettingsService,
		private store: Store<ApplicationState>,
		private router: Router,
		private translateService: TranslationService,
		private notificationService: NotificationService,
		private governmentServiceNotificationService: GovernmentServiceNotificationService,
		private http: HttpClient,
		public contractVettingTasksService: ContractVettingTasksService,
		public contractSigningTasksService: ContractSigningTasksService,
		public contractGenerationTasksService: ContractGenerationTasksService,
		public contractPreconditionsTasksService: ContractPreconditionsTasksService,
		public tendererContractSigningTasksService: TendererContractSigningTasksService,
	) {
		this.helpOpened$ = this.settings.show_help;
		this.user$ = this.store.pipe(
			select(selectModifiedAuthUsers),
			map((users) => ({
				...users[0],
			}))
		);
		/**
		 * Language Translation  Codes
		 */
		this.defaultLanguage = storageService.getItem('language');
		if (this.defaultLanguage) {
			translateService.setDefaultLanguage(this.defaultLanguage);
		} else {
			this.defaultLanguage = translateService.getDefaultLanguage();
		}
		this.currentFlag = this.languages.find(
			(lang: any) => lang.code == translateService.getDefaultLanguage()
		).id;
		this.currentLabel = this.languages.find(
			(lang: any) => lang.code == translateService.getDefaultLanguage()
		).key;

		this.timeRemaining = this.signalsStoreService.select(
			'timeRemaining'
		);
	}

	onLogoClick() {
		if (
			this.users?.userTypeEnum === 'TENDERER' ||
			(this.users?.userTypeEnum === 'DIRECT_MANUFACTURER' &&
				!!this.users?.hasSignature)
		) {
			this.router.navigate(['', 'nest-tenderer', 'dashboard']).then();
		} else if (
			['EMBASSY', 'PPRA', 'PROCURING_ENTITY'].includes(
				this.users?.userTypeEnum
			) &&
			!!this.users?.hasSignature &&
			!this.users.hasHandover
		) {
			// this.router.navigate(['/landing']).then();
			window.location.href = '/landing';
		} else if (
			this.activatedRoute.snapshot['_routerState'].url ==
			'/pe-self-registration'
		) {
			// this.router.navigate(['/landing']).then();
			window.location.href = '/landing';
		}
	}

	gotoUrl(url: string) {
		this.sideNav.toggle().then();
		this.router.navigateByUrl(url).then((success) => {
			if (success) {
			} else {
				location.replace(url);
			}
		});
	}

	async fetchCurrentLoginUserData() {
		try {
			this.authUserData = await firstValueFrom(
				this.http.get(environment.AUTH_URL + '/nest-uaa/user')
			);
			// this.storageService.setItem('userSystemAccessRoles', data.userAuthentication?.principal?.rolesListStrings.join(","));
			this.storageService.setItem(
				'institutionUuid',
				this.authUserData?.userAuthentication?.principal?.procuringEntity?.uuid
			);
			this.storageService.setItem(
				'accountUuid',
				this.authUserData?.userAuthentication?.principal?.uuid
			);
		} catch (e) {
			console.error(e);
		}
	}

	async checkUser() {
		this.users = await firstValueFrom(
			this.store.pipe(
				select(selectAllUsers),
				map((items) => items[0]),
				first((i) => !!i)
			)
		);
		//
		this.userDiv(this.users?.userTypeEnum);
		this.users.rolesListStrings?.forEach((item) => {
			if (
				item === 'HEAD_OF_DEPARTMENT' ||
				item === 'ACCOUNTING_OFFICER' ||
				item === 'HEAD_OF_PMU'
			) {
				this.checkRole = true;
			}
		});

		this.showSearch(this.users?.userTypeEnum);
	}

	showSearch(role: any) {
		this.showSearchbar = !(
			role === 'DIRECT_MANUFACTURER' || role === 'TENDERER'
		);
	}

	playSound() {
		if (!this.soundPlayer?.nativeElement) {
			setTimeout(() => {
				if (this.soundPlayer?.nativeElement) {
					this.playAudio();
				}
			}, 500);
		} else {
			this.playAudio();  // If initialized, play sound
		}
	}

	private playAudio() {
		const audioElement: HTMLAudioElement = this.soundPlayer.nativeElement;
		audioElement.muted = false;
		audioElement.play().catch(error => {
			console.error('Playback failed:', error);
		});
	}

	ngAfterViewInit() {

		// this.audioElement = this.soundPlayer.nativeElement;

		// // Preload the audio
		// this.audioElement.preload = 'auto';

		// // Wait until the audio is ready to play
		// this.audioElement.addEventListener('canplaythrough', () => {
		// 	// console.log('Audio is ready to play!');
		// 	// this.playSound();  // Trigger sound playback once it's ready
		// });

		// this.audioElement.load();  // Start preloading immediately
	}

	showBanner() {
		this.callShowBanner = true;

		console.log(this.callShowBanner);
	}

	onYoutubeClick() {
		// this.currentUrlPass().then(() => {
		//   if (this.activatedRoute.snapshot['_routerState'].url == '/landing') {
		//     this.loadingVideo = false;
		//     if (this.userSystemAccessRoles?.includes('ACCOUNTING_OFFICER')) {
		//       this.videoId = 'vA24YcnM8ls';
		//     } else if (this.userSystemAccessRoles?.includes('HEAD_OF_PMU')) {
		//       this.videoId = 'ZaH5F_gvpzM';
		//     } else if (this.userSystemAccessRoles?.includes('HEAD_OF_DEPARTMENT')) {
		//       this.videoId = 'GEX4mEInhFc';
		//     } else if (this.userSystemAccessRoles?.includes('DEPARTMENT_OFFICER')) {
		//       this.videoId = 'XXbFqNmvPSg';
		//     }
		//   }
		//   if (this.loadingVideo == false) {
		//     const dialogConfig = new MatDialogConfig();
		//     dialogConfig.width = '640';
		//     dialogConfig.height = '450';
		//     dialogConfig.minWidth = '640px';
		//     dialogConfig.minHeight = '450px';
		//     dialogConfig.autoFocus = true;
		//     dialogConfig.disableClose = true;
		//     dialogConfig.data = {
		//       videoId: this.videoIdCode != null ? this.videoIdCode : this.videoId,
		//       start: this.startVideo,
		//       end: this.endVideo,
		//     };
		//     const dialogRef = this.dialog.open(
		//       NestGuideVideoComponent,
		//       dialogConfig
		//     );
		//     dialogRef.afterClosed().subscribe((result: any) => {
		//       this.notificationService.successSnackbar(
		//         'Whenever you are unsure, watch the guide video.'
		//       );
		//     });
		//   }
		// });
	}

	initAccess() {
		this.userSystemAccessRoles = this.storageService.getItem(
			'userSystemAccessRoles'
		);
	}

	changeLanguage(language: string) {
		this.translateService.setDefaultLanguage(language);
		this.storageService.setItem('language', language);
		this.currentFlag = this.languages.find(
			(lang: any) => lang.code == language
		).id;
		this.currentLabel = this.languages.find(
			(lang: any) => lang.code == language
		).key;
	}

	// await this.getPeUsersSummary(peDetails?.uuid, 'CHIEF_ACCOUNTANT', 4);
	// await this.getPeUsersSummary(peDetails?.uuid, 'PROCUREMENT_OFFICER', 6);
	// await this.getPeUsersSummary(peDetails?.uuid, 'ACCOUNTANT', 7);
	// await this.getPeUsersSummary(peDetails?.uuid, 'AUDITOR', 8);
	// await this.getPeUsersSummary(peDetails?.uuid, 'LEGAL_OFFICER', 9);
	// await this.getPeUsersSummary(peDetails?.uuid, 'DEPARTMENT_OFFICER', 10);

	ngOnInit(): void {
		this.setCanCelebrate();
		this.initializer().then();
		this.landing =
			this.activatedRoute.snapshot['_routerState'].url == '/landing';
		setTimeout(() => {
			this.startPingAnimation = false; // Stop the ping animation after 1 minute
		}, 30000);
		// this.currentUrlPass();
		this.initAccess();
	}

	userDiv(role: any) {
		if (role === 'DIRECT_MANUFACTURER') {
			this.hideUserDiv = false;
		} else {
			this.hideUserDiv = true;
		}
	}

	// async currentUrlPass() {
	//   this.loadingVideo = true;
	//   this.videoId = null;
	//   this.videoIdCode = null;
	//   this.startVideo = null;
	//   this.endVideo = null;
	//   try {
	//     const response: any = await this.apollo.fetchData({
	//       query: GET_PAGE_GUIDE_VIDEO_MAPPING_BY_UUID,
	//       variables: {
	//         activeRoute: this.activatedRoute.snapshot['_routerState'].url,
	//       },
	//     });
	//     const values: any =
	//       response?.data?.getVideoPerPageMappingsByActiveRoute?.data;

	//     if (values?.activeRoute != null) {
	//       if (this.users?.userTypeEnum === 'TENDERER') {
	//         if (this.users.tenderer.operatingCountry.name === 'Tanzania') {
	//           this.videoIdCode = values.videoMetaDatas[0]?.code;
	//           this.startVideo = values.videoMetaDatas[0]?.startAt;
	//           this.endVideo = values.videoMetaDatas[0]?.endAt;
	//         } else {
	//           this.videoIdCode = values.videoMetaDatas[0]?.foreignCode;
	//           this.startVideo = values.videoMetaDatas[0]?.foreignEndAt;
	//           this.endVideo = values.videoMetaDatas[0]?.foreignEndAt;
	//         }
	//       } else {
	//         this.videoIdCode = values.videoMetaDatas[0]?.code;
	//         this.startVideo = values.videoMetaDatas[0]?.startAt;
	//         this.endVideo = values.videoMetaDatas[0]?.endAt;
	//       }
	//     }
	//     this.loadingVideo = false;
	//   } catch (e) { }
	// }

	processGovernmentServiceNotifications() {
		this.governmentServiceNotifications =
			this.governmentServiceNotifications.map((serviceNotification) => {
				if (serviceNotification.model) {
					return {
						...serviceNotification,
						model: this.governmentServiceFormattedModel(serviceNotification),
						url: this.governmentServiceFormattedUrl(serviceNotification),
					};
				}
				return serviceNotification;
			});
	}

	async clearNotification() {
		try {
			const response: any = await this.apollo.mutate({
				apolloNamespace: ApolloNamespace.submission,
				mutation: CLEAR_ALL_CLARIFICATIONS,
			});
			if (response.data.clearAllClarifications.code === 9000) {
				this.notificationService.successMessage(
					'Clarification Cleared Successful'
				);
				window.location.reload();
			} else {
				throw new Error();
			}
		} catch (e) {
			this.notificationService.errorMessage('Failed to clear Clarification');
		}
	}

	governmentServiceFormattedModel(
		serviceNotification: GovernmentServiceNotification
	): string {
		const idArray = serviceNotification.id?.split('+');

		// for government received order GSP side.
		if (
			idArray[0] === 'SUBMITTED' &&
			idArray[1] === 'GovernmentServiceRequisition'
		) {
			serviceNotification.model = 'Received Government Service Requisition';
		}
		if (
			idArray[0] === 'WAIT_FOR_PE_CONFIRMATION' &&
			idArray[1] === 'DeliveryAdvisePESide'
		) {
			serviceNotification.model =
				'Government Service Requisition wait for payment confirmation';
		}
		if (
			idArray[0] === 'AWAIT_PAYMENT' &&
			idArray[1] === 'DeliveryAdvisePESide'
		) {
			serviceNotification.model =
				'delivery advise await for payment confirmation (PE)';
		}
		if (
			idArray[0] === 'PE_CONFIRMED' &&
			idArray[1] === 'DeliveryAdviseGSPSide'
		) {
			serviceNotification.model = 'confirmed delivery advise';
		}
		if (
			idArray[0] === 'AWAIT_GSP_ACCOUNTANT_ACTION' &&
			idArray[1] === 'DeliveryAdviseGSPSide'
		) {
			serviceNotification.model = 'delivery advise await for accountant action';
		}
		if (
			idArray[0] === 'WAIT_FOR_PAYMENT_APPROVAL' &&
			idArray[1] === 'DeliveryAdviseGSPSide'
		) {
			serviceNotification.model = 'delivery advise wait for payment approval';
		}
		if (idArray[0] === 'DRAFT' && idArray[1] === 'DeliveryNoteGSPSide') {
			serviceNotification.model = 'Draft delivery note';
		}
		if (
			idArray[0] === 'WAIT_FOR_PE_DELIVERY_CONFIRMATION' &&
			idArray[1] === 'DeliveryNotePESide'
		) {
			serviceNotification.model = 'delivery note waiting for your confirmation';
		}
		return serviceNotification.model;
	}

	governmentServiceFormattedUrl(
		serviceNotification: GovernmentServiceNotification
	): string {
		return serviceNotification.url;
	}

	async initializer() {
		const routeSegment: string[] = this.router.url.split('?')[0].split('/');
		const routeSegmentMenu = ['landing', 'ipc-sheet', 'variation-sheet']
		if (routeSegment.length == 2 && routeSegmentMenu.includes(routeSegment[1])) {
			this.showMenuToggle = false;
		}
		// await this.fetchCurrentLoginUserData();

		this.institutionName = this.storageService.getItem('institutionName');
		this.serviceUserType = this.storageService.getItem('serviceUserType');
		this.token = this.storageService.getItem('currentClient');

		if (this.authService.hasPermission(['ROLE_GENERIC_PE'])) {
			this.store.dispatch(clearNotifications());
			this.store.dispatch(getNotifications());

			this.store
				.pipe(select(selectAllNotification))
				.subscribe((notifications) => {
					this.notifications = notifications || [];
				});

			this.store
				.pipe(select(selectAlLGovernmentServiceNotifications))
				.subscribe((data) => {
					this.governmentServiceNotifications = data || [];
					this.processGovernmentServiceNotifications();
				});

			this.store
				.pipe(select(selectAllClarificationNotification))
				.subscribe((clarificationNotifications) => {
					this.alertMyAlert = [];
					this.countMyAlert = 0;
					(clarificationNotifications || []).forEach((item) => {
						this.countMyAlert = this.countMyAlert + 1;
						this.alertMyAlert.push(item);
					});
					this.alertMyAlert.slice().reverse();
				});
		}

		if (
			this.authService.hasPermission([
				'ROLE_TNDR_INTN_REQUESTED_CLARIFICATIONS',
			])
		) {
			this.store.dispatch(getClarificationNotifications());
		}

		if (this.authService.hasPermission('ROLE_AO_AUDIT')) {
			this.countAuditPlanExecutionInitiationByAuditStage('ACCOUNTING_OFFICER');
		}

		if (this.authService.hasPermission('ROLE_HOD_AUDIT')) {
			this.countAuditPlanExecutionInitiationByAuditStage('AUDITOR_DIRECTOR');
		}

		if (this.authService.hasPermission('ROLE_AUDIT_PLAN_ITEM')) {
			this.countAuditPlanExecutionInitiationByAuditStage('AUDITOR_MANAGER');
		}

		if (this.authService.hasPermission('ROLE_AUDIT_INITIATION')) {
			this.countAuditPlanExecutionInitiationByAuditStage('AUDITOR');
		}

		if (this.authService.hasPermission('ROLE_AUDIT_PE_RESPOND')) {
			this.countAuditPlanExecutionInitiationByAuditStage(
				'PE_ACCOUNTING_OFFICER'
			);
		}

		if (this.authService.hasPermission('ROLE_AUDIT_HPMU_RESPOND')) {
			this.countAuditPlanExecutionInitiationByAuditStage('PE_HPMU');
		}

		if (this.authService.hasPermission(['ROLE_COMPLAINT_ES_PPAA'])) {
			this.countAppealTask();
			this.countEOTTask();
			this.countf8ESTask();
			this.countf7ESTask();
		}

		if (this.authService.hasPermission(['ROLE_COMPLAINT_DST_PPAA'])) {
			this.countAppealDstTask();
			this.countEOTDstTask();
			this.countf8DstTask();
			this.countf7DstTask();
		}

		if (this.authService.hasPermission(['ROLE_COMPLAINT_LO_PPAA'])) {
			this.countAppealLOTask();
			this.countEOTLOTask();
			this.countAppealLOf8();
			this.countAppealLOf7();
		}

		if (
			this.authService.hasPermission([
				'ROLE_APP_MNGT_CDER_GPN_REQUEST_APPROVAL',
			])
		) {
			this.initiateCount().then();
		}

		if (this.authService.hasPermission(['ROLE_AUDIT_TASK'])) {
			this.initiateAuditTaskCount();
		}

		if (
			this.authService.hasPermission([
				'ROLE_APP_MNGT_CDER_GPN_REQUEST_APPROVAL',
			])
		) {
			this.initiateCuISReportCount().then();
		}

		// if (this.authService.hasPermission(['ROLE_APP_MNGT_MICRO_PROCUREMENT_TASK'])) {
		//   this.initiateMicroProcurement().then();
		// }

		if (this.authService.hasPermission(['ROLE_TNDR_EVL_WINNER_EVALUATION'])) {
			this.countSubmissionResultApprovalByStatus().then();
		}

		this.governmentServiceNotificationService
			.handleGovernmentServiceNotification()
			.then();

		this.initContractTasksServices();

		await this.checkUser();
		this.checkNetworkStatus();
	}

	async initContractTasksServices() {
		this.contractVettingTasksService.init();
		this.contractSigningTasksService.init();
		this.contractGenerationTasksService.init();
		this.contractPreconditionsTasksService.init();
		this.tendererContractSigningTasksService.init();
	}

	async initiateCount() {
		try {
			const response: any = await this.apollo.fetchData({
				query: COUNT_TENDER_REQUESTED_FOR_EDITING,
				apolloNamespace: ApolloNamespace.app,
			});

			if (response.data.countTendersRequestedForEditing?.code == 9000) {
				this.countTenderUpdate =
					response.data.countTendersRequestedForEditing?.data;
			}
		} catch (e) { }
	}

	async initiateAuditTaskCount() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_MY_SPECIFIC_AUDIT_PLAN_TASKS_SUMMARY,
				apolloNamespace: ApolloNamespace.nestAuditTool,
			});

			if (response.data.getMySpecificAuditPlanTasksSummary?.code == 9000) {
				this.countAuditTask =
					response.data.getMySpecificAuditPlanTasksSummary?.data;
			}
		} catch (e) { }
	}

	async countAppealTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [1, 5, 8],
				},
			});

			if (response.data.getCountForTask?.code == 9000) {
				this.countTaskEsAppeal = response.data.getCountForTask?.data;
			}
		} catch (e) { }
	}

	async countAuditPlanExecutionInitiationByAuditStage(auditExecutionStage) {
		this.countTaskAudit = 0;
		this.users = await firstValueFrom(
			this.store.pipe(
				select(selectAllAuthUsers),
				first((items) => items.length > 0),
				map((i) => i[0])
			)
		);
		try {
			const response: any = await this.apollo.fetchData({
				query: COUNT_AUDIT_PLAN_EXECUTION_INITIATION_BY_AUDIT_STAGE,
				apolloNamespace: ApolloNamespace.nestAuditTool,
				variables: {
					entityUuid: this.users?.uuid,
					auditExecutionStage: auditExecutionStage,
				},
			});

			if (
				response.data.countAuditPlanExecutionInitiationByAuditStage?.code ==
				9000
			) {
				this.countTaskAudit =
					response.data.countAuditPlanExecutionInitiationByAuditStage?.data;
			}
		} catch (e) { }
	}

	async countEOTTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_EXTENSION_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [1, 5, 8],
				},
			});

			if (response.data.getCountForExtensionTask?.code == 9000) {
				this.countTaskEsEOT = response.data.getCountForExtensionTask?.data;
			}
		} catch (e) { }
	}

	async countf8ESTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_FORM_EIGHT_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [1, 5, 8],
				},
			});

			if (response.data.getCountForFormEightTask?.code == 9000) {
				this.countTaskEsf8 = response.data.getCountForFormEightTask?.data;
			}
		} catch (e) { }
	}

	async countf7ESTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_FORM_SEVEN_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [1, 5, 8],
				},
			});

			if (response.data.getCountForFormSevenTask?.code == 9000) {
				this.countTaskEsf7 = response.data.getCountForFormSevenTask?.data;
			}
		} catch (e) { }
	}

	async countAppealDstTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [2, 4, 7],
				},
			});

			if (response.data.getCountForTask?.code == 9000) {
				this.countTaskDstAppeal = response.data.getCountForTask?.data;
			}
		} catch (e) { }
	}

	async countEOTDstTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_EXTENSION_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [2, 4, 7],
				},
			});

			if (response.data.getCountForExtensionTask?.code == 9000) {
				this.countTaskDstEOT = response.data.getCountForExtensionTask?.data;
			}
		} catch (e) { }
	}

	async countf8DstTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_FORM_EIGHT_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [2, 4, 7],
				},
			});

			if (response.data.getCountForFormEightTask?.code == 9000) {
				this.countTaskDstf8 = response.data.getCountForFormEightTask?.data;
			}
		} catch (e) { }
	}

	async countf7DstTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_FORM_SEVEN_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [2, 4, 7],
				},
			});

			if (response.data.getCountForFormSevenTask?.code == 9000) {
				this.countTaskDstf7 = response.data.getCountForFormSevenTask?.data;
			}
		} catch (e) { }
	}

	async countAppealLOTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [3, 6],
				},
			});

			if (response.data.getCountForExtensionTask?.code == 9000) {
				this.countTaskLOAppeal = response.data.getCountForExtensionTask?.data;
			}
		} catch (e) { }
	}

	async countAppealLOf8() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_FORM_EIGHT_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [3, 6],
				},
			});

			if (response.data.getCountForFormEightTask?.code == 9000) {
				this.countTaskLOf8 = response.data.getCountForFormEightTask?.data;
			}
		} catch (e) { }
	}

	async countAppealLOf7() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_FORM_SEVEN_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [3, 6],
				},
			});

			if (response.data.getCountForFormSevenTask?.code == 9000) {
				this.countTaskLOf7 = response.data.getCountForFormSevenTask?.data;
			}
		} catch (e) { }
	}

	async countEOTLOTask() {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_COUNT_FOR_EXTENSION_TASK,
				apolloNamespace: ApolloNamespace.complaint,
				variables: {
					decisionOrderList: [3, 6],
				},
			});

			if (response.data.getCountForExtensionTask?.code == 9000) {
				this.countTaskLOEOT = response.data.getCountForExtensionTask?.data;
			}
		} catch (e) { }
	}

	async initiateCuISReportCount() {
		try {
			const response: any = await this.apollo.fetchData({
				query: COUNT_CUIS_REPORT_AO,
				apolloNamespace: ApolloNamespace.submission,
			});

			if (response.data.countReportStatus?.code == 9000) {
				this.countCuisReport = response.data.countReportStatus?.data;
			}
		} catch (e) { }
	}

	// async initiateMicroProcurement() {
	//   try {
	//     const response: any = await this.apollo.fetchData({
	//       query: COUNT_MICRO_PROCUREMENT,
	//     });

	//     if (response.data.getMyMicroProcurementTasksSummary.length > 0) {
	//       this.countMicroProcurementUpdate = response.data.getMyMicroProcurementTasksSummary[0]?.idadi;
	//     }

	//   } catch (e) {
	//
	//   }
	// }

	async countSubmissionResultApprovalByStatus() {
		try {
			const response: any = await this.apollo.fetchData({
				query: COUNT_SUBMMISSION_CHANGE_WINNER_REQUEST,
				apolloNamespace: ApolloNamespace.submission,
			});

			if (
				response.data.countSubmissionResultWaitForApproval?.data
					?.numberOfApprovals > 0 &&
				response.data.countSubmissionResultWaitForApproval.code == 9000
			) {
				this.countSubmissionResultWinnerChangeRequest =
					response.data.countSubmissionResultWaitForApproval?.data?.numberOfApprovals;
			}
		} catch (e) { }
	}

	async countDeliveryAdvisePESideByApprovalStatus(
		approvalStatus: ApprovalStatusEnum
	): Promise<number> {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_DELIVERY_ADVISE_FOR_PE_COUNT,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					input: {
						page: 1,
						pageSize: 10000,
						fields: [],
						mustHaveFilters: [
							{
								fieldName: 'approvalStatus',
								operation: SearchOperation.EQ,
								value1: approvalStatus,
							},
						],
					},
				},
			});

			if (response.data.items && response.data.items?.totalRecords > 0) {
				return response.data.items?.totalRecords;
			}
			return 0;
		} catch (e) {
			console.error(e);
			return 0;
		}
	}

	async countDeliveryAdviseGSPSideByApprovalStatus(
		approvalStatus: ApprovalStatusEnum
	): Promise<number> {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_DELIVERY_ADVISE_COUNT,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					input: {
						page: 1,
						pageSize: 10000,
						fields: [],
						mustHaveFilters: [
							{
								fieldName: 'approvalStatus',
								operation: SearchOperation.EQ,
								value1: approvalStatus,
							},
						],
					},
				},
			});

			if (response.data.items && response.data.items?.totalRecords > 0) {
				return response.data.items?.totalRecords;
			}
			return 0;
		} catch (e) {
			console.error(e);
			return 0;
		}
	}

	async countDeliveryNotePESideByApprovalStatus(
		approvalStatus: DeliveryNoteApprovalStatusEnum
	): Promise<number> {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_DELIVERY_NOTE_FOR_PE_COUNT,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					input: {
						page: 1,
						pageSize: 10000,
						fields: [],
						mustHaveFilters: [
							{
								fieldName: 'approvalStatus',
								operation: SearchOperation.EQ,
								value1: approvalStatus,
							},
						],
					},
				},
			});

			if (response.data.items?.data && response.data.items?.totalRecords > 0) {
				return response.data.items?.data?.totalRecords;
			}
			return 0;
		} catch (e) {
			console.error(e);
			return 0;
		}
	}

	async countDeliveryNoteGSPSideByApprovalStatus(
		approvalStatus: DeliveryNoteApprovalStatusEnum
	): Promise<number> {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_DELIVERY_NOTE_COUNT,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					input: {
						page: 1,
						pageSize: 10000,
						fields: [],
						mustHaveFilters: [
							{
								fieldName: 'approvalStatus',
								operation: SearchOperation.EQ,
								value1: approvalStatus,
							},
						],
					},
				},
			});

			if (response.data.items?.data && response.data.items?.totalRecords > 0) {
				return response.data.items?.data?.totalRecords;
			}
			return 0;
		} catch (e) {
			console.error(e);
			return 0;
		}
	}

	getAcronym(procuringName) {
		return procuringName
			.split(/\s/)
			.reduce((response, word) => (response += word.slice(0, 1)), '');
	}

	requestSignature() { }

	subStringSubjectTitle(title: string) {
		if (title.length > 40) {
			const subTitle = title.substring(0, 40);
			this.subjectMin = subTitle + '....';
		} else {
			this.subjectMin = title;
		}
		return this.subjectMin.toUpperCase();
	}

	subStringSubjectT(title: string) {
		if (title.length > 15) {
			const subTitle = title.substring(0, 15);
			this.subjectMin = subTitle + '....';
		} else {
			this.subjectMin = title;
		}
		return this.subjectMin.toUpperCase();
	}

	checkNetworkStatus() {
		this.networkStatus = navigator.onLine;
		this.networkStatus$ = merge(
			of(null),
			fromEvent(window, 'online'),
			fromEvent(window, 'offline')
		)
			.pipe(map(() => navigator.onLine))
			.subscribe((status) => {
				this.networkStatus = status;
				if (this.networkStatus) {
					// this.notificationService.successMessage('You\'re online. Ready to Go.');
				} else {
					console.error("You're offline. Check your connection.");
					// this.notificationService.internetSnackbar('You\'re offline. Check your connection.');
				}
			});
	}

	onToggleSidenav() {
		this.sidenavToggle.emit();
	}

	logout() {
		// return this.authService.isLoggedIn();
	}

	changePassword(data: AuthUser) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '40%';
		dialogConfig.data = data;
		this.dialog.open(UserChangePasswordComponent, dialogConfig);
	}

	verifyDocument() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '60%';
		this.dialog.open(UserDocumentVerificationComponent, dialogConfig);
	}

	changeKeyPhrase(data: AuthUser) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '40%';
		dialogConfig.data = data;
		this.dialog.open(UserChangeKeyphraseComponent, dialogConfig);
	}

	revokeKeyPhrase(data: AuthUser) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '40%';
		dialogConfig.data = data?.uuid;
		this.dialog
			.open(UserRevokeKeyphraseComponent, dialogConfig)
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.changeKeyPhrase(data);
				}
			});
	}

	handOver(data: AuthUser) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '40%';
		dialogConfig.data = data;
		this.dialog.open(UserHandOverComponent, dialogConfig);
	}

	switchAccount(user: AuthUser) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '40%';
		dialogConfig.data = user;
		this.dialog.open(UserSwitchAccountComponent, dialogConfig);
	}

	logOut() {
		this.playSound();
		this.authService.logout();

	}

	cleanStorage() {
		this.storageService.clearStorage();
	}

	formatDateMessage(dateReceived, format: string = 'h:mm a') {
		if (typeof dateReceived === 'string' && dateReceived !== '') {
			dateReceived = new Date(dateReceived);
		}
		return dateReceived ? moment(dateReceived).format(format) : undefined;
	}

	formatDate(dateReceived, format: string = 'MMM Do') {
		if (typeof dateReceived === 'string' && dateReceived !== '') {
			dateReceived = new Date(dateReceived);
		}
		return dateReceived ? moment(dateReceived).format(format) : undefined;
	}

	subStringMessage(message: string) {
		if (message.length > 80) {
			const subTitle = message.replace('<br>', '').substring(0, 80);
			return subTitle + '....';
		} else {
			return message;
		}
	}

	subStringTitle(title: string) {
		if (title.length > 120) {
			const subTitle = title.replace('<br>', '').substring(0, 20);
			return subTitle + '....';
		} else {
			return title;
		}
	}

	openHelp(event) {
		event.stopPropagation();
		this.showHelp.emit();
	}

	closeHelp() {
		this.settings.closeHelp();
	}

	check($event: boolean) {
		this.settings.show_help.next($event);
	}

	goToTaskUi(url: string, notification: any) {
		if (url && url.length > 0) {
			if (url == 'modules/evaluation/team-task') {
				url = 'modules/tender-evaluation/team-task';
			}
			this.store.dispatch(new Go({ path: url.split('/') }));
		} else if (
			notification.model == 'MicroProcurement' ||
			notification.model == 'Micro Procurement(s)'
		) {
			this.router
				.navigateByUrl(
					'/modules/micro-value-procurement/micro-procurement/task-micro-procurement'
				)
				.then((success) => {
					if (success) {
					} else {
						location.replace(
							'/modules/micro-value-procurement/micro-procurement/task-micro-procurement'
						);
					}
				});
		} else if (notification.model == 'MicroProcurementRetirement') {
			this.router
				.navigateByUrl(
					'/modules/micro-value-procurement/retirement/task-retirement'
				)
				.then((success) => {
					if (success) {
					} else {
						location.replace(
							'/modules/micro-value-procurement/retirement/task-retirement'
						);
					}
				});
		} else if (notification.model == 'GovernmentServiceRequisition') {
			this.router
				.navigateByUrl('/modules/government-supplier/pe-order-task')
				.then((success) => {
					if (success) {
					} else {
						location.replace('/modules/government-supplier/pe-order-task');
					}
				});
		} else if (notification.model == 'NegotiationTeamDetail') {
			this.router
				.navigateByUrl('/modules/negotiation/negotiation-team-tasks')
				.then((success) => {
					if (success) {
					} else {
						location.replace('/modules/negotiation/negotiation-team-tasks');
					}
				});
		} else if (notification.model == 'NegotiationPlan') {
			this.router
				.navigateByUrl('/modules/negotiation/negotiation-plan-tasks')
				.then((success) => {
					if (success) {
					} else {
						location.replace('/modules/negotiation/negotiation-plan-tasks');
					}
				});
		} else if (notification.model == 'NegotiationMinute') {
			this.router
				.navigateByUrl('/modules/negotiation/negotiation-task')
				.then((success) => {
					if (success) {
					} else {
						location.replace('/modules/negotiation/negotiation-task');
					}
				});
		} else if (notification.model == 'TeamAssignment') {
			this.router
				.navigateByUrl('/modules/tender-evaluation/team-task')
				.then((success) => {
					if (success) {
					} else {
						location.replace('/modules/tender-evaluation/team-task');
					}
				});
		}
		this.sideNav.toggle().then();
	}

	closeBackDrop() {
		this.sideNav.close().then();
	}

	closeMenu() {
		if (this.profileMenuTrigger) {
			this.profileMenuTrigger.closeMenu();
		}
	}

	reCelebrateLaunch() {
		this.replayCelebrate = false;
		setTimeout(() => {
			this.replayCelebrate = true;
		}, 100);
	}

	setCanCelebrate() {
		this.canCelebrate = new Date() <= this.lastDayToShowLaunchCelebration;
	}
}
