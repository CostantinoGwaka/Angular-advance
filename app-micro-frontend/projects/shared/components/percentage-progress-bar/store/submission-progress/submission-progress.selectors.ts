import {createSelector} from '@ngrx/store';
import * as fromSubmissionProgress from './submission-progress.reducer';
import {getNestTendererState} from "../../../../../modules/nest-tenderer/store/nest-tenderer.recuder";
import {EvaluationCriteriaStatus} from "../evaluation-progress/evaluation-progress.model";


export const currentState = createSelector(getNestTendererState, (state) => state.submissionProgress);
export const selectAllSubmissionProgress = createSelector(currentState, fromSubmissionProgress.selectAll);
export const selectSubmissionProgressLoading = createSelector(currentState, fromSubmissionProgress.getLoading);
export const selectedSubmissionUuid = createSelector(currentState, fromSubmissionProgress.getSelected);
export const selectedMainSubmissionUuid = createSelector(currentState, fromSubmissionProgress.getSelectedMainSubmission);
export const submissionProgressBarStatus = createSelector(currentState, fromSubmissionProgress.getSubmissionProgressBarStatus);
export const selectCriteriaStatus = createSelector(currentState, (state) => state.criteriaStatus);
export const selectSubmissionCriteriaGroups = createSelector(currentState, (state) => state.criteriaGroupList);
export const selectEntityType = createSelector(currentState, (state) => state.entityType);
export const selectEntityDetails = createSelector(currentState, (state) => state.tender);
export const selectIncompleteCriteria = createSelector(currentState, (state) => state.incompleteCriteria);
export const selectIncompleteCriteriaStatus = createSelector(
  selectCriteriaStatus,
  (criteriaList: EvaluationCriteriaStatus[]) => {
    return criteriaList.filter(i => !i.isCompleted);
});

