import { Directive } from '@angular/core';

/**
 * Directive for providing a custom no entries found element.
 * e.g.
 * <app-select-search [formControl]="bankFilterCtrl">
 *   <span SelectNoEntriesFound>
 *     No entries found <button>Add</button>
 *   </span>
 * </app-select-search>
 */
@Directive({
    selector: '[selectNoEntriesFound]',
    standalone: true

})
export class SelectNoEntriesFoundDirective { }