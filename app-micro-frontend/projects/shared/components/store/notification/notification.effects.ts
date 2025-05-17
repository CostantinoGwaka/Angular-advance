import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from './notification.actions';
import { map, mergeMap } from 'rxjs/operators';
import * as fromGraphql from './notification.graphql';
import { Router } from '@angular/router';
import { GraphqlService } from '../../../../services/graphql.service';
import { Store } from '@ngrx/store';
import * as fromState from '../../../../modules/nest-app/store/nest-app.reducer';
import { NotificationService } from '../../../../services/notification.service';
import { Notification } from './notification.model';
import { GET_ENDORSED_TENDERS_REQ_NOT_MERGED_ASSIGNED } from '../../../../modules/nest-app/store/tender/tender.graphql';
import { AuthService } from '../../../../services/auth.service';

@Injectable()
export class NotificationEffects {
	constructor(
		private actions$: Actions,
		private router: Router,
		private apollo: GraphqlService,
		private authService: AuthService,
		private store: Store<fromState.State>,
		private notificationService: NotificationService,
	) {}

	formatModel(model: string) {
		switch (model) {
			case 'Tender':
				return 'APP';
			case 'AnnualProcurementPlan':
				return 'APP';
			case 'ProcurementRequisition':
				return 'Requisition(s)';
			case 'MergedMainProcurementRequisition':
				return 'Tender';
			case 'TenderCancellationRequest':
				return 'Tender Cancellation Request(s)';
			case 'TenderReAdvertisementRequest':
				return 'Tender Re-advertisement Request(s)';
			case 'TenderWithdrawRequest':
				return 'Tender Termination Request(s)';
			case 'TenderRejectionRequest':
				return 'Tender Rejection Request(s)';
			case 'EvaluationReport':
				return 'Evaluation Report(s)';
			case 'NegotiationReport':
				return 'Negotiation Report(s)';
			case 'PreQualification':
				return 'Pre Qualification(s)';
			case 'PublishedEntityAddendum':
				return 'Published Tender Modification(s)';
			case 'Framework':
				return 'Framework Lot(s)';
			case 'TenderBoard':
				return 'Tender Board(s)';
			case 'SuccessFulBidderChangeRequest':
				return 'Bidder Change Request(s)';
			case 'AssignedEndorsedRequisition':
				return 'Assigned Endorsed Requisition(s)';
			case 'GovernmentServiceRequisition':
				return 'Government Service Requisition(s)';
			case 'FrameworkMain':
				return 'Framework(s)';
			case 'MicroProcurement':
				return 'Micro Procurement(s)';
			case 'NegotiationPlan':
				return 'Negotiaton Plan(s)';
			case 'NegotiationMinute':
				return 'Negotiaton Minutes(s)';
			case 'RejectedAward':
				return 'Rejected Award(s)';
			case 'MicroProcurementRetirement':
				return 'Micro procurement retirement(s)';
			case 'PrequalificationReAdvertisementRequest':
				return 'Pre Qualification re advertisement request(s)';
			default:
				return model;
		}
	}

	getUrl(model: string) {
		switch (model) {
			case 'AnnualProcurementPlan':
				return 'modules/app-management/my-task';
			case 'Tender':
				return 'modules/app-management/my-task';
			case 'ProcurementRequisition':
				return 'modules/tender-initiation/requisition-tasks';
			case 'MergedMainProcurementRequisition':
				return 'modules/tender-initiation/my-req-tasks';
			case 'TenderCancellationRequest':
				return 'modules/tender-initiation/tender-cancellation-req-tasks';
			case 'TenderReAdvertisementRequest':
				return 'modules/tender-initiation/tender-re-advertisement-tasks';
			case 'Clarification':
				return 'modules/tender-initiation/clarification-tasks';
			case 'TenderEvaluationCommittee':
				return 'modules/evaluation/team-task';
			case 'PostQualificationTeam':
				return 'modules/post-qualification/team-task';
			case 'PreQualificationTeam':
				return 'modules/pre-qualification/team-task';
			case 'NegotiationTeam':
				return 'modules/negotiation/team-task';
			case 'TenderWithdrawRequest':
				return 'modules/tender-initiation/tender-termination-requests-tasks';
			case 'TenderRejectionRequest':
				return 'modules/tender-initiation/tender-rejection-requests-tasks';
			case 'EvaluationReport':
				return 'modules/tender-evaluation/evaluation-reports-tasks';
			case 'NegotiationReport':
				return 'modules/negotiation/negotiation-report-tasks';
			case 'PreQualification':
				return 'modules/pre-qualification/pre-qualification-tasks';
			case 'TenderBoard':
				return 'modules/tender-board/tasks';
			case 'PublishedEntityAddendum':
				return 'modules/tender-initiation/tender-modification-req-tasks';
			case 'FrameworkMain':
				return 'modules/framework-agreement/tasks';
			case 'Framework':
				return 'modules/framework-agreement/tasks';
			case 'AssignedEndorsedRequisition':
				return 'modules/tender-initiation/approved-requisitions';
			case 'GovernmentServiceRequisition':
				return 'modules/government-supplier/pe-order-task';
			case 'NegotiationPlan':
				return 'modules/negotiation/negotiation-plan-tasks';
			case 'NegotiationMinute':
				return 'modules/negotiation/negotiation-task';
			case 'MicroProcurementRetirement':
				return 'modules/micro-value-procurement/retirement/task-retirement';
			case 'PrequalificationReAdvertisementRequest':
				return 'modules/pre-qualification/pre-qualification-re-advertisement-tasks';
			case 'SuccessFulBidderChangeRequest':
				return 'modules/tender-award/modification-requests/my-tasks';
			case 'RejectedAward':
				return 'modules/tender-award/award-cancellation-requests/request/TENDER';
			default:
				return '';
		}
	}

	getMyTaskSummary$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(fromActions.getNotifications),
				mergeMap((action) => {
					return this.apollo
						.fetchDataObservable({
							query: fromGraphql.GET_USER_TASK_SUMMARY,
							apolloNamespace: ApolloNamespace.app,
						})
						.pipe(
							this.notificationService.catchError(
								'Problem occurred while listing my task',
							),
							map(({ data }: any) => {
								if (data) {
									let result: Notification[] = (
										data?.getMyTasksSummary || []
									).map((task: any) => {
										return {
											id: Math.random().toString(),
											count: task.idadi,
											model: this.formatModel(task.model),
											url: this.getUrl(task.model),
										};
									});
									//
									this.store.dispatch(
										fromActions.addNotifications({
											notifications: result || [],
										}),
									);
								} else {
									this.notificationService.errorMessage(
										'Failed to fetch records',
									);
								}
							}),
						);
				}),
			),
		{ dispatch: false },
	);

	getAssignedRequisitionTaskSummary$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(fromActions.getNotifications),
				mergeMap((action) => {
					return this.apollo
						.fetchDataObservable({
							query: GET_ENDORSED_TENDERS_REQ_NOT_MERGED_ASSIGNED,
							apolloNamespace: ApolloNamespace.app,
						})
						.pipe(
							map(({ data }: any) => {
								if (data) {
									let result: any[] =
										data?.getEndorsedAssignedTendersReqNotMerged || [];
									if (result.length) {
										const notification: Notification = {
											id: Math.random().toString(),
											count: result.length.toString(),
											model: this.formatModel('AssignedEndorsedRequisition'),
											url: this.getUrl('AssignedEndorsedRequisition'),
										};
										this.store.dispatch(
											fromActions.addNotifications({
												notifications: [notification],
											}),
										);
									}
								}
							}),
						);
				}),
			),
		{ dispatch: false },
	);

	getMyClarificationTaskSummary$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(fromActions.getNotifications),
				mergeMap((action) => {
					return this.apollo
						.fetchDataObservable({
							query: fromGraphql.GET_WORKFLOW_TASK_SUMMARY,
							apolloNamespace: ApolloNamespace.submission,
						})
						.pipe(
							this.notificationService.catchError(
								'Problem occurred while listing my task',
							),
							map(({ data }: any) => {
								if (data) {
									let result: Notification[] = (
										data?.getMyClarificationTasksSummary || []
									).map((task: any) => {
										return {
											id: Math.random().toString(),
											count: task.idadi,
											model: this.formatModel(task.model),
											url: this.getUrl(task.model),
										};
									});
									//
									this.store.dispatch(
										fromActions.addNotifications({
											notifications: result || [],
										}),
									);
								} else {
									this.notificationService.errorMessage(
										'Failed to fetch records',
									);
								}
							}),
						);
				}),
			),
		{ dispatch: false },
	);
}
