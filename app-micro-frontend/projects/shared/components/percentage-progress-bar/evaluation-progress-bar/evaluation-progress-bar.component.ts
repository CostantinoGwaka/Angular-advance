import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { colors } from 'src/app/shared/colors';
import { CircularProgressBarComponent } from "../../circular-progress-bar/circular-progress-bar.component";
import * as fromActions from "../store/evaluation-progress/evaluation-progress.actions";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";
import { Observable } from "rxjs";
import * as fromSelector from "../store/evaluation-progress/evaluation-progress.selectors";
import { GraphqlService } from "../../../../services/graphql.service";
import { NotificationService } from "../../../../services/notification.service";
import { EvaluationCriteriaStatus, EvaluationProgress } from "../store/evaluation-progress/evaluation-progress.model";
import {
  COMPLETE_MEMBER_SUBMISSION_EVALUATION_STAGE, GET_MEMBER_SUBMISSION_EVALUATION_STAGE_BY_EVALUATION_UUID,
} from "../../../../modules/nest-tender-evaluation/store/evaluation/evaluation.graphql";
import { EvaluationTeamMemberStage } from "../../../../modules/nest-tender-evaluation/store/evaluation/evaluation.model";
import * as fromEvaluationProgressActions from "../store/evaluation-progress/evaluation-progress.actions";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IncompleteCriteriaModalComponent } from "../incomplete-criteria-modal/incomplete-criteria-modal.component";
import { showEvaluationProgressBar } from "../store/evaluation-progress/evaluation-progress.actions";
import { AlertDialogService } from "../../alert-dialog/alert-dialog-service.service";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../../loader/loader.component';
import { MatRippleModule } from '@angular/material/core';

import {ApolloNamespace} from "../../../../apollo.config";


@Component({
  selector: 'app-evaluation-progress-bar',
  templateUrl: './evaluation-progress-bar.component.html',
  styleUrls: ['./evaluation-progress-bar.component.scss'],
  standalone: true,
  imports: [MatRippleModule, CircularProgressBarComponent, LoaderComponent, MatIconModule, MatButtonModule]
})
export class EvaluationProgressBarComponent implements OnInit {
  colors = colors;
  @Input() title: string = 'Evaluation Progress';
  @Input() showProgress: boolean = true;
  @Input() completionProgress: number = 0;
  @Output() evaluationCompleted = new EventEmitter();
  @Output() onClose = new EventEmitter<any>();
  @Input() description: string = 'You can complete stage once your evaluation progress has reached 100%';
  @ViewChild(CircularProgressBarComponent) progressRef: CircularProgressBarComponent;

  summary$: Observable<EvaluationProgress>;
  summary: EvaluationProgress;
  totalScore: number = 0;
  evaluatedScore: number = 0;
  isSaving: boolean = false;
  isLoading: boolean = false;
  completedStatus: boolean = false;
  confirmCompletion: boolean = false;
  incompleteCriteriaList$: Observable<EvaluationCriteriaStatus[]>;
  incompleteCriteriaList: EvaluationCriteriaStatus[] = [];
  evaluationStage: EvaluationTeamMemberStage;

  constructor(
    private notificationService: NotificationService,
    private store: Store<ApplicationState>,
    private dialog: MatDialog,
    private alertDialogService: AlertDialogService,
    private apollo: GraphqlService,
  ) {
    this.store.pipe(select(fromSelector.selectedEvaluationStageUuid)).subscribe(uuid => {
      if (uuid != null) {
        this.store.dispatch(fromActions.getEvaluationProgress({ memberEvaluationStageUuid: uuid }));
      }
    });

    this.incompleteCriteriaList$ = this.store.pipe(select(fromSelector.selectIncompleteCriteriaStatus));
    this.incompleteCriteriaList$.subscribe(criteriaList => {
      this.incompleteCriteriaList = criteriaList;
    });

    this.store.pipe(select(fromSelector.selectedCurrentStage)).subscribe(stage => {
      if (stage) {
        this.evaluationStage = stage;
        if (this.evaluationStage.completed) {
          this.title = 'Evaluation completed';
          this.description = 'You have evaluated successfully';
        }
      }
    });

    this.summary$ = this.store.pipe(select(fromSelector.selectedEvaluationProgress));
    this.summary$.subscribe(summary => {
      this.summary = summary;

      this.totalScore = 0;
      this.evaluatedScore = 0;

      if (summary) {
        this.totalScore = this.totalScore + parseInt('' + summary.totalScore);
        this.evaluatedScore = this.evaluatedScore + parseInt('' + summary.evaluatedScore);
        this.completionProgress = parseInt(
          ((this.evaluatedScore / this.totalScore) * 100).toString()
        );
        this.progressRef?.updateValue(this.completionProgress);
      }
    });
  }

  ngOnInit(): void { }

  async completeStage() {

    try {
      this.isSaving = true;

      const dataToSave = {
        memberSubmissionEvaluationStageUuid: this.evaluationStage.uuid
      };

      const response: any = await this.apollo.mutate({
        mutation: COMPLETE_MEMBER_SUBMISSION_EVALUATION_STAGE,
        apolloNamespace: ApolloNamespace.submission,
        variables: dataToSave
      });

      if (response.data.completeMemberSubmissionEvaluationStage.code === 9000) {
        this.notificationService.successMessage('Evaluation on this stage is completed successfully');
        this.isSaving = true;
        this.confirmCompletion = false;
        this.store.dispatch(
          showEvaluationProgressBar({ showEvaluationProgressBar: false })
        );
        this.evaluationCompleted.emit();
        await this.updateStageStatus();
      } else {
        console.error(response.data.completeMemberSubmissionEvaluationStage);
        this.notificationService.errorMessage('Error while completing evaluation on this stage');
      }
      this.isSaving = false;
    } catch (e) {
      console.error(e);
      this.isSaving = false;
      this.notificationService.errorMessage('Error while completing evaluation on this stage');
    }
  }

  async updateStageStatus() {
    try {
      const response: any = await this.apollo.mutate({
        mutation: GET_MEMBER_SUBMISSION_EVALUATION_STAGE_BY_EVALUATION_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          evaluationUuid: this.evaluationStage.evaluation.uuid
        }
      });

      if (response.data.getMemberSubmissionEvaluationStageByEvaluationUuid.code === 9000) {
        const evaluationTeamMemberStageDetails = response.data.getMemberSubmissionEvaluationStageByEvaluationUuid.data;

        if (evaluationTeamMemberStageDetails) {
          this.store.dispatch(fromEvaluationProgressActions.setSelectedCurrentStage({ selectedCurrentStage: evaluationTeamMemberStageDetails }));
        }

      } else {
        console.error(response.data.getMemberSubmissionEvaluationStageByEvaluationUuid);
      }
    } catch (e) {
      console.error(e);
    }
  }


  showIncompleteCriteria() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = { criteriaList: this.incompleteCriteriaList }
    const dialogRef = this.dialog.open(IncompleteCriteriaModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }


  confirmStageCompletion() {
    this.alertDialogService.openDialog(
      {
        title: 'You are about to complete ' + this.evaluationStage?.evaluationStage?.name?.toLowerCase() + ' stage',
        message: 'Are you sure, you want to continue?'
      }).then(async (action) => {
        if (action) {
          this.completeStage().then();
        }
      })
  }
}
