export interface EntityDetail {
  objectId?: number;
  objectUuid: string;
  objectType: EntityObjectTypeEnum;
}

export const teamConfig: any = {
  EVALUATION_TEAM: 'Evaluation Team',
  NEGOTIATION_TEAM: 'Negotiation Team',
  POST_QUALIFICATION_TEAM: 'Post Qualification Team',
  PRE_QUALIFICATION_TEAM: 'Pre Qualification Team',
  TENDER_BOARD: 'Tender Board Team',
};

export const teamLabelConfig: any = {
  FRAMEWORK: 'Framework',
  PLANNED_TENDER: 'Tender',
  TENDER: 'Tender',
  NEGOTIATION: 'Tender',
};

export const entityLabelConfig: any = {
  EVALUATION_TEAM: 'Evaluation ',
  NEGOTIATION_TEAM: 'Negotiation ',
  POST_QUALIFICATION_TEAM: 'Post Qualification ',
  PRE_QUALIFICATION_TEAM: 'Pre Qualification ',
  TENDER_BOARD: 'Tender Board ',
};
export enum TeamTypeEnum {
  EVALUATION_TEAM = 'EVALUATION_TEAM',
  CONTRACT = 'CONTRACT',
  NEGOTIATION_TEAM = 'NEGOTIATION_TEAM',
  INSPECTION_TEAM = 'INSPECTION_TEAM',
  POST_QUALIFICATION_TEAM = 'POST_QUALIFICATION_TEAM',
  PRE_QUALIFICATION_TEAM = 'PRE_QUALIFICATION_TEAM',
  TENDER_BOARD = 'TENDER_BOARD',
}

export enum EntityObjectTypeEnum {
  FRAMEWORK = 'FRAMEWORK',
  PLANNED_TENDER = 'PLANNED_TENDER',
  TENDER = 'TENDER',
  CONTRACT = 'CONTRACT',
  NEGOTIATION = 'NEGOTIATION',
  TENDER_SUB_CATEGORY = 'TENDER_SUB_CATEGORY',
  CALL_OFF_ORDER = 'CALL_OFF_ORDER',

}

export enum MemberPosition {
  CHAIRPERSON = 'CHAIRPERSON',
  SECRETARY = 'SECRETARY',
  MEMBER = 'MEMBER',
}

export interface MemberDtoInput {
  position: MemberPosition;
  replacementReasonUuid: string;
  userUuid: string;
}

export interface NegotiationMemberDtoInput {
  checkNumber?: string;
  departmentId?: number;
  departmentName?: string;
  departmentUuid?: string;
  designation?: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  position: MemberPosition;
  procuringEntityId?: number;
  procuringEntityName: string;
  procuringEntityUuid: string;
  userId: number;
  userUuid: string;
  uuid?: string;
}

export interface ReplacementReason {
  description: string;
  name: string;
  updatedAt: any;
  updatedBy: string;
  uuid: string;
}

export interface AppointmentLetter {
  accountingOfficerTitle: string;
  departmentName: string;
  departmentUuid: string;
  documentUuid: string;
  evaluationDays: number;
  evaluationEndDate: any;
  evaluationStartDate: any;
  folioNumber: string;
  headOfDepartment: string;
  headOfDepartmentUuid: string;
  isAppointmentLetterSigned: boolean;
  letterSignedBy: string;
  nameOfEvaluator: string;
  originAccountingOfficerName: string;
  plannedEvaluationEndDate: any;
  plannedEvaluationStartDate: any;
  plannedNumberOfDays: number;
  position: string;
  procuringEntityName: string;
  procuringEntityUuid: string;
  signedLetterUuid: string;
  signingTime: any;
  tenderDescription: string;
  tenderEvaluationCommittee: Team;
  tenderEvaluationCommitteeInfo: TeamberInfo;
  tenderNumber: string;
  uuid: string;
}

export interface Stage {
  active: boolean;
  completed: boolean;
  completionTime: any;
  currentStage: boolean;
  evaluationStage: any;
  evaluationStageNumber: number;
  isFinancial: boolean;
  isLastStage: boolean;
  member: TeamberInfo;
  enitityUuid: string;
  userUuid: string;
  uuid: string;
}

export interface TeamberInfo {
  active: boolean;
  appointmentLetter: AppointmentLetter;
  appointmentLetterSent: boolean;
  appointmentLetterSigned: boolean;
  attachmentUuid: string;
  checkNumber: string;
  currentStage: Stage;
  deleted: boolean;
  departmentId: number;
  departmentName: string;
  departmentUuid: string;
  description: string;
  designation: string;
  email: string;
  entityId: number;
  entityNumber: string;
  entityType: string;
  entityUuid: string;
  evaluationStartTime: any;
  evaluationStarted: boolean;
  evaluationTeamMemberStage: Stage;
  financialYearCode: string;
  financialYearId: number;
  financialYearUuid: string;
  firstName: string;
  fullName: string;
  hasAppointmentLetter: boolean;
  hasConflict: boolean;
  hasDeclaredConflict: boolean;
  hasSignedReport: boolean;
  isExternal: boolean;
  lastName: string;
  memberInstitution: string;
  middleName: string;
  phoneNumber: string;
  position: MemberPosition;
  procuringEntityId: number;
  procuringEntityName: string;
  replaced: boolean;
  replacedBy: TeamberInfo;
  replacedByHistory: TeamberInfo[];
  reportSigningDate: any;
  signedReportUuid: string;
  teamReplacementReason: ReplacementReason;
  tenderEvaluationCommittee: Team;
  userUuid: string;
  uuid: string;
}

export interface TeamDto {
  entityType?: EntityObjectTypeEnum;
  entityUuid: string;
  teamMemberDtos?: MemberDtoInput[];
  plannedEvaluationEndDate: any;
  plannedEvaluationStartDate: any;
  plannedNumberOfDays: number;
  teamType: TeamTypeEnum;
  uuid?: string;
  submissionUuid?: string;
}
export interface NegotiationTeamDto {
  entityUuid: string;
  memberDto?: NegotiationMemberDtoInput[];
  endDate: any;
  startDate: any;
  plannedNumberOfDays?: number;
  uuid?: string;
  submissionUuid?: string;
}

export enum StageEnum {
  STAGE_FIVE = 'STAGE_FIVE',
  STAGE_FOUR = 'STAGE_FOUR',
  STAGE_ONE = 'STAGE_ONE',
  STAGE_THREE = 'STAGE_THREE',
  STAGE_TWO = 'STAGE_TWO',
}

export interface Workflow {
  actingAsUserInitial: string;
  actingAsUserUid: number;
  actionPerformed: string;
  active: boolean;
  approvalComment: string;
  approvalModelName: string;
  approvalModelUid: string;
  approvedAsHandover: boolean;
  approverFullName: string;
  approverJobTitle: string;
  approverUid: string;
  isSubTask: boolean;
  statusAfterApproval: string;
  userInitial: string;
  uuid: string;
}

export interface WorkflowApproval {
  actingAsUserInitial: string;
  actingAsUserUid: number;
  actionPerformed: string;
  approvalComment: string;
  approvalModelName: string;
  approvalModelUid: string;
  approvedAsHandover: boolean;
  approverFullName: string;
  approverJobTitle: string;
  approverUid: string;
  isSubTask: boolean;
  statusAfterApproval: string;
  taskEndedAt: any;
  tastStartedAt: any;
  userInitial: string;
  createdAt:string;
  updatedAt:string;
  createdBy: string;
  updatedBy: string;
  uuid: string;
}

export interface Team {
  accountingOfficerName: string;
  accountingOfficerTitle: string;
  active: boolean;
  allApponumbermentLettersSigned: boolean;
  apponumbermentLettersSent: boolean;
  approvalLatestDate: any;
  approvalStartDate: any;
  approvalStatus: string;
  approvals: WorkflowApproval[];
  assignedTo: string;
  assignmentParams: string;
  closingDate: any;
  currentEvaluationStage: any;
  deleteTaskAction: string;
  deleted: boolean;
  deletedAt: any;
  deletedBy: string;
  name: string;
  entityNumber: string;
  entityType: string;
  entityUuid: string;
  evaluationMode: any;
  evaluationStage: Stage;
  financialYearUuid: string;
  groupTasksParams: string;
  hasAssignment: boolean;
  hasIndividualGroupTask: boolean;
  isEvaluationClosed: boolean;
  isEvaluationOpen: boolean;
  isReportGenerated: boolean;
  openingDate: any;
  plannedEvaluationEndDate: any;
  plannedEvaluationStartDate: any;
  plannedNumberOfDays: number;
  possibleActions: string;
  procuringEntityUuid: string;
  stageName: string;
  teamType: TeamTypeEnum;
  members: TeamberInfo[];
  tenderEvaluationMode: any;
  tenderUuid: string;
  uuid: string;
}

export interface EntityWithoutTeam {
  entityUuid: string;
  entityName: string;
  entityType: TeamTypeEnum;
}

export interface EntitySummary extends TenderSummary {
  uuid: string;
}

export interface TenderSummary extends PlannedTenderSummary {
  name: string;
  entityNumber: string;
  procurementCategoryName: string;
  selectionMethodName: string;
  sourceOfFundName: string;
  budgetPurpose: string;
  contractType: string;
  estimatedBudget: string;
  procurementMethodName: string;
  procurementMethodCategory: string;
  entitySubCategoryName: string;
  invitationDate: string;
}

export interface PlannedTenderSummary extends FrameworkSummary {
  preQualificationInvitationDate: string;
  prequalificationTenderSubCategoryAcronym: string;
  prequalificationTenderSubCategoryName: string;
}

export interface FrameworkSummary extends ContractSummary { }

export interface ContractSummary { }
