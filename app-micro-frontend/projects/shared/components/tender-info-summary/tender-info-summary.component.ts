import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from "../../../services/graphql.service";
import { PublicTendersTenderCalendarDate } from "../../../website/store/public-tenders-item.model";
import { MergedProcurementRequisition } from "../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model";
import { GET_MERGED_PROCUREMENT_REQUISITIONS_BY_MERGED_MAIN_UUID_CLASS_TENDER, GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI_SUBMISSION } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { EntityTypeEnum } from '../../../services/team.service';
import { FIND_PRE_QUALIFICATIONS_BY_UID } from 'src/app/modules/nest-pre-qualification/store/pre-qualification.graphql';
import { PreQualification } from 'src/app/modules/nest-pre-qualification/store/pre-qualification.model';
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromState from "../../../modules/nest-app/store/nest-app.reducer";
import { upsertTenderEntityDetail } from "../percentage-progress-bar/store/submission-progress/submission-progress.actions";
import { EntityInfoSummary } from "./store/entity-info-summary.model";
import { TemplateDocumentTypesEnum } from "../../../services/document/store/document-creator.model";
import { DocumentReaderService } from "../../../modules/document-reader/services/document-reader.service";
import { GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_SUBMISSION } from "../../../modules/nest-tenderer/store/submission/submission.graphql";
import {
  GET_ONE_FRAMEWORK_LOT_SUBMISSION_VIEW,
  GET_ONE_FRAMEWORK_SUBMISSION_VIEW
} from "../../../modules/nest-framework-agreement/agreements/agreements.graphql";
import { SettingsService } from "../../../services/settings.service";
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../loader/loader.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-tender-info-summary',
  templateUrl: './tender-info-summary.component.html',
  styleUrls: ['./tender-info-summary.component.scss'],
  standalone: true,
  imports: [LoaderComponent, NgTemplateOutlet, MatButtonModule]
})
export class TenderInfoSummaryComponent implements OnInit {

  @Input() entityUuid: string;
  @Input() entityType: string;
  @Input() useMainMerged: boolean = false;
  @Input() useFrameworkLot: boolean = false;
  @Input() saveEntityDetails: boolean = false;
  @Input() showClarification: boolean = false;
  @Input() showLotSelectionBtn: boolean = false;
  @Output() entityInfoSummaryData = new EventEmitter<EntityInfoSummary>();
  @Output() handleLotDataSelection = new EventEmitter<EntityInfoSummary>();

  loading: boolean = false;
  requisition: MergedProcurementRequisition;
  framework: any;
  preQualification: PreQualification;
  businessLinesTenderLabels?: string;
  contractorClassesLabels?: string;
  entityInfoSummary: EntityInfoSummary;
  displayInfoList: {
    title: string,
    info: string
  }[] = [];

  categoryMap = {
    'G': 'Goods',
    'W': 'Works',
    'C': 'Consultancy',
    'NC': 'Non Consultancy',
  }

  invitationDate: string;
  deadline: string;

  constructor(
    private router: Router,
    private documentReaderService: DocumentReaderService,
    private settingsService: SettingsService,
    private store: Store<fromState.State>,
    private graphqlService: GraphqlService,

  ) { }

  ngOnInit(): void {
    if (this.entityUuid) {
      this.getEntityByUuid(this.entityType as EntityTypeEnum).then(_ => {
        this.generateDisplayInfo();
      });
    }
  }

  async getEntityByUuid(entityType: EntityTypeEnum) {

    if (this.useMainMerged) {
      await this.getMergedMainProcurementRequisitionByUuid();
      return;
    }
    switch (entityType) {
      case EntityTypeEnum.PLANNED_TENDER:
        await this.getPreQualificationByUuid();
        break;
      case EntityTypeEnum.TENDER:
        await this.getRequisitionByUuid();
        break;
      case EntityTypeEnum.FRAMEWORK:
        if (!this.useFrameworkLot) {
          await this.getOneFramework();
        } else {
          await this.getOneFrameworkLot();
        }
        break;
      default:
        break;
    }
  }


  async getOneFrameworkLot() {
    try {
      let response: any = await this.graphqlService.fetchData({
        query: GET_ONE_FRAMEWORK_LOT_SUBMISSION_VIEW,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.entityUuid,
        },
      });
      if (response.data.getOneFrameworkLot?.code == 9000) {
        const lotDetail = response.data.getOneFrameworkLot.data;
        this.framework = lotDetail.frameworkMain;
        this.entityInfoSummary = {
          ...this.entityInfoSummary,
          entityUuid: this.framework.uuid,
          mainEntityUuid: this.framework.uuid,
          entityStatus: this.framework.frameworkStatus,
          hasAddendum: this.framework.hasAddendum,
          financialYearCode: this.framework.financialYearCode,
          entityNumber: this.framework.frameworkNumber,
          lotNumber: lotDetail.lotNumber,
          lotDescription: lotDetail.lotDescription,
          description: this.framework.description,
          procurementCategoryAcronym: this.framework.tenderCategoryName,
          entitySubCategoryName: this.framework.tenderSubCategoryName,
          procuringEntityName: this.framework.procuringEntityName,
          procurementMethodName: this.framework.procurementMethodName,
          hasLot: this.framework.hasLot,
          invitationDate: null,
          entityType:EntityTypeEnum.FRAMEWORK,
          deadline: null
        }

        // Emit if entity has modification
        this.entityInfoSummaryData.emit(this.entityInfoSummary);

        this.loading = false;

        if (this.saveEntityDetails) {
          this.store.dispatch(upsertTenderEntityDetail({ tender: this.entityInfoSummary }));
        }
      } else {
        console.error(response.data.getOneFrameworkLot.message);
      }
    } catch (e) {
      console.error(e);
    }
  }


  async getOneFramework() {
    try {
      let response: any = await this.graphqlService.fetchData({
        query: GET_ONE_FRAMEWORK_SUBMISSION_VIEW,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.entityUuid,
        },
      });
      if (response.data.getOneFramework?.code == 9000) {
        this.framework = response.data.getOneFramework.data;
        this.entityInfoSummary = {
          ...this.entityInfoSummary,
          entityUuid: this.framework.uuid,
          mainEntityUuid: this.framework.uuid,
          hasAddendum: this.framework.hasAddendum,
          financialYearCode: this.framework.financialYearCode,
          entityNumber: this.framework.frameworkNumber,
          lotNumber: this.framework.frameworkNumber,
          entityStatus: this.framework.frameworkStatus,
          lotDescription: this.framework.description,
          description: this.framework.description,
          procurementCategoryAcronym: this.framework.tenderCategoryName,
          entitySubCategoryName: this.framework.tenderSubCategoryName,
          procuringEntityName: this.framework.procuringEntityName,
          procurementMethodName: this.framework.procurementMethodName,
          hasLot: this.framework.hasLot,
          invitationDate: null,
          entityType:EntityTypeEnum.FRAMEWORK,
          deadline: null
        }

        // Emit if entity has modification
        this.entityInfoSummaryData.emit(this.entityInfoSummary);

        this.loading = false;

        if (this.saveEntityDetails) {
          this.store.dispatch(upsertTenderEntityDetail({ tender: this.entityInfoSummary }));
        }
      } else {
        console.error(response.data.getOneFramework.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getPreQualificationByUuid() {
    try {
      this.loading = true;
      const response: any = await this.graphqlService.fetchData({
        query: FIND_PRE_QUALIFICATIONS_BY_UID,
        apolloNamespace:ApolloNamespace.app,
        variables: {
          uuid: this.entityUuid
        }
      });
      if (response.data.findPreQualificationByUuid?.code == 9000) {
        this.preQualification = response.data.findPreQualificationByUuid.data;
        this.entityInfoSummary = {
          ...this.entityInfoSummary,
          entityUuid: this.preQualification.uuid,
          mainEntityUuid: this.preQualification.uuid,
          hasAddendum: this.preQualification.hasAddendum,
          financialYearCode: this.preQualification.tender.financialYearCode,
          entityNumber: this.preQualification.identificationNumber,
          entityStatus: this.preQualification.tender.tenderStatus,
          lotNumber: this.preQualification.identificationNumber,
          lotDescription: this.preQualification.tender.descriptionOfTheProcurement,
          description: this.preQualification.tender.descriptionOfTheProcurement,
          procurementCategoryAcronym: this.preQualification.tender.procurementCategoryAcronym,
          entitySubCategoryName: this.preQualification.tender.tenderSubCategoryName,
          procuringEntityName: this.preQualification.tender.procuringEntityName,
          procurementMethodName: this.preQualification.tender.procurementMethod.description,
          invitationDate: null,
          hasLot: false,
          entityType: EntityTypeEnum.PLANNED_TENDER,
          deadline: null
        }

        // Emit if entity has modification
        this.entityInfoSummaryData.emit(this.entityInfoSummary);

        this.loading = false;

        if (this.saveEntityDetails) {
          this.store.dispatch(upsertTenderEntityDetail({ tender: this.entityInfoSummary }));
        }
      }

    } catch (e) {

    }
  }

  async getMergedMainProcurementRequisitionByUuid() {
    this.loading = true;
    try {
      const response: any = await this.graphqlService.fetchData({
        query: GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_SUBMISSION,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: this.entityUuid
        },
      });

      if (response.data.getMergedMainProcurementRequisitionByUuid?.code === 9000) {
        const mergedMainProcurementRequisition = response.data.getMergedMainProcurementRequisitionByUuid.data;
        this.entityInfoSummary = {
          ...mergedMainProcurementRequisition,
          mainEntityUuid: mergedMainProcurementRequisition.uuid,
          entityUuid: mergedMainProcurementRequisition.uuid,
          financialYearCode: mergedMainProcurementRequisition.tender.financialYearCode,
          entityNumber: mergedMainProcurementRequisition.tender.tenderNumber,
          lotNumber: mergedMainProcurementRequisition.tender.tenderNumber,
          entityStatus: mergedMainProcurementRequisition.tenderState,
          description: mergedMainProcurementRequisition.tender.descriptionOfTheProcurement,
          lotDescription: mergedMainProcurementRequisition.tender.descriptionOfTheProcurement,
          hasAddendum: mergedMainProcurementRequisition.hasAddendum,
          procurementMethodName: mergedMainProcurementRequisition.tender.procurementMethod.description,
          procurementCategoryAcronym: mergedMainProcurementRequisition.tender.procurementCategoryAcronym,
          entitySubCategoryName: mergedMainProcurementRequisition.tender.tenderSubCategoryName,
          procuringEntityName: mergedMainProcurementRequisition.tender.procuringEntityName,
          hasLot: mergedMainProcurementRequisition.hasLot,
          invitationDate: null,
          entityType: EntityTypeEnum.TENDER,
          deadline: null
        }
        await this.getContractorClassesAndBusinessLines(this.entityUuid);
        this.loading = false;


        // Emit if entity has modification
        this.entityInfoSummaryData.emit(this.entityInfoSummary);
      } else {
        this.loading = false;
        console.error(response?.data?.getMergedMainProcurementRequisitionByUuid?.message);
      }
    } catch (e) {
      console.error(e);
    }
  }


  async getContractorClassesAndBusinessLines(uuid: string) {
    let businessLinesTender = [];
    let contractorClasses = [];
    try {
      const response: any = await this.graphqlService.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: GET_MERGED_PROCUREMENT_REQUISITIONS_BY_MERGED_MAIN_UUID_CLASS_TENDER,
        variables: {
          uuid,
        },
      });
      const values: any = response.data.getMergedProcurementRequisitionsByMergedMainUuid;
      if ((values || []).length > 0) {
        values.forEach(item => {
          contractorClasses = [...contractorClasses, ...(item?.contractorClasses ? item?.contractorClasses?.split(',') : [])];
          businessLinesTender = [...businessLinesTender, ...item?.procurementRequisitionBusinessLines || []];
        });
      }
      this.businessLinesTenderLabels = this.settingsService.removeDuplicates(businessLinesTender, 'businessLineId').map(i => i.businessLineName).filter(i => i).join(',');
      this.contractorClassesLabels = contractorClasses.join(',');

    } catch (e) {
      console.error(e.message);

    }
  }

  async getRequisitionByUuid() {
    try {
      this.loading = true;
      const response: any = await this.graphqlService.fetchData({
        query: GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI_SUBMISSION,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: this.entityUuid
        },
      });
      if (response.data.getMergedProcurementRequisitionByUuid?.code === 9000) {
        this.requisition = response?.data.getMergedProcurementRequisitionByUuid.data;
        const mergedMainProcurementRequisition = this.requisition.mergedMainProcurementRequisition;
        this.entityInfoSummary = {
          ...this.entityInfoSummary,
          mainEntityUuid: mergedMainProcurementRequisition.uuid,
          entityUuid: this.requisition.uuid,
          entityStatus: mergedMainProcurementRequisition.tenderState,
          financialYearCode: this.requisition.financialYearCode,
          entityNumber: mergedMainProcurementRequisition.tender.tenderNumber,
          lotNumber: this.requisition.lotNumber,
          lotDescription: this.requisition.lotDescription,
          description: mergedMainProcurementRequisition.tender.descriptionOfTheProcurement,
          hasAddendum: mergedMainProcurementRequisition.hasAddendum,
          procurementMethodName: mergedMainProcurementRequisition.tender.procurementMethod.description,
          procurementCategoryAcronym: mergedMainProcurementRequisition.tender.procurementCategoryAcronym,
          entitySubCategoryName: mergedMainProcurementRequisition.tender.tenderSubCategoryName,
          procuringEntityName: mergedMainProcurementRequisition.tender.procuringEntityName,
          hasLot: mergedMainProcurementRequisition.hasLot,
          invitationDate: null,
          deadline: null
        }
        this.loading = false;

        // Emit if entity has modification
        this.entityInfoSummaryData.emit(this.entityInfoSummary);

        if (this.saveEntityDetails) {
          this.store.dispatch(upsertTenderEntityDetail({ tender: this.entityInfoSummary }));
        }
      } else {
        console.error(response?.data?.getMergedProcurementRequisitionByUuid?.message);
        this.loading = false;
      }
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }


  generateDisplayInfo() {
    this.displayInfoList = [
      {
        title: 'Financial Year',
        info: this.entityInfoSummary?.financialYearCode,
      },
      {
        title: 'Tender Number',
        info: this.entityInfoSummary?.entityNumber,
      },
      {
        title: 'Institution / Organization',
        info: this.entityInfoSummary?.procuringEntityName,
      },
      {
        title: 'Tender Description',
        info: this.entityInfoSummary?.description,
      },

      {
        title: 'Procurement Method',
        info: this.entityInfoSummary?.procurementMethodName,
      },

      {
        title: 'Procurement Category',
        info: this.categoryMap[this.entityInfoSummary?.procurementCategoryAcronym],
      },
      {
        title: 'Tender Sub Category',
        info: this.entityInfoSummary?.entitySubCategoryName,
      },

      {
        title: 'Tender Status',
        info: (this.entityInfoSummary?.entityStatus) ? this.entityInfoSummary?.entityStatus?.replace(/_/g, ' ') : 'UNAVAILABLE',
      },


      {
        title: 'invitationDate',
        info: this.settingsService.formatDate(this.entityInfoSummary?.invitationDate),
      },
      {
        title: 'Deadline',
        info: this.settingsService.formatDate(this.entityInfoSummary?.deadline),
      }
    ]

    if (this.entityInfoSummary?.entityNumber !== this.entityInfoSummary?.lotNumber) {
      this.displayInfoList.splice(2, 0, {
        title: 'Lot Number',
        info: this.entityInfoSummary?.lotNumber,
      });

      this.displayInfoList.splice(5, 0, {
        title: 'Lot Description',
        info: this.entityInfoSummary?.lotDescription,
      });
    }
  }

  setDates() {
    let dates: PublicTendersTenderCalendarDate[] =
      this.requisition.objectsActualCalendarDates.filter(
        (date: PublicTendersTenderCalendarDate) =>
          date.procurementStage.columnName == 'INVITATION'
      );

    if (dates.length > 0) {
      this.invitationDate = dates[0].actualDate;
      this.entityInfoSummary.invitationDate = this.invitationDate;
    }

    dates = this.requisition.objectsActualCalendarDates.filter(
      (date: PublicTendersTenderCalendarDate) =>
        date.procurementStage.columnName == 'SUBMISSION_OR_OPENING'
    );

    if (dates.length > 0) {
      this.deadline = dates[0].actualDate;
      this.entityInfoSummary.deadline = this.deadline;
    }
  }

  async goToClarification() {
    this.router
      .navigate([
        '/nest-tenderer/submission',
        this.entityInfoSummary.mainEntityUuid,
        this.entityInfoSummary.mainEntityUuid,
        this.entityType,
      ], { queryParams: { tab: 'clarifications' } }).then();
  }

  async openTenderDocument(event) {
    await this.documentReaderService.getDocumentByTypeAndItemUuid(
      TemplateDocumentTypesEnum.TENDER_DOCUMENT,
      event.entityUuid
    );
  }
}

