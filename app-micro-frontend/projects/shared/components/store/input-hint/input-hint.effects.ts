import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from './input-hint.actions';

@Injectable()
export class InputHintEffects {

  loadData$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.getInputHints),
  ),
  );

  constructor(
    private actions$: Actions,
  ) {
  }
}
