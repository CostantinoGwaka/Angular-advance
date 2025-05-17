import {Injectable} from '@angular/core';
import {ApolloNamespace} from '../../../apollo.config';
import {GraphqlService} from '../../graphql.service';
import {
  ObjectForEntityDetail,
} from '../../../modules/nest-app/store/tender/tender.model';
import {
  GET_ENTITY_EVALUATION_CRITERIA_BY_ENTITY_TYPE
} from "../../../modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criterial.graphql";
import {
  EvaluationCriteria, ScoringStage
} from "../../../modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criteria.model";
import {
  EvaluationCriteriaSubGroup
} from "../../../modules/nest-tender-evaluation/store/criteria-sub-group/criteria-sub-group.model";
import {
  EvaluationCriteriaGroup
} from "../../../modules/nest-tender-evaluation/store/criteria-group/criteria-group.model";
import {EvaluationCriteriaService} from "../../evaluation-criteria.service";
import {
  GET_STAGES_REQUIRING_PASSMARK
} from "../../../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/evaluation-criteria-details.graphql";
import {
  GET_CRITERIA_SUB_GROUPS_PAGINATED
} from "../../../modules/nest-tender-evaluation/store/criteria-sub-group/criteria-sub-group.graphql";
import {
  GET_CRITERIA_GROUPS_PAGINATED
} from "../../../modules/nest-tender-evaluation/store/criteria-group/criteria-group.graphql";
import * as fromRequisitionGraphQl
  from "../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql";


@Injectable({
  providedIn: 'root',
})

export class EvaluationCriteriaScoreService {
  objectForEntityDetail: ObjectForEntityDetail;
  evaluationCriteriaSaved: EvaluationCriteria[] = [];
  evaluationCriteriaGroup: EvaluationCriteriaGroup[] = []
  evaluationCriteriaSubGroup: EvaluationCriteriaSubGroup[] = [];
  scoringStages: ScoringStage[] = [];
  totalWeightSet = 0;
  subEvaluationCriteriaList: { [p: string]: any[] } | {} = {};
  checkedCriteriaObject: { [id: string]: boolean } = {};
  totalSubCriteriaSet: { [id: string]: number } = {};
  totalGroupMarkSet: { [id: string]: number } = {};
  results: EvaluationCriteriaScoreResult;

  constructor(
    private apollo: GraphqlService,
    private evaluationCriteriaService: EvaluationCriteriaService
  ) {
  }

  async generateEvaluationReport(input: {
    objectForEntityDetail: ObjectForEntityDetail
  }): Promise<EvaluationCriteriaScoreResult> {
    this.objectForEntityDetail = input.objectForEntityDetail;
    await this.getStagesWithCustomScore();
    await this.getEvaluationScore();
    await this.getStagesRequiringPassMark();

    this.results = {
      evaluationCriteriaGroup: this.evaluationCriteriaGroup,
      scoringStages: this.scoringStages,
      totalWeightSet: this.totalWeightSet
    };
    return this.results;
  }


  async getEvaluationScore() {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,

        query: GET_ENTITY_EVALUATION_CRITERIA_BY_ENTITY_TYPE,
        variables: {
          objectUuid: this.objectForEntityDetail.objectUuid,
          entityObjectTypeEnum: this.objectForEntityDetail.objectType,
        }
      });

      if (response.data.getEntityEvaluationCriteriaByEntityType.code === 9000) {
        const evaluationCriteriaList: EvaluationCriteria[] = response.data.getEntityEvaluationCriteriaByEntityType.dataList || [];
        for (let criteria of evaluationCriteriaList) {
          if (criteria.hasSubCriteria) {
            await this.getEntityEvaluationCriteriaByParentUuid(criteria?.uuid)
          }
        }

        this.evaluationCriteriaSaved = evaluationCriteriaList.map(criteria => {
          return {
            ...criteria,
            subCriteria: criteria.hasSubCriteria ? this.subEvaluationCriteriaList[criteria?.uuid] : []
          }
        });

        this.evaluationCriteriaSubGroup = this.evaluationCriteriaSubGroup.map(i => ({
          ...i,
          evaluationCriteria: this.evaluationCriteriaSaved.filter(j => j.evaluationCriteria?.evaluationCriteriaSubGroup?.uuid === i.uuid),
        }));

        this.evaluationCriteriaGroup = this.evaluationCriteriaGroup.map(i => ({
          ...i,
          subGroups: this.evaluationCriteriaSubGroup.filter(j => j.evaluationCriteriaGroup.uuid === i.uuid),
        }));

        this.evaluationCriteriaGroup.forEach(group => {
          this.totalGroupMarkSet[group.uuid] = 0;
        });

        this.totalSubCriteriaSet = {};
        // this.subCriteriaScoreIncomplete = false;
        this.evaluationCriteriaSaved.forEach(criteria => {
          if (criteria?.evaluationCriteria.evaluationCriteriaGroup && criteria.maxScore) {
            this.totalGroupMarkSet[criteria?.evaluationCriteria.evaluationCriteriaGroup?.uuid] += criteria.maxScore;
          } else if (criteria.scoreType == 'MIN_MAX') {
            /// some of the criteria marks is not set

            // this.criteriaScoreIncomplete = true;
          }

          if (criteria.hasSubCriteria && criteria.subCriteria.length) {
            this.setSubCriteriaScore(criteria);
          }
        });

      } else {
        console.error(response.data.getEntityEvaluationCriteriaByEntityType.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getEntityEvaluationCriteriaByParentUuid(parentEvaluationCriteriaUuid: string) {
    try {
      this.subEvaluationCriteriaList = await this.evaluationCriteriaService.getEntityEvaluationCriteriaByParentUuid(parentEvaluationCriteriaUuid);
    } catch (e) {
      console.error(e);
    }
  }

  setSubCriteriaScore(criteria, parentCriteriaUuid = null) {
    if (criteria.hasSubCriteria && criteria.subCriteria.length) {
      criteria.subCriteria.forEach(sub => {
        this.setSubCriteriaScore(sub, criteria.uuid);
      });
    } else {
      /* check if has maxScore */
      if (!criteria.maxScore) {
        // this.subCriteriaScoreIncomplete = true;
      }

      if (parentCriteriaUuid !== null) {
        this.totalSubCriteriaSet[parentCriteriaUuid] = (this.totalSubCriteriaSet[parentCriteriaUuid] ?? 0) + (criteria.maxScore ?? 0);
      } else {
        this.totalSubCriteriaSet[criteria.uuid] = (this.totalSubCriteriaSet[criteria.uuid] ?? 0) + (criteria.maxScore ?? 0);
      }
    }
  }

  async getStagesRequiringPassMark() {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,

        query: GET_STAGES_REQUIRING_PASSMARK,
        variables: {
          entityUuid: this.objectForEntityDetail.objectUuid,
        }
      });

      if (response.data.getStagesRequiringPassMark.code == 9000) {
        this.scoringStages = response.data.getStagesRequiringPassMark.dataList || [];
        const requireWeight = this.scoringStages.findIndex((item: ScoringStage) => item.hasWeight) != -1;
        if (requireWeight) {
          this.totalWeightSet = 0;
          this.scoringStages.forEach(item => {
            this.totalWeightSet += item.weight;
          });
        }
      } else {
        console.error(response.data.getStagesRequiringPassMark.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async fetchSubGroups() {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,

        query: GET_CRITERIA_SUB_GROUPS_PAGINATED,
        variables: {
          input: {
            fields: [],
            mustHaveFilters: [],
            page: 1,
            pageSize: 20
          }
        }
      });
      this.evaluationCriteriaSubGroup = response.data.items.rows;
    } catch (e) {
      console.error(e);
    }
  }

  async fetchGroups(stageGroups: any[]) {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_CRITERIA_GROUPS_PAGINATED,
        variables: {
          input: {
            fields: [],
            mustHaveFilters: [],
            page: 1,
            pageSize: 20
          }
        }
      });

      this.evaluationCriteriaGroup = response.data.items.rows || [];

      if (stageGroups.length > 0) {
        this.evaluationCriteriaGroup = this.evaluationCriteriaGroup.filter(group => {
          return stageGroups.includes(group.uuid);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getStagesWithCustomScore() {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,

        query: fromRequisitionGraphQl.GET_STAGES_WITH_CUSTOM_SCORE,
        variables: {
          entityObjectUuid: this.objectForEntityDetail.objectUuid,
        },
      });

      if (response.data?.getStagesWithCustomScore?.code === 9000) {
        const tenderStagesWithScore = response.data.getStagesWithCustomScore?.dataList || [];

        if (tenderStagesWithScore.length) {
          const stageGroups = [];
          for (const modelItem of tenderStagesWithScore) {
            modelItem.evaluationCriteriaGroups.forEach(group => {
               stageGroups.push(group.uuid);
            });
          }

          await this.fetchGroups(stageGroups);
          await this.fetchSubGroups();
        }
      } else {
        console.error(response);
      }
    } catch (e) {
      console.error(e);
    }
  }

}


export interface EvaluationCriteriaScoreResult {
  evaluationCriteriaGroup: EvaluationCriteriaGroup[],
  scoringStages: ScoringStage[],
  totalWeightSet: number
}

