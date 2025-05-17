import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppTimePickerComponent } from './app-time-picker.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from "../field.interface";
import { HelpDialogComponent } from '../help-dialog-component/help-dialog-component.component';
import { HelpTextService } from '../../../../services/help-text.service';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


// export interface Time {
//   hour: string;
//   minute: string;
// }


@Component({
    selector: 'app-time-picker',
    templateUrl: './time-picker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimerPickerComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule]
})
export class TimerPickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() field?: FieldConfig;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();
  selectedTime = '';

  constructor(private matDialog: MatDialog, public helpTextService: HelpTextService) {
  }
  openHelpPage() {
    const dialogRef = this.matDialog.open(HelpDialogComponent, {
      width: '400px',
      height: '100%',
      position: {
        right: '0'
      },
      data: this.field
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field']?.currentValue?.value) {
      this.selectedTime = this.field.value;
    }
  }

  onClick() {
    this.onTouched();
    this.openDialog().then();
  }

  ngOnInit() {
    if (this.field?.key && this.group?.value && this.group?.value[this.field?.key]) {
      this.writeValue(this.group?.value[this.field?.key]);
    } else if (this.field.value) {
      this.writeValue(this.field.value);
    }
  }

  isValidTime(time: string) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  onChange = (selectedTime: any) => {
  };
  onTouched = () => {
  };

  disabled: boolean = false;

  writeValue(value: any) {
    if (this.isValidTime(value)) {
      this.selectedTime = value;
    }
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  async openDialog() {
    const maxTimeArr = this.field.maxTime?.split(':') || ['23', '59'];
    const minTimeArr = this.field.minTime?.split(':') || ['00', '00'];

    const res = await lastValueFrom(
      this.matDialog.open(AppTimePickerComponent,
        {
          data: {
            selectedTime: this.selectedTime,
            maxHours: +maxTimeArr[0],
            minHours: +minTimeArr[0],
            maxMinutes: +maxTimeArr[1],
            minMinutes: +minTimeArr[1]
          }
        }
      ).afterClosed()
    );

    if (res !== undefined) {
      if (res.hour == '' && res.minute == '') {
        this.selectedTime = '';
      } else {
        this.selectedTime = res?.hour + ':' + res?.minute;
      }
      if (this.field?.key) this.group.controls[this.field.key]?.setValue(this.selectedTime);
      this.fieldValue.emit({ value: this.selectedTime, field: this.field, object: {} });
      this.onChange(this.selectedTime);
    }
  }
}
