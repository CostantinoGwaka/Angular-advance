import {createSelector} from '@ngrx/store';
import * as fromEvaluationProgress from './evaluation-progress.reducer';
import {getNestTendererState} from "../../../../../modules/nest-tenderer/store/nest-tenderer.recuder";
import {EvaluationCriteriaStatus} from "./evaluation-progress.model";

export const currentState = createSelector(getNestTendererState, (state) => state.evaluationProgress);
export const selectedEvaluationProgress = createSelector(currentState, (state) => state.progress);
export const selectEvaluationProgressLoading = createSelector(currentState, fromEvaluationProgress.getLoading);
export const selectedEvaluationUuid = createSelector(currentState, (state) => state.selectedEvaluationUuid);
export const selectedEvaluationStageUuid = createSelector(currentState, (state) => state.selectedEvaluationStageUuid);
export const selectTotalEvaluationProgress = createSelector(currentState, fromEvaluationProgress.selectTotal);
export const selectedMemberUuid = createSelector(currentState, (state) => state.selectedMemberUuid);
export const selectedCurrentStage = createSelector(currentState, (state) => state.selectedCurrentStage);
export const evaluationProgressBarStatus = createSelector(
  currentState,
  fromEvaluationProgress.getEvaluationProgressBarStatus
);
export const selectCriteriaStatus = createSelector(currentState, (state) => state.criteriaStatus);
export const selectIncompleteCriteriaStatus = createSelector(
  selectCriteriaStatus,
  (criteriaList: EvaluationCriteriaStatus[]) => {
    return criteriaList.filter(i => !i.isCompleted);
});
