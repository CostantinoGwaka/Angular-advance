import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ClarificationNotification } from './clarification-notification.model';

export const getClarificationNotifications = createAction(
  '[ClarificationNotification/API] Get ClarificationNotifications'
);

export const doneLoadingClarificationNotifications = createAction(
  '[ClarificationNotification/API] Done Loading ClarificationNotifications'
);

export const failLoadingClarificationNotifications = createAction(
  '[ClarificationNotification/API] Error Loading ClarificationNotifications',
  props<{ error: any }>()
);

export const setSelectedClarificationNotification = createAction(
  '[ClarificationNotification/API] Set Selected ClarificationNotifications',
  props<{ clarificationNotificationId: string }>()
);

export const loadClarificationNotifications = createAction(
  '[ClarificationNotification/API] Load ClarificationNotifications',
  props<{ clarificationNotifications: ClarificationNotification[] }>()
);

export const addClarificationNotification = createAction(
  '[ClarificationNotification/API] Add ClarificationNotification',
  props<{ clarificationNotification: ClarificationNotification }>()
);

export const upsertClarificationNotification = createAction(
  '[ClarificationNotification/API] Upsert ClarificationNotification',
  props<{ clarificationNotification: ClarificationNotification }>()
);

export const addClarificationNotifications = createAction(
  '[ClarificationNotification/API] Add ClarificationNotifications',
  props<{ clarificationNotifications: ClarificationNotification[] }>()
);

export const upsertClarificationNotifications = createAction(
  '[ClarificationNotification/API] Upsert ClarificationNotifications',
  props<{ clarificationNotifications: ClarificationNotification[] }>()
);

export const updateClarificationNotification = createAction(
  '[ClarificationNotification/API] Update ClarificationNotification',
  props<{ clarificationNotification: Update<ClarificationNotification> }>()
);

export const updateClarificationNotifications = createAction(
  '[ClarificationNotification/API] Update ClarificationNotifications',
  props<{ clarificationNotifications: Update<ClarificationNotification>[] }>()
);

export const deleteClarificationNotification = createAction(
  '[ClarificationNotification/API] Delete ClarificationNotification',
  props<{ id: string }>()
);

export const deleteClarificationNotifications = createAction(
  '[ClarificationNotification/API] Delete ClarificationNotifications',
  props<{ ids: string[] }>()
);

export const clearClarificationNotifications = createAction(
  '[ClarificationNotification/API] Clear ClarificationNotifications'
);
