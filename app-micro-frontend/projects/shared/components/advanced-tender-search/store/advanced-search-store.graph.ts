import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { gql } from 'apollo-angular';

export const GET_PUBLIC_PROCURING_ENTITY_PAGINATED_FOR_FILTERING = gql`
 query getProcuringEntityData( $input: DataRequestInputInput) {
  items: getProcuringEntityData( input: $input, withMetaData: false) {
     ${NestUtils.GraphqlPaginationFields}
     rows:data {
        uuid
        name
        acronym
        region{
        id
        areaName
        }
     }
   }
 }
`;

export const GET_ALL_ADMINISTRATIVE_AREAS_LIGHT_FOR_FILTERING = gql`
  query getViewAdministrativeAreaData($input: DataRequestInputInput) {
    items: getViewAdministrativeAreaData(input: $input,withMetaData: false) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        id
        uuid
        areaName
        administrativeAreasType
      }
    }
  }
`;

export const GET_PUBLIC_PROCURING_ENTITY_PAGINATED_FOR_LISTING = gql`
 query getProcuringEntityData( $input: DataRequestInputInput) {
  items: getProcuringEntityData( input: $input, withMetaData: false) {
     ${NestUtils.GraphqlPaginationFields}
     rows:data {
        uuid
        name
        acronym
        website
        postalCode
        logoUuid
        physicalAddress
        hasCustomLogo
     }
   }
 }
`;
