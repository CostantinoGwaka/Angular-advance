import { Inject, Injectable } from '@angular/core';
import { UserPickerModalComponent } from './user-picker-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';

export interface PickedUser {
  user: User;
  institution: any;
}

export interface UserPickerModalData {
  title?: string;
  fromMultipleInstitutions?: boolean;
  allowSelfSelection: boolean;
  institutionType: 'PE' | 'TENDERER';
  roles?: string[];
  onUserPicked: (user: PickedUser) => void;
}

@Injectable({
  providedIn: 'root',
})
export class UserPickerModalService {
  constructor(private dialog: MatDialog) {}

  selectUser(data: UserPickerModalData) {
    const dialogRef = this.dialog.open(UserPickerModalComponent, {
      width: '500px',
      data,
    });

    dialogRef.afterClosed().subscribe((pickedUser) => {
      if (pickedUser) {
        if (pickedUser?.user?.uuid) {
          pickedUser = {
            ...pickedUser,
            institution: pickedUser.user.procuringEntity,
          };
          console.log('selectUser', pickedUser);
          data.onUserPicked(pickedUser);
        }
      }
    });
  }
}
