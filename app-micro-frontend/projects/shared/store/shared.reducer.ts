import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import * as fromInputHint from '../../shared/components/store/input-hint/input-hint.reducer';
import * as fromNotification from '../../shared/components/store/notification/notification.reducer';
import * as fromClarificationNotification from '../../shared/components/store/clarification-notification/clarification-notification.reducer';
import * as fromGovernmentServiceNotification from '../../shared/components/store/government-service-notification/government-service-notification.reducer';


export interface State {
  inputHint: fromInputHint.State;
  notification: fromNotification.State;
  clarificationNotification: fromClarificationNotification.State;
  governmentServiceNotification: fromGovernmentServiceNotification.State;
}

export const initialState: State = {
  inputHint: fromInputHint.initialState,
  notification: fromNotification.initialState,
  clarificationNotification: fromClarificationNotification.initialState,
  governmentServiceNotification: fromGovernmentServiceNotification.initialState
};

export const reducers: ActionReducerMap<State> = {
  inputHint: fromInputHint.reducer,
  notification: fromNotification.reducer,
  clarificationNotification: fromClarificationNotification.reducer,
  governmentServiceNotification: fromGovernmentServiceNotification.reducer,
};

export const getSharedState = createFeatureSelector<State>('nestShared');

