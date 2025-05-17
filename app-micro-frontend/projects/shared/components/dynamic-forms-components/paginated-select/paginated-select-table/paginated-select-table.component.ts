import { AfterViewInit, Component, Inject, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom, fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap, tap, startWith, map, takeUntil, first, catchError } from 'rxjs/operators';
import { DataPage } from '../../../paginated-data-table/data-page.model';
import { GraphqlService } from '../../../../../services/graphql.service';
import { SettingsService } from '../../../../../services/settings.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { TableColumn } from '../../../paginated-data-table/paginated-table-configuration.model';
import { NotificationService } from "../../../../../services/notification.service";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../../../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, UpperCasePipe, LowerCasePipe, DecimalPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeDatePipe } from "../../../../pipes/safe-date.pipe";

export interface PaginatedSelectTableCDialogData {
  title?: string;
  query: any;
  optionValue?: string;
  fields?: any[];
  filters?: any[];
  tableList?: any[];
  isPaginated?: boolean;
  multiple?: boolean;
  tableColumns: Array<TableColumn>;
  mapFunction?: (item: any) => {};
  noSearchFields?: string[];
  mustHaveFilters?: any[];
  customMainFilters?: any;
  initialSelection?: any[];
  useAsForm?: boolean;
  hideExport?: boolean;
  apolloNamespace: string;
}


@Component({
  selector: 'app-paginated-select-table',
  templateUrl: 'paginated-select-table.component.html',
  styleUrls: ['paginated-select-table.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    LoaderComponent,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    NgClass,
    MatCheckboxModule,
    MatPaginatorModule,
    UpperCasePipe,
    LowerCasePipe,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    SafeDatePipe
],
})
export class PaginatedSelectTableComponent
  implements OnInit, OnDestroy, AfterViewInit {
  resultLength: number;
  searchQuery = '';
  displayedColumns: string[];
  dataSource = new MatTableDataSource<any>();
  selection: SelectionModel<any> = new SelectionModel(this.data.multiple, []);
  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild('input') input: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize = 10;
  loading = false;
  hideExport = true;
  useAsForm = true;
  doSearch = false;
  tempData: DataPage;
  pageSelection: { [pageIndex: number]: any[] } = { 0: [] };
  counter = 0;
  forceInitialValues = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PaginatedSelectTableCDialogData,
    public dialogRef: MatDialogRef<PaginatedSelectTableComponent>,
    private graphService: GraphqlService,
    private settings: SettingsService,
    private notificationService: NotificationService
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  async search() {
    this.loading = true;
    const data = await firstValueFrom(this.getDataFromSource(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    ));
    this.prepareDataAndColumns(data);
    this.loading = false;
  }

  _handleKeydown(event: KeyboardEvent) {
    if (this.data.isPaginated) {
      // Prevent propagation for all alphanumeric characters in order to avoid selection-proccess issues
      if (
        event.key !== undefined &&
        (event.code === 'Space' ||
          event.code === 'Home' ||
          event.code === 'end')
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
  }

  _handleKeyup(event: KeyboardEvent) {
    if (this.data.isPaginated) {
      if (event.code === 'Backspace' && this.searchQuery.length === 0) {
        if (this.tempData?.rows?.length > 0) {
          this.prepareDataAndColumns(this.tempData);
        } else {
          this.search();
        }
      }
    }
  }

  ngOnInit(): void {
    this.displayedColumns = this.data.tableColumns?.map((col) => col.name);

    this.useAsForm = this.settings.isNullOrUndefined(this.data.useAsForm)
      ? true
      : (this.data.useAsForm as boolean);
    this.hideExport = this.settings.isNullOrUndefined(this.data.hideExport)
      ? true
      : (this.data.hideExport as boolean);
    if (this.data.multiple) {
      this.displayedColumns.push('select');
    }
    if (!this.data.isPaginated) {
      const mappedValues = this.data.mapFunction
        ? this.data.tableList?.map((i) =>
          (this.data.mapFunction as (item: any) => {})(i)
        )
        : this.data.tableList;
      this.dataSource = new MatTableDataSource(mappedValues);
    }
  }

  ngAfterViewInit() {
    if (!this.data.isPaginated) {
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          filter(Boolean),
          debounceTime(300),
          distinctUntilChanged(),
          tap((text) => {
            if (this.searchQuery.length === 0) {
              this.loading = true;
            }
          }),
          switchMap(() => {
            if (this.data.isPaginated && this.searchQuery.length === 0) {
              return this.getDataFromSource(
                this.paginator.pageIndex + 1,
                this.paginator.pageSize
              );
            } else {
              this.applyFilter();
              this.loading = false;
              return of(null);
            }
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((i: any) => {
          if (this.searchQuery.length === 0) {
            this.prepareDataAndColumns(i);
          }
        });
    }

    setTimeout(() => {
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          tap((i) => (this.loading = true)),
          switchMap(() => {
            if (this.data.isPaginated) {
              return this.getDataFromSource(
                this.paginator.pageIndex + 1,
                this.paginator.pageSize
              );
            } else {
              this.loading = false;
              return of({});
            }
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((i: any) => {
          if (this.data.isPaginated) {
            this.prepareDataAndColumns(i);
          }
        });
    }, 0);
  }

  applyFilter() {
    const filterValue = this.input.nativeElement.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected =
      this.pageSelection[this.paginator.pageIndex]?.length || 0;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection-proccess. */
  masterToggle(event) {
    this.selection.clear();
    if (event) {
      this.pageSelection[this.paginator.pageIndex] =
        this.dataSource.filteredData;
      this.pageSelection[this.paginator.pageIndex].forEach((row) =>
        this.selection.select(row)
      );
    } else {
      this.pageSelection[this.paginator.pageIndex] = [];
    }
  }

  selectRow(row: any) {
    this.selection.toggle(row);
    const checked = this.selection.isSelected(row);
    if (this.data.optionValue && this.data.multiple) {
      if (checked) {
        if (this.pageSelection[this.paginator.pageIndex]) {
          this.pageSelection[this.paginator.pageIndex].push(row);
        } else {
          this.pageSelection[this.paginator.pageIndex] = [row];
        }
      } else {
        this.pageSelection[this.paginator.pageIndex] = this.pageSelection[
          this.paginator.pageIndex
        ]?.filter(
          (i) => i[this.data.optionValue!] === row[this.data.optionValue!]
        );
      }
    }
    const selectedRow = checked ? row : undefined;
    if (!this.data.multiple && this.useAsForm) {
      this.dialogRef.close(selectedRow);
    }
  }

  querySearchFields(): any[] {
    const fields: any[] = [];
    this.data.tableColumns.forEach((column) => {
      const value: any = {
        fieldName: column.name,
        isSearchable: true,
        operation: 'LK',
        searchValue: this.input.nativeElement.value,
      };
      if (this.data.noSearchFields?.indexOf(value.fieldName) === -1) {
        fields.push(value);
      }
    });
    return fields;
  }

  prepareFields() {
    const fields = this.data.fields
      ? this.data.fields
      : this.querySearchFields();
    return (
      fields?.map((field) => {
        field.searchValue = this.input.nativeElement.value;
        if (this.sort.active && this.sort.direction) {
          field.isSortable = true;
          field.orderDirection = this.sort.direction.toUpperCase();
        }
        return field;
      }) || []
    );
  }

  getDataFromSource(page: number, pageSize: number): Observable<DataPage> {
    const input = {
      page,
      pageSize,
      fields: this.prepareFields(),
      mustHaveFilters: this.data.mustHaveFilters,
    };
    if (this.data.customMainFilters) {
      const newParam = this.data.customMainFilters;
      return this.graphService
        .fetchDataObservable({
          apolloNamespace: this.data?.apolloNamespace,
          query: this.data?.query,
          variables: { input, ...newParam },
        })
        .pipe(
          map(({ data, errors }: any) =>
            data ? Object.values(data)[0] : errors
          ),
          catchError((error) => {
            this.loading = false;
            console.error(error);
            this.notificationService.errorMessage(
              error.message || error[0].message
            );
            return of([]);
          })
        );
    } else {
      return this.graphService
        .fetchDataObservable({
          query: this.data.query,
          apolloNamespace: this.data.apolloNamespace,
          variables: { input },
        })
        .pipe(
          map(({ data, errors }: any) =>
            data ? Object.values(data)[0] : errors
          ),
          catchError((error) => {
            this.loading = false;
            console.error(error);
            this.notificationService.errorMessage(
              error.message || error[0].message
            );
            return of([]);
          })
        );
    }
  }

  prepareDataAndColumns(response: DataPage) {
    let initialSelection: any[] = [];
    if (!this.doSearch) {
      this.tempData = response;
    } else {
      this.doSearch = false;
    }
    try {
      const dataValues: any[] = response && response.rows ? response.rows : [];
      const mappedValues = this.data.mapFunction
        ? dataValues.map((i) => (this.data.mapFunction as (item: any) => {})(i))
        : dataValues;
      this.dataSource = new MatTableDataSource(mappedValues);
      this.resultLength = this.searchQuery
        ? response.recordsFilteredCount || response?.totalRecords
        : response?.totalRecords;
      this.loading = false;
      if ((this.pageSelection[this.paginator.pageIndex]?.length || 0) > 0) {
        const tableSelection = this.pageSelection[this.paginator.pageIndex].map(
          (item) => item[this.data.optionValue || '']
        );

        initialSelection = (this.data.initialSelection || []).concat(
          tableSelection.filter(
            (item) =>
              (this.data.initialSelection || []).indexOf(
                item[this.data.optionValue || '']
              ) === -1
          )
        );
      } else if (this.forceInitialValues) {
        initialSelection = (this.data.initialSelection || [])
      } else {
        this.pageSelection[this.paginator.pageIndex] = [];
      }


      this.dataSource.data.forEach((row) => {
        if (initialSelection?.some((item) => item + '' === row[this.data.optionValue || ''] + '')) {
          this.selection.select(row);
          if (this.forceInitialValues) {
            this.pageSelection[this.paginator.pageIndex].push(row);
          }
        }
      });
      this.forceInitialValues = false;
    } catch (e) {
      console.error(e);
    }
  }

  close(row = null) {
    const data = row || this.selection.selected;
    this.dialogRef.close(data);
  }
}
