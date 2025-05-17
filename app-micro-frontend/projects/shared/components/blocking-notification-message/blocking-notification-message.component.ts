import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';
import { MatButtonModule } from '@angular/material/button';

export interface BlockingNotificationMessageData {
  message: string;
}

@Component({
    selector: 'app-blocking-notification-message',
    templateUrl: './blocking-notification-message.component.html',
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        DoNotSanitizePipe,
    ],
})
export class BlockingNotificationMessageComponent {
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BlockingNotificationMessageData,
    private _dialogRef: MatDialogRef<BlockingNotificationMessageComponent>
  ) {
    this.message = data.message ? data.message : 'An error occurred';
  }
}
