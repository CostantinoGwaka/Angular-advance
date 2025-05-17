import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


export interface SortRequestData {
  title: string;
  prefix?: number;
  fields: {
    id: string;
    weight: string;
    text: string | ((item: any) => string);
  };
  items: any[];
}

export interface SortResults {
  sorted: boolean;
  sortedItems: any[];
}

@Component({
    selector: 'app-items-sorter',
    templateUrl: './items-sorter.component.html',
    styleUrls: ['./items-sorter.component.scss'],
    standalone: true,
    imports: [
    MatDialogModule,
    CdkDropList,
    CdkDrag,
    MatButtonModule
],
})
export class ItemsSorterComponent implements OnInit {
  sortData: SortRequestData = null;

  items: any[] = [];

  dropListData: any[];

  isSorted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: SortRequestData,
    public dialogRef: MatDialogRef<ItemsSorterComponent>
  ) {}

  ngOnInit(): void {
    this.sortData = this.data;
    this.items = [...this.sortData.items];
  }

  getText(item: any) {
    if (typeof this.sortData.fields.text === 'string') {
      return this.sortData.fields.text;
    } else {
      return this.sortData.fields.text(item);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    this.switchItemsPosition(event.previousIndex, event.currentIndex);
  }

  switchItemsPosition(fromIndex: number, toIndex: number) {
    let _item = this.items[fromIndex];
    let _items = [...this.items];

    if (_item) {
      const item = { ..._item };
      _items.splice(fromIndex, 1);
      _items.splice(toIndex, 0, item);
      this.items = [..._items];
      this.isSorted = true;
    }
  }

  save() {
    this.dialogRef.close(<SortResults>{
      sorted: true,
      sortedItems: this.items,
    });
  }
}
