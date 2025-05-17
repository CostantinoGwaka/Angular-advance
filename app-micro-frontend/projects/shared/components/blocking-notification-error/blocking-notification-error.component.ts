import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface BlockingNotificationErrorData {
  message?: string;
}
@Component({
    selector: 'app-blocking-notification-error',
    templateUrl: './blocking-notification-error.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
})
export class BlockingNotificationErrorComponent {
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BlockingNotificationErrorData,
    private _dialogRef: MatDialogRef<BlockingNotificationErrorComponent>
  ) {
    this.message = data.message ? data.message : 'An error occurred';
  }
}
