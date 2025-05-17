import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'numberPipe',
    standalone: true
})
export class NumberPipePipe implements PipeTransform {

  transform(val, allowDecimal: boolean = false) {
    if (val) {
      val = this.format_number(val, allowDecimal);
    }
    return val;
  }

  format_number(number, allowDecimal: boolean) {
    let numberString = number.toString();
    numberString = numberString.replace(/,/g, '');
    // Parse the number string to a float, considering decimal condition
    const parsedNumber: number = parseFloat(numberString);

    // Check if the parsed number is a valid number
    if (isNaN(parsedNumber)) {
      throw new Error('Invalid number');
    }

    let decimalCondition = null;
    if (allowDecimal) {
      let split = numberString.split('.'),
        decimalCondition = split[1]?.length ?? 0;
    } else {
      decimalCondition = 0
    }
    // Format the number with comma separators and decimal point
    const formattedNumber: string = parsedNumber.toLocaleString('en-US', {
      minimumFractionDigits: decimalCondition,
      maximumFractionDigits: decimalCondition
    });

    return formattedNumber;
  }
}
