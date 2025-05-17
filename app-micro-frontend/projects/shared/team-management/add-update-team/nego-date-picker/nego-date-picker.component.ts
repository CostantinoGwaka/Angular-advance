import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {FormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-nego-date-picker',
  standalone: true,
  imports: [
    MatFormField,
    MatDatepickerInput,
    FormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './nego-date-picker.component.html',
  styleUrl: './nego-date-picker.component.scss'
})
export class NegoDatePickerComponent {
 @Input() dateType:string;
 @Input() minDate:Date;
 @Input() label:string;
 @Input() model:Date;
 @Output() onDateUpdate:EventEmitter<any> = new EventEmitter();
}
