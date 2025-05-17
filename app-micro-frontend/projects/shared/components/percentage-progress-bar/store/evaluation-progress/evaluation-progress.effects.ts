import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from "./evaluation-progress.actions";
import { switchMap } from "rxjs/operators";
import * as fromGraphql from "./evaluation-progress.graphql";
import { GraphqlService } from "../../../../../services/graphql.service";
import { EvaluationCriteriaStatus, EvaluationProgress } from "./evaluation-progress.model";
import {ApolloNamespace} from "../../../../../apollo.config";


@Injectable()
export class EvaluationProgressEffects {
  constructor(
    private actions$: Actions,
    private apollo: GraphqlService,
  ) { }

  getAll$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.getEvaluationProgress),
    switchMap((action) => this.apollo.fetchDataObservable({
      query: fromGraphql.GET_SUBMISSION_CRITERIA_EVALUATION_COMPLETION_STATUS_BY_STAGE_AND_STAGE_UUID,
      apolloNamespace: ApolloNamespace.submission,
      variables: {
        memberEvaluationStageUuid: action.memberEvaluationStageUuid,
      }
      })
    ),
    switchMap((response: any) => {
      const responseData = response?.data?.getSubmissionCriteriaEvaluationCompletionStatusByStageAndStageUuid?.dataList;
      const evaluatedScore = responseData.filter(score => score.isCompleted).length;
      const summary: EvaluationProgress =  {
        evaluatedScore: evaluatedScore,
        totalScore: responseData.length
      }
      return [
        fromActions.setEvaluationProgress({ progress: summary }),
      ];
    })
  ));


  getCriteriaStatus$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.getEvaluationCriteriaStatus),
    switchMap((action) => {
      return this.apollo.fetchDataObservable({
      query: fromGraphql.GET_SUBMISSION_CRITERIA_EVALUATION_COMPLETION_STATUS_BY_STAGE_AND_STAGE_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
        memberEvaluationStageUuid: action.memberEvaluationStageUuid,
      }
    })
    }
    ),
    switchMap((response: any) => {
      fromActions.clearEvaluationCriteriaStatus();

      const criteriaStatus: EvaluationCriteriaStatus[] =
        response?.data?.getSubmissionCriteriaEvaluationCompletionStatusByStageAndStageUuid?.dataList || [];
      return [
        fromActions.setCriteriaStatus({ criteriaStatus: criteriaStatus }),
      ];
    })
  ));
}
