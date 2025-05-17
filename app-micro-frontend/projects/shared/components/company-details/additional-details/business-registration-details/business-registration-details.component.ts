import { Tenderer } from './../../../../../modules/nest-billing/store/tenders/tenderer.model';
import { FIND_TENDERER_BY_UUID } from './../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "../../../../../services/settings.service";
import { fadeIn } from "../../../../animations/basic-animation";
import { TendererBusinessRegistrationDetails } from "../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.model";
import { TENDERER_BUSINESS_REGISTRATION_DETAILS } from "../../../../../modules/nest-uaa/store/user-management/user/user.graphql";
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../../../../environments/environment";
import { ApproveBusinessComponent } from './approve-business/approve-business.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../../loader/loader.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-business-registration-details',
  templateUrl: './business-registration-details.component.html',
  styleUrls: ['./business-registration-details.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [LoaderComponent, MatCardModule, ViewDetailsItemComponent, MatProgressSpinnerModule, DatePipe]
})
export class BusinessRegistrationDetailsComponent implements OnInit {

  loading: boolean = true;
  fetchingAttachment: boolean = false;
  @Input() tendererUuid;
  @Input() embassy: boolean = false;
  @Input() ppra: boolean = false;
  @Input() businessRegistration: TendererBusinessRegistrationDetails;
  @Input() hideTitle: boolean = false;
  @Output() getBusinessPermitUuid = new EventEmitter<string>();
  fetchingItem: boolean = false;
  tendererDetails: Tenderer;
  tendererEmbassyApprovalList: any[];
  comments: any;

  constructor(
    private settingService: SettingsService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private apollo: GraphqlService,
    private _bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    if (this.tendererUuid) {
      this.fetchBusinessRegistrationDetails().then();
      this.fetchOne().then();
    } else {
      this.loading = false;
    }
  }

  async fetchBusinessRegistrationDetails() {
    try {
      const result: any = await this.apollo.fetchData({
        query: TENDERER_BUSINESS_REGISTRATION_DETAILS,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.tendererUuid,
        }
      });

      if (result.data.findTendererBusinessRegistrationDetailsByTendererUuid?.code == 9000) {
        this.businessRegistration = result.data.findTendererBusinessRegistrationDetailsByTendererUuid?.data;

        this.getBusinessPermitUuid.emit(this.businessRegistration.uuid);
      } else {
        console.error(result.data.findTendererBusinessRegistrationDetailsByTendererUuid);
        // this.notificationService.errorMessage('Failed to get business registration details');
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
      // this.notificationService.errorMessage('Failed to get business registration details');
    }
  }

  async viewDocument(attachmentUuid) {
    this.fetchingAttachment = true;
    try {
      const data = await firstValueFrom(this.http
        .post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment/list/`, [
          attachmentUuid
        ]));
      this.settingService.viewFile(data[0].base64Attachment, 'pdf').then();
      this.fetchingAttachment = false;
    } catch (e) {
      console.error(e);
      this.fetchingAttachment = false;
      this.notificationService.errorMessage('Failed to get Certificate');

    }
  }

  async fetchOne() {
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: FIND_TENDERER_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.tendererUuid,
        }
      });
      if (response.data.findTendererByUuid.code !== 9000) {
        this.notificationService.errorMessage('Failed to fetch item details');
      }
      this.tendererDetails = response.data.findTendererByUuid?.data;
      this.tendererEmbassyApprovalList = response.data.findTendererByUuid?.data?.tendererEmbassyApprovalList;
      this.checkSection();

      this.fetchingItem = false;
    } catch (e) {
      this.notificationService.errorMessage('Failed to fetch item details');
      this.fetchingItem = false;
      console.error(e);
    }
  }

  checkSection() {
    this.tendererEmbassyApprovalList.map((item) => {
      if (item.embassyTendererApprovalSection == "BUSINESS_REGISTRATION_DETAILS") {
        this.comments = item;
      }
    });
  }

  openFormSheetSheet(): void {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.panelClass = ['bottom__sheet'];
    config.data = { tendererUuid: this.tendererUuid };
    this._bottomSheet.open(ApproveBusinessComponent, config);
  }

}
