import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as peRequirementActions from './pe-requirement.actions';
import {PeRequirementStateModel, PeRequirementSubmissionModel} from "./pe-requirement.model";


export interface State extends EntityState<PeRequirementStateModel> {
  // additional entities state properties
  selectedUuid: string;
  selected: string;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const adapter: EntityAdapter<PeRequirementStateModel> = createEntityAdapter<PeRequirementStateModel>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
  selected: null,
  selectedUuid: null,
  ids: [],
  entities: null
});

export const reducer = createReducer(
  initialState,
  on(peRequirementActions.upsertPeRequirementSubmission,
    (state, action) => adapter.upsertOne(action.peRequirement, state)
  ),
);

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selectedUuid;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
