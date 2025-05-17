import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'safeDate',
    standalone: true
})
export class SafeDatePipe implements PipeTransform {
    transform(value: any, format: string = 'mediumDate', locale = 'en-US', timezone = 'UTC'): any {
        if (!value) {
            return '-';
        }
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
            console.error(`Invalid date value: ${value}`);
            return value;
        }
        const datePipe = new DatePipe(locale);
        return datePipe.transform(dateValue, format, timezone);
    }
}
