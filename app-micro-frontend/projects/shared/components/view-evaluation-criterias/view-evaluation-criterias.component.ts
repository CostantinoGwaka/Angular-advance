import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { EntityObjectTypeEnum, Tender } from 'src/app/modules/nest-app/store/tender/tender.model';
import { ObjectForEntityDetail } from 'src/app/modules/nest-app/store/tender/tender.model';
import { CriteriaDetailsFormComponent } from '../../../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/criteria-details-form/criteria-details-form.component';
import { UpperCasePipe } from '@angular/common';
import { MatButton } from "@angular/material/button";
import {
  CANCEL_INTENTION,
  INITIALIZE_INTENTION
} from "../../../modules/nest-tender-award/store/pending-tender-award/pending-tender-awards.graphql";
import {
  REFRESH_TENDER_EVALUATION_CRITERIA
} from "../../../modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criterial.graphql";
import { GraphqlService } from "../../../services/graphql.service";
import { NotificationService } from "../../../services/notification.service";
import { LayoutService } from "../../../services/layout.service";
import { LoaderComponent } from "../loader/loader.component";
import { json } from "express";

@Component({
  selector: 'app-view-evaluation-criterias',
  templateUrl: './view-evaluation-criterias.component.html',
  styleUrls: ['./view-evaluation-criterias.component.scss'],
  standalone: true,
  imports: [
    CriteriaDetailsFormComponent,
    UpperCasePipe,
    MatButton,
    LoaderComponent,
  ],
})
export class ViewEvaluationCriteriasComponent implements OnInit {
  @Input() evaluationCriterias: any;
  @Input() isFromPpraAdmin?: boolean = false;
  @Input() objectForEntityDetail: ObjectForEntityDetail;

  loadingStates = new Map<string, { isLoading: boolean, message: string }>();
  docLoadingMessage: string = '';

  constructor(
    private graphqlService: GraphqlService,
    private notificationService: NotificationService,
  ) { }
  ngOnInit(): void {
    //
  }

  getLoadingMessage(uuid: string): string | null {
    const state = this.loadingStates.get(uuid);
    return state && state.isLoading ? state.message : null;
  }

  isLoading(uuid: string): boolean {
    const state = this.loadingStates.get(uuid);
    return state ? state.isLoading : false;
  }


  async refreshTenderEvaluationCriteria(tenderEvaluationCriteriaUuid: string, criteriaName: string): Promise<void> {
    this.loadingStates.set(tenderEvaluationCriteriaUuid, { isLoading: true, message: `Refresh ${criteriaName} Criteria` });
    const res = await this.graphqlService.mutate({
      mutation: REFRESH_TENDER_EVALUATION_CRITERIA,
      apolloNamespace: ApolloNamespace.submission,
      variables: {
        tenderEvaluationCriteriaUuid: tenderEvaluationCriteriaUuid,
      },
    });
    if (res?.data?.refreshTenderEvaluationCriteria?.code == 9000) {
      this.notificationService.successMessage(
        res?.data?.refreshTenderEvaluationCriteria?.message
      );
    } else {
      this.notificationService.errorMessage(
        res?.data?.refreshTenderEvaluationCriteria?.message
      );
    }
    this.loadingStates.set(tenderEvaluationCriteriaUuid, { isLoading: false, message: '' });
  }

}
