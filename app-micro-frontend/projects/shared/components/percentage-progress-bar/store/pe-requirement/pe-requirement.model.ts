import {BaseModel} from "../../../../../store/global-interfaces/organizationHiarachy";
import {CriteriaField} from "../../../../../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/criteria-field.model";

export interface PeRequirementStateModel extends BaseModel {
  loading?: boolean;
  peRequirementList?: PeRequirementSubmissionModel[]
  submissionCriteriaList?: string[]
}

export interface PeRequirementSubmissionModel extends BaseModel {
   uuid: string;  /// tender criteria uuid
   criteriaField: CriteriaField;
   dataValues: any;
}
