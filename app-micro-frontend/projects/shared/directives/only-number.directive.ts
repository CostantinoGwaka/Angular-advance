import { Directive, ElementRef, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Directive({
  selector: '[appOnlyNumber]',
  standalone: true
})
export class OnlyNumberDirective implements OnInit {
  @Input() inputType: string;
  @Input() acceptedDecimalPoints = 2;

  constructor(private el: ElementRef) { }

  ngOnInit() {

    if (this.inputType === 'formattedNumber' && this.el.nativeElement.value) {
      this.checkValue();
    }
  }

  checkValue() {
    if (this.inputType !== 'formattedNumber') {
      return;
    }
    const input = this.el.nativeElement;

    let value = input.value.replace(/[^0-9.-]/g, '');

    // Only allow "-" as the first character
    if (value.indexOf("-") !== 0) {
      value = value.replace(/-/g, "");
    }


    // Check for multiple "-"
    if (value.indexOf("-") !== value.lastIndexOf("-")) {
      value = value.split("-").slice(0, 2).join("-");
    }


    // Check for multiple "."
    if (value.indexOf(".") !== value.lastIndexOf(".")) {
      value = value.split(".").slice(0, -1).join("");
    }

    // Handle decimal part
    let decimalIndex = value.indexOf(".");
    let integerValue = value;
    let decimalValue = "";

    if (decimalIndex > -1) {
      integerValue = value.substring(0, decimalIndex) || "0";
      decimalValue = value.substring(decimalIndex + 1);
    }

    //Limit decimal places to acceptedDecimalPoints
    if (decimalValue.length > (this.acceptedDecimalPoints || 2)) {
      decimalValue = decimalValue.substring(0, (this.acceptedDecimalPoints || 2));
    }

    integerValue = integerValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    value =
      decimalValue || decimalIndex !== -1
        ? `${integerValue}.${decimalValue || ""}`
        : integerValue;


    this.el.nativeElement.value = value;
  }
  @HostListener('blur', ['$event']) onBlur(event: KeyboardEvent) {
    this.checkValue();
  }
  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    //
    this.checkValue();
  }
  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    this.checkValue();
  }
}
