import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActionButton } from './action-button.model';

@Pipe({
    name: 'showOtherButtons',
    standalone: true
})
export class ShowOtherButtonsPipe implements PipeTransform {

  transform(items: ActionButton[], value: any): any {
    let show = false;
    items.forEach(item => {
      if (value.hasOwnProperty('actionButtons')) {
        if (value.actionButtons.hasOwnProperty(item.id)) {
          if (value.actionButtons[item.id]) {
            show = true;
          }
        } else {
          show = true;
        }
      } else {
        show = true;
      }
    });
    return show;
  }

}
