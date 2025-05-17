import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

/**
 * A search pipe to help to search items using thier property
 * just pass multiple properties using comma separated list
 * Usage: items | search:'obj_property_1,obj_property_2...,obj_property_n':searchValue
 */
@Pipe({
    name: 'valueExists',
    standalone: true
})
export class ValueExistsPipe implements PipeTransform {
  public transform<T>(value?: T[], key?: string, exists = false): T[] {
    if (!key) { return value; }
    return exists ? value.filter(i => !!i[key]) : value.filter(i => !i[key]);
  }
}
