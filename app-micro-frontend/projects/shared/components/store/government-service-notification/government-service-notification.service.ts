import { Injectable } from '@angular/core';
import { GraphqlService } from "../../../../services/graphql.service";
import {
  clearGovernmentServiceNotifications,
  getDeliveryAdviseGSPSideByApprovalStatus, getDeliveryAdviseGSPSideWaitForPayment,
  getDeliveryAdvisePESideByApprovalStatus,
  getDeliveryNoteGSPSideByApprovalStatus,
  getDeliveryNotePESideByApprovalStatus, getGSPReceivedOrder
} from "./government-service-notification.actions";
import { DeliveryNoteApprovalStatusEnum } from "../../../../modules/nest-government/store/delivery-note/delivery-note.model";
import { ApprovalStatusEnum } from "../../../../modules/nest-government/store/delivery-advise/delivery-advise.model";
import { AuthService } from "../../../../services/auth.service";
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";

@Injectable({
  providedIn: 'root',
})
export class GovernmentServiceNotificationService {
  constructor(
    public graphqlService: GraphqlService,
    private authService: AuthService,
    private store: Store<ApplicationState>,
  ) { }


  async handleGovernmentServiceNotification() {
    this.store.dispatch(clearGovernmentServiceNotifications());
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_AWIT_CNFRMTN_CNFRM'])) {
      this.store.dispatch(getDeliveryNotePESideByApprovalStatus(
        { approvalStatus: DeliveryNoteApprovalStatusEnum.WAIT_FOR_PE_DELIVERY_CONFIRMATION }
      ));
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_DRFT'])) {
      this.store.dispatch(getDeliveryNoteGSPSideByApprovalStatus(
        { approvalStatus: DeliveryNoteApprovalStatusEnum.DRAFT }
      ));
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_CNFRMTN_CNFRM'])) {
      this.store.dispatch(getDeliveryAdvisePESideByApprovalStatus(
        { approvalStatus: ApprovalStatusEnum.WAIT_FOR_PE_CONFIRMATION }
      ));
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_CNFRMD'])) {
      this.store.dispatch(getDeliveryAdviseGSPSideByApprovalStatus(
        { approvalStatus: ApprovalStatusEnum.PE_CONFIRMED }
      ));
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_WAT_FR_PTMNT'])) {
      this.store.dispatch(getDeliveryAdviseGSPSideWaitForPayment());
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_GSP_RCVD_ORDRS'])) {
      this.store.dispatch(getGSPReceivedOrder());
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_GSP_ACCNTNT_LST'])) {
      this.store.dispatch(getDeliveryAdviseGSPSideByApprovalStatus(
        { approvalStatus: ApprovalStatusEnum.AWAIT_GSP_ACCOUNTANT_ACTION }
      ));
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms
    if (this.authService.hasPermission(['ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_PYMT'])) {
      this.store.dispatch(getDeliveryAdvisePESideByApprovalStatus(
        { approvalStatus: ApprovalStatusEnum.AWAIT_PAYMENT }
      ));
    }
  }

}
