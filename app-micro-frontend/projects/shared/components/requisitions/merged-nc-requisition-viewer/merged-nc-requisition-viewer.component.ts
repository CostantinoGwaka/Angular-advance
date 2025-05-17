import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  MergedProcurementRequisitionItem
} from "../../../../modules/nest-tender-initiation/store/merged-procurement-requisition-item/merged-procurement-requisition-item.model";
import {
  MergedRequisitionItemization
} from "../../../../modules/nest-tender-initiation/store/merged-requisition-itemization/merged-requisition-itemization.model";
import {
  ProcurementRequisitionAttachment
} from "../../../../modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model";
import { AttachmentSharable } from "../../../../store/global-interfaces/organizationHiarachy";
import {
  MergedProcurementRequisition
} from "../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model";
import { Router } from "@angular/router";
import {
  GET_MERGED_NON_CONSULTANCY_REQUISITION_SPECIFICATIONS_BY_MERGED_ITEM_UUID,
  GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_LIGHT,
  GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_LIGHT,
  GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_LIGHT_PUBLIC,
} from "../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql";
import { GraphqlService } from "../../../../services/graphql.service";
import { PaginatedDataService } from '../../../../services/paginated-data.service';
import { Subscription } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SortByPipe } from '../../../pipes/sort-pipe';
import { MatButtonModule } from '@angular/material/button';
import { SharableAttachmentFormComponent } from '../../sharable-attachment-form/sharable-attachment-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { DecimalPipe } from '@angular/common';
import { ApolloNamespace } from "../../../../apollo.config";

@Component({
  selector: 'app-merged-nc-requisition-viewer',
  templateUrl: './merged-nc-requisition-viewer.component.html',
  styleUrls: ['./merged-nc-requisition-viewer.component.scss'],
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, SharableAttachmentFormComponent, MatButtonModule, MatPaginatorModule, DecimalPipe, SortByPipe]
})
export class MergedNcRequisitionViewerComponent implements OnInit, OnChanges, OnDestroy {


  @Input() showMergedRequisitionDetails: boolean = true;
  @Input() showEstimatedBudget: boolean = true;
  @Input() mergedMainProcurementRequisitionUuid: string;

  // TODO: TO BE REMOVED IN ALL COMPONENTS
  mergedProcurementRequisitionItems: MergedProcurementRequisitionItem[] = [];
  toggleViewReqItem: { [uuid: string]: boolean } = {};
  attachmentList = {};
  additionalVariable?: { [key: string]: string }
  panelActivenessStatus: { [id: string]: boolean } = {};
  attachmentSharable = {};
  specification = {};
  mergedProcurementRequisitions: MergedProcurementRequisition[] = [];
  loadingMergedProcurementRequisitions = false;
  loadingMergedProcurementRequisitionItems = {};
  mergedNonConsultancyRequisitionSpecificationsByMergedItemUuid = {};
  loadingMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid = {};
  pageSize = 5;
  pageIndex = 0;
  totalRecords = 0;
  subscription = Subscription.EMPTY;

  constructor(
    private router: Router,
    private graphqlService: GraphqlService,
    private paginatedDataService: PaginatedDataService
  ) {
  }

  ngOnInit(): void {
    if (this.mergedMainProcurementRequisitionUuid) {
      this.initializer().then();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async initializer() {
    this.fetchPageData();

  }


  fetchPageData() {
    this.loadingMergedProcurementRequisitions = true;


    this.subscription = this.paginatedDataService.getDataFromSource({
      page: this.pageIndex,
      pageSize: this.pageSize,
      fields: [],
      additionalVariables: {
        mainEntityUuid: this.mergedMainProcurementRequisitionUuid
      },
      query: GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_LIGHT,
      apolloNamespace: ApolloNamespace.app
    }).subscribe(res => {
      this.mergedProcurementRequisitions = res.rows;
      this.totalRecords = res?.totalRecords;
      this.loadingMergedProcurementRequisitions = false;
    },
    );

  }

  onChangePage(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex
    this.fetchPageData();
  }

  async getMergedProcurementRequisitionItemsByMergedUuid(uuid: string) {
    this.mergedProcurementRequisitionItems[uuid] = [];

    try {
      this.loadingMergedProcurementRequisitionItems[uuid] = true;
      const response: any = await this.graphqlService.fetchData({
        query: this.showEstimatedBudget ? GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_LIGHT : GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_LIGHT_PUBLIC,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid
        },
      });

      this.mergedProcurementRequisitionItems[uuid] =
        response.data.getMergedProcurementRequisitionItemsByMergedUuid;

      this.loadingMergedProcurementRequisitionItems[uuid] = false;
    } catch (error) {
      console.error(error);
      this.loadingMergedProcurementRequisitionItems[uuid] = false;
    }

  }

  async getMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid(uuid: string) {
    this.mergedNonConsultancyRequisitionSpecificationsByMergedItemUuid[uuid] = [];
    try {
      this.loadingMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid[uuid] = true;
      const response: any = await this.graphqlService.fetchData({
        query: GET_MERGED_NON_CONSULTANCY_REQUISITION_SPECIFICATIONS_BY_MERGED_ITEM_UUID,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid
        },
      });

      this.mergedNonConsultancyRequisitionSpecificationsByMergedItemUuid[uuid] =
        response.data.getMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid;

      this.loadingMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid[uuid] = false;
    } catch (error) {
      console.error(error);
      this.loadingMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid[uuid] = false;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['mergedProcurementRequisitionItems']) {
    //   this.mergedProcurementRequisitionItems = changes['mergedProcurementRequisitionItems'].currentValue;
    //   (this.mergedProcurementRequisitionItems || []).forEach(item => {
    //     this.attachmentList[item.uuid] = this.mapAttachments(item?.mergedProcurementRequisitionAttachments || [])
    //   });
    // }
    if (changes['mergedMainProcurementRequisitionUuid']) {
      this.initializer().then();
    }
  }

  getGrandTotal(mergedRequisitionItemizations: MergedRequisitionItemization[]) {
    let total = 0
    mergedRequisitionItemizations.map(r => total += (r.quantity * r.estimatedUnitCost));
    return total;
  }

  mapAttachments(requisitionAttachments: ProcurementRequisitionAttachment[]): AttachmentSharable[] {
    const attachmentSharable: AttachmentSharable[] = []
    requisitionAttachments?.map((attachment: ProcurementRequisitionAttachment) => {
      attachmentSharable.push({
        uuid: attachment?.uuid,
        attachmentUuid: attachment?.attachmentUuid,
        title: attachment?.title,
        attachmentType: attachment?.attachmentType,
        description: attachment?.description,
        attachmentBase64: null
      });
    })
    return attachmentSharable;
  }
}
