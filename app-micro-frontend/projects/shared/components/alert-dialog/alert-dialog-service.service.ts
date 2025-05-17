import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, map } from 'rxjs';
import { AlertDialogComponent } from './alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AlertDialogService {

  constructor(public dialog: MatDialog) { }

  async openDialog({ title, message, width = '400px', status = 'info', cancelBtnText = 'Cancel', okBtnText = 'OK', showCancelBtn = true }: {
    title: string,
    width?: string,
    message: string,
    status?: 'info' | 'warning' | 'primary',
    cancelBtnText?: string,
    showCancelBtn?: boolean,
    okBtnText?: string,
  }): Promise<boolean> {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: width || '400px',
      data: {
        title,
        message,
        status: status || 'info',
        cancelBtnText: cancelBtnText || 'Cancel',
        showCancelBtn: showCancelBtn,
        okBtnText: okBtnText || 'OK'
      }
    });

    return await lastValueFrom(dialogRef.afterClosed());
  }
}
