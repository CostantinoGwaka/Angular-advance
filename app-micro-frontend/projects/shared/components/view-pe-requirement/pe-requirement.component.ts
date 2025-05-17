import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  EvaluationCriteria
} from "../../../modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criteria.model";
import { SubmissionCriteria } from "../../../modules/nest-tenderer/store/submission/submission.model";
import {
  GET_ALL_CRITERIA_FIELDS, GET_CRITERIA_EVENT_BY_CRITERIA_AND_ENTITY,
} from "../../../modules/nest-tender-evaluation/store/criteria-field/criteria-field.graphql";
import { DynamicFormService } from "../dynamic-forms-components/dynamic-form.service";
import { GraphqlService } from "../../../services/graphql.service";
import { EvaluationCriteriaField } from "../../../modules/nest-tender-evaluation/store/criteria-field/criteria-field.model";
import {
  CriteriaField
} from "../../../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/criteria-field.model";
import { ObjectForEntityDetail } from 'src/app/modules/nest-app/store/tender/tender.model';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../store";
import {PeRequirementSubmissionModel} from "../percentage-progress-bar/store/pe-requirement/pe-requirement.model";
import {upsertPeRequirementSubmission} from "../percentage-progress-bar/store/pe-requirement/pe-requirement.actions";
import {selectPeRequirementByUuid} from "../percentage-progress-bar/store/pe-requirement/pe-requirement.selectors";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";
import { SortByPipe } from '../../pipes/sort-pipe';
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';


@Component({
    selector: 'app-pe-requirement',
    templateUrl: 'pe-requirement.component.html',
    styleUrls: ['pe-requirement.component.scss'],
    standalone: true,
    imports: [DoNotSanitizePipe, SortByPipe]
})
export class PeRequirementComponent implements OnInit {
  @Input() criteria: EvaluationCriteria;
  @Input() forNegotiation: boolean = false;
  @Input() tenderCriteria: EvaluationCriteria;
  @Input() objectForEntityDetail: ObjectForEntityDetail;
  @Output() isPeRequirementSet: EventEmitter<boolean> = new EventEmitter();

  criteriaField: CriteriaField;
  criteriaFields: EvaluationCriteriaField[] = [];
  fetchingData = false;
  itemList = [];
  initialPeRequirement: PeRequirementSubmissionModel;
  cachedPeRequirement$: Observable<PeRequirementSubmissionModel>;

  constructor(
    private dynamicFormService: DynamicFormService,
    private store: Store<ApplicationState>,
    private apollo: GraphqlService
  ) { }

  ngOnInit(): void {
    this.fetchingData = true;

    /// check if there is any data in redux
    this.cachedPeRequirement$ = this.store.pipe(select(selectPeRequirementByUuid( {uuid: this.criteria.uuid})));
    this.cachedPeRequirement$.pipe(take(1)).subscribe( peRequirement => {
      if(peRequirement !== null) {
        this.initialPeRequirement = peRequirement;
      }
    })

    if (this.initialPeRequirement !== null && this.initialPeRequirement !== undefined) {
      this.criteriaField = this.initialPeRequirement.criteriaField;
      this.itemList = this.initialPeRequirement.dataValues;
    } else {
      this.initiateFields().then(async () => {
        await this.fetchCurrentData();
      });
    }
  }

  async fetchCurrentData() {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,

        query: GET_CRITERIA_EVENT_BY_CRITERIA_AND_ENTITY,
        variables: {
          eventTypeEnum: 'PE',
          entityObjectUuid: this.objectForEntityDetail.objectUuid,
          criteriaUuid: (this.tenderCriteria) ? this.tenderCriteria.uuid : this.criteria.uuid
        },
      });
      const values: any[] = response.data.getCriteriaEventsByCriteriaAndEntity.dataList;
      if (values) {
        const peRequirementType = (this.tenderCriteria) ?
          this.tenderCriteria.peRequirementType : this.criteria.peRequirementType;
        if (peRequirementType !== 'LIST') {
          if (values[0] && values[0].criteriaDataValues[0]) {
            const obj: any = {};
            const itemValue = values[0].criteriaDataValues[0];
            obj[itemValue.criteriaField.uuid] = itemValue.fieldValue;
            this.itemList.push(obj);
          }
        } else {
          values.forEach(item => {
            if (item.criteriaDataValues.length > 0) {
              const obj: any = {};
              item.criteriaDataValues.forEach(i => {
                obj[i.criteriaField.uuid] = i.fieldValue;
              });
              this.itemList.push(obj);
            }
          })
        }

        this.initialPeRequirement.dataValues = this.itemList;
        this.store.dispatch(upsertPeRequirementSubmission({peRequirement: this.initialPeRequirement}))
      }
      this.fetchingData = false;
    } catch (e) {
      console.error(e);
      this.fetchingData = false;
    }
  }

  async initiateFields() {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_ALL_CRITERIA_FIELDS,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          eventTypeEnum: 'PE',
          criteriaUuid: this.criteria.uuid
        },
      });


      if (response.data.getAllCriteriaFields.code === 9000) {
        this.criteriaFields = response.data.getAllCriteriaFields.dataList || [];
        this.isPeRequirementSet.emit(true);

        this.criteriaField = {
          type: this.criteria.peRequirementType,
          fields: this.criteriaFields.filter(
            i => i.evaluationCriteria.uuid === this.criteria.uuid)
            .map(i => ({
              uuid: i.uuid,
              name: i.name,
              description: i.description,
              type: i.fieldType,
              required: i.required,
              additionalDetailsUuid: i.additionalDetailsUuid,
            }))
        }

        this.initialPeRequirement = {
          id: this.criteria.id,
          uuid: this.criteria.uuid,
          criteriaField: this.criteriaField,
          dataValues: []
        }

      } else {
        console.error(response.data.getAllCriteriaFields.message);
        this.isPeRequirementSet.emit(false);
      }
    } catch (e) {
      console.error(e);
    }
  }

}
