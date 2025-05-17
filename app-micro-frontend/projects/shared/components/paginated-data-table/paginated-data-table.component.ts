import { NotificationService } from '../../../services/notification.service';
import { DocumentNode } from '@apollo/client/core';
import {
	Component,
	OnInit,
	Input,
	Output,
	input,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit,
	OnChanges,
	Signal,
	inject,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
	fadeSmooth,
	fadeIn,
	ROUTE_ANIMATIONS_ELEMENTS,
} from '../../animations/router-animation';
import { UntypedFormControl, FormsModule } from '@angular/forms';
import { ActionButton } from './action-button.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { merge, Observable, of, Subject } from 'rxjs';
import { switchMap, startWith, map, first } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { FieldRequestInput } from './field-request-input.model';
import { DataPage } from './data-page.model';

import { MustHaveFilter } from './must-have-filters.model';
import { SettingsService } from '../../../services/settings.service';
import { SelectionModel } from '@angular/cdk/collections';
import {
	TableColumn,
	TableConfiguration,
} from './paginated-table-configuration.model';
import { AuthService } from '../../../services/auth.service';
import { PaginatedDataService } from '../../../services/paginated-data.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ShowOtherButtonsPipe } from '../full-data-table/show-other-buttons.pipe';
import { ShowButtonPipe } from '../full-data-table/show-button.pipe';
import { SafeDatePipe } from '../../pipes/safe-date.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
	NgClass,
	NgStyle,
	UpperCasePipe,
	LowerCasePipe,
	DecimalPipe,
	TitleCasePipe,
} from '@angular/common';
import { SignalsStoreService } from '../../../services/signals-store.service';
import { ProgressCircularLoaderComponent } from 'src/app/modules/nest-tenderer/tender-submission/submission/progress-circular-loader/progress-circular-loader.component';
import { ReportMakerFilterConditionInputComponent } from 'src/app/modules/nest-reports/setting/report-maker/components/report-maker-side-bar/report-maker-filter-settings-dialog/report-maker-filter-condition-input/report-maker-filter-condition-input.component';
import { ReportFilter } from 'src/app/modules/nest-reports/store/settting/report-entity/report-entity.model';
import { SearchOperation } from '../store/data-request-input/data-request-input.model';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-paginated-data-table',
	templateUrl: './paginated-data-table.component.html',
	styleUrls: ['./paginated-data-table.component.scss'],
	animations: [fadeSmooth, fadeIn],
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatIconModule,
		LoaderComponent,
		MatCardModule,
		MatTableModule,
		MatSortModule,
		NgClass,
		MatCheckboxModule,
		MatTooltipModule,
		NgStyle,
		HasPermissionDirective,
		MatMenuModule,
		MatProgressBarModule,
		MatPaginatorModule,
		UpperCasePipe,
		LowerCasePipe,
		DecimalPipe,
		TitleCasePipe,
		ReplacePipe,
		SafeDatePipe,
		ShowButtonPipe,
		ShowOtherButtonsPipe,
		TranslatePipe,
		ReportMakerFilterConditionInputComponent,
	],
})
export class PaginatedDataTableComponent
	implements OnInit, AfterViewInit, OnChanges {
	routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
	@Input() advancedFilters: ReportFilter[] = [];
	/** Table Inputs */
	@Input() tableList = [];
	@Input() query: any;
	apolloNamespace = input.required<ApolloNamespace>();

	/** Trigger Server Request */
	@Input() resetTable = false;
	@Input() exportGraph?: {
		baseUrl?: string;
		query?: DocumentNode;
		variables: any;
		queryKey: any;
		fileName?: string;
	};
	@Input() filters?: MustHaveFilter[] = [];
	@Input() customSearchFilters?: FieldRequestInput[] = [];
	@Input() permissions: any = {};
	@Input() customMainFilters: any = {};
	@Input() noSearchFields: string[] = [];
	@Input() customSearchFields: string[] = [];
	@Input() initialDataSelected: any[] =
		[]; /** Accept list of objects and not uuid's or id's*/
	@Input() initialSortField?: { key: string; sortOrder: 'ASC' | 'DESC' };
	@Input() additionalVariables?: { [id: string]: any };
	@Input() tableConfigurations: TableConfiguration = {
		tableColumns: [],
		tableCaption: '',
		allowPagination: true,
		tableNotifications: null,
		useRowClick: true,
		actionIcons: {
			edit: false,
			delete: false,
			more: false,
			customPrimary: false,
			checkBox: false,
			chipColor: 'gray',
		},
		doneLoading: false,
		deleting: {},
		active: {},
		error: {},
		loading: {},
		hideSorting: false,
		showSearch: true,
		showBorder: true,
		showNumbers: false,
		empty_msg: 'No Data',
		customPrimaryMessage: '',
		useFullObject: false,
		disableHasError: false,
	};
	@Input() loading: boolean = false;
	tableLoading: boolean = false;
	searchFieldControl: UntypedFormControl;

	/** Table Events */
	@Output() rowCheckBox: EventEmitter<any> = new EventEmitter();
	@Output() rowCustomPrimary: EventEmitter<any> = new EventEmitter();
	@Output() rowUpdate: EventEmitter<any> = new EventEmitter();
	@Output() rowDownload: EventEmitter<any> = new EventEmitter();
	@Output() rowDelete: EventEmitter<any> = new EventEmitter();
	@Output() rowPreview: EventEmitter<any> = new EventEmitter();
	@Output() rowPrint: EventEmitter<any> = new EventEmitter();
	@Output() totalRecords: EventEmitter<any> = new EventEmitter();
	@Output() loadingData: EventEmitter<any> = new EventEmitter();

	@Output() customAction: EventEmitter<any> = new EventEmitter();

	@Input() loadingMessage?: string;

	advancedSearchSearchFilters: FieldRequestInput[] = [];

	// list of all the added buttons that you want to deal with separately
	@Input() actionButtons: ActionButton[] = [];
	@Output() getData = new EventEmitter();

	private resetDataTable$: Subject<boolean> = new Subject<boolean>();

	/** list of fields that are searchable */
	showDelete: any = {};
	searchFields: string;
	searchQuery: any;
	showDownload: any = {};
	doSearch = false;
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	selection = new SelectionModel<any>(true, []);
	displayedColumns: string[] = [];
	showButtonConfirm: any = {};
	isFirstTimeCalled = false;
	@ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
	// @ViewChild(MatPaginator, { static: false }) set paginator(val: MatPaginator) {
	//   if (val) {
	//     this.dataSource.paginator = val;
	//   }
	// }
	@ViewChild(MatSort) sort?: MatSort;
	// @ViewChild(MatSort, { static: false }) set sort(val: MatSort) {
	//   if (val) {
	//     this.dataSource.sort = val;
	//   }
	// }
	@ViewChild('input') input?: ElementRef;
	@Input() pageSize = 10;
	@Input() excelFilename = 'NeST Download';
	@Input() pageSizeOptions = [5, 10, 20, 50, 100];
	resultLength?: number;
	loadingExportData: boolean = false;
	@Input() queryKey = 'items';
	@Input() fetchPolicy: 'cache-first' | 'network-only' = 'network-only';
	tempData?: DataPage;
	@Input() mapFunction: (item: any) => {} = (item: any) => {
		return {
			...item,
		};
	};
	@Input() exportMapFunction: (item: any) => Promise<any> = async (
		item: any
	) => {
		return {
			...item,
		};
	};

	selectedItemsTracker: any[] = [];
	selectedCheckboxTracker: { [key: string]: any } = {};
	selectedCheckboxTrackerItems = {};
	propertyToUse = 'id';
	mainLoaderMessage: string = 'loading';
	mainLoaderProgress: Signal<number>;
	totalRecordSignal: Signal<number>;
	mainLoading: boolean = true;
	signalsStoreService = inject(SignalsStoreService);
	advancedSearchMustHaveFilters: MustHaveFilter[] = [];
	itemIndexOfExportMapFunctionBeingProcessed = 0;
	exportMapFunctionBeingProcessedProgress = 0;
	exportMapFunctionProgressMessage = '';

	filtersCopy: MustHaveFilter[] = [];
	showAdvancedSearch = false;

	constructor(
		private authService: AuthService,
		private settings: SettingsService,
		private paginatedDataService: PaginatedDataService,
		private notificationService: NotificationService,
		private titleService: Title
	) {
		this.searchFieldControl = new UntypedFormControl('');
		this.tableConfigurations.showSearch =
			this.tableConfigurations.showSearch !== null
				? this.tableConfigurations.showSearch
				: true;
		this.tableConfigurations.allowPagination =
			this.tableConfigurations.allowPagination !== null
				? this.tableConfigurations.allowPagination
				: true;
		this.tableConfigurations.showBorder =
			this.tableConfigurations.showBorder !== null
				? this.tableConfigurations.showBorder
				: false;
		this.searchFields = this.tableConfigurations.tableColumns
			.map((column) => column.name)
			.join(',');
		this.tableConfigurations.actionIcons = this.tableConfigurations.actionIcons
			? this.tableConfigurations.actionIcons
			: {
				edit: false,
				delete: false,
				download: false,
				more: false,
				print: false,
				cancel: false,
				customPrimary: false,
				checkBox: false,
			};
		this.tableConfigurations.active = this.tableConfigurations.active
			? this.tableConfigurations.active
			: {};

		this.mainLoaderProgress = this.signalsStoreService.select(
			'paginatedDataProgress'
		);
		this.totalRecordSignal = this.signalsStoreService.select(
			'paginatedTotalRecords'
		);
	}

	ngOnChanges(): void {
		if (this.resetTable || this.filters.length > 0) {
			this.resetDataTable$.next(true);
			this.showDelete = {};
		} else {
			this.resetDataTable$.next(false);
		}
	}

	ngOnInit() {
		// console.log('advancedFilters', this.advancedFilters);
		this.dataSource.paginator = this.paginator ?? null;
		this.dataSource.sort = this.sort ?? null;

		this.prepareTableColumns();
		this.excelFilename = this.getPageTitle();
		// console.log('this.excelFilename', this.excelFilename);
	}

	getPageTitle() {
		let title = this.titleService.getTitle();
		if (title.indexOf(' | ') > -1) {
			title = title.split(' | ')[0];
		}
		return title;
	}

	setAdvancedFilterColumns() { }

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	search() {
		if ((this.input?.nativeElement?.value || '').trim().length > 0) {
			setTimeout(async () => {
				const fields = this.prepareFields();
				// this.tableLoading = true;
				let index: number | undefined;
				// if (this.paginator) index = this.paginator.pageIndex + 1;
				if (this.paginator) index = 1;
				this.paginator.pageIndex = 1;
				const data = await this.getDataFromSource(
					index,
					this.paginator?.pageSize,
					fields
				)
					.pipe(first())
					.toPromise();
				this.prepareDataAndColumns(data);
				// this.tableLoading = false;
			});
		}
	}

	_handleKeydown(event: KeyboardEvent) {
		// Prevent propagation for all alphanumeric characters in order to avoid selection-proccess issues
		if (
			event.key !== undefined &&
			(event.code === 'Space' || event.code === 'Home' || event.code === 'end')
		) {
			event.stopPropagation();
		}

		if (event.key && event.code === 'Enter') {
			this.doSearch = true;
			this.search();
		}

		if (event.code === 'Escape' && this.searchQuery) {
			this.searchQuery = '';
			event.stopPropagation();
		}
	}

	_handleKeyup(event: KeyboardEvent) {
		if (event.code === 'Backspace' && this.searchQuery.length === 0) {
			if (this.tempData?.rows?.length && this.tempData?.rows?.length > 0) {
				this.prepareDataAndColumns(this.tempData);
			} else {
				this.search();
			}
		}
	}

	ngAfterViewInit() {
		this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
		// console.log('filtersCopy', this.filtersCopy);
		setTimeout(() => {
			merge(
				this.sort ? this.sort.sortChange : null,
				this.paginator?.page ?? null,
				this.resetDataTable$.pipe(map((val) => val))
			)
				.pipe(
					startWith({}),
					// tap(i => this.tableLoading = true),
					switchMap((i: any) => {
						let fields: FieldRequestInput[] = [];
						if (
							(this.settings.isObject(i) && i.hasOwnProperty('active')) ||
							this.initialSortField ||
							this.input?.nativeElement?.value
						) {
							fields = this.prepareFields();
						}
						let index: number | undefined;

						if (this.paginator) index = this.paginator.pageIndex + 1;

						if (!this.isFirstTimeCalled && typeof i == 'boolean' && !i) {
							return of(null);
						} else {
							return this.getDataFromSource(
								index,
								this.paginator?.pageSize,
								fields
							);
						}
					})
				)
				.subscribe((data: any) => {
					const fields = this.prepareFields();
					if (fields?.length > 0) {
						data = {
							...data,
							fields,
						};
					}
					this.tableLoading = false;
					this.loadingData.emit(this.tableLoading);
					if (data) {
						this.prepareDataAndColumns(data);
					}
				});
		});
	}

	prepareTableColumns() {
		let actions = this.tableConfigurations?.actionIcons;
		if (this.actionButtons?.length > 0) {
			actions = {
				...actions,
				...this.actionButtons.reduce(
					(a, v) => ({ ...a, [v.action]: true }),
					{}
				),
			};
		}
		const trueKeys = Object.keys(actions).filter(
			(key) =>
				actions[key] &&
				(!this.permissions[key] ||
					this.authService.hasPermission(this.permissions[key]))
		);
		let columns: string[];
		if (this.tableConfigurations.showNumbers) {
			columns = [
				'position',
				...this.tableConfigurations.tableColumns.map((column) => column.name),
			];
		} else {
			columns = [
				...this.tableConfigurations.tableColumns.map((column) => column.name),
			];
		}

		if (this.tableConfigurations.actionIcons.checkBox) {
			columns = ['selection', ...columns];
		}

		if (trueKeys.length > 0) {
			this.displayedColumns = [...columns, 'action'];
		} else {
			this.displayedColumns = columns;
		}
		if (this.tableConfigurations.allowPagination && this.dataSource.paginator) {
			this.dataSource.paginator = this.paginator ?? null;
		}
		this.dataSource.sort = this.sort ?? null;
	}

	prepareDataAndColumns(response: DataPage) {
		this.tableLoading = false;
		this.loadingData.emit(this.tableLoading);

		if (!this.doSearch) {
			this.tempData = response;
		} else {
			this.doSearch = false;
		}
		const dataValues = response && response.rows ? response.rows : [];
		const mappedValues = this.mapFunction
			? dataValues.map((i) => this.mapFunction(i))
			: dataValues;
		const idsExists = mappedValues?.every((obj) => 'id' in obj);
		this.propertyToUse = idsExists ? 'id' : 'uuid';
		this.dataSource = new MatTableDataSource(mappedValues);
		if (this.initialDataSelected?.length > 0 && this.selection.hasValue()) {
			const tableSelection = this.settings.removeDuplicates(
				this.selection.selected,
				this.propertyToUse
			);
			this.selection.setSelection(...tableSelection);
			// this.initialDataSelected = (this.initialDataSelected || []).concat(tableSelection.filter(item => (this.initialDataSelected || []).findIndex(i=> i[this.propertyToUse] == item[this.propertyToUse]) === -1));
		}
		this.dataSource.data.forEach((row) => {
			if (
				this.initialDataSelected?.some(
					(item) =>
						item[this.propertyToUse] + '' === row[this.propertyToUse] + ''
				)
			) {
				this.selection.select(row);
			}
		});

		this.totalRecords.emit(response?.totalRecords);
		this.getData.emit(mappedValues);
		this.resultLength = this.searchQuery
			? response?.recordsFilteredCount || response?.totalRecords
			: response?.totalRecords;
		this.loading = false;
	}

	prepareFields(): FieldRequestInput[] {
		let fields: FieldRequestInput[] = [];

		if (this.input?.nativeElement.value) {
			this.tableConfigurations.tableColumns.forEach((column) => {
				let value: any = {
					fieldName: column.name,
					isSearchable: true,
					operation: 'LK',
					searchValue: this.input?.nativeElement.value,
				};

				if (this.initialSortField) {
					if (this.initialSortField.key === column.name) {
						value = {
							...value,
							isSortable: true,
							orderDirection: this.initialSortField.sortOrder,
						};
					}
				}
				if (this.sort?.active == column.name && this.sort.direction) {
					console.log('sort', this.sort);
					value = {
						...value,
						isSortable: true,
						orderDirection: this.sort.direction.toUpperCase(),
					};
				} else {
					if (
						this.initialSortField &&
						this.initialSortField.key !== column.name
					) {
						if (value.hasOwnProperty('isSortable')) {
							delete value.isSortable;
						}
						if (value.hasOwnProperty('orderDirection')) {
							delete value.orderDirection;
						}
					}
				}
				if (this.noSearchFields.indexOf(value.fieldName) === -1) {
					fields.push(value);
				}
			});
		} else {
			// if user is not search. use initial sort fields if available
			if (this.initialSortField) {
				fields.push({
					fieldName: this.initialSortField.key,
					isSortable: true,
					orderDirection: this.initialSortField.sortOrder,
				});
			}
		}

		this.customSearchFields.map((d) => {
			const customFields: FieldRequestInput = {
				fieldName: d,
				isSearchable: true,
				operation: 'LK',
				searchValue: this.input?.nativeElement.value,
			};
			fields.push(customFields);
		});

		return fields;
	}

	// Method to get data
	getDataFromSource = (
		page?: number,
		pageSize?: number,
		fields?: FieldRequestInput[]
	): Observable<DataPage> => {
		if (this.customSearchFilters?.length > 0) {
			const filteredFields = fields.filter(
				(field) =>
					!this.customSearchFilters.some(
						(customFilter) => customFilter.fieldName === field.fieldName
					)
			);
			fields = [...this.customSearchFilters, ...filteredFields];
		}

		fields = [...fields, ...this.advancedSearchSearchFilters];

		if (!this.isFirstTimeCalled) this.isFirstTimeCalled = true;
		this.tableLoading = true;
		this.loadingData.emit(this.tableLoading);

		return this.paginatedDataService
			.getDataFromSource({
				page,
				pageSize,
				fields,
				additionalVariables: this.additionalVariables,
				customMainFilters: this.customMainFilters,
				mustHaveFilters: this.filters,
				query: this.query,
				apolloNamespace: this.apolloNamespace(),
			})
			.pipe(
				map((response) => {
					this.tableLoading = false;
					this.loadingData.emit(this.tableLoading);

					return response;
				})
			);
	};

	viewItemDetails(item: any) {
		if (this.tableConfigurations.useFullObject) {
			this.rowPreview.emit(item);
		} else {
			this.rowPreview.emit(item[this.propertyToUse]);
		}
	}

	editItem(item: any) {
		if (this.tableConfigurations.useFullObject) {
			this.rowUpdate.emit(item);
		} else {
			this.rowUpdate.emit(item[this.propertyToUse]);
		}
	}

	printItem(itemId: any) {
		this.rowPrint.emit(itemId);
	}

	deleteItem(item: any) {
		if (this.tableConfigurations.useFullObject) {
			this.rowDelete.emit(item);
		} else {
			this.rowDelete.emit(item[this.propertyToUse]);
		}
	}

	customPrimaryItem(item: any) {
		if (this.tableConfigurations.useFullObject) {
			this.rowCustomPrimary.emit(item);
		} else {
			this.rowCustomPrimary.emit(item[this.propertyToUse]);
		}
	}

	rowCheckBoxItem($event) {
		if (this.tableConfigurations.useFullObject) {
			if ($event && !Array.isArray($event)) {
				const itemIndex = this.selectedItemsTracker.findIndex(
					(d) => d[this.propertyToUse] + '' === $event[this.propertyToUse] + ''
				);
				this.selectedCheckboxTracker[$event[this.propertyToUse]] =
					$event.isChecked;
				this.selectedCheckboxTrackerItems[$event[this.propertyToUse]] = $event;
				if (itemIndex === -1) {
					this.selectedItemsTracker.push($event);
				} else {
					this.selectedItemsTracker[itemIndex] = $event;
				}
			} else if (Array.isArray($event)) {
				$event.forEach((d) => {
					d.isChecked = this.selectedCheckboxTracker[d[this.propertyToUse]];
					const itemIndex = this.selectedItemsTracker.findIndex(
						(f) => d[this.propertyToUse] + '' === f[this.propertyToUse] + ''
					);
					if (itemIndex === -1) {
						this.selectedItemsTracker.push(d);
					} else {
						this.selectedItemsTracker[itemIndex] = d;
					}
				});
			}

			const propertyExistsInAllObjects = this.selectedItemsTracker
				.filter((j) => j.isChecked)
				.every((obj) => 'id' in obj);
			let selectedItems = [];

			if (propertyExistsInAllObjects) {
				selectedItems = this.settings.removeDuplicates(
					this.selectedItemsTracker.filter((j) => j.isChecked),
					'id'
				);
			} else {
				selectedItems = this.settings.removeDuplicates(
					this.selectedItemsTracker.filter((j) => j.isChecked),
					'uuid'
				);
			}

			this.initialDataSelected = selectedItems
				.filter((j) => j.isChecked)
				.map((j) => j[this.propertyToUse]);
			this.rowCheckBox.emit({ selectedItems, item: $event });
		} else {
			this.rowCheckBox.emit({
				selectedItems: this.initialDataSelected,
				item: $event,
			});
		}
	}

	downloadItem(item: any) {
		this.rowDownload.emit(item);
	}

	trackByFn(index: any, item: any) {
		return item ? item[this.propertyToUse] : undefined;
	}

	submitCustomButtom(button: ActionButton, item: any, step: string) {
		const action = button.action;
		this.showButtonConfirm = {};
		if (step === 'first' && button.confirm_first) {
			this.showButtonConfirm[
				button[this.propertyToUse] + item[this.propertyToUse]
			] = true;
		} else {
			if (this.tableConfigurations.useFullObject) {
				this.customAction.emit({ action, value: item });
			} else {
				this.customAction.emit({ action, value: item[this.propertyToUse] });
			}
		}
	}

	async downloadToCsv() {
		this.loadingExportData = true;
		this.exportMapFunctionProgressMessage =
			'Processing exported data (0%): Waiting for data fetch to finis...';
		this.exportMapFunctionBeingProcessedProgress = 0;
		this.itemIndexOfExportMapFunctionBeingProcessed = 0;
		let values = await this.paginatedDataService.getAllDataOld({
			query: this.query,
			apolloNamespace: this.apolloNamespace(),
			mustHaveFilters: this.filters,
			additionalVariables: this.additionalVariables,
		});

		console.log("values :", values);
		let continueExport = true;
		let finalValues = [];

		if (this.exportMapFunction) {
			this.exportMapFunctionProgressMessage =
				'Processing exported data (0%): Initializing...';
			for (let i = 0; i < values.length; i++) {
				try {
					this.exportMapFunctionProgressMessage = `Processing exported data (${this.exportMapFunctionBeingProcessedProgress
						}%): Processing item ${i + 1} of ${values.length}`;
					const item = values[i];
					const data = await this.exportMapFunction(item);
					this.updateExportMapFunctionProgress();
					finalValues.push(data);
				} catch (e) {
					this.notificationService.showErrorDialog({
						message: 'Failed to process data for export',
					});
					console.log('error processing ', values[i], e);
					continueExport = false;
				}
			}
		} else {
			finalValues = values;
		}

		if (continueExport) {
			let tableColumns = [];

			if (this.tableConfigurations.exportColumns?.length > 0) {
				tableColumns = this.tableConfigurations.exportColumns;
			} else {
				tableColumns = this.tableConfigurations.tableColumns;
			}

			const data = finalValues?.map((item) => {
				const object: any = {};
				for (const col of tableColumns) {
					object[col.name] = item[col.name] ? item[col.name] : '';
				}
				return object;
			});
			//bold the headers
			const header = {};
			tableColumns.forEach((col) => {
				header[col.name] = col.displayName;
			});
			data.unshift(header);
			this.downloadWithFileName(data);
		}
	}

	downloadWithFileName(data: any) {
		// console.log('this.excelFilename,', this.excelFilename);
		this.notificationService.showSimpleInput(
			{
				title: 'Enter file name',
				inputLabel: 'File Name',
				onConfirm: (fileName) => {
					fileName = fileName
						.replace(/\s+/g, ' ')
						.replace(/[^a-zA-Z0-9 ]/g, '_');
					if (fileName) {
						this.excelFilename = fileName;
						const wb = XLSX.utils.book_new();
						const ws = XLSX.utils.json_to_sheet(data);
						XLSX.utils.book_append_sheet(wb, ws, this.excelFilename);
						XLSX.writeFile(wb, `${this.excelFilename}.xlsx`);

						this.loadingExportData = false;
					} else {
						this.notificationService.showErrorDialog({
							message: 'Please enter a file name',
						});
					}
				},
				confirmButtonText: 'Save',
				cancelButtonText: 'Cancel',
				inputType: 'text',
				inputValue: this.excelFilename,
			},
			'400px'
		);
	}

	updateExportMapFunctionProgress() {
		this.itemIndexOfExportMapFunctionBeingProcessed++;
		this.exportMapFunctionBeingProcessedProgress = Math.round(
			(this.itemIndexOfExportMapFunctionBeingProcessed /
				this.totalRecordSignal()) *
			100
		);
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		this.selection.selected.forEach((f) => {
			f.isChecked = true;
			this.selectedCheckboxTracker[f[this.propertyToUse]] = f.isChecked;
			this.selectedCheckboxTrackerItems[f[this.propertyToUse]] = f;
		});
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	onSelectAll($event) {
		if ($event.checked) {
			this.selection.clear();
			this.dataSource.data.forEach((row) => {
				row.isChecked = true;
				this.selectedCheckboxTracker[row[this.propertyToUse]] = row.isChecked;
				this.rowCheckBoxItem(row);
				return this.selection.select(row);
			});
		} else {
			this.selection.clear();
			this.dataSource.data.forEach((row) => {
				row.isChecked = false;
				this.selectedCheckboxTracker[row[this.propertyToUse]] = row.isChecked;
				this.rowCheckBoxItem(row);
				return this.selection.deselect(row);
			});
		}
	}

	onCheckboxClick($event, tableListItem) {
		if ($event.checked) {
			this.selection.select(tableListItem);
		} else {
			this.selection.deselect(tableListItem);
		}
		tableListItem.isChecked = this.selection.isSelected(tableListItem);
		//

		this.rowCheckBoxItem(tableListItem);
	}

	onRowClick(tableListItem) {
		if (this.tableConfigurations?.useRowClick) {
			if (this.tableConfigurations?.actionIcons?.checkBox) {
				let isChecked = this.selection.isSelected(tableListItem);
				if (!isChecked) {
					this.selection.select(tableListItem);
				} else {
					this.selection.deselect(tableListItem);
				}
				tableListItem.isChecked = this.selection.isSelected(tableListItem);
				this.rowCheckBoxItem(tableListItem);
			}
		}
	}

	/** Selects all rows if they are not all selected; otherwise clear selection-proccess. */
	// masterToggle() {
	//   this.isAllSelected() ?
	//     this.selection-proccess.clear() :
	//     this.dataSource.data.forEach(row => {
	//       row.isChecked = this.selection-proccess.isSelected(row);
	//       // this.selectedCheckboxTracker[row[this.propertyToUse]] = row.isChecked;
	//       return this.selection-proccess.select(row);
	//     });
	// }

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		} else {
			row.isChecked = this.selection.isSelected(row);
			this.selectedCheckboxTracker[row[this.propertyToUse]] = row.isChecked;
			this.selectedCheckboxTrackerItems[row[this.propertyToUse]] = row;
			return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
				}`;
		}
	}

	tdClick(column: TableColumn, value: any) {
		if (column.link) {
			//
			//
		}
	}

	rowCLicked() {
		//
	}

	onChangePage($event) {
		//
	}
	onAdvancedFilterChange = (filter: ReportFilter, index: number) => {
		this.setAdvancedSearchFilters(filter);
	};

	setAdvancedSearchFilters(filter: ReportFilter) {
		this.advancedSearchMustHaveFilters =
			this.advancedSearchMustHaveFilters.filter(
				(item) => item.fieldName != filter.column.columnName
			);

		this.advancedSearchSearchFilters = this.advancedSearchSearchFilters.filter(
			(item) => item.fieldName != filter.column.columnName
		);

		if (
			filter.operation != SearchOperation.LK &&
			filter.operation != SearchOperation.ILK
		) {
			if (filter.value1 || filter.value2 || filter?.inValues?.length > 0) {
				let advancedSearchMustHaveFilter: MustHaveFilter = {
					operation: filter.operation,
					fieldName: filter.column.columnName,
				};

				if (filter.value1 != null) {
					if (filter.column.dataType == 'NUMBER') {
						filter.value1 = String(filter.value1);
					}
					advancedSearchMustHaveFilter = {
						...advancedSearchMustHaveFilter,
						value1: filter.value1,
					};
				}

				if (filter.value2 != null) {
					if (filter.column.dataType == 'NUMBER') {
						filter.value2 = String(filter.value2);
					}
					advancedSearchMustHaveFilter = {
						...advancedSearchMustHaveFilter,
						value2: filter.value2,
					};
				}

				if (filter.inValues != null) {
					advancedSearchMustHaveFilter = {
						...advancedSearchMustHaveFilter,
						inValues: filter.inValues,
					};
				}

				this.advancedSearchMustHaveFilters.push(advancedSearchMustHaveFilter);
			}

			console.log(
				'this.advancedSearchMustHaveFilters',
				this.advancedSearchMustHaveFilters
			);
		} else {
			if (filter.value1) {
				let advancedSearchSearchFilter: FieldRequestInput = {
					fieldName: filter.column.columnName,
					isSearchable: true,
					operation: filter.operation,
					searchValue: filter.value1,
				};

				this.advancedSearchSearchFilters.push(advancedSearchSearchFilter);
			}
			console.log(
				'this.advancedSearchSearchFilters',
				this.advancedSearchSearchFilters
			);
		}
	}

	getAdvancedSearchResults = () => {
		this.filters = [...this.filtersCopy, ...this.advancedSearchMustHaveFilters];

		console.log('this.filters', this.filters);

		setTimeout(async () => {
			const fields = this.prepareFields();
			let index: number | undefined;
			if (this.paginator) index = 1;
			this.paginator.pageIndex = 1;
			const data = await this.getDataFromSource(
				index,
				this.paginator?.pageSize,
				fields
			)
				.pipe(first())
				.toPromise();
			this.prepareDataAndColumns(data);
		});
	};

	toggleAdvancedSearch(toggle: boolean) {
		this.showAdvancedSearch = toggle;
		if (!this.showAdvancedSearch) {
			this.advancedSearchMustHaveFilters = [];
			this.filters = [...this.filtersCopy];
		}
	}
}
