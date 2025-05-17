import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'sortByDate',
    standalone: true
})
export class SortByDatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (typeof args[0] === "undefined") {
      return value;
    }
    let direction = args[0][0];
    let column = args.replace('-', '');
    return [...value].sort((a: any, b: any) => {
      let left = Number(new Date(a[column]));
      let right = Number(new Date(b[column]));
      return (direction === "-") ? right - left : left - right;
    });
  }
}
