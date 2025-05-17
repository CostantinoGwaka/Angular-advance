import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { DynamicPipe } from '../../pipes/dynamic.pipe';
import { NgClass, NgTemplateOutlet, DatePipe } from '@angular/common';

@Component({
    selector: 'app-dynamic-view',
    templateUrl: './dynamic-view.component.html',
    styleUrls: ['./dynamic-view.component.scss'],
    standalone: true,
    imports: [NgClass, NgTemplateOutlet, DatePipe, DynamicPipe]
})
export class DynamicViewComponent implements OnInit {


  @Input() data: any;
  @Input() cols = 3;

  dataList: any[] = [];
  dataObject: any = {};

  // arrayCols = 1;
  ngOnInit(): void {
    const { arrays, others } = this.separateKeysWithArrays(this.data);
    this.dataList = arrays;
    this.dataObject = others;
  }

  get keys(): string[] {
    return this.dataObject ? Object.keys(this.dataObject) : [];
  }

  getArrayCols(arr: any[]): number {
    return Math.ceil(arr.length / this.cols);
  }


  separateKeysWithArrays(obj: any): { arrays: { key: string, value: any[] }[], others: Record<string, any> } {
    const result = { arrays: [], others: {} };
    for (const key in obj) {
      if (key) {
        if (Array.isArray(obj[key])) {
          result.arrays.push({ [key]: obj[key] });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const { arrays, others } = this.separateKeysWithArrays(obj[key]);
          result.arrays.push(...arrays.filter(i => i.key).map(array => ({ [key]: { [array.key]: array.value } })));
          if (others) {
            result.others[key] = others;
          }
        } else if (obj[key]) {
          result.others[key] = obj[key];
        }
      }
    }

    return result;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }


  getType(value: any): string {
    if (Array.isArray(value)) {
      return 'array';
    }
    return typeof value;
  }


}
