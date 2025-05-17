import { gql } from 'apollo-angular';
import { businessLineConfigurationFields } from 'src/app/modules/nest-tenderer-management/store/busines-line-configuration/busines-line-configuration.graphql';
import { detailedTendererFields } from 'src/app/modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
// import { detailedTendererFields } from "../store/tenderer/tenderer.graphql";
// import { businessLineConfigurationFields } from '../store/busines-line-configuration/busines-line-configuration.graphql';

export const specialGroupFields = `
accountName
administrativeArea {
  id
  uuid
  parentAdministrativeArea {
    id
    uuid
    areaName
  }
}
businessLineList {
  id
  uuid
  name
}
economicActivity
email
enablingPE {
  id
  uuid
  name
}
groupType
id
leaderName
name
phoneNumber
postalAddress
tinNumber
uuid
`;

export const specialGroupMemberFields = `
  age
  district{
    uuid
    areaName
    id
  }
  email
  gender
  id
  name
  nidaID
  phoneNumber
  position
  region{
    uuid
    areaName
    id
  }
  street{
    uuid
    areaName
    id
  }
  uuid
  validUntil
  ward{
    uuid
    areaName
    id
  }
  council{
    uuid
    areaName
    id
  }
`;



export const SAVE_SPECIAL_GROUP = gql`
mutation createUpdateSpecialGroup($specialGroupDto: SpecialGroupDTOInput){
  createUpdateSpecialGroup(specialGroupDto:$specialGroupDto){
    code
    status
    message
    data{
      id
      uuid
    }
  }
}
`;


export const GET_GROUP_MEMBERS_PAGINATED = gql`
 query getSpecialGroupMemberByGroupData( $input: DataRequestInputInput,$groupUuid : String) {
  items: getSpecialGroupMemberByGroupData( input: $input,groupUuid: $groupUuid,withMetaData: false) {
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
     rows:data {
        ${specialGroupMemberFields}
     }
   }
 }
`;



export const LIST_ALL_SPECIAL_GROUPS_LIST = gql`
query allSpecialGroups($deleted: Boolean){
  allSpecialGroups(deleted: $deleted){
    ${specialGroupFields}
  }
}

`;

export const GET_ALL_COUNTRIES = gql`
query getAllCountries{
  getAllCountries{
     id
     code
     name
     phoneCode
     uuid
  }
}

`;


export const GET_REGISTERED_SPECIAL_GROUP_DATA = gql`
 query getRegisteredSpecialGroupData( $input: DataRequestInputInput) {
  items: getRegisteredSpecialGroupData( input: $input, withMetaData: false) {
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
        accountName
        economicActivity
        groupType
        id
        name
        phoneNumber
        postalAddress
        isRegistered
        tinNumber
        areaName
        uuid
     }
   }
 }
`;


export const GET_SPECIAL_GROUP_PAGINATED = gql`
 query getSpecialGroupDataPublic( $input: DataRequestInputInput) {
  items: getSpecialGroupDataPublic( input: $input, withMetaData: false) {
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
        accountName
        economicActivity
        groupType
        id
        name
        phoneNumber
        postalAddress
        tinNumber
        areaName
        uuid
     }
   }
 }
`;













