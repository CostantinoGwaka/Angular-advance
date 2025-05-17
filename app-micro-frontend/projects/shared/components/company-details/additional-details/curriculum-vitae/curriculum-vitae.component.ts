import { PreviewCvComponent } from './../../../preview-cv/preview-cv.component';
import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "../../../../../services/settings.service";
import { fadeIn } from "../../../../animations/basic-animation";
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../../../../environments/environment";
import { GET_PERSONNEL_CV } from "../../../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.graphql";
import { PersonnelInformation } from "../../../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.model";
import { Tenderer } from "../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.model";
import { MatBottomSheet, MatBottomSheetConfig } from "@angular/material/bottom-sheet";
import { FIND_TENDERER_CV_BY_UUID } from "../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.graphql";
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../../loader/loader.component';


@Component({
  selector: 'app-curriculum-vitae',
  templateUrl: './curriculum-vitae.component.html',
  styleUrls: ['./curriculum-vitae.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LoaderComponent,
    MatCardModule,
    ViewDetailsItemComponent
],
})
export class CurriculumVitaeComponent implements OnInit {

  loading: boolean = false;
  fetchingAttachment: boolean = false;
  personnelInformation: PersonnelInformation;
  @Input() tendererUuid;
  @Input() tendererDetails: Tenderer;
  constructor(
    private http: HttpClient,
    private apollo: GraphqlService,
    private _bottomSheet: MatBottomSheet,
    private settingService: SettingsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    if (this.tendererUuid) {
      this.getPersonnelCvDataByUuid(this.tendererUuid).then();
    } else {
      this.fetchPersonnelDetails().then();
    }
  }

  async fetchPersonnelDetails() {
    this.loading = true;
    try {
      const result: any = await this.apollo.fetchData({
        query: GET_PERSONNEL_CV,
        apolloNamespace: ApolloNamespace.uaa,
      });
      if (result.data.getPersonnelCV?.code == 9000) {
        this.personnelInformation = result.data.getPersonnelCV?.data?.personnelInformation;
      } else {
        console.error(result.data.getPersonnelCV);
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.error(e);
    }
  }

  async getPersonnelCvDataByUuid(tendererUuid: string) {
    this.loading = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: FIND_TENDERER_CV_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererUuid: tendererUuid,
        }
      });
      if (response.data.getPersonnelCVByTendererUuid?.code == 9000) {
        this.personnelInformation = response.data.getPersonnelCVByTendererUuid?.data?.personnelInformation;
      } else {
        console.error(response.data.getPersonnelCV);
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.error(e.message);
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


  viewTendererCv(tenderer?: Tenderer) {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.panelClass = ['bottom__sheet', 'w-100'];
    config.data = { tenderer: this.tendererDetails, allview: true };
    this._bottomSheet.open(PreviewCvComponent, config);
  }


}
