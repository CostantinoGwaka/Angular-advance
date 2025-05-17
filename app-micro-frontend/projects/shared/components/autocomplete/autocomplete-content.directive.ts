
import { Directive, TemplateRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Directive({
    selector: '[appAutocompleteContent]',
    standalone: true
})
export class AutocompleteContentDirective {
  constructor(public tpl: TemplateRef<any>) {
  }
}
