import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "sortArray",
    standalone: true
})
export class SortArrayPipe implements PipeTransform {
  transform(value: any[], order:any = '', column: string = '', innerColumn?:string): any[] {
    //
    try {
      if (value === null || column === null) { return value; }
      const pos = order === 'ASC' ? 1 : -1;
      const neg = order === 'ASC' ? -1 : 1;
      return innerColumn?value.slice().sort((firstEl, secondEl) => {
        if (firstEl[column][innerColumn] < secondEl[column][innerColumn]) { return neg; }
        if (firstEl[column][innerColumn] > secondEl[column][innerColumn]) { return pos; }
        return 0;
      }):value.slice().sort((firstEl, secondEl) => {
        if (firstEl[column] < secondEl[column]) { return neg; }
        if (firstEl[column] > secondEl[column]) { return pos; }
        return 0;
      });
    } catch (e) {
      return [];
    }
  }
}
