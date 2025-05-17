import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActivatedRoute, RouterLink } from "@angular/router";
import {
  COMPLETE_SUBMISSION_WITHDRAW,
  INITIATE_WITHDRAW_SUBMISSION
} from "../../modules/nest-tenderer/store/submission/submission.graphql";
import { GraphqlService } from "../../services/graphql.service";
import { NotificationService } from "../../services/notification.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'bid-withdraw',
    templateUrl: './bid-withdraw.component.html',
    styleUrls: ['./bid-withdraw.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule, MatProgressSpinnerModule]
})
export class BidWithdrawComponent implements OnInit {
  hasError: boolean = false;
  loading: boolean = true;
  status: string;
  token: string;
  withdrawStatus: boolean = false;
  constructor(
    private activeRoute: ActivatedRoute,
    private apollo: GraphqlService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.url.subscribe(items => {
      if (items.length) {
        this.status = items[1].path;
        this.token = items[2].path;

        if (this.status == 'approve') {
          this.withdrawStatus = true;
        } else if (this.status == 'reject') {
          this.withdrawStatus = false;
        }
      }
    });

    if (this.status && this.token) {
      this.completeSubmissionWithdraw().then();
    }
  }

  async completeSubmissionWithdraw() {
    try {
      this.loading = true;
      const response: any = await this.apollo.mutate({
        mutation: COMPLETE_SUBMISSION_WITHDRAW,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          action: this.status,
          token: this.token
        }
      });
      if (response.data.completeSubmissionWithdraw.code == 9000) {
        this.notificationService.successMessage((this.withdrawStatus = true) ?
          'Congratulations your Bid is withdrawn Successfully.' :
          'Congratulations your Bid is withdraw request is rejected Successfully.');
      } else {
        this.hasError = true;
        this.notificationService.errorMessage('Failed to withdraw your bid, Please try again');
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.hasError = true;
      this.loading = false;
      this.notificationService.errorMessage('Failed to withdraw your bid, Please try again');
    }
  }

  async initiateWithdrawSubmission() {
    try {
      const response: any = await this.apollo.mutate({
        mutation: INITIATE_WITHDRAW_SUBMISSION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          withdrawSubmissionDTO: {}
        }
      });
      if (response.data.initiateWithdrawSubmission.code == 9000) {
      }
    } catch (e) {

    }
  }
}
