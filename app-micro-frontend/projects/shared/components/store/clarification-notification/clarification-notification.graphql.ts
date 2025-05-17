import { data } from 'autoprefixer';
import { gql } from 'apollo-angular';


export const COUNT_TENDER_REQUESTED_FOR_EDITING = gql`
  query countTendersRequestedForEditing{
    countTendersRequestedForEditing{
      data
      code
    }
  }
`;

export const GET_MY_SPECIFIC_AUDIT_PLAN_TASKS_SUMMARY = gql`
  query getMySpecificAuditPlanTasksSummary{
    getMySpecificAuditPlanTasksSummary{
      data
      code
    }
  }
`;

export const COUNT_CUIS_REPORT_AO = gql`
  query countReportStatus{
    countReportStatus{
      data
      code
    }
  }
`;

export const COUNT_AUDIT_PLAN_EXECUTION_INITIATION_BY_AUDIT_STAGE = gql`
  query countAuditPlanExecutionInitiationByAuditStage($auditExecutionStage: AuditExecutionStageEnum){
    countAuditPlanExecutionInitiationByAuditStage(auditExecutionStage: $auditExecutionStage){
      data
      code
      message
    }
  }
`;

export const GET_COUNT_FOR_TASK = gql`
  query getCountForTask($decisionOrderList: [Int]){
    getCountForTask(decisionOrderList: $decisionOrderList){
      data
      code
      message
    }
  }
`;

export const GET_COUNT_FOR_FORM_EIGHT_TASK = gql`
  query getCountForFormEightTask($decisionOrderList: [Int]){
    getCountForFormEightTask(decisionOrderList: $decisionOrderList){
      data
      code
      message
    }
  }
`;

export const GET_COUNT_FOR_FORM_SEVEN_TASK = gql`
  query getCountForFormSevenTask($decisionOrderList: [Int]){
    getCountForFormSevenTask(decisionOrderList: $decisionOrderList){
      data
      code
      message
    }
  }
`;

export const GET_COUNT_FOR_EXTENSION_TASK = gql`
  query getCountForExtensionTask($decisionOrderList: [Int]){
    getCountForExtensionTask(decisionOrderList: $decisionOrderList){
      data
      code
      message
    }
  }
`;

export const GET_ALL_CLARIFICATION_NOTIFICATIONS = gql`
  query getClarificationsByPEData($input: DataRequestInputInput) {
    getClarificationsByPEData(input: $input, withMetaData: false) {
     totalPages
     totalRecords
     currentPage
     last
     first
     hasNext
     hasPrevious
     numberOfRecords
     recordsFilteredCount
     metaData {
       fieldName
       isSearchable
       isSortable
       isEnum
     }
      rows: data {
        id
        tenderNumber
        tenderUuid
        procurementRequisitionUuid
        question
        title
        entityType
        createdAt
        createdBy
        clarificationResponses{
          reply_or_question
          isRead
        }
      }
    }
  }
`;
