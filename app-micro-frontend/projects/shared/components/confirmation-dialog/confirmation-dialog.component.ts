import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

export interface ConfirmationDialogData {
  title?: string;
  message?: string;
  acceptButtonText?: string;
  cancelButtonText?: string;
  confirmationText?: string;
  showIcon?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  isCancel?: boolean;
  allowCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    standalone: true,
    imports: [
    NgClass,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    DoNotSanitizePipe
],
})
export class ConfirmationDialogComponent {
  message: string;
  confirmTitle: string;
  acceptButtonText: string;
  cancelButtonText: string;
  confirmationText: string;
  showIcon: boolean = false;
  isSuccess: boolean = false;
  isWarning: boolean = false;
  isCancel: boolean = false;
  allowCancel: boolean = true;
  onConfirm: () => void;
  onCancel: () => void;

  enteredConfirmationText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConfirmationDialogData,
    private _dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this.confirmTitle = data.title ? data.title : 'Please confirm';
    this.message = data.message ? data.message : 'Are you sure?';
    this.showIcon = data.showIcon ? data.showIcon : false;
    this.isSuccess = data.isSuccess ? data.isSuccess : false;
    this.isWarning = data.isWarning ? data.isWarning : false;
    this.isCancel = data.isCancel ? data.isCancel : false;
    this.confirmationText = data.confirmationText;
    this.acceptButtonText = data.acceptButtonText
      ? data.acceptButtonText
      : 'Ok';
    this.cancelButtonText = data.cancelButtonText
      ? data.cancelButtonText
      : 'Cancel';
    this.onConfirm = data.onConfirm;
    this.onCancel = data.onCancel;
    this.allowCancel = data.allowCancel !== undefined ? data.allowCancel : true;
  }

  confirm(): void {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this._dialogRef.close(true);
  }

  cancel(): void {
    if (this.onCancel) {
      this.onCancel();
    }
    this._dialogRef.close(false);
  }
}
