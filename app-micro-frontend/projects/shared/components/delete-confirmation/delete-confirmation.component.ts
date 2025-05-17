import { Component, Inject, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { NotificationService } from "../../../services/notification.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SaveAreaComponent } from '../save-area/save-area.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UpperCasePipe } from '@angular/common';
import { ModalHeaderComponent } from '../modal-header/modal-header.component';

@Component({
    selector: 'app-delete-confirmation',
    templateUrl: './delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.scss'],
    standalone: true,
    imports: [ModalHeaderComponent, MatFormFieldModule, MatInputModule, FormsModule, SaveAreaComponent, UpperCasePipe]
})
export class DeleteConfirmationComponent implements OnInit {

  loading: boolean = false;
  @Input()
  message: string;
  @Input()
  title: string;
  @Input()
  showTextInputField: boolean;
  @Input()
  textInputFieldPlaceholder: string;
  @Input()
  confirmInputValue: string;
  @Input()
  textColor: string = 'text-red-700';
  @Input()
  confirmText: string;
  @Input()
  cancelText: string;
  @Input()
  saveColor: string = 'warn';

  selectedUUid: string;
  confirmationText: string;

  constructor(
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>
  ) {
    this.selectedUUid = data.uuid;
    if (data?.message) {
      this.message = data.message;
    }
    if (data?.title) {
      this.title = data.title;
    }
    if (data?.showTextInputField) {
      this.showTextInputField = data.showTextInputField;
    }
    if (data?.textInputFieldPlaceholder) {
      this.textInputFieldPlaceholder = data.textInputFieldPlaceholder;
    }
    if (data?.confirmInputValue) {
      this.confirmInputValue = data.confirmInputValue;
    }
    if (data?.textColor) {
      this.textColor = data.textColor;
    }
    if (data?.confirmText) {
      this.confirmText = data.confirmText;
    }
    if (data?.cancelText) {
      this.cancelText = data.cancelText;
    }
    if (data?.saveColor) {
      this.saveColor = data.saveColor;
    }
  }

  ngOnInit(): void { }

  confirm() {

  }

  closeModal(status: boolean = false) {
    this.dialogRef.close({ status: status });
  }
}
