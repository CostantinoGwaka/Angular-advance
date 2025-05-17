import {createSelector} from '@ngrx/store';
import {getNestTendererState} from "../../../../../modules/nest-tenderer/store/nest-tenderer.recuder";
import {PeRequirementSubmissionModel} from "./pe-requirement.model";
import * as fromReducer from "./pe-requirement.reducer";

export const currentState = createSelector(getNestTendererState, (state) => state.peRequirement);
export const selectAll = createSelector(currentState, fromReducer.selectAll);

export const selectPeRequirementByUuid = (params: {uuid: string}) => createSelector(
  selectAll,
  (peRequirements: PeRequirementSubmissionModel[]) => {
    return peRequirements.find((peRequirement) => peRequirement.uuid === params.uuid);
  }
);
