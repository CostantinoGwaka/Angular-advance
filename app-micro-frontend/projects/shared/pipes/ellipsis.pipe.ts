import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'ellipsis',
    standalone: true
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string, limit = 50): any {
    if (value.length > limit) {
      return value.substring(0, limit) + '...';
    }
    return value;
  }

}
