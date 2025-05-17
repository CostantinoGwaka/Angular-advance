import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'disableDuplicate',
    standalone: true
})
export class DisableDuplicatePipe implements PipeTransform {
  transform(values: any[], key?: string): any[] {
    if (key) {
      const duplicatekeys = values
        .map(v => v[key])
        .filter((v, i, keys) => keys.indexOf(v) !== i)
      const duplicates = values
        .map(obj => ({ ...obj, disabled: duplicatekeys.includes(obj[key]), name: duplicatekeys.includes(obj[key]) ? '[Duplicate ' + key + '] ' + obj.name : obj.name }));
      return duplicates;
    }
    return values;
  }

}
