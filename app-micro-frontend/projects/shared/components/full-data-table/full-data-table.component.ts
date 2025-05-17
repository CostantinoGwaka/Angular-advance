import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FormControl, FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActionButton } from './action-button.model';
import {
  fadeIn,
  fadeSmooth,
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../animations/router-animation';
import { TableConfiguration } from '../paginated-data-table/paginated-table-configuration.model';
import { SettingsService } from '../../../services/settings.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from '../../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ShowOtherButtonsPipe } from './show-other-buttons.pipe';
import { ShowButtonPipe } from './show-button.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import * as XLSX from 'xlsx';
import { MatMenuModule } from '@angular/material/menu';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, NgStyle, UpperCasePipe, LowerCasePipe, DecimalPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { SafeDatePipe } from '../../pipes/safe-date.pipe';

@Component({
  selector: 'app-full-data-table',
  templateUrl: './full-data-table.component.html',
  styleUrls: ['./full-data-table.component.scss'],
  animations: [fadeSmooth, fadeIn],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    HasPermissionDirective,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    LoaderComponent,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FormsModule,
    NgStyle,
    MatProgressBarModule,
    MatPaginatorModule,
    UpperCasePipe,
    LowerCasePipe,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    ReplacePipe,
    ShowButtonPipe,
    ShowOtherButtonsPipe,
    TranslatePipe,
    SafeDatePipe
],
})
export class FullDataTableComponent
  implements OnInit, OnChanges, AfterViewInit
{
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  /** Table Inputs */
  @Input()
  tableList: any[] | null = [];
  @Input()
  permissions: any = {};
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
      checkBox: false,
    },
    doneLoading: false,
    deleting: {},
    hideExport: true,
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
  @Input()
  initialDataSelected: any[] = [];

  @Input()
  loading: boolean | null = false;
  @Input()
  searchFieldControl: FormControl;
  edit: string = '';
  propertyToUse = 'id';

  /** Table Events */
  @Output()
  rowCheckBox: EventEmitter<any> = new EventEmitter();
  @Output()
  rowCustomPrimary: EventEmitter<any> = new EventEmitter();
  @Output()
  rowUpdate: EventEmitter<any> = new EventEmitter();
  @Output()
  rowDownload: EventEmitter<any> = new EventEmitter();
  @Output()
  rowDelete: EventEmitter<any> = new EventEmitter();
  @Output()
  rowPreview: EventEmitter<any> = new EventEmitter();
  @Output()
  rowPrint: EventEmitter<any> = new EventEmitter();

  @Output()
  customAction: EventEmitter<any> = new EventEmitter();

  @Input()
  loadingMessage: string = '';

  @Input() legends: any[] = [];

  @Input() showLegends = false;

  // list of all the added buttons that you want to deal with separately
  @Input() actionButtons: ActionButton[] = [];

  /** list of fields that are searchable */
  searchFields: string = '';
  showDelete: any = {};
  showDownload: any = {};

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  showButtonConfirm: any = {};
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);

  csvData!: any[];
  @Input() mapFunction?: (item: any) => {} = (item: any) => {
    return {
      ...item,
    };
  };

  // useCheckBox: boolean = false;
  selectedItemsTracker: any[] = [];
  selectedCheckboxTracker: { [key: string]: any } = {};
  selectedCheckboxTrackerItems = {};

  constructor(
    private settings: SettingsService,
    private authService: AuthService
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
            checkBox: false,
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
          checkBox: false,
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
        checkBox: false,
        customPrimary: false,
      };
    }

    this.clearOverriddenAction();
  }

  ngOnInit() {}

  clearOverriddenAction() {
    // if (this.tableConfigurations.actionIcons && this.tableConfigurations.actionIcons.checkBox !== null) {
    //
    // }
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnChanges() {
    const mappedValues = this.mapFunction
      ? this.tableList?.map((i) => this.mapFunction(i))
      : this.tableList!;

    const idsExists = mappedValues?.every((obj) => 'id' in obj);
    this.propertyToUse = idsExists ? 'id' : 'uuid';

    this.dataSource = new MatTableDataSource(mappedValues);
    // this.dataSource = new MatTableDataSource(this.tableList!);
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

    let columns = [];
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
      this.displayedColumns = [...columns, 'actions'];
    } else {
      this.displayedColumns = columns;
    }
    if (this.tableConfigurations.allowPagination) {
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
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

      let selectedItems = this.settings.removeDuplicates(
        this.selectedItemsTracker.filter((j) => j.isChecked),
        this.propertyToUse
      );
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

  downloadToCsv() {
    const filename = 'download';
    const data = this.tableList?.map((item) => {
      const object: any = {};
      for (const col of this.tableConfigurations.tableColumns) {
        object[col.name] = item[col.name] ? item[col.name] : '';
      }
      return object;
    });
    this.csvData = data;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.csvData);
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, `${filename}.xlsx`);

    // const csvFile = new ngxCsv(data, 'My Report', {
    //   headers: this.tableConfigurations.tableColumns.map(col => col.label)
    // });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    } else {
      row.isChecked = this.selection.isSelected(row);
      this.selectedCheckboxTracker[row[this.propertyToUse]] = row.isChecked;
      this.selectedCheckboxTrackerItems[row[this.propertyToUse]] = row;
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
        row.position + 1
      }`;
    }
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
    //
    if ($event.checked) {
      this.selection.select(tableListItem);
    } else {
      this.selection.deselect(tableListItem);
    }
    //
    // // return;
    tableListItem.isChecked = this.selection.isSelected(tableListItem);

    this.rowCheckBoxItem(tableListItem);
  }
}
