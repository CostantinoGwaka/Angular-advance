export interface CustomWorkflowApproval {
  id: number;
  approvalStatus: string;
  approveFullName: string;
  email: string;
  approvalComment: string;
  createdAt: string;
  // custom
  color?: string;
}
