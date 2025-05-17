import { gql } from "apollo-angular";

export const BasicCommonGqlFields = `
  uuid
id:uuid
`


export const TenderSharedGqlFields = `
      approvalLatestDate
      approvalStartDate
      approvalStatus
      UNSPSC
      budgetPurpose
      contractType{uuid name}
      departmentUuid
      descriptionOfTheProcurement
      estimatedContractDuration
      estimatedBudget
      estimatedContractClosureDate
      estimatedContractStartDate
      financialYearCode
      hasLot
      invitationDate
      isCuis
      passStatus
      procurementCategoryAcronym
      procurementCategoryId
      procurementCategoryName
      procurementCategoryUuid
      procurementEntityId
      procurementEntityUuid
      procurementMethod{uuid,description,acronym }
      selectionMethod{uuid name}
      sourceOfFund{uuid name}
      tenderNumber
      uuid
`;


export const CREATE_HTML_DOCUMENT_TEMPLATE = gql`
mutation createHTMLDocument($HTMLDocumentDto: HTMLDocumentDtoInput) {
  createHTMLDocument(HTMLDocumentDto: $HTMLDocumentDto) {
    message
    code
    data {
      documentUuid
      documentSections {
        sectionUuid
        htmlText
      }
    }
  }
}
`

export const GET_CREATED_HTML_DOCUMENT_TEMPLATE = gql`
query getCreatedHTMLDocument($createdHTMLDocumentDto: CreatedHTMLDocumentDtoInput) {
  getCreatedHTMLDocument(createdHTMLDocumentDto: $createdHTMLDocumentDto) {
    message
    code
    data{
      documentUuid
      documentSections {
        sectionUuid
        htmlText
      }
    }
    status
  }
}
`
