import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ExcelReaderService } from '../../../../services/excel-reader.service';
import { ExcelUploadService } from '../../../../services/excel-upload.service';
import { NotificationService } from '../../../../services/notification.service';
import { StorageService } from '../../../../services/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DndDirective } from '../../../directives/file-drad-and-drop.directive';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../../loader/loader.component';
import { NgClass } from '@angular/common';
import { ModalHeaderComponent } from '../../modal-header/modal-header.component';

@Component({
  selector: 'app-specification-import-dialog',
  templateUrl: './specification-import-dialog.component.html',
  styleUrls: ['./specification-import-dialog.component.scss'],
  standalone: true,
  imports: [ModalHeaderComponent, LoaderComponent, MatIconModule, DndDirective, FormsModule, NgClass, MatButtonModule, MatDialogModule]
})
export class SpecificationImportDialogComponent implements OnInit {
  loadingStatus = false;
  loadingTemplate = false;
  colLabels: string[] = []
  excelItems: any[] = [];
  fetchingItem: boolean = false;
  itemError: { [key: string]: boolean } = {};
  errorExists = false;
  institutionName = 'Specifications'
  constructor(
    private excelReaderService: ExcelReaderService,
    private excelUpload: ExcelUploadService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    public matDialogRef: MatDialogRef<SpecificationImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.institutionName = this.storageService.getItem('institutionName');
  }

  ngOnInit(): void {
  }

  closeSheet() {
    this.matDialogRef.close();
  }

  uploadData() {
    const specs = this.excelItems.map((item, index) => ({
      description: item['Feature'] + '', value: item['Description'] + '', isEditable: true, rowId: 'ex' + index, uuid: 'ex' + index
    }));
    this.matDialogRef.close(specs);
  }




  public onFileDropped(event) {
    this.onFileSelected(event);
  }

  clickToSelectFiles() {
    document.getElementById("fileInput").click();
  }

  setsAreEqual(set1: Set<string>, set2: Set<string>): boolean {
    if (set1.size !== set2.size) {
      return false;
    }

    for (const item of set1) {
      if (!set2.has(item)) {
        return false;
      }
    }
    return true;
  }


  checkArraysEqual(array1: string[], array2: string[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    return this.setsAreEqual(set1, set2);
  }
  public async onFileSelected(event) {
    this.colLabels = ['Feature', 'Description'];
    const items = await this.excelUpload.getFileJsonObject(event);
    this.excelItems = items.filter(i => this.checkArraysEqual(Object.keys(i), this.colLabels)).map((item: any, index) => {
      this.colLabels.forEach((label) => {
        this.itemError[index + label] = false;
        this.validateItem(item, label, index);
      });
      //
      return {
        ...item,
      }
    });

    if (this.excelItems.length == 0) {
      this.notificationService.errorMessage('Invalid file content. Please upload a valid file content from template');
    }
  }

  validateItem(item, label, row) {
    if (item[label] == null || item[label] == undefined || item[label] == '') {
      this.itemError[row + label] = true;
    } else if (label == 'Feature' || label == 'Description') {
      this.itemError[row + label] = false;
    }
    this.errorExists = Object.values(this.itemError).some(i => i);
  }

  async downloadData() {
    this.loadingTemplate = true;
    const columns: { name: string, options?: string[] }[] = [
      { name: 'Feature' },
      { name: 'Description' },
    ];

    await this.excelReaderService.generateTemplate(`${this.institutionName || ''}-Specifications Template`, columns);
    this.loadingTemplate = false;
  }

  public removeItem(item, row) {
    const index: number = (this.excelItems || []).indexOf(item);
    if (index !== -1) {
      this.excelItems.splice(index, 1)
      this.excelItems = [...this.excelItems];
    }
    this.colLabels.forEach((label) => {
      this.itemError[row + label] = false;
    });
    this.errorExists = Object.values(this.itemError).some(i => i);
  }


}
