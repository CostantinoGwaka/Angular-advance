import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'cleanHtml',
    standalone: true
})
export class CleanHtmlPipe implements PipeTransform {
  transform(input: string): string {
    return input.replace(/(<([^>]+)>)/gi, '');
  }
}
