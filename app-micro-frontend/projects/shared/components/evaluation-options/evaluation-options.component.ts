import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
	FormControl,
	Validators,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { fadeIn } from '../../animations/basic-animation';
import { NotificationService } from '../../../services/notification.service';
import { GraphqlService } from '../../../services/graphql.service';
import * as fromGraphql from '../../../modules/nest-tenderer/store/submission/submission.graphql';
import { GET_MEMBER_SUBMISSION_EVALUATION_STAGE_BY_EVALUATION_UUID } from '../../../modules/nest-tender-evaluation/store/evaluation/evaluation.graphql';
import {
	EvaluationScore,
	EvaluationTeamMemberStage,
} from '../../../modules/nest-tender-evaluation/store/evaluation/evaluation.model';
import { SubmissionCriteria } from '../../../modules/nest-tenderer/store/submission/submission.model';
import { DigitOnlyDirective } from '../../directives/digit-only.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmAreaComponent } from '../confirm-area/confirm-area.component';
import { LoaderComponent } from '../loader/loader.component';
import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { GET_EVALUATION_SCORE_FOR_ALL_LOTS_BY_TENDER_EVALUATION_CRITERIA } from '../../../modules/nest-tenderer/store/submission/submission.graphql';
import { AlertDialogService } from '../alert-dialog/alert-dialog-service.service';
import { ApplicationState } from '../../../store';
import { Store } from '@ngrx/store';
import * as fromActions from '../percentage-progress-bar/store/evaluation-progress/evaluation-progress.actions';
import * as fromEvaluationProgressActions from '../percentage-progress-bar/store/evaluation-progress/evaluation-progress.actions';
import { ReplacePipe } from '../../pipes/replace.pipe';

@Component({
	selector: 'app-evaluation-options',
	templateUrl: './evaluation-options.component.html',
	styleUrls: ['./evaluation-options.component.scss'],
	animations: [fadeIn],
	standalone: true,
	imports: [
		LoaderComponent,
		ConfirmAreaComponent,
		NgTemplateOutlet,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
		MatOptionModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		DigitOnlyDirective,
		ReactiveFormsModule,
		ReplacePipe,
		TitleCasePipe,
	],
})
export class EvaluationOptionsComponent implements OnInit {
	@Input() scoreType: string;
	@Input() tenderUuid: string;
	@Input() tendererUuid: string;
	@Input() submissionCriteria: SubmissionCriteria;
	@Input() selectedEvaluationUuid: string;
	@Input() teamMemberUuid: string;
	@Input() submissionCriteriaUuid: string;
	@Input() viewOnly: boolean = false;
	@Output() isEvaluated = new EventEmitter<boolean>();
	memberEvaluationStage: EvaluationTeamMemberStage;
	customMarksControl: FormControl;
	isFinancialEvaluation: boolean = false;
	alreadyEvaluation: boolean = false;
	disableSave: boolean = false;
	showConfirm: boolean = false;
	showExtraDetails: boolean = true;
	loading: boolean = false;
	savingData: boolean = false;
	selectedAction = null;
	selectedPriceAction = null;
	subCriteriaMarksMap: { [id: string]: any } = {};
	customMarks: number;
	justification: string = '';
	pageSize: number = 20;
	pageIndex: number = 0;
	total: number = 0;
	otherScoreUuidList: string[] = [];
	evaluationScore: EvaluationScore = null;
	previousEvaluationScore: EvaluationScore = null;
	apolloNamespace = ApolloNamespace.submission;
	hasError = false;

	constructor(
		private notificationService: NotificationService,
		private alertDialogService: AlertDialogService,
		private store: Store<ApplicationState>,
		private apollo: GraphqlService
	) {}

	ngOnInit(): void {
		if (this.submissionCriteria) {
			this.submissionCriteriaUuid = this.submissionCriteria?.uuid;
		}
		this.customMarksControl = new FormControl('', [
			Validators.max(100),
			Validators.min(0),
		]);

		// getCurrentMemberEvaluationStage
		this.getMemberSubmissionEvaluationStageByEvaluationUuid().then(
			async (_) => {
				// getEvaluationDetails
				await this.getCriteriaEvaluationScoreByMember();
				await this.getEvaluationScoreForAllLotsByTenderEvaluationCriteria();
			}
		);
	}

	checkRange() {
		this.disableSave =
			!this.customMarks || this.customMarks < 0 || this.customMarks > 100;
	}

	async getCriteriaEvaluationScoreByMember() {
		this.loading = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: fromGraphql.GET_CRITERIA_EVALUATION_SCORE_BY_MEMBER,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					teamMemberUuid: this.teamMemberUuid,
					submissionCriteriaUuid: this.submissionCriteriaUuid,
				},
			});
			if (response?.data?.getCriteriaEvaluationScoreByMember?.code === 9000) {
				const values = response?.data?.getCriteriaEvaluationScoreByMember?.data;
				if (values) {
					this.evaluationScore = values;
					this.scoreType = this.evaluationScore.scoreType;
					this.alreadyEvaluation = this.evaluationScore.evaluated;
					if (
						this.evaluationScore.evaluated &&
						this.evaluationScore.isCriteriaScore
					) {
						if (this.evaluationScore.scoreType == 'TRUE_FALSE') {
							this.selectedAction = this.evaluationScore.score == 1;
							this.justification = this.evaluationScore.justification;
						} else {
							this.customMarks = this.evaluationScore.score;
							this.justification = this.evaluationScore.justification;
						}
					} else if (
						this.evaluationScore.evaluated &&
						!this.evaluationScore.isCriteriaScore
					) {
						this.evaluationScore.subEvaluationScores.forEach((item) => {
							this.subCriteriaMarksMap[item.subEvaluationCriteria.uuid] =
								item.score;
						});
					}

					this.isEvaluated.emit(this.alreadyEvaluation);
				}
			} else {
				console.error(response?.data);
			}
			this.loading = false;
		} catch (e) {
			this.loading = false;
			console.error(e);
		}
	}

	async setEvaluationScore(evaluationScoreUuid: string) {
		try {
			this.savingData = true;
			if (!this.justification) {
				this.showConfirm = false;
				return false;
			}

			const evaluationScore =
				this.scoreType == 'TRUE_FALSE'
					? this.selectedAction
						? 1
						: 0
					: this.customMarks;

			let dataToSave: {
				score: number;
				priceReasonability?: string;
				justification: string;
				isCriteriaScore: boolean;
				uuid: string;
			} = {
				isCriteriaScore: true,
				justification: this.justification,
				score: this.isFinancialEvaluation
					? 1
					: parseFloat(evaluationScore.toString()),
				priceReasonability: this.selectedPriceAction,
				uuid: evaluationScoreUuid,
			};

			const response: any = await this.apollo.mutate({
				mutation: fromGraphql.SET_EVALUATION_SCORE,
				apolloNamespace: ApolloNamespace.submission,
				variables: { evaluationScoreDto: dataToSave },
			});

			return response.data.setEvaluationScore.code == 9000;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	// async setEvaluationScore() {
	//   try {
	//     this.savingData = true;
	//     const subScores = [];
	//     let scoreValue = 0;
	//     for (let subCriteriaMarksMapKey in this.subCriteriaMarksMap) {
	//       scoreValue += Number(this.subCriteriaMarksMap[subCriteriaMarksMapKey]);
	//       subScores.push(
	//         {
	//           submissionCriteriaUuid: subCriteriaMarksMapKey,
	//           isCriteriaScore: false,
	//           justification: "",
	//           score: Number(this.subCriteriaMarksMap[subCriteriaMarksMapKey]),
	//         }
	//       )
	//     }
	//
	//     let dataToSave: {
	//       score: number;
	//       subScores: any[];
	//       submissionCriteriaUuid: string;
	//       justification: string;
	//       isCriteriaScore: boolean;
	//       uuid: string
	//     } = {
	//       submissionCriteriaUuid: this.submissionCriteriaUuid,
	//       isCriteriaScore: false,
	//       justification: "",
	//       subScores: subScores,
	//       score: scoreValue,
	//       uuid: null
	//     };
	//
	//     /// check add uuid to update
	//     if (this.evaluationScore) {
	//       dataToSave = {
	//         ...dataToSave,
	//         uuid: this.evaluationScore.uuid
	//       }
	//     }
	//
	//     const response: any = await this.apollo.mutate(
	//       {
	//         mutation: fromGraphql.SET_EVALUATION_SCORE,
	//         apolloNamespace: ApolloNamespace.submission,
	//         variables: { evaluationScoreDto: dataToSave }
	//       }
	//     );
	//
	//     if (response.data.setEvaluationScore.code == 9000) {
	//       this.notificationService.successMessage('Criteria is evaluated successfully');
	//       this.showConfirm = false
	//       this.alreadyEvaluation = true;
	//       // getEvaluationDetails
	//       await this.getCriteriaEvaluationScoreByMember();
	//
	//     } else {
	//       console.error(response.data);
	//       this.notificationService.errorMessage('Criteria evaluation is not saved successfully');
	//       this.alreadyEvaluation = false;
	//     }
	//     this.savingData = false;
	//   } catch (e) {
	//     this.savingData = false;
	//     console.error(e);
	//     this.notificationService.errorMessage('Criteria evaluation is not saved successfully');
	//   }
	// }

	async getMemberSubmissionEvaluationStageByEvaluationUuid() {
		try {
			this.loading = true;
			const response: any = await this.apollo.mutate({
				mutation: GET_MEMBER_SUBMISSION_EVALUATION_STAGE_BY_EVALUATION_UUID,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					evaluationUuid: this.selectedEvaluationUuid,
				},
			});

			if (
				response.data.getMemberSubmissionEvaluationStageByEvaluationUuid
					.code === 9000
			) {
				this.memberEvaluationStage =
					response.data.getMemberSubmissionEvaluationStageByEvaluationUuid.data;
				this.isFinancialEvaluation =
					this.memberEvaluationStage?.evaluationStage?.isFinancial;

				if (this.isFinancialEvaluation) {
					this.selectedAction = true;
					this.customMarks = 1;
				}
			} else {
				console.error(
					response.data.getMemberSubmissionEvaluationStageByEvaluationUuid
				);
				this.loading = false;
			}
		} catch (e) {
			console.error(e);
			this.loading = false;
		}
	}

	updateEvaluationProgress() {
		this.store.dispatch(
			fromActions.getEvaluationProgress({
				memberEvaluationStageUuid: this.memberEvaluationStage.uuid,
			})
		);

		if (this.memberEvaluationStage) {
			this.store.dispatch(
				fromEvaluationProgressActions.setSelectedCurrentStage({
					selectedCurrentStage: this.memberEvaluationStage,
				})
			);
		}
	}

	setMarks(mark: number) {
		this.customMarks = mark;
		this.showConfirm = true;
	}

	async submitEvaluationResponse(event: boolean) {
		if (
			event &&
			this.evaluationScore.submissionCriteria.sameForAllLots &&
			this.evaluationScore.submissionCriteria.hasLot &&
			this.otherScoreUuidList.length
		) {
			this.confirmLotCopy();
		} else {
			const status = await this.setEvaluationScore(this.evaluationScore.uuid);
			await this.handleSaveResponse(status);
		}
	}

	confirmLotCopy() {
		this.alertDialogService
			.openDialog({
				title:
					'You are about to evaluate this criteria. Do you want to continue?.' +
					'Also this information will be applied to other lot evaluation',
				message: 'Are you sure, you want to continue?',
			})
			.then(async (action: boolean) => {
				if (action) {
					this.savingData = true;
					for (const uuid of this.otherScoreUuidList) {
						const status = await this.setEvaluationScore(uuid);
						if (!status) {
							this.notificationService.errorMessage(
								'Problem occurred while saving' +
									'Criteria evaluation is not saved, Please try again.'
							);
							this.savingData = false;
							return;
						}
					}
					await this.handleSaveResponse(true);
					this.savingData = false;
				}
			});
	}

	async handleSaveResponse(
		status: boolean,
		message: string = 'Criteria evaluation is not saved successfully, Please try again'
	) {
		if (status) {
			this.notificationService.successMessage(
				'Criteria is evaluated successfully'
			);
			this.showConfirm = false;
			this.alreadyEvaluation = true;

			// getEvaluationDetails
			this.savingData = false;
			await this.getCriteriaEvaluationScoreByMember();
			this.updateEvaluationProgress();
		} else {
			this.notificationService.errorMessage(message);
			this.alreadyEvaluation = false;
		}
		this.savingData = false;
	}

	async getEvaluationScoreForAllLotsByTenderEvaluationCriteria() {
		try {
			this.loading = true;
			this.hasError = false;
			const response: any = await this.apollo.fetchData({
				query: GET_EVALUATION_SCORE_FOR_ALL_LOTS_BY_TENDER_EVALUATION_CRITERIA,
				apolloNamespace: this.apolloNamespace,
				variables: {
					scoreUuid: this.evaluationScore.uuid,
					input: {
						fields: [],
						mustHaveFilters: [],
						page: this.pageIndex,
						pageSize: this.pageSize,
					},
				},
			});

			const paginationResult =
				response.data.getEvaluationScoreForAllLotsByTenderEvaluationCriteria;
			const uuidList = (paginationResult.rows || []).map(
				(score: EvaluationScore) => score.uuid
			);
			this.otherScoreUuidList = [...this.otherScoreUuidList, ...uuidList];
			this.pageSize = paginationResult.pageSize;
			this.pageIndex = paginationResult.currentPage;
			this.total = paginationResult.totalRecords;

			if (paginationResult.hasNext) {
				this.pageIndex = this.pageIndex + 1;
				await this.getEvaluationScoreForAllLotsByTenderEvaluationCriteria();
			} else {
				this.loading = false;
			}
		} catch (e) {
			console.error(e);
			this.hasError = true;
			this.loading = false;
		}
	}
}
