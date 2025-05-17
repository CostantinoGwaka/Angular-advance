import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { gql } from 'apollo-angular';

export const GET_PUBLIC_PROCURING_ENTITIES_LITE = gql`
query getProcuringEntityData(
    $input: DataRequestInputInput
    $withMetaData: Boolean
) {
    items:getProcuringEntityData(input: $input, withMetaData: $withMetaData) {
        ${NestUtils.GraphqlPaginationFields}
        rows:data {
            id
            uuid
            acronym
            email
            website
            fax
            hasCustomLogo
            isMain
            logoUuid
            name
            nameSW
            phone
            isLowerLevel
            physicalAddress
            postalAddress
            postalCode
            region{
              areaName
            }
            parentProcuringEntity{
            id
            }
            parentMinistry{
                uuid
                name
                nameSW
            }  
        }
    }
}
`;


export const GET_PUBLIC_PROCURING_ENTITIES_LITE_COUNT = gql`
query getProcuringEntityData(
    $input: DataRequestInputInput
    $withMetaData: Boolean
) {
    items:getProcuringEntityData(input: $input, withMetaData: $withMetaData) {
        ${NestUtils.GraphqlPaginationFields}
        rows:data {
            id
            uuid
            isLowerLevel
        }
    }
}
`;
