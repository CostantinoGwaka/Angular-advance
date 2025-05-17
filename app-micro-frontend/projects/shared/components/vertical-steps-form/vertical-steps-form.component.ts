import { CircularProgressBarComponent } from '../circular-progress-bar/circular-progress-bar.component';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  computed,
  effect,
} from '@angular/core';
import { VerticalStepsFormStep } from './interfaces/vertical-steps-form-step';
import { colors } from 'src/app/shared/colors';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  VerticalStepsFormField,
  VisibilityControl,
} from './interfaces/vertical-steps-form-field';
import { EditableListItem } from '../editable-list-items-selector/editable-list-item/editable-list-item.component';
import {
  EditableListItemSelection,
  EditableListItemsSelectorComponent,
} from '../editable-list-items-selector/editable-list-items-selector.component';
import { InputConstraintType } from '../../../modules/nest-tender-initiation/store/settings/input-constraint/input-constraint.model';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../store';
import {
  KeyValueItemSelection,
  KeyValueListInputComponent,
} from '../key-value-list-input/key-value-list-input.component';
import { KeyValueItem } from '../key-value-list-input/key-value-input/key-value-input.component';
import { HelpTextService } from '../../../services/help-text.service';
import { firstValueFrom, map, Observable, Subscription } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { GraphqlService } from '../../../services/graphql.service';
import { AttachmentService } from '../../../services/attachment.service';
import { first } from 'rxjs/operators';
import { AuthUser } from '../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { selectModifiedAuthUsers } from '../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { NotificationService } from '../../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../../../services/general.service';
import { SettingsService } from '../../../services/settings.service';
import { LoaderComponent } from '../loader/loader.component';
import { WordProcessorFormComponent } from '../word-processor-form/word-processor-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StepItemComponent } from './step-item/step-item.component';
import { NgClass, CommonModule } from '@angular/common';
import {
  SaveFunctionResult,
  UpdatedFormItem,
  VerticalStepsFormService,
  VerticalStepsFormStatus,
} from './vertical-steps-form.service';
import { TimerPickerComponent } from '../dynamic-forms-components/app-time-picker/time-picker.component';
import { FieldType } from '../dynamic-forms-components/field.interface';
import { ItemsListViewComponent } from './items-list-view/items-list-view.component';

export interface ItemsToShow {
  uuid: string;
  label: string;
  name: string;
  value: any;
  stepIndex: number;
  stepName: string;
  status: VerticalStepsFormStatus;
}
@Component({
  selector: 'vertical-steps-form',
  templateUrl: './vertical-steps-form.component.html',
  styleUrls: ['./vertical-steps-form.component.scss'],
  standalone: true,
  imports: [
    CircularProgressBarComponent,
    StepItemComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    WordProcessorFormComponent,
    LoaderComponent,
    NgClass,
    EditableListItemsSelectorComponent,
    KeyValueListInputComponent,
    TimerPickerComponent,
    CommonModule
],
})
export class VerticalStepsFormComponent implements OnInit, OnDestroy {
  colors = colors;
  showProgress = true;
  @Input() isSaving: boolean = false;
  @Output() onSave = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @Output() isComplete = new EventEmitter();
  @Output() onSubmitClicked = new EventEmitter();
  @Output() onStepSelection = new EventEmitter();
  @Output() createNewOption = new EventEmitter();
  @Output() createNewKeyValueInput = new EventEmitter();
  @Output() onInputChange = new EventEmitter();
  @Input() steps: VerticalStepsFormStep[];
  @Input() description: String;

  @Input() saveFunction: (payload: any) => Promise<SaveFunctionResult>;

  @ViewChild('progressRef')
  progressRef: CircularProgressBarComponent;

  @ViewChild('saveProgressRef')
  saveProgressRef: CircularProgressBarComponent;

  formSubscription?: Subscription;
  showHint: boolean = false;
  selectedField: string;
  minDate: string;
  savingFile: boolean = false;
  documentReader: string;
  showPreview: any = {};
  documentLoading: { [key: string]: boolean } = {};
  user$: Observable<AuthUser>;
  user: AuthUser;
  formUpdated: boolean = false;

  saveProgressChanged = computed(() => this.saveProgressPercent());
  errorMessage = this.verticalStepsFormService.errorMessage;

  isInitialLoading = true;

  constructor(
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private settingService: SettingsService,
    private apollo: GraphqlService,
    private attachmentService: AttachmentService,
    private notificationService: NotificationService,
    private store: Store<ApplicationState>,
    private dialog: MatDialog,
    private helpTextService: HelpTextService,
    private generalService: GeneralService,
    public verticalStepsFormService: VerticalStepsFormService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.user$ = this.store.pipe(
      select(selectModifiedAuthUsers),
      map((users) => users[0])
    );

    effect(() => {
      this.saveProgressRef?.updateValue(this.saveProgressPercent());
    });
  }

  completionProgress = 10;
  saveProgressPercent = this.verticalStepsFormService.savedItemsPercent;
  form: UntypedFormGroup;

  ngOnInit(): void {
    this.verticalStepsFormService.init();
    this.initializer().then();

    console.log('steps deatils',this.steps);
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    this.reactToFormEvents(event);
  }

  @HostListener('keyup', ['$event'])
  handleKeyUp(event: Event) {
    this.reactToFormEvents(event);
  }

  reactToFormEvents(event: Event) {
    if (event.target instanceof HTMLElement) {
      let element: HTMLElement = event.target;

      if (this.isChildOfForm(element)) {
        this.formUpdated = true;
        this.isInitialLoading = false;
        return;
      }

      while (element) {
        if (element.tagName.toLowerCase() === 'form') {
          this.formUpdated = true;
          this.isInitialLoading = false;
          break;
        }
        element = element.parentElement;
      }
    }
  }

  isChildOfForm(element: HTMLElement): boolean {
    while (element) {
      if (element.tagName.toLowerCase() === 'form') {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }

  initCopy() {
    this.formUpdated = true;
    this.isInitialLoading = false;
  }

  private subscriptions: Subscription[] = [];

  async initializer(): Promise<void> {
    this.user = await firstValueFrom(
      this.user$.pipe(first((i) => !!i && !!i.procuringEntity))
    );
    this.setCurrentForm();
    this.buildForm(this.steps);

    this.subscriptions.push(
      this.form.valueChanges.subscribe((values) => {
        if (this.formUpdated) {
          this.formUpdated = false;
          this.onInputChanged(values);
        }
        this.updateFullProgress();
      })
    );

    Object.keys(this.form.controls).forEach((key) => {
      this.subscriptions.push(
        this.form.get(key).valueChanges.subscribe((value) => {
          if (this.formUpdated) {
            let fieldUuid = this.getFieldUuidFromLabel(key);
            this.verticalStepsFormService.addItemToSave(
              fieldUuid,
              value,
              key,
              value != null ? 'pending' : 'ready'
            );
          }
        })
      );
    });
  }

  getFieldUuidFromLabel(label: string) {
    let fieldUuid = '';
    for (let i = 0; i < this.steps.length; i++) {
      let fields = this.steps[i].fields;
      for (let k = 0; k < fields.length; k++) {
        if (fields[k]['fieldName'] == label) {
          fieldUuid = fields[k].uuid;
          break;
        }
      }
    }
    return fieldUuid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  showInputHint(field: VerticalStepsFormField) {
    this.helpTextService
      .openHelpPage({ key: field.uuid, label: field.label, hint: null })
      .then();
  }

  showUnfilledItems() {
    let items = this.setItemsToShow(
      this.verticalStepsFormService.unfilledItems()
    );
    this.showItemsList(
      `Unfilled Items List (${items.length})
    `,
      items
    );
  }

  goToItem(item: ItemsToShow) {
    this.onStepClick(item.stepIndex);
    setTimeout(() => {
      const element = document.querySelector(`#field-${item.name}`);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }

  showUnsavedItems() {
    let items = this.setItemsToShow(
      this.verticalStepsFormService.unsavedItems()
    );
    this.showItemsList(
      `Unsaved Items List (${items.length})
    `,
      items
    );
  }

  searchFields() {
    let items: ItemsToShow[] = this.steps
      .map((step) => step.fields)
      .flat()
      .map((field) => {
        return {
          uuid: field.uuid,
          label: field.label,
          name: field.name,
          stepIndex: this.steps.indexOf(
            this.steps.find((step) => step.fields.includes(field))
          ),
          stepName: this.steps.find((step) => step.fields.includes(field))
            .label,
          value: field.value,
          status: field.value != null ? 'saved' : 'ready',
        };
      });
    this.showItemsList(`Items List (${items.length})`, items);
  }

  showItemsList(title: string, items: ItemsToShow[]) {
    this.dialog.open(ItemsListViewComponent, {
      data: {
        title: title,
        fields: items,
        onItemClick: (item: ItemsToShow) => {
          this.goToItem(item);
        },
      },
      width: '60%',
    });
  }

  getItemStatus(item: ItemsToShow): { text: string; color: string } {
    switch (item.status) {
      case 'saved':
        if (
          item.value === null ||
          item.value === '' ||
          item.value === undefined ||
          item?.value?.length === 0
        ) {
          return { text: 'Saved but not filled', color: '#ffc107' };
        } else {
          return { text: 'Saved', color: '#28a745' };
        }
      case 'ready':
        return { text: 'Not filled', color: '#ffc107' };
      case 'pending':
        return { text: 'Not Saved', color: '#ffc107' };
      case 'failed':
        return { text: 'Failed to save', color: '#dc3545' };
      default:
        return { text: 'Ready', color: '#ffc107' };
    }
  }

  setItemsToShow(updatedItems: UpdatedFormItem[]): ItemsToShow[] {
    let itemsToShow: ItemsToShow[] = [];

    for (let i = 0; i < updatedItems.length; i++) {
      let updatedItem = updatedItems[i];
      let step = this.steps.find((step) =>
        step.fields.find((field) => field.uuid == updatedItem.itemUuid)
      );
      let field = step.fields.find(
        (field) => field.uuid == updatedItem.itemUuid
      );

      itemsToShow.push({
        uuid: field.uuid,
        label: field.label,
        name: field.name,
        stepIndex: this.steps.indexOf(step),
        stepName: step.label,
        value: updatedItem.value,
        status: updatedItem.status,
      });
    }
    return itemsToShow;
  }

  updateFullProgress = () => {
    let totalFields = 0;
    let totalFilled = 0;
    let formFields = this.form.value;
    let fillableItems: UpdatedFormItem[] = [];
    let initialLoadItems: UpdatedFormItem[] = [];
    for (let i = 0; i < this.steps.length; i++) {
      let stepCompleted = false;
      let totalStepFields = 0;
      let totalStepCompletedFields = 0;
      let invalidField = 0;
      let fields = this.steps[i].fields;
      for (let k = 0; k < fields.length; k++) {
        let field = fields[k];
        if (field.name && !field.isHidden) {
          fillableItems.push({
            itemUuid: field.uuid,
            label: field.name,
            value: field.value,
            status: 'pending',
          });
          totalFields++;
          totalStepFields++;
          let checkField = this.checkForDataFieldConstraint(field);
          if (!checkField.isValid && field?.constraint) {
            invalidField++;
          }
          const isFilled: boolean =
            (formFields[field.name] != '' ||
              typeof formFields[field.name] === 'number') &&
            formFields[field.name] != null &&
            checkField.isValid;
          if (isFilled) {
            totalStepCompletedFields++;
            totalFilled++;
            initialLoadItems.push({
              itemUuid: field.uuid,
              label: field.name,
              value: field.value,
              status: 'saved',
            });
          } else {
            initialLoadItems.push({
              itemUuid: field.uuid,
              label: field.name,
              value: field.value,
              status: 'ready',
            });
          }
        }
      }

      this.steps[i].hasInvalidField = invalidField > 0;

      if (totalStepCompletedFields > 0) {
        if (totalStepFields == totalStepCompletedFields) {
          stepCompleted = true;
        }
      }
      this.steps[i].isComplete = stepCompleted;
    }

    if (this.isInitialLoading) {
      this.verticalStepsFormService.initiateItems(initialLoadItems);
    }
    // else {
    //
    //   this.verticalStepsFormService.updateItemsList(fillableItems);
    // }

    this.completionProgress = parseInt(
      ((totalFilled / totalFields) * 100).toString().split('.')[0]
    );

    if (this.completionProgress == 100) {
      this.isComplete.emit();
    }
    this.progressRef?.updateValue(this.completionProgress);
  };

  updateSaveProgress = () => {};

  checkForDataFieldConstraint(
    field: VerticalStepsFormField
  ): VerticalStepsFormField {
    if (field) {
      let fieldValue = this.getFieldValue(field.name);
      if (fieldValue != null && field?.constraint) {
        if (
          field.constraint.type == InputConstraintType.INTEGER ||
          field.constraint.type == InputConstraintType.DOUBLE
        ) {
          if (field.constraint.type == InputConstraintType.DOUBLE) {
            fieldValue = parseFloat(fieldValue);
          }
          if (field.constraint.type == InputConstraintType.INTEGER) {
            fieldValue = parseInt(fieldValue);
          }

          if (
            field.constraint.minimumValue != null &&
            field.constraint.maximumValue != null
          ) {
            if (
              field.constraint.minimumValue <= fieldValue &&
              fieldValue <= field.constraint.maximumValue
            ) {
              field = { ...field, isValid: true };
            }
          } else if (
            field.constraint.minimumValue != null &&
            field.constraint.maximumValue == null
          ) {
            if (field.constraint.minimumValue <= fieldValue) {
              field = { ...field, isValid: true };
            }
          } else if (
            field.constraint.minimumValue == null &&
            field.constraint.maximumValue != null
          ) {
            if (fieldValue <= field.constraint.maximumValue) {
              field = { ...field, isValid: true };
            }
          } else {
            field = { ...field, isValid: false };
            this.touchField(field.name);
          }
        }
      } else {
        field = { ...field, isValid: true };
      }
      // check if it has affectGeneralConstraint
      if (field?.affectGeneralConstraint) {
        this.checkForGeneralConstraint(field);
      }
    }
    return field;
  }

  getFieldByName(name: string) {
    let matchedField: VerticalStepsFormField = null;
    for (let i = 0; i < this.steps.length; i++) {
      let fields = this.steps[i].fields;
      for (let k = 0; k < fields.length; k++) {
        if (fields[k].name == name) {
          matchedField = fields[k];
          break;
        }
      }
    }
    return matchedField;
  }
  checkForGeneralConstraint(field: VerticalStepsFormField) {
    let step = this.getStepByFieldName(field.name);
    step.hasInvalidGeneralConstraint = false;
    if (step?.generalConstraint) {
      const constraints = step?.generalConstraint?.filter((constraint) =>
        constraint.fieldsName.includes(field.name)
      );
      if (constraints && constraints.length) {
        for (let i = 0; i < constraints.length; ++i) {
          const constraint = constraints[i];
          const fieldNames = constraint.fieldsName;
          let inputFields = [];
          let total = 0;
          for (let i = 0; i < fieldNames.length; ++i) {
            const value = this.getFieldValue(fieldNames[i]);
            inputFields[i] = value ? parseInt(value) : 0;
            total += inputFields[i];
          }

          if (constraint.type == 'SUM') {
            if (total == constraint.value) {
              for (let i = 0; i < fieldNames.length; ++i) {
                let field = this.getFieldByName(fieldNames[i]);
                field = { ...field, isValid: true };
                this.unTouchField(fieldNames[i]);
                constraint.errorMessage = null;
              }
            } else {
              constraint.errorMessage = 'Sum of ';
              let allConstraintAvailable = true;
              for (let i = 0; i < fieldNames.length; ++i) {
                let field = this.getFieldByName(fieldNames[i]);
                if (field === null) {
                  allConstraintAvailable = false;
                } else {
                  field = { ...field, isValid: false };
                  constraint.errorMessage += field.label;
                  if (fieldNames.length - 1 != i) {
                    constraint.errorMessage += ', ';
                  }
                  this.touchField(fieldNames[i]);
                }
              }
              if (allConstraintAvailable) {
                constraint.errorMessage += ' must be ' + constraint.value;
              } else {
                constraint.errorMessage = '';
              }
            }
          }
        }
      }

      step.generalConstraint?.forEach((constraint) => {
        if (constraint.errorMessage != null) {
          step.hasInvalidGeneralConstraint = true;
        }
      });
    }
  }

  getStepByFieldName(name: string) {
    for (let i = 0; i < this.steps.length; i++) {
      let fields = this.steps[i].fields;
      for (let k = 0; k < fields.length; k++) {
        if (fields[k].name == name) {
          return this.steps[i];
        }
      }
    }
    return null;
  }

  updateFieldValue = (
    fieldName: string,
    value: any,
    field?: VerticalStepsFormField
  ): void => {
    try {
      this.updateFormFieldValue(fieldName, value);
      this.form.controls[fieldName].setValue(value);
      if (field != null) {
        field.value = value;
      }
    } catch (e) {}
  };

  // updateFormFieldValue = (fieldName: string, fieldValue: string): void => {
  //   console.log('updateFormFieldValue', fieldName);
  //   this.steps = this.steps.map((step: VerticalStepsFormStep) => {
  //     step.fields = step.fields.map((field) => {
  //       if (field.name === fieldName) {
  //         return {
  //           ...field,
  //           value: fieldValue,
  //         };
  //       }
  //
  //       console.log('field', field);
  //       return field;
  //     });
  //     return step;
  //   });
  // };

  updateFormFieldValue = (fieldName: string, fieldValue: string): void => {
    // console.log('updateFormFieldValue', fieldName, 'Value:', fieldValue);

    this.steps.forEach((step: VerticalStepsFormStep) => {
      step.fields.forEach((field) => {
        if (field.name === fieldName) {
          // console.log('Before update:', field);
          field.value = fieldValue;
          field.isHidden = field.isHidden ?? false; // Ensure isHidden is not lost
          // console.log('After update:', field);
        }
      });
    });
  };

  touchField = (fieldName: string) => {
    try {
      this.form.controls[fieldName].setErrors({ incorrect: true });
      this.form.controls[fieldName].markAsTouched();
    } catch (e) {}
  };

  unTouchField = (fieldName: string) => {
    try {
      this.form.controls[fieldName].setErrors(null);
      this.form.controls[fieldName].markAsUntouched();
    } catch (e) {
      //	advancePaymentPercentageLocal, onAcceptancePaymentPercentLocal, percentagePaymentOnDelivery
    }
  };

  getFieldValue = (fieldName: string) => {
    try {
      return this.form.controls[fieldName].getRawValue();
    } catch (e) {
      return null;
    }
  };

  buildForm(steps: VerticalStepsFormStep[]) {
    let formFields: any = {};
    for (let i = 0; i < steps.length; i++) {
      let fields = steps[i].fields;
      for (let k = 0; k < fields.length; k++) {
        let field = fields[k];
        if (field.name) {
          formFields[field.name] = [field?.value != null ? field.value : null];
        }
      }
    }

    this.form = this.fb.group(formFields);
    this.updateFullProgress();
    this.onStepClick(0);
  }

  onFormAreaClick() {
    this.verticalStepsFormService.itemToGoTo = null;
  }

  onEditableListItemSelect(
    selection: EditableListItemSelection,
    fieldName: string
  ) {
    this.onFileSelection(fieldName, selection);
    this.setEditableListItemSelection(fieldName, selection.list);
    this.trackUntrackedField(fieldName);
  }

  trackUntrackedField(fieldName: string) {
    //get field by field name
    let field = this.steps
      .map((step) => step.fields)
      .flat()
      .find((field) => field.name === fieldName);
    this.verticalStepsFormService.addItemToSave(
      field.uuid,
      field.value,
      fieldName
    );
  }

  setEditableListItemSelection(fieldName: string, options: EditableListItem[]) {
    let selectedValues: string[] = options
      .filter((option) => option.isSelected)
      .map((option) => option.value);
    this.updateFieldValue(fieldName, selectedValues);
  }

  onEditableListItemRemoved(
    selection: EditableListItemSelection,
    fieldName: string
  ) {
    this.setEditableListItemSelection(fieldName, selection.list);
  }

  onKeyValueItemSelect(selection: KeyValueItemSelection, fieldName: string) {
    this.setKeyValueItemSelection(fieldName, selection.list);
  }

  setKeyValueItemSelection(fieldName: string, options: KeyValueItem[]) {
    let selectedValues: string[] = options.map((option) => option.uuid);
    this.updateFieldValue(fieldName, selectedValues);
  }

  onKeyValueItemRemoved(selection: KeyValueItemSelection, fieldName: string) {
    this.setKeyValueItemSelection(fieldName, selection.list);
  }

  setVisible(visibilityControlField: VisibilityControl) {
    if (!visibilityControlField) {
      return true;
    } else {
      return (
        this.form.get(visibilityControlField.field).value ==
        visibilityControlField.requiedValue
      );
    }
  }

  handleSave(step: any, onSaveSuccessfulFunction: () => void) {
    const isFormComplete = this.completionProgress == 100;
    const dataToSave = {
      formValue: this.form.value,
      isFormComplete,
      step,
    };

    this.verticalStepsFormService.saveItems(
      dataToSave,
      this.saveFunction,
      onSaveSuccessfulFunction
    );
  }

  handleSubmit(step: any) {
    const isFormComplete = this.completionProgress == 100;
    if (isFormComplete) {
      this.onSubmitClicked.emit(true);
    }
    // console.log(isFormComplete);
    // const dataToSave = {
    //   ...this.form.value,
    //   isFormComplete,
    //   step,
    // };
    // this.verticalStepsFormService.saveItems(
    //   dataToSave,
    //   this.saveFunction,
    //   () => {
    //     this.onSubmit.emit(dataToSave);
    //   }
    // );
  }

  onNewOptionCreated(description: string, fieldLabel: string) {
    this.createNewOption.emit({ description, fieldLabel });
  }

  onNewKeyValueInputCreated(formValues: any, fieldLabel: string) {
    this.createNewKeyValueInput.emit({ formValues, fieldLabel });
  }

  onStepClick(index: number) {
    this.steps = this.steps.map(
      (_step: VerticalStepsFormStep, _index: number) => ({
        ..._step,
        isActive: _index == index,
      })
    );

    let currentStep = this.steps.filter((step) => step.isActive == true)[0];
    if (currentStep) {
      currentStep.fields.forEach((field) => {
        if (!field.isValid) {
          this.touchField(field.name);
        }
      });
    }
    this.setCurrentForm();
    this.scrollToTop();
  }

  scrollToTop() {
    this.onStepSelection.emit();
  }

  switchStep(from: number, to: number) {
    if (from != -1) {
      this.steps[from].isActive = false;
      this.steps[to].isActive = true;
    }
    this.scrollToTop();
  }

  save(fromStep: number, direction: 'next' | 'prev' = null) {
    this.verticalStepsFormService.itemToGoTo = null;
    let _formStep =
      this.steps[fromStep == -1 ? this.steps.length - 1 : fromStep];

    this.handleSave(_formStep, () => {
      if (this.onSave) {
        this.onSave.emit();
      }
      let nextStep = null;
      if (direction) {
        nextStep = direction == 'next' ? fromStep + 1 : fromStep - 1;
        this.switchStep(fromStep, nextStep);
      }
    });
  }

  setCurrentForm() {
    //this.currentForm = this.steps.filter((step) => step.isActive)[0];
    //this.currentForm = this.steps.filter((step) => step.isActive)[0];
  }

  onFileSelection(event: any, field: VerticalStepsFormField | any) {
    if (!event?.target) {
      return;
    }

    this.savingFile = true;
    let fileValue: File = event.target.files[0];

    this.convertToBase64(fileValue)
      .then(async (base64String: string) => {
        const attachmentData = await this.attachmentService.addAttachment(
          base64String.replace('data:application/pdf;base64,', ''),
          this.user.uuid,
          'Additional Field for ' + this.description,
          'Additional Field for ' + this.description,
          34488,
          'AdditionalField',
          'AdditionalField',
          'Additional Field Attachments'
        );

        if (attachmentData) {
          const attachmentUuid = attachmentData.data[0].uuid;
          field.value = attachmentUuid;
          this.updateFieldValue(field.name, attachmentUuid);
        } else {
          this.notificationService.errorMessage(
            'Failed to save ' + field?.label + ' field. Please retry'
          );
        }
        this.savingFile = false;
      })
      .catch((error) => {
        console.error(error);
        this.savingFile = false;
      });
  }

  convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  selectFile(fieldInput) {
    document.getElementById(fieldInput).click();
  }

  async previewDocument(field: VerticalStepsFormField) {
    if (field?.value) {
      this.documentLoading[field.name] = true;
      this.documentReader = await this.attachmentService.getAttachment(
        field?.value
      );
      this.settingService
        .viewFile(this.documentReader, 'pdf')
        .then((response) => {
          this.documentLoading[field.name] = false;
        });
    } else {
      this.notificationService.errorMessage(
        'Attachment not found. Please close preview and try again'
      );
    }
  }

  async removeDocument(field: VerticalStepsFormField) {
    let result = await this.generalService.confirmation({
      uuid: field?.value,
      title: 'Remove Document',
      message:
        'By proceeding, this document for ' +
        field.label +
        ' will be removed. Would you like to proceed?',
      showTextInputField: false,
      textColor: 'text-primary',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });
    if (result?.status) {
      await this.processDocumentRemove(field);
    }
  }

  async processDocumentRemove(field: VerticalStepsFormField) {
    try {
      const response = await this.attachmentService.deleteAttachmentDocuments([
        field?.value,
      ]);
      if (response == 'SUCCESS') {
        this.updateFieldValue(field.name, null, field);
      }
    } catch (e) {
      console.error(e);
    }
  }

  onInputChanged(change: any) {
    if (this.onInputChange) {
      this.onInputChange.emit(change);
    }
  }

  protected readonly FieldType = FieldType;
}
