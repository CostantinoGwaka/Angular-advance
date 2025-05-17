import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from "../clarification-notification/clarification-notification.actions";
import { map, switchMap } from "rxjs/operators";
import * as fromGraphql from "../clarification-notification/clarification-notification.graphql";
import { Router } from "@angular/router";
import { GraphqlService } from "../../../../services/graphql.service";
import { Store } from "@ngrx/store";
import * as fromState from "../../../../modules/nest-app/store/nest-app.reducer";
import { NotificationService } from "../../../../services/notification.service";
import { DataRequestInput } from "../../paginated-data-table/data-page.model";
import { ClarificationNotification } from "./clarification-notification.model";

@Injectable()
export class ClarificationNotificationEffects {


  constructor(
    private actions$: Actions,
    private router: Router,
    private apollo: GraphqlService,
    private store: Store<fromState.State>,
    private notificationService: NotificationService,
  ) {
  }

  getAllClarificationNotification$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.getClarificationNotifications),
    switchMap((action) => {
      let pageSize = 10;
      let input: DataRequestInput = {
        page: 0,
        pageSize: pageSize,
        fields: [],
      };
      return this.apollo.fetchDataObservable({
        query: fromGraphql.GET_ALL_CLARIFICATION_NOTIFICATIONS,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          input: input,
        },
      }).pipe(
        this.notificationService.catchError('Problem occurred while listing my task'),
        map((clarificationNotifications: any) => {
          if (clarificationNotifications) {
            this.store.dispatch(fromActions.clearClarificationNotifications());
            let result: ClarificationNotification[] = (clarificationNotifications?.data?.getClarificationsByPEData?.rows || []).map((notificationData: ClarificationNotification) => {
              return {
                ...notificationData
              }
            });
            this.store.dispatch(fromActions.addClarificationNotifications({ clarificationNotifications: result || [] }));
          } else {
            this.notificationService.errorMessage('Failed to fetch clarification notifications');
          }
        })
      );
    })
  ), { dispatch: false });

}
