import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewContainerRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormGroup } from '@angular/forms';
import { FieldConfig, FieldType } from '../field.interface';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { SelectComponent } from '../select/select.component';
import { DateComponent } from '../date/date.component';
import { RadiobuttonComponent } from '../radiobutton/radiobutton.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { Subject } from 'rxjs';
import { AttachmentComponent } from '../attachment/attachment.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { first, takeUntil } from 'rxjs/operators';
import { TimeComponent } from '../time/time.component';
import { PaginatedSelectComponent } from '../paginated-select/paginated-select.component';
import { GroupSelectComponent } from '../group-select/group-select.component';
import { PhoneInputComponent } from "../phone-input/phone-input.component";
import { TimerPickerComponent } from "../app-time-picker/time-picker.component";
import { NumberInputComponent } from '../number-input/number-input.component';

// Define a mapping of field types to components
const componentMapper = {
  input: InputComponent,
  // number:NumberInputComponent,
  button: ButtonComponent,
  select: SelectComponent,
  paginatedselect: PaginatedSelectComponent,
  phoneInput: PhoneInputComponent,
  groupselect: GroupSelectComponent,
  attachment: AttachmentComponent,
  sampleAttachment: AttachmentComponent,
  date: DateComponent,
  // time: TimeComponent,
  time: TimerPickerComponent,
  time24: TimerPickerComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent,
  textarea: TextareaComponent
};

@Directive({
  selector: '[appDynamicField]',
  standalone: true,
})
export class DynamicFieldDirective implements OnChanges, OnDestroy {
  @Input() field: FieldConfig;
  @Input() group: UntypedFormGroup;
  @Input() loading = false;
  @Input() confirmFirst?: boolean;
  @Input() confirmMessage = '';
  @Input() showCancel = true;
  @Input() hideSave = false;
  @Input() hideSubmitButton = false;
  @Input() cancelText?: string;
  @Input() saveText?: string;
  @Input() saveIcon?: string;
  @Input() loadingMessage = 'Please Wait, Loading ...';
  @Input() optionData: any;
  // @Input() visible = true;
  @Output() fieldValue = new EventEmitter();
  @Output() cancelForm = new EventEmitter();
  componentRef: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private container: ViewContainerRef
  ) { }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.componentRef?.destroy();
  }

  ngOnChanges() {
    if (this.field.type === FieldType.button) {
      this.field = { ...this.field, key: 'button' }
    }
    if (this.field.type) {
      this.clear();
      if (this.field.key) {
        this.componentRef = this.container.createComponent(componentMapper[this.field.type]);
        if (this.field.type == 'number') {
          /// TODO handle if number
          //
        }
        this.field.optionData = this.optionData;
        // this.componentRef = this.container.createComponent(factory);
        if (this.componentRef.instance) {
          this.componentRef.instance.field = this.field;
          this.componentRef.instance.group = this.group;
          this.componentRef.instance.loading = this.loading;
          if (this.field.type === FieldType.button) {
            this.componentRef.instance.loadingMessage = this.loadingMessage;
            this.componentRef.instance.confirmFirst = this.confirmFirst || this.field.confirmFirst || false;
            this.componentRef.instance.hideSave = this.hideSave;
            this.componentRef.instance.showCancel = this.showCancel;
            this.componentRef.instance.hideSubmitButton = this.hideSubmitButton;
            this.componentRef.instance.saveText = this.saveText || this.field.label;
            this.componentRef.instance.cancelText = this.cancelText || this.field.cancelText;
            this.componentRef.instance.saveIcon = this.saveIcon || this.field.saveIcon;
            this.componentRef.instance.confirmMessage = this.confirmMessage;
          }
          if (this.componentRef.instance.fieldValue) {
            this.componentRef.instance.fieldValue.pipe(takeUntil(this.destroy$)).subscribe(data => {
              this.fieldValue.emit(data);
            });
          }
        }
      }
      if (this.field.type === FieldType.button) {
        this.componentRef.instance.cancelForm.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.cancelForm.emit();
        });
      }
    }
  }

  clear() {
    this.container.clear();
  }

}
