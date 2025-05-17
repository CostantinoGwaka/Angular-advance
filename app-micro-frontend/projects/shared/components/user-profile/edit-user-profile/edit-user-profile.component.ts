import { Component, OnInit, EventEmitter, Inject, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FormGroup, FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { GraphqlService } from "../../../../services/graphql.service";
import { UserDtoInput } from "../../../../modules/nest-uaa/store/user-management/user/user.model";
import { ApplicationState } from "../../../../store";
import { SAVE_USER } from "../../../../modules/nest-uaa/store/user-management/user/user.graphql";
import { NotificationService } from "../../../../services/notification.service";
import { SettingsService } from "../../../../services/settings.service";
import { fadeIn } from "../../../animations/router-animation";
import { upsertUser } from "../../../../modules/nest-uaa/store/user-management/user/user.actions";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Salutation, salutationTypes } from "../../../../modules/nest-tenderer/tenderer-users/add-users/add-users.form";
import { SaveAreaComponent } from '../../save-area/save-area.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalHeaderComponent } from '../../modal-header/modal-header.component';

@Component({
  selector: 'edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  animations: [fadeIn],
  standalone: true,
  imports: [ModalHeaderComponent, MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatInputModule, SaveAreaComponent]
})

export class EditUserProfileComponent implements OnInit {


  loading = false;
  salutationTypes: Salutation[];
  form: FormGroup;
  dataUser: any;
  userData: UserDtoInput;
  @Output() detailUpdated = new EventEmitter<boolean>();

  constructor(
    private settingService: SettingsService,
    private apollo: GraphqlService,
    private dialogRef: MatBottomSheetRef<EditUserProfileComponent>,
    private store: Store<ApplicationState>,
    private notificationService: NotificationService,
    @Inject(MAT_BOTTOM_SHEET_DATA) data
  ) {
    this.dataUser = data;
    this.userData = {
      uuid: data.uuid,
      salutation: data.salutation,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      checkNumber: data.checkNumber
    };
    this.salutationTypes = salutationTypes;
  }


  ngOnInit(): void { }

  async saveData(formValues: UserDtoInput) {
    this.loading = true;

    if (this.dataUser.checkNumber) {
      formValues = {
        ...formValues,
        checkNumber: this.dataUser.checkNumber
      }
    }
    try {
      const response: any = await this.apollo.mutate(
        {
          mutation: SAVE_USER,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            user: {
              ...formValues,
            },
          }
        }
      );

      if (response?.data?.createUpdateUserAccount?.code === 9000) {
        this.store.dispatch(upsertUser({ user: response?.data?.createUpdateUserAccount?.data }));
        this.notificationService.successMessage('Account information updated successfully');
        this.closeModal(true);
      } else {
        this.notificationService.errorMessage('Something went wrong while updating your information');
        console.error(response?.data?.createUpdateUserAccount?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage('Something went wrong while updating your information');
      console.error('error', e.message)
    }
    this.loading = false;
  }


  closeModal(close?: boolean): void {
    this.dialogRef.dismiss(close);
  }

}
