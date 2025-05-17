import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../field.interface';
import { NumberPipePipe } from '../../../pipes/number-pipe';
import { MatIconModule } from '@angular/material/icon';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumberInputComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, ClickOutsideDirective, NgClass, MatIconModule, DecimalPipe, NumberPipePipe]
})
export class NumberInputComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() field?: FieldConfig;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();
  @ViewChild('inputValue', { static: true }) inputValue?: ElementRef;

  value: any;
  disabled = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  settingValue($event: any): void {
    this.value = $event;
    this.group.patchValue({
      [this.field.key]: $event
    });
    this.onChange(this.value);
  }

  // @HostBinding('class') rowClass = 'col-md-6';
  constructor() { }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.fieldChange(value, 'keyup');
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
    this.group.addControl(
      this.field?.key || 'id',
      new UntypedFormControl('', [])
    );
    //  this.rowClass = this.field.rowClass === 'large' ? 'col-md-12' : 'col-md-6';
  }

  ngOnChanges(changeValue: any) {
    if (this.field?.disabled) {
      this.group.controls[this.field.key as string].disable();
    }


  }

  fieldChange(v: any = null, type: string) {
    let value = v?.target?.value || this.inputValue?.nativeElement?.value;

    try {
      // var regex = /^[+-]?\d{1,3}(,\d{3})*(\.\d+)?$/;
      // value = value.replace(/[^0-9+-,.]/g, "");
      // var isValid = regex.test(value);
      // if(!isValid) {
      //   // value = value.substr(0,value.length-1);
      // } else {
      //   value = value.substr(0,value.length-1);
      // }
    } catch (e) {

    }

    if (this.field.maxInput) {
      value = value > this.field.maxInput ? value : this.field.maxInput
    }
    if (this.field.minInput) {
      value = value > this.field.minInput ? value : this.field.minInput
    }

    // if (this.field.inputType == 'formattedNumber'){
    //   this.value = value.replace(/[A-Za-z]/g, '');
    // this.value = value.replace(/[^+-]?[^0-9]*\.?[^0-9]+/g, '');
    //
    // }

    if (this.field.inputType == 'time') {
      if (type == 'change') {
        this.emitingValue(value)
      }

    } else {
      this.emitingValue(value)
    }

  }

  emitingValue(value) {
    this.settingValue(value);
    this.fieldValue.emit({ value, field: this.field, object: {} });
  }


}
