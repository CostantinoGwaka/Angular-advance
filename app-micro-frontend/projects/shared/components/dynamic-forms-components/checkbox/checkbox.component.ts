import { Component, OnInit, HostBinding, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpTextService } from '../../../../services/help-text.service';
import { FieldConfig } from '../field.interface';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  @if(field){
    <div class="demo-full-width margin-top" [formGroup]="group" >
        <mat-checkbox
          [disabled]="loading || field.readonly || field.disabled"
          [formControlName]="field?.key || null"
          (change)="toggleCheckbox($event)">{{field.label | translate}}</mat-checkbox>
      </div>
  }

  `,
  // host: {'class': 'col-md-6'},
  styles: [],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, TranslatePipe]
})
export class CheckboxComponent implements OnInit {
  @Input() field?: FieldConfig;
  @Input() loading = false;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  // @HostBinding('class') rowClass = 'col-md-6';
  @Output() fieldValue = new EventEmitter();
  constructor(public helpTextService: HelpTextService) { }
  ngOnInit() {
    //  this.rowClass = this.field.rowClass === 'large' ? 'col-md-12' : 'col-md-6';
  }
  openHelpPage() {
    this.helpTextService.openHelpPage({ key: this.field.key, label: this.field.label, hint: this.field.hint });

  }

  toggleCheckbox(event: any) {
    this.fieldValue.emit({ value: event.checked, field: this.field });
  }
}
