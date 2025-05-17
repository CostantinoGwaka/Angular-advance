import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {SubmissionProgressState} from './submission-progress.model';
import * as submissionProgressActions from './submission-progress.actions';
import {
  EvaluationCriteriaStatus,
  SubmissionCriteriaGroup
} from "../evaluation-progress/evaluation-progress.model";
import {EntityInfoSummary} from "../../../tender-info-summary/store/entity-info-summary.model";


export interface State extends EntityState<SubmissionProgressState> {
  // additional entities state properties
  loading: boolean;
  selectedUuid: string;
  entityType: string;
  tender: EntityInfoSummary;
  criteriaGroupList: SubmissionCriteriaGroup[];
  criteriaStatus: EvaluationCriteriaStatus[];
  incompleteCriteria: EvaluationCriteriaStatus;
  selectedMainSubmissionUuid:string;
  showPercentageProgressBar: boolean;
}

export const adapter: EntityAdapter<SubmissionProgressState> = createEntityAdapter<SubmissionProgressState>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  showPercentageProgressBar: false,
  criteriaStatus: [],
  criteriaGroupList: [],
  selectedUuid: '',
  entityType: '',
  tender: null,
  incompleteCriteria: null,
  selectedMainSubmissionUuid: '',
});

export const reducer = createReducer(
  initialState,
  on(submissionProgressActions.upsertSubmissionProgress,
    (state, action) => adapter.upsertOne(action.submissionProgress, state)
  ),
  on(submissionProgressActions.setSelectedSubmissionUuid,
    (state, action) => ({...state, selectedUuid: action.selectedUuid})
  ),
  on(submissionProgressActions.setSelectedMainSubmissionUuid,
    (state, action) => ({...state, selectedMainSubmissionUuid: action.selectedMainSubmissionUuid})
  ),
  on(submissionProgressActions.showPercentageProgressBar,
    (state, action) => ({...state, showPercentageProgressBar: action.showPercentageProgressBar})
  ),
  on(submissionProgressActions.setCriteriaStatus,
    (state, action) => ({...state, criteriaStatus: action.criteriaStatus})
  ),
  on(submissionProgressActions.upsertSubmissionCriteriaGroups,
    (state, action) => ({...state, criteriaGroupList: action.criteriaGroupList})
  ),
  on(submissionProgressActions.updateOneCriteriaStatus,
    (state, action) => {
      let submissionCriteriaList = state.criteriaStatus;

      const currentCriteria = submissionCriteriaList.find( item => item.uuid == action.criteriaStatus.uuid);
      submissionCriteriaList = submissionCriteriaList.filter( item => item.uuid !== action.criteriaStatus.uuid);

      submissionCriteriaList.push({
        ...currentCriteria,
        isCompleted: action.criteriaStatus.isCompleted,
        hasData: action.criteriaStatus.hasData
      })
      return (
        {...state, criteriaStatus: submissionCriteriaList}
      )
    }
  ),
  on(submissionProgressActions.setEntityType,
    (state, action) => ({...state, entityType: action.entityType})
  ),
  on(submissionProgressActions.upsertTenderEntityDetail,
    (state, action) => ({...state, tender: action.tender})
  ),
  on(submissionProgressActions.setIncompleteCriteria,
    (state, action) => ({...state, incompleteCriteria: action.incompleteCriteria})
  ),
  on(submissionProgressActions.loadSubmissionProgress,
    (state, action) => adapter.setAll(action.submissionProgress.map(
      item => mapFunction(item)), {...state, loading: false})
  ),
  on(submissionProgressActions.clearSubmissionProgress,
    state => adapter.removeAll(state)
  ),
  on(submissionProgressActions.getSubmissionProgress,
    (state, action) => ({...state, selectedUuid: action.submissionUuid})
  ),
);

const mapFunction = (item) => (
   {
    ...item,
    id: item.criteriaGroupUuid
  });

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selectedUuid;
export const getSelectedMainSubmission = (state: State) => state.selectedMainSubmissionUuid;
export const getSubmissionProgressBarStatus = (state: State) => state.showPercentageProgressBar;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
