import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import * as fromGraphql from "../../../../../modules/nest-tenderer/store/settings/tenderer-cash-flow/tenderer-cash-flow.graphql";
import * as fromModel from "../../../../../modules/nest-tenderer/store/settings/tenderer-cash-flow/tenderer-cash-flow.model";
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import { SettingsService } from "../../../../../services/settings.service";
import { AttachmentService } from "../../../../../services/attachment.service";
import { TendererFinancialStatement } from "../../../../../modules/nest-tenderer/store/settings/tenderer-cash-flow/tenderer-cash-flow.model";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';


@Component({
  selector: 'app-view-cash-flows',
  templateUrl: './view-cash-flows.component.html',
  styleUrls: ['./view-cash-flows.component.scss'],
  standalone: true,
  imports: [ViewDetailsItemComponent, MatProgressSpinnerModule]
})
export class ViewCashFlowsComponent implements OnInit {
  @Input() selectedUuid: string;
  @Input() selectedCashFlow: TendererFinancialStatement;
  @Output() closeForm = new EventEmitter<boolean>();
  fetchingItem = false;
  fetchingAttachment: boolean;
  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    private settingService: SettingsService,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    if (this.selectedUuid) {
      this.initiateUpdate().then();
    }
  }

  async initiateUpdate() {
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: fromGraphql.GET_TENDERER_CASH_FLOW_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.selectedUuid,
        }
      });
      if (response?.data?.findTendererFinancialStatementByUuid?.code === 9000) {
        const values: fromModel.TendererFinancialStatement = response?.data?.findTendererFinancialStatementByUuid?.data;
        if (values) {
          this.selectedCashFlow = values;
        }
      } else {
        throw new Error(response?.data?.findTendererFinancialStatementByUuid?.message);
      }
      this.fetchingItem = false;
    } catch (e) {
      this.notificationService.errorMessage(e.message);
      this.fetchingItem = false;
    }
  }

  async view(it) {
    this.fetchingAttachment = true;
    const data = await this.attachmentService.getAttachment(it.attachmentUuid)
    this.settingService.viewFile(data, 'pdf').then();
    this.fetchingAttachment = false;
  }

}
