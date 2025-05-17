import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AttachmentService } from '../../../services/attachment.service';
import { fadeIn, fadeSmooth, ROUTE_ANIMATIONS_ELEMENTS } from '../../animations/router-animation';
import { ActionButton } from '../full-data-table/action-button.model';
import { TableConfiguration } from '../paginated-data-table/paginated-table-configuration.model';
import { ShowOtherButtonsPipe } from '../full-data-table/show-other-buttons.pipe';
import { ShowButtonPipe } from '../full-data-table/show-button.pipe';
import { RemoveUnderScorePipe } from '../../pipes/remove-underscore.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import * as XLSX from 'xlsx';
import { LoaderComponent } from '../loader/loader.component';
import { NgClass, NgStyle, NgTemplateOutlet, UpperCasePipe, LowerCasePipe, DecimalPipe, TitleCasePipe, DatePipe } from '@angular/common';
import {SafeDatePipe} from "../../pipes/safe-date.pipe";

@Component({
  selector: 'app-normal-table-expandable-row',
  templateUrl: './normal-table-expandable-row.component.html',
  styleUrls: ['./normal-table-expandable-row.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]), fadeSmooth, fadeIn
  ],
  standalone: true,
  imports: [
    LoaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    FormsModule,
    NgStyle,
    HasPermissionDirective,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    NgTemplateOutlet,
    MatPaginatorModule,
    UpperCasePipe,
    LowerCasePipe,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    RemoveUnderScorePipe,
    ShowButtonPipe,
    ShowOtherButtonsPipe,
    SafeDatePipe
],
})
export class NormalTableExpandableRowComponent implements OnChanges {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  /** Table Inputs */
  @Input() useCheckBox: boolean = false;
  @Input() tableList: any[] | null = [];
  @Input() permissions: any = {};
  @Input() expandRow = true;
  @Input() defaultExpandedElement: any;
  expandedElement: any;
  isExpanded = {};
  @Input()
  tableConfigurations: TableConfiguration = {
    tableColumns: [],
    tableCaption: '',
    allowPagination: true,
    allowDataEdition: false,
    allowCheckbox: false,
    tableNotifications: null,
    actionIcons: {
      edit: false,
      delete: false,
      more: false,
      customPrimary: false,
      expandable: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    error: {},
    loading: {},
    showSearch: true,
    showBorder: false,
    showNumbers: false,
    empty_msg: 'No Data',
    customPrimaryMessage: '',
    useFullObject: false,
  };
  @Input() loading = false;
  @Input()
  searchFieldControl: FormControl;
  edit: string = '';

  @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();

  /** Table Events */
  @Output() rowCustomPrimary: EventEmitter<any> = new EventEmitter();
  @Output() rowUpdate: EventEmitter<any> = new EventEmitter();
  @Output() rowDownload: EventEmitter<any> = new EventEmitter();
  @Output() rowDelete: EventEmitter<any> = new EventEmitter();
  @Output() rowPreview: EventEmitter<any> = new EventEmitter();
  @Output() rowPrint: EventEmitter<any> = new EventEmitter();
  @ContentChild(TemplateRef, { static: true }) expandedRow: TemplateRef<any>;

  @Output() customAction: EventEmitter<any> = new EventEmitter();
  @Output() expadendRow: EventEmitter<any> = new EventEmitter();

  @Output() onCheckbox: EventEmitter<any> = new EventEmitter();

  @Input() loadingMessage: string = '';

  @Input() excelFilename: string = 'download';

  @Input() legends: any[] = [];

  @Input() showLegends = false;

  // list of all the added buttons that you want to deal with separately
  @Input() actionButtons: ActionButton[] = [];

  /** list of fields that are searchable */
  searchFields: string = '';
  showDelete: any = {};
  showDownload: any = {};

  checking: any = {};
  allChecked: boolean = false;
  loadingExportData: boolean = false;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  showButtonConfirm: any = {};
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  csvData!: any[];
  dummyItems = [];
  propertyToUse = 'id';
  @Input() mapFunction?: (item: any) => {} = (item: any) => {
    return {
      ...item,
    };
  };

  constructor(
    private attachmentService: AttachmentService
  ) {
    this.searchFieldControl = new FormControl('');
    // this.searchFieldControl.valueChanges.subscribe(v =>
    if (this.tableConfigurations) {
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
      this.tableConfigurations.actionIcons = this.tableConfigurations
        .actionIcons
        ? this.tableConfigurations.actionIcons
        : {
            edit: false,
            delete: false,
            download: false,
            more: false,
            print: false,
            cancel: false,
            expandable: false,
            customPrimary: false,
          };
      this.tableConfigurations.active = this.tableConfigurations.active
        ? this.tableConfigurations.active
        : {};
    } else {
      this.tableConfigurations = {
        tableColumns: [],
        tableCaption: '',
        allowPagination: true,
        allowDataEdition: false,
        tableNotifications: null,
        actionIcons: {
          edit: false,
          delete: false,
          more: false,
          expandable: false,
          customPrimary: false,
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
      this.tableConfigurations.showSearch = true;
      this.tableConfigurations.allowPagination = true;
      this.tableConfigurations.showBorder = false;
      this.tableConfigurations.actionIcons = {
        edit: false,
        delete: false,
        more: false,
        download: false,
        print: false,
        cancel: false,
        expandable: false,
        customPrimary: false,
      };
    }
  }

  ngOnInit() {}

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPage(event: any) {
    this.onPageChange.emit(event);
  }

  ngOnChanges(changes: SimpleChanges) {

    const mappedValues = this.mapFunction ? this.tableList?.map(i => this.mapFunction(i)) : this.tableList!;
    const idsExists = mappedValues?.every(obj => 'id' in obj);
    this.propertyToUse = idsExists ? 'id' : 'uuid';
    this.tableList = mappedValues?.map((res, index) => {
      this.isExpanded = { ... this.isExpanded, [index]: false }
      return { ...res, appRowId: index };
    });
    // this.dataSource = new MatTableDataSource(mappedValues);
    this.dataSource = new MatTableDataSource(this.tableList);
    const edit = this.tableConfigurations.actionIcons?.edit ?? false;
    const print = this.tableConfigurations.actionIcons?.print ?? false;
    const more = this.tableConfigurations.actionIcons?.more ?? false;
    const cancel = this.tableConfigurations.actionIcons?.cancel ?? false;
    const download = this.tableConfigurations.actionIcons?.download ?? false;
    const customPrimary = this.tableConfigurations.actionIcons?.customPrimary ?? false;

    let colums = [];
    if (this.tableConfigurations.showNumbers || this.expandRow) {
      colums = [
        'position',
        ...this.tableConfigurations.tableColumns.map((column) => column.name),
      ];
    } else {
      colums = [
        ...this.tableConfigurations.tableColumns.map((column) => column.name),
      ];
    }
    if (
      edit ||
      print ||
      download ||
      more ||
      cancel ||
      customPrimary ||
      this.tableConfigurations.actionIcons.delete ||
      this.actionButtons.length > 0
    ) {
      this.displayedColumns = [...colums, 'actions'];
    } else {
      this.displayedColumns = colums;
    }
    if (this.tableConfigurations.allowPagination) {
      this.dataSource.paginator = this.paginator;
    }

    this.displayedColumns = this.tableConfigurations.allowCheckbox == true ? [...this.displayedColumns, 'checkAction'] : [...this.displayedColumns];
    this.dataSource.sort = this.sort;

    if (changes['defaultExpandedElement']) {
      if (changes['defaultExpandedElement'].currentValue && !changes['defaultExpandedElement'].firstChange) {

        this.toggleExpansion(changes['defaultExpandedElement'].currentValue);
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  viewItemDetails(item: any) {
    if (this.tableConfigurations.useFullObject) {
      this.rowPreview.emit(item);
    } else {
      this.rowPreview.emit(item[this.propertyToUse]);
    }
  }

  checkAll() {
    this.allChecked = !this.allChecked;
    if (this.allChecked) {
      this.tableList.forEach((tableItem: any) => {
        this.checking[tableItem.uuid] = true;
      });
    } else {
      this.tableList.forEach((tableItem: any) => {
        this.checking[tableItem.uuid] = false;
      });
    }
    this.onCheckbox.emit(this.checking);
  }
  checkIndividual(tableListItem: any) {
    this.checking[tableListItem.uuid] = !this.checking[tableListItem.uuid];
    this.onCheckbox.emit(this.checking);
  }

  getRecord(column: any, item: any) {
    this.edit = column;
  }

  onSave(element: any) {
    this.edit = '';
    //
  }

  arrayOne(n: number): any[] {
    return Array(n);
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
      this.showDelete = {};
    } else {
      this.rowDelete.emit(item[this.propertyToUse]);
      this.showDelete = {};
    }
  }

  customPrimaryItem(item: any) {
    if (this.tableConfigurations.useFullObject) {
      this.rowCustomPrimary.emit(item);
    } else {
      this.rowCustomPrimary.emit(item[this.propertyToUse]);
    }
  }

  downloadItem(item: any) {
    this.rowDownload.emit(item);
  }

  trackByFn(index: any, item: any) {
    return item ? item[this.propertyToUse] : undefined;
  }

  submitCustomButtom(button: ActionButton, item: any, step: any) {
    const action = button.action;
    this.showButtonConfirm = {};
    if (step === 'first' && button.confirm_first) {
      this.showButtonConfirm[button[this.propertyToUse] + item[this.propertyToUse]] = true;
    } else {
      if (this.tableConfigurations.useFullObject) {
        this.customAction.emit({ action, value: item });
      } else {
        this.customAction.emit({ action, value: item[this.propertyToUse] });
      }
    }
  }

  downloadToCsv() {
    this.loadingExportData = true;

    this.csvData = this.tableList?.map(item => {
      const object: any = {};
      for (const col of this.tableConfigurations.tableColumns) {
        object[col.name] = item[col.name] ? item[col.name] : '';
      }
      return object;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.csvData);
    XLSX.utils.book_append_sheet(wb, ws, this.excelFilename);
    XLSX.writeFile(wb, `${this.excelFilename}.xlsx`);

    this.loadingExportData = false;
  }

  toggleExpansion(row: any) {
    if (this.expandRow) {
      this.expandedElement = this.expandedElement === row ? null : row;
      this.tableList.forEach((v, i) => {
        this.isExpanded[i] = false;
      })
      this.isExpanded[row.appRowId] = !!this.expandedElement;
      if (this.isExpanded[row.appRowId]) {
        this.expadendRow.emit(row);
      }
    }
  }

  isDetailRow = (row: any) => row.appRowId === this.expandedElement?.appRowId;

}
