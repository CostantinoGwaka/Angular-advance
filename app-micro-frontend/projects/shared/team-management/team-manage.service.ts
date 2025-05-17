import { Injectable } from '@angular/core';
import { Tender } from 'src/app/modules/nest-app/store/tender/tender.model';
import { GET_PRE_QUALIFICATIONS_BY_UID } from 'src/app/modules/nest-pre-qualification/store/pre-qualification.graphql';
import {
  GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI
} from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { GraphqlService } from '../../services/graphql.service';
import {
  CREATE_TEAM_UPDATE,
  CREATE_NEGOTIATION_PLAN_TEAM,
  GET_TEAM_BY_UUID,
  GET_TEAM_TENDER_BY_UUID,
} from './store/team.graphql';
import {
  EntityObjectTypeEnum,
  EntitySummary,
  EntityWithoutTeam,
  NegotiationTeamDto,
  Team,
  TeamDto,
  TeamTypeEnum,
} from './store/team.model';
import {
  GET_NEGOTIATION_TEAM_DETAIL_BY_UUID
} from 'src/app/modules/nest-tenderer-negotiation/store/negotiation-team/negotiation-team.graphql';
import { ApolloNamespace } from 'src/app/apollo.config';

export interface TeamRespose {
  code: number;
  message: string;
  status: string;
}

export interface TeamPayLoad {
}

@Injectable({
  providedIn: 'root',
})
export class TeamManageService {
  constructor(private apollo: GraphqlService) {
  }

  getEntitiesWithoutTeam<T extends EntityWithoutTeam>(
    teamType: TeamTypeEnum,
    entityType: EntityObjectTypeEnum
  ): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      switch (teamType) {
        case TeamTypeEnum.PRE_QUALIFICATION_TEAM:
          resolve(null); //this.getEntityWithoutPreQualififcationTeam(entityType);
          break;
        case TeamTypeEnum.POST_QUALIFICATION_TEAM:
          await this.getEntityWithoutPostQualififcationTeam(entityType);
          break;
        case TeamTypeEnum.EVALUATION_TEAM:
          await this.getEntityWithoutEvaluation(entityType);
          break;
        case TeamTypeEnum.NEGOTIATION_TEAM:
          await this.getEntityWithoutNegotiation(entityType);
          break;
        case TeamTypeEnum.TENDER_BOARD:
          await this.getEntityWithoutNegotiation(entityType);
          break;
        default:
          break;
      }
      resolve(null);
    });
  }

  createEntityTeam(team: TeamDto): Promise<TeamRespose> {
    return new Promise(async (resolve, reject) => {
      try {
        const response: any = await this.apollo.mutate({
          mutation: CREATE_TEAM_UPDATE,
          apolloNamespace: ApolloNamespace.submission,
          variables: {
            teamCommitteeDto: team,
          },
        });

        resolve({
          code: response.data.createTeam.code,
          message: response.data.createTeam.message,
          status: response.status,
        });
      } catch (e) {
        reject({
          code: 404,
          message: e,
          status: 'INTERNAL_SERVER_EWRROR',
        });
      }
    });
  }

  createNegotiationTeam(team: NegotiationTeamDto): Promise<TeamRespose> {
    return new Promise(async (resolve, reject) => {
      try {
        const response: any = await this.apollo.mutate({
          mutation: CREATE_NEGOTIATION_PLAN_TEAM,
          apolloNamespace: ApolloNamespace.submission,
          variables: {
            dto: team,
          },
        });

        resolve({
          code: response.data.createNegotiationPlanTeam.code,
          message: response.data.createNegotiationPlanTeam.message,
          status: response.status,
        });
      } catch (e) {
        reject({
          code: 404,
          message: e,
          status: 'INTERNAL_SERVER_EWRROR',
        });
      }
    });
  }

  async getEntityByUuid(
    entityType: EntityObjectTypeEnum,
    teamType: TeamTypeEnum,
    uuid: string
  ): Promise<EntitySummary> {
    let entity: EntitySummary = {
      uuid: '',
      name: '',
      entityNumber: '',
      procurementCategoryName: '',
      selectionMethodName: '',
      sourceOfFundName: '',
      budgetPurpose: '',
      contractType: '',
      estimatedBudget: '',
      procurementMethodName: '',
      procurementMethodCategory: '',
      entitySubCategoryName: '',
      invitationDate: '',
      preQualificationInvitationDate: '',
      prequalificationTenderSubCategoryAcronym: '',
      prequalificationTenderSubCategoryName: '',
    };
    console.log(entityType);
    switch (entityType) {
      case EntityObjectTypeEnum.FRAMEWORK:
        break;
      case EntityObjectTypeEnum.NEGOTIATION:
        const res: any = await this.apollo.fetchData({
          apolloNamespace: ApolloNamespace.submission,
          query: GET_NEGOTIATION_TEAM_DETAIL_BY_UUID,
          variables: {
            uuid,
          },
        });
        entity = res.data.getNegotiationTeamDetailByUuid?.data;
        break;
      case EntityObjectTypeEnum.TENDER:
        const response: any = await this.apollo.fetchData({
          query: GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI,
          apolloNamespace: ApolloNamespace.app,
          variables: {
            uuid: uuid,
          },
        });
        if (response.data.getMergedProcurementRequisitionByUuid.code === 9000) {
          // this.currentTender = response.data.getMergedProcurementRequisitionByUuid.data;
          const tender: Tender | any =
            response.data.getMergedProcurementRequisitionByUuid.data;
          if (tender) {
            entity.uuid = uuid;
            entity.entityNumber = tender.tenderNumber;
            entity.name = tender.descriptionOfTheProcurement;
            entity.procurementCategoryName = tender.procurementCategoryName;
            entity.procurementMethodName = tender.procurementMethod.description;
            entity.procurementMethodCategory = tender.procurementMethodCategory;
            entity.selectionMethodName = tender.selectionMethod.name;
            entity.entitySubCategoryName = tender.tenderSubCategoryName;
            entity.budgetPurpose = tender.budgetPurpose;
            entity.sourceOfFundName = tender.sourceOfFund.name;
            entity.contractType = tender.contractType.name;
            entity.preQualificationInvitationDate =
              tender.preQualificationInvitationDate;
            entity.prequalificationTenderSubCategoryName =
              tender.prequalificationTenderSubCategoryName;
            entity.invitationDate = tender.invitationDate;
          }
        } else {
          console.error(
            response.data.getMergedProcurementRequisitionByUuid.message
          );
        }
        // const tenderResponse: any = await this.apollo.fetchData({
        //   query: GET_PRE_QUALIFICATIONS_BY_UID,
        //   variables: {
        //     uuid: uuid
        //   }
        // });
        // const tender: Tender | any = tenderResponse.data.findPreQualificationByUuid.data.tender;
        // entity.uuid = uuid;
        // entity.entityNumber = tender.tenderNumber;
        // entity.name = tender.descriptionOfTheProcurement;
        // entity.procurementCategoryName = tender.procurementCategoryName;
        // entity.procurementMethodName = tender.procurementMethod.description;
        // entity.procurementMethodCategory = tender.procurementMethodCategory;
        // entity.selectionMethodName = tender.selectionMethod.name;
        // entity.entitySubCategoryName = tender.tenderSubCategoryName;
        // entity.budgetPurpose = tender.budgetPurpose;
        // entity.sourceOfFundName = tender.sourceOfFund.name;
        // entity.contractType = tender.contractType.name;
        // entity.preQualificationInvitationDate = tender.preQualificationInvitationDate;
        // entity.prequalificationTenderSubCategoryName = tender.prequalificationTenderSubCategoryName;
        // entity.invitationDate = tender.invitationDate;
        break;
      case EntityObjectTypeEnum.PLANNED_TENDER:
        let app: Tender | any;
        const plannedResponse: any = await this.apollo.fetchData({
          query: GET_TEAM_TENDER_BY_UUID,
          apolloNamespace: ApolloNamespace.app,
          variables: {
            tenderUuid: uuid,
          },
        });
        app = plannedResponse?.data?.getTenderByUuid?.data;
        if (!app) {
          const plannedResponse: any = await this.apollo.fetchData({
            query: GET_PRE_QUALIFICATIONS_BY_UID,
            apolloNamespace: ApolloNamespace.app,
            variables: {
              uuid: uuid,
            },
          });
          app = plannedResponse.data.findPreQualificationByUuid?.data?.tender;
        }

        if (app) {
          entity.uuid = uuid;
          entity.entityNumber = app.tenderNumber;
          entity.name = app.descriptionOfTheProcurement;
          entity.procurementCategoryName = app.procurementCategoryName;
          entity.procurementMethodName = app.procurementMethod.description;
          entity.procurementMethodCategory = app.procurementMethodCategory;
          entity.selectionMethodName = app.selectionMethod.name;
          entity.entitySubCategoryName = app.tenderSubCategoryName;
          entity.budgetPurpose = app.budgetPurpose;
          entity.sourceOfFundName = app.sourceOfFund.name;
          entity.contractType = app.contractType.name;
          entity.preQualificationInvitationDate =
            app.preQualificationInvitationDate;
          entity.prequalificationTenderSubCategoryName =
            app.prequalificationTenderSubCategoryName;
          entity.invitationDate = app.invitationDate;
        }

        break;
      case EntityObjectTypeEnum.CONTRACT:
        break;
      default:
        break;
    }
    return entity;
  }

  getEntityWithoutPostQualififcationTeam<T extends EntityWithoutTeam>(
    entityType: EntityObjectTypeEnum
  ): Promise<T[]> {
    const entities: T[] = [];
    return new Promise(() => {
      switch (entityType) {
        case EntityObjectTypeEnum.FRAMEWORK:
          break;
        case EntityObjectTypeEnum.TENDER:
          break;
        case EntityObjectTypeEnum.PLANNED_TENDER:
          break;
        default:
          break;
      }
      return entities;
    });
  }

  getEntityWithoutEvaluation<T extends EntityWithoutTeam>(
    entityType: EntityObjectTypeEnum
  ): Promise<T[]> {
    const entities: T[] = [];
    return new Promise(() => {
      switch (entityType) {
        case EntityObjectTypeEnum.FRAMEWORK:
          break;
        case EntityObjectTypeEnum.TENDER:
          break;
        case EntityObjectTypeEnum.PLANNED_TENDER:
          break;
        default:
          break;
      }
      return entities;
    });
  }

  getEntityWithoutNegotiation<T extends EntityWithoutTeam>(
    entityType: EntityObjectTypeEnum
  ): Promise<T[]> {
    const entities: T[] = [];
    return new Promise(() => {
      switch (entityType) {
        case EntityObjectTypeEnum.FRAMEWORK:
          break;
        case EntityObjectTypeEnum.TENDER:
          break;
        case EntityObjectTypeEnum.PLANNED_TENDER:
          break;
        default:
          break;
      }
      return entities;
    });
  }

  getEntityWithoutTenderBoard<T extends EntityWithoutTeam>(
    entityType: EntityObjectTypeEnum
  ): Promise<T[]> {
    const entities: T[] = [];
    return new Promise(() => {
      switch (entityType) {
        case EntityObjectTypeEnum.FRAMEWORK:
          break;
        case EntityObjectTypeEnum.TENDER:
          break;
        case EntityObjectTypeEnum.PLANNED_TENDER:
          break;
        default:
          break;
      }
      return entities;
    });
  }

  async getTeam(teamUuid: string, teamType: any): Promise<Team> {
    if (teamType == 'NEGOTIATION_TEAM') {
      const response: any = await this.apollo.fetchData({
        query: GET_NEGOTIATION_TEAM_DETAIL_BY_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: teamUuid,
        },
      });
      const dataEv = response?.data?.getNegotiationTeamDetailByUuid?.data;
      if (dataEv) {
        return {
          ...dataEv,
          winner: dataEv.awardSubmission,
          members: dataEv.negotiationMemberAssignmentList.map((user: any) => {
            delete user._typename;
            return {
              ...user,
              uuid: user.userUuid,
            };
          }),
        } as Team;
      }
      return null;
    } else {
      const response: any = await this.apollo.fetchData({
        query: GET_TEAM_BY_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: teamUuid,
        },
      });
      const dataEv = response?.data?.findTeamByUuid?.data;
      if (dataEv) {
        return {
          ...dataEv,
          plannedStartDate: dataEv.plannedEvaluationStartDate,
          plannedEndDate: dataEv.plannedEvaluationEndDate,
          members: dataEv.members.map((user: any) => {
            delete user._typename;
            return {
              ...user,
              uuid: user.userUuid,
            };
          }),
        } as Team;
      }
      return null;
    }

  }
}
