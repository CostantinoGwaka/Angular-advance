import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'filterElements',
    standalone: true
})
export class FilterElementsPipe implements PipeTransform {

  transform(configuredElements: any[], currentSelectedGroup: string): any[] {
    if (!configuredElements || !currentSelectedGroup) {
      return configuredElements;
    }

    const groupUuid: string = currentSelectedGroup.split("_")[0];

    return configuredElements.filter(element => element.groups.includes(groupUuid));
  }

}
