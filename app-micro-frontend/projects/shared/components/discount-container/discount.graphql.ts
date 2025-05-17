import gql from "graphql-tag";

export const GET_DISCOUNT_PERCENTAGE_FOR_PRICE_SCHEDULE = gql`mutation saveDiscountPercentageForPriceSchedule(
$discountPercentage: Float
$hasDiscount:Boolean
$submissionCriteriaUuid: String){
saveDiscountPercentageForPriceSchedule(
discountPercentage: $discountPercentage
hasDiscount:$hasDiscount
submissionCriteriaUuid: $submissionCriteriaUuid){
    code
    message
    status
}
}`;
export const GET_DISCOUNT_PERCENTAGE_FOR_WORKS = gql`mutation saveDiscountPercentageForWorkSubFinancial(
$discountPercentage: Float
$hasDiscount:Boolean
$submissionCriteriaUuid: String){
saveDiscountPercentageForWorkSubFinancial(
discountPercentage: $discountPercentage
hasDiscount:$hasDiscount
submissionCriteriaUuid: $submissionCriteriaUuid){
    code
    message
    status
}
}`;
export const GET_DISCOUNT_PERCENTAGE_FOR_GOODS = gql`mutation saveDiscountPercentageForGoodFinancial(
$discountPercentage: Float
$hasDiscount:Boolean
$submissionCriteriaUuid: String){
saveDiscountPercentageForGoodFinancial(
discountPercentage: $discountPercentage
hasDiscount:$hasDiscount
submissionCriteriaUuid: $submissionCriteriaUuid){
    code
    message
    status
}
}`;
export const GET_DISCOUNT_PERCENTAGE_FOR_GOODS_CUSTOM = gql`mutation saveDiscountPercentageForGoodFinancialSubmission(
$discountPercentage: Float
$hasDiscount:Boolean
$submissionCriteriaUuid: String){
saveDiscountPercentageForGoodFinancialSubmission(
discountPercentage: $discountPercentage
hasDiscount:$hasDiscount
submissionCriteriaUuid: $submissionCriteriaUuid){
    code
    message
    status
}
}`;
export const GET_DISCOUNT_PERCENTAGE_FOR_CONSULTANCY = gql`mutation saveDiscountPercentageForReImbursementExpense(
$discountPercentage: Float
$hasDiscount:Boolean
$submissionCriteriaUuid: String){
saveDiscountPercentageForReImbursementExpense(
discountPercentage: $discountPercentage
hasDiscount:$hasDiscount
submissionCriteriaUuid: $submissionCriteriaUuid){
    code
    message
    status
}
}`;
