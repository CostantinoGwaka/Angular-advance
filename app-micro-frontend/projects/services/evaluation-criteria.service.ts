import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { GraphqlService } from "./graphql.service";
import { EvaluationCriteria } from "../modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criteria.model";
import { GET_ALL_SUB_EVALUATION_CRITERIA_BY_PARENT_UUID, GET_ENTITY_EVALUATION_CRITERIA_BY_PARENT_UUID } from "../modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criterial.graphql";
import { TenderEvaluationCriteria } from "../modules/nest-tenderer-post-qualification/store/tender-evaluation-criteria/tender-evaluation-criteria.model";
import { Apollo } from "apollo-angular";
import { ApolloNamespace } from "../apollo.config";


@Injectable({
    providedIn: 'root'
})
export class EvaluationCriteriaService {

    constructor(
        private notificationService: NotificationService,
        private graphqlService: GraphqlService
    ) { }
    subEvaluationCriterias: { [key: string]: EvaluationCriteria[] } = {};
    subTenderEvaluationCriterias: { [key: string]: any[] } = {};

    async getAllSubEvaluationCriteriaByParentUuid(parentEvaluationCriteriaUuid: string) {
        try {
            const response: any = await this.graphqlService.fetchData({
                query: GET_ALL_SUB_EVALUATION_CRITERIA_BY_PARENT_UUID,
                apolloNamespace: ApolloNamespace.submission,
                variables: {
                    parentEvaluationCriteriaUuid
                }
            });

            if (response.data?.getAllSubEvaluationCriteriaByParentUuid?.code == 9000) {
                const evaluationCriteriaList: EvaluationCriteria[] = response.data.getAllSubEvaluationCriteriaByParentUuid.dataList || [];
                this.subEvaluationCriterias[parentEvaluationCriteriaUuid] = evaluationCriteriaList;
                for (let criteria of evaluationCriteriaList) {
                    if (criteria.hasSubCriteria) {
                        await this.getAllSubEvaluationCriteriaByParentUuid(criteria.uuid)
                    }
                }

                this.subEvaluationCriterias[parentEvaluationCriteriaUuid] = evaluationCriteriaList.map(criteria => {
                    return { ...criteria, subCriteria: criteria.hasSubCriteria ? this.subEvaluationCriterias[criteria.uuid] : [] }
                })

            }

            return this.subEvaluationCriterias;
        } catch (e) {
            console.error(e);
            return {};
        }
    }
    async getEntityEvaluationCriteriaByParentUuid(parentUuid: string) {
        try {
            const response: any = await this.graphqlService.fetchData({
                query: GET_ENTITY_EVALUATION_CRITERIA_BY_PARENT_UUID,
                apolloNamespace: ApolloNamespace.submission,
                variables: {
                    parentUuid
                }
            });
            if (response.data?.getEntityEvaluationCriteriaByParentUuid?.code == 9000) {
                const evaluationCriteriaList: any[] = response.data.getEntityEvaluationCriteriaByParentUuid.dataList || [];
                this.subTenderEvaluationCriterias[parentUuid] = evaluationCriteriaList;
                for (let criteria of evaluationCriteriaList) {
                    if (criteria.hasSubCriteria) {
                        await this.getEntityEvaluationCriteriaByParentUuid(criteria.uuid)
                    }
                }

                this.subTenderEvaluationCriterias[parentUuid] = evaluationCriteriaList.map(criteria => {
                    return { ...criteria, subCriteria: criteria.hasSubCriteria ? this.subTenderEvaluationCriterias[criteria.uuid] : [] }
                })

            }

            return this.subTenderEvaluationCriterias;
        } catch (e) {
            console.error(e);
            return {};
        }
    }

}
