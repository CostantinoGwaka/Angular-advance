import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { DynamicFormService } from '../dynamic-form.service';
import { FieldConfig, FieldType, PreviousDocument } from '../field.interface';
import { listAnimation } from '../../../animations/basic-animation';
import { isObservable, lastValueFrom } from 'rxjs';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { OptionsObservablePipe } from '../../../pipes/options-observable.pipe';
import { DynamicFieldDirective } from '../dynamic-field/dynamic-field.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass, AsyncPipe, JsonPipe } from '@angular/common';
import { FormFieldTrackerService } from '../form-field-tracker.service';

@Component({
  exportAs: 'dynamicForm',
  selector: 'main-dynamic-form',
  templateUrl: 'main-dynamic-form.component.html',
  animations: [listAnimation],
  styleUrls: ['./main-dynamic.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    DynamicFieldDirective,
    AsyncPipe,
    OptionsObservablePipe,
    TranslatePipe
],
})
export class MainDynamicFormComponent implements OnChanges, AfterViewChecked {
  @Input() fields: FieldConfig[] = [];

  @Input() previousDocuments: PreviousDocument[] = [];
  @Output() attachmentView: EventEmitter<PreviousDocument> =
    new EventEmitter<PreviousDocument>();
  @Input() hideSubmitButton = false;
  @Input() formData: any = null;
  @Input() loading = false;
  @Input() hideTopLine = false;
  @Input() fetchingAttachment = false;
  @Input() showRequiredTitle = true;
  @Input() showGeneralErrorMessage = false;
  @Input() generalErrorMessage = '';
  @Input() spaced = false;
  @Input() loadingMessage = 'Please Wait, Loading ...';
  @Input() confirmFirst?: boolean;
  @Input() confirmMessage = '';
  @Input() showCancel = false;
  @Input() cancelText?: string;
  @Input() saveText?: string;
  @Input() saveIcon?: string;
  @Input() hideSave = false;
  @Input() form?: UntypedFormGroup;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() fieldData: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeForm: EventEmitter<any> = new EventEmitter<any>();
  selectedKeyValue = [];
  sortedFields: FieldConfig[] = [];
  isLoading = false;
  formFieldTrackerService = inject(FormFieldTrackerService)
  get value() {
    return this.form?.value;
  }

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private dynamicFormService: DynamicFormService
  ) { }

  cancelForm() {
    this.closeForm.emit();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges() {

    this.isLoading = this.loading;
    if (this.fields) {
      this.sortedFields = this.fields.sort((firstEl, secondEl) => {
        if ((firstEl.order || 999) < (secondEl.order || 999)) {
          return -1;
        }
        if ((firstEl.order || 999) > (secondEl.order || 999)) {
          return 1;
        }
        return 0;
      });
    }
  }

  isVisible(field: FieldConfig, option = null): boolean {
    if (!field) {
      return false;
    }
    const key = field.key as string;
    let visible = false;
    visible = this.dynamicFormService.isVisible(field, this.form, option);

    if (field.visible === false) {
      return false;
    }
    if (field.type !== FieldType.button) {
      if (!visible) {
        this.form?.controls[key]?.setValidators(null);
      } else {
        this.form?.controls[key]?.setValidators(
          this.dynamicFormService.bindValidations(field.validations || [])
        );
      }
      this.form?.controls[key]?.updateValueAndValidity();
    }
    return visible;
  }

  async fieldValue(data: { value: string; field: any; object: any }) {
    this.fieldData.emit({
      value: data.value,
      key: data.field.key,
      field: data.field,
      object: data.object,
    });
    const dataField = this.sortedFields.find(
      (f) => f?.filterValueKey === data.field.key
    );
    const option = isObservable(data.field?.options)
      ? await lastValueFrom(
        data.field?.options?.pipe(
          map((items: any[]) =>
            items ? items.find((opt) => opt.value === data.value) : null
          )
        )
      )
      : data.field.options?.map((items: any) => {
        return items.value === data.value ? items : null;
      });
    this.isVisible(data.field, option);
    if (dataField) {
      this.sortedFields = this.sortedFields.map((field) => {
        return {
          ...field,
        };
      });
    }
  }

  onSubmit(event: Event) {
    this.submit.emit(
      this.dynamicFormService.onSubmit(event, this.form, this.sortedFields)
    );
  }

  onClose() {
    this.closeForm.emit();
  }
}
