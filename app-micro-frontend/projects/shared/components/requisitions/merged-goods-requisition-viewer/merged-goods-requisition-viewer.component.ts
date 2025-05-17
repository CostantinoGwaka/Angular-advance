import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MergedProcurementRequisitionItem } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition-item/merged-procurement-requisition-item.model';
import { fadeIn } from '../../../animations/router-animation';
import { MergedRequisitionItemization } from '../../../../modules/nest-tender-initiation/store/merged-requisition-itemization/merged-requisition-itemization.model';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { UnmergeGoodsItemizationComponent } from '../unmerge-goods-itemization/unmerge-goods-itemization.component';
import { RequisitionItemization } from '../../../../modules/nest-tender-initiation/store/requisition-itemization/requisition-itemization.model';
import { MergedProcurementRequisition } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model';
import { EditableSpecificationItem } from '../../nested-specifications-builder/store/model';
import { Observable, from, lastValueFrom, map } from 'rxjs';
import { TenderRequisitionService } from '../../../../services/tender-requisition.service';
import { WithLoadingPipe } from '../../with-loading.pipe';
import { MergedItemizationComponent } from './merged-itemization/merged-itemization.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoaderComponent } from '../../loader/loader.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-merged-goods-requisition-viewer',
  templateUrl: './merged-goods-requisition-viewer.component.html',
  styleUrls: ['./merged-goods-requisition-viewer.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LoaderComponent,
    MatExpansionModule,
    MergedItemizationComponent,
    AsyncPipe,
    WithLoadingPipe
  ],
})
export class MergedGoodsRequisitionViewerComponent
  implements OnInit, OnChanges {

  @Input() mergedMainProcurementRequisitionUuid: string;
  @Output() emitReloadTenderDetails = new EventEmitter<any>();
  @Input() showUnmergeButton = false;
  @Input() showEstimatedBudget: boolean = true;
  specifications: { [key: string]: EditableSpecificationItem[] } = {};
  loadingSpecifications: { [key: string]: boolean } = {};
  lotItems: { [key: string]: Observable<MergedProcurementRequisitionItem[]> } = {};
  lotItemItemization: { [key: string]: MergedRequisitionItemization[] } = {};
  tenderLots: MergedProcurementRequisition[];
  attachmentSharable = {};
  panelActivenessStatus: { [id: string]: boolean } = {};
  requisitionItemTotalObj: { [id: string]: number } = {};
  showSpecifications: { [id: string]: boolean } = {};
  loadingItemization: { [id: string]: boolean } = {};
  showAttachmentDetails: { [id: string]: boolean } = {};
  loading: boolean = false;
  currentSpecPage = 1;
  totalSpecsPages = 1;
  totalSpecRecords = 0;
  constructor(
    private _bottomSheet: MatBottomSheet,
    private tenderRequisitionService: TenderRequisitionService,
  ) { }

  onOpenPanel(uuid: string) {
    this.panelActivenessStatus = {};
    this.panelActivenessStatus[uuid] = true;
  }

  onClosePanel(uuid: string) {
    this.panelActivenessStatus = {};
    this.panelActivenessStatus[uuid] = false;
  }

  ngOnInit(): void {
    // if (this.mergedMainProcurementRequisitionUuid) {
    //   this.initializer().then();
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mergedMainProcurementRequisitionUuid']) {
      this.initializer().then();
    }
  }


  async initializer() {
    if (this.mergedMainProcurementRequisitionUuid) {
      this.getLotsByTender(this.mergedMainProcurementRequisitionUuid);

    }
  }


  async getLotsByTender(uuid: string) {
    this.loading = true;
    if (this.showEstimatedBudget) {
      this.tenderLots = await this.tenderRequisitionService.getMergedProcurementRequisitionDataByMainEntity(uuid);
    } else {
      this.tenderLots = await this.tenderRequisitionService.publicgetMergedProcurementRequisitionDataByMainEntity(uuid);
    }
    (this.tenderLots || []).forEach(lot => {
      this.getLotItems(lot.uuid);
    })
    this.loading = false;

  }

  getLotItems(uuid: string) {
    if (this.showEstimatedBudget) {
      this.lotItems[uuid] = this.tenderRequisitionService.getMergedProcurementRequisitionItemsByMergedUuid(uuid);
    } else {
      this.lotItems[uuid] = this.tenderRequisitionService.publicgetMergedProcurementRequisitionItemsByMergedUuid(uuid);
    }
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


  openUnmerge(
    reqItem: MergedProcurementRequisitionItem,
    departmentId: number,
    selectedItemUuid: string
  ) {
    let departmentReqItemizations: RequisitionItemization[] = [];
    reqItem.mergedRequisitionItemizations?.forEach((mReqItemization) => {
      (mReqItemization.mergedItemizations || [])?.forEach((mItemization) => {
        if (mItemization?.requisitionItemization?.departmentId === departmentId)
          departmentReqItemizations.push(mItemization?.requisitionItemization);
      });
    });
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = { items: departmentReqItemizations, selectedItemUuid };
    config.panelClass = ['bottom__sheet'];
    this._bottomSheet
      .open(UnmergeGoodsItemizationComponent, config)
      .afterDismissed()
      .subscribe((result) => {
        if (result) {
          this.emitReloadTenderDetails.emit(result);
        }
      });
  }


}
