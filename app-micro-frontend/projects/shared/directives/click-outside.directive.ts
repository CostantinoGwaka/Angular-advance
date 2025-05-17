import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Directive({
    selector: '[appClickOutside]',
    standalone: true
})
export class ClickOutsideDirective {

  constructor(private _elementRef: ElementRef) {
  }

  @Output() public clickOutside = new EventEmitter();
  @HostListener('document:click', ['$event.target']) public onClick(targetElement: HTMLElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(true);
    }
  }

}
