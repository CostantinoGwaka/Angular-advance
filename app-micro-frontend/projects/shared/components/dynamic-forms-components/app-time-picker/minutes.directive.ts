import { Directive, ElementRef, HostListener } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Directive({
    selector: 'input[minutes]',
    standalone: true
})
export class MinutesDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    let zeroPadding = '';
    this.el.nativeElement.value = this.el.nativeElement.value.replace('0', '');

    if (this.el.nativeElement.value.length > 2) {
      this.el.nativeElement.value = this.el.nativeElement.value.substr(0, 2);
    }

    if (this.el.nativeElement.value.length < 2) {
      for (let i = 0; i < 2 - this.el.nativeElement.value.length; i++) {
        zeroPadding += '0';
      }
    }

    if (this.el.nativeElement.value.substr(0, 1) > 5) {
      this.el.nativeElement.value = '5' + this.el.nativeElement.value.substr(1, 2);
    }

    this.el.nativeElement.value = zeroPadding + this.el.nativeElement.value;

    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
