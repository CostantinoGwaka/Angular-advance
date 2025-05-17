import { ChangeDetectorRef, ComponentRef, Directive, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, first, takeUntil } from 'rxjs/operators';
import { PaginatedSelectComponent } from '../paginated-select/paginated-select.component';
import { GroupSelectComponent } from '../group-select/group-select.component';
import { PhoneInputComponent } from "../phone-input/phone-input.component";
import { TimerPickerComponent } from "../app-time-picker/time-picker.component";
import { DynamicFormService } from '../dynamic-form.service';
import { FormFieldTrackerService } from '../form-field-tracker.service';

// Mapping field types to corresponding components
const componentMapper = {
    input: InputComponent,
    button: ButtonComponent,
    select: SelectComponent,
    paginatedselect: PaginatedSelectComponent,
    phoneInput: PhoneInputComponent,
    groupselect: GroupSelectComponent,
    attachment: AttachmentComponent,
    sampleAttachment: AttachmentComponent,
    date: DateComponent,
    time: TimerPickerComponent,
    time24: TimerPickerComponent,
    radiobutton: RadiobuttonComponent,
    checkbox: CheckboxComponent,
    textarea: TextareaComponent
};

@Directive({
    selector: '[appDynamicField22]',
    standalone: true,
})
export class DynamicFieldDirective22 implements OnChanges, OnDestroy {
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

    @Output() fieldValue = new EventEmitter();
    @Output() cancelForm = new EventEmitter();


    // Reference to the dynamically created component
    componentRef: ComponentRef<any>;

    // Subject to handle unsubscription on destroy
    private destroy$: Subject<void> = new Subject<void>();

    // Injecting services
    private formFieldTrackerService = inject(FormFieldTrackerService);
    private dynamicFormService = inject(DynamicFormService);
    private cdr = inject(ChangeDetectorRef);

    constructor(private container: ViewContainerRef) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        const key = this.field?.key;
        if (key) {
            this.formFieldTrackerService.removeComponentRef(key);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.field.type && this.field.key) {
            const key = this.field.key;

            const fieldChange = changes['field'];
            const previousField = this.formFieldTrackerService.getPreviousField(this.field.key);

            // Check if the field configuration has changed
            const hasFieldChanged = fieldChange &&
                !this.dynamicFormService.deepCompareObjects(previousField || {}, fieldChange.currentValue || {});

            if (!hasFieldChanged) {
                return;
            }

            // // Get or create the component reference
            let componentRef = this.formFieldTrackerService.getPreviousComponentRef(key);

            // if (componentRef) {
            //   // If the componentRef exists, update it
            //   this.updateComponentRef(componentRef);
            // } else {
            // If the componentRef doesn't exist, create a new one
            this.clear();
            componentRef = this.container.createComponent(componentMapper[this.field.type]);
            this.formFieldTrackerService.updateComponentRef({ [key]: componentRef });
            this.initializeComponent(componentRef);
            // }

            // Trigger change detection manually to ensure updates are rendered
            this.cdr.detectChanges();
        }
    }

    private updateComponentRef(componentRef: ComponentRef<any>): void {
        if (componentRef.instance) {

            componentRef.instance.field = this.field;
            componentRef.instance.group = this.group;
            componentRef.instance.loading = this.loading;


            // Trigger change detection manually
            this.cdr.detectChanges();
        }
    }

    private initializeComponent(componentRef: ComponentRef<any>): void {
        componentRef.instance.field = this.field;
        componentRef.instance.group = this.group;
        componentRef.instance.loading = this.loading;

        if (this.field.type === FieldType.button) {
            componentRef.instance.loadingMessage = this.loadingMessage;
            componentRef.instance.confirmFirst = this.confirmFirst || this.field.confirmFirst || false;
            componentRef.instance.hideSave = this.hideSave;
            componentRef.instance.showCancel = this.showCancel;
            componentRef.instance.hideSubmitButton = this.hideSubmitButton;
            componentRef.instance.saveText = this.saveText || this.field.label;
            componentRef.instance.cancelText = this.cancelText || this.field.cancelText;
            componentRef.instance.saveIcon = this.saveIcon || this.field.saveIcon;
            componentRef.instance.confirmMessage = this.confirmMessage;
        }

        if (componentRef.instance.fieldValue) {
            componentRef.instance.fieldValue.pipe(
                debounceTime(100),  // Delay to handle rapid changes
                distinctUntilChanged(), // Ignore unchanged values
                takeUntil(this.destroy$) // Automatically unsubscribe on destroy
            ).subscribe(data => {
                this.fieldValue.emit(data);
            });
        }
    }

    private clear(): void {
        this.container.clear();
    }
}
