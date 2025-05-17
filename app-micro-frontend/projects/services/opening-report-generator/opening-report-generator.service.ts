import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../apollo.config';
import { GraphqlService } from "../graphql.service";
import { Subject } from "rxjs";
import {
  DataRequestInputInput,
  EntityObjectTypeEnum,
  ObjectForEntityDetail
} from "../../modules/nest-app/store/tender/tender.model";
import { SearchOperation } from "../../store/global-interfaces/organizationHiarachy";
import { PaginatorInput } from "../../website/shared/models/web-paginator.model";
import { DataGenerationStep } from "../../shared/components/data-generation-step/data-generation-step.component";
import { AttachmentService } from "../attachment.service";
import {
  FIND_PRE_QUALIFICATIONS_BY_UID_OPENING, GET_FRAMEWORK_LOTS_BY_FRAMEWORK_PAGINATED_OPENING,
  GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_OPENING,
  GET_MERGED_TENDER_BY_UUID_OPENING, GET_ONE_FRAMEWORK_BY_UUID_OPENING,
  GET_PROCURING_ENTITY_BY_UUID_OPENING,
  GET_TENDERER_SUBMISSION_EVALUATION_REPORT_OPENING
} from "./store/opening-report-generator.graphql";
import { OpeningReportEntity } from "./store/opening-report-generator.model";
import { SettingsService } from "../settings.service";
import {
  AwardHelperService
} from "../../modules/nest-tender-award/award-helper.service";

@Injectable({
  providedIn: 'root',
})

export class OpeningReportGeneratorService {
  logoUuid: string;
  openingReportGeneratorChange: OpeningReportGeneratorChange = {
    loading: true,
    completed: false,
    error: null,
    steps: [],
    message: 'loading',
    reportTitle: '',
    data: null
  }

  openingReportGenerationSteps: DataGenerationStep[] = [
    {
      code: 'INITIALIZING',
      title: 'Initializing',
      stage: 'ON_PROGRESS'
    },
    {
      code: 'GENERATING',
      title: 'Generating report',
      stage: 'PENDING'
    },
    {
      code: 'FINISHED',
      title: 'Finished',
      stage: 'PENDING'
    }
  ];

  mainEntityUuid: string;
  entityDetail: OpeningReportEntity;
  entityType: EntityObjectTypeEnum;

  openingReportGeneratorChangeEvent = new Subject<OpeningReportGeneratorChange>();

  pageSize: number = 30;
  pageNumber: number = 1;

  objectForEntityDetail: ObjectForEntityDetail;
  entityLotList = [];
  lotDetailMap: {
    tendererList?: [];
    lotDetail?: any
  };

  dataRequestInputInput: DataRequestInputInput;
  mustHaveFilters: any = [
    {
      fieldName: "submitted",
      operation: SearchOperation.EQ,
      value1: "true",
    },
  ];

  customMainFilters = {
    fieldName: "entityUuid",
    operation: SearchOperation.EQ,
    value1: ""
  };

  paginatorInput: PaginatorInput = {
    loading: true,
  };

  constructor(
    private apollo: GraphqlService,
    private settingsService: SettingsService,
    private awardHelperService: AwardHelperService,
    private attachmentService: AttachmentService,
  ) {
  }

  generateOpeningReport(mainEntityUuid: string, entityType: EntityObjectTypeEnum = EntityObjectTypeEnum.TENDER) {
    this.entityType = entityType
    this.mainEntityUuid = mainEntityUuid;
    this.getDetails();
  }

  getDetails() {
    this.resetLoadingProgress();
    this.startReportGeneration().then();
  }

  resetLoadingProgress() {
    this.lotDetailMap = {};
    this.resetPaginator();
    this.openingReportGenerationSteps = [
      {
        code: 'INITIALIZING',
        title: 'Initializing',
        stage: 'ON_PROGRESS'
      },
      {
        code: 'GENERATING',
        title: 'Generating report',
        stage: 'PENDING'
      },
      {
        code: 'FINISHED',
        title: 'Finished',
        stage: 'PENDING'
      }
    ];

    this.openingReportGeneratorChange = {
      loading: true,
      completed: false,
      error: null,
      steps: this.openingReportGenerationSteps,
      message: 'loading',
      data: null
    }

    this.broadcastDataStateChange(this.openingReportGeneratorChange);
  }

  async startReportGeneration() {
    try {
      await this.updateCurrentStage('GENERATING');
      this.openingReportGeneratorChange.message = 'Getting tender details';
      this.broadcastDataStateChange(this.openingReportGeneratorChange);
      await this.getEntityByUuid(this.entityType);

      this.openingReportGeneratorChange.message = 'Getting tender additional' +
        ' details';
      this.broadcastDataStateChange(this.openingReportGeneratorChange);
      await this.getTenderAdditionalDetail(this.entityDetail.id,this.entityType);

      this.lotDetailMap = {};
      this.openingReportGeneratorChange.message = 'Getting submissions details';
      this.broadcastDataStateChange(this.openingReportGeneratorChange);
      await this.getSubmissionsPaginatedByLot();

      /*** Handle last stage finishing **/
      this.openingReportGeneratorChange.message = 'Completed';
      this.openingReportGeneratorChange.loading = false;
      this.openingReportGeneratorChange.completed = true;
      await this.updateCurrentStage('FINISHED');

    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error or perform necessary actions
    }
  }

  getChange() {
    return this.openingReportGeneratorChangeEvent.asObservable();
  }

  broadcastDataStateChange(change: OpeningReportGeneratorChange) {
    this.openingReportGeneratorChangeEvent.next(change);
  }

  async getEntityByUuid(entityType: EntityObjectTypeEnum) {
    switch (entityType) {
      case EntityObjectTypeEnum.PLANNED_TENDER:
        this.openingReportGeneratorChange.reportTitle = 'Pre-Qualification Opening Report';
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        await this.findPreQualificationByUuid();
        break;
      case EntityObjectTypeEnum.TENDER:
        this.openingReportGeneratorChange.reportTitle = 'Tender Opening Report';
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        /// TODO CHECK TENDER STATE
        await this.getMergedMainProcurementRequisitionByUuid();
        await this.getMergedProcurementRequisitionDataByMainEntity();
        break;
      case EntityObjectTypeEnum.FRAMEWORK:
        this.openingReportGeneratorChange.reportTitle = 'Framework Opening Report';
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        await this.getOneFramework();
        await this.getFrameworkLotsByFrameworkPaginated();
        break;
      default:
        break;
    }
  }

  updateCurrentStage(code: string, action: string = null): Promise<boolean> {
    return new Promise<any>((resolve) => {
      for (let i = 0; i < this.openingReportGeneratorChange.steps.length; ++i) {
        const item = this.openingReportGeneratorChange.steps[i];

        if (action) {
          if (item.code == code) {
            item.stage = 'FAILED';
          }
        } else {
          if (item.code == code) {
            item.stage = (code == 'FINISHED') ? 'FINISHED' : 'ON_PROGRESS';
          } else if (item.stage == 'ON_PROGRESS') {
            item.stage = 'FINISHED';
          }
        }

        this.openingReportGeneratorChange.steps[i] = item;
      }

      this.broadcastDataStateChange(this.openingReportGeneratorChange);
      resolve(true);
    });
  }

  /** fetch pre-qualification by entity uuid */
  async findPreQualificationByUuid() {
    try {
      const response: any = await this.apollo.fetchData({
        query: FIND_PRE_QUALIFICATIONS_BY_UID_OPENING,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: this.mainEntityUuid
        }
      });
      if (response.data.findPreQualificationByUuid?.code == 9000) {
        const resultData = response.data.findPreQualificationByUuid.data;
        const tenderData = resultData.tender;
        this.entityDetail = {
          id: resultData.id,
          uuid: resultData.uuid,
          entityUuid: resultData.uuid,
          description: tenderData.descriptionOfTheProcurement,
          procurementEntityName: tenderData.procuringEntityName,
          openingDateTime: resultData?.prequalificationOpeningDate,
          openingReportUuid: resultData.openingReportUuid,
          entityCategoryAcronym: tenderData.procurementCategoryAcronym,
          numberOfLots: 1,
          submissionOrOpeningDate: resultData?.prequalificationActualDateView?.preSubmissionOrOpeningDate,
          procuringEntityUuid: tenderData.procurementEntityUuid,
          financialYearCode: tenderData.financialYearCode,
          entityStatus: resultData.prequalificationStatus,
          tender: {
            procurementMethod: {
              description: tenderData?.procurementMethod?.description
            }
          },
          entityNumber: tenderData.tenderNumber
        }

        this.entityLotList = [
          {
            uuid: this.entityDetail.uuid,
            lotNumber: this.entityDetail.entityNumber,
            lotDescription: this.entityDetail.description
          }
        ];
        /** emit main tender details mapped **/
        this.openingReportGeneratorChange.data = {
          ...this.openingReportGeneratorChange.data,
          tenderDetail: this.entityDetail,
          entityLotList: this.entityLotList
        }

        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        await this.handlePeLogo();
      } else {
        const message = response.data.findPreQualificationByUuid.message;
        console.error(message);
        await this.updateCurrentStage('INITIALIZING', 'FAILED');
        this.setErrorResponse('Failed when fetching Main tender details', message);
      }
    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
      this.setErrorResponse('Failed when fetching Main tender details', e);
    }
  }

  setTenderFilter(tenderUuid: string) {
    if (this.openingReportGeneratorChange.failed) {
      return;
    }
    this.customMainFilters.value1 = tenderUuid;
    this.mustHaveFilters.push(this.customMainFilters);
    this.mustHaveFilters = this.settingsService.removeDuplicates(
      this.mustHaveFilters,
      'value1'
    );

    this.dataRequestInputInput = {
      mustHaveFilters: this.mustHaveFilters
    }
  }

  resetPaginator() {
    this.pageSize = 30;
    this.pageNumber = 1;
    this.paginatorInput = {};
  }


  async getSubmissionsPaginatedByLot() {
    for (const lot of this.entityLotList) {

      this.lotDetailMap[lot.uuid] = {
        lotDetail: lot,
        tendererList: []
      };

      this.setTenderFilter(lot.uuid);
      await this.getSubmissionsPaginated(lot.uuid);
    }
  }

  async getMergedMainProcurementRequisitionByUuid() {
    try {
      this.openingReportGeneratorChange.message = 'Getting Main tender details';
      this.broadcastDataStateChange(this.openingReportGeneratorChange);

      let response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: GET_MERGED_TENDER_BY_UUID_OPENING,
        variables: {
          uuid: this.mainEntityUuid
        },
      });

      if (response.data.getMergedMainProcurementRequisitionByUuid.code === 9000) {
        const resultData = response.data.getMergedMainProcurementRequisitionByUuid.data;

        this.entityDetail = {
          id: resultData.id,
          uuid: resultData.uuid,
          entityUuid: resultData.uuid,
          description: resultData.description,
          procurementEntityName: resultData.procurementEntityName,
          openingDateTime: resultData.tenderOpenningDateTime,
          entityCategoryAcronym: resultData.procurementCategoryAcronym,
          openingReportUuid: resultData.openingReportUuid,
          numberOfLots: resultData.numberOfLots,
          submissionOrOpeningDate: resultData?.objectActualDateViewEntity?.submissionOrOpeningDate,
          procuringEntityUuid: resultData.procuringEntityUuid,
          financialYearCode: resultData.financialYearCode,
          entityStatus: resultData.tenderState,
          tender: {
            procurementMethod: {
              description: resultData.tender?.procurementMethod?.description
            }
          },
          entityNumber: resultData.tenderNumber
        }

        /** emit main tender details mapped **/
        this.openingReportGeneratorChange.data = {
          ...this.openingReportGeneratorChange.data,
          tenderDetail: this.entityDetail
        }
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        await this.handlePeLogo();
      } else {
        const message = response.data?.getMergedMainProcurementRequisitionByUuid?.message;
        console.error(message);
        await this.updateCurrentStage('INITIALIZING', 'FAILED');
        this.setErrorResponse('Failed when fetching Main tender details', message);
      }
    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
      this.setErrorResponse('Failed when fetching Main tender details', e);
    }
  }

  async handlePeLogo() {

    if (this.entityDetail && this.entityDetail?.procuringEntityUuid) {
      /*** Fetch national emblem as default logo*/
      const logoUuid = '279ba353-f642-4f3b-913e-ccb25f982031'; /// TODO Hardcoded national emblem uuid
      const defaultLogo = await this.fetchLogoByUuid(logoUuid);

      if (defaultLogo) {
        /** emit default logo **/
        this.openingReportGeneratorChange.message = 'Completed fetching national emblem';
        this.openingReportGeneratorChange.data = {
          ...this.openingReportGeneratorChange.data,
          defaultLogo: defaultLogo
        }
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        /** end of default logo **/
      }
      await this.getProcuringEntityByUuid(this.entityDetail?.procuringEntityUuid);

      if (this.logoUuid) {
        /*** Fetch pe log as provided logo*/
        const peLogo = await this.fetchLogoByUuid(this.logoUuid);
        if (peLogo) {
          /** emit pe logo **/
          this.openingReportGeneratorChange.message = 'Completed fetching PE logo';

          this.openingReportGeneratorChange.data = {
            ...this.openingReportGeneratorChange.data,
            logoData: peLogo
          }
          this.broadcastDataStateChange(this.openingReportGeneratorChange);
          /** end of pe logo **/
        }
      }

    }
  }

  async getMergedProcurementRequisitionDataByMainEntity() {
    try {
      if (this.openingReportGeneratorChange.failed) {
        return;
      }

      if (this.pageNumber == 1) {
        this.entityLotList = [];
        this.openingReportGeneratorChange.message = 'Getting tender details details';
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
      }

      let response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_OPENING,
        variables: {
          mainEntityUuid: this.mainEntityUuid,
          input: {
            page: this.pageNumber,
            pageSize: this.pageSize
          },
        },
      });
      const results = response.data.items;
      const items = results.rows || [];
      this.entityLotList = [...this.entityLotList, ...items];

      /// make this function recursive
      this.paginatorInput = {
        loading: false,
        first: results?.first ?? false,
        last: results?.last ?? false,
        hasNext: results?.hasNext,
        hasPrevious: results?.hasPrevious,
        currentPage: results?.currentPage,
        numberOfRecords: results?.numberOfRecords,
        pageSize: results?.pageSize,
        totalPages: results?.totalPages,
        totalRecords: results?.totalRecords,
        recordsFilteredCount: results?.recordsFilteredCount,
      };

      /// Set lot details
      if (this.paginatorInput.hasNext && this.paginatorInput.numberOfRecords !== 0) {
        this.pageNumber = this.pageNumber + 1;
        await this.getMergedProcurementRequisitionDataByMainEntity();
      } else {
        /** emit lot details mapped **/
        this.openingReportGeneratorChange.data = {
          ...this.openingReportGeneratorChange.data,
          entityLotList: this.entityLotList
        }
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        /** end of emitting lot detail mapped **/

        this.resetPaginator();
      }

    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
      this.setErrorResponse('Failed when fetching tender details', e);
    }
  }


  async getSubmissionsPaginated(lotUuid: string) {
    try {
      if (this.openingReportGeneratorChange.failed) {
        return;
      }

      if (this.pageNumber == 1) {
        // this.lotDetailMap = {};
        // await this.updateCurrentStage('GENERATING');
        // this.openingReportGeneratorChange.message = 'Getting submissions details';
        // this.broadcastDataStateChange(this.openingReportGeneratorChange);
      }

      let response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_TENDERER_SUBMISSION_EVALUATION_REPORT_OPENING,
        variables: {
          input: {
            ...this.dataRequestInputInput,
            fields: [
              {
                fieldName: "id",
                isSortable: true,
                orderDirection: 'ASC'
              }
            ],
            page: this.pageNumber,
            pageSize: this.pageSize
          },
        },
      });
      const results = response.data.items;
      const items = results.rows || [];

      if (this.pageNumber == 1) {
        this.lotDetailMap[lotUuid] = {
          ...this.lotDetailMap[lotUuid],
          tendererList: []
        };
      }
      const previousList = this.lotDetailMap[lotUuid].tendererList;
      this.lotDetailMap[lotUuid].tendererList = [...previousList, ...items];

      /// make this function recursive
      this.paginatorInput = {
        loading: false,
        first: results?.first ?? false,
        last: results?.last ?? false,
        hasNext: results?.hasNext,
        hasPrevious: results?.hasPrevious,
        currentPage: results?.currentPage,
        numberOfRecords: results?.numberOfRecords,
        pageSize: results?.pageSize,
        totalPages: results?.totalPages,
        totalRecords: results?.totalRecords,
        recordsFilteredCount: results?.recordsFilteredCount,
      };

      if (this.paginatorInput.hasNext && this.paginatorInput.numberOfRecords !== 0) {
        this.pageNumber = this.pageNumber + 1;
        await this.getSubmissionsPaginated(lotUuid);
      } else if (!this.paginatorInput.hasNext) {
        /** emit evaluation criteria mapped **/
        this.openingReportGeneratorChange.data = {
          ...this.openingReportGeneratorChange.data,
          lotListMap: this.lotDetailMap
        }
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        /** end of emitting evaluation criteria mapped **/

        this.resetPaginator();
      }

    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('GENERATING', 'FAILED');
      this.setErrorResponse('Failed when fetching submissions details', e);
    }
  }


  async fetchLogoByUuid(logoUuid: string) {
    this.openingReportGeneratorChange.message = 'Getting logo details';
    this.broadcastDataStateChange(this.openingReportGeneratorChange);
    return await this.attachmentService.getPELogo(
      logoUuid
    );
  }

  setErrorResponse(message: string, error: string) {
    this.openingReportGeneratorChange.message = message;
    this.openingReportGeneratorChange.failed = true;
    this.openingReportGeneratorChange.loading = false;
    this.openingReportGeneratorChange.error = error;
    this.broadcastDataStateChange(this.openingReportGeneratorChange);
  }

  async getProcuringEntityByUuid(procuringEntityUuid: string) {
    try {
      this.openingReportGeneratorChange.message = 'Getting PE details';
      this.broadcastDataStateChange(this.openingReportGeneratorChange);
      const response: any = await this.apollo.fetchData({
        query: GET_PROCURING_ENTITY_BY_UUID_OPENING,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: procuringEntityUuid,
        }
      });

      if (response.data.findProcuringEntityByUuid.code === 9000) {
        this.logoUuid = response.data.findProcuringEntityByUuid.data.logoUuid;
      } else {
        const message = response.data.findProcuringEntityByUuid.message;
        console.error(message);
        await this.updateCurrentStage('INITIALIZING', 'FAILED');
        this.setErrorResponse('Failed when fetching Institution details', message);
      }
    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
      this.setErrorResponse('Failed when fetching Institution details', e);
    }
  }


  /** fetch framework by entity uuid */
  async getOneFramework() {
    try {
      this.openingReportGeneratorChange.message = 'Getting Main Framework details';
      this.broadcastDataStateChange(this.openingReportGeneratorChange);

      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_ONE_FRAMEWORK_BY_UUID_OPENING,
        variables: {
          uuid: this.mainEntityUuid
        }
      });
      if (response.data.getOneFramework?.code == 9000) {
        const framework = response.data.getOneFramework.data;

        this.entityDetail = {
          id: framework.id,
          uuid: framework.uuid,
          entityUuid: framework.uuid,
          description: framework.description,
          procurementEntityName: framework.procuringEntityName,
          entityCategoryAcronym: framework.procurementMethodAcronym,
          openingDateTime: framework.submissionOrOpeningDate,
          openingReportUuid: '',
          numberOfLots: framework.frameworks.length,
          submissionOrOpeningDate: framework?.submissionOrOpeningDate,
          procuringEntityUuid: framework.procuringEntityUuid,
          financialYearCode: framework.financialYearCode,
          entityStatus: framework.frameworkStatus,
          tender: {
            procurementMethod: {
              description: framework.tenderCategoryName
            }
          },
          entityNumber: framework.tenderNumber,
          frameworkNumber: framework.frameworkNumber,
        }

        /** emit main tender details mapped **/
        this.openingReportGeneratorChange.data = {
          ...this.openingReportGeneratorChange.data,
          tenderDetail: this.entityDetail
        }
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        await this.handlePeLogo();
      } else {
        const message = response.data?.getMergedMainProcurementRequisitionByUuid?.message;
        console.error(message);
        await this.updateCurrentStage('INITIALIZING', 'FAILED');
        this.setErrorResponse('Failed when fetching Main tender details', message);
      }
    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
      this.setErrorResponse('Failed when fetching Main tender details', e);
    }
  }

  async getFrameworkLotsByFrameworkPaginated() {
    try {
      if (this.openingReportGeneratorChange.failed) {
        return;
      }

      if (this.pageNumber == 1) {
        this.entityLotList = [];
        this.openingReportGeneratorChange.message = 'Getting tender details details';
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
      }

      let response: any = await this.apollo.fetchData({
        query: GET_FRAMEWORK_LOTS_BY_FRAMEWORK_PAGINATED_OPENING,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          input: {
            page: this.pageNumber,
            pageSize: this.pageSize,
            mustHaveFilters: [
              {
                fieldName: "frameworkMain.uuid",
                operation: 'EQ',
                value1: this.mainEntityUuid,
              }
            ]
          },
        },
      });
      const results = response.data.items;
      const items = results.rows || [];
      this.entityLotList = [...this.entityLotList, ...items];

      /// make this function recursive
      this.paginatorInput = {
        loading: false,
        first: results?.first ?? false,
        hasNext: results?.hasNext,
        hasPrevious: results?.hasPrevious,
        currentPage: results?.currentPage,
        numberOfRecords: results?.numberOfRecords,
        pageSize: results?.pageSize,
        totalPages: results?.totalPages,
        totalRecords: results?.totalRecords,
        recordsFilteredCount: results?.recordsFilteredCount,
      };

      /// Set lot details
      if (this.paginatorInput.hasNext && this.paginatorInput.numberOfRecords !== 0) {
        this.pageNumber = this.pageNumber + 1;
        await this.getFrameworkLotsByFrameworkPaginated();
      } else {
        /** emit lot details mapped **/
        this.openingReportGeneratorChange.data = {
          ...this.openingReportGeneratorChange.data,
          entityLotList: this.entityLotList
        }
        this.broadcastDataStateChange(this.openingReportGeneratorChange);
        /** end of emitting lot detail mapped **/

        this.resetPaginator();
      }

    } catch (e) {
      console.error(e);
      await this.updateCurrentStage('INITIALIZING', 'FAILED');
      this.setErrorResponse('Failed when fetching tender details', e);
    }
  }

  async getTenderAdditionalDetail(id: number,  entityType: string) {
    const data =
      await this.awardHelperService.setTenderWorkspaceForAward(
        id,
        entityType
      );

    this.openingReportGeneratorChange.data = {
      ...this.openingReportGeneratorChange.data,
      tenderSecurityInfo: data
    }
  }
}

export interface OpeningReportGeneratorChange {
  steps?: DataGenerationStep[];
  loading?: boolean;
  message?: string;
  reportTitle?: string;
  error?: string;
  failed?: boolean;
  completed?: boolean;
  data?: any;
}
