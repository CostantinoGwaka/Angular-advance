import { PersonnelLanguageComponent } from './../../../../../modules/nest-tenderer/profile-information/personnel-information/personel-extras/personnel-language/personnel-language.component';
import { PersonnelProfessionalComponent } from './../../../../../modules/nest-tenderer/profile-information/personnel-information/personel-extras/personnel-professional/personnel-professional.component';
import { PersonnelTrainingComponent } from './../../../../../modules/nest-tenderer/profile-information/personnel-information/personel-extras/personnel-training/personnel-training.component';
import {
	GET_PERSONNEL_COMPETENCY_BY_UUID,
	GET_TENDERER_LANGUAGES,
	GET_TENDERER_COMPETENCY,
	GET_TENDERER_TRAINGING,
	GET_TENDERER_REFEREE,
	GET_TENDERER_PROFESSIONAL_QUALIFICATION,
	GET_PERSONNEL_COMPETENCY,
	GET_PERSONNEL_REFEREE,
	GET_PERSONNEL_TRAINGING,
	GET_PERSONNEL_PROFESSIONAL_QUALIFICATION,
	GET_PERSONNEL_LANGUAGES,
} from './../../../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.graphql';
import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from '../../../../../services/graphql.service';
import { NotificationService } from '../../../../../services/notification.service';
import {
	MatBottomSheet,
	MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';

import { fadeIn } from '../../../../animations/router-animation';
import {
	DELETE_PERSONNEL_WORK_EXPERIENCE_BY_UUID,
	PERSONNEL_WORK_EXPERIENCE_LIST,
} from '../../../../../modules/nest-tenderer/store/settings/personnel-work-experience/personnel-work-experience.graphql';
import { DELETE_ACADEMIC_QUALIFICATION_BY_UUID } from '../../../../../modules/nest-tenderer/store/settings/tenderer-work-experience/tenderer-work-experience.graphql';
import { upsertPersonnelWorkExperience } from '../../../../../modules/nest-tenderer/store/settings/personnel-work-experience/personnel-work-experience.actions';
import { GET_PERSONNEL_INFORMATION_BY_UUID } from '../../../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.graphql';
import { USER_ACADEMIC_QUALIFICATION_LIST } from '../../../../../modules/nest-tenderer/store/settings/user-academic-qualification/user-academic-qualification.graphql';
import { AddUserAcademicQualificationComponent } from '../../../../../modules/nest-tenderer/profile-information/personnel-information/add-user-academic-qualification/add-user-academic-qualification.component';
import { UserAcademicQualification } from '../../../../../modules/nest-tenderer/store/settings/user-academic-qualification/user-academic-qualification.model';
import { PersonnelInformation } from '../../../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.model';
import { PersonnelWorkExperience } from '../../../../../modules/nest-tenderer/store/settings/personnel-work-experience/personnel-work-experience.model';
import { AddPersonnelWorkExperienceComponent } from '../../../../../modules/nest-tenderer/profile-information/personnel-work-experience/add-personnel-work-experience/add-personnel-work-experience.component';
import { upsertUserAcademicQualification } from '../../../../../modules/nest-tenderer/store/settings/user-academic-qualification/user-academic-qualification.actions';
import { DatePipe } from '@angular/common';
import { PersonelCompetencyComponent } from 'src/app/modules/nest-tenderer/profile-information/personnel-information/personel-extras/personel-competency/personel-competency.component';
import { PersonnelRefereeComponent } from 'src/app/modules/nest-tenderer/profile-information/personnel-information/personel-extras/personnel-referee/personnel-referee.component';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { PaginatedDataTableComponent } from '../../../paginated-data-table/paginated-data-table.component';
import { FullDataTableComponent } from '../../../full-data-table/full-data-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ItemDetailWithIcon } from '../../../item-detail-with-icon/item-detail-with-icon';
import { LoaderComponent } from '../../../loader/loader.component';
@Component({
	selector: 'app-view-personnel-information',
	templateUrl: './view-personnel-information.component.html',
	styleUrls: ['./view-personnel-information.component.scss'],
	animations: [fadeIn],
	standalone: true,
	imports: [
		LoaderComponent,
		ItemDetailWithIcon,
		MatButtonModule,
		MatIconModule,
		FullDataTableComponent,
		PaginatedDataTableComponent,
		DatePipe,
		TranslatePipe,
	],
})
export class ViewPersonnelInformationComponent implements OnInit, OnDestroy {
	@Input() selectedUuid: string;
	@Input() enableActions: boolean = true;
	@Output() closeView = new EventEmitter<boolean>();
	@Output() onAddInformation = new EventEmitter<boolean>();
	personnelInformation: PersonnelInformation;
	personnelWorkExperiences: PersonnelWorkExperience[];

	//temp replace with model
	personnelCompetency: any[];
	fetchingItem = false;
	fetchingExp = false;
	fetchingAcademic = false;
	refreshLanguage?: boolean = false;
	refreshWork?: boolean = false;
	refreshAcademic?: boolean = false;
	refreshCompetency?: boolean = false;
	refreshTraing?: boolean = false;
	refreshReferee?: boolean = false;
	refreshProfessional?: boolean = false;
	subscription: Subscription = new Subscription();
	deleting: { [id: string]: boolean } = {};
	showDeleting: { [id: string]: boolean } = {};
	deleted: { [id: string]: boolean } = {};
	queryLanguage = GET_PERSONNEL_LANGUAGES;
	queryCompetency = GET_PERSONNEL_COMPETENCY;
	queryTraining = GET_PERSONNEL_TRAINGING;
	queryReferee = GET_PERSONNEL_REFEREE;
	queryProfessional = GET_PERSONNEL_PROFESSIONAL_QUALIFICATION;

	uaaApolloNamespace = ApolloNamespace.uaa;
	//basic info
	fetchingCompetency: boolean = false;
	fetchingWork: boolean = false;
	fetchingLanguage: boolean = false;
	fetchingTraing: boolean = false;
	fetchingReferee: boolean = false;
	fetchingProfessional: boolean = false;

	aQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'award', label: 'Award' },
			{ name: 'offeringInstitute', label: 'Institution' },
			{ name: 'qualificationName', label: 'Qualification' },
			{ name: 'fromTo', label: 'From - To' },
		],
		actionIcons: {
			edit: false,
			delete: false,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'No Records found',
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
			{ name: 'employerName', label: 'Employer Name' },
			{ name: 'projectName', label: 'Project Name' },
			{ name: 'role', label: 'Role' },
			{ name: 'employerPhone', label: 'Employer Phone' },
			{ name: 'employerType', label: 'Employer Type' },
			{ name: 'procuringEntity', label: 'Procuring Entity' },
			{ name: 'fromTo', label: 'From - To' },
			{ name: 'description', label: 'Description' },
		],
		actionIcons: {
			edit: false,
			delete: false,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'No Records found',
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
			{ name: 'offeringInstitute', label: 'Institution' },
			{ name: 'award', label: 'Award' },
			{ name: 'proficiency', label: 'Proficiency' },
			{ name: 'fromTo', label: 'From - To' },
		],
		actionIcons: {
			edit: true,
			delete: false,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'No Records found',
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
			{ name: 'name', label: 'Referee Name' },
			{ name: 'organization', label: 'Organization' },
			{ name: 'designation', label: 'Designation' },
			{ name: 'email', label: 'E-mail' },
			{ name: 'phoneNumber', label: 'Phone Number' },
		],
		actionIcons: {
			edit: true,
			delete: false,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'No Records found',
	};

	traingQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'name', label: 'Programme Name' },
			{ name: 'award', label: 'Award' },
			{ name: 'offeringInstitute', label: 'Institution' },
			{ name: 'fromTo', label: 'From - To' },
		],
		actionIcons: {
			edit: true,
			delete: false,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'No Records found',
	};

	profesionalQTableConfigurations = {
		tableCaption: '',
		showNumbers: true,
		tableNotifications: '',
		showSearch: false,
		useFullObject: true,
		showBorder: true,
		allowPagination: false,
		tableColumns: [
			{ name: 'qualificationName', label: 'Certification Name' },
			{ name: 'description', label: 'Description' },
			{ name: 'fromTo', label: 'From - To' },
		],
		actionIcons: {
			edit: true,
			delete: false,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'No Records found',
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
			{ name: 'language', label: 'Language' },
			{ name: 'read', label: 'Read' },
			{ name: 'speak', label: 'Speak' },
			{ name: 'write', label: 'Write' },
		],
		actionIcons: {
			edit: true,
			delete: false,
			more: false,
			print: false,
			customPrimary: false,
		},
		doneLoading: false,
		deleting: {},
		active: {},
		hideExport: true,
		customPrimaryMessage: 'Activate',
		empty_msg: 'No Records found',
	};

	userAcademicQualifications: UserAcademicQualification[];

	constructor(
		private apollo: GraphqlService,
		private notificationService: NotificationService,
		private _bottomSheet: MatBottomSheet,
		private actions$: Actions
	) {}

	ngOnInit(): void {
		if (this.enableActions) {
			/// Add extra Academic qualification table configuration - on edit
			this.aQTableConfigurations = {
				...this.aQTableConfigurations,
				actionIcons: {
					edit: true,
					delete: false,
					more: false,
					print: false,
					customPrimary: false,
				},
			};

			this.workExperienceTableConfigurations = {
				...this.workExperienceTableConfigurations,
				actionIcons: {
					edit: true,
					delete: false,
					more: false,
					print: false,
					customPrimary: false,
				},
			};
		}

		if (this.selectedUuid) {
			this.fetchOne().then();
			this.fetchWorkExperienceByPersonnelInfo().then();
			this.fetchAcademicInfo().then();
			this.fetchCompetenceByPersonnelInfo().then();
			this.fetchRefereeByPersonnelInfo().then();
		}

		this.listenToActions();
	}

	async fetchOne() {
		// FIND PERSONNEL INFORMATION UUID
		this.fetchingItem = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_PERSONNEL_INFORMATION_BY_UUID,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					uuid: this.selectedUuid,
				},
			});
			if (response?.data?.findPersonnelInformationByUuid?.code !== 9000) {
				this.notificationService.errorMessage(
					'Failed to Fetch personnel Information'
				);
			}
			this.personnelInformation =
				response?.data?.findPersonnelInformationByUuid?.data;

			this.fetchingItem = false;
		} catch (e) {
			this.notificationService.errorMessage(
				'Failed to Fetch personnel Information'
			);
			this.fetchingItem = false;
		}
	}

	async fetchWorkExperienceByPersonnelInfo() {
		this.fetchingExp = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: PERSONNEL_WORK_EXPERIENCE_LIST,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					deleted: false,
					personnelInformationUuid: this.selectedUuid,
				},
			});
			this.personnelWorkExperiences =
				(response?.data
					?.getAllPersonnelWorkExperiencesByPersonnelInformationUuidAndDeleted as PersonnelWorkExperience[]) ||
				[];
			this.fetchingExp = false;
		} catch (e) {
			this.notificationService.errorMessage(e.message);
			this.fetchingExp = false;
		}
	}

	async fetchCompetenceByPersonnelInfo() {
		this.fetchingExp = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_PERSONNEL_COMPETENCY_BY_UUID,
				apolloNamespace: ApolloNamespace.uaa,

				variables: {
					uuid: this.selectedUuid,
				},
			});
			this.personnelCompetency =
				(response?.data?.findPersonnelCompetencyByUuid
					?.data as PersonnelWorkExperience[]) || [];
			this.fetchingExp = false;
		} catch (e) {
			this.notificationService.errorMessage(e.message);
			this.fetchingExp = false;
		}
	}

	async fetchRefereeByPersonnelInfo() {
		this.fetchingExp = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_PERSONNEL_COMPETENCY_BY_UUID,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					uuid: this.selectedUuid,
				},
			});
			this.personnelCompetency =
				(response?.data?.findPersonnelCompetencyByUuid
					?.data as PersonnelWorkExperience[]) || [];
			this.fetchingExp = false;
		} catch (e) {
			this.notificationService.errorMessage(e.message);
			this.fetchingExp = false;
		}
	}

	async fetchAcademicInfo() {
		this.fetchingAcademic = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: USER_ACADEMIC_QUALIFICATION_LIST,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					deleted: false,
					personnelInformationUuid: this.selectedUuid,
				},
			});
			this.userAcademicQualifications =
				(response?.data
					?.getAllUserAcademicQualificationsByPersonnelInformationUuidAndDeleted as UserAcademicQualification[]) ||
				[];
			this.fetchingAcademic = false;
		} catch (e) {
			this.notificationService.errorMessage(e.message);
			this.fetchingAcademic = false;
		}
	}

	listenToActions() {
		this.subscription.add(
			this.actions$
				.pipe(ofType(upsertPersonnelWorkExperience))
				.subscribe((res) => {
					this.fetchWorkExperienceByPersonnelInfo().then();
				})
		);
		this.subscription.add(
			this.actions$
				.pipe(ofType(upsertUserAcademicQualification))
				.subscribe((res) => {
					this.fetchAcademicInfo().then();
				})
		);
	}

	openXpFormSheetSheet(rData?: PersonnelWorkExperience): void {
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = { personnelInformation: this.personnelInformation, rData };
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet.open(AddPersonnelWorkExperienceComponent, config);
	}

	openEdFormSheetSheet(rData?: UserAcademicQualification): void {
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = { personnelInformation: this.personnelInformation, rData };
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet.open(AddUserAcademicQualificationComponent, config);
	}

	openCompFormSheetSheet(rData?: any): void {
		this.refreshCompetency = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			personnelInformation: this.personnelInformation,
			selected: this.selectedUuid,
			rData,
		};
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(PersonelCompetencyComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshCompetency = true;
			});
	}

	openProfessionalFormSheetSheet(rData?: any): void {
		this.refreshProfessional = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			personnelInformation: this.personnelInformation,
			selected: this.selectedUuid,
			rData,
		};
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(PersonnelProfessionalComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshProfessional = true;
			});
	}

	openLangFormSheetSheet(rData?: any): void {
		this.refreshLanguage = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			personnelInformation: this.personnelInformation,
			selected: this.selectedUuid,
			rData,
		};
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(PersonnelLanguageComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshLanguage = true;
			});
	}

	openRefereeFormSheetSheet(rData?: any): void {
		this.refreshReferee = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			personnelInformation: this.personnelInformation,
			selected: this.selectedUuid,
			rData,
		};
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(PersonnelRefereeComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshReferee = true;
			});
	}

	openTrainingFormSheetSheet(rData?: any): void {
		this.refreshTraing = false;
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			personnelInformation: this.personnelInformation,
			selected: this.selectedUuid,
			rData,
		};
		config.panelClass = ['bottom__sheet', 'w-50'];
		this._bottomSheet
			.open(PersonnelTrainingComponent, config)
			.afterDismissed()
			.subscribe(() => {
				this.refreshTraing = true;
			});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	async deleteAcademicQualification(event: UserAcademicQualification) {
		this.fetchingExp = true;
		try {
			const response = await this.apollo.mutate({
				mutation: DELETE_ACADEMIC_QUALIFICATION_BY_UUID,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					uuid: event.uuid,
				},
			});
			if (
				response?.data?.deleteUserAcademicQualificationByUuid?.code === 9000
			) {
				this.fetchAcademicInfo().then();
				this.notificationService.successMessage(
					'Academic Qualification deleted successfully'
				);
			} else {
				this.notificationService.errorMessage(
					'Problem occurred while deleting Academic Qualification. Please try again'
				);
			}
		} catch (e) {
			this.fetchingExp = false;
			this.notificationService.errorMessage(
				'Problem occurred while deleting Academic Qualification. Please try again'
			);
		}
	}

	async deleteWorkExperience(workExperience: PersonnelWorkExperience) {
		try {
			const response = await this.apollo.mutate({
				mutation: DELETE_PERSONNEL_WORK_EXPERIENCE_BY_UUID,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					uuid: workExperience.uuid,
				},
			});
			if (response?.data?.deletePersonnelWorkExperienceByUuid?.code === 9000) {
				this.fetchWorkExperienceByPersonnelInfo().then();
				this.notificationService.successMessage(
					'Experience deleted successfully'
				);
			} else {
				this.notificationService.errorMessage(
					'Problem occurred while deleting Work Experience. Please try again'
				);
			}
		} catch (e) {
			this.notificationService.errorMessage(
				'Problem occurred while deleting Work Experience. Please try again'
			);
		}
	}

	UserAcademicQualificationMapFunction(item: UserAcademicQualification) {
		const fromDate = new DatePipe('en-GB').transform(
			item.fromDate,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(item.toDate, 'dd MMM yyyy');

		return {
			...item,
			award: item.academicLevel?.levelName,
			fromTo: fromDate + ' - ' + toDate,
		};
	}

	WorkExperienceMapFunction(item: PersonnelWorkExperience) {
		const fromDate = new DatePipe('en-GB').transform(
			item.fromDate,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(item.toDate, 'dd MMM yyyy');

		return {
			...item,
			employerType:
				item.employerType == 'PUBLIC_INSTITUTION'
					? 'PUBLIC INSTITUTION'
					: 'PRIVATE',
			procuringEntity: item.procuringEntity?.name,
			fromTo: fromDate + ' - ' + toDate,
		};
	}

	UserLanguageMapFunction(item: any) {
		return {
			...item,
			uuid: item?.uuid,
			language: item?.language?.name,
		};
	}

	UserTraingMapFunction(item: any) {
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

	UserProfessionMapFunction(item: any) {
		const fromDate = new DatePipe('en-GB').transform(
			item?.validFrom,
			'dd MMM yyyy'
		);
		const toDate = new DatePipe('en-GB').transform(
			item?.validUntil,
			'dd MMM yyyy'
		);
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
