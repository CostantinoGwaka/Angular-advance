import { Injectable } from '@angular/core';
import {
	WorkflowUsersListComponent,
	WorkflowUsersListData,
} from '../../shared/components/work-flow-main/workflow-users-list/workflow-users-list.component';
import { MatDialog } from '@angular/material/dialog';

export interface WorkflowPossibleAction {
	action: string;
	actionTextPast: string;
	color: string;
}
@Injectable({
	providedIn: 'root',
})
export class WorkflowPossibleActionsService {
	possibleActions: WorkflowPossibleAction[] = [
		{
			action: 'REVIEW',
			actionTextPast: 'Reviewed',
			color: '#348433',
		},
		{
			action: 'ENDORSE',
			actionTextPast: 'Endorsed',
			color: '#21a43f',
		},
		{
			action: 'RESUME',
			actionTextPast: 'Resumed',
			color: '#348433',
		},
		{
			action: 'OPPOSE',
			actionTextPast: 'Opposed',
			color: '#f86e64',
		},
		{
			action: 'REJECT',
			actionTextPast: 'Rejected',
			color: '#ff0000',
		},
		{
			action: 'APPROVE',
			actionTextPast: 'Approved',
			color: '#21a43f',
		},
		{
			action: 'CANCEL',
			actionTextPast: 'Cancelled',
			color: '#ff0000',
		},
		{
			action: 'TERMINATE',
			actionTextPast: 'Terminated',
			color: '#ff0000',
		},
		{
			action: 'SUBMIT',
			actionTextPast: 'Submitted',
			color: '#104e10',
		},
		{
			action: 'RETURN',
			actionTextPast: 'Returned',
			color: '#f86e64',
		},
		{
			action: 'REQUEST AG VETTING',
			actionTextPast: 'Requested AG Vetting',
			color: '#348433',
		},
		{
			action: 'ASSIGN',
			actionTextPast: 'Assigned',
			color: '#348433',
		},
		{
			action: 'FORWARD',
			actionTextPast: 'Forwarded',
			color: '#348433',
		},
		{
			action: 'CEASE',
			actionTextPast: 'Ceased',
			color: '#348433',
		},
		{
			action: 'CONSENT',
			actionTextPast: 'Consented',
			color: '#f86e64',
		},
		{
			action: 'MODIFY',
			actionTextPast: 'Modified',
			color: '#348433',
		},
		{
			action: 'MODIFY AND ENDORSE',
			actionTextPast: 'Modified and Endorsed',
			color: '#348433',
		},
		{
			action: 'MODIFY AND SUBMIT FOR REVIEW',
			actionTextPast: 'Modified and Submitted for Review',
			color: '#348433',
		},
		{
			action: 'MODIFY AND SUBMIT FOR APPROVAL',
			actionTextPast: 'Modified and Submitted for Approval',
			color: '#348433',
		},
		{
			action: 'CLARIFY',
			actionTextPast: 'Clarified',
			color: '#348433',
		},
		{
			action: 'SIGN',
			actionTextPast: 'Signed',
			color: '#348433',
		},
		{
			action: 'APPROVE VETTING',
			actionTextPast: 'VETTING APPROVED',
			color: '#348433',
		},
		{
			action: 'APPROVE SA VETTING',
			actionTextPast: 'APPROVED SA VETTING',
			color: '#348433',
		},
		{
			action: 'APPROVE DAG VETTING',
			actionTextPast: 'APPROVED DAG VETTING',
			color: '#348433',
		},
		{
			action: 'APPROVE DCT VETTING',
			actionTextPast: 'APPROVED DCT VETTING',
			color: '#348433',
		},
		{
			action: 'APPROVE WITHOUT AG VETTING REQUEST',
			actionTextPast: 'APPROVED WITHOUT AG VETTING REQUEST',
			color: '#348433',
		},
		{
			action: 'ASSIGN FOR MODIFICATION',
			actionTextPast: 'ASSIGNED FOR MODIFICATION',
			color: '#348433',
		},
		{
			action: 'SUBMIT FOR AG VETTING REQUEST',
			actionTextPast: 'SUBMITTED FOR AG VETTING REQUEST',
			color: '#348433',
		},
		{
			action: 'MODIFY AND SUBMIT FOR AG VETTING REQUEST',
			actionTextPast: 'MODIFIED AND SUBMITTED FOR AG VETTING REQUEST',
			color: '#348433',
		},
		{
			action: 'ASSIGN FOR INTERNAL VETTING',
			actionTextPast: 'ASSIGNED FOR INTERNAL VETTING',
			color: '#348433',
		},
		{
			action: 'RESUME',
			actionTextPast: 'RESUMED',
			color: '#348433',
		},
		{
			action: 'RESUBMIT TO AG',
			actionTextPast: 'RESUBMITTED TO AG',
			color: '#348433',
		},
		{
			action: 'APPROVE AND SUBMIT FOR VETTING',
			actionTextPast: 'APPROVED AND SUBMITTED FOR VETTING',
			color: '#21a43f',
		},
		{
			action: 'ASSIGN LEGAL OFFICER',
			actionTextPast: 'Legal Officer Assigned',
			color: '#348433',
		},
		{
			action: 'VET',
			actionTextPast: 'VETTED',
			color: '#348433',
		},
		{
			action: 'VET CONTRACT',
			actionTextPast: 'VETTED CONTRACT',
			color: '#348433',
		},
		{
			action: 'RETURN TO DLS FOR INTERNAL VETTING REVIEW',
			actionTextPast: 'Returned to DLS for Internal Vetting Review',
			color: '#f86e64',
		},
		{
			action: 'RETURN TO DLS FOR AG VETTING REVIEW',
			actionTextPast: 'Returned to DLS for AG Vetting Review',
			color: '#f86e64',
		},
		{
			action: 'RETURN TO DAG',
			actionTextPast: 'Returned to DAG',
			color: '#f86e64',
		},
		{
			action: 'RETURN TO SA',
			actionTextPast: 'Returned to State Attorney',
			color: '#f86e64',
		},
		{
			action: 'FINISH AND SEND ADVICE TO PE',
			actionTextPast:
				'Submitted Advice to PE without waiting for Implementation',
			color: '#104e10',
		},
		{
			action: 'SEND ADVICE TO PE AND WAIT FOR IMPLEMENTATION',
			actionTextPast: 'Sent Advice to PE and Waiting for Implementation',
			color: '#104e10',
		},
		{
			action: 'SUBMIT MODIFICATIONS FOR REVIEW',
			actionTextPast: 'Submitted Modifications for Review',
			color: '#104e10',
		},
		{
			action: 'RETURN TO DLS',
			actionTextPast: 'Returned to DLS',
			color: '#f86e64',
		},
		{
			action: 'RETURN TO DCT',
			actionTextPast: 'Returned to DCT',
			color: '#f86e64',
		},
		{
			action: 'RETURN TO ADLS',
			actionTextPast: 'Returned to ADLS',
			color: '#f86e64',
		},
		{
			action: 'RETURN TO DAG',
			actionTextPast: 'Returned to DAG',
			color: '#f86e64',
		},
		{
			action: 'RETURN TO TENDERER',
			actionTextPast: 'Returned to Tenderer',
			color: '#f86e64',
		},
		{
			action: 'SET SIGNATORIES',
			actionTextPast: 'Signatories Set',
			color: '#104e10',
		},
		{
			action: 'SUBMIT PRECONDITIONS',
			actionTextPast: 'Preconditions Submitted',
			color: '#104e10',
		},
		{
			action: 'SIGN CONTRACT',
			actionTextPast: 'Contract Signed',
			color: '#104e10',
		},
		{
			action: 'APPOINT NEW WITNESS',
			actionTextPast: 'New Witness Appointed',
			color: '#104e10',
		},
		{
			action: 'REQUEST WITNESS CHANGE',
			actionTextPast: 'Witness Change Requested',
			color: '#f86e64',
		},
		{
			action: 'REJECT CONTRACT',
			actionTextPast: 'Contract Rejected',
			color: '#f86e64',
		},
		{
			action: 'APPROVE MANUAL AG VETTING',
			actionTextPast: 'Approved Manual AG Vetting',
			color: '#104e10',
		},
	];

	constructor(private dialog: MatDialog) {}

	getActionTextPast(action: string): string {
		return (
			this.possibleActions?.find((obj) => obj.action === action)
				?.actionTextPast ||
			(action + 'ed').toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
				return a.toUpperCase();
			})
		);
	}

	getActionColor(action: string): string {
		return (
			this.possibleActions?.find((obj) => obj.action === action)?.color ||
			'#3b4049'
		);
	}

	getActionText(action: string): WorkflowPossibleAction {
		return this.possibleActions?.find((obj) => obj.action === action);
	}

	showTaskUsersList(data: WorkflowUsersListData) {
		this.dialog.open(WorkflowUsersListComponent, {
			data: data,
			width: '600px',
		});
	}
}
