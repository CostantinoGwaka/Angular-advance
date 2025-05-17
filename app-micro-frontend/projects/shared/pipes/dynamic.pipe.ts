import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ReplacePipe } from './replace.pipe';
import { TranslatePipe } from './translate.pipe';

@Pipe({
    name: 'dynamicPipes',
    standalone: true
})
export class DynamicPipe implements PipeTransform {

  transform(value: any, pipes: { pipe: string, firstArgs?: any, secondArgs?: any, thirdArgs?: any }[]): any {
    let result = value;
    pipes.forEach(item => {
      if (item.pipe && typeof result === 'string') {
        switch (item.pipe) {
          case 'titleCase':
            const titleCase = new TitleCasePipe();
            result = titleCase.transform(result);
            break;
          case 'upperCase':
            const upperCase = new UpperCasePipe();
            result = upperCase.transform(result);
            break;
          case 'date':
            const date = new DatePipe('en-US');
            if (isStringAValidDate(result)) {
              result = date.transform(result, item.firstArgs, item.secondArgs, item.thirdArgs);
            }
            break;
          case 'replace':
            const replace = new ReplacePipe();
            result = replace.transform(result, item.firstArgs, item.secondArgs);
            break;
          case 'numberWithComma':
            result = numberWithCommas(result);
            break;
          case 'camelToTitle':
            result = value.replace(/([A-Z])/g, ' $1')
              .replace(/^./, function (str) { return str.toUpperCase(); });
            break;

        }
      }
    });
    return result;
  }
}
const numberWithCommas = (x: string) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const isStringAValidDate = (date: string) => {
  // const formats = [Moment.ISO_8601, 'MM/DD/YYYY  :)  HH*mm*ss'];
  // return Moment(date, formats).isValid() && new Date(date) instanceof Date;
  const dateWrapper = new Date(date);
  if (/[a-z]/i.test(date)) {
    return false;
  }
  return !isNaN(dateWrapper.getDate());
};
