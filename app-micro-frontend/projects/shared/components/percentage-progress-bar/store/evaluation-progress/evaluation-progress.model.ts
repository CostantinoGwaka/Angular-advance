import {BaseModel} from "../../../../../store/global-interfaces/organizationHiarachy";
import {EvaluationTeamMemberStage} from "../../../../../modules/nest-tender-evaluation/store/evaluation/evaluation.model";

export interface EvaluationProgress extends BaseModel {
  evaluatedScore?: number,
  totalScore?: number
}

export interface EvaluationProgressState extends BaseModel {
  loading?: boolean;
  selectedUuid?: string;
  selectedEvaluationUuid?: string;
  selectedMemberUuid?: string;
  progress?: EvaluationProgress;
  showEvaluationProgressBar?: boolean;
  criteriaStatus?: EvaluationCriteriaStatus[];
  selectedCurrentStage?: EvaluationTeamMemberStage;
}

export interface EvaluationCriteriaStatus extends BaseModel {
  uuid: string;
  name?: string;
  groupUuid?: string;
  isCompleted: boolean;
  hasData?: boolean;
}

export interface SubmissionCriteriaGroup extends BaseModel {
  uuid?: string;
  name?: string;
  displayName?: string;
  sortNumber?: number;
}


