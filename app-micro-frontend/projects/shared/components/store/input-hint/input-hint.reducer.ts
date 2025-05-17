import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { InputHint } from './input-hint.model';
import * as InputHintActions from './input-hint.actions';

export const inputHintsFeatureKey = 'inputHints';

export interface State extends EntityState<InputHint> {
  selected: string;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const adapter: EntityAdapter<InputHint> = createEntityAdapter<InputHint>();

export const initialState: State = adapter.getInitialState({
  selected: null,
  loading: false,
  loaded: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(InputHintActions.getInputHints, ((state, action) => {
      return {...state, loading: true, error: null};
    })
  ),
  on(InputHintActions.doneLoadingInputHints, ((state, action) => {
      return {...state, loading: false, error: null};
    })
  ),
  on(InputHintActions.failLoadingInputHints, ((state, action) => {
      return {...state, loading: false, error: action.error};
    })
  ),
  on(InputHintActions.setSelectedInputHint, ((state, action) => {
      return {...state, selected: action.inputHintId};
    })
  ),
  on(InputHintActions.addInputHint,
    (state, action) => adapter.addOne(action.inputHint, state)
  ),
  on(InputHintActions.upsertInputHint,
    (state, action) => adapter.upsertOne(action.inputHint, state)
  ),
  on(InputHintActions.addInputHints,
    (state, action) => adapter.addMany(action.inputHints, state)
  ),
  on(InputHintActions.upsertInputHints,
    (state, action) => adapter.upsertMany(action.inputHints, state)
  ),
  on(InputHintActions.updateInputHint,
    (state, action) => adapter.updateOne(action.inputHint, state)
  ),
  on(InputHintActions.updateInputHints,
    (state, action) => adapter.updateMany(action.inputHints, state)
  ),
  on(InputHintActions.deleteInputHint,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(InputHintActions.deleteInputHints,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(InputHintActions.loadInputHints,
    (state, action) => adapter.setAll(action.inputHints, state)
  ),
  on(InputHintActions.clearInputHints,
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
