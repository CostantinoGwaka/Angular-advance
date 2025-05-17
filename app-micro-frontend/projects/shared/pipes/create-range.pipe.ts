import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'createRange',
    standalone: true
})
export class CreateRangePipe implements PipeTransform {
  transform(totalPages: number): number[] {
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }
}