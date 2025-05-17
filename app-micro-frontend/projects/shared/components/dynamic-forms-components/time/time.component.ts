import { Component, OnInit, HostBinding, EventEmitter, Output, ElementRef, ViewChild, HostListener, ChangeDetectionStrategy, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../field.interface';
import { TimePickerComponent } from './time-picker.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-time',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @if (field) {
      <div #inputValue >
        <mat-form-field class="demo-full-width margin-top" [formGroup]="group" appearance="outline">
          <mat-label> {{ field.label }} </mat-label>
          <input   [required]="field.key && group.get(field.key)?.errors !== null && group.get(field.key)?.errors?.['required']" matInput [formControlName]="field.key || null" [placeholder]="field.label || ''" readonly>
          <mat-icon style="cursor: pointer;" (click)="showPicker = true" matSuffix>access_time</mat-icon>
          <mat-hint align="start"><strong>{{field.hint}}</strong> </mat-hint>
          @for (validation of field.validations; track validation) {
            <ng-container ngProjectAs="mat-error">
              @if (field.key && group?.get(field.key)?.hasError(validation.name)) {
                <mat-error>{{validation.message}}</mat-error>
              }
            </ng-container>
          }
        </mat-form-field>
        @if (showPicker) {
          <span class="float"  >
            <doc-timepicker  class="my-float" (close)="showPicker = false" [(ngModel)]="someDate" (ngModelChange)="fieldChange()"></doc-timepicker>
          </span>
        }
      </div>
    }
    `,
    // host: {'class': 'col-md-6'},
    styles: ['.danger { color:red }',
        '.float{  position:fixed;   z-index: 2; bottom:10%;  right:35px;border-radius:50px; text-align:center; box-shadow: 2px 2px 3px #999; }',
        ' .my-float{ margin-top:22px;}'],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, TimePickerComponent]
})
export class TimeComponent implements OnInit {
  @Input() field?: FieldConfig;
  @Input() loading = false;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  showPicker = false;

  someDate: Date = new Date();
  @Output() fieldValue = new EventEmitter();
  // @HostBinding('class') rowClass = 'col-md-6';
  @ViewChild('inputValue', { static: true }) inputValue?: ElementRef;

  constructor() {

  }

  // @HostListener('document:click', ['$event.target'])
  // public onClick(target: any) {
  //   const clickedInside = this.inputValue?.nativeElement.contains(target);
  //   if (!clickedInside) {
  //     this.showPicker = false;
  //   }
  // }

  ngOnInit() {

    try {
      if (this.field?.key) {
        const hh = + this.group.controls[this.field.key]?.value?.split(':')[0] || 12;
        const mm = +this.group.controls[this.field.key]?.value?.split(':')[1] || 0;

        this.someDate.setHours(hh);
        this.someDate.setMinutes(mm);
      } else {
        this.someDate.setHours(12);
        this.someDate.setMinutes(0);
      }

    } catch (error) {
      console.error(error);
    }
    //  this.rowClass = this.field.rowClass === 'large' ? 'col-md-12' : 'col-md-6';
  }

  fieldChange() {
    const object: any = {};
    const value = this.prependZero(this.someDate.getHours()) + ':' + String('00' + (this.someDate.getMinutes() - this.someDate.getMinutes() % 5)).slice(-2);
    if (this.field?.key) this.group.controls[this.field.key].setValue(value);
    this.fieldValue.emit({ value, field: this.field, object });
  }

  prependZero(number: number) {
    if (number < 9)
      return "0" + number;
    else
      return number;
  }
}
