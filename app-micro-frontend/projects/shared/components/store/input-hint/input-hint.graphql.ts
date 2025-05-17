import {gql} from 'apollo-angular';

export const fields = `
uuid
fieldName
example
description
`;
export const GET_INPUT_DESCRIPTION_BY_FIELD_NAME= gql`
  query getInputDescriptionByFieldNameAndEntity($fieldName: String,$entity:EntityEnum) {
    getInputDescriptionByFieldNameAndEntity(fieldName: $fieldName,entity:$entity) {
      data {
          ${fields}
      }
    }
  }
`;
