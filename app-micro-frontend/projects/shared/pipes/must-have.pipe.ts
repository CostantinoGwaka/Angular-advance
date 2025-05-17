import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

/**
 * A search pipe to help to search items using thier property
 * just pass multiple properties using comma separated list
 * Usage: items | search:'obj_property_1,obj_property_2...,obj_property_n':searchValue
 */
@Pipe({
    name: 'mustHave',
    standalone: true
})
export class MustHavePipe implements PipeTransform {
  public transform<T>(value?: T[], keys?: string, term?: any, strict: any = false): T[] {
    if (!term) { return value; }
    if (typeof term === 'string') {
      if (strict) {
        return (value || [])
          .filter((item: any) => keys?.split(',')
            .some(key => item.hasOwnProperty(key) && item[key] === term
            )
          );
      } else {
        return (value || [])
          .filter((item: any) => keys?.split(',')
            .some(key => item.hasOwnProperty(key) && item[key] === term
            )
          );
      }
    } else {
      let retValue: any[] = [];
      term.forEach((t: any) => {
        retValue = retValue.concat((value || [])
          .filter((item: any) => keys?.split(',')
            .some(key => item.hasOwnProperty(key) && item[key] === term
            )
          )
        );
      });
      return retValue;
    }

  }
}
