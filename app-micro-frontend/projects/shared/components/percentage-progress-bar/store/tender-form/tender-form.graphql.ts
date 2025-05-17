import { gql } from 'apollo-angular';

export const GET_TENDER_FORM = gql`
  query getTenderForm($submissionUuid: String){
    getTenderForm(submissionUuid: $submissionUuid){
      code
      data {
        bidAmountInFigures
        financialCurrency
      }
      message
      status
    }
  }
`;


export const GET_TAX_SUMMARY_BY_SUBMISSION = gql`
  query getTaxSummaryBySubmission($submissionUuid: String){
    getTaxSummaryBySubmission(submissionUuid: $submissionUuid){
      code
      data {
        financialCurrency
        socialChargesInternational
        socialChargesLocal
        submissionCriteriaUuid
        totalSocialCharges
        totalWithHoldingTax
        valueAddedTax
        withHoldingTaxInternational
        withHoldingTaxLocal
      }
      message
      status
    }
  }
`;


