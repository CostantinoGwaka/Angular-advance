import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MergedProcurementRequisitionItem } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition-item/merged-procurement-requisition-item.model';
import { MergedRequisitionItemization } from '../../../../modules/nest-tender-initiation/store/merged-requisition-itemization/merged-requisition-itemization.model';
import { AttachmentTypeEnum, ProcurementRequisitionAttachment } from '../../../../modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model';
import { AttachmentSharable } from '../../../../store/global-interfaces/organizationHiarachy';
import { Router } from '@angular/router';
import { MergedMainProcurementRequisition } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model';
import { GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_FOR_CONSULTANCY_WITH_ITEMS, GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_FOR_CONSULTANCY_WITH_ITEMS_PUBLIC } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { GraphqlService } from '../../../../services/graphql.service';
import { TemplateDocumentTypesEnum } from '../../../../services/document/store/document-creator.model';
import { DocumentReaderService } from 'src/app/modules/document-reader/services/document-reader.service';
import { ManageRequisitionAttachmentService } from '../../../../services/manage-requisition-attachment.service';
import { from } from 'rxjs';
import { SortByPipe } from '../../../pipes/sort-pipe';
import { WithLoadingPipe } from '../../with-loading.pipe';
import { SharableAttachmentFormComponent } from '../../sharable-attachment-form/sharable-attachment-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoaderComponent } from '../../loader/loader.component';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-merged-consultancy-requisition-viewer',
  templateUrl: './merged-consultancy-requisition-viewer.component.html',
  styleUrls: ['./merged-consultancy-requisition-viewer.component.scss'],
  standalone: true,
  imports: [
    LoaderComponent,
    MatExpansionModule,
    MatIconModule,
    SharableAttachmentFormComponent,
    AsyncPipe,
    DecimalPipe,
    WithLoadingPipe,
    SortByPipe
  ],
})
export class MergedConsultancyRequisitionViewerComponent
  implements OnInit, OnChanges {
  @Input() showMergedRequisitionDetails: boolean = true;
  @Input() showEstimatedBudget: boolean = true;
  @Input() mergedMainProcurementRequisitionUuid: string;
  // TODO: TO BE REMOVED IN ALL COMPONENTS
  @Input()
  mergedProcurementRequisitionItems: MergedProcurementRequisitionItem[];

  toggleViewReqItem: { [uuid: string]: boolean } = {};
  attachmentList = {};

  loading: boolean = false;
  mergedMainProcurementRequisition: MergedMainProcurementRequisition;
  panelActivenessStatus: { [id: string]: boolean } = {};
  attachmentSharable = {};

  specification = {};
  constructor(
    private router: Router,
    private apollo: GraphqlService,
    private documentReaderService: DocumentReaderService,
    private manageRequisitionAttachmentService: ManageRequisitionAttachmentService
  ) { }

  ngOnInit(): void {
    if (this.mergedMainProcurementRequisitionUuid) {
      this.initializer().then();
    }
  }

  getItemizationAttachment(itemizationUuid: string) {
    this.attachmentSharable[itemizationUuid] = this.manageRequisitionAttachmentService
      .getAttachmentsObservable(AttachmentTypeEnum.REQUISITION_ITEMIZATION, itemizationUuid
      );
  }
  async initializer() {
    if (this.mergedMainProcurementRequisitionUuid) {

      if (this.showEstimatedBudget) {
        await this.getMergedMainProcurementRequisitionItems(
          this.mergedMainProcurementRequisitionUuid
        );
      } else {
        await this.publicgetMergedMainProcurementRequisitionItems(
          this.mergedMainProcurementRequisitionUuid
        );
      }

      (
        this.mergedMainProcurementRequisition.mergedProcurementRequisitions ||
        []
      ).forEach((mergedProcurementRequisition) => {
        (
          mergedProcurementRequisition.mergedProcurementRequisitionItems || []
        ).forEach((req) => {

          (req.mergedRequisitionItemizations || []).forEach((item) => {
            item.mergedItemizations?.forEach(i => {
              this.getItemizationAttachment(i.requisitionItemization.uuid);
            })
            // this.specification[item.uuid] = this.mapSpecifications(item?.mergedSpecifications || []);
          });
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mergedMainProcurementRequisitionUuid']) {
      this.initializer().then();
    }
  }

  async getMergedMainProcurementRequisitionItems(uuid: string) {
    this.loading = true;
    try {
      const response: any = await this.apollo.fetchData({
        query:
          GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_FOR_CONSULTANCY_WITH_ITEMS,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: uuid,
        },
      });
      if (
        response.data.getMergedMainProcurementRequisitionByUuid?.code === 9000
      ) {
        const values: MergedMainProcurementRequisition =
          response.data.getMergedMainProcurementRequisitionByUuid?.data;
        if (values) {
          this.mergedMainProcurementRequisition = values;
        } else {
        }
        this.loading = false;
      }
    } catch (e) {
      this.loading = false;
    }
  }

  async publicgetMergedMainProcurementRequisitionItems(uuid: string) {
    this.loading = true;
    try {
      const response: any = await this.apollo.fetchData({
        query:
          GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_FOR_CONSULTANCY_WITH_ITEMS_PUBLIC,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: uuid,
        },
      });
      if (
        response.data.getMergedMainProcurementRequisitionByUuid?.code === 9000
      ) {
        const values: MergedMainProcurementRequisition =
          response.data.getMergedMainProcurementRequisitionByUuid?.data;
        if (values) {
          this.mergedMainProcurementRequisition = values;
        } else {
        }
        this.loading = false;
      }
    } catch (e) {
      this.loading = false;
    }
  }

  getGrandTotal(mergedRequisitionItemizations: MergedRequisitionItemization[]) {
    let total = 0;
    mergedRequisitionItemizations.map(
      (r) => (total += r.quantity * r.estimatedUnitCost)
    );
    return total;
  }

  // mapAttachments(
  //   requisitionAttachments: ProcurementRequisitionAttachment[]
  // ): AttachmentSharable[] {
  //   const attachmentSharable: AttachmentSharable[] = [];
  //   requisitionAttachments?.map(
  //     (attachment: ProcurementRequisitionAttachment) => {
  //       attachmentSharable.push({
  //         uuid: attachment?.uuid,
  //         attachmentUuid: attachment?.attachmentUuid,
  //         title: attachment?.title,
  //         attachmentType: attachment?.attachmentType,
  //         description: attachment?.description,
  //         attachmentBase64: null,
  //       });
  //     }
  //   );
  //   return attachmentSharable;
  // }

  viewTenderDocument() {
    this.documentReaderService.getDocumentByTypeAndItemUuid(
      TemplateDocumentTypesEnum.TENDER_DOCUMENT,
      this.mergedMainProcurementRequisition.uuid
    );
  }
}
