import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  EditableSpecificationItem,
  FlatNestedSpecificationItemView,
} from '../../store/model';
import { MatButtonModule } from '@angular/material/button';

import { MatRadioModule } from '@angular/material/radio';

export interface TableItemPickerDialogData {
  selectedItem: EditableSpecificationItem;
  pickedItemId: string;
  items: FlatNestedSpecificationItemView[];
}

@Component({
    selector: 'app-table-item-picker',
    templateUrl: './table-item-picker.component.html',
    standalone: true,
    imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule
],
})
export class TableItemPickerComponent implements OnInit {
  title: string = 'Select PS Item';
  form: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    public matDialogRef: MatDialogRef<TableItemPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TableItemPickerDialogData
  ) { }

  items: FlatNestedSpecificationItemView[];
  selectedItem: EditableSpecificationItem;

  ngOnInit(): void {
    this.form = this.fb.group({
      item: [null, [Validators.required]],
    });

    if (this.data) {
      this.items = this.data.items;
      this.selectedItem = this.data?.selectedItem;
      this.title = `Select item to link [${this.selectedItem.code}] ${this.selectedItem.description} for % calculations`;
    }

    if (this.data?.pickedItemId) {
      this.form.get('item').setValue(this.data.pickedItemId);
    }
  }

  selectItem() {
    let linkedItemUuid = this.form.get('item').value;
    this.matDialogRef.close(linkedItemUuid);
  }
}
