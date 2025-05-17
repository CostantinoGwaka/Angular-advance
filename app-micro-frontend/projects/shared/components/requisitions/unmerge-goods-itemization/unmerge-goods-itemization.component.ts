import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";
import { DynamicFormService } from "../../dynamic-forms-components/dynamic-form.service";
import { GraphqlService } from "../../../../services/graphql.service";
import { NotificationService } from "../../../../services/notification.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import {
  ItemizationTypeEnum,
  RequisitionItemization
} from "../../../../modules/nest-tender-initiation/store/requisition-itemization/requisition-itemization.model";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { fadeSmooth } from "../../../animations/router-animation";
import {
  MergedRequisitionItemizationDtoInput,
  ProcurementRequisitionAttachmentDtoInput,
  SpecificationInput
} from "../../../../modules/nest-tender-initiation/store/merged-requisition-itemization/merged-requisition-itemization.model";
import {
  AttachmentTypeEnum
} from "../../../../modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model";
import * as fromPRGql
  from "../../../../modules/nest-tender-initiation/store/merged-requisition-itemization/merged-requisition-itemization.graphql";
import {
  Specification
} from "../../../../modules/nest-tender-initiation/store/settings/pe-specification/pe-specification-setting.model";
import { InlineConfirmComponent } from '../../inline-confirm/inline-confirm.component';
import { LoaderComponent } from '../../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HelpTextComponent } from '../../help-text/help-text.component';
import { DecimalPipe } from '@angular/common';
import { ModalHeaderComponent } from '../../modal-header/modal-header.component';

@Component({
  selector: 'app-unmerge-goods-itemization',
  templateUrl: './unmerge-goods-itemization.component.html',
  styleUrls: ['./unmerge-goods-itemization.component.scss'],
  animations: [fadeSmooth],
  standalone: true,
  imports: [ModalHeaderComponent, MatCheckboxModule, HelpTextComponent, MatButtonModule, MatIconModule, LoaderComponent, InlineConfirmComponent, DecimalPipe]
})
export class UnmergeGoodsItemizationComponent implements OnInit {

  title: string;
  departmentReqItemizations: RequisitionItemization[];
  selectedUuids: string[] = [];
  selectedUuid: string;
  toggleShowSelected: { [uuid: string]: boolean } = {};
  showConfirm: boolean;
  loadDelete: boolean;

  constructor(
    private store: Store<ApplicationState>,
    private dynamicFormService: DynamicFormService,
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    private _bottomSheetRef: MatBottomSheetRef<UnmergeGoodsItemizationComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data,
  ) {
    this.departmentReqItemizations = data.items;
    this.selectedUuids.push(data?.selectedItemUuid);
    this.selectedUuid = data?.selectedItemUuid;
  }

  ngOnInit(): void {
    this.title = `UNMERGE ${this.departmentReqItemizations.length} ITEMS FOR
    ${this.departmentReqItemizations[0]?.departmentName?.toUpperCase()}`;
  }

  closeSheet(event?: boolean): void {
    //this._bottomSheetRef.dismiss();
    this._bottomSheetRef.dismiss(<boolean>false);
  }

  onSelectChange(event: MatCheckboxChange, itemization: RequisitionItemization) {
    if (event.checked) {
      if (!(this.selectedUuids.findIndex(u => u === itemization.uuid) > -1))
        this.selectedUuids.push(itemization.uuid);
    } else {
      this.selectedUuids = this.selectedUuids.filter(u => u !== itemization.uuid);
    }
  }

  isItemChecked(uuid: string): boolean {
    return this.selectedUuids.findIndex(u => u === uuid) > -1;
  }

  cancelAnAction() {
    this.showConfirm = false;
  }

  async submit() {
    this.loadDelete = true
    try {
      const response: any = await this.apollo.mutate({
        mutation: fromPRGql.UNMERGE_DEPARTMENT_REQUISITION_ITEMIZATIONS,
        apolloNamespace: ApolloNamespace.app,
        variables: { mergedItemUuids: this.selectedUuids }
      });
      if (response.data.removeMergedItemizations.code === 9000) {
        this.notificationService.successMessage('Action completed successfully...');
        this._bottomSheetRef.dismiss(<boolean>true);
      } else {
        throw new Error(response.data.removeMergedItemizations?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage('Action not completed... ' + e.message)
    }
    this.loadDelete = false;
    this.showConfirm = false;
  }
}
