import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'isBase64',
    standalone: true
})
export class IsBase64Pipe implements PipeTransform {
  transform(value: string): { value: string, valid: boolean } {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const string = value?.replace('data:image/png;base64,', '');
    return {
      valid: string == null || string == '' ? false : base64regex.test(string),
      value: value
    };
  }

}
