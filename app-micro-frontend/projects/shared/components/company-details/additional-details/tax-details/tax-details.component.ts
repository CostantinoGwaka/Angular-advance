import { FIND_TENDERER_BY_UUID, FIND_TENDERER_BY_UUID_MINI_FOR_TAX_DETAILS } from './../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import { Tenderer } from './../../../../../modules/nest-billing/store/tenders/tenderer.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ApproveTaxComponent } from './approve-business/approve-business.component';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "../../../../../services/settings.service";
import { fadeIn } from "../../../../animations/basic-animation";
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import { TendererTaxDetails } from "../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.model";
import { TENDERER_TAX_REGISTRATION_DETAILS } from "../../../../../modules/nest-uaa/store/user-management/user/user.graphql";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../../../../environments/environment";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../../loader/loader.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tax-details',
  templateUrl: './tax-details.component.html',
  styleUrls: ['./tax-details.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LoaderComponent,
    MatCardModule,
    ViewDetailsItemComponent,
    MatProgressSpinnerModule,
    DatePipe
],
})
export class TaxDetailsComponent implements OnInit {

  loading: boolean = false;
  fetchingAttachment: boolean = false;
  taxRegistrationDetails: TendererTaxDetails;
  @Input() tendererUuid;
  @Input() embassy: boolean = false;
  @Input() ppra: boolean = false;
  fetchingItem: boolean = false;
  tendererDetails: Tenderer;
  tendererEmbassyApprovalList: any[];
  comments: any;


  constructor(
    private http: HttpClient,
    private apollo: GraphqlService,
    private settingService: SettingsService,
    private notificationService: NotificationService,
    private _bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    this.fetchTaxRegistrationDetails().then();
    this.fetchOne().then();
  }

  openFormSheetSheet(): void {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.panelClass = ['bottom__sheet'];
    config.data = { tendererUuid: this.tendererUuid };
    this._bottomSheet.open(ApproveTaxComponent, config);
  }

  async fetchOne() {
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: FIND_TENDERER_BY_UUID_MINI_FOR_TAX_DETAILS,
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
    (this.tendererEmbassyApprovalList || []).map((item) => {
      if (item.embassyTendererApprovalSection == "TAX_DETAILS") {
        this.comments = item;
      }
    });
  }

  async fetchTaxRegistrationDetails() {
    this.loading = true;
    try {
      const result: any = await this.apollo.fetchData({
        query: TENDERER_TAX_REGISTRATION_DETAILS,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.tendererUuid,
        }
      });
      if (result.data.findTendererTaxRegistrationDetailsByTendererUuid?.code == 9000) {
        this.taxRegistrationDetails = result.data.findTendererTaxRegistrationDetailsByTendererUuid?.data;
      } else {
        console.error(result.data.findTendererTaxRegistrationDetailsByTendererUuid);
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.error(e);
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

}
