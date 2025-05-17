import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'replace',
    standalone: true
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, args?: any, replaceItem?: any): any {

    return value?.split(args)?.join(replaceItem);
  }


}
