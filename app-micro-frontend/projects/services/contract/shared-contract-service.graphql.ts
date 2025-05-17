import { gql } from 'apollo-angular';

export const GET_CONTRACT_DOCUMENT_UUID_BY_CONTRACT_UUID = gql`
  query getContractByUuid($uuid: String) {
    results: getContractByUuid(uuid: $uuid) {
      data {
        id
        uuid
        contractDocumentUuid
      }
    }
  }
`;
