export interface ClarificationNotification {
  id?: string;
  createdAt: string;
  createdBy: string;
  question?: string;
  title: string;
  tenderUuid?: string;
  procurementRequisitionUuid?: string;
  clarificationResponses: any[]
}
