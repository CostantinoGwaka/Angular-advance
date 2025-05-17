import { TenderRequisitionService } from '../../../../services/tender-requisition.service';
import { ApolloNamespace } from './../../../../apollo.config';
import { GET_PROCUREMENT_REQUISITION_SIMPLIFIED_BY_UUID } from './../../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.graphql';
import { NotificationService } from '../../../../services/notification.service';
import { ProcurementRequisition } from './../../../../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.model';
import { requisition } from '../../../../services/svg/icons/requisition';
import { NgClass } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ModalHeaderComponent } from '../../modal-header/modal-header.component';

import { LoaderComponent } from '../../loader/loader.component';
import { ActivatedRoute } from '@angular/router';
import { GraphqlService } from '../../../../services/graphql.service';
import { AddWorksRequisitionBoqsComponent } from 'src/app/modules/nest-tender-initiation/tender-requisition/add-works-requisition-boqs/add-works-requisition-boqs.component';
import { SharedLayoutComponent } from '../../shared-layout/shared-layout.component';
import {
  GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID,
  GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_FOR_BOQ_MODIFICATION,
} from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import {
  BOQItemChangeType,
  BOQSubItemChange,
  BoqsSelectorComponent,
} from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs-selector/boqs-selector.component';
import { NestedSpecificationActionResults } from '../../nested-specifications-builder/group-item/group-item.component';
import { BOQSubItem } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-sub-items/boq-sub-item.model';
import {
  BOQFetchingConfiguration,
  BoqFetcherComponent,
} from '../boq-fetcher/boq-fetcher.component';
import { FlatNestedSpecificationsComponent } from '../../nested-specifications-builder/flat-nested-specifications/flat-nested-specifications.component';
import { BOQSummarySums } from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs.service';
import { MergedProcurementRequisitionItem } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition-item/merged-procurement-requisition-item.model';
import { ProcurementRequisitionAttachment } from 'src/app/modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model';
import {
  BOQItem,
  MergedBOQItem,
} from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import { AttachmentSharable } from 'src/app/store/global-interfaces/organizationHiarachy';
import {
  NestedSpecificationItem,
  FlatNestedSpecificationItemView,
} from '../../nested-specifications-builder/store/model';
import { BoqSummaryComponent } from '../boq-summary/boq-summary.component';
import { NestedSpecificationsService } from '../../nested-specifications-builder/nested-specifications.service';
import {
  DELETE_WORKS_BOQ_SUBITEM_SPECIFICATION,
  SAVE_WORKS_BOQ_SUBITEM_SPECIFICATION,
} from 'src/app/modules/nest-tender-initiation/store/works-requisition-itemization/works-requisition-itemization.graphql';

@Component({
  selector: 'app-boq-modifier',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDatepickerModule,
    NgClass,
    MatIconModule,
    MatInputModule,
    ModalHeaderComponent,
    LoaderComponent,
    AddWorksRequisitionBoqsComponent,
    SharedLayoutComponent,
    BoqsSelectorComponent,
    BoqFetcherComponent,
    FlatNestedSpecificationsComponent,
  ],
  templateUrl: './boq-modifier.component.html',
  styleUrl: './boq-modifier.component.scss',
})
export class BOQModifierComponent implements OnInit {
  @Input({ required: true })
  requisitionUuid = null;

  requisition: ProcurementRequisition;
  gettingRequisition = false;
  loadingMessage = 'Loading...';
  requisitionItemUuid: string;
  physicalContingencyPercentagePS = 0;
  pricesVariationPercentagePS = 0;
  vatRequired = true;
  forPPRAAdmin = true;
  savingDataLoading: { [key: string]: boolean } = {};

  nestedSpecificationItems: NestedSpecificationItem[] = [];

  viewMode = 'readOnly';

  fetchingConfiguration: BOQFetchingConfiguration;

  showBOQFetcher: boolean = false;

  mergedProcurementRequisitionItem: MergedProcurementRequisitionItem;

  showMergedMode = false;

  isLoading = true;

  provisionSumPhysicalContingencyPercent: number = 2;

  provisionSumVariationOfPricesPercent: number = 2;

  boqSummarySums: BOQSummarySums = null;

  @ViewChild(BoqSummaryComponent, { static: false })
  boqSummaryComponent: BoqSummaryComponent;

  @ViewChild(FlatNestedSpecificationsComponent, { static: false })
  flatNestedSpecificationsComponent: FlatNestedSpecificationsComponent;

  @Input()
  items: BOQItem[] = [];

  show = false;

  flatNestedSpecificationItemsView: FlatNestedSpecificationItemView[] = [];

  constructor(
    private notificationService: NotificationService,
    private graphqlService: GraphqlService,
    private tenderRequisitionService: TenderRequisitionService,
    private nestedSpecificationsService: NestedSpecificationsService
  ) {}

  ngOnInit(): void {
    console.log('requisitionUuid', this.requisitionUuid);
    if (this.requisitionUuid) {
      this.checkExistProRequisitionByUuid();
    } else {
      this.notificationService.errorMessage('Requisition data not found');
    }
  }

  setItems(requisitionItemUuid: string, requisitionUuid?: string) {
    this.fetchingConfiguration = {
      fetchBy: 'query',
      endPointName: this.forPPRAAdmin
        ? 'getAllMergedMainProcurementRequisitionData'
        : 'getMergedMainProcurementRequisitionData',
      requisitionObjectFieldName: 'mergedProcurementRequisitions',
      requisitionItemsFieldName: 'mergedProcurementRequisitionItems',
      requisitionItemsItemizationsFieldName: 'worksRequisitionItemItemizations',
      fetchByParentValue: requisitionUuid,
      fetchByValue: requisitionItemUuid,
      isFilled: true,
    };
    this.showBOQFetcher = false;
    setTimeout(() => {
      this.showBOQFetcher = true;
    }, 100);
  }

  calculateItemsTotal() {
    this.nestedSpecificationsService.calculateFlatNestedSpecificationItemViewTotals(
      this.flatNestedSpecificationItemsView
    );
    setTimeout(() => {
      this.boqSummaryComponent?.calculateItemsTotal();
    }, 400);
  }

  onBOQFinishedLoading = (
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
    summary?: BOQSummarySums
  ) => {
    this.showBOQFetcher = false;
    this.flatNestedSpecificationItemsView = flatNestedSpecificationItemView;

    this.provisionSumVariationOfPricesPercent =
      summary?.provisionSumVariationOfPricesPercent;
    this.provisionSumPhysicalContingencyPercent =
      summary?.provisionSumPhysicalContingencyPercent;
    this.vatRequired = summary?.vatRequired;

    setTimeout(() => {
      this.flatNestedSpecificationsComponent?.calculateTotal();
    }, 200);
  };

  showBOQs() {
    this.show = false;
    setTimeout(() => {
      this.show = true;
    }, 200);
  }

  getLinkedBoqItems(mergedLinkedBOQItems: MergedBOQItem[]): BOQItem[] {
    return mergedLinkedBOQItems.map((linkedBoq) => {
      return {
        id: linkedBoq.id,
        uuid: linkedBoq.uuid,
        sourceUuid: linkedBoq.sourceUuid,
        code: linkedBoq.code,
        boqCategory: linkedBoq.mergedBOQCategory,
        boqSubItems: linkedBoq.mergedBoqSubItems,
        name: linkedBoq.name,
        description: linkedBoq.description,
        boqItemUuid: linkedBoq.boqItemUuid,
        boqCategoryUuid: linkedBoq.boqCategoryUuid,
        boqItem: linkedBoq.mergedBoqItem,
        total: linkedBoq.total,
        linkedBOQItems: this.getLinkedBoqItems(linkedBoq.mergedLinkedBOQItems),
      };
    });
  }

  mapAttachments(
    requisitionAttachments: ProcurementRequisitionAttachment[]
  ): AttachmentSharable[] {
    const attachmentSharable: AttachmentSharable[] = [];
    requisitionAttachments?.map(
      (attachment: ProcurementRequisitionAttachment) => {
        attachmentSharable.push({
          uuid: attachment?.uuid,
          attachmentUuid: attachment?.attachmentUuid,
          title: attachment?.title,
          attachmentType: attachment?.attachmentType,
          description: attachment?.description,
          attachmentBase64: null,
        });
      }
    );
    return attachmentSharable;
  }

  async checkExistProRequisitionByUuid() {
    this.loadingMessage = 'Getting requisition...';
    try {
      this.gettingRequisition = true;
      const response: any = await this.graphqlService.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query:
          GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_FOR_BOQ_MODIFICATION,
        variables: {
          uuid: this.requisitionUuid,
        },
      });

      console.log('response', response);

      if (response.data.results.code === 9000) {
        this.requisitionItemUuid =
          response?.data?.results?.data.mergedProcurementRequisitions[0].mergedProcurementRequisitionItems[0].uuid;
        this.requisition = {
          ...response?.data?.results?.data,
          procurementRequisitionItems:
            response?.data?.results?.data.mergedProcurementRequisitions[0]
              .mergedProcurementRequisitionItems,
        };
        this.setItems(this.requisitionItemUuid, this.requisitionUuid);
      } else {
        this.notificationService.errorMessage('No requisition found');
      }
    } catch (e) {
      console.error(e);
    }
    this.gettingRequisition = false;
  }

  getBoqSummarySums(event) {}

  closeDetails() {
    window.history.back();
  }

  onBOQSubItemChange = async (
    change: BOQSubItemChange
  ): Promise<NestedSpecificationActionResults> => {
    console.log('change', change);
    switch (change.changeType) {
      case BOQItemChangeType.UPDATE:
        return await this.saveBOQSubItem(change.item);

      case BOQItemChangeType.REMOVE:
        return await this.deleteBOQSubItem(change?.item?.uuid);

      default:
        return null;
    }
  };

  deleteBOQSubItem = async (
    uuid: string
  ): Promise<NestedSpecificationActionResults> => {
    let results: NestedSpecificationActionResults = {
      isSuccessful: false,
    };

    try {
      const response: any = await this.graphqlService.mutate({
        apolloNamespace: ApolloNamespace.app,
        mutation: DELETE_WORKS_BOQ_SUBITEM_SPECIFICATION,
        variables: {
          uuid,
        },
      });

      if (response.data.deleteWorksBoqSubItemSpecification?.code === 9000) {
        results = {
          isSuccessful: true,
          itemUuid: uuid,
        };
        this.notificationService.successMessage('Item deleted successfully');
      } else {
        this.notificationService.errorMessage('Failed to delete item');
      }
    } catch (e) {
      this.notificationService.errorMessage('Failed to delete item');
    }
    return results;
  };

  async saveBOQSubItem(
    item: BOQSubItem
  ): Promise<NestedSpecificationActionResults> {
    let results: NestedSpecificationActionResults = {
      isSuccessful: false,
    };
    try {
      const response: any = await this.graphqlService.mutate({
        apolloNamespace: ApolloNamespace.app,
        mutation: SAVE_WORKS_BOQ_SUBITEM_SPECIFICATION,
        variables: {
          worksSpecificationDto: item,
        },
      });
      this.savingDataLoading[item.uuid] = false;
      if (response.data.saveWorksBoqSubItemSpecification?.code === 9000) {
        this.notificationService.successMessage('BOQ item saved successfully');
        let data = response.data.saveWorksBoqSubItemSpecification;
        results = {
          isSuccessful: true,
          itemUuid: data.uuid,
        };
      } else {
        this.notificationService.errorMessage('Failed to save BOQ item');
      }
    } catch (e) {
      this.savingDataLoading[item.uuid] = false;
      this.notificationService.errorMessage('Failed to save BOQ item');
    }
    return results;
  }
}
