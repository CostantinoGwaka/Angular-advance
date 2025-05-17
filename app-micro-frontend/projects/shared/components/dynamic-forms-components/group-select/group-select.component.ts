import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mapTo, scan, startWith, take, takeUntil } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { ReplacePipe } from '../../../pipes/replace.pipe';
import { SearchPipe } from '../../../pipes/search.pipe';
import { MatIconModule } from '@angular/material/icon';
import { SelectSearchComponent } from '../select/select-search/select-search.component';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-group-select',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './group-select.component.html',
    styleUrls: ['./group-select.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatOptionModule, SelectSearchComponent, NgClass, MatIconModule, AsyncPipe, SearchPipe, ReplacePipe]
})
export class GroupSelectComponent implements OnInit, OnDestroy, AfterViewInit {
  field: FieldConfig;
  group: UntypedFormGroup;
  @Output() fieldValue = new EventEmitter();
  filterVal;
  noEntriesFoundLabel = 'No entry matches';
  @ViewChild('infiniteScrollSelect', { static: true }) infiniteScrollSelect: MatSelect;


  /** control for the search input value */
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  /** list of data corresponding to the search input */
  private filteredData$: Observable<any[]> = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(100),
    distinctUntilChanged(),
    map(searchKeyword => {
      if (!searchKeyword) {
        return this.field?.optionData?.value || [];
      }
      const searchFields = this.field.searchFields ? this.field.searchFields : ['name'];
      return (this.field?.optionData?.value || []).filter((option) => searchFields.map(searchTerm => option[searchTerm].toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1).reduce((a, b) => a || b));

    })
  );

  /** number of items added per batch */
  batchSize = 20;

  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private resetBatchOffset$: Subject<void> = new Subject<void>();

  /** minimum offset needed for the batch to ensure the selected option is displayed */
  private minimumBatchOffset$: Observable<number> = combineLatest([
    this.filteredData$,
    this.searchCtrl.valueChanges
  ]).pipe(
    map(([filteredData, searchValue]) => {
      if (!this.searchCtrl.value && this.group?.value[this.field.key as string]) {
        const index = filteredData.findIndex(option => option.value + '' === this.group?.value[this.field.key as string] + '');
        return index + this.batchSize;
      } else {
        return 0;
      }
    }),
    startWith(0)
  );

  /** length of the visible data / start of the next batch */
  private batchOffset$ = combineLatest([
    merge(
      this.incrementBatchOffset$.pipe(mapTo(true)),
      this.resetBatchOffset$.pipe(mapTo(false))
    ),
    this.minimumBatchOffset$
  ]).pipe(
    scan((batchOffset, [doIncrement, minimumOffset]) => {
      if (doIncrement) {
        return Math.max(batchOffset + this.batchSize, minimumOffset + this.batchSize);
      } else {
        return Math.max(minimumOffset, this.batchSize);
      }
    }, this.batchSize),
  );


  /** list of data, filtered by the search keyword, limited to the length accumulated by infinity scrolling */
  filteredBatchedData$: Observable<any[]> = combineLatest([
    this.filteredData$,
    this.batchOffset$
  ]).pipe(
    map(([filteredData, batchOffset]) => filteredData.slice(0, batchOffset))
  );

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.searchCtrl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    this.resetBatchOffset$.next();
    this.cdr.detectChanges();
  }

  ngOnInit() {

    // if (this.field.label) {
    //   this.noEntriesFoundLabel = 'Not Found In ' + this.field.label;
    // }
    this.filterVal = this.group?.get(this.field.filterValueKey as string) ? this.group?.get(this.field.filterValueKey as string)?.value : null;
    this.infiniteScrollSelect.openedChange.pipe(takeUntil(this.destroy$)).subscribe(opened => {
      // after opening, reset the batch offset
      if (opened) {
        this.resetBatchOffset$.next();
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
  }


  /**
   * Load the next batch
   */
  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }

  fieldChange(event) {
    let object: any;
    object = (this.field?.optionData?.value || []).find(element => element.value === event.value);
    this.fieldValue.emit({ value: event.value, field: this.field, object });
  }


  toggleSelectAll(selectAllValue: boolean) {
    this.filteredData$.pipe(take(1), takeUntil(this.destroy$))
      .subscribe((datas: any) => {
        if (selectAllValue) {
          const values = datas.map(data => data.value);
          this.group?.controls[this.field.key as string]?.setValue(values);
        } else {
          this.group?.controls[this.field.key as string]?.patchValue([]);
        }
      });
  }

}
