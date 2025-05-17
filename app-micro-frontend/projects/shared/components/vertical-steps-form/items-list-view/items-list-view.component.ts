import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ItemsToShow } from '../vertical-steps-form.component';
import { ModalHeaderComponent } from '../../modal-header/modal-header.component';
import { VerticalStepsFormService } from '../vertical-steps-form.service';
import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';

export interface StepsFormFiledListView {
  title: string;
  fields: ItemsToShow[];
  onItemClick: (item: ItemsToShow) => void;
}

@Component({
  selector: 'app-items-list-view',
  standalone: true,
  imports: [
    ModalHeaderComponent,
    MatDialogModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    FormsModule,
  ],
  templateUrl: './items-list-view.component.html',
  styleUrl: './items-list-view.component.scss',
})
export class ItemsListViewComponent {
  title: string;
  fields: ItemsToShow[];
  filtered: ItemsToShow[];
  searchTerm: string;
  onItemClick: (item: ItemsToShow) => void;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: StepsFormFiledListView,
    public _dialogRef: MatDialogRef<ItemsListViewComponent>,
    public verticalStepsFormService: VerticalStepsFormService
  ) {
    if (this.data?.fields != null) {
      this.title = this.data.title;
      this.fields = this.data.fields;
      this.filtered = this.data.fields;
      this.onItemClick = this.data.onItemClick;
    }
  }

  close() {
    this._dialogRef.close();
  }

  showItem(item: ItemsToShow) {
    this.verticalStepsFormService.itemToGoTo = item;
    this.onItemClick(item);
    this.close();
  }

  getItemStatus(item: ItemsToShow): string {
    switch (item.status) {
      case 'saved':
        if (
          item.value === null ||
          item.value === '' ||
          item.value === undefined ||
          item?.value?.length === 0
        ) {
          return 'Saved but not filled';
        } else {
          return 'Saved';
        }
      case 'ready':
        return 'Not filled';
      case 'pending':
        return 'Not saved';
      case 'failed':
        return 'Failed to save';
      default:
        return 'Unknown';
    }
  }

  searchItems() {
    this.filtered = this.data.fields.filter((item) => {
      return (
        item.label.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getItemStatus(item)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        item.stepName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }
}
