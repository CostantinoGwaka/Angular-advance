// import {gql} from 'apollo-angular';
// import {detailedTendererFields} from '../../../../nest-tenderer-management/store/tenderer/tenderer.graphql';
// import {OnlyProcuringEntityGqlFields} from '../../../../nest-pe-management/store/institution/institution.graphql';
// import {specialGroupFields} from "../../../../nest-tenderer-management/special-groups/special-group.graphql";

// export const userFields = `
//     id
//     accountNonLocked
//     active
//     salutation
//     authorities{
//       authority
//     }
//     userProcuringEntities{
//       name
//       uuid
//     }
//     createdAt
//     createdBy
//     credentialsNonExpired
//     deleted
//     department{
//       id
//       uuid
//       name
//     }
//     designation{
//       id
//       designationName
//     }
//     userDelegateProcuringEntityList{
//       uuid
//       deleted
//       procuringEntity{
//         uuid
//         name
//       }
//     }
//     email
//     enabled
//     firstLogin
//     isProcuringEntityAdministrator
//     firstName
//     formRole
//     fullName
//     hasHandover
//     paymentStatus
//     subscriptionUuid
//     subscriptionId
//     handedOverUserGroups
//     embassy{
//       countries{
//         uuid
//         name
//       }
//       email
//       fax
//       name
//       nameSW
//       phone
//       physicalAddress
//       postalAddress
//       uuid
//       website
//     }
//     procuringEntity{
//      ${OnlyProcuringEntityGqlFields}
//     }
//     isOpen
//     jobTitle
//     lastLogin
//     lastName
//     middleName
//     name
//     nationalId
//     password
//     passwordExpirationDate
//     passwordExpired
//     permissionIdsList
//     phone
//     picture
//     rememberToken
//     resetLinkSent
//     hasSignature
//     hasAcceptedTOC
//     tocAttachmentUuid
//     hasHandover
//     rolesList{
//       id
//       uuid
//       name
//       displayName

//     }
//     rolesListStrings
//     userRoles{
//          role{
//              name
//              displayName
//          }
//       }
//     tokenCreatedAt
//     updatedAt
//     updatedBy
//     userProcuringEntityId
//     userTendererId
//     username
//     uuid
//     userTypeEnum
//     tenderer {
//       id
//       uuid
//       name
//       phone
//       postalCode
//       postalAddress
//       physicalAddress
//       vatNumber
//       taxIdentificationNumber
//       uniqueIdentificationNumber
//       isBusinessLineApproved
//       isForNest
//       isForeignInfoApproved
//       embassyRegistrationStatus
//       businessType
//       tendererType
//       specialGroup{
//         ${specialGroupFields}
//       }
//       tendererBusinessLineList{
//         active
//         createdBy
//         deleted
//         uuid
//         approvalStatus
//         tendererBusinessLineComments{
//           comment
//         }
//         tendererBusinessLineComments{
//           active
//           comment
//         }
//         businessLine {
//           id
//           uuid
//           name
//           tenderCategory {
//             id
//             uuid
//             name
//           }
//           businessLineConfigurationList {
//             active
//             createdAt
//             createdBy
//             deleted
//             id
//             isLocationSpecific
//             isTzTenderer
//             locationName
//             locationType
//             needExpiryDate
//             needed
//             statutoryOffer {
//               id
//               uuid
//               needClass
//               deleted
//               active
//               statutoryOfferClassList {
//                 id
//                 uuid
//                 className
//               }
//               offerType {
//                 id
//                 uuid
//                 name
//                 canHaveMultiple
//               }
//               statutoryBoard {
//                 id
//                 uuid
//                 name
//                 hasSystem
//                 hasToBeAdded
//                 systemUrl
//                 boardNumberName
//                 registrationNumberPlaceholder
//               }
//             }
//             tendererType
//             updatedAt
//             updatedBy
//             uuid
//           }
//         }
//         tendererCertificateList {
//             active
//             attachmentUuid
//             certificateNumber
//             registrationDate
//             createdAt
//             createdBy
//             deleted
//             description
//             expiryDate
//             id
//             isVerified
//             statutoryOfferClass {
//               id
//               uuid
//               className
//               statutoryOffer {
//                 id
//                 uuid
//                 deleted
//                 active
//                 offerType {
//                   id
//                   uuid
//                   name
//                   canHaveMultiple
//                 }
//                 statutoryBoard {
//                   id
//                   uuid
//                   name
//                 }
//               }
//             }
//             updatedAt
//             updatedBy
//             uuid
//         }
//       }
//       createdAt
//       website
//       attachmentUuid
//       operatingCountry{
//       name
//       }
//     }
//     headOfDepartment
// `;

// export const financialAccountField = `
//   billId
//   billableEntityTypeEnum
//   billableEntityUuid
//   billedAmount
//   controlNumber
//   currency
//   isBalanceSufficient
//   payerEmail
//   payerName
//   payerPhone
//   userAccountBalance
//   remarks
//   status
//   billItemList{
//     serviceName
//     price
//     gfsCode
//   }
// `;

// export const tendererUserFields = `
//     id
//     accountNonExpired
//     accountNonLocked
//     active
//     isProcuringEntityAdministrator
//     tenderer{
//       ${detailedTendererFields}
//       specialGroup{
//         ${specialGroupFields}
//       }
//     }
//     rolesListStrings
//     userRoles{
//            role{
//                name
//                displayName
//            }
//       }
//     tokenCreatedAt
//     paymentStatus
//     subscriptionUuid
//     subscriptionId
//     updatedAt
//     updatedBy
//     username
//     fullName
//     firstName
//     middleName
//     lastName
//     uuid
//     userTypeEnum
//     `;

// // export const myDetailsCostomField = ``;

// export const userInfoFields = `
//   id
//   uuid
//   userTypeEnum
//   username
//   headOfDepartment
//   email
//   phone
//   active
//   deleted
//   fullName
//   firstName
//   middleName
//   lastName
//   checkNumber
//   userRoles{
//     role{
//       name
//     }
//   }
//   salutation
//   activationToken
//   emailVerified
//   hasHandover
//   hasSignature
//   tocAttachmentUuid
//   paymentStatus
//   subscriptionUuid
//   subscriptionId
//   embassy{
//     id
//     uuid
//     name
//     phone
//     physicalAddress
//     postalAddress
//     email
//   }
//   isProcuringEntityAdministrator
//   otpToken
//   procuringEntity{
//      id
//      uuid
//      name
//   }
//   rolesList{
//     id
//     uuid
//     displayName
//   }
//   department{
//     id
//     uuid
//     name
//   }
//   rolesListStrings
//   userRoles{
//            role{
//                name
//                displayName
//            }
//       }
//   userGroups {
//    id
//    name
//   }
//   designation{
//     id
//     uuid
//     designationName
//   }
//   userProcuringEntities{
//     name
//     uuid
//   }
//   userDelegateProcuringEntityList{
//     uuid
//     deleted
//     procuringEntity{
//       uuid
//       name
//     }
//   }
// `;

// export const GET_SYSTEM_ALL_USERS = gql`
//   query getUserAccountData($input: DataRequestInputInput) {
//     items: getUserAccountData(input: $input, withMetaData: false) {
//      totalPages
//      totalRecords
//      currentPage
//      last
//      first
//      hasNext
//      hasPrevious
//      numberOfRecords
//      recordsFilteredCount
//      metaData {
//        fieldName
//        isSearchable
//        isSortable
//        isEnum
//      }
//       rows: data {
//         uuid
//         fullName
//         email
//         phone
//         department{
//           name
//         }
//         designation{
//           designationName
//         }
//         headOfDepartment
//         otpToken
//         active
//         accountNonLocked
//         rolesList{
//           displayName
//           name
//         }
//       }
//     }
//   }
// `;

// export const PAYMENT_CEHCK_FOR_SERVICE = gql`
//   mutation confirmPaymentForService($billUuid: String) {
//     confirmPaymentForService(
//       billUuid: $billUuid
//     ) {
//       message
//       status
//     }
//   }
// `;

// export const UPDATE_ACCOUNT_USER_AFTER_PAYMENT = gql`
//   mutation updateTenderPaymentInformation(
//     $status: Boolean
//     $billableEntityUuid: String
//   ) {
//     updateTenderPaymentInformation(
//       status: $status
//       billableEntityUuid: $billableEntityUuid
//     ) {
//       message
//       status
//     }
//   }
// `;

// export const UPDATE_ACCOUNT_SUBSCRIBER_AFTER_PAYMENT = gql`
//   mutation updateSubscriptionPaymentInformation(
//     $status: Boolean
//     $uuid: String
//   ) {
//     updateSubscriptionPaymentInformation(
//       status: $status
//       uuid: $uuid
//     ) {
//       message
//       status
//     }
//   }
// `;

// export const GET_REGISTRATION_BILLING = gql`
//   query generateBillForService($generateBillDto: GenerateBillDtoInput) {
//     generateBillForService(generateBillDto: $generateBillDto){
//       code
//       message
//       data{
//         ${financialAccountField}
//       }
//     }
//   }
// `;

// export const GET_TENDERER_REGISTRATION_BILLING = gql`
//   query generateBillForTendererRegistration($tendererRegistrationBillDto: TendererRegistrationBillDtoInput) {
//     generateBillForTendererRegistration(tendererRegistrationBillDto: $tendererRegistrationBillDto){
//       code
//       message
//       data{
//         status
//         remark
//         billUuid
//         billReferenceNumber
//         billableEntityTypeEnum
//         billedAmount
//         billingCycle
//         controlNumber
//         currency
//         isBalanceSufficient
//         payerName
//         price
//         serviceName
//         tendererType
//         userAccountBalance
//       }
//     }
//   }
// `;

// export const REGENERATE_BILLABLE_ENTITY_CONTROL_NUMBER = gql`
//   mutation regenerateBillableEntityControlNumber($billableEntityUuid: String, $billableEntityName: String, $email: String, $billableEntityType: BillableEntityTypeEnum){
//     regenerateBillableEntityControlNumber(billableEntityUuid: $billableEntityUuid, billableEntityName: $billableEntityName, email: $email, billableEntityType: $billableEntityType){
//       data{
//         ${financialAccountField}
//       }
//       message
//       code
//     }
//   }
// `;

// export const CLEAR_GEPG_BILLING_INFORMATION = gql`
//   mutation clearGepgBillInformation($billableEntityType: BillableEntityTypeEnum, $billableEntityUuid: String) {
//     clearGepgBillInformation(billableEntityUuid: $billableEntityUuid, billableEntityType: $billableEntityType){
//       data
//       message
//       code
//     }
//   }
// `;
// export const CHANGE_BILLABLE_ENTITY_CONTROL_NUMBER = gql`
//   mutation changeBillableEntityControlNumber($billableEntityUuid: String, $controlNumber: String){
//     changeBillableEntityControlNumber(billableEntityUuid: $billableEntityUuid, controlNumber: $controlNumber){
//       data
//       message
//       code
//     }
//   }
// `;

// // export const LIST_ALL_USERS = gql`
// // query listOfUserAccounts{
// //   listOfUserAccounts{
// //     ${userInfoFields}
// //   }
// // }
// // `;

// export const ASSIGN_ROLE_USER = gql`
//   mutation assignRoleToUser($roleIds: [Long], $userUuid: String){
//     assignRoleToUser(roleIds: $roleIds, userUuid: $userUuid){
//       data{
//         ${userInfoFields}
//       }
//       code
//     }
//   }
// `;

// export const ASSIGN_ROLE_TO_EXTERNAL_USER = gql`
//   mutation assignRoleToExternalUser($roleIds: [Long], $userUuid: String){
//     assignRoleToExternalUser(roleIds: $roleIds, userUuid: $userUuid){
//       data{
//         ${userInfoFields}
//       }
//       code
//       message
//     }
//   }
// `;

// export const SWITCH_ACCOUNT_USER = gql`
//   mutation setCurrentProcuringEntity($procuringEntityUid: String){
//     setCurrentProcuringEntity(procuringEntityUid: $procuringEntityUid){
//       data
//       code
//       message
//     }
//   }
// `;

// export const HAND_OVER_TO_USER = gql`
//   mutation handOverToUser($handOverRequestDTO: HandOverRequestDTOInput){
//     handOverToUser(handOverRequestDTO: $handOverRequestDTO){
//       data
//       code
//       message
//     }
//   }
// `;

// export const HAND_ONBEHALF_OVER_TO_USER = gql`
//   mutation handOverOnBehalf($handOverRequestDTO: HandOverRequestDTOInput){
//     handOverOnBehalf(handOverRequestDTO: $handOverRequestDTO){
//       data
//       code
//       message
//     }
//   }
// `;

// export const HAND_OVER_RESUME_TO_USER = gql`
//   mutation resumeFromHandOver($userUuid: String){
//     resumeFromHandOver(userUuid: $userUuid){
//       data
//       code
//       message
//     }
//   }
// `;

// export const GET_USER_BY_INSTITUTION = gql`
// query getAllUsersByInstitutionId($institutionId: String,$pageParam: PageableParamInput){
//   getAllUsersByInstitutionId(institutionId:$institutionId,pageParam:$pageParam){
//     content{
//       ${userInfoFields}
//     }
//     first
//     last
//     number
//     numberOfElements
//     pageable{
//       pageNumber
//       pageSize
//     }
//     size
//     totalElements
//     totalPages
//   }
// }

// `;

// // USERS BY INSTITUTION UUID
// export const GET_USERS_BY_INSTITUTION_BY_UUID = gql`
//   query getAllUsersByProcuringEntityUuid($procuringEntityId: String){
//     getAllUsersByProcuringEntityUuid(procuringEntityId:$procuringEntityId){
//       code
//       data{
//         ${userInfoFields}
//       }
//       message
//       status
//     }
//   }
// `;

// // USERS BY INSTITUTION UUID
// export const GET_USERS_BY_INSTITUTION_BY_ID = gql`
//   query getUsersByProcuringEntityId($procuringEntityId: Long){
//     getUsersByProcuringEntityId(procuringEntityId:$procuringEntityId){
//       code
//       data{
//         ${userInfoFields}
//       }
//       message
//       status
//     }
//   }
// `;

// // USERS BY INSTITUTION UUID
// export const GET_USERS_BY_INSTITUTION_APPROVA_BY_UUID = gql`
//   query getAllActionUsersByProcuringEntityUuid($procuringEntityUuid: String){
//     getAllActionUsersByProcuringEntityUuid(procuringEntityUuid: $procuringEntityUuid){
//       code
//       data{
//         ${userInfoFields}
//       }
//       message
//       status
//     }
//   }
// `;

// // ALL USERS
// export const FIND_USERS_BY_INSTITUTION_APPROVA_BY_UUID = gql`
//   query findAllUsersByProcuringEntityUuid($procuringEntityUuid: String){
//     findAllUsersByProcuringEntityUuid(procuringEntityUuid: $procuringEntityUuid){
//       code
//       dataList{
//         email
//         firstName
//         fullName
//         id
//         jobTitle
//         lastName
//         middleName
//         name
//         uuid
//         department{
//           uuid
//           name
//         }
//         designation{
//           uuid
//           designationName
//         }
//       }
//       message
//       status
//     }
//   }
// `;

// // CHANGE REQUEST MANAGEMENT
// export const GET_APPROVAL_STAGE_USER = gql`
// query getApprovalStageUsers($stageUuid: String){
//   getApprovalStageUsers(stageUuid:$stageUuid){
//     code
//     dataList{
//       ${userInfoFields}
//     }
//     message
//     status

//   }
// }
// `;

// export const GET_DEPARTMENT_PERSONNELS = gql`
//   query getAllUsersByDepartment($departmentId: String, $pageParam: PageableParamInput) {
//     getAllUsersByDepartment(departmentId: $departmentId, pageParam: $pageParam){
//       content{
//         ${userInfoFields}
//       }
//       size
//       totalPages
//       totalElements
//       numberOfElements
//     }
//   }
// `;

// export const SAVE_USER = gql`
//   mutation createUpdateUserAccount($user: UserDtoInput){
//     createUpdateUserAccount(user: $user){
//       code
//       message
//       data{
//         ${userFields}
//       }
//     }
//   }
// `;

// export const UPDATE_TENDERER_ACCOUNT_INFORMATION = gql`
//   mutation updateTendererAccountInformation($userDto: UserDtoInput){
//     updateTendererAccountInformation(userDto: $userDto){
//       code
//       message
//       data{
//         ${userFields}
//       }
//     }
//   }
// `;

// export const UPDATE_TENDERER_PHYSCIAL_INFORMATION = gql`
//   mutation updateTendererInformation($tendererInformationRequestDTO: TendererInformationRequestDTOInput){
//     updateTendererInformation(tendererInformationRequestDTO: $tendererInformationRequestDTO){
//       code
//       message
//     }
//   }
// `;

// export const RESEND_ACTIVATION_LINK = gql`
//   mutation resendActivationLink($email: String){
//     resendActivationLink(email: $email){
//       code
//       message
//       data{
//         ${userFields}
//       }
//     }
//   }
// `;

// export const RESEND_ACCEPTANCE_LINK = gql`
//   mutation resendPersonnelEmail($personnelUuid: String){
//     resendPersonnelEmail(personnelUuid: $personnelUuid){
//       code
//       message
//     }
//   }
// `;

// export const GET_USERS_BY_PE_UUID = gql`
//     query getUserByProcuringEntityUuidData($input: DataRequestInputInput, $procuringEntityUuid: String){
//       getUserByProcuringEntityUuidData(input: $input,procuringEntityUuid: $procuringEntityUuid, withMetaData: false){
//         totalPages
//         totalRecords
//         currentPage
//         last
//         first
//         hasNext
//         hasPrevious
//         numberOfRecords
//         recordsFilteredCount
//         metaData {
//           fieldName
//           isSearchable
//           isSortable
//           isEnum
//         }
//         rows:data {
//           id
//           uuid
//           email
//           firstName
//           fullName
//           lastName
//           active
//           middleName
//           salutation
//           deleted
//           rolesList{
//             name
//             displayName
//           }
//           rolesListStrings
//           checkNumber
//           emailVerified
//           isProcuringEntityAdministrator
//           userDelegateProcuringEntityList{
//             uuid
//             deleted
//             procuringEntity{
//               uuid
//               name
//             }
//           }
//           procuringEntity{
//             uuid
//             name
//           }
//           department{
//             name
//             id
//           }
//           phone
//         }
//       }
//     }
//    `;

// export const GET_TENDERER_USER_BY_TENDERER = gql`
//     query getUserDataByTenderer($input: DataRequestInputInput){
//       getUserDataByTenderer(input: $input,  withMetaData: false){
//         totalPages
//         totalRecords
//         currentPage
//         last
//         first
//         hasNext
//         hasPrevious
//         numberOfRecords
//         recordsFilteredCount
//         metaData {
//           fieldName
//           isSearchable
//           isSortable
//           isEnum
//         }
//         rows:data {
//           id
//           uuid
//           email
//           firstName
//           fullName
//           jobTitle
//           lastName
//           active
//           middleName
//           salutation
//           rolesList{
//             name
//           }
//           phone
//         }
//       }
//     }
//    `;

// export const GET_TENDERER_USER_BY_UUID = gql`
//    query findTendererUserByUuid($uuid: String){
//     findTendererUserByUuid(uuid:$uuid){
//        code
//        data{
//         id
//         uuid
//         email
//         firstName
//         fullName
//         jobTitle
//         lastName
//         middleName
//         salutation
//         phone
//         username
//         userTypeEnum
//         rolesList{
//           name
//           displayName
//         }
//         rolesListStrings
//         userRoles{
//            role{
//                name
//                displayName
//            }
//       }
//        }
//        message
//        status
//      }
//    }
//  `;

// export const CREATE_UPDATE_TENDERER_USER_WITH_ROLE = gql`
//   mutation createUpdateTendererUserAccountWithRole($roleName: String, $userDto: UserDtoInput){
//     createUpdateTendererUserAccountWithRole(roleName: $roleName, userDto: $userDto){
//       code
//       data{
//         id
//         uuid
//         email
//         firstName
//         fullName
//         jobTitle
//         lastName
//         middleName
//         salutation
//         phone
//         username
//         userTypeEnum
//       }
//       status
//       message
//     }
//   }
// `;

// export const CREATE_UPDATE_INSTITUTION_USER_WITH_ROLE = gql`
//   mutation createUpdateUserAccountWithRole($roleName: String, $userDto: UserDtoInput){
//     createUpdateUserAccountWithRole(roleName: $roleName, userDto: $userDto){
//       code
//       data{
//         id
//         uuid
//         department{
//           id
//           uuid
//           name
//         }
//         designation{
//           id
//           designationName
//         }
//         email
//         firstName
//         fullName
//         procuringEntity{
//          id
//          uuid
//          name
//          logoUuid
//         }
//         isOpen
//         jobTitle
//         lastName
//         middleName
//         checkNumber
//         name
//         salutation
//         nationalId
//         phone
//         username
//         userTypeEnum
//         headOfDepartment
//       }
//       status
//       message
//     }
//   }
// `;

// export const CREATE_UPDATE_INSTITUTION_USER_WITH_ROLE_TEST = gql`
//   mutation createUserAccountTest($roleNames: [String], $userAccountRequestDto: UserAccountRequestDtoInput){
//     createUserAccountTest(roleNames: $roleNames, userAccountRequestDto: $userAccountRequestDto){
//       code
//       data{
//         id
//         uuid
//         name
//         firstName
//         middleName
//         lastName
//         email
//         jobTitle
//       }
//       status
//       message
//     }
//   }
// `;

// export const CREATE_UPDATE_INSTITUTION_USER_WITH_MULTIPLE_ROLE = gql`
//   mutation createUpdateMyInstUserAccountWithMultipleRoles($roleNames: [String], $userDto: UserDtoInput){
//     createUpdateMyInstUserAccountWithMultipleRoles(roleNames: $roleNames, userDto: $userDto){
//       code
//       data{
//         id
//         uuid
//         department{
//           id
//           uuid
//           name
//         }
//         designation{
//           id
//           designationName
//         }
//         email
//         firstName
//         fullName
//         procuringEntity{
//          id
//          uuid
//          name
//          logoUuid
//         }
//         isOpen
//         jobTitle
//         lastName
//         middleName
//         checkNumber
//         name
//         salutation
//         nationalId
//         phone
//         username
//         userTypeEnum
//         headOfDepartment
//       }
//       status
//       message
//     }
//   }
// `;

// //Department ID REMOVE FROM PAYLOAD

// export const SAVE_USERS_IN_BATCH = gql`
//   mutation registerUsersInBatch(
//     $usersFromOtherSystem: [UserFromOtherSystemDtoInput]
//   ) {
//     registerUsersInBatch(usersFromOtherSystem: $usersFromOtherSystem) {
//       code
//       message
//       dataList {
//         emailOrId
//         registered
//       }
//     }
//   }
// `;

// export const CREATE_MY_INSTITUTION_USER = gql`
//   mutation createUpdateMyInstUserAccount($user: UserDtoInput) {
//     createUpdateMyInstUserAccount(user: $user) {
//       code
//       message
//       data {
//         id
//         uuid
//       }
//     }
//   }
// `;

// export const ADD_NEW_USER = gql`
// mutation addNewUser($user:UserDtoInput){
//   addNewUser(user:$user){
//     code
//     error
//     message
//     data{
//       ${userFields}
//     }
//   }
// }
// `;

// export const CREATE_INSTITUTION_ADMINS = gql`
// mutation createInstitutionalAdmin($institutionId: Long,$user: UserDtoInput){
//   createInstitutionalAdmin(institutionId:$institutionId,user:$user){
//     code
//     message
//     error
//     data{
//       ${userInfoFields}
//     }
//   }
// }
// `;
// // end of my graphql save user

// export const UPDATE_USER = gql`
//     mutation updateUserAccount($id:Long, $user:UserDtoInput){
//         updateUserAccount(id:$id,user:$user) {
//             error
//              message
//             code
//             data{
//                 ${userFields}
//             }
//         }
//     }
// `;

// export const ACTIVATE_USER = gql`
// mutation activateUser($id:Long){
//   activateUser(id:$id){
//     error
//     message
//     code
//     data{
//       ${userInfoFields}
//     }
//   }
// }
// `;

// export const DEACTIVATE_USER = gql`
// mutation deactivateUser($id: Long){
//   deactivateUser(id: $id){
//     code
//     data{
//       ${userInfoFields}
//     }
//   }
// }
// `;

// export const DELETE_TENDERER_USER_BY_UUID = gql`
//   mutation deleteTendererUserByUuid($uuid: String) {
//     deleteTendererUserByUuid(uuid: $uuid) {
//       message
//       code
//       status
//       data
//     }
//   }
// `;

// export const DELETE_USER = gql`
// mutation deleteUser($id:Long){
//   deleteUser(id:$id){
//     error
//     message
//     code
//     data{
//       ${userInfoFields}
//     }
//   }
// }
// `;
// export const DELETE_SYSTEM_USER = gql`
// mutation deleteProcuringEntityUser($deletePEUserRequestDTO: DeletePEUserRequestDTOInput) {
//   deleteProcuringEntityUser(deletePEUserRequestDTO:$deletePEUserRequestDTO){
//     message
//     code
//     data
//   }
// }
// `;

// export const CREATE_BUSINESS_OWNERSHIP = gql`
// mutation createTendererBusinessRegistrationDetails($tendererBusinessOwnersDetailsDto: TendererBusinessOwnersDetailsDtoInput) {
//   createTendererBusinessRegistrationDetails(tendererBusinessOwnersDetailsDto:$tendererBusinessOwnersDetailsDto){
//     message
//     code
//   }
// }
// `;

// export const MY_DETAILS = gql`
//     query myDetails{
//         myDetails{
//             code
//             data{
//               ${userFields}
//             }
//         }
//     }
// `;

// export const GET_EMBASSY_TENDERER_STATISTICS = gql`
//   query getEmbassyStatistics {
//     getEmbassyStatistics {
//       code
//       data {
//         approvedTenderers
//         rejectedTenderers
//         totalTenderers
//         waitingTenderers
//       }
//     }
//   }
// `;

// export const TENDERER_MY_DETAILS_REGISTRATION = gql`
//     query myDetails{
//         myDetails{
//           code
//           data{
//             tenderer{
//               ${detailedTendererFields}
//               specialGroup{
//                 ${specialGroupFields}
//               }
//             }
//           }
//         }
//     }
// `;

// export const TENDERER_MY_DETAILS = gql`
//     query myDetails{
//         myDetails{
//           code
//           data{
//               ${tendererUserFields}
//           }
//         }
//     }
// `;

// export const GET_TENDERER_BUSINESS_LINES =gql`
// query getTendererBusinessLines {
//   getTendererBusinessLines: myDetails{
//     data {
//       tenderer {
//         tendererBusinessLineList {
//           approvalStatus
//           businessLine {
//             name
//             uuid
//             tenderCategory {
//               uuid
//               name
//             }
//             businessLineConfigurationList {
//               needExpiryDate
//             }
//           }
//           tendererCertificateList {
//             expiryDate
//             description
//           }
//         }
//       }
//     }
//   }
// }`;

// export const PE_MY_DETAILS = gql`
//     query myDetails{
//         myDetails{
//             code
//             data{
//                 ${userInfoFields}
//             }
//         }
//     }
// `;

// export const GET_TENDERER_DASHBOARD_STATISTICS_BY_STATUS = gql`
//     query findTendererDashboardStatisticsByStatus($tendererUuid: String, $status: String) {
//       findTendererDashboardStatisticsByStatus(tendererUuid: $tendererUuid, status: $status) {
//             code
//             data{
//               awarded
//               cancelled
//               opened
//               published
//             }
//         }
//     }
// `;

// export const GET_TENDERER_GOVERNMENT_COMPLAINCE_BY_STATUS = gql`
//     query getTendererGovernmentComplianceStatistics{
//       getTendererGovernmentComplianceStatistics{
//             code
//             data{
//               complianceList{
//                 complianceStatus
//                 governmentComplianceName
//                 governmentComplianceUuid
//                 registrationNumber
//                 registrationStatus
//                 tendererUuid
//                 uuid
//               }
//               compliedTo
//               status
//               totalCompliance
//             }
//         }
//     }
// `;

// export const GET_BUSINESS_LINE_CERTIFICATE_BY_STATUS = gql`
//     query getTendererBusinessLineStatus{
//       getTendererBusinessLineStatus{
//             code
//             dataList{
//               approvalStatus
//               businessLineName
//               certificateList{
//                 certificateName
//                 expiryDate
//               }
//               tendererBusinessLineUuid
//             }
//             message
//         }
//     }
// `;

// export const TENDERER_BUSINESS_REGISTRATION_DETAILS = gql`
//   query findTendererBusinessRegistrationDetailsByTendererUuid($uuid: String) {
//     findTendererBusinessRegistrationDetailsByTendererUuid(uuid: $uuid) {
//       code
//       data {
//         businessRegistrationCertificateUuid
//         email
//         isCertificateExpiring
//         name
//         phoneNumber
//         physicalAddress
//         postalAddress
//         registrationCertificateName
//         registrationDate
//         registrationNumber
//         uuid
//         validFrom
//         validUntil
//         website
//       }
//     }
//   }
// `;

// export const FIND_TENDERER_ASSOCIATED_BY_TENDERER_UUID = gql`
//   query findTendererAssociatedDetailsByTendererUuid($uuid: String) {
//     findTendererAssociatedDetailsByTendererUuid(uuid: $uuid) {
//       code
//       message
//       status
//       data {
//         associateType: tendererAssociateTypeEnum
//         parentDetails: tendererSubsidiaryAssociatesDetails {
//           parentCompanyName
//           parentPhysicalAddress
//           parentWebsite
//         }
//         associated: tendererParentAssociateDetailsList {
//           locationOfSubsidiary
//           nameOfSubsidiary
//         }
//       }
//     }
//   }
// `;
// export const TENDERER_PARENT_SUBSIDIARY_DETAILS = gql`
//   query findTendererParentAssociateDetailsByTendererUuid($uuid: String) {
//     findTendererParentAssociateDetailsByTendererUuid(uuid: $uuid) {
//       code
//       data {
//         id
//         uuid
//         locationOfSubsidiary
//         nameOfSubsidiary
//       }
//     }
//   }
// `;

// export const FIND_BUSINESS_REGISTRATION_AUTHORITY = gql`
//   query findBusinessRegistrationAuthorityByCountryUuidAndZone($countryUuid: String,$tendererZone: TendererZoneEnum) {
//     findBusinessRegistrationAuthorityByCountryUuidAndZone(countryUuid: $countryUuid, tendererZone: $tendererZone) {
//       code
//       data {
//         acronym
//         country {
//           uuid
//           name
//         }
//         email
//         fax
//         name
//         phone
//         physicalAddress
//         postalAddress
//         website
//       }
//     }
//   }
// `;

// export const FIND_TAX_REGISTRATION_AUTHORITY = gql`
//   query findTaxRegistrationAuthorityByCountryUuidAndZone($countryUuid: String,$tendererZone: TendererZoneEnum) {
//     findTaxRegistrationAuthorityByCountryUuidAndZone(countryUuid: $countryUuid, tendererZone: $tendererZone) {
//       code
//       data {
//         acronym
//         country {
//           uuid
//           name
//         }
//         email
//         fax
//         name
//         phone
//         physicalAddress
//         postalAddress
//         website
//       }
//     }
//   }
// `;

// export const GET_TENDERER_BUSINESS_OWNERSHIP_DETAILS_DASHBOARD = gql`
//   query findTendererBusinessOwnershipDetailsByTendererUuid($uuid: String) {
//     findTendererBusinessOwnershipDetailsByTendererUuid(uuid: $uuid) {
//       code
//       data {
//         tendererBusinessOwnersDetails {
//           uuid
//         }
//       }
//     }
//   }
// `;

// export const GET_TENDERER_BUSINESS_OWNERSHIP_DETAILS = gql`
//   query findTendererBusinessOwnershipDetailsByTendererUuid($uuid: String) {
//     findTendererBusinessOwnershipDetailsByTendererUuid(uuid: $uuid) {
//       code
//       data {
//         id
//         uuid
//         businessOwnership
//         ownershipAgreementDocumentUuid
//         tendererBusinessOwnershipStructure
//         tendererBusinessOwnersDetails {
//           uuid
//           name
//           email
//           phoneNumber
//           identificationNumber
//           ownershipValue
//           country {
//             uuid
//             name
//           }
//         }
//       }
//     }
//   }
// `;

// export const SYSTEM_CHECK_LOCK = gql`
//   query findGlobalSettingByKey($settingKey: String) {
//     findGlobalSettingByKey(settingKey: $settingKey) {
//       data{
//         value
//       }
//     }
//   }
// `;

// export const TENDERER_ASSOCIATES_DETAILS = gql`
//   query findTendererSubsidiaryAssociatesDetailsByTendererUuid($uuid: String) {
//     findTendererSubsidiaryAssociatesDetailsByTendererUuid(uuid: $uuid) {
//       code
//       data {
//         parentCompanyName
//         parentPhysicalAddress
//         parentWebsite
//         uuid
//       }
//     }
//   }
// `;

// export const TENDERER_TAX_REGISTRATION_DETAILS = gql`
//   query findTendererTaxRegistrationDetailsByTendererUuid($uuid: String) {
//     findTendererTaxRegistrationDetailsByTendererUuid(uuid: $uuid) {
//       code
//       data {
//         email
//         phoneNumber
//         physicalAddress
//         taxAuthorityName
//         taxCertificateUuid
//         taxPayerNumber
//         uuid
//         vatNumber
//         website
//         firstName
//         middleName
//         lastName
//         tinType
//         clientPhoneNumber
//         clientPhysicalAddress
//       }
//     }
//   }
// `;

// export const DELETE_OWNERSHIP_REGISTRATION_DETAILS = gql`
//   mutation deleteTendererBusinessOwnersDetailsByUuid($uuid: String) {
//     deleteTendererBusinessOwnersDetailsByUuid(uuid: $uuid) {
//       code
//       message
//       status
//     }
//   }
// `;

// export const DELETE_PARENT_BRANCH_DETAILS = gql`
//   mutation deleteTendererParentAssociatesDetailsByUuid($uuid: String) {
//     deleteTendererParentAssociatesDetailsByUuid(uuid: $uuid) {
//       code
//       message
//       status
//     }
//   }
// `;

// export const GET_TENDERER_DETAILS_UUID = gql`
//   query findTendererByUuid($uuid: String) {
//     findTendererByUuid(uuid: $uuid) {
//       code
//       data {
//         name
//         executiveLeaderTitle
//         executiveLeaderName
//         phone
//         physicalAddress
//         postalAddress
//         tendererZone
//         uuid
//         email
//         website
//         tendererType
//       }
//     }
//   }
// `;

// export const USER_INFO_BY_ID = gql`
//     query userInfoById($id: Long){
//       userInfoById( id: $id ){
//         code
//         data{
//           ${userFields}
//         }
//       }
//     }
// `;

// export const GET_PE_USERS_BY_INSTITUTION_AND_ROLE_NAME = gql`
//   query getProcuringEntityUsersByUuidAndRoleName($roleName: String, $procuringEntityUuid: String){
//     getProcuringEntityUsersByUuidAndRoleName(roleName: $roleName, procuringEntityUuid: $procuringEntityUuid){
//       code
//       dataList{
//         id
//         uuid
//         department{
//           id
//           name
//         }
//         id
//         uuid
//         active
//         email
//         isProcuringEntityAdministrator
//         firstName
//         fullName
//         emailVerified
//         userDelegateProcuringEntityList{
//           uuid
//           deleted
//           procuringEntity{
//             uuid
//             name
//           }
//         }
//         activationToken
//         hasHandover
//         procuringEntity{
//          id
//          uuid
//          name
//         }
//         jobTitle
//         lastName
//         middleName
//         name
//         nationalId
//         phone
//         username
//         hasPSPTB
//         psptbNumber
//         userTypeEnum
//         headOfDepartment
//         nidaNumber
//         nationality{
//           uuid
//           name
//           flag
//           phoneCode
//         }
//         rolesListStrings
//         userRoles{
//            role{
//                name
//                displayName
//            }
//       }
//         checkNumber
//         salutation
//       }
//       message
//       status
//     }
//   }
// `;
// ``

// export const USER_INFO_BY_UUID = gql`
//     query userDetailsByUuid($userUuid: String){
//       userDetailsByUuid( userUuid: $userUuid ){
//         code
//         data{
//           ${userFields}
//         }
//       }
//     }
// `;

// export const GET_DETAILS_BY_ID = gql`
//     query userDetails($id: Long){
//       userDetails( id: $id ){
//         code
//         data{
//           ${userFields}
//         }
//       }
//     }
// `;

// export const GET_MY_DETAILS = gql`
//   query myDetails {
//     myDetails {
//       code
//       data {
//         id
//         accountNonExpired
//         accountNonLocked
//         active
//         createdAt
//         createdBy
//         credentialsNonExpired
//         hasAcceptedTOC
//         tocAttachmentUuid
//         deleted
//         department {
//           id
//           uuid
//           departmentName
//         }
//         email
//         enabled
//         firstLogin
//         firstName
//         formRole
//         fullName
//         hasHandover
//         handedOverUserGroups
//         institution {
//           id
//           uuid
//           name
//           pathLogo
//         }
//         isOpen
//         jobTitle
//         lastLogin
//         lastName
//         middleName
//         name
//         nationalId
//         password
//         passwordExpirationDate
//         passwordExpired
//         permissionIdsList
//         phone
//         picture
//         rememberToken
//         resetLinkSent
//         hasSignature
//         hasAcceptedTOC
//         tocAttachmentUuid
//         hasHandover
//         paymentStatus
//         subscriptionUuid
//         subscriptionId
//         handedOverUserGroups
//         tokenCreatedAt
//         updatedAt
//         updatedBy
//         userInstitutionId
//         username
//         uuid
//         userTypeEnum
//       }
//     }
//   }
// `;

// // export const REQUEST_RESET_PASSWORD = gql`
// //   mutation requestResetPassword( $email ){
// //     requestResetPassword( email: $email )
// //   }
// // `;

// export const RESET_PASSWORD = gql`
//   mutation resetPassword($passwordCreate: PasswordCreateInput, $email: String) {
//     resetPassword(passwordCreate: $passwordCreate, email: $email)
//   }
// `;

// export const CHECK_USER_VALIDITY = gql`
//   query checkUserValidity($email: String, $passwd: String) {
//     checkUserValidity(email: $email, passwd: $passwd) {
//       code
//       data
//       message
//       status
//     }
//   }
// `;

// export const UPDATE_USER_PASSWORD = gql`
//   mutation changePassword($changePasswordDto: ChangePasswordDTOInput) {
//     changePassword(changePasswordDto: $changePasswordDto) {
//       code
//       data {
//         id
//         uuid
//       }
//       message
//       status
//     }
//   }
// `;

// export const ACCEPT_ANTI_BRIBERY_POLICY = gql`
//   mutation saveAntiBriberyInfo($tenderer: TendererDTOInput) {
//     saveAntiBriberyInfo(tenderer: $tenderer) {
//       code
//       message
//       status
//     }
//   }
// `;

// export const ACCEPT_TERMS_CONDITION_POLICY = gql`
//   mutation saveTermsAndCondition($tendererDTO: TendererDTOInput) {
//     saveTermsAndCondition(tendererDTO: $tendererDTO) {
//       code
//       message
//       status
//     }
//   }
// `;

// export const ACCEPT_TERMS_CONDITION_PE_POLICY = gql`
//   mutation updateTOCUser($tocAttachmentUuid: String) {
//     updateTOCUser(tocAttachmentUuid: $tocAttachmentUuid) {
//       code
//       message
//       status
//     }
//   }
// `;

// export const SET_SIGNATURE_USER = gql`
//   mutation updateSignatureStatus($uuid: String) {
//     updateSignatureStatus(uuid: $uuid) {
//       code
//       message
//       status
//     }
//   }
// `;

// export const ASSIGN_USERS_TO_DEPARTMENT = gql`
//   mutation addUsersToDepartment($userIds: [Long], $departmentId: Long) {
//     addUsersToDepartment(userIds: $userIds, departmentId: $departmentId) {
//       code
//       data {
//         id
//         departmentName
//         departmentCode
//         uuid
//         users {
//           id
//           uuid
//           firstName
//           middleName
//           lastName
//           email
//           phone
//         }
//       }
//     }
//   }
// `;

// export const ASSIGN_HEAD_OF_DEPARTMENT = gql`
//     mutation assignHeadOfDepartment($departmentId: Long, $userId: Long){
//         assignHeadOfDepartment(departmentId: $departmentId, userId: $userId) {
//             code
//             data{
//               ${userFields}
//             }
//             status
//             message
//         }
//     }
// `;

// export const GET_DEPARTMENT_USERS = gql`
//   query getMyDepartmentUsers($serviceUuid: String) {
//     getMyDepartmentUsers(serviceUuid: $serviceUuid) {
//       code
//       dataList {
//         id
//         email
//         firstName
//         fullName
//         jobTitle
//         lastName
//         middleName
//         uuid
//       }
//     }
//   }
// `;

// export const USER_INFOFEW_FIELDS_ID = gql`
//   query userInfoById($id: Long) {
//     userInfoById(id: $id) {
//       code
//       data {
//         id
//         fullName
//       }
//     }
//   }
// `;

// export const REMOVE_USER_FROM_DEPARTMENT = gql`
//   mutation removeUsersFromDepartment($departmentId: Long, $userIds: [Long]) {
//     removeUsersFromDepartment(departmentId: $departmentId, userIds: $userIds) {
//       code
//       data {
//         id
//         uuid
//         departmentName
//       }
//     }
//   }
// `;
// export const ASSIGN_USER_TO_SERVICE = gql`
//   mutation assignUsersToService($userUuidList: [String], $serviceUuid: String) {
//     assignUsersToService(
//       userUuidList: $userUuidList
//       serviceUuid: $serviceUuid
//     ) {
//       code
//       message
//       data {
//         id
//         uuid
//         name
//       }
//     }
//   }
// `;

// export const GET_ALL_USERS_ASSIGNED_TO_SERVICE = gql`
//    query getAllUsersAssignedToService($serviceUuid: String){
//   getAllUsersAssignedToService(serviceUuid: $serviceUuid){
//     code
//     dataList{
//       ${userInfoFields}
//     }
//     message
//     status

//   }

// }

// `;

// export const REMOVE_USER_FROM_SERVICE = gql`
//   mutation removeUsersFromService(
//     $userUuidList: [String]
//     $serviceUuid: String
//   ) {
//     removeUsersFromService(
//       userUuidList: $userUuidList
//       serviceUuid: $serviceUuid
//     ) {
//       code
//       message
//       dataList {
//         id
//         uuid
//       }
//     }
//   }
// `;

// export const GET_ALL_USER_FOUND_IN_SERVICE_GROUP = gql`
//   query getAllUsersFoundInServiceGroup($groupUuid: String) {
//     getAllUsersFoundInServiceGroup(groupUuid: $groupUuid) {
//       code
//       status
//       dataList {
//         uuid
//         name
//         fullName
//         id
//       }
//     }
//   }
// `;

// export const GET_USER_BY_EMAIL = gql`
//   query getMyInstUserAccountByEmail($email: String) {
//     getMyInstUserAccountByEmail(email: $email) {
//       code
//       data {
//         email
//         id
//         uuid
//         firstName
//         lastName
//         fullName
//       }
//     }
//   }
// `;

// export const USER_INFOFEW_FIELDS_UUID = gql`
//   query userDetailsByUuid($userUuid: String) {
//     userDetailsByUuid(userUuid: $userUuid) {
//       code
//       data {
//         id
//         uuid
//         fullName
//       }
//     }
//   }
// `;

// export const LIST_ALL_DEPARTMENT_USERS = gql`
//   query getDepartmentUsers {
//     getDepartmentUsers {
//       id
//       email
//       firstName
//       fullName
//       lastName
//       middleName
//       uuid
//     }
//   }
// `;

// export const TENDERER_USER_DESCRIPTION = gql`
// query findTendererByUuid($uuid: String){
//   findTendererByUuid(uuid: $uuid){
//     code
//     data {
//       ${detailedTendererFields}
//     }
//     message
//     status

//   }
// }
// `;

// export const GET_INSTITUTION_ADMINISTRATOR_PAGINATED = gql`
//  query getUsersByAdministratorStatus( $input: DataRequestInputInput, $isProcuringEntityAdministrator: Boolean) {
//   items: getUsersByAdministratorStatus( input: $input, isProcuringEntityAdministrator: $isProcuringEntityAdministrator, withMetaData: false) {
//      totalPages
//      totalRecords
//      currentPage
//      last
//      first
//      hasNext
//      hasPrevious
//      numberOfRecords
//      recordsFilteredCount
//      metaData {
//        fieldName
//        isSearchable
//        isSortable
//        isEnum
//      }
//      rows:data {
//         uuid
//         id
//         fullName
//         phone
//         activationToken
//         procuringEntity{
//           name
//           procuringEntityCode
//         }
//      }
//    }
//  }
// `;

// export const GET_USERDATA_PAGINATED = gql`
//  query getUserAccountByEmbassyIDData( $input: DataRequestInputInput,$embassyID : Long) {
//   items: getUserAccountByEmbassyIDData( input: $input,embassyID: $embassyID,withMetaData: false) {
//      totalPages
//      totalRecords
//      currentPage
//      last
//      first
//      hasNext
//      hasPrevious
//      numberOfRecords
//      recordsFilteredCount
//      metaData {
//        fieldName
//        isSearchable
//        isSortable
//        isEnum
//      }
//      rows:data {
//         ${userInfoFields}
//      }
//    }
//  }
// `;

// export const GET_SUBSCRIPTION_BY_USER_UUID = gql`
//   query findSubscriptionByUserAccountUuid($userAccountUuid: String) {
//     findSubscriptionByUserAccountUuid(userAccountUuid: $userAccountUuid) {
//       uuid
//       businessLine {
//         id
//         name
//         description
//         tenderCategory {
//           id
//           name
//         }
//       }
//     }
//   }
// `;

// export const GET_SUBORDINATE_USERS = gql`
//   query getSubordinateUsers {
//     getSubordinateUsers {
//       code
//       dataList {
//         id
//         uuid
//         firstName
//         middleName
//         lastName
//         email
//         username
//       }
//       status
//       message
//     }
//   }
// `;

// export const GET_ALL_SYSTEM_USERS = gql`
//   query getUserAccountData($input: DataRequestInputInput){
//     getUserAccountData(input: $input, withMetaData: false){
//      totalPages
//      totalRecords
//      currentPage
//      last
//      first
//      hasNext
//      hasPrevious
//      numberOfRecords
//      recordsFilteredCount
//      metaData {
//        fieldName
//        isSearchable
//        isSortable
//        isEnum
//      }
//       rows: data {
//           email
//           emailVerified
//           deleted
//           userTypeEnum
//           uuid
//           wasDeleted
//           createdAt
//           firstName
//           lastName
//           fullName
//           phone
//           signInTrials
//           rolesListStrings
//           userRoles{
//            role{
//                name
//                displayName
//            }
//       }
//       }
//     }
//   }
// `;

// export const ALL_USER_INFO_BY_UUID = gql`
//     query userDetailsByUuid($userUuid: String){
//       userDetailsByUuid( userUuid: $userUuid ){
//         code
//         data{
//           email
//           emailVerified
//           deleted
//           userTypeEnum
//           uuid
//           wasDeleted
//           createdAt
//           firstName
//           lastName
//           fullName
//           phone
//           signInTrials
//           procuringEntity{
//             name
//           }
//         }
//       }
//     }
// `;
