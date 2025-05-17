import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  Input,
  OnChanges,
  forwardRef,
  AfterViewInit,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  combineLatest,
  firstValueFrom,
  isObservable,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mapTo,
  scan,
  startWith,
  take,
  takeUntil,
  tap,
  filter,
} from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { PaginatedSelectTableComponent } from '../paginated-select/paginated-select-table/paginated-select-table.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../../../../services/settings.service';
import { fadeIn, fadeOut } from '../../../animations/router-animation';
import { HelpDialogComponent } from '../help-dialog-component/help-dialog-component.component';
import { HelpTextService } from '../../../../services/help-text.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { DisableDuplicatePipe } from '../pipes/disable-duplicate.pipe';
import { DynamicPipe } from '../../../pipes/dynamic.pipe';
import { SearchPipe } from '../../../pipes/search.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SelectSearchComponent } from './select-search/select-search.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-select',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  animations: [fadeIn, fadeOut],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    SelectSearchComponent,
    NgClass,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    SearchPipe,
    DynamicPipe,
    DisableDuplicatePipe,
    TranslatePipe
],
})
export class SelectComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor {
  @Input() field?: FieldConfig;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();
  @Input() loading = false;

  filterVal = '';
  noEntriesFoundLabel = 'No entry matches';
  showHelp = false;

  /** control for the search input value */
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  /** list of data corresponding to the search input */
  /** Removed the private on data defined which introduce issues issues in building production */
  filteredData$: Observable<any[]> =
    this.searchCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      // map((i) => this.field.mapFunction || ({...i})),
      map((searchKeyword) => {
        const options = this.settings.sortArray(this.optionData, 'name', 'ASC');
        if (!searchKeyword) {
          if (this.field?.mapFunction) {
          }

          return this.field?.mapFunction
            ? (options || []).map(this.field.mapFunction)
            : options || [];
        }
        return (options || []).filter((option) =>
          this.field?.searchFields
            ?.map(
              (searchTerm) =>
                option[searchTerm]
                  .toLowerCase()
                  .indexOf(searchKeyword.toLowerCase()) > -1
            )
            .reduce((a, b) => a || b)
        );
      })
    ) || of([]);

  /** number of items added per batch */
  batchSize = 20;

  private incrementBatchOffset$: Subject<void> = new Subject<void>();
  private resetBatchOffset$: Subject<void> = new Subject<void>();

  /** minimum offset needed for the batch to ensure the selected option is displayed */
  private minimumBatchOffset$: Observable<number> = combineLatest([
    this.filteredData$,
    this.searchCtrl.valueChanges,
  ]).pipe(
    map(([filteredData, searchValue]) => {
      if (
        this.field?.key &&
        !this.searchCtrl.value &&
        this.group?.value[this.field.key]
      ) {
        const index = filteredData.findIndex(
          (option) =>
            option.value + '' === this.group?.value[this.field?.key!] + ''
        );
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
      this.incrementBatchOffset$.pipe(map(() => true)),
      this.resetBatchOffset$.pipe(map(() => false))
    ),
    this.minimumBatchOffset$,
  ]).pipe(
    scan((batchOffset, [doIncrement, minimumOffset]) => {
      if (doIncrement) {
        return Math.max(
          batchOffset + this.batchSize,
          minimumOffset + this.batchSize
        );
      } else {
        return Math.max(minimumOffset, this.batchSize);
      }
    }, this.batchSize)
  );

  /** list of data, filtered by the search keyword, limited to the length accumulated by infinity scrolling */
  filteredBatchedData$: Observable<any[]> =
    combineLatest([this.filteredData$, this.batchOffset$]).pipe(
      map(([filteredData, batchOffset]) => filteredData.slice(0, batchOffset))
    ) || of([]);

  private destroy$: Subject<void> = new Subject<void>();
  required = false;
  showTable = false;
  selected: any;
  disabled = false;
  onChange: any = () => { };
  onTouched: any = () => { };
  optionData: any[] | undefined;
  loadingOptions = false;
  optionsSub = Subscription.EMPTY;
  selectedCountLabel = '';
  constructor(
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private settings: SettingsService,
    private helpTextService: HelpTextService
  ) { }

  ngOnChanges() {
    this.setOptionData();
    this.setDefault();
    this.checkRequiredFields(this.field, 'field');
  }

  ngAfterViewInit(): void {
    this.resetting();
  }

  resetting() {
    this.searchCtrl.updateValueAndValidity({
      onlySelf: false,
      emitEvent: true,
    });
    this.resetBatchOffset$.next();
    this.cdr.detectChanges();
  }

  async setOptionData() {
    if (isObservable(this.field?.options)) {
      this.loadingOptions = true;
      this.optionsSub = this.field!.options.subscribe((res) => {
        this.optionData = res;
        this.resetting();
        this.loadingOptions = false;
      });
    } else {
      this.optionData = this.field?.options || this.field.optionData.value;
    }
  }

  ngOnInit() {
    this.setOptionData();
    this.setDefault();
    this.checkRequiredFields(this.field, 'field');
    const key = this.field?.key;
    if (key) {
      this.group.addControl(key, new UntypedFormControl('', []));
      this.required =
        (this.group?.get(key)?.errors !== null &&
          this.group?.get(key)?.errors?.['required']) ||
        false;
    }

    this.filterVal = this.field?.filterValueKey
      ? this.group?.get(this.field?.filterValueKey)?.value
      : '';
  }

  async openHelpPage() {
    this.showHelp = true;
    await this.helpTextService.openHelpPage({
      key: this.field.key,
      label: this.field.label,
      hint: this.field.hint,
    });
    this.showHelp = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.optionsSub.unsubscribe();
  }

  /**
   * Load the next batch
   */
  getNextBatch(): void {
    this.incrementBatchOffset$.next();
  }

  openedChange(opened: boolean) {
    if (opened) {
      this.resetBatchOffset$.next();
    }
  }

  fieldChange(event: any) {
    let object: any;
    this.settingValue(event.value);
    if (this.field?.multiple) {
      object =
        (this.optionData || []).filter(
          (element: any) => event.value.indexOf(element.value) > -1
        ) || null;
    } else {
      object =
        (this.optionData || []).find(
          (element: any) => element.value === event.value
        ) || null;
    }

    if (this.field.key) {
      this.group.controls[this.field.key].setValue(event.value);
    }
    this.setTotalSelected();
    this.fieldValue.emit({ value: event.value, field: this.field, object });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredData$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((datas: any) => {
        if (selectAllValue) {
          const values = datas.map((data: any) => data.value);
          this.selected = values;
          if (this.field?.key)
            this.group?.controls[this.field.key]?.setValue(values);
          this.fieldChange({ value: values });
        } else {
          this.selected = [];
          if (this.field?.key)
            this.group?.controls[this.field.key]?.patchValue([]);
          this.fieldChange({ value: [] });
        }
      });
  }

  setDefault() {
    /** Defining Default Values */
    if (this.field) {
      this.field = {
        ...this.field,
        label: this.field?.label || '',
        hideRequiredMarker: this.field?.hideRequiredMarker || true,
        placeholder: this.field?.placeholder || this.field?.label || '',
        multiple: this.field?.multiple || false,
        filterKey: this.field?.filterKey || '',
        dynamicPipes: this.field?.dynamicPipes || [
          { pipe: 'defaultCase' },
          { pipe: 'replace', firstArgs: '_', secondArgs: ' ' },
        ],
        hint: this.field?.hint || '',
        validations: this.field?.validations || [],
        searchFields: this.field?.searchFields || ['name'],
        preventConcat: this.field?.preventConcat || false,
        pageSize: this.field?.pageSize || 10,
        value: this.settings.isNullOrUndefined(this.field?.value)
          ? null
          : this.field?.value,
        optionValue: this.field?.optionValue || 'id',
        optionName: this.field?.optionName || '',
        optionData: this.field?.optionData || {
          error: null,
          value: [],
          loading: false,
        },
      };
    }
  }

  settingValue($event: any): void {
    this.selected = $event;
    this.onChange(this.selected);
  }

  writeValue(value: any): void {
    if (value) {
      this.fieldChange({ value });
    }
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.field?.key) {
      if (isDisabled) {
        this.group.controls[this.field.key].disable();
      } else {
        this.group.controls[this.field.key].enable();
      }
    }
  }

  checkRequiredFields(input: any, attr: string) {
    if (input === null) {
    }
  }

  showTableFn() {
    this.showTable = true;


    if (this.field) {
      const dialogRef = this.dialog.open(PaginatedSelectTableComponent, {
        data: {
          title: this.field.label,
          multiple: this.field.multiple,
          isPaginated: false,
          tableColumns: this.field.tableColumns,
          mapFunction: this.field.mapFunction,
          tableList: this.field.optionData.value,
          optionValue: this.field.optionData,
          initialSelection: this.field.multiple
            ? this.selected
            : [this.selected],
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: { [key: string]: any } | { [key: string]: any }[]) => {
            this.showTable = false;
            if (result) {
              // this.generateOptions({
              //   rows: this.field.multiple ? result : [result],
              //   totalPages: this.totalPages - 1
              // });

              this.selected = Array.isArray(result)
                ? result?.map((item) => item['value'] + '')
                : result['value'] + '';
              if (this.field?.key)
                this.group.controls[this.field.key].patchValue(this.selected);
              this.fieldChange({ value: this.selected });
            }
          }
        );
    }
  }

  setTotalSelected() {
    if (this.field?.multiple && this.selected?.length > 0) {
      this.selectedCountLabel = ' (' + this.selected.length + ')';
    } else {
      this.selectedCountLabel = '';
    }

  }
}
