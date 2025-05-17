import { gql } from 'apollo-angular';

export const fields = `
id
uuid
code
description
`;

export const committeeInfoFields = `
          appointmentLetter {
           uuid
           signedLetterUuid
          }
          checkNumber
          departmentName
          departmentUuid
          description
          designation
          email
          evaluationStartTime
          evaluationStarted
          financialYearCode
          financialYearUuid
          firstName
          fullName
          hasConflict
          hasDeclaredConflict
          isExternal
          lastName
          memberInstitution
          middleName
          phoneNumber
          position
          replaced
          entityUuid
          entityNumber
          appointmentLetterSigned
          hasAppointmentLetter
          userUuid
          active
          uuid
`;

export const teamSummaryReponse = `
      teamName:descriptionOfProcurement
      members:tenderEvaluationCommitteeInfos{
        uuid
      }
      approvalStatus
      accountingOfficerTitle
      accountingOfficerName
      entityNumber
      entityType
      entityUuid
      financialYearUuid
      mainEntityNumber
      mainEntityUuid
      isReportGenerated
      isEvaluationOpen
      isEvaluationClosed
      evaluationStage
      isCancelled
      hasWinners
      appointmentLettersSent
      allAppointmentLettersSigned
      institutionUuid:procuringEntityUuid
      endDate:plannedEvaluationEndDate
      startDate:plannedEvaluationStartDate
      reachedEndOfEvaluation
      tenderEvaluationMode{
        uuid
        entityNumber
      }
      plannedNumberOfDays
      stageName
      teamType
      uuid
`;

export const GET_TEAMS = gql`
  query getTeamsData( $input: DataRequestInputInput,$entityType: EntityObjectTypeEnum, $withMetaData: Boolean, $teamType: TeamTypeEnum){
    getTeamsData( input: $input,entityType: $entityType,withMetaData: $withMetaData,teamType: $teamType){
      currentPage
      rows:data{
        ${teamSummaryReponse}
      }
      first
      hasNext
      hasPrevious
      last
      numberOfRecords
      pageSize
      recordsFilteredCount
      totalPages
      totalRecords
    }
  }
`;

export const CREATE_TEAM_UPDATE = gql`
  mutation createTeam($teamCommitteeDto: TeamCommitteeDtoInput) {
    createTeam(teamCommitteeDto: $teamCommitteeDto) {
      code
      message
      status
    }
  }
`;

export const CREATE_TEAM_ASSIGNMENT_UPDATE = gql`
  mutation createTeamAssignment($teamAssignmentDTO: TeamAssignmentDTOInput) {
    createTeamAssignment(teamAssignmentDTO: $teamAssignmentDTO) {
      code
      message
      status
    }
  }
`;

export const CREATE_NEGOTIATION_PLAN_TEAM = gql`
  mutation createNegotiationPlanTeam($dto: NegotiationPlanTeamDtoInput) {
    createNegotiationPlanTeam(dto: $dto) {
      code
      message
      status
    }
  }
`;

export const GET_TEAM_TENDER_BY_UUID = gql`
  query getTenderByUuid($tenderUuid: String) {
    getTenderByUuid(tenderUuid: $tenderUuid) {
      code
      message
      status
      data {
        UNSPSC
        approvalLatestDate
        approvalStartDate
        approvalStatus
        tenderCalenderDates {
          active
          actualDate
          plannedDate
          procurementStage {
            uuid
            name
            procurementStageTypeEnum
            orderNumber
          }
          uuid
        }
        preQualificationTenderCalenderDates {
          active
          actualDate
          plannedDate
          procurementStage {
            uuid
            name
            procurementStageTypeEnum
          }
          uuid
        }
        prequalificationTenderSubCategoryAcronym
        approvals {
          createdAt
          actingAsUserInitial
          actingAsUserUid
          actionPerformed
          approvalComment
          approvalModelName
          approvalModelUid
          approvedAsHandover
          approverFullName
          actionPerformed
          approverUid
          isSubTask
          process {
            description
            processKey
            processName
            shared
            uuid
          }
          stage {
            name
            sortOrder
            uuid
          }
          statusAfterApproval
          userInitial
          uuid
        }
        approvedDate
        budgetPurpose
        contractType {
          name
          uuid
        }
        deleteTaskAction
        departmentUuid
        descriptionOfTheProcurement
        estimatedBudget
        estimatedContractClosureDate
        estimatedContractDuration
        estimatedContractStartDate
        financialYearCode
        hasLot
        invitationDate
        isCuis
        isLot
        hasFilledLot
        logoUuid
        passStatus
        possibleActions
        procurementCategoryAcronym
        procurementCategoryName
        procurementCategoryUuid
        procurementEntityUuid
        procurementMethod {
          uuid
          description
          acronym
        }
        procuringEntityName
        selectionMethod {
          name
          uuid
        }
        sourceOfFund {
          name
          uuid
        }
        stageName
        tenderComments {
          uuid
          comment
        }

        tenderNumber
        tenderSubCategoryAcronym
        tenderSubCategoryName
        tenderSubCategoryUuid
        tendererTypes {
          name
          uuid
        }
        uuid
        id: uuid
      }
    }
  }
`;

// export const GET_TEAMS = gql`
//   query tenderEvaluationCommittees($input: DataRequestInputInput){
//      tenderEvaluationCommittees(input: $input,  withMetaData: false){
//       currentPage
//       rows:data{
//         uuid
//         entityId
//         entityUuid
//         entityNumber
//         name:descriptionOfProcurement
//         isEvaluationOpen
//         isEvaluationClosed
//         isReportGenerated
//         allAppointmentLettersSigned
//         appointmentLettersSent
//         plannedEvaluationEndDate
//         plannedEvaluationStartDate
//         tenderEvaluationCommitteeInfos {
//           ${committeeInfoFields}
//         }
//       }
//       numberOfRecords
//       pageSize
//       recordsFilteredCount
//       totalPages
//       totalRecords
//     }
//   }
// `;

export const CREATE_TEAM_MEMBER = gql`
  mutation createTenderEvaluationCommittee(
    $tenderEvaluationCommitteeDto: TenderEvaluationCommitteeDtoInput
  ) {
    createTenderEvaluationCommittee(
      tenderEvaluationCommitteeDto: $tenderEvaluationCommitteeDto
    ) {
      code
      data {
        tenderDetails {
          descriptionOfTheProcurement
          financialYearCode
          tenderNumber
        }
      }
      message
      status
    }
  }
`;
// event.value != localStorage.getItem('institutionUuid')?[]:['HEAD_OF_PMU', 'AUDITOR', 'ACCOUNTING_OFFICER']
export const GET_ENTITIES_WITHOUT_TEAM = gql`
  query getEntitiesWithoutTeamType(
    $teamType: TeamTypeEnum
    $entityObjectType: EntityObjectTypeEnum
    $financialYearCode: String
  ) {
    getEntitiesWithoutTeamType(
      teamType: $teamType
      entityObjectType: $entityObjectType
      financialYearCode: $financialYearCode
    ) {
      code
      dataList {
        description
        identificationNumber
        name
        uuid
      }
      message
      status
    }
  }
`;
export const GET_TENDER_ENTITIES_WITHOUT_TEAM = gql`
  query getEntitiesWithoutTeamAssignment(
    $teamType: TeamTypeEnum
    $entityObjectType: EntityObjectTypeEnum
    $financialYearCode: String
  ) {
    getEntitiesWithoutTeamAssignment(
      teamType: $teamType
      entityObjectType: $entityObjectType
      financialYearCode: $financialYearCode
    ) {
      code
      dataList {
        description
        identificationNumber
        name
        uuid
      }
      message
      status
    }
  }
`;

export const GET_FRAMEWORKS_WITHOUT_TEAMS = gql`
  query getFrameworksWithoutTeams {
    getFrameworksWithoutTeams {
      code
      status
      message
      data {
        uuid
        lotNumber
        lotDescription
      }
    }
  }
`;

export const GET_FRAMEWORKS_MAIN_WITHOUT_TEAMS = gql`
  query getFrameworksMainWithoutTeams {
    getFrameworksMainWithoutTeams {
      code
      status
      message
      data {
        uuid
        lotNumber: frameworkNumber
        lotDescription: description
      }
    }
  }
`;

export const GET_NEGOTIATION_ENTITIES_WITHOUT_TEAM = gql`
  query getSubmissionWinners($input: DataRequestInputInput) {
    getSubmissionWinners(input: $input, withMetaData: true) {
      currentPage
      data {
        uuid
        entityNumber
        email
        tendererName
        mainSubmission {
          tendererName
          tendererNumber
          uuid
        }
      }
      numberOfRecords
    }
  }
`;

export const GET_TEAM_BY_UUID = gql`
  query findTeamByUuid($uuid: String) {
    findTeamByUuid(uuid: $uuid) {
      code
      data {
        accountingOfficerName
        accountingOfficerTitle
        assignmentParams
        closingDate
        deleteTaskAction
        descriptionOfProcurement
        entityNumber
        entityType
        entityUuid
        evaluationStage
        financialYearId
        financialYearUuid
        groupTasksParams
        hasAssignment
        hasIndividualGroupTask
        hasWinners
        isCancelled
        isEvaluationClosed
        isEvaluationOpen
        isReportGenerated
        mainEntityNumber
        mainEntityUuid
        openingDate
        plannedEvaluationEndDate
        plannedEvaluationStartDate
        plannedEndDate: plannedEvaluationEndDate
        plannedStartDate: plannedEvaluationStartDate
        plannedNumberOfDays
        possibleActions
        procuringEntityUuid
        reachedEndOfEvaluation
        stageName
        teamType
        approvalStatus
        members: tenderEvaluationCommitteeInfos {
          active
          appointmentLetter {
            accountingOfficerTitle
            createdAt
            createdBy
            departmentName
            departmentUuid
            documentUuid
            evaluationDays
            evaluationEndDate
            evaluationStartDate
            folioNumber
            headOfDepartment
            headOfDepartmentUuid
            isAppointmentLetterSigned
            letterSignedBy
            nameOfEvaluator
            originAccountingOfficerName
            plannedEvaluationEndDate
            plannedEvaluationStartDate
            plannedNumberOfDays
            position
            procuringEntityName
            procuringEntityUuid
            signedLetterUuid
            signingTime
            uuid
          }
          appointmentLetterSent
          appointmentLetterSigned
          attachmentUuid
          checkNumber
          createdAt
          createdBy
          currentStage {
            active
            completed
            completionTime
            createdAt
            createdBy
            currentStage
            entityNumber
            entityUuid
            evaluationStageNumber
            isCancelled
            isFinancial
            isLastStage
            userUuid
            uuid
          }
          deleted
          deletedAt
          deletedBy
          departmentId
          departmentName
          departmentUuid
          description
          designation
          email
          entityId
          entityNumber
          entityType
          entityUuid
          evaluationStartTime
          evaluationStarted
          financialYearCode
          financialYearId
          financialYearUuid
          firstName
          fullName
          hasAppointmentLetter
          hasConflict
          hasDeclaredConflict
          hasSignedReport
          isCancelled
          isExternal
          lastName
          memberInstitution
          middleName
          phoneNumber
          position
          procuringEntityName
          replaced
          replacedBy {
            uuid
            lastName
            memberInstitution
            middleName
            phoneNumber
            position
            createdAt
          }
          replacedByHistory {
            uuid
            lastName
            memberInstitution
            middleName
            phoneNumber
            position
            createdAt
          }
          reportSigningDate
          signedReportUuid
          teamReplacementReason {
            uuid
            name
            description
            createdAt
          }
          updatedAt
          updatedBy
          userId
          userUuid
          uuid
        }
        updatedAt
        updatedBy
        uuid
      }
      message
      status
    }
  }
`;

export const GET_TEAM = gql`
  query tenderEvaluationCommittees($input: DataRequestInputInput){
     tenderEvaluationCommittees(input: $input,  withMetaData: false){
      currentPage
      rows:data{
        uuid
        entityId
        entityUuid
        entityNumber
        name:descriptionOfProcurement
        isEvaluationOpen
        isEvaluationClosed
        isReportGenerated
        allAppointmentLettersSigned
        appointmentLettersSent
        plannedEvaluationEndDate
        plannedEvaluationStartDate
        currentEvaluationStage {
          name
          stageNumber
        }
        evaluationMode {
        uuid
        name
        }
        tenderEvaluationCommitteeInfos {
          ${committeeInfoFields}
        }
      }
      numberOfRecords
      pageSize
      recordsFilteredCount
      totalPages
      totalRecords
    }
  }
`;

export const GET_MY_TEAM_TASKS = gql`
  query getMyTeamTasks($teamType:TeamTypeEnum){
    getMyTeamTasks(teamType:$teamType){
          uuid
          approvalStatus
          teamName:descriptionOfProcurement
          financialYearUuid
          possibleActions
          approvals{
            actingAsUserInitial
            actingAsUserUid
            actionPerformed
            approvalComment
            approvalModelName
            approvalModelUid
            approvedAsHandover
            approverFullName
            approverUid
            isSubTask
            process{
              description
              uuid
            }
            stage{
              description
              uuid
            }
            statusAfterApproval
            userInitial
            uuid
          }
          members:tenderEvaluationCommitteeInfos{
          ${committeeInfoFields}
          }
          entityNumber
          entityType
          tenderUuid:entityUuid
    }
  }
`;

export const COMPLETE_TEAM_TASK = gql`
  mutation completeTenderEvaluationTeamTask(
    $workingFlowTaskListDto: [WorkingFlowTaskDtoInput]
  ) {
    completeTenderEvaluationTeamTask(
      workingFlowTaskListDto: $workingFlowTaskListDto
    ) {
      code
      message
      status
    }
  }
`;

// export const REPLACE_TEAM_MEMBER = gql`

// `;

// export const DELETE_TEAM = gql`

// `;
