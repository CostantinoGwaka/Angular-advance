import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'autocompletePropertyFilter',
    standalone: true
})
export class AutoCompletePropertyFilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, labelKey?: string): any {
    if (!items || !searchTerm) {
      return items;
    }

    return items.filter(
      item =>
        item[labelKey || 'name']
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) === true
    );
  }
}
