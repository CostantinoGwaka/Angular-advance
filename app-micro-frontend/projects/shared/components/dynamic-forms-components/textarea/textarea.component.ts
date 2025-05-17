import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpTextService } from '../../../../services/help-text.service';
import { FieldConfig } from '../field.interface';
import { HTMLCleanerUtility } from "../../../utils/html.cleaner.utils";
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-textarea',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @if (field) {
      <mat-form-field class="demo-full-width" [formGroup]="group" appearance="outline">
        <mat-label> {{ field.label | translate}} </mat-label>
        <textarea
          [maxlength]="field.maxCharacter"
          (input)="fieldChange($event)"
          matInput [formControlName]="field.key || null"
          [rows]="field.rowsNumber"
          [placeholder]="field.placeholder || field.label || '' | translate"
          [required]="field.key && group?.get(field.key)?.errors !== null && group?.get(field.key)?.errors?.['required']"
          [readonly]="field.readonly || loading">
        </textarea>
        <mat-icon matSuffix
                  class="pointer text-gray-400
        hover:!text-primary"
          (click)="openHelpPage()">
          help_outline
        </mat-icon>
        <mat-hint
          [align]="'start'"
          [ngClass]="{ danger: field.hintDanger }">
          {{field.hint | translate}}
        </mat-hint>
        @for (validation of field.validations; track validation) {
          <ng-container ngProjectAs="mat-error">
            @if (field.key && group?.get(field.key)?.hasError(validation.name)) {
              <mat-error
                >{{validation.message | translate}}
              </mat-error>
            }
          </ng-container>
        }
      </mat-form-field>
    }
    `,
    // host: {'class': 'col-md-6'},
    styles: [],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, NgClass, TranslatePipe]
})
export class TextareaComponent implements OnInit {
  @Input() field?: FieldConfig;
  @Input() loading = false;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();


  // @HostBinding('class') rowClass = 'col-md-6';
  constructor(private helpTextService: HelpTextService) {
  }

  openHelpPage() {
    this.helpTextService.openHelpPage({ key: this.field.key, label: this.field.label, hint: this.field.hint });
  }

  ngOnInit() {
    //  this.rowClass = this.field.rowClass === 'large' ? 'col-md-12' : 'col-md-6';
  }

  fieldChange(v: any = null) {
    let value = HTMLCleanerUtility.stripHtmlTags(v?.target?.value);
    if (this.field.key) {
      this.group.controls[this.field.key].setValue(value)
    }
    this.fieldValue.emit({ value: value, field: this.field, object: {} });
  }
}
