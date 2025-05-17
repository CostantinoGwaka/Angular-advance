import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { CustomAlertBoxModel } from '../custom-alert-box/custom-alert-box.model';
import { EvaluationCriteria } from '../../../modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criteria.model';
import { ObjectForEntityDetail } from '../../../modules/nest-app/store/tender/tender.model';
import { EventDetail } from '../../../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/criteria-field.model';
import { TenderSubCategory } from 'src/app/modules/nest-tenderer-management/store/tender-sub-category/tender-sub-category.model';
import { CustomAlertBoxComponent } from '../custom-alert-box/custom-alert-box.component';
import { CriteriaDetailsFormComponent } from '../../../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/criteria-details-form/criteria-details-form.component';


@Component({
  selector: 'app-pe-requirement-list',
  templateUrl: 'pe-requirement-list.component.html',
  styleUrls: ['pe-requirement-list.component.scss'],
  standalone: true,
  imports: [
    CriteriaDetailsFormComponent,
    CustomAlertBoxComponent
],
})
export class PeRequirementListComponent implements OnInit {
  @Input() criteria: EvaluationCriteria;
  @Input() objectForEntityDetail: ObjectForEntityDetail;
  @Input() selectedCriteriaForm: string;
  @Input() isFirstCriteria: boolean;
  @Input() isLastCriteria: boolean;
  @Input() isCurrentIndex: boolean;
  @Input() tenderSubCategory: TenderSubCategory;
  @Input() useDefaultCriteria = false;


  @Output()
  stepperAction: EventEmitter<any> = new EventEmitter();

  @Output() hasDataSet: EventEmitter<boolean> = new EventEmitter();

  @Output()
  onContinueAction: EventEmitter<any> = new EventEmitter();

  @Output()
  setIsLoading: EventEmitter<{ key: string; status: boolean }> =
    new EventEmitter();

  @Output()
  setFilledData: EventEmitter<{ code: string; event: any }> =
    new EventEmitter();

  @Output()
  onAddUpdate: EventEmitter<{
    criteria: EvaluationCriteria;
    item: EventDetail;
  }> = new EventEmitter();

  misConfiguredCriteriaStatus: boolean;

  informationAlertMin: CustomAlertBoxModel = {
    title: 'Information',
    buttonTitle: 'Continue',
    showButton: true,
    details: [
      {
        icon: 'info',
        message:
          'This criteria does not require PE to specify requirement. Please click continue button to move to the next step',
      },
    ],
  };

  misConfigInformationAlertMin: CustomAlertBoxModel = {
    title: 'Information',
    buttonTitle: 'Continue',
    showButton: true,
    details: [
      {
        icon: 'info',
        message:
          'This criteria is not configured correctly. Please report to PPRA using below contacts',
      },
      {
        icon: 'contacts',
        message:
          'PPRA contacts via +255 (0)736 494948 , Send email to support@nest.go.tz',
      },
      {
        icon: 'info',
        message: 'Please click continue button to move to the next step',
      },
    ],
  };

  constructor() { }

  ngOnInit(): void { }

  continueAction(action: boolean) {
    this.onContinueAction.emit(action);
  }

  openPeRequirementModal(criteria: EvaluationCriteria, item: null) {
    this.onAddUpdate.emit({
      criteria: criteria,
      item: item,
    });
  }

  editEvent(event, criteria: EvaluationCriteria) {
    this.openPeRequirementModal(criteria, event);
  }

  completeStep($event: any, criteria: EvaluationCriteria) {
    this.stepperAction.emit();
  }

  setLoading(isLoading: boolean, key: string) {
    this.setIsLoading.emit({ key: key, status: isLoading });
  }

  setFilledDataStatus($event: any, code: string) {
    this.setFilledData.emit({ code: code, event: $event });
  }

  misConfiguredCriteria(uuid: string) {
    this.misConfiguredCriteriaStatus = true;
  }
}
