import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'cutPipe',
    standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, wordwise: any, max: any, tail: any): any {
    if (!value) { return ''; }

    max = parseInt(max, 10);
    if (!max) { return value; }
    if (value.length <= max) { return value; }

    value = value.substring(0, max);
    if (wordwise) {
      let lastspace = value.lastIndexOf(' ');
      if (lastspace !== -1) {
        // Also remove . and , so its gives a cleaner result.
        if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
          lastspace = lastspace - 1;
        }
        value = value.substring(0, lastspace);
      }
    }

    return value + (tail || ' …');
  }

}
