import gql from "graphql-tag";

export const GET_SOURCE_FUND_BY_CONSOLIDATED = gql`
query getSourceFundByConsolidated($financialYear: String) {
  getSourceFundByConsolidated(financialYear: $financialYear){
    totalBudget
    totalNumber
    sourceOfFund
    percentageValue
    financialYearCode
    percentageNumber
    budgetPurposeId
    id
  }
}`;

export const GET_PROCUREMENT_METHOD_CONSOLIDATED_REPORT = gql`
query getProcurementMethodConsoReport($financialYear: String) {
  getProcurementMethodConsoReport(financialYear: $financialYear){
    totalBudget
    totalNumber
    percentageValue
    financialYearCode
    budgetPurposeId: procurementMethod
    percentageNumber
    id
  }
}`;


export const GET_PROCUREMENT_CATEGORY_CONSOLIDATED_REPORT = gql`
query getProcurementCategoryConsoReport($financialYear: String) {
  getProcurementCategoryConsoReport(financialYear: $financialYear){
    totalBudget
    totalNumber
    percentageValue
    budgetPurposeId: procurementCategory
    financialYearCode
    percentageNumber
    id
  }
}`;
