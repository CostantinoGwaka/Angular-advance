import { CREATE_UPDATE_INSTITUTION_USER_WITH_ROLE_TEST } from '../modules/nest-uaa/store/user-management/user/user.graphql';
import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { Store } from "@ngrx/store";
import { ApplicationState } from "../store";
import { NotificationService } from "./notification.service";
import { GraphqlService } from "./graphql.service";
import { UserDtoInput } from "../modules/nest-uaa/store/user-management/user/user.model";
import {
  CREATE_UPDATE_INSTITUTION_USER_WITH_MULTIPLE_ROLE,
  CREATE_UPDATE_INSTITUTION_USER_WITH_ROLE
} from "../modules/nest-uaa/store/user-management/user/user.graphql";
import * as fromUserActions from "../modules/nest-uaa/store/user-management/user/user.actions";

@Injectable({
  providedIn: 'root'
})
export class PeUserService {

  constructor(
    private store: Store<ApplicationState>,
    private notificationService: NotificationService,
    private apollo: GraphqlService
  ) {
  }


  async saveUpdatePeUser(multiple: boolean = false, role: any, data: UserDtoInput): Promise<boolean> {
    try {
      let newAttachment;
      if (data?.expertAttachmentBase64) {
        // newAttachment = newAttachment = data.expertAttachmentBase64.split(',')[1];
        const base64Parts = data?.expertAttachmentBase64.split(',');
        if (base64Parts.length === 2) {
          newAttachment = data?.expertAttachmentBase64?.split(',')[1];
        } else {
          newAttachment = data?.expertAttachmentBase64;
        }
      }

      const response: any = await this.apollo.mutate(
        {
          mutation: CREATE_UPDATE_INSTITUTION_USER_WITH_ROLE_TEST,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            roleNames: multiple ? role : [role],
            userAccountRequestDto: {
              ...data,
              expertAttachmentBase64: newAttachment
            }
          }
        }
      );
      if (response?.data?.createUserAccountTest?.code === 9000) {
        this.store.dispatch(fromUserActions.upsertUser({ user: response?.data?.createUserAccountTest?.data }));
        this.notificationService.successMessage(`User ${data?.uuid ? 'updated' : 'created'} successfully`);
        if (!data?.uuid) {
          this.store.dispatch(fromUserActions.peUserAddedSuccessfully());
        }
        return true;
      }
      else {
        throw new Error(response.data.createUserAccountTest?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage(e.message);
    }
    return false;
  }

  async saveUpdatePeUserWithMultipleRole(roles: string[], data: UserDtoInput): Promise<boolean> {
    try {
      const response: any = await this.apollo.mutate(
        {
          mutation: CREATE_UPDATE_INSTITUTION_USER_WITH_ROLE_TEST,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            roleNames: roles,
            userAccountRequestDto: data
          }
        }
      );
      if (response?.data?.createUserAccountTest?.code === 9000) {
        this.store.dispatch(fromUserActions.upsertUser({ user: response?.data?.createUserAccountTest?.data }));
        this.notificationService.successMessage(`User ${data?.uuid ? 'updated' : 'created'} successfully`);
        if (!data?.uuid) {
          this.store.dispatch(fromUserActions.peUserAddedSuccessfully());
        }
        return true;
      } else {
        throw new Error(response.data.createUserAccountTest.message);
      }
    } catch (e) {
      this.notificationService.errorMessage('Something went wrong while saving pe user: ' + e.message);
    }
    return false;
  }
}
