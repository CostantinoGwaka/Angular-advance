import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from "./submission-progress.actions";
import { switchMap } from "rxjs/operators";
import * as fromGraphql from "./submission-progress.graphql";
import { GraphqlService } from "../../../../../services/graphql.service";
import { SubmissionProgress } from "./submission-progress.model";
import { Store } from "@ngrx/store";
import { State } from "../../../../../modules/nest-app/store/nest-app.reducer";


@Injectable()
export class SubmissionProgressEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private apollo: GraphqlService,
  ) { }


  getAll$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.getSubmissionProgress),
    switchMap((action) => this.apollo.fetchDataObservable({
      query: fromGraphql.GET_TENDERER_TENDER_SUBMISSION_SUMMARY,
      apolloNamespace: ApolloNamespace.submission,
      variables: {
        submissionUuid: action.submissionUuid,
        entityType: action.entityType
      }
    })
    ),
    switchMap((response: any) => {
      const summary = response?.data?.getTendererTenderSubmissionSummary?.dataList as SubmissionProgress[] || [];
      return [
        fromActions.loadSubmissionProgress({
          submissionProgress: summary
        }),
      ];
    })
  ));


  // getIncompleteCriteriaList$ = createEffect(() => this.actions$.pipe(
  //   ofType(fromActions.getSubmissionProgress),
  //   switchMap((action) => this.apollo.fetchDataObservable({
  //       query: GET_SUBMISSION_CRITERIA_STATUS_CHECK,
  //       variables: {
  //         submissionUuid: action.submissionUuid,
  //       }
  //     })
  //   ),
  //   switchMap((response: any) => {
  //     const criteriaStatus: EvaluationCriteriaStatus[] = response?.data?.getSubmissionCriteriaStatusCheck?.dataList || [];
  //
  //     //
  //     return [
  //       fromActions.setCriteriaStatus({
  //         criteriaStatus: criteriaStatus
  //       }),
  //     ];
  //   })
  // ));
}
