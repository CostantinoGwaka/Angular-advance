import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'filter',
    standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], filterString: string, property: string): any[] {
    if (value.length === 0 || !filterString) {
      return value;
    }
    let filteredUsers: any[] = [];
    for (let user of value) {
      if (user[property].toLowerCase().includes(filterString.toLowerCase())) {
        filteredUsers.push(user);
      }
    }
    return filteredUsers;
  }
}

@Pipe({
    name: 'filterBoolean',
    standalone: true,
})
export class FilterBooleanPipe implements PipeTransform {
  transform(value: any[], filterBooleanValue: boolean, property: string): any[] {
    if (value.length === 0 || filterBooleanValue == undefined) {
      return value;
    }
    let filteredUsers: any[] = [];
    for (let user of value) {
      if (user[property] == filterBooleanValue) {
        filteredUsers.push(user);
      }
    }
    return filteredUsers;
  }
}
