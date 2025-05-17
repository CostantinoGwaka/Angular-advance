
import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'autocompleteUnitOfMeasureFilter',
    standalone: true
})
export class AutoCompleteUnitOfMeasureFilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, labelKey?: string): any {
    if (!items || !searchTerm) {
      return items;
    }

    return items.filter(
      item =>
        item[labelKey || 'unitOfMeasure']
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) === true
    );
  }
}
