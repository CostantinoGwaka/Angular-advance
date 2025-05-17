import {ObjectForEntityDetail} from "../../../../modules/nest-app/store/tender/tender.model";
import {
  EvaluationCriteriaScoreResult
} from "../../../../services/evaluation/evaluation-report-generator/evaluation-criteria-score.service";

export interface EntityInfoSummary {
  entityUuid: string;
  mainEntityUuid: string;
  financialYearCode: string;
  entityNumber: string;
  entityStatus?: string;
  entityType?: string;
  lotNumber: string;
  lotDescription: string;
  description?: string;
  hasAddendum?: boolean;
  sourceOfFund?: boolean;
  hasLot?: boolean;
  procurementCategoryAcronym: string;
  procurementMethodName?: string;
  procurementCategoryName?: string;
  procurementMethodCategory?:string
  selectionMethod?: string;
  shortListedTendererList?: any[];
  eligibleTendererTypeList?: any[];
  entitySubCategoryName: string;
  procuringEntityName: string;
  procurementEntityUuid?: string;
  mainSubmissionUuid?: string;
  tenderOpeningDateTime?: string;
  numberOfLots?: number;
  numberOfClarificationRequest?: number;
  invitationDate: string;
  deadline: string;
}


export interface TeamAssignmentInfo {
  uuid: string;
  firstName: string;
  lastName: string;
  middleName?: string; // Optional field
  position: string;
  memberInstitution: string;
  checkNumber: string;
  hasConflict: boolean;
  hasDeclaredConflict: boolean;
}

export interface EvaluationReportGeneratedData {
  entityType?: string,
  entityUuid?: string,
  preferenceScheme?: string,
  entityDetail?: EntityInfoSummary,
  objectForEntityDetail?: ObjectForEntityDetail,
  teamAssignment?: TeamAssignmentInfo[],
  chairPerson?: TeamAssignmentInfo,
  tenderCalendar?: ObjectActualDateViewAll,
  lotUuidList?: string[],
  criteriaWithScores?: EvaluationCriteriaScoreResult,
  availableLots?: { [ id: string]: {
       stages?: any,
       lotInformation?: any,
       submissions?: any[],
       stageResults?: any,
       winner?: any,
       evaluation?: any,
       criteria?: any[],
       peRequirements?: any[]
    }}
  logoDetails?: {
    peLogo?: string,
    defaultLogo?: string
  }
}


export interface EvaluationReportData {
  peName: string,
  procuringEntityUuid: string,
  projectName: string,
  tenderDescription: string,
  tenderNumber: string,
  planSubmissionDate: string,
  submissionTimeInput: string,
  selectionMethodInput: string,
  invitationDate: string,
  numberOfSubmissions: number,
  sourceOfShortList: string,
  numberOfShortListedFirms: number,
  shortListedFirmList: string,
  shortListedFirmListTable: string, /// HTML string table
  evaluationTeamTable: string,
  conflictDeclarationTable: string, /// HTML string table
  evaluationCriteriaWeightTable: string,
  technicalResultTable: string, /// HTML string table
  firmsStrengthTable: string, /// HTML string table
  areasForNegotiationTable: string,/// HTML string table
  numberOfFirmsPassedTechnical: number,
  technicalReportApprovalTable: string, /// HTML string table
  submissionListTable: string, /// HTML string table
  evaluationCriteriaWithScoreTable: string, /// HTML string table
  minimumPassMarkTechnical: string
  minimumWeightTechnical: string
  chairPersonSignature: string
}

// PE_NAME
// PROJECT_NAME_INPUT  ---
// TENDER_DESCRIPTION_INPUT
// TENDER_NUMBER_INPUT
// SUBMISSION_DATE_INPUT
// SUBMISSION_TIME_INPUT
// SELECTION_METHOD_INPUT
// INVITATION_DATE_INPUT
// NUMBER_OF_SUBMISSIONS_INPUT
// SOURCE_OF_SHORT_LIST_INPUT
// NUMBER_OF_SHORT_LISTED_FIRMS_INPUT
// SHORT_LISTED_FIRM_LIST_INPUT
// SHORT_LISTED_FIRM_LIST_TABLE_INPUT
// EVALUATION_TEAM_TABLE_INPUT
// CONFLICT_DECLARATION_TABLE_INPUT
// EVALUATION_CRITERIA_WEIGHT_TABLE_INPUT
// TECHNICAL_RESULT_TABLE_INPUT
// FIRMS_STRENGTH_TABLE_INPUT
// AREAS_FOR_NEGOTIATION_TABLE_INPUT
// NUMBER_OF_FIRMS_PASSED_TECHNICAL_INPUT
// TECHNICAL_REPORT_APPROVAL_TABLE_INPUT
// CHAIR_PERSON_SIGNATURE_INPUT

export interface ObjectActualDateViewAll {
  approvalOfAwardDate?: string;
  awardNotificationDate?: string;
  invitationDate?: string;
  objectType?: string;
  objectUuid?: string;
  preApplicantsNotificationDate?: string;
  preInvitationDate?: string;
  preSubmissionOrOpeningDate?: string;
  signingOfContractDate?: string;
  startOfContractDate?: string;
  submissionOrOpeningDate?: string;
  tenderEntityId?: number;
  vettingOfContractDate?: string;
}

