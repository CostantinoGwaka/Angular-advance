import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'stringSearch'
})
export class StringSearchPipe implements PipeTransform {
  transform(value: string[], searchTerm: string): string[] {
    if (!value || !searchTerm) {
      return value;
    }
    searchTerm = searchTerm.toLowerCase();
    return value.filter(item => item.toLowerCase().includes(searchTerm));
  }
}
