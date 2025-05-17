import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { HelpDialogComponent, HelpDialogData } from '../shared/components/dynamic-forms-components/help-dialog-component/help-dialog-component.component';

@Injectable({
  providedIn: 'root'
})
export class HelpTextService {

  constructor(private dialog: MatDialog) { }

  async openHelpPage(data: HelpDialogData) {
    const dialogRef = this.dialog.open(HelpDialogComponent, {
      width: '500px',
      height: '100%',
      position: {
        right: '0'
      },
      data
    });
    await firstValueFrom(dialogRef.afterClosed());
  }
}
