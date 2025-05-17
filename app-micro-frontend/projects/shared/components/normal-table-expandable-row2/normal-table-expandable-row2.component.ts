import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  ContentChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { fadeIn, fadeSmooth } from '../../animations/router-animation';
import { ActionButton } from '../full-data-table/action-button.model';
import {
  TableColumn,
  TableConfiguration,
} from '../paginated-data-table/paginated-table-configuration.model';
import { RemoveUnderScorePipe } from '../../pipes/remove-underscore.pipe';
import { SafeDatePipe } from '../../pipes/safe-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, NgStyle, NgTemplateOutlet, UpperCasePipe, LowerCasePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

/**
 * @title Expandable Table
 */
@Component({
  selector: 'app-normal-table-expandable-row2',
  styleUrls: ['normal-table-expandable-row2.component.scss'],
  templateUrl: 'normal-table-expandable-row2.component.html',
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeIn,
    fadeSmooth,
  ],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    LoaderComponent,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    NgStyle,
    MatButtonModule,
    NgTemplateOutlet,
    MatPaginatorModule,
    UpperCasePipe,
    LowerCasePipe,
    DecimalPipe,
    TitleCasePipe,
    SafeDatePipe,
    RemoveUnderScorePipe
],
})
export class NormalTableExpandableRow2Component implements OnInit, OnChanges {
  @Input() tableList: any[] | null = [];
  @Input() permissions: any = {};
  @Input() expandRow = true;
  @Input() loading = false;
  @Input() loadingMessage: string = '';
  @Input() legends: any[] = [];
  @Input() showLegends = false;

  // list of all the added buttons that you want to deal with separately
  @Input() actionButtons: ActionButton[] = [];
  @Input()
  tableConfigurations: TableConfiguration = {
    tableColumns: [],
    tableCaption: '',
    allowPagination: true,
    allowDataEdition: false,
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
    customPrimaryMessage: 'Expand',
    useFullObject: false,
  };
  @Input() mapFunction?: (item: any) => {} = (item: any) => {
    return {
      ...item,
    };
  };

  /** Table Events */
  @Output() rowCustomPrimary: EventEmitter<any> = new EventEmitter();
  @Output() rowUpdate: EventEmitter<any> = new EventEmitter();
  @Output() rowDownload: EventEmitter<any> = new EventEmitter();
  @Output() rowDelete: EventEmitter<any> = new EventEmitter();
  @Output() rowPreview: EventEmitter<any> = new EventEmitter();
  @Output() rowPrint: EventEmitter<any> = new EventEmitter();
  @Output() expadendRow: EventEmitter<any> = new EventEmitter();
  @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() expandedElement: any;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ContentChild(TemplateRef, { static: true }) expandedRowTpl: TemplateRef<any>;
  propertyToUse = 'id';
  // isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  showDelete = {};
  constructor() {
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
          download: false,
          print: false,
          cancel: false,
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
        customPrimaryMessage: 'Expand',
        useFullObject: false,
      };
    }
  }

  onPage(event: any) {
    this.onPageChange.emit(event);
  }

  ngOnChanges(): void {
    const mappedValues = this.mapFunction
      ? this.tableList?.map((i) => this.mapFunction(i))
      : this.tableList!;
    const idsExists = mappedValues?.every((obj) => 'id' in obj);
    this.propertyToUse = idsExists ? 'id' : 'uuid';
    this.tableList = mappedValues?.map((res, index) => {
      return { ...res, appRowId: res[this.propertyToUse] || res.uuid || index };
    });
    this.dataSource = new MatTableDataSource(this.tableList || []);
    this.dataSource.filterPredicate = (d, s) => {
      const col = this.displayedColumns
        ?.map((item) => d[item])
        .join('')
        .toLowerCase();
      return col.indexOf(s) > -1;
    };
    this.setColumns();
  }

  setColumns() {
    // let actions = this.tableConfigurations.actionIcons;
    // if (this.actionButtons?.length > 0) {
    //   actions = {
    //     ...actions,
    //     ...this.actionButtons.reduce(
    //       (a, v) => ({ ...a, [v.action]: true }),
    //       {}
    //     ),
    //   };
    // }
    // const trueKeys = Object.keys(actions).filter((key) => actions[key]).filter(i => i != 'expandable');

    //

    let colums: string[] = [];
    if (this.tableConfigurations.showNumbers) {
      colums = [
        'position',
        ...this.tableConfigurations.tableColumns.map((column) => column.name),
      ];
    } else {
      colums = [
        ...this.tableConfigurations.tableColumns.map((column) => column.name),
      ];
    }
    // if (trueKeys.length > 0) {
    this.displayedColumns = [...colums, 'actions'];
    // } else {
    // this.displayedColumns = colums;
    // }

    if (this.tableConfigurations.allowPagination) {
      this.dataSource.paginator = this.paginator ?? null;
    }
    setTimeout(() => {
      this.dataSource.sort = this.sort ?? null;
    }, 0);
  }

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

  printItem(itemId: string) {
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

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: any) {
    let filterValue = event.value.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  toggleExpansion(row: any) {
    if (this.expandRow) {
      this.expandedElement =
        this.expandedElement?.appRowId === row.appRowId ? null : row;
      if (this.expandedElement) {
        this.expadendRow.emit(this.expandedElement);
      }
    }
  }

  isDetailRow = (row: any) => row.appRowId === this.expandedElement?.appRowId;
}
