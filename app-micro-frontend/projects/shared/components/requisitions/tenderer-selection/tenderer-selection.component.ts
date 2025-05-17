import {
	Component,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	Signal,
	ViewChild,
} from '@angular/core';
import { DynamicFormService } from '../../dynamic-forms-components/dynamic-form.service';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../../store';
import { NotificationService } from '../../../../services/notification.service';
import { GraphqlService } from '../../../../services/graphql.service';
import { fadeSmooth } from '../../../animations/router-animation';
import { MatStepper } from '@angular/material/stepper';
import { fadeIn } from '../../../animations/basic-animation';
import * as fromGql from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import {
	DELETE_TENDER_INVITATION,
	DELETE_TENDER_INVITATION_BY_TENDER,
	// GET_TENDER_TENDERERS_PAGINATED_FORVIEW,
	SAVE_TENDER_TENDERERS2,
} from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { LayoutService } from '../../../../services/layout.service';
import {
	FieldConfig,
	FieldType,
} from '../../dynamic-forms-components/field.interface';
import * as formConfigs from './tenderer-selection.form';
import { SelectedTenderer } from './tenderer-selection.form';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { GraphqlOperationService } from '../../../../services/graph-operation.service';
import { MustHaveFilter } from '../../paginated-data-table/must-have-filters.model';
import { GET_TENDER_INVITATION_REASONS_PAGINATED } from 'src/app/modules/nest-tender-initiation/settings/tender-invitation-reason/tender-invitation-reason.graphql';
import { map } from 'rxjs';
import { TableConfiguration } from '../../paginated-data-table/paginated-table-configuration.model';
import { GET_TENDERER_BY_FILTER } from '../../../../modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import { getAllAdministrativeAreasByType } from 'src/app/modules/nest-pe-management/store/branch/branch.actions';
import { SettingsService } from '../../../../services/settings.service';
import { selectModifiedAdministrativeAreasByType } from 'src/app/modules/nest-pe-management/store/administrative-area/administrative-area.selectors';
import { PaginatedDataService } from '../../../../services/paginated-data.service';
import { ProcurementMethod } from 'src/app/modules/nest-app/store/settings/procurement-method/procurement-method.model';
import { SaveAreaComponent } from '../../save-area/save-area.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmAreaComponent } from '../../confirm-area/confirm-area.component';
import { FullDataTableComponent } from '../../full-data-table/full-data-table.component';
import { MainDynamicFormComponent } from '../../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { LoaderComponent } from '../../loader/loader.component';
import {
	GET_PRE_QUALIFICATION_BY_TENDER_UUID,
	GET_SHORT_LISTED_APPLICANTS_FOR_SELECTION,
	REFRESH_PRE_QUALIFICATION,
} from 'src/app/modules/nest-tender-initiation/store/tender-document-creation/tender-document-creation.graphql';
import { GET_PRE_QUALIFICATION_PRE_SELECTED_TENDERER } from '../../../../modules/nest-pre-qualification/store/pre-qualification.graphql';
import { PreQualificationPreSelectedTenderer } from '../../../../modules/nest-pre-qualification/store/pre-qualification.model';
import { GET_FRAMEWORK_AGREEMENTS_FOR_TENDERER_SELECTION } from 'src/app/modules/nest-framework-agreement/agreements/agreements.graphql';
import { ApolloNamespace } from '../../../../apollo.config';
import { SimpleLinearProgressBarComponent } from '../../simple-linear-progress-bar/simple-linear-progress-bar.component';
import { SignalsStoreService } from '../../../../services/signals-store.service';

@Component({
	selector: 'app-tenderer-selection',
	templateUrl: './tenderer-selection.component.html',
	styleUrls: ['./tenderer-selection.component.scss'],
	animations: [fadeIn, fadeSmooth],
	standalone: true,
	imports: [
		LoaderComponent,
		HasPermissionDirective,
		MainDynamicFormComponent,
		FullDataTableComponent,
		ConfirmAreaComponent,
		MatButtonModule,
		MatIconModule,
		SaveAreaComponent,
		SimpleLinearProgressBarComponent,
	],
})
export class TendererSelectionComponent implements OnChanges, OnInit {
	@Input() applicableBusinessLines = [];
	@Output() closeForm = new EventEmitter<boolean>();
	@Output() tenderers = new EventEmitter<any[]>();
	// @Input() tenderProcurementRequisition: MergedMainProcurementRequisition;
	@Input() procurementCategoryAcronym: string;
	@Input() isCuis: boolean;
	@Input() tendererSource: string;
	@Input() tenderUuid: string;
	@Input() entityNumber: string;
	@Input() entityDescription: string;
	@Input() entityUuid: string;
	@Input() entityId: number;
	@Input() frameworkType: string;
	@Input() frameworkMainUuid: string;
	@Input() showSubmittedOnly: boolean = false;
	@Input() shortListedQuery = null;
	@Input() additionalVariables = {};
	@Input() entityType = 'TENDER';
	@Input() procurementMethod: ProcurementMethod;
	@Input() marketApproach;
	@Output() tendererSaved = new EventEmitter();
	@Input() tendererTypes: string[] = [];
	@Input() isForNest: boolean = false;
	@Input() showDiscard: boolean = false;
	@ViewChild(MatStepper) stepper: MatStepper;
	isPrequalificationCompleted: boolean;
	showSaveArea = false;
	loadingMessage = 'Saving Tenderer to Tender...';
	searchFields: FieldConfig[] = formConfigs.searchFields;
	fields: FieldConfig[] = formConfigs.fields;
	preQualificationSelectedTenderer: PreQualificationPreSelectedTenderer[] = [];
	loadingPrequalificationTenderer = false;
	loadingShortlistedApplicants = false;
	preQualification: any;
	searchForm: UntypedFormGroup;
	form: UntypedFormGroup;
	query = GET_TENDERER_BY_FILTER;
	agreementQuery = GET_FRAMEWORK_AGREEMENTS_FOR_TENDERER_SELECTION;
	loadingSavedTenderers = false;
	loadingTenderers = false;
	savingData = false;
	discarding = false;
	showConfirm = false;
	dataAlreadySaved = false;
	methodCategory: string;
	methodCategoryDescription: string;
	methodCategoryAcronym: string;
	savedTenderersData = [];
	selectedTenderers: SelectedTenderer[] = [];
	unSavedTenderersData: SelectedTenderer[] = [];
	permanentSelectedTenderers: SelectedTenderer[] = [];
	checkBoxSelectedTenderers: SelectedTenderer[] = [];
	permanentSelectedTenderersWasEmpty = false;
	tableConfigurations: TableConfiguration = {
		tableColumns: [
			{ name: 'name', label: 'Name' },
			{ name: 'uniqueIdentificationNumber', label: 'Tenderer Number' },
			{ name: 'tendererType', label: 'Tenderer Type', case: 'uppercase' },
			{ name: 'email', label: 'Email' },
			{ name: 'phone', label: 'Phone Number' },
		],
		tableCaption: 'List of available Tenderers',
		showNumbers: true,
		tableNotifications: '',
		showSearch: true,
		useFullObject: true,
		showBorder: true,
		allowPagination: true,
		actionIcons: {
			checkBox: true,
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
	};

	preQualificationTendererTableConfiguration: TableConfiguration;
	filters: MustHaveFilter[] = [];
	fromFrameworkfilters: MustHaveFilter[] = [];
	selectedBusinessLines: any = {};
	regionDispatch = false;
	districtDispatch = false;
	numberOfRecords = 0;
	totalPages = 0;
	currentPage = 1;
	preparingTenderers: {
		[key: number]: boolean;
	} = {};
	manufacturer: any;
	dataToSave: any;
	createInvitation: any;
	tenderData: {
		entityUuid: any;
		entityNumber: any;
		entityDescription: any;
		requisitionUuid: any;
	};
	fetchTendererFailed: boolean;
	// tenderersQuery = GET_TENDER_TENDERERS_PAGINATED_FORVIEW;
	saveText?: string;
	saveDisabled: boolean;
	// filteredTenderersFromUnifiedQuery = [];
	loadingUnSavedTenderers = false;
	tableApolloNamespace = ApolloNamespace.submission;
	signalsStoreService = inject(SignalsStoreService);
	mainLoaderProgress: Signal<number>;
	totalRecordSignal: Signal<number>;
	mainLoaderSavedTendererProgress: Signal<number>;
	totalRecordSavedTendererSignal: Signal<number>;
	currentLoadingPage: Signal<number>;
	currentForSavedLoadingPage: Signal<number>;
	checkingPreQualification = false;
	loadingPrequalificationResults: boolean = false;
	constructor(
		private graphqlOperationService: GraphqlOperationService,
		private graphqlService: GraphqlService,
		private dynamicFormService: DynamicFormService,
		private settingsService: SettingsService,
		private store: Store<ApplicationState>,
		private layoutService: LayoutService,
		private notificationService: NotificationService,
		private paginatedDataService: PaginatedDataService,
	) {
		this.mainLoaderProgress = this.signalsStoreService.select(
			'loadingTenderTendererKey',
		);
		this.totalRecordSignal = this.signalsStoreService.select(
			'tenderTendererTotalRecordsKey',
		);
		this.currentLoadingPage = this.signalsStoreService.select('currentPageKey');

		this.currentForSavedLoadingPage = this.signalsStoreService.select(
			'currentPageForSavedTendererKey',
		);

		this.mainLoaderSavedTendererProgress = this.signalsStoreService.select(
			'loadingSavedTenderTendererKey',
		);
		this.totalRecordSavedTendererSignal = this.signalsStoreService.select(
			'tenderSavedTendererTotalRecordsKey',
		);
	}

	ngOnInit(): void {
		this.preQualificationTendererTableConfiguration = {
			...this.tableConfigurations,
			tableColumns: [
				{ name: 'name', label: 'Name' },
				{ name: 'uniqueIdentificationNumber', label: 'Tenderer Number' },
				{ name: 'tendererType', label: 'Tenderer Type', case: 'uppercase' },
				{ name: 'tendererEmail', label: 'Email' },
				{ name: 'phone', label: 'Phone Number' },
			],
			actionIcons: {
				...this.tableConfigurations.actionIcons,
				checkBox: false,
				delete: false,
			},
		};
	}

	ngOnChanges(): void {
		this.initializer().then();
		if (this.frameworkMainUuid) {
			this.fromFrameworkfilters = [
				{
					fieldName: 'mainEntityUuid',
					operation: 'EQ',
					value1: this.frameworkMainUuid,
				},
				{
					fieldName: 'entityType',
					operation: 'EQ',
					value1: 'FRAMEWORK',
				},
			];

			this.getUnSavedTenderers().then();
		}
	}

	removeStringDuplicates(arr: string[]): string[] {
		return [...new Set(arr)];
	}

	async initializer(): Promise<void> {
		this.methodCategoryDescription =
			this.procurementMethod?.description?.toUpperCase();
		this.methodCategory = this.procurementMethod?.procurementMethodCategory
			?.replace('_', ' ')
			?.toUpperCase();

		this.checkSaveAreaConditions();
		this.methodCategoryAcronym = this.procurementMethod?.acronym;
		this.searchFields = this.searchFields.map((field) => {
			if (field.key == 'businessLineId') {
				field.mustHaveFilters = [
					{
						fieldName: 'tenderCategory.acronym',
						operation: 'EQ',
						value1: this.procurementCategoryAcronym,
					},
				];
				field.mustHaveFilters = field.mustHaveFilters.filter(
					(i) => i.fieldName != 'id',
				);
				const inValues = this.removeStringDuplicates(
					(this.applicableBusinessLines || []).map(
						(i) => i.businessLineId + '',
					),
				);

				if (
					// this.procurementCategoryAcronym != 'G' &&
					(inValues || []).length > 0
				) {
					// field.mustHaveFilters.push({
					// 	fieldName: 'id',
					// 	operation: 'IN',
					// 	inValues,
					// });
				}
				if (this.isCuis) {
					field.label = 'Applicable Business Line for Framework';
					field.mustHaveFilters.push({
						fieldName: 'forFramework',
						operation: 'EQ',
						value1: 'true',
					});
				}
			} else if (field.key == 'operatingCountryId') {
				if (
					(this.entityType != 'FRAMEWORK' && this.isCuis) ||
					(this.entityType == 'FRAMEWORK' &&
						this.tendererSource != 'INTERNATIONAL')
				) {
					field.mustHaveFilters = [
						{
							fieldName: 'name',
							operation: 'EQ',
							value1: 'Tanzania',
						},
					];
				}
			}
			return field;
		});

		this.fields = this.fields.map((field) => {
			if (field.key == 'reasonUid') {
				field.options = this.graphqlService
					.fetchDataObservable({
						apolloNamespace: ApolloNamespace.app,
						query: GET_TENDER_INVITATION_REASONS_PAGINATED,
					})
					.pipe(
						map((res: any) =>
							(res.data?.getTenderInvitationReasons?.data || []).map((i) => ({
								name: i.reason,
								value: i.uuid,
							})),
						),
					);
			}
			return field;
		});
		this.searchForm = this.dynamicFormService.createControl(
			this.searchFields,
			null,
		);
		this.form = this.dynamicFormService.createControl(this.fields, null);
		await this.fetchSavedTenderer();
		if (this.methodCategory === 'RESTRICTED' && !this.isCuis) {
			await this.getPreQualificationByTender();
		}

		this.tenderData = {
			entityUuid: this.tenderUuid,
			entityNumber: this.entityNumber,
			entityDescription: this.entityDescription,
			requisitionUuid: this.entityUuid,
		};
	}

	close(shouldUpdate = false) {
		this.closeForm.emit(shouldUpdate);
	}

	/**
	 * Handling Manufacturer Form
	 */
	fieldSelected($event: any) {
		const manufacturer = $event.object;
	}

	handleSingleManufacturer(param: any) {
		this.createInvitation = {
			...this.tenderData,
			directManufacturerAccountName: this.manufacturer?.accountName,
			directManufacturerAdministrativeAreaName:
				this.manufacturer?.administrativeArea &&
				this.manufacturer?.administrativeArea?.parentAdministrativeArea
					?.areaName
					? this.manufacturer?.administrativeArea?.parentAdministrativeArea
							?.areaName
					: null,
			directManufacturerAdministrativeAreaUuid:
				this.manufacturer?.administrativeArea &&
				this.manufacturer?.administrativeArea?.parentAdministrativeArea?.uuid
					? this.manufacturer?.administrativeArea?.parentAdministrativeArea
							?.uuid
					: null,
			directManufacturerCountryName: this.manufacturer?.country?.name,
			directManufacturerEconomicActivity: this.manufacturer?.economicActivity,
			directManufacturerEmail: this.manufacturer?.email,
			directManufacturerGroupType: this.manufacturer?.groupType,
			directManufacturerName: this.manufacturer?.name,
			directManufacturerPhoneNumber: this.manufacturer?.phoneNumber,
			directManufacturerTinNumber: this.manufacturer?.tinNumber,
			directManufacturerUuid: this.manufacturer?.uuid,
			directManufacturerCountryUuid: this.manufacturer?.country?.uuid,
		};
	}

	fieldData(event: any) {
		if (event.key == 'businessLineId') {
			// this.filters = this.filters.filter(i => i.fieldName != 'businessLineId')
			this.selectedBusinessLines = event.object;

			//   this.filters.push({
			//     fieldName: 'businessLineId',
			//     operation: 'IN',
			//     inValues: event.value
			//   })

			// {
			//   fieldName: 'tendererType',
			//   operation: 'IN',
			//   inValues: this.tenderProcurementRequisition?.mergedMainProcurementRequisition?.tender.tendererTypes || []
			// }
			// ]
			// } else if (event.key == 'operatingCountryId') {
			//   this.filters = this.filters.filter(i => i.fieldName != 'operatingCountryId')

			//   this.filters.push({
			//     fieldName: 'operatingCountryId',
			//     operation: 'EQ',
			//     value1: event.value
			//   })
		} else if (event.key == 'operatingCountryId') {
			this.searchFields = this.searchFields.filter(
				(f) => f.key != 'regionId' && f.key != 'districtId',
			);
			this.searchForm.controls['regionId']?.reset();
			this.searchForm.controls['districtId']?.reset();

			if (event.object.length == 1 && event.object[0]?.code === 'TZ') {
				if (this.regionDispatch == false) {
					this.store.dispatch(
						getAllAdministrativeAreasByType({ areaType: 'Region' }),
					);
					this.regionDispatch = true;
				}
				this.searchFields = this.settingsService.insertIntoArrIndex(
					this.searchFields,
					2,
					{
						type: FieldType.select,
						label: 'Region',
						key: 'regionId',
						validations: this.isCuis
							? [
									{
										message: 'Region is Required',
										validator: Validators.required,
										name: 'required',
									},
							  ]
							: [],
						options: this.store
							.select(selectModifiedAdministrativeAreasByType('Region'))
							.pipe(
								map((regions) =>
									regions.map((r) => ({
										...r,
										value: r.id + '',
										name: r.areaName,
									})),
								),
							),
						multiple: true,
						rowClass: 'col-span-6',
					},
				);
			}
		} else if (event.key == 'regionId') {
			this.searchFields = this.searchFields.filter(
				(f) => f.key != 'districtId',
			);
			if (this.districtDispatch == false) {
				this.store.dispatch(
					getAllAdministrativeAreasByType({ areaType: 'District' }),
				);
				this.districtDispatch = true;
			}
			this.searchFields = this.settingsService.insertIntoArrIndex(
				this.searchFields,
				3,
				{
					type: FieldType.select,
					label: 'District',
					key: 'districtId',
					options: this.store
						.select(selectModifiedAdministrativeAreasByType('District'))
						.pipe(
							map((regions) =>
								regions
									.filter((d) =>
										event.value.some(
											(i) => i == d.parentAdministrativeArea?.id,
										),
									)
									.map((r) => ({ ...r, value: r.id + '', name: r.areaName })),
							),
						),
					multiple: true,
					rowClass: 'col-span-6',
				},
			);
		}
	}

	fetchTenderersUnified() {}

	setSelectedTenderers(event: any) {
		// Ensure selectedItems is defined and is an array
		if (event?.selectedItems && Array.isArray(event.selectedItems)) {
			this.selectedTenderers = event.selectedItems;
		} else {
			// Handle case where selectedItems is not defined or not an array
			this.selectedTenderers = [];
		}

		// Track if permanentSelectedTenderersWasEmpty was previously empty
		if (this.permanentSelectedTenderersWasEmpty === undefined) {
			this.permanentSelectedTenderersWasEmpty =
				this.permanentSelectedTenderers.length === 0;
		}

		// If no selectedTenderers and permanent was previously empty, reset permanentSelectedTenderers
		if (
			this.selectedTenderers.length === 0 &&
			this.permanentSelectedTenderersWasEmpty
		) {
			this.permanentSelectedTenderers = [];
		} else {
			// Otherwise, combine the new selection with the permanent array
			this.permanentSelectedTenderers = [
				...this.permanentSelectedTenderers,
				...this.selectedTenderers,
			];
		}

		this.permanentSelectedTenderers = this.removeDuplicates(
			this.permanentSelectedTenderers,
		);

		if (event.item && !event.item.isChecked) {
			this.permanentSelectedTenderers = this.permanentSelectedTenderers.filter(
				(i) => event.item.uuid !== i.uuid,
			);
		}
		this.checkSaveAreaConditions();
	}

	searchTenderers(event) {
		this.filters = [];
		this.permanentSelectedTenderers = [];
		this.checkSaveAreaConditions();

		setTimeout(async () => {
			this.filters = [
				{
					fieldName: 'businessLineId',
					operation: 'IN',
					inValues: event.businessLineId.map((i) => i + ''),
				},
				{
					fieldName: 'isForNest',
					operation: 'EQ',
					value1: this.isForNest ? 'true' : 'false',
				},
			];

			if ((this.tendererTypes || []).length > 0) {
				this.filters.push({
					fieldName: 'tendererType',
					operation: 'IN',
					inValues: this.tendererTypes,
				});
			}

			if (
				this.isCuis &&
				this.frameworkType != 'OWN_FRAMEWORK' &&
				this.entityType == 'TENDER'
			) {
				this.filters.push({
					fieldName: 'frameworkAttachmentUuid',
					operation: 'NE',
					value1: 'haipo',
				});
			}
			if (event.operatingCountryId) {
				this.filters.push({
					fieldName: 'operatingCountryId',
					operation: 'IN',
					inValues: event.operatingCountryId,
				});
			}
			if (event.regionId || [].length > 0) {
				this.filters.push({
					fieldName: 'regionId',
					operation: 'IN',
					inValues: event.regionId,
				});
			}
			if ((event.districtId || []).length > 0) {
				this.filters.push({
					fieldName: 'districtId',
					operation: 'IN',
					inValues: event.districtId,
				});
			}

			await this.getUnSavedTenderers();
		}, 0);
	}

	getUnifiedQuery() {
		if (this.frameworkMainUuid) {
			this.tableApolloNamespace = ApolloNamespace.submission;
			return this.agreementQuery;
		} else {
			this.tableApolloNamespace = ApolloNamespace.uaa;
			return this.shortListedQuery || this.query;
		}
	}

	async getUnSavedTenderers() {
		this.unSavedTenderersData = [];

		try {
			const mustHaveFilters = this.getUnSavedFilters();
			const query = this.getUnifiedQuery();
			this.loadingUnSavedTenderers = true;
			let items = await this.paginatedDataService.getAllDataOld({
				page: this.currentForSavedLoadingPage() || 1,
				progressLoadingKey: 'loadingSavedTenderTendererKey',
				totalRecordsKey: 'tenderSavedTendererTotalRecordsKey',
				currentPageKey: 'currentPageForSavedTendererKey',
				apolloNamespace: this.tableApolloNamespace,
				query,
				mustHaveFilters,
			});
			this.unSavedTenderersData = (items || []).map((tender: any) => ({
				...tender,
				tendererName: tender.name,
				tendererEmail: tender.email,
				tendererPhoneNumber: tender.phone,
			}));

			this.loadingUnSavedTenderers = false;
			if (this.entityType != 'FRAMEWORK' && this.isCuis) {
				this.permanentSelectedTenderers = this.unSavedTenderersData;
				this.checkSaveAreaConditions();
			}
		} catch (e) {
			this.loadingUnSavedTenderers = false;
			this.fetchTendererFailed = true;
			this.notificationService.errorMessage(e.toString());
		}
	}

	getUnSavedFilters() {
		if (this.frameworkMainUuid) {
			return this.fromFrameworkfilters;
		}

		return this.shortListedQuery ? [] : this.filters;
	}

	mapFunction(item) {
		return {
			...item,
			email: item.email ?? 'N/A',
			businessLineName: item.businessLine?.name,
			registrationNumber: item?.uniqueIdentificationNumber,
			uniqueIdentificationNumber: item.uniqueIdentificationNumber ?? 'N/A',
			tendererType: item.tendererType ?? 'N/A',
		};
	}

	mapFunctionForPreSelected(item: any) {
		return {
			...item,
			tendererNumber: item.tendererNumber ?? 'N/A',
			uniqueIdentificationNumber: item.uniqueIdentificationNumber ?? 'N/A',
		};
	}

	mapFunctionFramework(item) {
		return {
			...item,
			email: item.email ?? 'N/A',
			tendererType: item.tendererType ?? 'N/A',
		};
	}

	async getPreQualificationByTender(): Promise<void> {
		try {
			this.checkingPreQualification = true;
			const response: any = await this.graphqlService.fetchData({
				apolloNamespace: ApolloNamespace.app,
				query: GET_PRE_QUALIFICATION_BY_TENDER_UUID,
				variables: {
					tenderUuid: this.tenderUuid,
				},
			});
			this.checkingPreQualification = false;

			if (response.data.findPreQualificationByTenderUuid?.code === 9000) {
				this.preQualification =
					response.data.findPreQualificationByTenderUuid.data;
				this.isPrequalificationCompleted =
					this.preQualification?.tender?.isPrequalificationCompleted;
				if (this.isPrequalificationCompleted && !this.dataAlreadySaved) {
					if (
						this.preQualification &&
						this.preQualification.preQualificationMethod === 'ADVERTISEMENT'
					) {
						await this.getAdvertisementPreQualificationApplicants();
					}
					if (
						this.preQualification &&
						this.preQualification.preQualificationMethod === 'PRE_SELECTED'
					) {
						await this.getPreSelectedPreQualificationApplicant();
					}
				}
			}
		} catch (error) {
			this.checkingPreQualification = false;

			console.error(error);
		}
	}

	async refreshPreQualification(preQualification: any) {
		this.loadingPrequalificationResults = true;
		const response: any = await this.graphqlService.mutate({
			apolloNamespace: ApolloNamespace.app,
			mutation: REFRESH_PRE_QUALIFICATION,
			variables: {
				uuid: preQualification.uuid,
			},
		});

		if (response.refreshPrequalificationStatus.data == true) {
			this.loadingPrequalificationResults = false;
			this.getPreQualificationByTender().then();
		} else {
			this.loadingPrequalificationResults = false;
		}
	}

	async getAdvertisementPreQualificationApplicants(): Promise<void> {
		if (this.preQualification.uuid) {
			try {
				this.loadingShortlistedApplicants = true;
				const items = await this.paginatedDataService.getAllDataOld({
					apolloNamespace: ApolloNamespace.submission,
					query: GET_SHORT_LISTED_APPLICANTS_FOR_SELECTION,
					additionalVariables: {
						entityUuid: this.preQualification.uuid,
					},
				});
				this.loadingShortlistedApplicants = false;

				this.preQualificationSelectedTenderer = items;
				this.preQualificationSelectedTenderer =
					this.preQualificationSelectedTenderer.map((tenderer) => ({
						...tenderer,
						name: tenderer.name ?? 'N/A',
						tendererName: tenderer.name,
						tendererPhoneNumber: tenderer.phone,
					}));
				this.permanentSelectedTenderers = [];
				this.preQualificationSelectedTenderer.forEach((tenderer) => {
					this.permanentSelectedTenderers.push({
						uuid: tenderer?.uuid,
						tendererUuid: tenderer?.tendererUuid,
						tendererId: tenderer?.tendererId,
						id: tenderer?.id,
						name: tenderer.name ?? 'N/A',
						tendererName: tenderer.name,
						uniqueIdentificationNumber: tenderer.tendererNumber ?? 'N/A',
						tendererType: tenderer.tendererType ?? 'N/A',
						email: tenderer.email ?? 'N/A',
						phone: tenderer?.phone,
						tendererPhoneNumber: tenderer?.phone,
					});
					// this.filteredTenderersFromUnifiedQuery = this.permanentSelectedTenderers;
				});
				this.checkSaveAreaConditions();
			} catch (error) {
				console.error(error);

				this.loadingShortlistedApplicants = false;
			}
		}
	}

	async getPreSelectedPreQualificationApplicant(): Promise<void> {
		try {
			this.loadingPrequalificationTenderer = true;
			if (this.preQualification) {
				const response: any = await this.graphqlService.fetchData({
					query: GET_PRE_QUALIFICATION_PRE_SELECTED_TENDERER,
					apolloNamespace: ApolloNamespace.app,
					variables: {
						prequalificationUuid: this.preQualification.uuid,
					},
				});
				if (
					response.data
						.allPreQualificationPreSelectedTenderersByPrequalification?.code ===
					9000
				) {
					this.preQualificationSelectedTenderer =
						response.data
							.allPreQualificationPreSelectedTenderersByPrequalification
							.dataList || [];
					this.preQualificationSelectedTenderer =
						this.preQualificationSelectedTenderer.map((tenderer) => ({
							...tenderer,
							name: tenderer.tendererName ?? tenderer.name ?? 'N/A',
							tendererName: tenderer.tendererName,
							phone: tenderer.tendererPhoneNumber,
						}));
					this.permanentSelectedTenderers = [];
					this.preQualificationSelectedTenderer.forEach((tenderer) => {
						this.permanentSelectedTenderers.push({
							uuid: tenderer?.tendererUuid,
							tendererUuid: tenderer?.tendererUuid,
							tendererId: tenderer?.tendererId,
							id: tenderer?.tendererId,
							name: tenderer.tendererName ?? tenderer.name ?? 'N/A',
							tendererName: tenderer.tendererName,
							uniqueIdentificationNumber:
								tenderer.uniqueIdentificationNumber ?? 'N/A',
							tendererType: tenderer.tendererType ?? 'N/A',
							email: tenderer.tendererEmail ?? 'N/A',
							phone: tenderer?.tendererPhoneNumber,
							tendererPhoneNumber: tenderer?.tendererPhoneNumber,
						});
						// this.filteredTenderersFromUnifiedQuery = this.permanentSelectedTenderers;
					});
					this.checkSaveAreaConditions();

					this.loadingPrequalificationTenderer = false;
				} else {
					this.loadingPrequalificationTenderer = false;
					this.notificationService.errorMessage(
						response.data
							.allPreQualificationPreSelectedTenderersByPrequalification
							?.message ??
							'Problem occurred while getting pre selected tenderer(s) list, please try again... ',
					);
				}
			}
			this.loadingPrequalificationTenderer = false;
		} catch (e) {
			this.loadingPrequalificationTenderer = false;
			console.error(e);
			this.notificationService.errorMessage('Failed to get requisition...');
		}
	}

	async getSavedTenderers(): Promise<void> {
		this.savedTenderersData = [];
		this.fetchTendererFailed = false;
		let tenderers = [];
		try {
			this.loadingSavedTenderers = true;

			tenderers = await this.paginatedDataService.getAllDataOld({
				page: this.currentLoadingPage() || 1,
				progressLoadingKey: 'loadingTenderTendererKey',
				totalRecordsKey: 'tenderTendererTotalRecordsKey',
				apolloNamespace: ApolloNamespace.app,
				query: fromGql.GET_TENDER_TENDERERS_DATA,
				mustHaveFilters: [
					{
						fieldName: 'entityId',
						operation: 'EQ',
						value1: this.entityId + '',
					},
					// {
					// 	fieldName: 'entityUuid',
					// 	operation: 'EQ',
					// 	value1: this.entityUuid,
					// },
					{
						fieldName: 'entityType',
						operation: 'EQ',
						value1: this.entityType,
					},
				],
			});
			this.savedTenderersData = tenderers;

			this.loadingSavedTenderers = false;
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'Failed to retrive tenderers,  please try again',
			);
			this.loadingSavedTenderers = false;
			this.fetchTendererFailed = true;
			this.savedTenderersData = [];
		}
	}

	async fetchSavedTenderer() {
		if (this.entityUuid && this.entityType) {
			try {
				this.permanentSelectedTenderers = [];
				this.checkBoxSelectedTenderers = [];
				this.checkSaveAreaConditions();
				await this.getSavedTenderers();
				this.emitTenderers();
			} catch (e) {
				console.error(e);

				this.fetchTendererFailed = true;
				this.loadingTenderers = false;
			}
		}

		this.loadingTenderers = false;
	}

	private tableConfigActionIconsCheck() {
		this.tableConfigurations = {
			...this.tableConfigurations,
			actionIcons: {
				...this.tableConfigurations.actionIcons,
				checkBox: !(
					this.dataAlreadySaved ||
					(this.entityType != 'FRAMEWORK' && this.isCuis)
				),
			},
		};
	}

	removeDuplicates(arr: any[]): any[] {
		return this.settingsService.removeDuplicates(arr, 'id');
	}

	async setTenderTenderers() {
		const searchFilter = {};
		this.filters.forEach((filter) => {
			if (filter.fieldName == 'businessLineId') {
				searchFilter[filter.fieldName] =
					this.selectedBusinessLines?.map((i) => i.name) || [];
			} else {
				searchFilter[filter.fieldName] = filter.value1;
			}
		});

		try {
			this.savingData = true;

			const tenderers: SelectedTenderer[] = this.removeDuplicates(
				(this.checkBoxSelectedTenderers.length > 0
					? this.checkBoxSelectedTenderers
					: this.permanentSelectedTenderers
				).map((i) => ({
					id: i.id,
					uuid: i.uuid,
					tendererUuid: i.tendererUuid,
					tendererId: i.tendererId,
					name: i.name,
					email: i.email,
					phone: i.phone,
					tendererPhoneNumber: i?.phone,
					tendererType: i.tendererType,
					uniqueIdentificationNumber: i.uniqueIdentificationNumber,
				})),
			);

			this.tenderers.emit(tenderers);

			const tenderersToSave = tenderers.map((tenderer) => ({
				id: this.preQualification ? tenderer.tendererId : tenderer.id,
				uuid: this.preQualification ? tenderer.tendererUuid : tenderer.uuid,
				name: tenderer.name,
				email: tenderer.email,
				phone: tenderer.phone,
				tendererType: tenderer.tendererType,
				uniqueIdentificationNumber: tenderer.uniqueIdentificationNumber,
			}));
			let failedToSaveSuccessful = true;
			if (this.entityUuid) {
				for (let i = 0; i < tenderersToSave.length; i += 10) {
					const batch = tenderersToSave.slice(i, i + 10);
					let success = await this.saveTenderTenderers(searchFilter, batch);
					this.loadingMessage = `Saving batch ${
						i / 10 + 1
					} of tenderer(s) to tender out of ${Math.round(
						tenderersToSave.length / 10,
					)}`;

					if (failedToSaveSuccessful) {
						failedToSaveSuccessful = !success;
					}
					if (!success) {
						this.notificationService.errorMessage(
							'Failed to save ' + batch.length + ' tenderers',
						);
					}
				}
				if (!failedToSaveSuccessful) {
					this.notificationService.successMessage(
						'Tenderer(s) are added to tender successfully',
					);
					this.form.reset();
					this.fetchSavedTenderer().then();
				}
			}
			this.savingData = false;
		} catch (e) {
			console.error(e);
			this.savingData = false;
			this.notificationService.errorMessage(
				'Failed to add tenderer(s), please try again',
			);
		}
	}

	async saveTenderTenderers(
		searchFilter: any,
		tenderers: any[],
	): Promise<boolean> {
		const response = await this.graphqlService.mutate({
			apolloNamespace: ApolloNamespace.app,
			mutation: SAVE_TENDER_TENDERERS2,
			variables: {
				input: {
					entityType: this.entityType,
					searchFilter: searchFilter,
					entityUuid: this.entityUuid,
					entityId: btoa(this.entityId + ''),
					savingInBatch: true,
					tenderers,
				},
			},
		});

		return response.data?.saveTenderTenderers2?.code == 9000;
	}

	async discardTenderers(): Promise<void> {
		try {
			this.discarding = true;
			this.showConfirm = false;
			const response = await this.graphqlService.mutate({
				apolloNamespace: ApolloNamespace.app,
				mutation: DELETE_TENDER_INVITATION_BY_TENDER,
				variables: {
					entityUuid: btoa(this.entityId + ''),
					entityType: this.entityType,
				},
			});

			if (response.data?.deleteTenderInvitationByTender?.code === 9000) {
				this.notificationService.successMessage(
					'Tenderer(s) are discarded successfully',
				);
				this.permanentSelectedTenderers = [];
				this.checkBoxSelectedTenderers = [];
				this.savedTenderersData = [];

				this.emitTenderers();
				this.checkSaveAreaConditions();
			} else {
				console.error();
				this.notificationService.errorMessage(
					'Failed to discard tenderer(s), please try again',
				);
			}
			this.discarding = false;
		} catch (e) {
			console.error(e);
			this.discarding = false;
			this.notificationService.errorMessage(
				'Failed to discard tenderer(s), please try again',
			);
		}
	}

	private emitTenderers() {
		this.dataAlreadySaved = (this.savedTenderersData || []).length > 0;
		this.tableConfigActionIconsCheck();
		this.tendererSaved.emit(this.dataAlreadySaved);
		this.tenderers.emit(this.savedTenderersData);
	}

	onCheckBoxSelection(event: any) {
		this.permanentSelectedTenderers = [...event.selectedItems];
		this.checkBoxSelectedTenderers = this.permanentSelectedTenderers;
		this.checkSaveAreaConditions();
	}

	async deleteTenderInvitation(event: any) {
		try {
			this.tableConfigurations = this.layoutService.setDeleted(
				event.id,
				this.tableConfigurations,
			);
			const response = await this.graphqlService.mutate({
				apolloNamespace: ApolloNamespace.app,
				mutation: DELETE_TENDER_INVITATION,
				variables: {
					uid: event.uuid,
				},
			});

			if (response.data?.deleteTenderInvitation?.code === 9000) {
				this.notificationService.successMessage(
					'Tenderer(s) are discarded successfully',
				);
				this.tableConfigurations = this.layoutService.setDeleted(
					event.id,
					this.tableConfigurations,
				);
				this.fetchSavedTenderer().then();
			} else {
				console.error();
				this.notificationService.errorMessage(
					'Failed to remove tenderer, please try again',
				);
			}
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'Failed to remove tenderer, please try again',
			);
		}
	}

	checkSaveAreaConditions() {
		this.showSaveArea =
			(!this.loadingUnSavedTenderers &&
				this.permanentSelectedTenderers.length > 0 &&
				(this.filters.length > 0 || this.fromFrameworkfilters.length > 0) &&
				((this.entityType !== 'FRAMEWORK' && this.isCuis) ||
					(this.methodCategory !== 'SINGLE SOURCE' &&
						this.methodCategory != 'RESTRICTED' &&
						this.permanentSelectedTenderers.length > 0) ||
					(this.methodCategory === 'SINGLE SOURCE' &&
						this.permanentSelectedTenderers.length === 1) ||
					(this.methodCategory === 'RESTRICTED' &&
						this.permanentSelectedTenderers.length > 1))) ||
			this.shortListedQuery ||
			(this.isPrequalificationCompleted &&
				this.permanentSelectedTenderers.length > 0);

		this.saveText =
			this.entityType !== 'FRAMEWORK' && this.isCuis
				? 'Save Tenderer(s)'
				: 'Save ' + this.permanentSelectedTenderers.length + ' Tenderer(s)';

		this.saveDisabled =
			this.entityType !== 'FRAMEWORK' &&
			this.isCuis &&
			this.permanentSelectedTenderers.length === 0;
	}

	protected readonly onclick = onclick;
}
