import { Directive } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

/**
 * Directive for providing a custom clear-icon.
 * e.g.
 * <app-select-search [formControl]="bankFilterCtrl">
 *   <mat-icon selectSearchClear>delete</mat-icon>
 * </app-select-search>
 */
@Directive({
    selector: '[selectSearchClear]',
    standalone: true
})
export class SelectSearchClearDirective { }
