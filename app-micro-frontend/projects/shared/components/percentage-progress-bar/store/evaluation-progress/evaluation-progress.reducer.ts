import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {EvaluationCriteriaStatus, EvaluationProgress, EvaluationProgressState} from './evaluation-progress.model';
import * as evaluationProgressActions from './evaluation-progress.actions';
import {EvaluationTeamMemberStage} from "../../../../../modules/nest-tender-evaluation/store/evaluation/evaluation.model";


export interface State extends EntityState<EvaluationProgressState> {
  // additional entities state properties
  loading: boolean;
  selectedUuid: string;
  selectedEvaluationUuid: string;
  selectedEvaluationStageUuid: string;
  selectedMemberUuid: string;
  progress: EvaluationProgress;
  showEvaluationProgressBar: boolean;
  criteriaStatus: EvaluationCriteriaStatus[];
  selectedCurrentStage: EvaluationTeamMemberStage;
}

export const adapter: EntityAdapter<EvaluationProgressState> = createEntityAdapter<EvaluationProgressState>();

export const initialState: State  = adapter.getInitialState({
  loading: false,
  selectedUuid: null,
  selectedMemberUuid: null,
  selectedEvaluationStageUuid: null,
  selectedEvaluationUuid : null,
  showEvaluationProgressBar : false,
  criteriaStatus: [],
  progress: null,
  selectedCurrentStage: null
});

export const reducer = createReducer(
  initialState,

  on(evaluationProgressActions.setSelectedEvaluationUuid,
    (state, action) => ({...state, selectedEvaluationUuid: action.selectedEvaluationUuid})
  ),

 on(evaluationProgressActions.setSelectedEvaluationStageUuid,
    (state, action) => ({...state, selectedEvaluationStageUuid: action.selectedEvaluationStageUuid})
  ),

  on(evaluationProgressActions.setSelectedMemberUuid,
    (state, action) => ({...state, selectedMemberUuid: action.selectedMemberUuid})
  ),

  on(evaluationProgressActions.setSelectedCurrentStage,
    (state, action) => ({...state, selectedCurrentStage: action.selectedCurrentStage})
  ),

  on(evaluationProgressActions.setCriteriaStatus,
    (state, action) => ({...state, criteriaStatus: action.criteriaStatus})
  ),

  on(evaluationProgressActions.setEvaluationProgress,
      (state, action) => ({...state, progress: action.progress})
  ),

  on(evaluationProgressActions.showEvaluationProgressBar,
    (state, action) => ({...state, showEvaluationProgressBar: action.showEvaluationProgressBar})
  ),

  on(evaluationProgressActions.clearEvaluationProgress,
    state => adapter.removeAll(state)
  ),

  on(evaluationProgressActions.clearEvaluationCriteriaStatus,
    state => ({...state, criteriaStatus: []})
  ),
  on(evaluationProgressActions.getEvaluationProgress,
    (state, action) => ({...state, selectedEvaluationStageUuid: action.memberEvaluationStageUuid})
  ),
);

const mapFunction = (item) => (
   {
    ...item
   });

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selectedUuid;
export const getEvaluationProgressBarStatus = (state: State) => state.showEvaluationProgressBar;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
