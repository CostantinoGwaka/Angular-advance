import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from "../../../../../services/graphql.service";
import { fadeIn } from "../../../../animations/basic-animation";
import { fadeSmooth } from "../../../../animations/router-animation";
import { GET_LITIGATION_RECORD_BY_UUID } from "../../../../../modules/nest-tenderer/store/settings/litigation-record/litigation-record.graphql";
import { WorkEquipment } from "../../../../../modules/nest-tenderer/store/settings/work-equipment/work-equipment.model";
import { SettingsService } from "../../../../../services/settings.service";
import { AttachmentService } from "../../../../../services/attachment.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { LoaderComponent } from '../../../loader/loader.component';


@Component({
    selector: 'app-view-work-equipment',
    templateUrl: './view-work-equipment.component.html',
    styleUrls: ['./view-work-equipment.component.scss'],
    animations: [fadeIn, fadeSmooth],
    standalone: true,
    imports: [LoaderComponent, ViewDetailsItemComponent, MatProgressSpinnerModule]
})
export class ViewWorkEquipmentComponent implements OnInit {

  @Input() selectedUuid: string;
  @Input() workEquipment: WorkEquipment;

  fetchingItem = false;
  fetchingAttachment = false;

  constructor(
    private apollo: GraphqlService,
    private settingService: SettingsService,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    if (this.selectedUuid) {
      // this.getWorkEquipment().then();
    }
  }

  // async getWorkEquipment() {
  //   this.fetchingItem = true;
  //   try {
  //     const response: any = await this.apollo.fetchData({
  //       query: GET_LITIGATION_RECORD_BY_UUID,
  //       variables: {
  //         uuid: this.selectedUuid,
  //       }
  //     });
  //     if (response?.data?.findWorkEquipmentByUuid?.code === 9000) {
  //       this.workEquipment = response?.data?.findWorkEquipmentByUuid?.data;
  //     } else {
  //       console.error(response?.data?.findWorkEquipmentByUuid?.message);
  //     }
  //     this.fetchingItem = false;
  //   } catch (e) {
  //     console.error(e);
  //     this.fetchingItem = false;
  //   }
  // }

  async view(it) {
    this.fetchingAttachment = true;
    const data = await this.attachmentService.getAttachment(it.attachmentUuid)
    this.settingService.viewFile(data, 'pdf').then();
    this.fetchingAttachment = false;
  }

}
