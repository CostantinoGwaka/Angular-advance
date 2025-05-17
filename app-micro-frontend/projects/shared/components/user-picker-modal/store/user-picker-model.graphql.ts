import { gql } from 'apollo-angular';

export const GET_PROCURING_ENTITIES_FOR_USER_PICKING = gql`
  query getProcuringEntityData($input: DataRequestInputInput) {
    items: getProcuringEntityData(input: $input, withMetaData: false) {
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
        acronym
        name
        uuid
        id
      }
    }
  }
`;

export const FIND_USERS_BY_INSTITUTION_UUID_FOR_USER_PICKING = gql`
  query findAllUsersByProcuringEntityUuid($procuringEntityUuid: String) {
    results: findAllUsersByProcuringEntityUuid(
      procuringEntityUuid: $procuringEntityUuid
    ) {
      code
      dataList {
        email
        firstName
        fullName
        id
        jobTitle
        lastName
        middleName
        name
        uuid
        department {
          uuid
          name
        }
        designation {
          uuid
          designationName
        }
      }
      message
      status
    }
  }
`;

export const USER_PICKER_GET_PE_USERS_BY_INSTITUTION_AND_ROLE_NAME = gql`
  query getProcuringEntityUsersByUuidAndRoleName(
    $roleName: String
    $procuringEntityUuid: String
  ) {
    results: getProcuringEntityUsersByUuidAndRoleName(
      roleName: $roleName
      procuringEntityUuid: $procuringEntityUuid
    ) {
      code
      dataList {
        id
        uuid
        email
        firstName
        fullName
        lastName
        middleName
        name
        emailVerified
        procuringEntity {
          id
          uuid
          name
        }
        jobTitle
        phone
        salutation
      }
      message
      status
    }
  }
`;
