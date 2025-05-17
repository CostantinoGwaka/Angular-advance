import { Directive, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDatepicker } from '@angular/material/datepicker';
import { CalenderObject } from 'src/app/modules/nest-app/app-tender-creation/components/calendar-display/calendar-display.component';

@Directive({
  selector: '[appCustomDatePickerFilter]'
})
export class CustomDatePickerFilterDirective {

  @Input('appCustomDatePickerFilter') customParam: CalenderObject;

  constructor(private readonly matDatepicker: MatDatepicker<any>) {
    this.matDatepicker.datepickerInput.dateFilter = (date: Date | null) => {
      const isValid = this.customFilter(date);
      if (!isValid) {
        this.matDatepicker.datepickerInput.disabled = true;
      }
      return isValid;
    };
  }

  customFilter(date: Date | null): boolean {
    // Implement your filtering logic here using date and customParam
    // Return true if the date should be enabled, false otherwise

    return true; // Replace with your actual filtering logic
  }

}
