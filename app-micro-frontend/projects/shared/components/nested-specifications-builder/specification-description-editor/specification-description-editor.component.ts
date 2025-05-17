import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { NestedSpecificationItem } from '../store/model';
import { NestedSpecificationActionResults } from '../group-item/group-item.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SpecificationItemManagerDialogResults } from '../specification-item-manager-dialog/specification-item-manager-dialog.component';
import { NotificationService } from '../../../../services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface SpecificationDescriptionItemManagerDialogData {
  item: NestedSpecificationItem;
  saveFunction: (
    item: NestedSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;
}

export interface SpecificationDescriptionItemManagerDialogResults {
  isSuccessful: boolean;
  item: NestedSpecificationItem;
}

@Component({
    selector: 'app-specification-description-editor',
    templateUrl: './specification-description-editor.component.html',
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
export class SpecificationDescriptionEditorComponent implements OnInit {
  isSaving: boolean = false;

  description: string = '';
  code: string = '';

  constructor(
    public dialogRef: MatDialogRef<SpecificationDescriptionEditorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: SpecificationDescriptionItemManagerDialogData,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.code = this.data.item?.code;
      this.description = this.data.item?.description;
    }
  }

  async save() {
    this.data.item.code = this.code.trim();
    this.data.item.description = this.description.trim();

    if (!this.data.item.description) {
      this.notificationService.errorMessage('Description is required');
      return;
    }

    this.isSaving = true;

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
