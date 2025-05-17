import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  OnChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpTextService } from '../../../../services/help-text.service';
import { FieldConfig, FieldType } from '../field.interface';
import { HTMLCleanerUtility } from "../../../utils/html.cleaner.utils";
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { OnlyNumberDirective } from '../../../directives/only-number.directive';
import { MatInputModule } from '@angular/material/input';
import { WordProcessorFormComponent } from '../../word-processor-form/word-processor-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: 'input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    WordProcessorFormComponent,
    NgClass,
    MatInputModule,
    OnlyNumberDirective,
    TranslatePipe
],
})

export class InputComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() field!: FieldConfig;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();
  @Input() hide: boolean = false;
  @Input() loading = false;

  richTextOptions: string[][] = [
    ['bold', 'italic', 'underline', 'strike'],
    ['justifyLeft', 'justifyCenter', 'justifyRight'],
    ['orderedList', 'unOrderedList'],
    ['removeFormat'],
  ];
  value: any;
  disabled = false;
  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  settingValue($event: any): void {
    this.value = $event;
    this.onChange(this.value);
  }

  // @HostBinding('class') rowClass = 'col-md-6';
  constructor(public helpTextService: HelpTextService,
  ) {
  }

  writeValue(value: any): void {
    if (value) {
      this.fieldChange(value);
    }
  }

  openHelpPage() {
    this.helpTextService.openHelpPage({ key: this.field.key, label: this.field.label, hint: this.field.hint }).then();
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
    if (this.field?.inputType !== 'rich-text') {

      //
      // if(this.field.richTextOptions.length) {
      //   this.richTextOptions = this.field.richTextOptions;
      // }
      this.group.addControl(
        this.field?.key || 'id',
        new UntypedFormControl('', [])
      );
    }

    //  this.rowClass = this.field.rowClass === 'large' ? 'col-md-12' : 'col-md-6';
  }

  ngOnChanges() {

    if (this.field?.disabled) {
      this.group.controls[this.field.key as string].disable();
    }
  }
  // Debounce function to delay the execution of a function
  fieldChange(v: any = null) {
    let value = v?.target?.value;
    this.settingValue(value);
    let formattedValue = value;
    if (this.field.inputType !== 'rich-text' && value) {
      formattedValue = value.replace(/(<([^>]+)>)/gi, '');
    }
    if (this.field.key && this.field.inputType !== 'rich-text') {
      this.group.controls[this.field.key].setValue(formattedValue)
    }
    if (this.field.key && this.field.inputType == 'formattedNumber') {
      formattedValue = parseFloat(value.toString().replace(/,/g, ''));
    }
    this.fieldValue.emit({
      value: formattedValue,
      field: this.field,
      object: {}
    });
  }
}

