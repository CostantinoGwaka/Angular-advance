import {BaseModel} from "../../../../../store/global-interfaces/organizationHiarachy";
import {EntityInfoSummary} from "../../../tender-info-summary/store/entity-info-summary.model";
import {EvaluationCriteriaStatus, SubmissionCriteriaGroup} from "../evaluation-progress/evaluation-progress.model";

export interface SubmissionProgressState extends BaseModel {
  loading?: boolean;
  selectedUuid?: string;
  entityType?: string;
  tender?: EntityInfoSummary;
  criteriaGroupList?: SubmissionCriteriaGroup[];
  criteriaStatus?: EvaluationCriteriaStatus[];
  incompleteCriteria?: EvaluationCriteriaStatus;
  selectedMainSubmissionUuid?:string;
  showPercentageProgressBar?: boolean;
}

export interface SubmissionProgress extends BaseModel {
  criteriaGroupUuid: string,
  totalSubmittedCriteria: number,
  totalCriteria: number,
  criteriaGroupName: string,
  percentage: number
}
