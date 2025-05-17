import {gql} from 'apollo-angular';

export const GET_MEMBER_STAGE_EVALUATION_SUMMARY = gql `
  query getMemberStageEvaluationSummary($evaluationUuid: String){
    getMemberStageEvaluationSummary(evaluationUuid: $evaluationUuid){
      code
      data {
        totalScore
        evaluatedScore
      }
      message
      status
    }
  }
`;

export const GET_SUBMISSION_CRITERIA_EVALUATION_COMPLETION_STATUS_BY_STAGE = gql `
  query getSubmissionCriteriaEvaluationCompletionStatusByStage($evaluationUuid: String){
    getSubmissionCriteriaEvaluationCompletionStatusByStage(evaluationUuid: $evaluationUuid){
      code
      dataList {
        uuid
        name
        isCompleted
      }
      message
      status
    }
  }
`;

export const GET_SUBMISSION_CRITERIA_EVALUATION_COMPLETION_STATUS_BY_STAGE_AND_STAGE_UUID = gql `
  query getSubmissionCriteriaEvaluationCompletionStatusByStageAndStageUuid($memberEvaluationStageUuid: String){
    getSubmissionCriteriaEvaluationCompletionStatusByStageAndStageUuid(memberEvaluationStageUuid: $memberEvaluationStageUuid){
      code
      dataList {
        uuid
        name
        isCompleted
      }
      message
      status
    }
  }
`;

