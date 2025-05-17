import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Notification } from './notification.model';

export const getNotifications = createAction(
  '[Notification/API] Get Notifications'
);

export const getAssignedRequisitionNotifications = createAction(
  '[Notification/API] Get All Assigned Endorsed Requisition Notification'
);

export const getAllNotifications = createAction(
  '[Notification/API] Get All Notifications'
);

export const doneLoadingNotifications = createAction(
  '[Notification/API] Done Loading Notifications'
);

export const failLoadingNotifications = createAction(
  '[Notification/API] Error Loading Notifications',
  props<{ error: any }>()
);

export const setSelectedNotification = createAction(
  '[Notification/API] Set Selected Notifications',
  props<{ notificationId: string }>()
);

export const loadNotifications = createAction(
  '[Notification/API] Load Notifications',
  props<{ notifications: Notification[] }>()
);

export const addNotification = createAction(
  '[Notification/API] Add Notification',
  props<{ notification: Notification }>()
);

export const upsertNotification = createAction(
  '[Notification/API] Upsert Notification',
  props<{ notification: Notification }>()
);

export const addNotifications = createAction(
  '[Notification/API] Add Notifications',
  props<{ notifications: Notification[] }>()
);

export const upsertNotifications = createAction(
  '[Notification/API] Upsert Notifications',
  props<{ notifications: Notification[] }>()
);

export const updateNotification = createAction(
  '[Notification/API] Update Notification',
  props<{ notification: Update<Notification> }>()
);

export const updateNotifications = createAction(
  '[Notification/API] Update Notifications',
  props<{ notifications: Update<Notification>[] }>()
);

export const deleteNotification = createAction(
  '[Notification/API] Delete Notification',
  props<{ id: string }>()
);

export const deleteNotifications = createAction(
  '[Notification/API] Delete Notifications',
  props<{ ids: string[] }>()
);

export const clearNotifications = createAction(
  '[Notification/API] Clear Notifications'
);
