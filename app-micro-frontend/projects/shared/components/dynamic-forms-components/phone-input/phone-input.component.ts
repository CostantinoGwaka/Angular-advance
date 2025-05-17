import {
  AfterViewInit, ChangeDetectionStrategy,
  Component, EventEmitter, forwardRef, Input, OnChanges,
  OnInit, Output, SimpleChanges,
} from '@angular/core';
import { FieldConfig } from "../field.interface";
import {
  GET_COUNTRY_BY_PHONE_CODE,
  GET_COUNTRY_PAGINATED
} from "../../../../modules/nest-tenderer-management/store/country/country.graphql";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap, startWith,
  takeUntil,
  tap
} from "rxjs/operators";
import * as lpn from 'google-libphonenumber';
import { merge, of, Subject } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SettingsService } from "../../../../services/settings.service";
import { MatDialog } from "@angular/material/dialog";
import { GraphqlService } from "../../../../services/graphql.service";
import { NotificationService } from "../../../../services/notification.service";
import { FieldRequestInput } from "../../paginated-data-table/field-request-input.model";
import { PhoneNumberFormat } from "./enums/phone-number-format.enum";
import { Country } from "./store/input-country.model";
import { ChangeData } from "./interfaces/change-data";
import { DisableDuplicatePipe } from '../pipes/disable-duplicate.pipe';
import { DynamicPipe } from '../../../pipes/dynamic.pipe';
import { SearchPipe } from '../../../pipes/search.pipe';
import { NgClass } from '@angular/common';
import { SelectSearchComponent } from '../select/select-search/select-search.component';
import { MatOptionModule } from '@angular/material/core';
import { SelectInfiniteScrollDirective } from '../select/select-infinite-scroll.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {ApolloNamespace} from "../../../../apollo.config";


@Component({
    selector: 'app-phone-input',
    templateUrl: './phone-input.component.html',
    styleUrls: ['./phone-input.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PhoneInputComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    SelectInfiniteScrollDirective,
    MatOptionModule,
    SelectSearchComponent,
    ReactiveFormsModule,
    NgClass,
    SearchPipe,
    DynamicPipe,
    DisableDuplicatePipe
],
})

export class PhoneInputComponent implements OnInit, ControlValueAccessor, OnChanges, AfterViewInit {
  noEntriesFoundLabel = 'No entry matches';
  searching: boolean = false;
  loading: boolean = false;
  required: boolean = false;
  isPhoneNumberValid: boolean;
  options: any[] = [];
  totalPages = 0;
  filterVal;
  query = GET_COUNTRY_PAGINATED;
  allOptions: any[] = [];
  searchOptions: any[] = [];
  scrolling = false;
  page = 1;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
  numberFormat: PhoneNumberFormat = PhoneNumberFormat.International;
  @Input() field: FieldConfig;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();
  @Output() countryChange = new EventEmitter<Country>();

  destroy$: Subject<void> = new Subject<void>();
  incrementPageSize$: Subject<void> = new Subject<void>();
  resetPageSize$: Subject<void> = new Subject<void>();

  selected: any;
  value: any;
  disabled = false;
  selectedCountry: Country
  phoneNumber: string | undefined = '';


  onChange: any = () => { };
  onTouched: any = () => { };

  ngOnChanges(changes: SimpleChanges): void {
    if (this.field?.disabled) {
      this.group.controls[this.field.key as string].disable();
    }
  }

  settingValue($event: any): void {
    this.value = $event;
    this.onChange(this.value);
  }

  // @HostBinding('class') rowClass = 'col-md-6';
  writeValue(value: any): void {
    if (value !== undefined) {
      this.propagateChange(value);
    }
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  constructor(
    public dialog: MatDialog,
    private graphService: GraphqlService,
    private settings: SettingsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.setDefault();

    if (this.field?.key) {
      this.group.addControl(this.field?.key, new UntypedFormControl('', []));
      this.required = (this.group?.get(this.field?.key)?.errors !== null && this.group?.get(this.field?.key)?.errors?.['required']) || false;
      this.filterVal = (this.group?.get(this.field?.filterValueKey || '')?.value) || this.selected;
      const control = this.group?.controls[this.field?.key as string];
      const pathValue = control.value;

      if (pathValue) {
        this.phoneNumber = pathValue.phoneNumber;
        /// filter and auto select country
        this.getCountryByPhoneCode(this.field.value.phoneCode).then();
      }
    }
    this.checkFormData();
  }

  ngAfterViewInit(): void {
    this.searchCtrl.valueChanges.pipe(
      filter(search => !!search),
      tap(() => this.searching = true),
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap(() => this.getDataFromServer()),
      tap(() => this.searching = false),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.generateOptions(res);
    });
    setTimeout(() => {
      merge(this.incrementPageSize$.pipe(mapTo(true)),
        this.resetPageSize$.pipe(mapTo(false))).pipe(
          startWith(false),
          tap(scrolling => {
            if (scrolling) {
              this.searching = true;
            } else {
              this.loading = true;
              // this.cdr.detectChanges();
            }
          }),
          mergeMap((doIncrement) => this.getDataFromServer(doIncrement)),
          tap(() => {
            this.loading = false;
            this.searching = false;
          }),
          takeUntil(this.destroy$),
        ).subscribe((res: any) => {
          this.generateOptions(res);
        });
    }, 0);

  }


  /** Get filtered options by the initial value */
  checkFormData() {
    const control = this.group?.controls[this.field?.key as string];
    const initValue = control?.value || this.selected;

    if (initValue) {
      if (this.settings.isArray(initValue)) {
        const customFields = [];
        const initialElement = [];
        initValue.forEach(value => {
          customFields.push({
            fieldName: this.field?.optionValue,
            isSearchable: true,
            isSortable: false,
            operation: 'EQ',
            searchValue: value + ''
          });
          initialElement.push(value + '');

          this.getInitialDataFromServer([
            {
              fieldName: this.field?.optionValue,
              isSearchable: true,
              isSortable: false,
              operation: 'EQ',
              searchValue: value + ''
            }
          ]);
        });
        control?.setValue(initialElement);
      } else {
        control?.setValue(initValue);

        if (initValue.phoneNumber !== null && initValue.phoneCode !== null) {
          const phoneNumberData: lpn.PhoneNumber = lpn.phoneUtil.parse(initValue.phoneNumber, initValue.phoneCode);
          this.phoneNumber = phoneNumberData.number;

          this.getInitialDataFromServer([{
            fieldName: this.field?.optionValue,
            isSearchable: true,
            isSortable: false,
            operation: 'EQ',
            searchValue: initValue.phoneCode.replace('+', '')
          }]);
        }
      }
    }
  }

  async getCountryByPhoneCode(phoneCode: string) {

    try {
      this.loading = true;
      const selected: any = await this.graphService.fetchData(
        {
          query: GET_COUNTRY_BY_PHONE_CODE,
          apolloNamespace: ApolloNamespace.uaa,
          variables: { phoneCode: phoneCode }
        },);

      this.selectedCountry = {
        phoneCode: selected.phoneCode,
        code: selected.code,
        name: selected.name,
        flag: selected.flag
      }

      this.loading = false;
    } catch (e) {
      console.error(e);

      this.loading = false;
    }


  }

  setDefault() {
    /** Defining Default Values */
    this.field = {
      ...this.field,
      label: this.field?.label || '',
      hideRequiredMarker: this.field?.hideRequiredMarker || true,
      key: this.field?.key || 'id',
      placeholder: this.field?.placeholder || this.field?.label || '',
      multiple: this.field?.multiple || false,
      filterKey: this.field?.filterKey || '',
      dynamicPipes: this.field?.dynamicPipes || [{ pipe: 'defaultCase' }, { pipe: 'replace', firstArgs: '_', secondArgs: ' ' }],
      hint: this.field?.hint || '',
      validations: this.field?.validations || [],
      preventConcat: this.field?.preventConcat || false,
      pageSize: this.field?.pageSize || 10,
      value: this.settings.isNullOrUndefined(this.field?.value) ? null : this.field?.value,
      mustHaveFilters: this.field.mustHaveFilters || [],
      optionValue: this.field.optionValue || 'id',
      optionName: this.field.optionName || '',
      fetchPolicy: this.field.fetchPolicy || 'cache-first',
      searchFields: this.field.searchFields || []
    };
  }

  /** Get initial options from server using specified fields and generate options */
  private getInitialDataFromServer(customFields) {
    this.loading = true;
    this.getDataFromServer(false, customFields)
      .pipe(takeUntil(this.destroy$),
        tap(() => this.loading = false))
      .subscribe((res: any) => {
        this.generateOptions(res);
      });
  }

  /** Generating Options while scrolling and searching */
  generateOptions(res) {
    if (res) {
      const optionValue = this.field?.optionValue || '';
      this.totalPages = res.totalPages + 1;
      const modifiedOptions = this.getData(res);
      const arr: any[] = this.allOptions.map(opt => opt[optionValue]);
      this.allOptions = this.allOptions.concat(modifiedOptions.filter((item: any) => arr.indexOf(item[optionValue]) === -1));
      if (this.searchCtrl?.value) {
        if (this.scrolling) {
          const arrSearch: any[] = this.searchOptions.map(opt => opt[optionValue]);
          this.searchOptions = this.searchOptions.concat(modifiedOptions.filter(item => arrSearch.indexOf(item[optionValue]) === -1));
          this.options = this.searchOptions;
        } else {
          this.searchOptions = modifiedOptions;
          this.options = modifiedOptions;
        }
      } else {
        this.options = this.allOptions;
      }

      this.options = this.settings.sortArray(this.options, 'optionValue', 'ASC');
    }
  }

  /** Modifying response to match matselect options */
  getData(res) {
    /** custom separator can be added */
    const data = this.field.mapFunction ? (res?.rows || []).map(this.field.mapFunction) : (res?.rows || []);
    return (data || []).filter(item => item).map(item => ({
      ...item, name: this.field?.optionName?.split(',')?.map(name => name.includes('.') ? this.toObject(name.split('.'), item) : (!!item ? item[name] : ''))?.join(' ') || item['name'], optionValue: item[this.field?.optionValue || ''] + ''
    }));
  }

  toObject(arr, item) {
    const arrLength = arr.length;
    if (arrLength == 1) {
      return item[arr[0]];
    }
    if (arrLength == 2) {
      return item[arr[0]][arr[1]];
    }
    if (arrLength == 3) {
      return item[arr[0]][arr[1]][arr[2]];
    }
  }

  /** Getting data from server with specified filters */
  getDataFromServer(doIncrement = false, customFields = null) {
    this.scrolling = doIncrement;
    this.page = doIncrement ? this.page + 1 : 1;
    if (this.page === 1 || this.totalPages > this.page) {
      const fields = customFields === null ? this.queryFields() : customFields;
      let input: { [key: string]: any } = {
        page: this.page,
        pageSize: this.field?.pageSize,
        fields,
      };
      if (this.field?.mustHaveFilters) {
        input = { ...input, mustHaveFilters: this.field?.mustHaveFilters, };
      }
      if (this.field.additionalVariables && Object.keys(this.field.additionalVariables).length > 0) {
        const newParam = this.field.additionalVariables;

        return this.graphService.fetchDataObservable(
          {
            query: this.field?.query,
            apolloNamespace: this.field?.apolloNamespace,
            variables: { input, ...newParam }
          },
          this.field?.fetchPolicy)
          .pipe(map(({ data, errors }: any) => {
            if (errors) {
              console.error(errors);
              this.notificationService.errorMessage(errors[0]?.message);
            }
            return data ? Object.values(data)[0] : errors
          }), catchError(error => {
            console.error(error);
            this.notificationService.errorMessage(error.message || error[0].message);
            return of([]);
          }));
      } else {
        return this.graphService.fetchDataObservable(
          {
            query: this.field?.query,
            apolloNamespace: this.field?.apolloNamespace,
            variables: { input }
          },
          this.field?.fetchPolicy
        ).pipe(map(({ data, errors }: any) => {
          if (errors) {
            console.error(errors);
            this.notificationService.errorMessage(errors[0]?.message);
          }
          this.loading = false;
          return data ? Object.values(data)[0] : errors
        }), catchError(error => {
          this.loading = false;
          this.searching = false;
          console.error(error);
          this.notificationService.errorMessage(error.message || error[0].message);
          return of([]);
        }));
      }

    }

    return of([]);
  }

  queryFields(): FieldRequestInput[] {
    const fields: any[] = [];
    (this.field?.searchFields)?.forEach(field => {
      let value: any = {
        fieldName: field,
        isSearchable: true,
        isSortable: false,
        operation: 'LK',
        searchValue: this.searchCtrl?.value || ''
      };
      if (this.field?.sortField === field) {
        value = {
          ...value,
          isSortable: true,
          orderDirection: 'ASC'
        };
      } else {
        if (value.hasOwnProperty('isSortable')) {
          delete value.isSortable;
        }
        if (value.hasOwnProperty('orderDirection')) {
          delete value.orderDirection;
        }
      }
      fields.push(value);
    });
    return fields;
  }

  /**
   * Load the next page
   */
  getNextPage(): void {
    if (!this.searching) {
      this.incrementPageSize$.next();
    }
  }

  setSelectedCountry(country: Country) {
    this.selectedCountry = country;
    this.countryChange.emit(country);
    this.field.placeholder = this.getPhoneNumberPlaceHolder(country.code);
  }

  public onCountrySelect(country: Country, el: { focus: () => void; }): void {
    this.setSelectedCountry(country);

    if (this.phoneNumber && this.phoneNumber.length > 0) {
      this.value = this.phoneNumber;
      const number = this.getParsedNumber(
        this.phoneNumber,
        this.selectedCountry.code
      );

      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';

      this.isPhoneNumberValid = this.phoneUtil.isValidNumber(number);

      const phoneData = {
        number: this.value,
        isValid: this.isPhoneNumberValid,
        internationalNumber: intlNo,
        nationalNumber: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
          : '',
        e164Number: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
          : '',
        countryCode: this.selectedCountry.code.toUpperCase(),
        dialCode: '+' + this.selectedCountry.phoneCode,
      };

      this.propagateChange(phoneData);
    } else {
      this.propagateChange(null);
    }

    el.focus();
  }

  private getParsedNumber(
    phoneNumber: string,
    countryCode: string
  ): lpn.PhoneNumber {
    let number: lpn.PhoneNumber;
    try {
      number = this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
    } catch (e) { }
    // @ts-ignore
    return number;
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const allowedChars = /[0-9\+\-\(\)\ ]/;
    const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
    ];

    if (
      !allowedChars.test(event.key) &&
      !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  public onPhoneNumberChange(): void {
    let countryCode: string | undefined;
    if (this.phoneNumber && typeof this.phoneNumber === 'object') {
      const numberObj: ChangeData = this.phoneNumber;
      this.phoneNumber = numberObj.number;
      countryCode = numberObj.countryCode;
    }

    this.value = this.phoneNumber;
    countryCode = countryCode || this.selectedCountry?.code;
    // @ts-ignore
    const number = this.getParsedNumber(this.phoneNumber, countryCode);

    countryCode = countryCode ? countryCode : this.selectedCountry?.code;


    if (!this.value) {
      this.propagateChange(null);
    } else {

      this.isPhoneNumberValid = this.phoneUtil.isValidNumber(number);

      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';

      const phoneData = {
        number: this.value,
        isValid: this.isPhoneNumberValid,
        internationalNumber: intlNo,
        nationalNumber: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
          : '',
        e164Number: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
          : '',
        countryCode: countryCode.toUpperCase(),
        dialCode: '+' + this.selectedCountry.phoneCode,
      };

      this.propagateChange(phoneData);
    }
  }

  propagateChange = (phoneNumber) => {

    if (phoneNumber.isValid) {
      this.group.get(this.field.key).patchValue(phoneNumber);
    }
    this.settingValue(phoneNumber);
    this.fieldValue.emit({ value: phoneNumber, field: this.field, object: {} });
  };

  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      return this.phoneUtil.format(
        this.phoneUtil.getExampleNumber(countryCode),
        lpn.PhoneNumberFormat[this.numberFormat]
      );
    } catch (e) {
      // @ts-ignore
      return e;
    }
  }


}
