import { createAction, props } from '@ngrx/store';

import {EvaluationCriteriaStatus, EvaluationProgress} from './evaluation-progress.model';
import {EvaluationTeamMemberStage} from "../../../../../modules/nest-tender-evaluation/store/evaluation/evaluation.model";

////////////  EFFECT ACTIONS \\\\\\\\\\\\
export const clearEvaluationProgress = createAction(
  '[EvaluationProgress/API] Clear EvaluationProgress'
);

export const clearEvaluationCriteriaStatus = createAction(
  '[EvaluationProgress/API] Clear Evaluation Criteria Status'
);

export const setSelectedEvaluationUuid = createAction(
  '[EvaluationProgress/API] Set Selected',
  props<{selectedEvaluationUuid: string }>()
);

export const setSelectedEvaluationStageUuid = createAction(
  '[EvaluationProgress/API] setSelectedEvaluationStageUuid',
  props<{selectedEvaluationStageUuid: string }>()
);

export const setSelectedMemberUuid = createAction(
  '[EvaluationProgress/API] set selected MemberUuid',
  props<{selectedMemberUuid: string }>()
);

export const setEvaluationProgress = createAction(
  '[EvaluationProgress/API] set selected evaluation progress',
  props<{progress: EvaluationProgress }>()
);

export const setCriteriaStatus = createAction(
  '[EvaluationProgress/API] set criteria status',
  props<{criteriaStatus: EvaluationCriteriaStatus[] }>()
);

export const setSelectedCurrentStage = createAction(
  '[EvaluationProgress/API] set selectedCurrentStage',
  props<{selectedCurrentStage: EvaluationTeamMemberStage }>()
);

export const showEvaluationProgressBar = createAction(
  '[EvaluationProgress/API] Set showEvaluationProgressBar',
  props<{showEvaluationProgressBar: boolean }>()
);

export const getEvaluationProgress = createAction(
  '[EvaluationProgress/API] get all EvaluationProgress',
  props<{memberEvaluationStageUuid: string}>()
);

export const getEvaluationCriteriaStatus = createAction(
  '[EvaluationProgress/API] get all EvaluationProgress',
  props<{memberEvaluationStageUuid: string}>()
);

export const getCurrentEvaluationStage = createAction(
  '[EvaluationProgress/API] get all EvaluationProgress',
  props<{evaluationUuid: string}>()
);

export const getSelectedMemberUuid = createAction(
  '[EvaluationProgress/API] get selected MemberUuid',
  props<{selectedMemberUuid: string }>()
);

export const getSelectedCurrentStage = createAction(
  '[EvaluationProgress/API] get selectedCurrentStage',
  props<{selectedCurrentStage: EvaluationTeamMemberStage }>()
);
