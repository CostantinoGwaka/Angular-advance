import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GovernmentServiceNotification } from './government-service-notification.model';
import * as governmentServiceNotificationActions from './government-service-notification.actions';

export const governmentServiceNotificationsFeatureKey = 'governmentServiceNotifications';

export interface State extends EntityState<GovernmentServiceNotification> {
  selected: string;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const adapter: EntityAdapter<GovernmentServiceNotification> = createEntityAdapter<GovernmentServiceNotification>();

export const initialState: State = adapter.getInitialState({
  selected: null,
  loading: false,
  loaded: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  // on(governmentServiceNotificationActions.getGovernmentServiceNotifications, ((state, action) => {
  //     return {...state, loading: true, error: null};
  //   })
  // ),
  // on(governmentServiceNotificationActions.doneLoadingGovernmentServiceNotifications, ((state, action) => {
  //     return {...state, loading: false, error: null};
  //   })
  // ),
  // on(governmentServiceNotificationActions.failLoadingGovernmentServiceNotifications, ((state, action) => {
  //     return {...state, loading: false, error: action.error};
  //   })
  // ),
  // on(governmentServiceNotificationActions.setSelectedGovernmentServiceNotification, ((state, action) => {
  //     return {...state, selected: action.governmentServiceNotificationId};
  //   })
  // ),
  on(governmentServiceNotificationActions.addGovernmentServiceNotification,
    (state, action) => adapter.addOne(action.governmentServiceNotification, state)
  ),
  on(governmentServiceNotificationActions.upsertGovernmentServiceNotification,
    (state, action) => adapter.upsertOne(action.governmentServiceNotification, state)
  ),
  on(governmentServiceNotificationActions.addGovernmentServiceNotifications,
    (state, action) => adapter.addMany(action.governmentServiceNotifications, state)
  ),
  on(governmentServiceNotificationActions.upsertGovernmentServiceNotifications,
    (state, action) => adapter.upsertMany(action.governmentServiceNotifications, state)
  ),
  on(governmentServiceNotificationActions.updateGovernmentServiceNotification,
    (state, action) => adapter.updateOne(action.governmentServiceNotification, state)
  ),
  on(governmentServiceNotificationActions.updateGovernmentServiceNotifications,
    (state, action) => adapter.updateMany(action.governmentServiceNotifications, state)
  ),
  on(governmentServiceNotificationActions.deleteGovernmentServiceNotification,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(governmentServiceNotificationActions.deleteGovernmentServiceNotifications,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(governmentServiceNotificationActions.loadGovernmentServiceNotifications,
    (state, action) => adapter.setAll(action.governmentServiceNotifications, state)
  ),
  on(governmentServiceNotificationActions.clearGovernmentServiceNotifications,
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
