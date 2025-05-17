import { gql } from 'apollo-angular';
import { NestUtils } from "../../../shared/utils/nest.utils";
import { preQualificationReponse } from "../../../modules/nest-pre-qualification/store/pre-qualification.graphql";

export const GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_OPENING = gql`
  query getMergedProcurementRequisitionDataByMainEntity(
     $input: DataRequestInputInput, $mainEntityUuid: String
     ) {
    items:getMergedProcurementRequisitionDataByMainEntity(
        mainEntityUuid: $mainEntityUuid,
        input: $input,
        withMetaData:true){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        uuid
        tenderState
        lotNumber
        lotDescription
        requisitionDate
      }
    }
  }
`;

export const GET_MERGED_TENDER_BY_UUID_OPENING = gql`
query getMergedMainProcurementRequisitionByUuid($uuid: String) {
  getMergedMainProcurementRequisitionByUuid(uuid: $uuid) {
    code
    message
    status
    data {
      id
      tenderState
      procurementEntityName
      procurementCategoryAcronym
      tenderSubCategoryAcronym
      procuringEntityUuid
      tenderNumber
      numberOfLots
      description
      financialYearCode
      openingReportUuid
      tenderOpenningDateTime
      tender {
        procurementMethod {
         description
        }
      }
      objectActualDateViewEntity {
        submissionOrOpeningDate
      }
    }
  }
}`;

export const GET_ANY_MERGED_TENDER_BY_UUID_OPENING = gql`
query getAnyMergedMainProcurementRequisitionByUuid($uuid: String) {
  getAnyMergedMainProcurementRequisitionByUuid(uuid: $uuid) {
    code
    message
    status
    data {
      id
      uuid
      tenderState
      procurementEntityName
      procurementCategoryAcronym
      tenderSubCategoryAcronym
      procuringEntityUuid
      tenderNumber
      numberOfLots
      description
      financialYearCode
      openingReportUuid
      tenderOpenningDateTime
      tender {
        procurementMethod {
         description
        }
      }
      objectActualDateViewEntity {
        submissionOrOpeningDate
      }
    }
  }
}`;


export const GET_TENDERER_SUBMISSION_EVALUATION_REPORT_OPENING = gql`
  query getSubmissionsByTender($input: DataRequestInputInput) {
    items: getSubmissionsByTender(input: $input, withMetaData: false) {
     ${NestUtils.GraphqlPaginationFields}
      rows: data {
        tendererName
        tendererNumber
        operatingCountryName
        physicalAddress
        decryptedVatAmount
        decryptedBidAmount
        discount:decryptedDiscountPercentage
        bidAmountVatExclusive: decryptedBidAmountVatExclusive
        bidAmountVatInclusive: decryptedBidAmountVatInclusive
        currency
        financialCurrency
        submitted
        email
        uuid
      }
    }
  }
`;

export const GET_PROCURING_ENTITY_BY_UUID_OPENING = gql`
  query findProcuringEntityByUuid($uuid: String) {
    findProcuringEntityByUuid(uuid: $uuid) {
      code
      message
      status
      data {
        uuid
        name
        logoUuid
      }
    }
  }
`;

export const SET_MAIN_ENTITY_REPORT = gql`
  mutation setMainEntityReport($openingDTO: TenderOpeningDTOInput) {
    setMainEntityReport(openingDTO: $openingDTO) {
      message
      code
      status
    }
  }
`;


// Pre-qualification graphql
export const FIND_PRE_QUALIFICATIONS_BY_UID_OPENING = gql`
query findPreQualificationByUuid( $uuid: String ){
    findPreQualificationByUuid( uuid: $uuid ){
      code
      data{
        uuid
        id
        prequalificationStatus
        prequalificationOpeningDate
        descriptionOfTheProcurement
        prequalificationActualDateView {
          preSubmissionOrOpeningDate
        }
        tender{
            descriptionOfTheProcurement
            procurementCategoryAcronym
            procuringEntityName
            procurementEntityUuid
            financialYearCode
            tenderNumber
            procurementMethod {
              uuid
              description
            }
        }
      }
      message
      status

    }
}`;


// Framework graphql
export const GET_ONE_FRAMEWORK_BY_UUID_OPENING = gql`
  query getOneFramework($uuid: String) {
    getOneFramework(uuid: $uuid) {
      status
      message
      code
      data {
        id
        uuid
        procurementMethodName
        procurementMethodAcronym
        procuringEntityUuid
        procuringEntityName
        tenderSubCategoryName
        tenderCategoryName
        tenderNumber
        frameworkNumber
        tenderNumber
        financialYearCode
        description
        frameworkStatus
        submissionOrOpeningDate
        frameworks {
          uuid
        }
      }
    }
  }
`;

export const GET_ONE_FRAMEWORK_BY_UUID_OPENING_NEW = gql`
  query getOneFramework($uuid: String) {
    getOneFramework(uuid: $uuid) {
      status
      message
      code
      data {
        uuid
        procurementMethodName
        procurementMethodAcronym
        procuringEntityUuid
        procuringEntityName
        tenderSubCategoryName
        tenderCategoryName
        tenderNumber
        frameworkNumber
        tenderNumber
        financialYearCode
        description
        frameworkStatus
        submissionOrOpeningDate

      }
    }
  }
`;

export const GET_FRAMEWORK_LOTS_BY_FRAMEWORK_PAGINATED_OPENING = gql`
  query getFrameworkLotsByFrameworkPaginated($input: DataRequestInputInput) {
    items: getFrameworkLotsByFrameworkPaginated(input: $input, withMetaData: false) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        lotDescription
        lotNumber
        uuid
      }
    }
  }
`;
