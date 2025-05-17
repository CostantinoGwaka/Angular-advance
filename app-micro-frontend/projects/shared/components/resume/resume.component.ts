import { TranslationService } from '../../../services/translation.service';
import { environment } from '../../../../environments/environment';
import { ViewportScroller } from '@angular/common';
import {
	SAVE_USER,
	TENDERER_TAX_REGISTRATION_DETAILS,
	TENDERER_USER_DESCRIPTION,
} from '../../../modules/nest-uaa/store/user-management/user/user.graphql';
import { AddCompetencyComponent } from '../../../modules/nest-tenderer/profile-information/competency/add-competency/add-competency.component';
import { AddProfessionalComponent } from '../../../modules/nest-tenderer/profile-information/profesional/add-professional/add-professional.component';
import { AddRefereeComponent } from '../../../modules/nest-tenderer/profile-information/referee/add-referee/add-referee.component';
import { map, first } from 'rxjs/operators';
import { selectAllUsers } from '../../../modules/nest-uaa/store/user-management/user/user.selectors';
import {
	User,
	UserDtoInput,
} from '../../../modules/nest-uaa/store/user-management/user/user.model';
import { SettingsService } from '../../../services/settings.service';
import { UntypedFormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
	GET_PERSONNEL_CV,
	CREATE_UPDATE_PERSONNEL_INFORMATION,
	GET_TENDERER_LANGUAGES,
	GET_TENDERER_ACADEMIC,
	GET_TENDERER_TRAINGING,
	GET_TENDERER_REFEREE,
	GET_TENDERER_PROFESSIONAL_QUALIFICATION,
	GET_TENDERER_COMPETENCY,
	GET_TENDERER_WORK_EXPERIENCE,
} from '../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.graphql';
import { AddUserAcademicQualificationComponent } from '../../../modules/nest-tenderer/profile-information/personnel-information/add-user-academic-qualification/add-user-academic-qualification.component';
import { PersonnelInformation } from '../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Actions } from '@ngrx/effects';
import { AddPersonnelWorkExperienceComponent } from '../../../modules/nest-tenderer/profile-information/personnel-work-experience/add-personnel-work-experience/add-personnel-work-experience.component';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { PersonnelWorkExperience } from '../../../modules/nest-tenderer/store/settings/personnel-work-experience/personnel-work-experience.model';
import { DatePipe } from '@angular/common';
import {
	UserAcademicQualification,
	UserTendererLanguage,
} from '../../../modules/nest-tenderer/store/settings/user-academic-qualification/user-academic-qualification.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from '@ngrx/store';
import { GraphqlService } from '../../../services/graphql.service';
import { ApplicationState } from '../../../store';
import { BusinessLine } from '../../../modules/nest-tenderer-management/store/business-line/business-line.model';
import { NotificationService } from '../../../services/notification.service';
import { fadeIn } from '../../animations/basic-animation';
import {
	Tenderer,
	TendererTaxDetails,
} from '../../../modules/nest-tenderer-management/store/tenderer/tenderer.model';
import { firstValueFrom } from 'rxjs';
import { TenderCategory } from '../../../modules/nest-tenderer-management/store/tender-category/tender-category.model';
import { AddLanguageComponent } from 'src/app/modules/nest-tenderer/profile-information/language/add-language/add-language.component';
import { AddTrainingWorkshopComponent } from 'src/app/modules/nest-tenderer/profile-information/training-workshop/add-training-workshop/add-training-workshop.component';
import { upsertUser } from '../../../modules/nest-uaa/store/user-management/user/user.actions';
import {
	DELETE_LANGUAGE_PROFICIENCY,
	DELETE_PERSONNEL_WORK_EXPERIENCE_BY_UUID,
	DELETE_PROFESSIONAL_CERTIFICATE_BY_UUID,
	DELETE_TENDERER_COMPETENCY,
	DELETE_TENDERER_REFEREE_BY_UUID,
	DELETE_TENDERER_TRAINING_BY_UUID,
} from '../../../modules/nest-tenderer/store/settings/personnel-work-experience/personnel-work-experience.graphql';
import { DELETE_USER_ACADEMIC_QUALIFICATION_BY_UUID } from '../../../modules/nest-tenderer/store/settings/user-academic-qualification/user-academic-qualification.graphql';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { PaginatedDataTableComponent } from '../paginated-data-table/paginated-data-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SaveAreaComponent } from '../save-area/save-area.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderComponent } from '../loader/loader.component';

@Component({
	selector: 'app-resume',
	templateUrl: './resume.component.html',
	styleUrls: ['./resume.component.scss'],
	animations: [fadeIn],
	standalone: true,
	imports: [
		LoaderComponent,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatSelectModule,
		MatOptionModule,
		MatDatepickerModule,
		SaveAreaComponent,
		MatButtonModule,
		MatIconModule,
		PaginatedDataTableComponent,
		TranslatePipe,
	],
})
export class ResumeComponent implements OnInit {
	@Input() tenderer: Tenderer;
	@Input() traData: any;
	@Input() showSaveDuringRegistration: boolean = false;

	@Output() saveAndContinueForRegistration: EventEmitter<boolean> =
		new EventEmitter();

	tendererUuid: string;
	loadTenderer: boolean = false;
	tenderCategory: TenderCategory[] = [];

	//basic info
	fetchingAcademic: boolean = false;
	fetchingCompetency: boolean = false;
	fetchingWork: boolean = false;
	fetchingLanguage: boolean = false;
	fetchingTraining: boolean = false;
	fetchingReferee: boolean = false;
	fetchingProfessional: boolean = false;

	enableActions: boolean = true;
	savePersonal: boolean = false;
	personnelInformation: PersonnelInformation;
	tendererLanguage: UserTendererLanguage[];
	personnelWorkExperiences: PersonnelWorkExperience[];
	taxRegistrationDetails: TendererTaxDetails;
	fetchingItem = false;
	fetchingExp = false;
	deleting: { [id: string]: boolean } = {};
	showDeleting: { [id: string]: boolean } = {};
	deleted: { [id: string]: boolean } = {};

	fname?: string;
	mname?: string;
	lname?: string;
	presentAddress?: string;
	email?: string;
	phone?: string;
	tendererRefereeList?: any[];
	refreshLanguage?: boolean = false;
	refreshWork?: boolean = false;
	refreshAcademic?: boolean = false;
	refreshCompetency?: boolean = false;
	refreshTraining?: boolean = false;
	refreshReferee?: boolean = false;
	refreshProfessional?: boolean = false;
	refreshBusinessLineSelection?: boolean = false;
	fetchingAttachment: { [id: string]: boolean } = {};
	minimumDate: string;

	refereeTotalRecords: number = 0;
	academicTotalRecords: number = 0;
	languageTotalRecords: number = 0;
	workExperienceTotalRecords: number = 0;

	placebirth?: string;
	userAcademicQualifications: UserAcademicQualification[];
	refereeList: any;
	userLanguage: UserTendererLanguage[];
	genderEnum: any;
	genderType: string;
	dateOfBirth: string;

	aQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'awards', label: 'TENDERER_CV_ACADEMIC_AWARD_TYPE' },
			{
				name: 'offeringInstitute',
				label: 'TENDERER_CV_ACADEMIC_INSTITUTION_NAME',
			},
			{
				name: 'qualificationName',
				label: 'TENDERER_CV_TRAINING_PROGRAMME_NAME',
			},
			{ name: 'fromTo', label: 'TENDERER_CV_TRAINING_FROM_TO_COLUMN' },
		],
		actionIcons: {
			edit: true,
			delete: true,
			more: false,
			print: true,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	competencyQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{
				name: 'offeringInstitute',
				label: 'TENDERER_CV_PROFESSIONAL_BOARD_NAME',
			},
			{ name: 'award', label: 'TENDERER_CV_PROFESSIONAL_CATEGORY' },
			{ name: 'proficiency', label: 'TENDERER_CV_PROFESSIONAL_QUALIFICATION' },
			{ name: 'fromTo', label: 'TENDERER_CV_TRAINING_FROM_TO_COLUMN' },
		],
		actionIcons: {
			edit: true,
			delete: true,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	trainingQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'name', label: 'TENDERER_CV_TRAINING_PROGRAMME_NAME' },
			{ name: 'award', label: 'TENDERER_CV_TRAINING_AWARD' },
			{
				name: 'offeringInstitute',
				label: 'TENDERER_CV_TRAINING_INSTITUTION_NAME',
			},
			{ name: 'fromTo', label: 'TENDERER_CV_TRAINING_FROM_TO_COLUMN' },
		],
		actionIcons: {
			edit: true,
			delete: true,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	refereeQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'name', label: 'TENDERER_CV_REFEREES_NAME' },
			{ name: 'organization', label: 'TENDERER_CV_REFEREES_ORGANIZATION' },
			{ name: 'designation', label: 'TENDERER_CV_REFEREES_DESIGNATION' },
			{ name: 'email', label: 'EMAIL' },
			{ name: 'phoneNumber', label: 'PHONE_NUMBER' },
		],
		actionIcons: {
			edit: true,
			delete: true,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	professionalQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{
				name: 'qualificationName',
				label: 'TENDERER_CV_PROFESSIONAL_QUALIFICATION',
			},
			{
				name: 'description',
				label: 'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION',
			},
		],
		actionIcons: {
			edit: true,
			delete: true,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	workExperienceTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{
				name: 'employerName',
				label: 'TENDERER_CV_WORK_EXPERIENCE_EMPLOYER_NAME_COLUMN',
			},
			{
				name: 'projectName',
				label: 'TENDERER_CV_WORK_EXPERIENCE_PROJECT_NAME',
			},
			{ name: 'role', label: 'TENDERER_CV_WORK_EXPERIENCE_ROLE' },
			{
				name: 'employerPhone',
				label: 'TENDERER_CV_WORK_EXPERIENCE_PHONE_NUMBER',
			},
			{
				name: 'employerType',
				label: 'TENDERER_CV_WORK_EXPERIENCE_EMPLOYER_TYPE',
			},
			{ name: 'procuringEntity', label: 'PROCURING_ENTITIES' },
			{ name: 'fromTo', label: 'TENDERER_CV_TRAINING_FROM_TO_COLUMN' },
			{
				name: 'description',
				label: 'TENDERER_CV_WORK_EXPERIENCE_ACTIVITIES_DESCRIPTION',
			},
		],
		actionIcons: {
			edit: false,
			delete: true,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	languageConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'language', label: 'TENDERER_LP_LANGUAGE_COLUMN' },
			{ name: 'read', label: 'TENDERER_LP_READ_COLUMN' },
			{ name: 'speak', label: 'TENDERER_LP_SPEAK_COLUMN' },
			{ name: 'write', label: 'TENDERER_LP_WRITE_COLUMN' },
		],
		actionIcons: {
			edit: true,
			delete: true,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	businessLineSelectionTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'category', label: 'Category' },
			{ name: 'businessLine', label: 'Business Line' },
		],
		actionIcons: {
			edit: false,
			delete: true,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		empty_msg: 'SYSTEM_NO_RECORD_FOUND',
	};

	queryLanguage = GET_TENDERER_LANGUAGES;
	queryAcademic = GET_TENDERER_ACADEMIC;
	queryCompetency = GET_TENDERER_COMPETENCY;
	queryWorkExperience = GET_TENDERER_WORK_EXPERIENCE;
	queryTraining = GET_TENDERER_TRAINGING;
	queryReferee = GET_TENDERER_REFEREE;
	queryProfessional = GET_TENDERER_PROFESSIONAL_QUALIFICATION;

	uaaApolloNamespace = ApolloNamespace.uaa;

	constructor(
		private apollo: GraphqlService,
		private store: Store<ApplicationState>,
		private _bottomSheet: MatBottomSheet,
		private actions$: Actions,
		private http: HttpClient,
		private scroller: ViewportScroller,
		private router: Router,
		private notificationService: NotificationService,
		private translationService: TranslationService,
		private fb: UntypedFormBuilder,
		private settingService: SettingsService
	) {
		this.minimumDate = this.settingService.formatDate(new Date('1900-01-01'));
	}

	ngOnInit(): void {
		if (this.enableActions) {
			/// Add extra Academic qualification table configuration - on edit
			this.aQTableConfigurations = {
				...this.aQTableConfigurations,
				actionIcons: {
					edit: true,
					delete: true,
					more: false,
					print: false,
					customPrimary: false,
				},
			};

			this.workExperienceTableConfigurations = {
				...this.workExperienceTableConfigurations,
				actionIcons: {
					edit: true,
					delete: true,
					more: false,
					print: false,
					customPrimary: false,
				},
			};
		}
		this.genderEnum = [
			{ name: 'TENDERER_PERSONAL_DETAILS_GENDER_MALE', value: 'MALE' },
			{ name: 'TENDERER_PERSONAL_DETAILS_GENDER_FEMALE', value: 'FEMALE' },
		];
		this.initializeData().then();
	}

	async initializeData() {
		if (
			this.showSaveDuringRegistration &&
			this.tenderer.tendererType === 'INDIVIDUAL_LOCAL'
		) {
			await this.fetchTaxRegistrationDetails();
		}
		await this.fetchGetPersonnelCV();
	}

	async initiateData() {
		this.loadTenderer = true;
		try {
			const result1: any = await this.apollo.fetchData({
				query: TENDERER_USER_DESCRIPTION,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					uuid: this.tendererUuid,
				},
			});
			this.tenderer = result1.data.findTendererByUuid?.data;
			this.loadTenderer = false;
		} catch (e) {
			this.loadTenderer = false;
			console.error(e);
			this.notificationService.errorMessage(
				'Failed to update Tenderer information'
			);
		}
	}

	selectGender(event: any) {
		this.genderType = event;
	}

	async buttonSelected($event: any) {
		this.fetchingAttachment[$event.attachmentUuid] = true;
		const data = await firstValueFrom(
			this.http.post<any>(
				environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
				[$event.attachmentUuid]
			)
		);
		await this.settingService.viewFile(data[0].base64Attachment, 'pdf');
		this.fetchingAttachment[$event.attachmentUuid] = false;
	}

	async fetchGetPersonnelCV() {
		// FIND PERSONNEL INFORMATION UUID
		this.fetchingItem = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_PERSONNEL_CV,
				apolloNamespace: ApolloNamespace.uaa,
			});
			if (response?.data?.getPersonnelCV?.code !== 9000) {
				console.error('Failed to Fetch personnel Information');
			} else {
				this.personnelInformation =
					response?.data?.getPersonnelCV?.data?.personnelInformation;
				this.tendererRefereeList =
					response?.data?.getPersonnelCV?.data?.tendererRefereeList;
				this.fname =
					this.personnelInformation?.firstName ??
					this.taxRegistrationDetails?.firstName;
				this.mname =
					this.personnelInformation?.middleName ??
					this.taxRegistrationDetails?.middleName;
				this.lname =
					this.personnelInformation?.lastName ??
					this.taxRegistrationDetails?.lastName;
				this.phone =
					this.personnelInformation?.phone ??
					this.taxRegistrationDetails?.clientPhoneNumber;
				this.dateOfBirth = this.personnelInformation?.dateOfBirth;
				this.placebirth = this.personnelInformation?.placeOfBirth;
				this.genderType = this.personnelInformation?.gender;
				this.email = this.personnelInformation?.email;
				this.presentAddress =
					this.personnelInformation?.presentAddress ??
					this.taxRegistrationDetails?.clientPhysicalAddress;
				this.fetchingItem = false;
			}
		} catch (e) {
			console.error('Failed to Fetch personnel Information');
			this.fetchingItem = false;
		}
	}

	async fetchTaxRegistrationDetails() {
		this.fetchingItem = true;
		try {
			const result: any = await this.apollo.fetchData({
				query: TENDERER_TAX_REGISTRATION_DETAILS,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					uuid: this.tenderer.uuid,
				},
			});
			if (
				result.data.findTendererTaxRegistrationDetailsByTendererUuid?.code ==
				9000
			) {
				this.taxRegistrationDetails =
					result.data.findTendererTaxRegistrationDetailsByTendererUuid?.data;
			} else {
				console.error(
					result.data.findTendererTaxRegistrationDetailsByTendererUuid
				);
			}
			this.fetchingItem = true;
		} catch (e) {
			this.fetchingItem = true;
			console.error(e);
		}
	}

	// listenToActions() {
	//   this.subscription.add(
	//     this.actions$.pipe(ofType(upsertPersonnelWorkExperience)).subscribe(res => {
	//       this.fetchWorkExperienceByPersonnelInfo().then();
	//     }),
	//   );
	//   this.subscription.add(
	//     this.actions$.pipe(ofType(upsertUserAcademicQualification)).subscribe(res => {
	//       this.fetchAcademicInfo().then();
	//     }),
	//   );
	// }

	delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	underAgeValidate(birthday) {
		const diff = Date.now() - birthday.getTime();
		const ageDate = new Date(diff);
		let age = Math.abs(ageDate.getUTCFullYear() - 1970);
		return age < 18;
	}

	selectedBirthDate(event: any) {
		if (event?.value) {
			this.dateOfBirth = this.settingService.formatDate(event.value);
		}
	}

	WorkExperienceMapFunction(item: PersonnelWorkExperience) {
		const fromDate = new DatePipe('en-GB').transform(
			item?.fromDate,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(item?.toDate, 'dd MMM yyyy');
		const businessLineUuids = item?.personnelWorkExperienceBusinessLines.map(
			(line) => line.businessLine.uuid
		);
		return {
			...item,
			procuringEntity: item?.procuringEntity?.name,
			fromTo: fromDate + ' - ' + toDate,
			countryUuid: item?.country?.uuid,
			businessLineUuids: businessLineUuids,
		};
	}

	openXpFormSheetSheet(rData?: PersonnelWorkExperience): void {
		this.refreshWork = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = { personnelInformation: this.personnelInformation, rData };
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(AddPersonnelWorkExperienceComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshWork = true;
			});
	}

	async deleteWorkExperience(event) {
		this.refreshWork = false;
		const response = await this.apollo.mutate({
			mutation: DELETE_PERSONNEL_WORK_EXPERIENCE_BY_UUID,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				uuid: event?.uuid,
			},
		});
		this.refreshWork = true;
		if (response?.data?.deletePersonnelWorkExperienceByUuid?.code === 9000) {
			this.notificationService.successMessage(
				this.translationService.translate('TENDERER_CV_INFORMATION_DELETED')
			);
		} else {
			this.notificationService?.errorMessage(
				response?.data?.deletePersonnelWorkExperienceByUuid?.message
			);
		}
	}

	openEdFormSheetSheet(rData?: UserAcademicQualification): void {
		this.refreshAcademic = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = { personnelInformation: this.personnelInformation, rData };
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(AddUserAcademicQualificationComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshAcademic = true;
			});
	}

	async deleteAcademicQualification(event) {
		this.refreshAcademic = false;
		const response = await this.apollo.mutate({
			mutation: DELETE_USER_ACADEMIC_QUALIFICATION_BY_UUID,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				uuid: event?.uuid,
			},
		});
		this.refreshAcademic = true;
		if (response?.data?.deleteUserAcademicQualificationByUuid?.code === 9000) {
			this.notificationService.successMessage(
				this.translationService.translate('TENDERER_CV_INFORMATION_DELETED')
			);
		} else {
			this.notificationService?.errorMessage(
				response?.data?.deleteUserAcademicQualificationByUuid?.message
			);
		}
	}

	openCompetencyFormSheetSheet(rData?: any): void {
		this.refreshCompetency = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			personnelInformation: this.personnelInformation,
			rData,
			tenderer: this.tenderer,
		};
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(AddCompetencyComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshCompetency = true;
			});
	}

	async deleteCompetency(event) {
		this.refreshCompetency = false;
		const response = await this.apollo.mutate({
			mutation: DELETE_TENDERER_COMPETENCY,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				uuid: event?.uuid,
			},
		});
		this.refreshCompetency = true;
		if (response?.data?.deleteTendererCompetencyByUuid?.code === 9000) {
			this.notificationService.successMessage(
				this.translationService.translate('TENDERER_CV_INFORMATION_DELETED')
			);
		} else {
			this.notificationService?.errorMessage(
				response?.data?.deleteTendererCompetencyByUuid?.message
			);
		}
	}

	openLanguageFormSheetSheet(rData?: any): void {
		this.refreshLanguage = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			personnelInformation: this.personnelInformation,
			rData,
			tenderer: this.tenderer,
		};
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(AddLanguageComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshLanguage = true;
			});
	}

	async deleteLanguage(event) {
		this.refreshLanguage = false;
		const response = await this.apollo.mutate({
			mutation: DELETE_LANGUAGE_PROFICIENCY,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				uuid: event?.uuid,
			},
		});
		this.refreshLanguage = true;
		if (response?.data?.deleteTendererLanguageByUuid?.code === 9000) {
			this.notificationService.successMessage(
				this.translationService.translate('TENDERER_CV_INFORMATION_DELETED')
			);
		} else {
			this.notificationService?.errorMessage(
				response?.data?.deleteTendererLanguageByUuid?.message
			);
		}
	}

	openTrainingFormSheetSheet(rData?: any): void {
		this.refreshTraining = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = { tenderer: this.tenderer, rData };
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(AddTrainingWorkshopComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshTraining = true;
			});
	}

	async deleteTraining(event) {
		this.refreshTraining = false;
		const response = await this.apollo.mutate({
			mutation: DELETE_TENDERER_TRAINING_BY_UUID,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				uuid: event?.uuid,
			},
		});

		this.refreshTraining = true;

		if (response?.data?.deleteTendererTrainingByUuid?.code === 9000) {
			this.notificationService.successMessage(
				this.translationService.translate('TENDERER_CV_INFORMATION_DELETED')
			);
		} else {
			this.notificationService?.errorMessage(
				response?.data?.deleteTendererTrainingByUuid?.message
			);
		}
	}

	openRefereeFormSheetSheet(rData?: any): void {
		this.refreshReferee = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = { tenderer: this.tenderer, rData };
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(AddRefereeComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshReferee = true;
			});
	}

	async deleteReferee(event) {
		this.refreshReferee = false;
		const response = await this.apollo.mutate({
			mutation: DELETE_TENDERER_REFEREE_BY_UUID,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				uuid: event?.uuid,
			},
		});
		this.refreshReferee = true;
		if (response?.data?.deleteTendererRefereeByUuid?.code === 9000) {
			this.notificationService.successMessage(
				this.translationService.translate('TENDERER_CV_INFORMATION_DELETED')
			);
		} else {
			this.notificationService?.errorMessage(
				response?.data?.deleteTendererRefereeByUuid?.message
			);
		}
	}

	onChangeRefereeTotalRecord($event) {
		this.refereeTotalRecords = $event;
	}

	onChangeAcademicTotalRecord($event) {
		this.academicTotalRecords = $event;
	}

	onChangeLanguageTotalRecord($event) {
		this.languageTotalRecords = $event;
	}

	onChangeWorkExperienceTotalRecord($event) {
		this.workExperienceTotalRecords = $event;
	}

	openProfessionalFormSheetSheet(rData?: any): void {
		this.refreshProfessional = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = { tenderer: this.tenderer, rData };
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(AddProfessionalComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshProfessional = true;
			});
	}

	async deleteProfessionalCertificate(event) {
		this.refreshProfessional = false;
		const response = await this.apollo.mutate({
			mutation: DELETE_PROFESSIONAL_CERTIFICATE_BY_UUID,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				uuid: event?.uuid,
			},
		});
		this.refreshProfessional = true;
		if (
			response?.data?.deleteUserProfessionalQualificationByUuid?.code === 9000
		) {
			this.notificationService.successMessage(
				this.translationService.translate('TENDERER_CV_INFORMATION_DELETED')
			);
		} else {
			this.notificationService?.errorMessage(
				response?.data?.deleteUserProfessionalQualificationByUuid?.message
			);
		}
	}

	businessLineSelectionFunction(line: BusinessLine) {
		return {
			...line,
			category: line?.tenderCategory?.description,
			businessLine: line.description,
		};
	}

	async savePersonalDetails() {
		const user: User = await firstValueFrom(
			this.store.pipe(
				select(selectAllUsers),
				map((items) => items[0]),
				first((i) => !!i)
			)
		);
		const isIndividualRegistered = [
			'INDIVIDUAL_LOCAL',
			'INDIVIDUAL_FOREIGN',
		].includes(this.tenderer.tendererType);
		this.savePersonal = true;
		let birthDate = new Date(this.dateOfBirth);
		if (this.underAgeValidate(birthDate)) {
			this.notificationService.errorMessage(
				this.translationService.translate(
					'TENDERER_CV_PERSONAL_CONTACT_DETAILS_UNDER_AGE_MESSAGE'
				)
			);
			this.savePersonal = false;
			return;
		}

		let dataToSave = {
			firstName: this.fname,
			middleName: this.mname,
			lastName: this.lname,
			placeOfBirth: this.placebirth,
			dateOfBirth: this.dateOfBirth,
			jobTitle: '',
			languageProficiency: '',
			phone: this.phone,
			gender: this.genderType,
			presentAddress: this.presentAddress,
			email: user?.email,
			uuid: this.personnelInformation?.uuid
				? this.personnelInformation?.uuid
				: null,
		};
		try {
			const response: any = await this.apollo.mutate({
				mutation: CREATE_UPDATE_PERSONNEL_INFORMATION,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					personnelInformationDto: dataToSave,
				},
			});
			if (response?.data?.createPersonnelInformation?.code === 9000) {
				this.personnelInformation =
					response?.data?.createPersonnelInformation?.data;
				this.notificationService.successMessage(
					this.translationService.translate('TENDERER_CV_DETAILS_SAVED')
				);

				// update user detail for individual
				if (isIndividualRegistered) {
					const formData: UserDtoInput = {
						uuid: user.uuid,
						firstName: this.fname,
						middleName: this.mname,
						lastName: this.lname,
						phone: this.phone,
					};
					if (formData.uuid) {
						await this.updateUserAccountDataOnUpdateCv(formData);
					}
				}

				this.scroller.scrollToAnchor('personal saved');
				this.savePersonal = false;
			} else {
				this.notificationService.errorMessage(
					this.translationService.translate('TENDERER_CV_DETAILS_NOT_SAVED')
				);
				this.savePersonal = false;
			}
		} catch (e) {
			this.notificationService.errorMessage(
				this.translationService.translate('TENDERER_CV_DETAILS_NOT_SAVED')
			);
			this.savePersonal = false;
		}
	}

	async updateUserAccountDataOnUpdateCv(formValues: UserDtoInput) {
		this.savePersonal = true;
		try {
			const response: any = await this.apollo.mutate({
				mutation: SAVE_USER,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					user: {
						...formValues,
					},
				},
			});

			if (response?.data?.createUpdateUserAccount?.code === 9000) {
				this.store.dispatch(
					upsertUser({ user: response?.data?.createUpdateUserAccount?.data })
				);
				this.notificationService.successMessage(
					this.translationService.translate('TENDERER_CV_DETAILS_SAVED')
				);
			} else if (
				response?.data?.createUpdateUserAccount?.code === 9005 &&
				response?.data?.createUpdateUserAccount?.message
			) {
				this.notificationService.errorMessage(
					this.translationService.translate(
						'TENDERER_ACCOUNT_INFORMATION_NOT_UPDATED_MESSAGE'
					)
				);
			} else {
				this.notificationService.errorMessage(
					this.translationService.translate(
						'TENDERER_ACCOUNT_INFORMATION_NOT_UPDATED_MESSAGE'
					)
				);
			}
		} catch (e) {
			this.notificationService.errorMessage(
				this.translationService.translate(
					'TENDERER_ACCOUNT_INFORMATION_NOT_UPDATED_MESSAGE'
				)
			);
			console.error('error', e.message);
		}
		this.savePersonal = false;
	}

	UserLanguageMapFunction(item: any) {
		return {
			...item,
			uuid: item?.uuid,
			language: item?.language?.name,
		};
	}

	UserAcademicQualificationMapFunction(item: UserAcademicQualification) {
		const fromDate = new DatePipe('en-GB').transform(
			item?.fromDate,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(item?.toDate, 'dd MMM yyyy');
		const businessLineUuids =
			item?.personnelAcademicQualificationBusinessLines.map(
				(line) => line.businessLine.uuid
			);
		return {
			...item,
			awards: item?.academicLevel?.levelName,
			fromTo: fromDate + ' - ' + toDate,
			businessLineUuids: businessLineUuids,
		};
	}

	UserTrainingMapFunction(item: any) {
		const fromDate = new DatePipe('en-GB').transform(
			item?.fromDate,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(item?.toDate, 'dd MMM yyyy');
		return {
			...item,
			fromTo: fromDate + ' - ' + toDate,
		};
	}

	UserProfeciencyMapFunction(item: any) {
		const fromDate = new DatePipe('en-GB').transform(
			item?.fromDate,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(item?.toDate, 'dd MMM yyyy');
		return {
			...item,
			fromTo: fromDate + ' - ' + toDate,
		};
	}

	UserCompetencyMapFunction(item: any) {
		const fromDate = new DatePipe('en-GB').transform(
			item?.fromDate,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(item?.toDate, 'dd MMM yyyy');
		return {
			...item,
			fromTo: fromDate + ' - ' + toDate,
		};
	}
}
