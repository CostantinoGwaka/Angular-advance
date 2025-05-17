import { NestUtils } from '../../../shared/utils/nest.utils';
import { gql } from 'apollo-angular';

export const SEND_DOCUMENT_CREATOR_COMMAND = gql`
  query sendDocumentCreatorCommand(
    $input: ControlledDocumentCreatorCommandInputDtoInput
  ) {
    sendDocumentCreatorCommand(input: $input) {
      data {
        data
        documentUuid
      }
      message
      code
    }
  }
`;

export const GET_CREATED_DOCUMENT_QUERY = gql`
  query getDocumentByItemUuidAndType($itemUuid: String, $type: DocumentType) {
    results: getDocumentByItemUuidAndType(itemUuid: $itemUuid, type: $type) {
      code
      message
      data {
        id
        uuid
        fileUuid
        itemUuid
        documentType
        createdAt
      }
    }
  }
`;

export const GET_CREATED_DOCUMENT_QUERY_WITH_CREATOR = gql`
  query getDocumentByItemUuidAndType($itemUuid: String, $type: DocumentType) {
    results: getDocumentByItemUuidAndType(itemUuid: $itemUuid, type: $type) {
      code
      message
      data {
        id
        uuid
        fileUuid
        itemUuid
        documentType
        createdAt
      }
    }
  }
`;

export const SET_DOCUMENT_AS_FAILED_POPULATING_DATA = gql`
  query setDocumentAsFailedPopulatingData($documentUuid: String) {
    results: setDocumentAsFailedPopulatingData(documentUuid: $documentUuid) {
      code
      message
      data {
        id
        uuid
        fileUuid
        itemUuid
        documentType
        createdAt
      }
    }
  }
`;
