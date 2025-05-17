import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[forceUppercaseAndAlphanumeric]',
    standalone: true,
})
export class ForceUppercaseAndAlphanumericDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    let transformedInput = event.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9_]/g, ''); // Replace non-alphanumeric characters except underscore
    event.target.value = transformedInput;
    this.el.nativeElement.value = transformedInput; // Update the element's value
  }
}
