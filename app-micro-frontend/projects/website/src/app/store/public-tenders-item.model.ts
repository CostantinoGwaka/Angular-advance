export interface PublicTendersTenderItem {
  uuid: string;
  UNSPSC: string;
  procurementCategoryName: string;
  procurementCategoryAcronym: string;
  descriptionOfTheProcurement: string;
  procuringEntityName: string;
  procurementEntityUuid: string;
  tenderNumber: string;
  tenderSubCategoryName: string;
  tenderSubCategoryAcronym: string;
  tenderCalenderDates: PublicTendersTenderCalendarDate[];
}

export interface PublicTendersRequisitionItem {
  uuid: string;
  numberOfLots: number;
  tender: PublicTendersTenderItem;
  tenderClarificationDatEndDate?: any;
  tenderState: string;
  objectActualDateViewEntity: ObjectActualDateViewEntity;
}

export interface PublicEntityItem {
  uuid: string;
  procuringEntityLogoUuid: string;
  numberOfLots: number;
  entityNumber: string;
  descriptionOfTheProcurement: string;
  entityDescription: string;
  entityStatus: string;
  procuringEntityUuid: string;
  procurementCategoryName: string;
  procurementCategoryAcronym: string;
  entitySubCategoryAcronym: string;
  entitySubCategoryName: string;
  entityType: string;
  entityUuid?: string;
  hasAddendum: boolean;
  invitationDate: string;
  mainSubmissionUuid?: string;
  submissionOrOpeningDate: string;
  procuringEntityName: string;
  lotCount?: number;
  currency?: number;
  eligibleTypes?: string;
  contractorClasses?: string;
  contractAmount?: number;
  tzAmount?: number;
  letterDate?: string;
  createdAt?: string;
  tendererName?: string;
  tendererUuid?: string;
  entityCategoryAcronym?: string;
  isWinner?: boolean;
  awardDocumentUuid?: string;
  signedAwardDocumentUuid?: string;
  isAwardDocumentSigned?: boolean;
  isTendererEligible?: boolean
}

export interface ObjectActualDateViewEntity {
  invitationDate?: string;
  submissionOrOpeningDate?: string;
  awardApprovalDate?: string;
  coolOffStartDate?: string;
  coolOffEndDate?: string;
  contractVettingDate?: string;
  awardNotificationDate?: string;
  contractSigningDate?: string;
  contractStartDate?: string;
  preInvitationDate?: string;
  preSubmissionOrOpeningDate?: string;
  preApplicantsNotificationDate?: string;
}

export interface PublicTendersTenderCalendarDate {
  uuid: string;
  actualDate: string;
  plannedDate: string;
  procurementStage: PublicTendersTenderCalendarDateProcurementStage;
}

export interface PublicTendersTenderCalendarDateProcurementStage {
  uuid?: string;
  name?: string;
  procurementStageTypeEnum?: string;
  columnName: CalendarTenderTypeEnum;
}

export enum CalendarTenderTypeEnum {
  AWARD_NOTIFICATION = 'AWARD_NOTIFICATION',
  APPROVAL_OF_AWARD = 'APPROVAL_OF_AWARD',
  COOL_OF_PERIOD_END = 'COOL_OF_PERIOD_END',
  COOL_OF_PERIOD_START = 'COOL_OF_PERIOD_START',
  INVITATION = 'INVITATION',
  PRE_INVITATION = 'PRE_INVITATION',
  PRE_SUBMISSION_OR_OPENING = 'PRE_SUBMISSION_OR_OPENING',
  PRE_APPLICANTS_NOTIFICATION = 'PRE_APPLICANTS_NOTIFICATION',
  SUBMISSION_OR_OPENING = 'SUBMISSION_OR_OPENING',
  SIGNING_OF_CONTRACT = 'SIGNING_OF_CONTRACT',
  START_OF_CONTRACT = 'START_OF_CONTRACT',
  VETTING_OF_CONTRACT = 'VETTING_OF_CONTRACT',
}
