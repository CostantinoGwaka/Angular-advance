import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'without',
    standalone: true
})
export class WithoutPipe implements PipeTransform {

  transform(value: any[], property: string, val: any[]): any {
    if (!property) {
      return value;
    }
    if (!value) {
      return value;
    }
    if (!val) {
      return value;
    }
    if (property === 'normal_array') {
      return value.filter((v) => !(val.includes(v)));
    }
    return value.filter((v) => val.indexOf(v[property]) === -1);
  }

}
