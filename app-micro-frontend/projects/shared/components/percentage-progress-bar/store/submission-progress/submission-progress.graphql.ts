import {gql} from 'apollo-angular';

export const GET_TENDERER_TENDER_SUBMISSION_SUMMARY = gql `
  query getTendererTenderSubmissionSummary($submissionUuid: String,$entityType: EntityObjectTypeEnum){
    getTendererTenderSubmissionSummary(submissionUuid: $submissionUuid,entityType:$entityType){
      code
      dataList {
        criteriaGroupUuid
        totalSubmittedCriteria
        totalCriteria
        criteriaGroupName
        percentage
      }
      message
      status
    }
  }
`;

