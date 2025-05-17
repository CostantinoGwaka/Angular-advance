import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HttpClient } from "@angular/common/http";
import { fadeIn } from "../../../../animations/basic-animation";
import { DELETE_OWNERSHIP_REGISTRATION_DETAILS, GET_TENDERER_BUSINESS_OWNERSHIP_DETAILS } from "../../../../../modules/nest-uaa/store/user-management/user/user.graphql";
import { TendererBusinessOwnershipDetails } from "../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.model";
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../../../../environments/environment";
import { SettingsService } from "../../../../../services/settings.service";
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { UpsertOwnersComponent } from './upsert-owners/upsert-owners.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddRoleComponent } from 'src/app/modules/nest-pe-management/pe-self-registration/add-role/add-role.component';
import { CountryData } from 'src/app/modules/nest-settings/store/global-settings/global-settings.model';
import { GET_COUNTRY_OBJECT_BY_UUID } from 'src/app/modules/nest-tenderer-management/store/country/country.graphql';
import { ReplacePipe } from '../../../../pipes/replace.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../../loader/loader.component';


@Component({
  selector: 'app-business-owners-details',
  templateUrl: './business-owners-details.component.html',
  styleUrls: ['./business-owners-details.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LoaderComponent,
    MatCardModule,
    ViewDetailsItemComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    ReplacePipe
],
})
export class BusinessOwnersDetailsComponent implements OnInit {

  loading: boolean = true;
  fetchingAttachment: boolean = false;
  @Input() businessOwnerShipData: TendererBusinessOwnershipDetails
  @Input() tendererUuid;
  addowner: boolean = false;
  @Input() tendererSide: boolean = false;
  @Input() hideTitle: boolean = false;
  @Output() getBusinessOwnerUuid = new EventEmitter<string>();

  showDelete: boolean = false;
  showDeletes: any = {};
  showConfirm = false;
  showDeleteConfirm: { [id: string]: boolean } = {};
  deleting: { [id: string]: boolean } = {};
  matDialogRef = {} as MatDialogRef<UpsertOwnersComponent>

  constructor(
    private http: HttpClient,
    private apollo: GraphqlService,
    private settingService: SettingsService,
    private _dialogRef: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.fetchBusinessOwnerDetails().then();
  }


  getDistributionValue(value: string) {
    switch (value) {
      case 'SHARES':
        return 'No. of SHARES';
      case 'PERCENT' || 'PERCENTAGE':
        return 'PERCENTAGE';
      default:
        return 'No. of CAPITAL(USD)';
    }
  }

  async fetchBusinessOwnerDetails() {
    try {
      const result: any = await this.apollo.fetchData({
        query: GET_TENDERER_BUSINESS_OWNERSHIP_DETAILS,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.tendererUuid,
        }
      });

      if (result.data.findTendererBusinessOwnershipDetailsByTendererUuid?.code == 9000) {
        this.businessOwnerShipData = result.data.findTendererBusinessOwnershipDetailsByTendererUuid?.data;
        this.getBusinessOwnerUuid.emit(this.businessOwnerShipData.uuid);
      } else {
        console.error(result.data.findTendererBusinessOwnershipDetailsByTendererUuid);
        // this.notificationService.errorMessage('Failed to get Business Ownership Details');
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
      // this.notificationService.errorMessage('Failed to get Business Ownership Details');
    }
  }

  async getCountryByUuid(uuid: string) {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_COUNTRY_OBJECT_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: uuid,
        },
      });
      if (response.data.getCountryObjectByUuid.code == 9000) {
        const values: CountryData = response.data.getCountryObjectByUuid.data;
        if (values) {
          return values;
        }
        return null
      }
      return null;

    } catch ($e) {
      return null;
    }
  }

  async openOwnerSheetSheet(rData?: any) {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      ownerData: rData,
      tendererBusinessOwnershipDetailsUuid: this.businessOwnerShipData.uuid
    };
    config.panelClass = ['bottom__sheet'];
    this._bottomSheet.open(UpsertOwnersComponent, config).afterDismissed().subscribe(async (refresh) => {
      if (refresh) {
        let check = false;
        this.businessOwnerShipData.tendererBusinessOwnersDetails = this.businessOwnerShipData.tendererBusinessOwnersDetails.map(owner => {
          if (owner.uuid == refresh.uuid) {
            check = true;
            return {
              ...refresh,
            }
          }
          return owner;
        });
        if (check == false) {
          this.businessOwnerShipData.tendererBusinessOwnersDetails.push(refresh);
        }
      }
    });
  }

  confirmDelete(uuid) {
    this.showDeleteConfirm = {};
    this.showDeleteConfirm[uuid] = !this.showDeleteConfirm[uuid];
    this.showDelete = !this.showDelete;
  }

  async deleteOwner(item) {
    let deleted = false;
    try {
      const result: any = await this.apollo.mutate({
        mutation: DELETE_OWNERSHIP_REGISTRATION_DETAILS,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: item.uuid,
        }
      });
      if (result.data.deleteTendererBusinessOwnersDetailsByUuid?.code === 9000) {
        deleted = true;
        this.showDelete = false;
        this.showConfirm = false;
      } else {
        console.error('Owner Not Found In Database');
        // this.businessOwnerShipData.tendererBusinessOwnersDetails = this.businessOwnerShipData.tendererBusinessOwnersDetails.filter(owner => (owner.uuid !== item.uuid));
      }
    } catch (e) {
      this.notificationService.errorMessage('Failed to delete Information');
    }
    if (deleted) {
      this.notificationService.successMessage('Business owner details deleted successfully');
      this.businessOwnerShipData.tendererBusinessOwnersDetails = this.businessOwnerShipData.tendererBusinessOwnersDetails.filter(owner => (owner.uuid !== item.uuid));
    }
  }

  async viewDocument(attachmentUuid: string) {
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
      this.notificationService.errorMessage('Failed to get Ownership Agreement Document');
    }
  }
}
