import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Notification } from './notification.model';
import * as NotificationActions from './notification.actions';
import {getAssignedRequisitionNotifications} from "./notification.actions";

export const notificationsFeatureKey = 'notifications';

export interface State extends EntityState<Notification> {
  selected: string;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>();

export const initialState: State = adapter.getInitialState({
  selected: null,
  loading: false,
  loaded: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(NotificationActions.getNotifications, ((state, action) => {
      return {...state, loading: true, error: null};
    })
  ),
  on(NotificationActions.doneLoadingNotifications, ((state, action) => {
      return {...state, loading: false, error: null};
    })
  ),
  on(NotificationActions.failLoadingNotifications, ((state, action) => {
      return {...state, loading: false, error: action.error};
    })
  ),
  on(NotificationActions.setSelectedNotification, ((state, action) => {
      return {...state, selected: action.notificationId};
    })
  ),
  on(NotificationActions.addNotification,
    (state, action) => adapter.addOne(action.notification, state)
  ),
  on(NotificationActions.upsertNotification,
    (state, action) => adapter.upsertOne(action.notification, state)
  ),
  on(NotificationActions.addNotifications,
    (state, action) => adapter.addMany(action.notifications, state)
  ),
  on(NotificationActions.upsertNotifications,
    (state, action) => adapter.upsertMany(action.notifications, state)
  ),
  on(NotificationActions.updateNotification,
    (state, action) => adapter.updateOne(action.notification, state)
  ),
  on(NotificationActions.updateNotifications,
    (state, action) => adapter.updateMany(action.notifications, state)
  ),
  on(NotificationActions.deleteNotification,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(NotificationActions.deleteNotifications,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(NotificationActions.loadNotifications,
    (state, action) => adapter.setAll(action.notifications, state)
  ),
  on(NotificationActions.clearNotifications,
    state => adapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
export const getSelectedId = (state: State) => state.selected;
export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
export const getError = (state: State) => state.error;
