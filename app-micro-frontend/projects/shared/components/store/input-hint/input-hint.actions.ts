import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { InputHint } from './input-hint.model';

export const getInputHints = createAction(
  '[InputHint/API] Get InputHints'
);

export const doneLoadingInputHints = createAction(
  '[InputHint/API] Done Loading InputHints'
);

export const failLoadingInputHints = createAction(
  '[InputHint/API] Error Loading InputHints',
  props<{ error: any }>()
);

export const setSelectedInputHint = createAction(
  '[InputHint/API] Set Selected InputHints',
  props<{ inputHintId: string }>()
);

export const loadInputHints = createAction(
  '[InputHint/API] Load InputHints',
  props<{ inputHints: InputHint[] }>()
);

export const addInputHint = createAction(
  '[InputHint/API] Add InputHint',
  props<{ inputHint: InputHint }>()
);

export const upsertInputHint = createAction(
  '[InputHint/API] Upsert InputHint',
  props<{ inputHint: InputHint }>()
);

export const addInputHints = createAction(
  '[InputHint/API] Add InputHints',
  props<{ inputHints: InputHint[] }>()
);

export const upsertInputHints = createAction(
  '[InputHint/API] Upsert InputHints',
  props<{ inputHints: InputHint[] }>()
);

export const updateInputHint = createAction(
  '[InputHint/API] Update InputHint',
  props<{ inputHint: Update<InputHint> }>()
);

export const updateInputHints = createAction(
  '[InputHint/API] Update InputHints',
  props<{ inputHints: Update<InputHint>[] }>()
);

export const deleteInputHint = createAction(
  '[InputHint/API] Delete InputHint',
  props<{ id: string }>()
);

export const deleteInputHints = createAction(
  '[InputHint/API] Delete InputHints',
  props<{ ids: string[] }>()
);

export const clearInputHints = createAction(
  '[InputHint/API] Clear InputHints'
);
