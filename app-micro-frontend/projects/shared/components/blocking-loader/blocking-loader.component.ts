import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface BlockingDialogData {
  allowCancel: boolean;
  title?: string;
  message?: string;
}

@Component({
    selector: 'app-blocking-loader',
    templateUrl: './blocking-loader.component.html',
    standalone: true,
    imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule
],
})
export class BlockingLoaderComponent {
  title: string;
  message: string;
  allowCancel: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BlockingDialogData,
    private _dialogRef: MatDialogRef<BlockingLoaderComponent>
  ) {
    this.title = data.title ? data.title : 'Please wait';
    this.message = data.message ? data.message : 'Loading...';
    this.allowCancel = data.allowCancel;
  }
}
