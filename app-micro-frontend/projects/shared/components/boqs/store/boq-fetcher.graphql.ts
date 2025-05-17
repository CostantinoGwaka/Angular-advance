import { gql } from 'apollo-angular';

const paginationFields = `
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
`;

export const GET_WORKS_REQUISITION_ITEMIZATIONS_PAGINATED = gql`
  query getWorksRequisitionItemizationPaginated($input: DataRequestInputInput) {
    items: getWorksRequisitionItemizationPaginated(input: $input, withMetaData: false) {
        ${paginationFields}
        rows: data {
            id
            uuid
            sourceUuid
            code 
            name
            boqSubItems{
                id
            }
            boqItem{
                id
            }
        }
    }
}
`;
//getWorksRequisitionSpecificationPaginated
export const GET_WORKS_REQUISITION_SPECIFICATIONS_PAGINATED = gql`
  query getWorksRequisitionSpecificationPaginated($input: DataRequestInputInput) {
    items: getWorksRequisitionSpecificationPaginated(input: $input, withMetaData: false) {
        ${paginationFields}
        rows: data {
            uuid
            code
            name
            quantity
            description
            sourceUuid
            total
            unitOfMeasure
            unitRate
            weight
            isPredefined
            formula
        }
    }
}
`;
