import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../../apollo.config';
import { GraphqlService } from '../../graphql.service';
import { Observable, Subject } from 'rxjs';
import {
  FIND_TEAM_ASSIGNMENT_MEMBERS_BY_UUID_EVALUATION,
  GET_EVALUATION_COMMITEE_BY_UUID_TEAM_ASSIGNMENT,
  GET_TEAMS_DATA_BY_PROCURING_ENTITY_AND_TEAM_ASSIGNMENT_UUID_EVAL_REPORT,
  GET_TENDER_EVALUATION_COMMITTEE_STAGE,
} from '../../../modules/nest-tender-evaluation/store/evaluation-commitee/evaluation-commitee.graphql';
import {
  GET_TENDER_DATA_MINI,
  GET_TENDER_TENDERERS_DATA
} from '../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import {
  DataRequestInputInput,
  EntityObjectTypeEnum,
  ObjectForEntityDetail,
} from '../../../modules/nest-app/store/tender/tender.model';
import {
  GET_TENDERER_SUBMISSION_EVALUATION_REPORT
} from '../../../modules/nest-tender-initiation/store/tenderer-submission/tenderer-submission';
import {
  GET_TENDERER_EVALUATION_RESULTS_PAGINATED,
  GET_TENDERER_EVALUATION_SCORE_BY_TENDERER_EVALUATION_UUID_EVALUATION_REPORT,
  GET_TENDERER_STAGE_RESULTS,
} from '../../../modules/nest-tender-evaluation/store/evaluation/evaluation.graphql';
import {
  GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_SUBMISSION,
  GET_TENDER_EVALUATION_CRITERIA_STAGE_AND_ENTITY,
} from '../../../modules/nest-tenderer/store/submission/submission.graphql';
import {
  CriteriaField
} from '../../../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/criteria-field.model';
import * as criteriaGraphQl from '../../../modules/nest-tender-evaluation/store/criteria-field/criteria-field.graphql';
import { FieldRequestInputInput, SearchOperation, } from '../../../store/global-interfaces/organizationHiarachy';
import { PaginatorInput } from '../../../website/shared/models/web-paginator.model';
import { DataGenerationStep } from '../../../shared/components/data-generation-step/data-generation-step.component';
import { AttachmentService } from '../../attachment.service';
import {
  GET_PROCURING_ENTITY_BY_UUID_OPENING
} from '../../opening-report-generator/store/opening-report-generator.graphql';
import {
  GET_ONE_FRAMEWORK_LOT_SUBMISSION_VIEW,
  GET_ONE_FRAMEWORK_SUBMISSION_VIEW,
} from '../../../modules/nest-framework-agreement/agreements/agreements.graphql';
import {
  EvaluationReportGeneratedData
} from '../../../shared/components/tender-info-summary/store/entity-info-summary.model';
import { FIND_PRE_QUALIFICATIONS_BY_UID } from '../../../modules/nest-pre-qualification/store/pre-qualification.graphql';
import { PaginatedDataInput, PaginatedDataService, } from '../../paginated-data.service';
import { MultiLoaderService } from '../../../shared/components/multi-loader/multi-loader.service';
import { GET_DATES_BY_ENTITY_UUID_APPEAL_BY_UUID } from "../../../modules/nest-ppaa/store/ppaa-pe.graphql";
import { EvaluationCriteriaScoreResult, EvaluationCriteriaScoreService } from "./evaluation-criteria-score.service";
import {
  GET_ADDITIONAL_DETAIL_CUSTOM_DATA_BY_ENTITY_ID
} from "../../../modules/nest-tender-initiation/store/tender-workspace/tender-workspace.graphql";
import {
  GET_ALL_CLARIFICATION_UUID_EVALUATION_REPORT,
  GET_TENDER_BY_UUID_EVALUATION_REPORT
} from "../../../modules/nest-app/store/tender/tender.graphql";
import {
  GET_ALL_CLARIFICATION_UUID_PAGINATED_EVALUATION
} from "../../../modules/nest-tenderer/store/clarification/clarification.graphql";
import { Clarification } from "../../../modules/nest-tenderer/store/clarification/clarification-model";


@Injectable({
  providedIn: 'root',
})

export class EvaluationReportGeneratorService {
  html: any;

  evaluationReportGeneratorChange: EvaluationReportGeneratorChange = {
    loading: true,
    completed: false,
    error: null,
    message: 'loading',
    data: null,
  };

  evaluationReportGenerationSteps: DataGenerationStep[] = [
    {
      code: 'INITIALIZING',
      title: 'Initializing',
      stage: 'ON_PROGRESS',
    },
    {
      code: 'POPULATING',
      title: 'Populating data',
      stage: 'PENDING',
    },
    {
      code: 'GENERATING',
      title: 'Generating report',
      stage: 'PENDING',
    },
    {
      code: 'FINISHED',
      title: 'Finished',
      stage: 'PENDING',
    },
  ];

  teamAssignmentUuid: string;
  evaluationReportGeneratorChangeEvent =
    new Subject<EvaluationReportGeneratorChange>();

  pageSize: number = 20;
  pageNumber: number = 1;
  tenderUuid: string;

  tenderersResult = {};
  peRequirementMap = {};
  evaluationCriteriaListMap = {};
  mappedResultsByEvaluationCriteria = {};

  tendererList = [];
  tendererEvaluationResultList = [];

  dataRequestInputInput: DataRequestInputInput;
  mustHaveFilters: any = [
    {
      fieldName: 'submitted',
      operation: SearchOperation.EQ,
      value1: 'true',
    },
  ];

  customMainFilters: FieldRequestInputInput = {
    fieldName: 'entityUuid',
    operation: SearchOperation.EQ,
    searchValue: '',
  };

  paginatorInput: PaginatorInput = {
    loading: true,
  };

  reportData: EvaluationReportGeneratedData = {};

  useOldReportService = false;
  isStageReport = false;
  isCombinedReport = false;
  mergedMainRequisitionUuid: string;

  constructor(
    private apollo: GraphqlService,
    private paginatedDataService: PaginatedDataService,
    private attachmentService: AttachmentService,
    private multiLoaderService: MultiLoaderService,
    private evaluationCriteriaScoreService: EvaluationCriteriaScoreService,
  ) {
  }

  generateEvaluationReport(
    input: {
      teamAssignmentUuid: string;
      isStageReport: boolean;
      useOldReportService: boolean;
    }
  ): Observable<any> {
    this.useOldReportService = input.useOldReportService;
    this.isStageReport = input.isStageReport;
    this.teamAssignmentUuid = input.teamAssignmentUuid;

    this.getDetails();
    return this.evaluationReportGeneratorChangeEvent.asObservable();
  }

  getDetails() {
    this.resetLoadingProgress();
    this.startReportGeneration().then();
  }

  resetLoadingProgress() {
    this.tendererEvaluationResultList = [];
    this.tendererList = [];
    this.evaluationReportGeneratorChange = {
      loading: true,
      completed: false,
      error: null,
      message: 'loading',
      data: null,
    };

    this.evaluationReportGenerationSteps = [
      {
        code: 'INITIALIZING',
        title: 'Initializing',
        stage: 'ON_PROGRESS',
      },
      {
        code: 'POPULATING',
        title: 'Populating data',
        stage: 'PENDING',
      },
      {
        code: 'GENERATING',
        title: 'Generating report',
        stage: 'PENDING',
      },
      {
        code: 'FINISHED',
        title: 'Finished',
        stage: 'PENDING',
      },
    ];

    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
  }

  async startReportGeneration() {
    try {
      /// consider if report is new or old - new parameter to be introduced
      // useOldReportService default false

      /** --- step one --- **/
      /// 01 - fetch evaluation team details
      /// 02 - set entityType, tenderUuid, team assigment, chairman
      await this.getTeamAssignmentDetails();
      /** --- end of step one --- **/

      /** --- step two --- **/
      /// 01 - fetch entity details
      await this.fetchTenderDetailByEntityType();
      if (this.reportData.entityDetail.procurementMethodCategory != 'PUBLIC') {
        await this.getTenderTendererList(this.reportData.entityUuid, this.reportData.entityDetail.entityType);
      }

      if (this.reportData.entityDetail.procurementCategoryAcronym == 'C' && this.reportData.objectForEntityDetail != null) {
        this.reportData.criteriaWithScores = await this.evaluationCriteriaScoreService.generateEvaluationReport({ objectForEntityDetail: this.reportData.objectForEntityDetail });
      }
      /// 02 - fetch logo details
      await this.handPeLogo();

      /// get tender calendar
      await this.getEntityDates();

      /// get tender additional details
      await this.getAdditionalDetailsByIdAndTypeCustom();
      await this.getTenderByUuid();
      await this.getClarificationByTenderUuid();

      /** --- end of step two --- **/

      /** --- step three ---**/
      await this.handleReportGeneration();

      //       02.1 - submissions
      //       02.2 - stage results - done
      //       02.3 - evaluation criteria done
      //       02.4 - PE Requirements -DONE
      //       02.5 - Extract winner
      await this.getEvaluationCriteriaEvent();

      /** --- end step three ---**/
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async handleReportGeneration() {
    if (this.isStageReport) {
      await this.useOldReport();
    } else {
      await this.useLotReport();
    }
  }

  async useOldReport() {
    this.reportData.lotUuidList = [this.teamAssignmentUuid];
    this.reportData.availableLots[this.teamAssignmentUuid] = {};
    await this.handleSingleTenderLot(
      this.reportData.entityUuid,
      this.teamAssignmentUuid,
      1
    );
  }

  /*
    STEPS
    1. getAllSubmissionsByEntityUuidsPaginated LIKE getSubmissionsPaginated
    2. getTendererEvaluationResultsAllInOneForAll LIKE getTendererEvaluationResultsAllInOne
    3. getTenderEvaluationCriteriaStageAndEntity and getTendererStageResults For all
    4. getAllCriteriaFieldsByTenderEvaluationCriteria For all
    5. stich all data together

  */

  async useLotReport() {
    /// 01 - Get lot details
    await this.getTeamsDataByProcuringEntityAndTeamAssignmentUuid();
    /// 02 - Loop per lot and fetch

    this.multiLoaderService.addLoadingItem({
      id: 'handleSingleTenderLot',
      bold: true,
      title: `Processing ${this.reportData.lotUuidList.length} Lots`,
      progress: 0,
    });

    let lotIndex = 0;
    let progress = 0;

    for (const uuid of this.reportData.lotUuidList) {
      lotIndex++;
      this.multiLoaderService.updateTitle(
        'handleSingleTenderLot',
        `Processing Lot ${lotIndex} of ${this.reportData.lotUuidList.length}`
      );
      const entityUuid =
        this.reportData.availableLots[uuid].lotInformation.tenderUuid;

      await this.handleSingleTenderLot(entityUuid, uuid, lotIndex);

      progress = (lotIndex / this.reportData.lotUuidList.length) * 100;
      this.multiLoaderService.updateProgress('handleSingleTenderLot', progress);
    }
  }

  async handleSingleTenderLot(
    entityUuid: string,
    uuid: string,
    lotIndex: number
  ) {
    const submissionList = await this.getSubmissionsPaginated(
      entityUuid,
      lotIndex
    );

    const evaluationResult = await this.getTendererEvaluationResultsAllInOne(
      uuid,
      lotIndex
    );

    ///all evaluation result mapped per criteria
    const mappedResults = this.generateUniqueObject(evaluationResult);
    const getTenderStageList = await this.getTenderStage(uuid, lotIndex);

    const stageResultMap = {};
    let stageIndex = 0;
    let getTenderStageListProgressId = `getTenderStageList-${uuid}-${lotIndex}`;
    this.multiLoaderService.addLoadingItem({
      id: getTenderStageListProgressId,
      progressColor: '#2c2c2c',
      title: `Processing ${getTenderStageList.length} Stages For Lot ${lotIndex}`,
      progress: 0,
    });

    for (const item of getTenderStageList) {
      stageIndex++;

      this.multiLoaderService.updateTitle(
        getTenderStageListProgressId,
        `Processing ${item.evaluationStage.name} Stage For Lot ${lotIndex}`
      );

      const stageUuid = item.evaluationStage.uuid;
      const stageCriteria =
        await this.getTenderEvaluationCriteriaStageAndEntity(stageUuid, uuid);
      const stageResult = await this.getTendererStageResults(stageUuid, uuid);
      console.log('stageResult', stageResult);
      let evaluationResult = {};
      const peRequirement = {};

      let criteriaIndex = 0;
      let stageCriteriaProgressId = `getTenderStageList-${uuid}-${stageUuid}-${lotIndex}`;

      this.multiLoaderService.addLoadingItem({
        id: stageCriteriaProgressId,
        progressColor: '#2c2c2c',
        title: `Processing ${stageCriteria.length} Criteria For Lot ${lotIndex}`,
        progress: 0,
      });
      let evaluationByCriteria = {};
      for (const result of stageResult) {
        evaluationByCriteria[result.uuid] = await this.getTendererEvaluationScoreByTendererEvaluationUuid(
          stageUuid,
          result.tendererEvaluation.uuid
        );
      }

      for (const criteria of stageCriteria) {
        // evaluationByCriteria[criteria.uuid] = {};
        criteriaIndex++;

        this.multiLoaderService.updateTitle(
          stageCriteriaProgressId,
          `Processing ${criteria.name} Criteria of ${item.evaluationStage.name} Stage for Lot ${lotIndex}`
        );

        const uuid = criteria.evaluationCriteriaUuid;
        evaluationResult[uuid] = mappedResults[uuid];

        peRequirement[uuid] =
          await this.getAllCriteriaFieldsByTenderEvaluationCriteria(
            criteria?.uuid
          );

        this.multiLoaderService.updateProgress(
          stageCriteriaProgressId,
          (criteriaIndex / stageCriteria.length) * 100
        );
      }
      evaluationResult = this.mapJustificationIntoResultEntries(evaluationResult, evaluationByCriteria);

      this.multiLoaderService.updateProgress(
        getTenderStageListProgressId,
        (stageIndex / getTenderStageList.length) * 100
      );

      const stageTenderUuidList = stageResult.map( (result: any) => result.submission.uuid);
      console.log('stageTenderUuidList', stageTenderUuidList);
      // evaluationResult
      /// Take only users that have results
      const evaluationResultFiltered = {};
      for(const key of Object.keys(evaluationResult)){
        evaluationResultFiltered[key] = evaluationResult[key].filter((evaluation: any) => stageTenderUuidList.includes(evaluation.submissionUuid));
      }

      stageResultMap[stageUuid] = {
        criteria: stageCriteria,
        evaluationResult: evaluationResultFiltered,
        evaluationByCriteria: evaluationByCriteria,
        peRequirements: peRequirement,
        result: stageResult,
      };
    }

    this.reportData.availableLots[uuid] = {
      ...this.reportData.availableLots[uuid],
      stageResults: stageResultMap,
      stages: getTenderStageList,
      submissions: submissionList,
    };
  }

  mapJustificationIntoResultEntries(evaluationResult: any, evaluationByCriteria: any) {
    const justificationMap = this.generateJustificationMap(evaluationByCriteria);

    Object.entries(evaluationResult).forEach(([key, resultList]: [string, any[]]) => {
      evaluationResult[key] = resultList.map(result => {
        const justificationData = justificationMap[key]?.find(
          (item: any) => item.submissionUuid === result.submissionUuid
        );
        return {
          ...result,
          justification: justificationData?.justification,
        };
      });
    });

    return evaluationResult;
  }

  generateJustificationMap(evaluationByCriteria: any) {
    let evaluationCriteria = {};
    for (const key of Object.keys(evaluationByCriteria)) {
      const dataListByStage = evaluationByCriteria[key];
      for (const data of dataListByStage) {


        const criteriaUuid = data.evaluationCriteriaUuid;

        if (!evaluationCriteria[criteriaUuid]) {
          evaluationCriteria[criteriaUuid] = [];
        }

        evaluationCriteria[criteriaUuid].push(
          {
            submissionUuid: data.submissionUuid,
            stageUuid: key,
            justification: data.justification
          }
        );
      }
    }

    return evaluationCriteria;
  }

  getChange() {
    return this.evaluationReportGeneratorChangeEvent.asObservable();
  }

  broadcastDataStateChange(change: EvaluationReportGeneratorChange) {
    this.evaluationReportGeneratorChangeEvent.next(change);
  }

  updateCurrentStage(code: string, action: string = null): Promise<boolean> {
    return new Promise<any>((resolve) => {
      for (
        let i = 0;
        i < this.evaluationReportGeneratorChange.steps.length;
        ++i
      ) {
        const item = this.evaluationReportGeneratorChange.steps[i];

        if (action) {
          if (item.code == code) {
            item.stage = 'FAILED';
          }
        } else {
          if (item.code == code) {
            item.stage = code == 'FINISHED' ? 'FINISHED' : 'ON_PROGRESS';
          } else if (item.stage == 'ON_PROGRESS') {
            item.stage = 'FINISHED';
          }
        }

        this.evaluationReportGeneratorChange.steps[i] = item;
      }

      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
      resolve(true);
    });
  }

  async fetchTenderDetailByEntityType() {
    await this.updateCurrentStage('POPULATING');
    this.evaluationReportGeneratorChange.message = 'Getting tender details';
    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
    this.reportData.availableLots = {};
    const entityType = this.reportData.entityType.toLowerCase();

    if (entityType == 'framework') {
      if (this.useOldReportService) {
        await this.getOneFrameworkLot();
      } else {
        await this.getOneFramework();
      }
    } else if (entityType == 'planned_tender') {
      await this.getPreQualificationByUuid();
    } else if (entityType == 'tender') {
      await this.getMergedProcurementRequisitionByUuid();
    }
  }

  async getTenderStage(uuid: string, lotIndex: number) {
    this.evaluationReportGeneratorChange.message =
      'Getting Evaluation stage results details for Lot ' + lotIndex;
    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
    try {
      let tenderEvaluationStages = [];
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_TENDER_EVALUATION_COMMITTEE_STAGE,
        variables: {
          uuid: uuid,
        },
      });
      /// TODO getTenderEvaluationCommittee

      const committee = response.data.getTenderEvaluationCommittee.data;

      if (committee.tenderEvaluationMode) {
        tenderEvaluationStages = [
          ...(committee?.tenderEvaluationMode?.tenderEvaluationStages || []),
        ];
        if (tenderEvaluationStages.length) {
          tenderEvaluationStages.sort(
            (a, b) =>
              a?.evaluationStage?.stageNumber - b?.evaluationStage?.stageNumber
          );

          if (this.isCombinedReport) {
            tenderEvaluationStages = tenderEvaluationStages.filter(
              stage => stage.evaluationStage?.hasApproval || stage.evaluationStage?.isFinancial);
          }
        }
      }
      return tenderEvaluationStages;
    } catch (e) {
      console.error('An error occurred:', e);
      return [];
    }
  }

  async getTeamAssignmentDetails() {
    this.evaluationReportGeneratorChange = {
      steps: this.evaluationReportGenerationSteps,
      loading: true,
      failed: false,
      completed: false,
      message: 'Getting evaluation committee details',
      data: null,
    };

    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

    if (this.useOldReportService || this.isStageReport) {
      await this.getTenderEvaluationCommittee();
    } else {
      await this.findTeamAssignmentByUuid();
    }
  }

  /**** Team Assignment information ***/
  async getTenderEvaluationCommittee() {
    try {
      this.evaluationReportGeneratorChange = {
        steps: this.evaluationReportGenerationSteps,
        loading: true,
        failed: false,
        completed: false,
        message: 'Getting evaluation committee details',
        data: null,
      };

      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_EVALUATION_COMMITEE_BY_UUID_TEAM_ASSIGNMENT,
        variables: {
          uuid: this.teamAssignmentUuid,
        },
      });

      const committee = response.data.getTenderEvaluationCommittee.data;
      const committeeMembers = committee?.tenderEvaluationCommitteeInfos.map(
        (member: any) => {
          return {
            ...member,
            uuid: member.userUuid,
            fullName: this.generateFullName(member),
          };
        }
      );
      this.reportData.entityType = committee.entityType;
      this.reportData.entityUuid = committee.tenderUuid;
      this.setTeamAssigmentData(committeeMembers);
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching evaluation criteria', e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
    }
  }

  async findTeamAssignmentByUuid() {
    try {
      const response: any = await this.apollo.fetchData({
        query: FIND_TEAM_ASSIGNMENT_MEMBERS_BY_UUID_EVALUATION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.teamAssignmentUuid,
        },
      });

      if (response.data?.findTeamAssignmentByUuid?.code === 9000) {
        const teamAssignment = response.data?.findTeamAssignmentByUuid?.data;
        this.reportData.entityType = teamAssignment.entityType;
        this.reportData.entityUuid = teamAssignment.tenderUuid;

        const teamMembers = teamAssignment.teamMembers.map((member: any) => {
          return {
            ...member,
            fullName: this.generateFullName(member),
          };
        });

        this.setTeamAssigmentData(teamMembers);
      } else {
        this.setErrorResponse(
          'Failed when fetching team details',
          response.data?.findTeamAssignmentByUuid?.message
        );
        await this.updateCurrentStage('INITIALIZING', 'FAILED');
      }
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching evaluation criteria', e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
    }
  }

  generateFullName(person: any): string {
    const { firstName, middleName, lastName } = person;
    let fullName = '';

    if (firstName) {
      fullName += firstName;
    }

    if (middleName) {
      if (fullName) {
        fullName += ' ' + middleName;
      } else {
        fullName = middleName;
      }
    }

    if (lastName) {
      if (fullName) {
        fullName += ' ' + lastName;
      } else {
        fullName = lastName;
      }
    }

    return fullName;
  }

  setTeamAssigmentData(teamMembers: any[]) {
    this.reportData.teamAssignment = teamMembers;
    this.reportData.chairPerson = this.reportData.teamAssignment.find(
      (member) => member.position.toLowerCase() === 'chairperson'
    );
  }

  /**** end of Team Assignment information ***/

  async getTeamsDataByProcuringEntityAndTeamAssignmentUuid() {
    try {
      await this.updateCurrentStage('GENERATING');
      this.evaluationReportGeneratorChange.message =
        'Getting Evaluation Details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const paginatedDataInput: PaginatedDataInput = {
        page: 1,
        pageSize: 20,
        fields: [
          {
            fieldName: 'id',
            isSortable: true,
            orderDirection: 'ASC',
          },
        ],
        mustHaveFilters: [],
        apolloNamespace: ApolloNamespace.submission,
        query:
          GET_TEAMS_DATA_BY_PROCURING_ENTITY_AND_TEAM_ASSIGNMENT_UUID_EVAL_REPORT,
        additionalVariables: {
          teamAssignmentUuid: this.teamAssignmentUuid,
        },
      };
      const evaluationLot = await this.paginatedDataService.getAllData(
        paginatedDataInput
      );
      this.reportData.lotUuidList = evaluationLot.map((lot) => lot.uuid);
      this.reportData.availableLots = {};
      evaluationLot.forEach((lot) => {
        this.reportData.availableLots[lot.uuid] = {
          lotInformation: lot,
        };
      });
    } catch (e) {
      console.error(e);
    }
  }

  async getEvaluationCriteriaEvent() {
    if (this.evaluationReportGeneratorChange.failed) {
      return;
    }

    await this.updateCurrentStage('FINISHED');
    /** emit evaluation criteria mapped **/
    this.evaluationReportGeneratorChange.message = 'Completed';
    this.evaluationReportGeneratorChange.loading = false;
    this.evaluationReportGeneratorChange.completed = true;
    this.evaluationReportGeneratorChange.data = this.reportData;
    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
    /** end of emitting evaluation criteria mapped **/
  }

  async getOneFramework() {
    try {
      let response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_ONE_FRAMEWORK_SUBMISSION_VIEW,
        variables: {
          uuid: this.reportData.entityUuid,
        },
      });
      if (response.data.getOneFramework?.code == 9000) {
        const framework = response.data.getOneFramework.data;
        this.reportData.entityDetail = {
          ...framework,
          entityUuid: framework.uuid,
          mainEntityUuid: framework.uuid,
          hasAddendum: framework.hasAddendum,
          financialYearCode: framework.financialYearCode,
          entityNumber: framework.frameworkNumber,
          lotNumber: framework.frameworkNumber,
          entityStatus: framework.frameworkStatus,
          lotDescription: framework.description,
          description: framework.description,
          procurementCategoryAcronym: framework.tenderCategoryName,
          entitySubCategoryName: framework.tenderSubCategoryName,
          procuringEntityName: framework.procuringEntityName,
          procurementMethodName: framework.procurementMethodName,
          procurementEntityUuid: framework.procuringEntityUuid,
          sourceOfFund: framework.sourceOfFundName,
          invitationDate: null,
          deadline: null,
        };

        this.reportData.objectForEntityDetail = {
          objectType: EntityObjectTypeEnum.PLANNED_TENDER,
          objectUuid: framework?.uuid,
          objectId: framework?.id,
        };
        this.tenderUuid = framework.uuid;

      } else {
        console.error(response.data.getOneFramework.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getOneFrameworkLot() {
    try {
      let response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_ONE_FRAMEWORK_LOT_SUBMISSION_VIEW,
        variables: {
          uuid: this.reportData.entityUuid,
        },
      });
      if (response.data.getOneFrameworkLot?.code == 9000) {
        const lotDetail = response.data.getOneFrameworkLot.data;
        const frameworkMain = lotDetail?.frameworkMain;

        this.reportData.entityDetail = {
          ...frameworkMain,
          entityUuid: frameworkMain.uuid,
          mainEntityUuid: frameworkMain.uuid,
          hasAddendum: frameworkMain.hasAddendum,
          financialYearCode: frameworkMain.financialYearCode,
          entityNumber: frameworkMain.frameworkNumber,
          lotNumber: lotDetail.lotNumber,
          lotDescription: lotDetail.lotDescription,
          description: frameworkMain.description,
          procurementCategoryAcronym: frameworkMain.tenderCategoryName,
          entitySubCategoryName: frameworkMain.tenderSubCategoryName,
          procuringEntityName: frameworkMain.procuringEntityName,
          procurementMethodName: frameworkMain.procurementMethodName,
          pprocurementEntityUuid: frameworkMain.procuringEntityUuid,
          sourceOfFund: frameworkMain.sourceOfFundName,
          invitationDate: null,
          deadline: null,
        };

        this.reportData.objectForEntityDetail = {
          objectType: EntityObjectTypeEnum.PLANNED_TENDER,
          objectUuid: frameworkMain?.uuid,
          objectId: frameworkMain?.id
        };

        this.tenderUuid = frameworkMain.uuid;
      } else {
        console.error(response.data.getOneFrameworkLot.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getPreQualificationByUuid() {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: FIND_PRE_QUALIFICATIONS_BY_UID,
        variables: {
          uuid: this.reportData.entityUuid,
        },
      });

      if (response.data.findPreQualificationByUuid?.code == 9000) {
        const preQualification = response.data.findPreQualificationByUuid.data;
        this.reportData.entityDetail = {
          ...preQualification,
          entityUuid: preQualification.uuid,
          mainEntityUuid: preQualification.uuid,
          hasAddendum: preQualification.hasAddendum,
          financialYearCode: preQualification.tender.financialYearCode,
          entityNumber: preQualification.identificationNumber,
          lotNumber: preQualification.identificationNumber,
          lotDescription: preQualification.tender.descriptionOfTheProcurement,
          description: preQualification.tender.descriptionOfTheProcurement,
          procurementCategoryAcronym:
            preQualification.tender.procurementCategoryAcronym,
          entitySubCategoryName: preQualification.tender.tenderSubCategoryName,
          procuringEntityName: preQualification.tender.procuringEntityName,
          procurementMethodName:
            preQualification.tender.procurementMethod.description,
          sourceOfFund: preQualification?.tender?.sourceOfFund.name,
          invitationDate: null,
          deadline: null,
        };

        this.reportData.objectForEntityDetail = {
          objectType: EntityObjectTypeEnum.PLANNED_TENDER,
          objectUuid: preQualification?.tender?.uuid,
          objectId: preQualification?.id
        };
        this.tenderUuid = preQualification?.tender?.uuid;

      }
    } catch (e) {
    }
  }

  async getMergedProcurementRequisitionByUuid() {
    try {
      this.evaluationReportGeneratorChange.message = 'Getting tender details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const response: any = await this.apollo.fetchData({
        query: GET_TENDER_DATA_MINI,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: this.reportData.entityUuid,
        },
      });

      if (
        response?.data?.getMergedProcurementRequisitionByUuid?.code === 9000
      ) {
        const result =
          response?.data?.getMergedProcurementRequisitionByUuid?.data;
        const mergedMainProcurementRequisition = result?.mergedMainProcurementRequisition;
        const tender = mergedMainProcurementRequisition.tender;
        this.reportData.entityDetail = {
          ...result,
          mainEntityUuid: result.uuid,
          entityUuid: result.uuid,
          financialYearCode: result.financialYearCode,
          entityNumber: result.lotNumber,
          lotNumber: result.lotNumber,
          description: result.lotDescription,
          lotDescription: result.lotDescription,
          hasAddendum: result.hasAddendum,
          procurementMethodName: tender?.procurementMethod?.description,
          procurementCategoryAcronym: tender?.procurementCategoryAcronym,
          selectionMethod: tender?.selectionMethod?.name,
          entitySubCategoryName: tender?.tenderSubCategoryName,
          procuringEntityName: tender?.procuringEntityName,
          sourceOfFund: tender?.sourceOfFund?.name,
          invitationDate: null,
          deadline: null,
          tenderOpeningDateTime: result.tenderOpenningDateTime,
          procurementMethodCategory: tender?.procurementMethod?.procurementMethodCategory,
          procurementEntityUuid: tender.procurementEntityUuid,
        };

        this.reportData.objectForEntityDetail = {
          objectType: EntityObjectTypeEnum.TENDER,
          objectUuid: result.uuid,
          objectId: result.id,
        };
        this.mergedMainRequisitionUuid = mergedMainProcurementRequisition.uuid;
        this.tenderUuid = tender?.uuid;
        // GET_ELIGIBLE_TENDERER
      } else {
        await this.getMergedMainProcurementRequisitionByUuid();
      }
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching tender details', e);
    }
  }

  async getMergedMainProcurementRequisitionByUuid() {
    try {
      this.evaluationReportGeneratorChange.message = 'Getting tender details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_SUBMISSION,
        variables: {
          uuid: this.reportData.entityUuid,
        },
      });

      if (
        response?.data?.getMergedMainProcurementRequisitionByUuid?.code === 9000
      ) {
        const mergedMainProcurementRequisition =
          response.data.getMergedMainProcurementRequisitionByUuid.data;
        this.reportData.entityDetail = {
          ...mergedMainProcurementRequisition,
          mainEntityUuid: mergedMainProcurementRequisition.uuid,
          entityUuid: mergedMainProcurementRequisition.uuid,
          financialYearCode:
            mergedMainProcurementRequisition.tender.financialYearCode,
          entityNumber: mergedMainProcurementRequisition.tender.tenderNumber,
          lotNumber: mergedMainProcurementRequisition.tender.tenderNumber,
          entityStatus: mergedMainProcurementRequisition.tenderState,
          description:
            mergedMainProcurementRequisition.tender.descriptionOfTheProcurement,
          lotDescription:
            mergedMainProcurementRequisition.tender.descriptionOfTheProcurement,
          hasAddendum: mergedMainProcurementRequisition.hasAddendum,
          procurementMethodName:
            mergedMainProcurementRequisition.tender.procurementMethod
              .description,
          procurementCategoryAcronym:
            mergedMainProcurementRequisition.tender.procurementCategoryAcronym,
          entitySubCategoryName:
            mergedMainProcurementRequisition.tender.tenderSubCategoryName,
          procuringEntityName:
            mergedMainProcurementRequisition.tender.procuringEntityName,
          procurementEntityUuid: mergedMainProcurementRequisition.tender.procurementEntityUuid,
          sourceOfFund: mergedMainProcurementRequisition.sourceOfFundName,
          invitationDate: null,
          deadline: null,
          selectionMethod: mergedMainProcurementRequisition.tender?.selectionMethod.name,
          tenderOpeningDateTime: mergedMainProcurementRequisition.tenderOpenningDateTime,
          procurementMethodCategory: mergedMainProcurementRequisition.tender?.procurementMethod?.procurementMethodCategory,
        };

        this.reportData.objectForEntityDetail = {
          objectType: EntityObjectTypeEnum.TENDER,
          objectUuid: mergedMainProcurementRequisition.uuid,
          objectId: mergedMainProcurementRequisition.id,
        };

        this.tenderUuid = mergedMainProcurementRequisition.tender?.uuid;

      }
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching tender details', e);
    }
  }

  async handPeLogo() {
    this.evaluationReportGeneratorChange.message =
      'Getting Institution details';
    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
    const procurementEntityUuid =
      this.reportData.entityDetail.procurementEntityUuid;
    this.reportData.logoDetails = {
      defaultLogo: null,
      peLogo: null,
    };

    if (procurementEntityUuid) {
      /*** Fetch national emblem as default logo*/
      const logoUuid = '279ba353-f642-4f3b-913e-ccb25f982031';
      const defaultLogo = await this.fetchLogoByUuid(logoUuid);
      if (defaultLogo) {
        this.reportData.logoDetails.defaultLogo = defaultLogo;
      }

      /*** Fetch pe log as provided logo*/
      await this.getProcuringEntityByUuid(procurementEntityUuid);
    }
  }

  async getProcuringEntityByUuid(procuringEntityUuid: string) {
    try {
      this.evaluationReportGeneratorChange.message = 'Getting PE details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_PROCURING_ENTITY_BY_UUID_OPENING,
        variables: {
          uuid: procuringEntityUuid,
        },
      });

      if (response.data.findProcuringEntityByUuid.code === 9000) {
        const defaultLogoUuid =
          response.data.findProcuringEntityByUuid.data.logoUuid;
        if (defaultLogoUuid) {
          this.reportData.logoDetails.defaultLogo = await this.fetchLogoByUuid(
            defaultLogoUuid
          );
        }
      } else {
        const message = response.data.findProcuringEntityByUuid.message;
        console.error(message);
        await this.updateCurrentStage('INITIALIZING', 'FAILED');
        this.setErrorResponse(
          'Failed when fetching Institution details',
          message
        );
      }
    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
      this.setErrorResponse('Failed when fetching Institution details', e);
    }
  }

  async getSubmissionsPaginated(uuid: string, lotIndex: number) {
    try {
      this.multiLoaderService.addLoadingItem({
        id: 'getSubmissionsPaginatedProgressLot' + lotIndex,
        progressColor: '#2c2c2c',
        title: `Getting submissions for Lot ${lotIndex}`,
        progress: 0,
      });

      this.evaluationReportGeneratorChange.message =
        'Getting Submissions details for Lot ' + lotIndex;
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const paginatedDataInput: PaginatedDataInput = {
        page: 1,
        pageSize: 20,
        fields: [],
        mustHaveFilters: [
          {
            fieldName: 'submitted',
            operation: SearchOperation.EQ,
            value1: 'true',
          },
          {
            fieldName: 'entityUuid',
            operation: SearchOperation.EQ,
            value1: uuid,
          },
        ],
        apolloNamespace: ApolloNamespace.submission,
        query: GET_TENDERER_SUBMISSION_EVALUATION_REPORT,
        progressLoadingKey: 'getSubmissionsPaginatedProgressLot' + lotIndex,
        onProgress: (progress) => {
          this.multiLoaderService.updateTitle(
            'getSubmissionsPaginatedProgressLot' + lotIndex,
            `Getting ${progress.totalRecords} submissions for Lot ${lotIndex}`
          );
          this.multiLoaderService.updateProgress(
            'getSubmissionsPaginatedProgressLot' + lotIndex,
            progress.progress
          );
        },
      };
      return await this.paginatedDataService.getAllData(paginatedDataInput);
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching submissions details', e);
      return [];
    }
  }

  async getTendererEvaluationResultsAllInOne(uuid: string, lotIndex: number) {
    this.evaluationReportGeneratorChange.message =
      'Getting Evaluation results details for Lot ' + lotIndex;
    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

    this.multiLoaderService.addLoadingItem({
      id: 'getTendererEvaluationResultsAllInOneLot' + lotIndex,
      progressColor: '#2c2c2c',
      title: `Getting Evaluation results for Lot ${lotIndex}`,
      progress: 0,
    });

    const paginatedDataInput: PaginatedDataInput = {
      page: 1,
      pageSize: 20,
      fields: [
        {
          fieldName: 'id',
          isSortable: true,
          orderDirection: 'ASC',
        },
      ],
      mustHaveFilters: [],
      apolloNamespace: ApolloNamespace.submission,
      query: GET_TENDERER_EVALUATION_RESULTS_PAGINATED,
      additionalVariables: {
        teamUuid: uuid,
      },
      progressLoadingKey: 'getTendererEvaluationResultsAllInOneLot' + lotIndex,
      onProgress: (progress) => {
        this.multiLoaderService.updateTitle(
          'getTendererEvaluationResultsAllInOneLot' + lotIndex,
          `Getting ${progress.totalRecords} Evaluation results for Lot ${lotIndex}`
        );
        this.multiLoaderService.updateProgress(
          'getTendererEvaluationResultsAllInOneLot' + lotIndex,
          progress.progress
        );
      },
    };
    return await this.paginatedDataService.getAllData(paginatedDataInput);
  }

  async getTendererEvaluationResultsPaginated() {
    // try {
    //   if (this.evaluationReportGeneratorChange.failed) {
    //     return;
    //   }
    //   this.tendererEvaluationResultList = [];
    //   await this.updateCurrentStage('POPULATING');
    //   this.evaluationReportGeneratorChange.message = 'Getting evaluation results';
    //   this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
    //
    //   this.tendererEvaluationResultList = await this.getTendererEvaluationResultsAllInOne();
    //   /** emit fetched data **/
    //   this.evaluationReportGeneratorChange.data = {
    //     ...this.evaluationReportGeneratorChange.data,
    //     tendererEvaluationResultList: this.tendererEvaluationResultList,
    //   }
    //   this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
    //   /** end of fetched data **/
    //   await this.mapResultsToEvaluationStage(this.tendererEvaluationResultList);
    //
    // } catch (e) {
    //   console.error(e);
    //   this.setErrorResponse('Failed when fetching evaluation results', e);
    //   await this.updateCurrentStage('POPULATING', 'FAILED');
    // }
  }

  getUniqueUUIDs(uuidList: string[]): string[] {
    const uniqueUUIDsSet = new Set(uuidList);
    return Array.from(uniqueUUIDsSet);
  }

  mapResultsToEvaluationStage(tendererList: any[]): Promise<boolean> {
    return new Promise((resolve) => {
      this.mappedResultsByEvaluationCriteria = {};
      this.mappedResultsByEvaluationCriteria =
        this.generateUniqueObject(tendererList);

      /** emit fetched data **/
      this.evaluationReportGeneratorChange.data = {
        ...this.evaluationReportGeneratorChange.data,
        mappedResultsByEvaluationCriteria:
          this.mappedResultsByEvaluationCriteria,
      };
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
      /** end of fetched data **/

      resolve(true);
    });
  }

  generateUniqueObject(tendererList: any[]) {
    const uniqueObject = {};

    for (const item of tendererList) {
      const { evaluationCriteriaUuid } = item;
      if (!uniqueObject[evaluationCriteriaUuid]) {
        uniqueObject[evaluationCriteriaUuid] = [item];
      } else {
        const existingItems = uniqueObject[evaluationCriteriaUuid];
        let isDuplicate = false;
        for (const existingItem of existingItems) {
          if (this.areObjectsEqual(existingItem, item)) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          uniqueObject[evaluationCriteriaUuid].push(item);
        }
      }
    }
    return uniqueObject;
  }

  areObjectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }

  async getTenderEvaluationCriteriaStageAndEntity(
    stageUuid: string,
    teamUuid: string
  ) {
    try {
      this.evaluationReportGeneratorChange.message =
        'Getting evaluation criteria details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_TENDER_EVALUATION_CRITERIA_STAGE_AND_ENTITY,
        variables: {
          teamUuid: teamUuid,
          stageUuid: stageUuid,
        },
      });

      const evaluationCriteriaList = [
        ...(response.data.getTenderEvaluationCriteriaStageAndEntity.dataList ||
          []),
      ];

      if (evaluationCriteriaList.length) {
        evaluationCriteriaList.sort((a, b) => a.sortNumber - b.sortNumber);
      }
      return evaluationCriteriaList;
    } catch (e) {
      console.error(e);
      this.setErrorResponse(
        'Failed when fetching evaluation criteria details',
        e
      );
      return [];
    }
  }

  removeDuplicates(dataArray: any[], keyToUse: string, keyToUse2: string) {
    let newArray = [];
    let uniqueObject = {};
    for (let i = 0; i < dataArray.length; i++) {
      const compareKey = dataArray[i][keyToUse] + dataArray[i][keyToUse2];
      uniqueObject[compareKey] = dataArray[i];
    }
    for (let i in uniqueObject) {
      newArray.push(uniqueObject[i]);
    }
    return newArray;
  }

  async getAllCriteriaFieldsByTenderEvaluationCriteria(
    evaluationCriteriaUuid: string
  ) {
    try {
      this.evaluationReportGeneratorChange.message =
        'Generating evaluation details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
      const criteriaField: CriteriaField = {
        type: '',
        fields: [],
      };

      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query:
          criteriaGraphQl.GET_ALL_CRITERIA_FIELDS_BY_TENDER_EVALUATION_CRITERIA,
        variables: {
          eventTypeEnum: 'PE',
          tenderEvaluationCriteriaUuid: evaluationCriteriaUuid,
        },
      });

      if (
        response.data?.getAllCriteriaFieldsByTenderEvaluationCriteria?.code ==
        9000
      ) {
        const dataList =
          response.data.getAllCriteriaFieldsByTenderEvaluationCriteria
            ?.dataList || [];
        criteriaField.fields = dataList.map((item) => {
          return { ...item, type: item.fieldType };
        });

        let peRequirement = {
          criteriaField: criteriaField,
        };

        const eventDataValue = await this.getCriteriaEventsByCriteriaAndEntity(
          (this.isStageReport) ? this.mergedMainRequisitionUuid : this.reportData.objectForEntityDetail.objectUuid,
          evaluationCriteriaUuid
        );

        if (eventDataValue != null) {
          peRequirement = {
            ...peRequirement,
            ...eventDataValue,
          };
        }

        return peRequirement;
      } else {
        console.error(
          response.data.getAllCriteriaFieldsByTenderEvaluationCriteria.message
        );
        return null;
      }
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching criteria fields', e);
      await this.updateCurrentStage('GENERATING', 'FAILED');
      return null;
    }
  }

  async getCriteriaEventsByCriteriaAndEntity(
    objectUuid: string,
    evaluationCriteriaUuid: string
  ) {
    const requirementMap = {
      itemList: [],
      criteriaEventMap: {},
      attachments: {},
    };

    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: criteriaGraphQl.GET_CRITERIA_EVENT_BY_CRITERIA_AND_ENTITY,
        variables: {
          eventTypeEnum: 'PE',
          entityObjectUuid: objectUuid,
          criteriaUuid: evaluationCriteriaUuid,
        },
      });
      if (response.data.getCriteriaEventsByCriteriaAndEntity.code === 9000) {
        const criteriaEvents =
          response.data.getCriteriaEventsByCriteriaAndEntity.dataList || [];
        for (const item of criteriaEvents) {
          if (item?.criteriaDataValues.length) {
            const obj: any = {};
            for (const itemValue of item?.criteriaDataValues) {
              requirementMap.criteriaEventMap[itemValue.criteriaField.uuid] = {
                criteriaFieldUuid: itemValue.criteriaField.uuid,
                criteriaDataValueUuid: itemValue.uuid,
                criteriaEventUuid: itemValue?.criteriaEvent?.uuid,
              };
              obj[itemValue.criteriaField.uuid] = itemValue.fieldValue;
              if (itemValue.attachmentUuid) {
                const attachmentKey =
                  itemValue.criteriaField.uuid + '_attachment';
                requirementMap[attachmentKey] = itemValue.attachmentUuid;
              }
            }
            requirementMap.itemList.push(obj);
          }
        }
        return requirementMap;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching PE requirements', e);
      return null;
    }
  }

  async getTendererStageResults(modeItemUuid: string, committeeUuid: string) {
    try {
      this.evaluationReportGeneratorChange.message =
        'Getting Evaluation results';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_TENDERER_STAGE_RESULTS,
        variables: {
          stageUuid: modeItemUuid,
          teamUuid: committeeUuid,
        },
      });
      return response.data?.getTendererStageResults?.dataList || [];
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching tenderers results', e);
      return [];
    }
  }

  async fetchLogoByUuid(logoUuid: string): Promise<any> {
    try {
      if (!logoUuid) {
        this.setErrorResponse(
          'Failed when fetching logo details',
          'Logo uuid is required'
        );
        return null;
      }

      const logoData = await this.attachmentService.getPELogo(logoUuid);

      if (logoData && logoData.length) {
        return logoData;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching logo details', e);
      return null;
    }
  }

  setErrorResponse(message: string, error: string) {
    this.evaluationReportGeneratorChange.message = message;
    this.evaluationReportGeneratorChange.failed = true;
    this.evaluationReportGeneratorChange.loading = false;
    this.evaluationReportGeneratorChange.error = error;
    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
  }

  async getEntityDates() {
    try {
      this.evaluationReportGeneratorChange.message =
        'Getting Tender Calendar details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
      const responseDateData: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: GET_DATES_BY_ENTITY_UUID_APPEAL_BY_UUID,
        variables: {
          entityUuid: (this.isStageReport) ? this.mergedMainRequisitionUuid : this.reportData.entityUuid,
        },
      });

      const data = responseDateData.data?.getEntityDatesFlat?.data;
      if (data) {
        console.log('data', data);
        /** emit fetched data **/
        this.reportData.tenderCalendar = data;
        /** end of fetched data **/
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getTenderTendererList(entityUuid: string, entityType: string) {
    try {

      const savedTendererList = await this.paginatedDataService.getAllDataOld({
        apolloNamespace: ApolloNamespace.app,
        query: GET_TENDER_TENDERERS_DATA,
        mustHaveFilters: [
          {
            fieldName: 'entityType',
            operation: 'EQ',
            value1: entityType,
          },
          {
            fieldName: 'entityUuid',
            operation: 'EQ',
            value1: entityUuid,
          },
        ],
      });

      /** emit fetched data **/
      this.evaluationReportGeneratorChange.data = {
        ...this.evaluationReportGeneratorChange.data,
        shortListedTendererList: savedTendererList,
      };
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);
      /** end of fetched data **/

    } catch (e) {
      console.error(e);
    }
  }

  async getAdditionalDetailsByIdAndTypeCustom() {
    try {
      this.reportData.preferenceScheme = null;
      this.evaluationReportGeneratorChange.message =
        'Getting Tender additional details';
      this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,

        query: GET_ADDITIONAL_DETAIL_CUSTOM_DATA_BY_ENTITY_ID,
        variables: {
          entityId: this.reportData.objectForEntityDetail.objectId,
          entityType: this.reportData.objectForEntityDetail.objectType
        },
      });
      if (
        response.data.getEntityAdditionalDetailsByIdAndTypeCustom?.code ===
        9000
      ) {
        const data = response.data.getEntityAdditionalDetailsByIdAndTypeCustom?.data.preferenceSchemeType;
        if (data) {
          this.reportData.preferenceScheme = data.value
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getTenderByUuid(): Promise<void> {
    this.reportData.preferenceScheme = null;
    this.evaluationReportGeneratorChange.message =
      'Getting Eligible Tenderer types details';
    this.broadcastDataStateChange(this.evaluationReportGeneratorChange);

    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: GET_TENDER_BY_UUID_EVALUATION_REPORT,
        variables: {
          tenderUuid: this.tenderUuid,
        },
      });

      if (response.data.getTenderByUuid.code == 9000) {
        this.reportData.entityDetail.eligibleTendererTypeList =
          response.data.getTenderByUuid.data.tendererTypes;
      } else {
        console.error(response.data.getTenderByUuid.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getClarificationByTenderUuid() {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_ALL_CLARIFICATION_UUID_EVALUATION_REPORT,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          tenderUuid: this.tenderUuid,
          input: {
            fields: [],
            mustHaveFilters: [
              {
                fieldName: 'isPE',
                operation: 'EQ',
                value1: 'false'
              }
            ],
            page: 1,
            pageSize: 1
          },
        }
      });

      this.reportData.entityDetail.numberOfClarificationRequest =
        response.data?.getClarificationByTenderUuid?.numberOfRecords;

    } catch (e) {
      console.error(e);
    }
  }

  // getTendererEvaluationScoreByTendererEvaluationUuid
  // getEvaluationScoreByTeamMemberAndSubmission
  async getTendererEvaluationScoreByTendererEvaluationUuid(
    stageUuid: string,
    tendererEvaluationUuid: string,
  ) {
    try {
      return await this.paginatedDataService.getAllData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_TENDERER_EVALUATION_SCORE_BY_TENDERER_EVALUATION_UUID_EVALUATION_REPORT,
        additionalVariables: {
          stageUuid: stageUuid,
          tendererEvaluationUuid: tendererEvaluationUuid
        },
        mustHaveFilters: [],
      });

    } catch (e) {
      console.error(e);
      this.setErrorResponse('Failed when fetching submissions details', e);
      return [];
    }
  }
}

export interface EvaluationReportGeneratorChange {
  steps?: DataGenerationStep[];
  loading?: boolean;
  message?: string;
  error?: string;
  failed?: boolean;
  completed?: boolean;
  data?: any;
}
