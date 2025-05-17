import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ClarificationNotification } from './clarification-notification.model';
import * as ClarificationNotificationActions from './clarification-notification.actions';

export const clarificationNotificationsFeatureKey = 'clarificationNotifications';

export interface State extends EntityState<ClarificationNotification> {
  selected: string;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const adapter: EntityAdapter<ClarificationNotification> = createEntityAdapter<ClarificationNotification>();

export const initialState: State = adapter.getInitialState({
  selected: null,
  loading: false,
  loaded: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(ClarificationNotificationActions.getClarificationNotifications, ((state, action) => {
      return {...state, loading: true, error: null};
    })
  ),
  on(ClarificationNotificationActions.doneLoadingClarificationNotifications, ((state, action) => {
      return {...state, loading: false, error: null};
    })
  ),
  on(ClarificationNotificationActions.failLoadingClarificationNotifications, ((state, action) => {
      return {...state, loading: false, error: action.error};
    })
  ),
  on(ClarificationNotificationActions.setSelectedClarificationNotification, ((state, action) => {
      return {...state, selected: action.clarificationNotificationId};
    })
  ),
  on(ClarificationNotificationActions.addClarificationNotification,
    (state, action) => adapter.addOne(action.clarificationNotification, state)
  ),
  on(ClarificationNotificationActions.upsertClarificationNotification,
    (state, action) => adapter.upsertOne(action.clarificationNotification, state)
  ),
  on(ClarificationNotificationActions.addClarificationNotifications,
    (state, action) => adapter.addMany(action.clarificationNotifications, state)
  ),
  on(ClarificationNotificationActions.upsertClarificationNotifications,
    (state, action) => adapter.upsertMany(action.clarificationNotifications, state)
  ),
  on(ClarificationNotificationActions.updateClarificationNotification,
    (state, action) => adapter.updateOne(action.clarificationNotification, state)
  ),
  on(ClarificationNotificationActions.updateClarificationNotifications,
    (state, action) => adapter.updateMany(action.clarificationNotifications, state)
  ),
  on(ClarificationNotificationActions.deleteClarificationNotification,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ClarificationNotificationActions.deleteClarificationNotifications,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ClarificationNotificationActions.loadClarificationNotifications,
    (state, action) => adapter.setAll(action.clarificationNotifications, state)
  ),
  on(ClarificationNotificationActions.clearClarificationNotifications,
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
