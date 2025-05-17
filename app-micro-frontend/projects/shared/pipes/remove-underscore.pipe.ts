import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'removeUnderScore',
    standalone: true
})
export class RemoveUnderScorePipe implements PipeTransform {
  // result: string;

  transform(value: any, ...args: any[]): any {
    // remove under scores and turn to title case

    if (value) {
      const str = value?.toString()?.replace(/_/g, ' ');
      if (value == 'REOPENED') return 'RE-OPENED'
      return str;
    } else {
      return value;
    }
  }

  titleCase(str: any) {
    str = str.toLowerCase().split(' ')
      .map(function (word: string) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
      });

    return str.join(' ');
  }
}





