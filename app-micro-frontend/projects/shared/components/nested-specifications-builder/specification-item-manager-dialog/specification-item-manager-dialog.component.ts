import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NestedSpecificationActionResults } from '../group-item/group-item.component';
import { EditableSpecificationItem } from '../store/model';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface SpecificationItemManagerDialogData {
  item: EditableSpecificationItem;
  saveFunction: (
    item: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;
}

export interface SpecificationItemManagerDialogResults {
  isSuccessful: boolean;
  item: EditableSpecificationItem;
}

@Component({
    selector: 'app-specification-item-manager-dialog',
    templateUrl: './specification-item-manager-dialog.component.html',
    styleUrls: ['./specification-item-manager-dialog.component.scss'],
    standalone: true,
    imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule
],
})
export class SpecificationItemManagerDialogComponent implements OnInit {
  description: string = '';
  code: string = '';
  unitOfMeasure: string = '';

  isSaving: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SpecificationItemManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SpecificationItemManagerDialogData
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.code = this.data.item.code;
      this.description = this.data.item.description;
      this.unitOfMeasure = this.data.item.unitOfMeasure;
    }
  }

  async save() {
    this.isSaving = true;

    this.data.item.code = this.code;
    this.data.item.description = this.description;
    this.data.item.unitOfMeasure = this.unitOfMeasure;

    let results = await this.data.saveFunction(this.data.item);
    this.isSaving = false;

    let saveResults: SpecificationItemManagerDialogResults = {
      isSuccessful: results.isSuccessful,
      item: undefined,
    };

    if (results.isSuccessful) {
      saveResults.item = {
        ...this.data.item,
        uuid: results.itemUuid,
        rowId: results.itemUuid,
        id: results.itemId,
      };
    }

    this.dialogRef.close(saveResults);
  }
}
