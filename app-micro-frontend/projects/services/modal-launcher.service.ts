import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalLauncherService {
  loaderDialogRef: any;
  constructor(private dialog: MatDialog) {}

  launchModel(
    component: any,
    config: MatDialogConfig<any>,
    onCloseFunction: (data: any) => void
  ) {
    this.loaderDialogRef = this.dialog.open(component, config);

    this.loaderDialogRef.afterClosed().subscribe((data) => {
      onCloseFunction(data);
    });
  }
}
