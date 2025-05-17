import {gql} from "apollo-angular";

export const SAVE_APPOINTMENT_LETTER_DOCUMENT_INFO = gql`
mutation saveAppointmentLetterDocumentInfo($documentUuid: String, $appointmentLetterUuid: String){
 saveAppointmentLetterDocumentInfo(documentUuid: $documentUuid, appointmentLetterUuid: $appointmentLetterUuid){
      code
      message
      status
    }
}`;

export const SIGN_APPOINTMENT_LETTER = gql`
mutation signAppointmentLetter($appointmentLetterDto: AppointmentLetterDtoInput){
 signAppointmentLetter(appointmentLetterDto: $appointmentLetterDto){
      code
      message
      status
    }
}`;

export const SIGN_APPOINTMENT_LETTER_FOR_ALL_LOTS = gql`
mutation signAppointmentLetterForAllLots($appointmentLetterDto: AppointmentLetterDtoInput){
 signAppointmentLetterForAllLots(appointmentLetterDto: $appointmentLetterDto){
      code
      message
      status
    }
}`;


export const PREPARE_APPOINTMENT_LETTER = gql`
mutation prepareAppointmentLetter($memberUuid: String){
 prepareAppointmentLetter(memberUuid: $memberUuid){
      code
      message
      status
    }
}`;


export const PREPARE_TEAM_MEMBER_APPOINTMENT_LETTER = gql`
mutation prepareTeamMemberAppointmentLetter($memberUuid: String){
 prepareTeamMemberAppointmentLetter(memberUuid: $memberUuid){
      code
      message
      status
    }
}`;

export const GET_APPOINTMENT_LETTER_BY_EVALUATION_COMMITTEE_UUID = gql`
query getAppointmentLetterByEvaluationCommitteeInfo($evaluationCommitteeInfoUuid:String){
  getAppointmentLetterByEvaluationCommitteeInfo(evaluationCommitteeInfoUuid:$evaluationCommitteeInfoUuid){
      code
      message
      status
      data {
        accountingOfficerTitle
        createdAt
        createdBy
        departmentName
        documentUuid
        evaluationDays: plannedNumberOfDays
        evaluationEndDate:plannedEvaluationEndDate
        evaluationStartDate: plannedEvaluationStartDate
        folioNumber
        headOfDepartment
        nameOfEvaluator
        originAccountingOfficerName
        position
        procuringEntityUuid
        tenderDescription
        signedLetterUuid
        isAppointmentLetterSigned
        tenderEvaluationCommitteeInfo {
          uuid
          fullName
          position
          appointmentLetter {
           uuid
           signedLetterUuid
          }
        }
        tenderNumber
        uuid
      }
  }
}`;

export const GET_APPOINTMENT_LETTER_BY_UUID = gql`
query getAppointmentLetterByUuid($uuid:String){
  getAppointmentLetterByUuid(uuid:$uuid){
      code
      message
      status
      data {
        accountingOfficerTitle
        createdAt
        createdBy
        departmentName
        documentUuid
        evaluationDays: plannedNumberOfDays
        evaluationEndDate:plannedEvaluationEndDate
        evaluationStartDate: plannedEvaluationStartDate
        folioNumber
        headOfDepartment
        nameOfEvaluator
        originAccountingOfficerName
        position
        procuringEntityUuid
        tenderDescription
        signedLetterUuid
        isAppointmentLetterSigned
        assignedMemberUuid
        tenderEvaluationCommitteeInfo {
          uuid
          fullName
          position
          appointmentLetter {
           uuid
           signedLetterUuid
          }
        }
        tenderNumber
        uuid
      }
  }
}`;
