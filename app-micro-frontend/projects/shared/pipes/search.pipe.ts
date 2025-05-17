import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

/**
 * A search pipe to help to search items using thier property
 * just pass multiple properties using comma separated list
 * Usage: items | search:'obj_property_1,obj_property_2...,obj_property_n':searchValue
 */
@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  // TODO: Make this return specific type and fix all issues
  public transform<T>(value?: T[], keys?: string, term?: any, strict: any = false) {
    if (!term) { return value; }
    if (typeof term === 'string') {
      if (strict) {
        return filterValues((value || []), keys, term);
      } else {
        return filterValues((value || []), keys, term);
      }
    } else {
      let retValue: any[] = [];
      term.forEach((t: any) => {
        retValue = filterValues(retValue.concat((value || []), keys, t));
      });
      return retValue;
    }

  }
}

function filterValues(value?: any[], keys?: string, expressionTerm?: string) {
  return value.filter((item: any) => keys?.split(',')
    .some(key => {
      // Check if filtering is intended for object fields
      if (key.indexOf('.') >= 0) {
        return filterObjectsFields(item, key, expressionTerm);
      } else {
        return item.hasOwnProperty(key) && new RegExp(expressionTerm, 'gi')
          .test(item[key]);
      }
    }))
}

function filterObjectsFields(item: any, key: string, expressionTerm) {
  let keys = key.split('.');
  let depth = key.split('.').length;
  let currentItem = null;
  let lastKey = null;
  for (let depthLevel = 0; depthLevel < depth - 1; depthLevel++) {
    currentItem = currentItem ? currentItem[keys[depthLevel]] : item[keys[depthLevel]];
  }
  lastKey = keys[depth - 1];
  return currentItem.hasOwnProperty(lastKey) && new RegExp(expressionTerm, 'gi')
    .test(currentItem[lastKey]);
}
