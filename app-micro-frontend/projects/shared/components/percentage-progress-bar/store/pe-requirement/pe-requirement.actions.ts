import { createAction, props } from '@ngrx/store';

import {PeRequirementSubmissionModel} from './pe-requirement.model';

////////////  EFFECT ACTIONS \\\\\\\\\\\\
export const upsertPeRequirementSubmission = createAction(
  '[PeRequirementSubmission/API] Upsert Pe Requirement Submission',
  props<{ peRequirement: PeRequirementSubmissionModel }>()
);

export const clearSubmissionProgress = createAction(
  '[PeRequirementSubmission/API] Clear Pe Requirement Submission'
);
