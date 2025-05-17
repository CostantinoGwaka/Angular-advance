import { VerticalStepsFieldRow } from './vertical-steps-form-row';
import {VerticalStepsFormField} from "./vertical-steps-form-field";
export interface VerticalStepsFormStep {
  label: string;
  sortNumber?: number;
  fields: VerticalStepsFormField[];
  isComplete?: boolean;
  hasInvalidField?: boolean;
  hasInvalidGeneralConstraint?: boolean;
  generalConstraint?: GeneralConstraint[];
  progress?: number;
  isActive?: boolean;
  allowedForCopyingToContract?:boolean
}

export interface GeneralConstraint {
  type: 'SUM';
  fieldsName: string[];
  value: string|number;
  errorMessage?: string;
}
