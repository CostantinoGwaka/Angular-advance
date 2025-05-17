import { map, firstValueFrom } from 'rxjs';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FormControl, Validators, FormsModule } from "@angular/forms";
import { fadeIn } from "../../animations/basic-animation";
import { NotificationService } from "../../../services/notification.service";
import { GraphqlService } from "../../../services/graphql.service";
import * as fromGraphql from "../../../modules/nest-tenderer/store/submission/submission.graphql";
import { Store, select } from "@ngrx/store";
import * as fromActions from "../percentage-progress-bar/store/evaluation-progress/evaluation-progress.actions";
import { ApplicationState } from "../../../store";
import { GET_MEMBER_SUBMISSION_EVALUATION_STAGE_BY_EVALUATION_UUID } from "../../../modules/nest-tender-evaluation/store/evaluation/evaluation.graphql";
import * as fromEvaluationProgressActions
  from "../percentage-progress-bar/store/evaluation-progress/evaluation-progress.actions";
import { EvaluationTeamMemberStage } from "../../../modules/nest-tender-evaluation/store/evaluation/evaluation.model";
import { CHECK_EVALUATION_STATUS, COMPLETE_AUTO_EVALUATION, GET_RESULT_BY_UUID_EVALUATION, SAVE_EVALUATION_SCORE } from 'src/app/modules/nest-tender-evaluation/store/framework-evaluation/framework-evaluation.graphql';
import { selectAllAuthUsers } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmAreaComponent } from '../confirm-area/confirm-area.component';
import { LoaderComponent } from '../loader/loader.component';



@Component({
  selector: 'app-evaluation-cuis',
  templateUrl: './evaluation-cuis.component.html',
  styleUrls: ['./evaluation-cuis.component.scss'],
  standalone: true,
  imports: [LoaderComponent, ConfirmAreaComponent, MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class EvaluationCuisComponent implements OnInit {

  @Input() scoreType: string;
  @Input() tenderUuid: string;
  @Input() tendererUuid: string;
  @Input() submissionCriteria;
  @Input() selectedEvaluationUuid: string;
  @Input() teamMemberUuid: string;
  @Input() submissionUuid: string;
  @Input() submissionCriteriaUuid: string;
  @Input() viewOnly: boolean = false;
  @Input() selectedWinner: boolean = false;
  @Output() emitStatusCheck = new EventEmitter();

  memberEvaluationStage: EvaluationTeamMemberStage;
  customMarksControl: FormControl;
  isFinancialEvaluation: boolean = false;
  alreadyEvaluation: boolean = false;
  disableSave: boolean = false;
  showConfirm: boolean = false;
  showExtraDetails: boolean = false;
  loading: boolean = false;
  savingData: boolean = false;
  selectedAction = null;
  subCriteriaMarksMap: { [id: string]: any } = {};
  customMarks: number;
  justification: string = '';
  evaluationScore = null;
  makeProcess: boolean = false;
  getResult: boolean = false;
  saveDataCriteria: any;
  statusCheck: any;

  constructor(
    private notificationService: NotificationService,
    private store: Store<ApplicationState>,
    private apollo: GraphqlService,
  ) { }

  ngOnInit(): void {
    this.getSavedData();
    this.checkStatus();
  }

  async saveCriteriaMarks() {
    const user = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), map(i => i[0])));

    this.makeProcess = true;
    try {
      const response = await this.apollo.mutate({
        mutation: SAVE_EVALUATION_SCORE,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          autoEvaluationScoreRequestDto: {
            comply: this.selectedAction,
            justification: this.justification,
            procuringEntityId: user.procuringEntity?.id,
            procuringEntityUuid: user.procuringEntity?.uuid,
            submissionCriteriaUuid: this.submissionCriteria.uuid,
            submissionUuid: this.submissionUuid,
            uuid: null,
          },
        },
      });
      if (response.data.createEvaluationScore.code == 9005) {
        this.notificationService.errorMessage('Failed to process complete evaluation of this tender');
        this.makeProcess = false;
      } else {
        this.notificationService.successMessage('Evaluation Saved Successfully');
        this.loading = false;
        this.makeProcess = false;
        this.showConfirm = false;
        this.justification = null;
        this.getSavedData();
      }
    } catch (e) {

    }
  }

  updateCriteria() {
    this.saveDataCriteria = null;
  }

  async getSavedData() {
    this.getResult = true;
    this.saveDataCriteria = null;
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_RESULT_BY_UUID_EVALUATION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionCriteriaUuid: this.submissionCriteria.uuid,
          submissionUuid: this.submissionUuid
        },
      });
      const values: any = response.data.getAutoEvaluationScoreByUuid;
      if (values) {
        this.saveDataCriteria = values.data;
        this.checkStatus();
      }
    }

    catch (e) { }
    this.getResult = false;
  }

  async checkStatus() {
    this.getResult = true;
    this.statusCheck = null;
    try {
      const response: any = await this.apollo.fetchData({
        query: CHECK_EVALUATION_STATUS,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionUuid: this.submissionUuid
        },
      });
      const values: any = response.data.checkEvaluationStatus;
      if (values) {
        this.statusCheck = values.data;
        this.emitStatusCheck.emit(this.statusCheck);
      }
    }
    catch (e) { }
    this.getResult = false;
  }

}
