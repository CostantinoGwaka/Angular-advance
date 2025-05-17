import { DoNotSanitizePipe } from 'src/app/shared/word-processor/pipes/do-not-sanitize.pipe';
import { Component, Inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { PaginatedDataService } from '../../../services/paginated-data.service';
import { MatButtonModule } from '@angular/material/button';

import { SimpleLinearProgressBarComponent } from '../simple-linear-progress-bar/simple-linear-progress-bar.component';
import { BlockingProgressLoaderService } from './blockin-progress-loader.service';

export interface BlockingProgressDialogData {
  dialogId: string;
  allowCancel: boolean;
  title: string;
  message: string;
  progress: number;
  failed: boolean;
  retryFunction?: () => void;
}

@Component({
  selector: 'app-blocking-progress-loader',
  templateUrl: './blocking-progress-loader.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    SimpleLinearProgressBarComponent,
    MatButtonModule,
    DoNotSanitizePipe
],
})
export class BlockingProgressLoaderComponent {
  data: BlockingProgressDialogData;
  progress = this.blockingProgressLoaderService.progress;
  constructor(
    @Inject(MAT_DIALOG_DATA) _data: BlockingProgressDialogData,
    private _dialogRef: MatDialogRef<BlockingProgressLoaderComponent>,
    private paginatedDataService: PaginatedDataService,
    private blockingProgressLoaderService: BlockingProgressLoaderService
  ) {
    this.setData(_data);
    this.blockingProgressLoaderService.progress.set(0);

    this.paginatedDataService
      .getProgressData(_data.dialogId)
      .subscribe((updatedData: BlockingProgressDialogData) => {
        if (updatedData) {
          this.data = { ...updatedData };
          this.blockingProgressLoaderService.progress.set(updatedData.progress);
          if (this.progress() === 100) {
            setTimeout(() => {
              this._dialogRef.close();
            }, 1000);
          }
        }
      });
  }

  cancel() {
    this._dialogRef.close();
  }

  retry() {
    if (this.data.retryFunction) {
      this.data.retryFunction();
    }
  }

  setData(data: BlockingProgressDialogData) {
    this.data = {
      dialogId: data.dialogId,
      title: data.title,
      message: data.message,
      allowCancel: data.allowCancel,
      progress: data.progress,
      failed: data.failed,
    };
  }
}
