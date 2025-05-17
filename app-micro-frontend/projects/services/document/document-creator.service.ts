import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../apollo.config';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  DocumentCreationData,
  DocumentCreatorComponent,
} from './document-creator/document-creator.component';
import { DataFetcherQueue } from '../../shared/components/data-fetcher-circular-progress/data-fetcher-circular-progress.component';
import { GraphqlService } from '../graphql.service';
import {
  GET_CREATED_DOCUMENT_QUERY,
  GET_CREATED_DOCUMENT_QUERY_WITH_CREATOR,
} from './store/document-creator.graphql';
import { TemplateDocumentTypesEnum } from './store/document-creator.model';
import { MustHaveFilter } from '../../shared/components/paginated-data-table/must-have-filters.model';
import { GET_TEMPLATES } from '../../modules/templates-editor/store/template-editor.graphql';
import { DataRequestInput } from '../../shared/components/paginated-data-table/data-page.model';
import {
  PublishTemplateData,
  TemplatePublisherComponent,
} from './document-creator/template-publisher/template-publisher.component';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  TemplateExporterComponent,
  TemplateExporterData,
} from '../../modules/templates-editor/template-exporter/template-exporter.component';
import { NestUtils } from '../../shared/utils/nest.utils';
import { HasLoopedFetcher } from '../../modules/nest-tender-initiation/approved-requisitions/manage-merged-requisitions/tender-document-creator/tender-document-creator.component';

export enum DocumentCreationChangeType {
  CREATION_FINISHED = 'CREATION_FINISHED',
  CREATION_FAILED = 'CREATION_FAILED',
  CREATION_STARTED = 'CREATION_STARTED',
  CREATION_CANCELLED = 'CREATION_CANCELLED',
}

export interface DocumentCreationChange {
  changeType: DocumentCreationChangeType;
}

export interface OnDocumentFinishData {
  documentUuid?: string;
  pdfDocumentUuid?: string;
  payload?: DocumentCreationData;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentCreatorService {
  documentCreatorComponent: MatDialogRef<DocumentCreatorComponent>;
  templatePublisherComponent: MatDialogRef<TemplatePublisherComponent>;
  templateExporterComponent: MatDialogRef<TemplateExporterComponent>;

  private changesEvent = new Subject<DocumentCreationChange>();

  private itemizationItemsCount = new BehaviorSubject(<any>null);
  itemizationItemCount$ = this.itemizationItemsCount.asObservable();

  constructor(private dialog: MatDialog, private apollo: GraphqlService) { }

  start(
    data: DocumentCreationData,
    onFinish?: (data: OnDocumentFinishData) => void
  ): void {
    this.broadcastChange({
      changeType: DocumentCreationChangeType.CREATION_STARTED,
    });
    this.documentCreatorComponent = this.dialog.open(DocumentCreatorComponent, {
      data,
      disableClose: true,
    });

    this.documentCreatorComponent.afterClosed().subscribe((result) => {
      if (result) {
        this.broadcastChange({
          changeType: DocumentCreationChangeType.CREATION_FINISHED,
        });
        onFinish({
          documentUuid: result?.documentUuid,
          pdfDocumentUuid: result?.pdfDocumentUuid,
          payload: data,
        });
      } else {
        this.broadcastChange({
          changeType: DocumentCreationChangeType.CREATION_CANCELLED,
        });
      }
    });
  }

  broadcastChange(change: DocumentCreationChange) {
    this.changesEvent.next(change);
  }

  getChange() {
    return this.changesEvent.asObservable();
  }

  updateDataFetcherQueueItem(
    field: string,
    newData: DataFetcherQueue
  ): boolean {
    const queue =
      this.documentCreatorComponent.componentInstance.dataFetcher.dataFetcher
        .dataFetcherQueue;
    const index = queue.findIndex((item) => item.field === field);

    if (index >= 0) {
      queue[index] = newData;
      return true;
    } else {
      console.warn(`Could not find data fetcher item with field '${field}'`);
      return false;
    }
  }

  async getDocumentByItemUuidAndDocumentType(
    uuid: string,
    documentType: TemplateDocumentTypesEnum = TemplateDocumentTypesEnum.TENDER_DOCUMENT,
    mustBePublished = false,
    withCreatedBy = false
  ): Promise<{
    documentUuid: string;
    pdfDocumentUuid: string;
    createdAt: string;
  }> {
    let results = {
      documentUuid: null,
      pdfDocumentUuid: null,
      createdAt: null,
      createdBy: null,
    };

    let variables = {
      itemUuid: uuid,
      type: documentType.toString(),
    };

    if (mustBePublished) {
      variables['publishStatus'] = 'PUBLISHED';
    }

    const response: any = await this.apollo.fetchData({
      apolloNamespace: ApolloNamespace.template,
      query: withCreatedBy
        ? GET_CREATED_DOCUMENT_QUERY_WITH_CREATOR
        : GET_CREATED_DOCUMENT_QUERY,
      variables,
    });

    if (response?.data?.results?.data) {
      let _res = response?.data?.results?.data;
      results.documentUuid = _res.uuid;
      results.pdfDocumentUuid = _res.fileUuid;
      results.createdAt = _res.createdAt;
      results.createdBy = _res.createdBy;
    }

    return results;
  }

  updateData(data: any): void {
    this.documentCreatorComponent.componentInstance.updateData(data);
  }

  publishTemplate(
    templateUuid: string,
    templateName: string,
    onFinish?: (data: any) => void
  ) {
    let publishTemplateData: PublishTemplateData = {
      templateUuid,
      templateName,
    };

    this.templatePublisherComponent = this.dialog.open(
      TemplatePublisherComponent,
      {
        data: publishTemplateData,
        disableClose: true,
      }
    );

    this.templatePublisherComponent.afterClosed().subscribe((result) => {
      if (result) {
        onFinish({
          message: result?.message,
          success: result?.success,
        });
      }
    });
  }

  exportTemplate(
    templateUuid: string,
    templateName: string,
    onFinish?: (data: any) => void
  ) {
    let data: TemplateExporterData = {
      templateUuid,
      templateName,
    };

    this.templateExporterComponent = this.dialog.open(
      TemplateExporterComponent,
      {
        data: data,
        width: '40%',
      }
    );

    this.templateExporterComponent.afterClosed().subscribe((result) => {
      if (result) {
        onFinish({
          message: result?.message,
          success: result?.success,
        });
      }
    });
  }

  async getTemplateByUuid(templateUuid: string) {
    try {
      let filters: MustHaveFilter[] = [
        {
          fieldName: 'uuid',
          operation: 'EQ',
          value1: templateUuid,
        },
      ];

      let input: DataRequestInput = {
        page: 1,
        pageSize: 1,
        fields: [],
        mustHaveFilters: filters,
      };

      const response: any = await this.apollo.fetchData({
        query: GET_TEMPLATES,
        apolloNamespace: ApolloNamespace.template,
        variables: {
          input: input,
        },
      });

      if (response.data.items.rows) {
        return response.data.items.rows[0];
      }
    } catch (e) { }
  }

  sortMergedMainProcurementRequisition(
    mergedMainProcurementRequisition: any,
    entityType?: string
  ) {
    let _mergedMainProcurementRequisition = JSON.parse(
      JSON.stringify(mergedMainProcurementRequisition)
    );
    mergedMainProcurementRequisition = NestUtils.sortArrays(
      _mergedMainProcurementRequisition,
      'mergedProcurementRequisitions',
      'id',
      'ASC'
    );

    let mergedRequisitionItems: any;
    if (entityType == 'CONTRACT') {
      // mergedRequisitionItems = JSON.parse(
      //   JSON.stringify(mergedMainProcurementRequisition)
      // );
      // this.sortMergedRequisitionItems(
      //   mergedRequisitionItems?.mergedProcurementRequisitionItems
      // );
      for (const requisition of mergedMainProcurementRequisition.mergedProcurementRequisitions) {
        const mergedRequisitionItems =
          requisition.mergedProcurementRequisitionItems;
        this.sortMergedRequisitionItems(mergedRequisitionItems);
      }
    } else {
      //
      //   'sortMergedMainProcurementRequisition:mergedMainProcurementRequisition',
      //   mergedMainProcurementRequisition
      // );

      for (const requisition of mergedMainProcurementRequisition.mergedProcurementRequisitions) {
        const mergedRequisitionItems =
          requisition.mergedProcurementRequisitionItems;
        this.sortMergedRequisitionItems(mergedRequisitionItems);
      }
    }
  }

  sortMergedRequisitionItems(mergedRequisitionItems: any) {
    NestUtils.sortArrays(
      mergedRequisitionItems,
      'mergedProcurementRequisitionItems',
      'id',
      'ASC'
    );
    for (const item of mergedRequisitionItems) {
      // if(item.mergedProcurementRequisitionAttachmentList.length > 0){
      //   this.hasAttachments = true;
      // }
      NestUtils.sortArrays(item, 'mergedRequisitionItemizations', 'id', 'ASC');

      NestUtils.sortArraysOfStrings(
        item,
        'mergedProcurementRequisitionAttachments',
        'attachmentType',
        'DESC'
      );
      // Accessing the element of mergedRequisitionItemizations
      const mergedRequisitionItemizations = item.mergedRequisitionItemizations;

      // Looping through the mergedRequisitionItemizations
      for (const itemization of mergedRequisitionItemizations) {
        NestUtils.sortArrays(
          itemization,
          'mergedInspectionTestResponseList',
          'id',
          'ASC'
        );

        NestUtils.sortArrays(itemization, 'mergedSpecifications', 'id', 'ASC');

        NestUtils.sortArrays(itemization, 'needAfterSales', 'id', 'ASC');
      }
    }
  }

  async getTemplatesByFilters(filters: MustHaveFilter[]): Promise<any[]> {
    try {
      let input: DataRequestInput = {
        page: 1,
        pageSize: 20,
        fields: [],
        mustHaveFilters: filters,
      };

      const response: any = await this.apollo.fetchData({
        query: GET_TEMPLATES,
        apolloNamespace: ApolloNamespace.template,
        variables: {
          input: input,
        },
      });

      if (response.data.items.rows) {
        return response.data.items.rows;
      }
    } catch (e) { }
    return [];
  }

  // Function to update itemization variable based on the loops in Requisition Details
  updateItemizationLoopedFetcher(hasLoopedFetcher: HasLoopedFetcher): void {
    this.itemizationItemsCount.next(hasLoopedFetcher);
  }

  resetItemizationLoopedFetcher(): void {
    this.itemizationItemsCount.next(null);
  }


  async mergedMainProcurementRequisitionByUuidMapper(reqObject: any) {
    return {
      id: reqObject.id,
      uuid: reqObject.uuid,
      objectActualDateViewEntity: reqObject.objectActualDateViewEntity,
      tender: {
        uuid: reqObject.tender.uuid,
        tenderSubCategoryAcronym: reqObject.tender.tenderSubCategoryAcronym,
        procurementEntityUuid: reqObject.tender.procurementEntityUuid,
        tenderSubCategoryUuid: reqObject.tender.tenderSubCategoryUuid,
        descriptionOfTheProcurement: reqObject.tender.descriptionOfTheProcurement,
        procurementCategoryName: reqObject.tender.procurementCategoryName,
        procurementCategoryUuid: reqObject.tender.procurementCategoryUuid,
        tenderSubCategoryId: reqObject.tender.tenderSubCategoryId,
        procurementCategoryAcronym: reqObject.tender.procurementCategoryAcronym,
        tenderSubCategoryName: reqObject.tender.tenderSubCategoryName,
        tenderNumber: reqObject.tender.tenderNumber,
        donorTenderNumber: reqObject.tender.donorTenderNumber,
        financialYearCode: reqObject.tender?.financialYearCode,
        annualProcurementPlan: {
          financialYearCode: reqObject.annualProcurementPlan.financialYearCode,
          generalProcurementNoticeAdvertDate: reqObject.annualProcurementPlan.generalProcurementNoticeAdvertDate
        },
        contractType: {
          name: reqObject.contractType.name
        },
        estimatedBudget: reqObject.estimatedBudget,
        tendererTypes: reqObject.tendererTypes,
        procurementMethod: {
          uuid: reqObject.procurementMethod.uuid,
          description: reqObject.procurementMethod.description
        },
        selectionMethod: {
          uuid: reqObject.selectionMethod.uuid,
          name: reqObject.selectionMethod.name
        },
        sourceOfFund: {
          uuid: reqObject.sourceOfFund.uuid,
          name: reqObject.sourceOfFund.name
        }
      }
    };
  }
}
