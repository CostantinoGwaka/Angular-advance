import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  forwardRef,
  OnChanges,
  ViewChild,
  inject
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ControlValueAccessor, UntypedFormControl, UntypedFormGroup, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { HelpTextService } from '../../../../services/help-text.service';
import { FieldConfig } from '../field.interface';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {isASpecialDay} from "../../../../modules/nest-app/app-tender-creation/components/tender-calendar-creation/tender-calendar-creation.component";
import {SettingsService} from "../../../../services/settings.service";
@Component({
    selector: 'app-date',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateComponent),
            multi: true
        }
    ],
    template: `
    @if (field) {
      @if (visible) {
        <mat-form-field class="demo-full-width margin-top" [formGroup]="group" appearance="outline">
          <mat-label> {{ field.label | translate }} </mat-label>
          <input
            (dateChange)="fieldChange($event.value)"
            [required]="field.key && group?.get(field.key)?.errors !== null && group?.get(field.key)?.errors?.['required']"
            matInput [matDatepicker]="picker"
            [matDatepickerFilter]="field.disableWeekendDates ? disableWeekendFilter :field.pickerDateFilters"
            [formControlName]="field.key||null"
            placeholder="{{ field.label || '' | translate }}"
            [min]="field.minDate || null"
            [max]="field.maxDate || null"
            [disabled]="field.disabled || loading"
            readonly>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <!-- <mat-icon matSuffix  class="pointer text-gray-400 hover:!text-primary" (click)="openHelpPage()">help_outline</mat-icon> -->
          <mat-datepicker #picker></mat-datepicker>
          <mat-hint align="start"><strong>{{field.hint}}</strong> </mat-hint>
          @for (validation of field.validations; track validation) {
            <ng-container ngProjectAs="mat-error">
              @if (field.key && group?.get(field.key)?.hasError(validation.name)) {
                <mat-error>{{validation.message | translate }}</mat-error>
              }
              @if (field?.icon) {
                <mat-icon matPrefix>{{field?.icon}}</mat-icon>
              }
            </ng-container>
          }
        </mat-form-field>
      }
    }
    `,
    // host: {'class': 'col-md-6'},
    styles: [],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule, TranslatePipe]
})
export class DateComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() field?: FieldConfig;
  @Input() loading = false;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;
  visible = true;
  value: any;
  disabled = false;
  settingsService= inject(SettingsService)
  onChange: any = () => { };
  onTouched: any = () => { };
  openPicker() {
    this.picker.open();
  }
  openHelpPage() {
    this.helpTextService.openHelpPage({ key: this.field.key, label: this.field.label, hint: this.field.hint }).then();

  }

  disableWeekendFilter: any = (d: Date): boolean => {
    let currentDate = new Date();
    const currentDateString = this.settingsService.formatDate(currentDate, 'YYYY-MM-DD')
    const parameterDateString = this.settingsService.formatDate(d, 'YYYY-MM-DD')
    const day = d ? d.getDay() : currentDate.getDay();
    const date = d ? d : currentDate;
    return (day !== 0 && day !== 6 && !isASpecialDay(date) && parameterDateString >= currentDateString);
  }

  settingValue($event: any): void {
    this.value = $event;
    this.onChange(this.value);
  }
  // @HostBinding('class') rowClass = 'col-md-6';
  constructor(public helpTextService: HelpTextService,
  ) { }

  writeValue(value: any): void {
    if (value) {
      this.fieldChange(value, false);
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
  }
  ngOnInit() {
    //
    this.group.addControl(this.field?.key || 'id', new UntypedFormControl('', []));
    //  this.rowClass = this.field.rowClass === 'large' ? 'col-md-12' : 'col-md-6';
  }

  ngOnChanges() {
    if (this.field?.disabled) {
      if (this.field.key) this.group.controls[this.field.key]?.disable();
    }
  }

  fieldChange(value: any, emit = true) {
    this.settingValue(value);
    if (emit) {
      this.fieldValue.emit({ value, field: this.field, object: {}, key: this.field?.key });
    }
    if (this.field?.key) {
      this.group.controls[this.field.key].setValue(value)
    }
  }

  // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.events.push(`${type}: ${event.value}`);
  // }
}
