import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { GovernmentServiceNotification } from './government-service-notification.model';
import {DeliveryNoteApprovalStatusEnum} from "../../../../modules/nest-government/store/delivery-note/delivery-note.model";
import {ApprovalStatusEnum} from "../../../../modules/nest-government/store/delivery-advise/delivery-advise.model";


export const getDeliveryNotePESideByApprovalStatus = createAction(
  '[GovernmentServiceNotification/API] Get DeliveryNotePESideByApprovalStatus',
  props<{ approvalStatus: DeliveryNoteApprovalStatusEnum }>()
);

export const getDeliveryNoteGSPSideByApprovalStatus = createAction(
  '[GovernmentServiceNotification/API] Get DeliveryNoteGSPSideByApprovalStatus',
  props<{ approvalStatus: DeliveryNoteApprovalStatusEnum }>()
);

export const getDeliveryAdvisePESideByApprovalStatus = createAction(
  '[GovernmentServiceNotification/API] Get DeliveryAdvisePESideByApprovalStatus',
  props<{ approvalStatus: ApprovalStatusEnum }>()
);

export const getDeliveryAdviseGSPSideByApprovalStatus = createAction(
  '[GovernmentServiceNotification/API] Get DeliveryAdviseGSPSideByApprovalStatus',
  props<{ approvalStatus: ApprovalStatusEnum }>()
);

export const getDeliveryAdviseGSPSideWaitForPayment = createAction(
  '[GovernmentServiceNotification/API] Get DeliveryAdviseGSPSideWaitForPayment'
);

export const getGSPReceivedOrder = createAction(
  '[GovernmentServiceNotification/API] Get GovernmentServiceReceivedOrder',
);

export const loadGovernmentServiceNotifications = createAction(
  '[GovernmentServiceNotification/API] Load GovernmentServiceNotifications',
  props<{ governmentServiceNotifications: GovernmentServiceNotification[] }>()
);

export const addGovernmentServiceNotification = createAction(
  '[GovernmentServiceNotification/API] Add GovernmentServiceNotification',
  props<{ governmentServiceNotification: GovernmentServiceNotification }>()
);

export const upsertGovernmentServiceNotification = createAction(
  '[GovernmentServiceNotification/API] Upsert GovernmentServiceNotification',
  props<{ governmentServiceNotification: GovernmentServiceNotification }>()
);

export const addGovernmentServiceNotifications = createAction(
  '[GovernmentServiceNotification/API] Add GovernmentServiceNotifications',
  props<{ governmentServiceNotifications: GovernmentServiceNotification[] }>()
);

export const upsertGovernmentServiceNotifications = createAction(
  '[GovernmentServiceNotification/API] Upsert GovernmentServiceNotifications',
  props<{ governmentServiceNotifications: GovernmentServiceNotification[] }>()
);

export const updateGovernmentServiceNotification = createAction(
  '[GovernmentServiceNotification/API] Update GovernmentServiceNotification',
  props<{ governmentServiceNotification: Update<GovernmentServiceNotification> }>()
);

export const updateGovernmentServiceNotifications = createAction(
  '[GovernmentServiceNotification/API] Update GovernmentServiceNotifications',
  props<{ governmentServiceNotifications: Update<GovernmentServiceNotification>[] }>()
);

export const deleteGovernmentServiceNotification = createAction(
  '[GovernmentServiceNotification/API] Delete GovernmentServiceNotification',
  props<{ id: string }>()
);

export const deleteGovernmentServiceNotifications = createAction(
  '[GovernmentServiceNotification/API] Delete GovernmentServiceNotifications',
  props<{ ids: string[] }>()
);

export const clearGovernmentServiceNotifications = createAction(
  '[GovernmentServiceNotification/API] Clear GovernmentServiceNotifications'
);
