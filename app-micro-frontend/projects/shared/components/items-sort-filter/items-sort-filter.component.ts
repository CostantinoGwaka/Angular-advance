import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
export interface ItemsSortOption {
  label: string;
  fieldName: string;
  orderDirection: 'ASC' | 'DESC';
}

@Component({
    selector: 'app-items-sort-filter',
    templateUrl: './items-sort-filter.component.html',
    standalone: true,
    imports: [
    MatMenuModule,
    MatIconModule
],
})
export class ItemsSortFilterComponent implements OnInit {
  @Input()
  sortOptions: ItemsSortOption[] = [];

  @Input()
  selectedOption: ItemsSortOption;

  @Output()
  onSortOptionChange: EventEmitter<ItemsSortOption> = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges() {
    if (this.sortOptions.length > 0) {
      this.selectedOption = this.sortOptions[0];
    }
  }

  onSortOptionChangeHandler(sortOption: ItemsSortOption) {
    this.selectedOption = sortOption;
    this.onSortOptionChange.emit(sortOption);
  }
}
