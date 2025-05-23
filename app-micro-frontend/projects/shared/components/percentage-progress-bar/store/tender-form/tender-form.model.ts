import { BaseModel } from "../../../../../store/global-interfaces/organizationHiarachy";

export interface TenderFormModel extends BaseModel {
  bidAmountInFigures: number,
  deadlineForTenderSubmissionDate: string,
  deadlineForTenderSubmissionTime: string,
  discountMethodologyOffered: string,
  discountsOffered: string,
  peAddress: string,
  peName: string,
  tenderCurrency: string,
  formListTenderSubmissionForm?: any[],
  tenderDescription: string,
  tenderLotAmountInWords: string,
  tenderNumber: string,
  tenderSubmissionDate: string,
  tendererAddress: string,
  tendererAuthorizedLegalRepresentativeCapacity: string,
  tendererAuthorizedRepresentative: string,
  tendererAuthorizedRepresentativeSignature: string,
  entityUuid: string,
  entityType: string,
  tendererName: string,
  tendererNumber: string,
  procuringEntityUuid: string,
}
