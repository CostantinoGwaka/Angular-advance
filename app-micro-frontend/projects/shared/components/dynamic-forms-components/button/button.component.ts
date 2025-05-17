import { Component, OnInit, HostBinding, Output, EventEmitter, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { FieldConfig } from '../field.interface';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SaveAreaComponent } from '../../save-area/save-area.component';

@Component({
    selector: 'app-button',
    template: `
    <!-- <div class="container-fluid" > -->
    @if (!hideSubmitButton) {
      <div class="row">
        <!-- <div class="col-sm-12"> -->
        <div class="col-sm-12" [formGroup]="group">
          <app-save-area
            [showCancel]="showCancel"
            [cancelText]="(cancelText || 'Cancel') | translate"
            [hideSave]="hideSave"
            [saveIcon]="saveIcon || 'save'"
            saveText="{{ (saveText || 'Submit') | translate }}"
            [savingData]="loading"
            [saveDisabled]="group?.invalid"
            [confirmFirst]="confirmFirst"
            [confirmText]="confirmMessage"
            [loadingMessage]="loadingMessage"
            (cancel)="closeForm()"
            [isSubmit]="true"
          ></app-save-area>
        </div>
      </div>
    }
  
    
    `,
    styles: [],
    animations: [fadeIn],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, SaveAreaComponent, TranslatePipe]
})
export class ButtonComponent implements OnInit {
  @Input() field?: FieldConfig;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Input() loading = false;
  @Input() showCancel = false;
  @Input() loadingMessage = 'Please Wait, Loading ...';
  @Input() confirmFirst = false;
  @Input() hideSave = false;
  @Input() hideSubmitButton = false;
  @Input() confirmMessage = '';
  @Input() cancelText?: string;
  @Input() saveText?: string;
  @Input() saveIcon?: string;
  @Output() cancelForm = new EventEmitter();
  constructor() { }

  ngOnInit() {

  }
  closeForm() {
    this.cancelForm.emit();
  }
}
