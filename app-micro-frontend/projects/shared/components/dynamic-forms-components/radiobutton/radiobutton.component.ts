import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../field.interface';
import { WithLoadingPipe } from '../../with-loading.pipe';
import { AsyncPipe } from '@angular/common';
@Component({
    selector: 'app-radiobutton',
    template: `



@if (field?.options) {
  @if (field?.options | withLoading | async; as data) {
    @for (item of data.value || []; track item) {
      <fieldset>
        <label for="{{item.name}}_name">{{item.name}}</label>
        <input id="{{item.name}}_name" type="radio" [formControlName]="field?.key || ''" value="{{item.value}}">
      </fieldset>
    }
  }
}
`,
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    WithLoadingPipe
],
})
export class RadiobuttonComponent implements OnInit {
  @Input() field?: FieldConfig;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  // @HostBinding('class') rowClass = 'col-md-6';
  constructor() { }
  ngOnInit() {
    //  this.rowClass = this.field.rowClass === 'large' ? 'col-md-12' : 'col-md-6';
  }
}
