import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import { fadeIn } from "../../../../animations/basic-animation";
import { fadeSmooth } from "../../../../animations/router-animation";
import { LitigationRecord } from "../../../../../modules/nest-tenderer/store/settings/litigation-record/litigation-record.model";
import { GET_LITIGATION_RECORD_BY_UUID } from "../../../../../modules/nest-tenderer/store/settings/litigation-record/litigation-record.graphql";
import { AuthService } from "../../../../../services/auth.service";
import { ReplacePipe } from '../../../../pipes/replace.pipe';
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { LoaderComponent } from '../../../loader/loader.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-view-litigation-record',
  templateUrl: './view-litigation-record.component.html',
  styleUrls: ['./view-litigation-record.component.scss'],
  animations: [fadeIn, fadeSmooth],
  standalone: true,
  imports: [LoaderComponent, ViewDetailsItemComponent, DecimalPipe, ReplacePipe]
})
export class ViewLitigationRecordComponent implements OnInit {

  @Input() selectedUuid: string;
  @Input() litigationRecord: LitigationRecord;

  fetchingItem = false;

  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (this.selectedUuid) {
      this.getLitigationRecord().then();
    }
  }

  async getLitigationRecord() {
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_LITIGATION_RECORD_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.selectedUuid,
        }
      });
      if (response?.data?.findLitigationRecordByUuid?.code === 9000) {
        this.litigationRecord = response?.data?.findLitigationRecordByUuid?.data;
      } else {
        console.error(response?.data?.findLitigationRecordByUuid?.message);
        // throw new Error(response?.data?.findLitigationRecordByUuid?.message);
      }
      this.fetchingItem = false;
    } catch (e) {
      console.error(e);
      // this.notificationService.errorMessage(e.message);
      this.fetchingItem = false;
    }
  }

}
