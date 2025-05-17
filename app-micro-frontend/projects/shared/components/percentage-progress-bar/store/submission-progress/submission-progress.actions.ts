import { createAction, props } from '@ngrx/store';

import { SubmissionProgress } from './submission-progress.model';
import {EvaluationCriteriaStatus, SubmissionCriteriaGroup} from "../evaluation-progress/evaluation-progress.model";
import { EntityObjectTypeEnum } from 'src/app/modules/nest-app/store/tender/tender.model';

////////////  EFFECT ACTIONS \\\\\\\\\\\\
export const loadSubmissionProgress = createAction(
  '[SubmissionProgress/API] Load SubmissionProgress',
  props<{ submissionProgress: SubmissionProgress[] }>()
);

export const upsertSubmissionProgress = createAction(
  '[SubmissionProgress/API] Upsert SubmissionProgress',
  props<{ submissionProgress: SubmissionProgress }>()
);

export const clearSubmissionProgress = createAction(
  '[SubmissionProgress/API] Clear SubmissionProgress'
);

export const setSelectedSubmissionUuid = createAction(
  '[SubmissionProgress/API] Set SelectedSubmissionUuid',
  props<{selectedUuid: string }>()
);

export const upsertTenderEntityDetail = createAction(
  '[SubmissionProgress/API] upsertTenderEntityDetail',
  props<{tender:  any}>()
);

export const setEntityType = createAction(
  '[SubmissionProgress/API] Set entityType',
  props<{entityType: string }>()
);

export const setSelectedMainSubmissionUuid = createAction(
  '[SubmissionProgress/API] Set selected MainSubmissionUuid',
  props<{selectedMainSubmissionUuid: string }>()
);

export const showPercentageProgressBar = createAction(
    '[SubmissionProgress/API] Set showPercentageProgressBar',
    props<{showPercentageProgressBar: boolean }>()
);

export const upsertSubmissionCriteriaGroups = createAction(
  '[SubmissionProgress/API] upsert submission criteria groups',
  props<{criteriaGroupList: SubmissionCriteriaGroup[] }>()
);

export const setCriteriaStatus = createAction(
  '[SubmissionProgress/API] set criteria status',
  props<{criteriaStatus: EvaluationCriteriaStatus[] }>()
);

export const setIncompleteCriteria = createAction(
  '[SubmissionProgress/API] set incomplete criteria',
  props<{incompleteCriteria: EvaluationCriteriaStatus }>()
);

export const updateOneCriteriaStatus = createAction(
  '[SubmissionProgress/API] update one incomplete criteria',
  props<{ criteriaStatus: EvaluationCriteriaStatus }>()
);

export const getSubmissionProgress = createAction(
  '[SubmissionProgress/API] get all SubmissionProgress',
  props<{ submissionUuid: string, entityType : EntityObjectTypeEnum}>()
);
