import { Tenderer } from './../../../../../../modules/nest-billing/store/tenders/tenderer.model';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SettingsService } from '../../../../../../services/settings.service';
import { HttpClient } from '@angular/common/http';
import { GraphqlService } from '../../../../../../services/graphql.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { APPROVE_TENDERER_BUSSINESSLINE, APPROVE_BUSINESS_LINE_TENDERER_FOREIGN_EMBASSY, FIND_TENDERER_BY_UUID, APPROVE_TENDERER_EMBASSY } from './../../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { SaveAreaComponent } from '../../../../save-area/save-area.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-approve-business',
  templateUrl: './approve-business.component.html',
  styleUrls: ['./approve-business.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, SaveAreaComponent]
})
export class ApproveBusinessComponent implements OnInit {

  item: any;
  tendererUuid: string;
  fetchingAttachment: { [id: string]: boolean } = {};
  @ViewChild('closeModal') private closeModal: ElementRef;
  comments: string;
  loading: boolean;
  reason: string;
  approveStatus: any;
  businessLine: any;
  selectedApproveStatus: string;
  tendererDetails: Tenderer;
  fetchingItem: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private apollo: GraphqlService,
    private dialogRef: MatBottomSheetRef<ApproveBusinessComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data,
  ) {
    this.tendererUuid = data.tendererUuid;
  }

  ngOnInit(): void {
    this.fetchOne().then();
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
      this.tendererDetails = response.data.findTendererByUuid.data;

      this.fetchingItem = false;
    } catch (e) {
      this.notificationService.errorMessage('Failed to fetch item details');
      this.fetchingItem = false;
      console.error(e);
    }
  }

  async verify() {
    try {
      const response: any = await this.apollo.mutate({
        mutation: APPROVE_TENDERER_EMBASSY,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererEmbassyApprovalDto: {
            approvalStatus: "APPROVED",
            embassyTendererApprovalSection: "BUSINESS_REGISTRATION_DETAILS",
            comments: this.comments,
            tendererUuid: this.tendererUuid,
          }
        }
      });
      if (response.data.approveTendererDetailsAtEmbassy?.code !== 9000) {
        this.notificationService.errorMessage('Failed to fetch item details');
      } else {
        this.notificationService.successMessage(`Business Registration has been VERIFIED successfully`);
        this.dialogRef.dismiss({ status: status, reason: this.reason });
        window.location.reload(); //reload after send
      }
    } catch (e) {
      this.notificationService.errorMessage('Failed to fetch item details');
      console.error(e);
    }
  }

  async unVerify() {
    try {
      const response: any = await this.apollo.mutate({
        mutation: APPROVE_TENDERER_EMBASSY,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererEmbassyApprovalDto: {
            approvalStatus: "REJECTED",
            embassyTendererApprovalSection: "BUSINESS_REGISTRATION_DETAILS",
            comments: this.comments,
            tendererUuid: this.tendererUuid,
          }
        }
      });
      if (response.data.approveTendererDetailsAtEmbassy?.code !== 9000) {
        this.notificationService.errorMessage('Failed to fetch item details');
      } else {
        this.notificationService.successMessage(`Business Registration has been UN-VERIFIED successfully`);
        this.dialogRef.dismiss({ status: status, reason: this.reason });
        window.location.reload(); //reload after send
      }
    } catch (e) {
      this.notificationService.errorMessage('Failed to fetch item details');
      console.error(e);
    }
  }

  async approveBussinessLine() {
    this.loading = true;
    try {
      const response: any = await this.apollo.mutate({
        mutation: APPROVE_TENDERER_BUSSINESSLINE,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererBusinessLineDto: {
            tendererUuid: this.tendererUuid,
            approvalStatus: "APPROVED",
            businessLineUuid: this.item?.businessLine?.uuid,
            comments: this.comments
          },
        }
      });
      if (response.data.approveTendererBusinessLine.code === 9000) {
        this.loading = false;
        this.notificationService.successMessage('Business line(s) approved successfully');
        this.dialogRef.dismiss({ status: status, reason: this.reason });
        window.location.reload(); //reload after send
      } else if (response.data.approveTenderer.code === 9005) {
        this.notificationService.errorMessage(response.data.approveTendererBusinessLine.message);
      }
    } catch (e) {
      this.notificationService.errorMessage('Failed to approve Tenderer ' + e.message);
    }
  }
}
