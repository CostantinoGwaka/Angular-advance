import { DocumentNode } from '@apollo/client/core';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  ContentChild,
  TemplateRef,
  Signal,
  inject,
  input,
  effect,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  fadeSmooth,
  fadeIn,
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../animations/router-animation';
import { UntypedFormControl, FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { merge, Observable, of, Subject } from 'rxjs';
import {
  switchMap,
  startWith,
  map,
  first,
  mapTo,
  catchError,
} from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { SettingsService } from '../../../services/settings.service';
import { GraphqlService } from '../../../services/graphql.service';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../services/storage.service';
import { NotificationService } from '../../../services/notification.service';
import { MustHaveFilter } from '../paginated-data-table/must-have-filters.model';
import {
  TableColumn,
  TableConfiguration,
} from '../paginated-data-table/paginated-table-configuration.model';
import { ActionButton } from '../paginated-data-table/action-button.model';
import {
  DataPage,
  DataRequestInput,
} from '../paginated-data-table/data-page.model';
import { FieldRequestInput } from '../paginated-data-table/field-request-input.model';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ShowOtherButtonsPipe } from '../full-data-table/show-other-buttons.pipe';
import { ShowButtonPipe } from '../full-data-table/show-button.pipe';
import { SafeDatePipe } from '../../pipes/safe-date.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, NgStyle, NgTemplateOutlet, UpperCasePipe, LowerCasePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { PaginatedDataService } from '../../../services/paginated-data.service';
import { SignalsStoreService } from '../../../services/signals-store.service';
@Component({
  selector: 'app-paginated-table-expandable-row',
  templateUrl: './paginated-table-expandable-row.component.html',
  styleUrls: ['./paginated-table-expandable-row.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    fadeSmooth,
    fadeIn,
  ],
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
    MatTooltipModule,
    NgStyle,
    MatCheckboxModule,
    HasPermissionDirective,
    MatMenuModule,
    MatProgressBarModule,
    NgTemplateOutlet,
    MatPaginatorModule,
    UpperCasePipe,
    LowerCasePipe,
    DecimalPipe,
    TitleCasePipe,
    ReplacePipe,
    SafeDatePipe,
    ShowButtonPipe,
    ShowOtherButtonsPipe,
    TranslatePipe
],
})
export class PaginatedTableExpandableRowComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  expandedElement: any;
  isExpanded = {};
  @ContentChild(TemplateRef, { static: true }) expandedRow: TemplateRef<any>;

  /** Table Inputs */
  @Input() tableList = [];
  @Input() query: any;
  @Input() useCheckBox: boolean = false;
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
  @Input() filters?: MustHaveFilter[];
  @Input() permissions: any = {};
  @Input() customMainFilters: any = {};
  @Input() noSearchFields: string[] = [];
  @Input() customSearchFields: string[] = [];
  @Input() initialDataSelected: any[] = [];
  @Input() initialSortField?: { key: string; sortOrder: 'ASC' | 'DESC' };
  @Input() additionalVariables?: { [id: string]: any };
  @Input() tableConfigurations: TableConfiguration = {
    tableColumns: [],
    tableCaption: '',
    allowPagination: true,
    tableNotifications: null,
    actionIcons: {
      edit: false,
      delete: false,
      more: false,
      customPrimary: false,
      checkBox: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    error: {},
    loading: {},
    showSearch: true,
    showBorder: true,
    showNumbers: false,
    empty_msg: 'No Data',
    customPrimaryMessage: '',
    useFullObject: false,
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

  // list of all the added buttons that you want to deal with separately
  @Input() actionButtons: ActionButton[] = [];
  @Output() getData = new EventEmitter();
  @Output() expadendRow = new EventEmitter<any>();


  @Input() excelFilename = 'download';
  rowToExpand = input<any>();
  @Output() onCheckbox: EventEmitter<any> = new EventEmitter();


  private resetDataTable$: Subject<void> = new Subject<void>();

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
  selectedItemsTracker: any[] = [];
  selectedCheckboxTracker: { [key: string]: any } = {};
  selectedCheckboxTrackerItems = {};

  cancelGetData: Signal<boolean>;
  mainLoaderProgress: Signal<number>;
  totalRecordSignal: Signal<number>;
  totalPages: Signal<number>;
  totalBatches: Signal<number>;
  paginatedPerBatches: Signal<number>;

  signalsStoreService = inject(SignalsStoreService);

  constructor(
    private graphService: GraphqlService,
    private httpClient: HttpClient,
    private encryptDecryptService: StorageService,
    private settings: SettingsService,
    private paginatedDataService: PaginatedDataService,
    private notificationService: NotificationService
  ) {
    effect(() => {

      if (this.rowToExpand()) {
        this.toggleExpansion(this.rowToExpand())
      }
    });

    this.setDownloadSignals();
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
  }

  setDownloadSignals() {
    this.signalsStoreService.set('paginatedDataProgress', undefined);
    this.signalsStoreService.set('paginatedTotalRecords', undefined);
    this.signalsStoreService.set('paginatedBatches', undefined);
    this.signalsStoreService.set('paginatedPages', undefined);
    this.signalsStoreService.set('paginatedPerBatches', undefined);
    this.signalsStoreService.set('cancelGetData', undefined);

    this.mainLoaderProgress = this.signalsStoreService.select(
      'paginatedDataProgress'
    );

    this.cancelGetData = this.signalsStoreService.select('cancelGetData');

    this.totalRecordSignal = this.signalsStoreService.select(
      'paginatedTotalRecords'
    );
    this.totalBatches = this.signalsStoreService.select('paginatedBatches');
    this.totalPages = this.signalsStoreService.select('paginatedPages');
    this.paginatedPerBatches = this.signalsStoreService.select(
      'paginatedPerBatches'
    );
  }

  ngOnChanges(): void {
    if (this.resetTable || this.filters != null) {
      this.resetDataTable$.next();
      this.showDelete = {};
    }
    if (this.tableConfigurations.actionIcons.checkBox) {
    }
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;

    this.prepareTableColumns();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  search() {
    setTimeout(async () => {
      const fields = this.prepareFields();
      // this.tableLoading = true;
      let index: number | undefined;
      if (this.paginator) index = this.paginator.pageIndex + 1;
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
    setTimeout(() => {
      merge(
        this.sort ? this.sort.sortChange : null,
        this.paginator?.page ?? null,
        this.resetDataTable$.pipe(mapTo(true))
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
            return this.getDataFromSource(
              index,
              this.paginator?.pageSize,
              fields
            );
          })
        )
        .subscribe((i: any) => this.prepareDataAndColumns(i));
    });
  }

  prepareTableColumns() {
    const { edit, print, more, cancel, download, customPrimary, checkBox } =
      this.tableConfigurations.actionIcons;
    let columns: string[];
    // if (this.tableConfigurations.showNumbers) {
    //   columns = [
    //     'position',
    //     ...this.tableConfigurations.tableColumns.map(column => column.name)
    //   ];
    // } else {
    columns = [
      'position',
      ...this.tableConfigurations.tableColumns.map((column) => column.name),
    ];
    // }
    if (
      edit ||
      print ||
      download ||
      more ||
      cancel ||
      customPrimary ||
      checkBox ||
      this.tableConfigurations.actionIcons.delete ||
      this.actionButtons.length > 0
    ) {
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
    let dataValues = response && response.rows ? response.rows : [];
    dataValues = dataValues?.map((res, index) => {
      this.isExpanded = { ...this.isExpanded, [index]: false };
      return { ...res, appTableId: index };
    });
    this.tableList = dataValues;
    const mappedValues = this.mapFunction
      ? dataValues.map((i) => this.mapFunction(i))
      : dataValues;
    this.dataSource = new MatTableDataSource(mappedValues);
    if (this.selection.hasValue()) {
      const tableSelection = this.settings
        .removeDuplicates(this.selection.selected, 'id')
        .map((item) => item['id']);
      this.initialDataSelected = (this.initialDataSelected || []).concat(
        tableSelection.filter(
          (item) => (this.initialDataSelected || []).indexOf(item['id']) === -1
        )
      );
    }
    this.dataSource.data.forEach((row) => {
      if (
        this.initialDataSelected?.some((item) => item + '' === row['id'] + '')
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
    // this.prepareTableColumns();26300
  }

  cancelExport() {
    this.signalsStoreService.set('cancelGetData', true);
  }

  prepareFields(): FieldRequestInput[] {
    const fields: FieldRequestInput[] = [];
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
      if (this.sort?.active && this.sort.direction) {
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
  getDataFromSource(
    page?: number,
    pageSize?: number,
    fields?: FieldRequestInput[]
  ): Observable<DataPage> {
    try {
      this.tableLoading = true;
      this.loadingData.emit(this.tableLoading);

      let input: DataRequestInput = {
        page: page ?? 0,
        pageSize: pageSize ?? 0,
        fields: fields ?? [],
      };
      if (this.filters) {
        input = { ...input, mustHaveFilters: this.filters };
      }
      if (
        this.customMainFilters &&
        Object.keys(this.customMainFilters).length > 0
      ) {
        let newParam = this.customMainFilters;
        if (newParam['input'].fields) {
          // input.page = page ?? newParam.page;
          // input.pageSize = pageSize ?? newParam.pageSize;
          input.fields.push(...newParam['input'].fields);
        }

        if ((newParam.input.mustHaveFilters || []).length) {
          input.mustHaveFilters = newParam.input.mustHaveFilters;
        }

        const variables = this.additionalVariables
          ? { ...this.additionalVariables, input }
          : { input };

        return this.graphService
          .fetchDataObservable(
            {
              query: this.query,
              apolloNamespace: this.apolloNamespace(),
              variables,
            },
            this.fetchPolicy
          )
          .pipe(
            map(({ data, errors }: any) => {
              if (errors) {
                console.error(errors);
                this.notificationService.errorMessage(errors[0]?.message);
              }
              return data ? Object.values(data)[0] : errors;
            }),
            catchError((error) => {
              /// TODO : Handle error add custom message
              this.tableLoading = false;
              this.loadingData.emit(this.tableLoading);

              console.error(error);
              this.notificationService.errorMessage(
                error.message || error[0].message
              );
              return of([]);
            })
          );
      } else {
        let variables = this.additionalVariables
          ? {
            input,
            ...this.additionalVariables,
          }
          : { input };
        variables.input.page = page ?? variables.input.page;
        variables.input.pageSize = pageSize ?? variables.input.pageSize;
        return this.graphService
          .fetchDataObservable(
            {
              query: this.query,
              apolloNamespace: this.apolloNamespace(),
              variables,
            },
            this.fetchPolicy
          )
          .pipe(
            map(({ data, errors }: any) => {
              if (errors) {
                console.error(errors);
                this.notificationService.errorMessage(errors[0]?.message);
              }
              return data ? Object.values(data)[0] : errors;
            }),
            catchError((error) => {
              this.tableLoading = false;
              this.loadingData.emit(this.tableLoading);

              console.error(error);
              this.notificationService.errorMessage(
                error.message || error[0].message
              );
              return of([]);
            })
          );
      }
    } catch (error: any) {
      console.error(error);
      this.tableLoading = false;
      this.loadingData.emit(this.tableLoading);

      this.notificationService.errorMessage(error.message || error[0].message);
      return of();
    }
    // },0);
  }

  viewItemDetails(item: any) {
    if (this.tableConfigurations.useFullObject) {
      this.rowPreview.emit(item);
    } else {
      this.rowPreview.emit(item.id);
    }
  }

  editItem(item: any) {
    if (this.tableConfigurations.useFullObject) {
      this.rowUpdate.emit(item);
    } else {
      this.rowUpdate.emit(item.id);
    }
  }

  printItem(itemId: any) {
    this.rowPrint.emit(itemId);
  }

  deleteItem(item: any) {
    if (this.tableConfigurations.useFullObject) {
      this.rowDelete.emit(item);
    } else {
      this.rowDelete.emit(item.id);
    }
  }

  customPrimaryItem(item: any) {
    if (this.tableConfigurations.useFullObject) {
      this.rowCustomPrimary.emit(item);
    } else {
      this.rowCustomPrimary.emit(item.id);
    }
  }

  rowCheckBoxItem($event) {
    if (this.tableConfigurations.useFullObject) {
      if ($event && !Array.isArray($event)) {
        const itemIndex = this.selectedItemsTracker.findIndex(
          (d) => d.id + '' === $event.id + ''
        );
        this.selectedCheckboxTracker[$event.id] = $event.isChecked;
        this.selectedCheckboxTrackerItems[$event.id] = $event;
        if (itemIndex === -1) {
          this.selectedItemsTracker.push($event);
        } else {
          this.selectedItemsTracker[itemIndex] = $event;
        }
      } else if (Array.isArray($event)) {
        $event.forEach((d) => {
          d.isChecked = this.selectedCheckboxTracker[d.id];
          const itemIndex = this.selectedItemsTracker.findIndex(
            (f) => d.id + '' === f.id + ''
          );
          if (itemIndex === -1) {
            this.selectedItemsTracker.push(d);
          } else {
            this.selectedItemsTracker[itemIndex] = d;
          }
        });
      }
      let selectedItems = this.settings.removeDuplicates(
        this.selectedItemsTracker.filter((j) => j.isChecked),
        'id'
      );
      this.initialDataSelected = selectedItems
        .filter((j) => j.isChecked)
        .map((j) => j.id);
      this.rowCheckBox.emit(selectedItems);
    } else {
      this.rowCheckBox.emit(this.initialDataSelected);
    }
  }

  downloadItem(item: any) {
    this.rowDownload.emit(item);
  }

  trackByFn(index: any, item: any) {
    return item ? item.id : undefined;
  }

  submitCustomButtom(button: ActionButton, item: any, step: string) {
    const action = button.action;
    this.showButtonConfirm = {};
    if (step === 'first' && button.confirm_first) {
      this.showButtonConfirm[button.id + item.id] = true;
    } else {
      if (this.tableConfigurations.useFullObject) {
        this.customAction.emit({ action, value: item });
      } else {
        this.customAction.emit({ action, value: item.id });
      }
    }
  }

  async downloadToCsv() {
    this.signalsStoreService.set('cancelGetData', false);
    this.loadingExportData = true;
    const values = await this.paginatedDataService.getAllDataOld({
      query: this.query,
      mustHaveFilters: this.filters,
      additionalVariables: this.additionalVariables,
      apolloNamespace: this.apolloNamespace(),
    });

    if (this.signalsStoreService.select('cancelGetData')()) {
      return;
    }

    const data = values?.map((item) => {
      const object: any = {};
      for (const col of this.tableConfigurations.tableColumns) {
        object[col.name] = item[col.name] ? item[col.name] : '';
      }
      return object;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.excelFilename}.xlsx`);

    this.loadingExportData = false;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    this.selection.selected.forEach((f) => {
      f.isChecked = true;
      this.selectedCheckboxTracker[f.id] = f.isChecked;
      this.selectedCheckboxTrackerItems[f.id] = f;
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
        this.selectedCheckboxTracker[row.id] = row.isChecked;
        this.rowCheckBoxItem(row);
        return this.selection.select(row);
      });
    } else {
      this.selection.clear();
      this.dataSource.data.forEach((row) => {
        row.isChecked = false;
        this.selectedCheckboxTracker[row.id] = row.isChecked;
        this.rowCheckBoxItem(row);
        return this.selection.deselect(row);
      });
    }
  }

  ngOnDestroy() {
    this.cancelExport();
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

  /** Selects all rows if they are not all selected; otherwise clear selection-proccess. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection-proccess.clear() :
  //     this.dataSource.data.forEach(row => {
  //       row.isChecked = this.selection-proccess.isSelected(row);
  //       // this.selectedCheckboxTracker[row.id] = row.isChecked;
  //       return this.selection-proccess.select(row);
  //     });
  // }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    } else {
      row.isChecked = this.selection.isSelected(row);
      this.selectedCheckboxTracker[row.id] = row.isChecked;
      this.selectedCheckboxTrackerItems[row.id] = row;
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
    }
  }

  rowCLicked() { }

  onChangePage($event) { }

  toggleExpansion(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
    this.tableList.forEach((v, i) => {
      this.isExpanded[i] = false;
    });
    this.isExpanded[row.appTableId] = !!this.expandedElement;

    if (this.isExpanded[row.appTableId]) {
      this.expadendRow.emit(row);
    }
  }
}

