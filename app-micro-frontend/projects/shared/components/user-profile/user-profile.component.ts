import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RolePermissionsComponent } from 'src/app/modules/nest-settings/uaa-settings/roles/role-permissions/role-permissions.component';
import { User } from "../../../modules/nest-uaa/store/user-management/user/user.model";
import { firstValueFrom } from "rxjs";
import { select, Store } from "@ngrx/store";
import { selectModifiedAuthUsers } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { map } from "rxjs/operators";
import { ApplicationState } from "../../../store";
import { ReplacePipe } from '../../pipes/replace.pipe';
import { UserSubscriptionsComponent } from '../user-subscriptions/user-subscriptions.component';
import { ItemDetailWithIcon } from '../item-detail-with-icon/item-detail-with-icon';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, HasPermissionDirective, ItemDetailWithIcon, UserSubscriptionsComponent, UpperCasePipe, ReplacePipe]
})

export class UserProfileComponent implements OnInit {

  loading: boolean = true;

  @Input() user;
  @Input() showEditButton: boolean = true;
  @Input() updateProfilePermission: string;
  @Input() peProfile: boolean = false;
  @Input() showUserSubscriptions: boolean = false;

  @Output() updateProfile = new EventEmitter<User>();

  constructor(
    private _bottomSheet: MatBottomSheet,
    private store: Store<ApplicationState>
  ) { }

  ngOnInit(): void {
    setTimeout(async () => {
      if (!this.user) {
        this.user = await firstValueFrom(
          this.store.pipe(select(selectModifiedAuthUsers), map(users => users[0]))
        );
      }
    }, 800);
  }

  editProfile() {
    this.updateProfile.emit(this.user);
  }

  openRole(role: any) {
    const dialogRef = this._bottomSheet.open(RolePermissionsComponent, { data: { ...role } });
  }


}
