import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'datetime',
    standalone: true
})
export class DatetimePipe implements PipeTransform {
  transform(value: any, format: string = 'medium'): any {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, format);
  }
}
