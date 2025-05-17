import {Component, Input, SimpleChanges} from '@angular/core';
import {ApolloNamespace} from "../../../../../apollo.config";
import {GraphqlService} from "../../../../../services/graphql.service";
import {NotificationService} from "../../../../../services/notification.service";
import {GET_TENDER_DATES_BY_TENDER_UUID} from "../../../../../modules/nest-app/store/tender/tender.graphql";
import {LoaderComponent} from "../../../../../shared/components/loader/loader.component";
import { DatePipe } from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-view-tender-calendar',
  standalone: true,
  imports: [LoaderComponent, DatePipe, MatIconModule],
  templateUrl: './view-tender-calendar.component.html',
  styleUrl: './view-tender-calendar.component.scss'
})
export class ViewTenderCalendarComponent {
  @Input() tenderUuid: string;
  @Input() isCuis: boolean = false;
  loading: boolean = false;
  tenderCalendarDates: {
    plannedDate: string;
    procurementStage: {
      name: string;
    }
  }[] = [];
  constructor(
    private graphqlService: GraphqlService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['tenderUuid'] !== undefined &&
      changes['tenderUuid'] !== null
    ) {
      this.getTenderDatesByTenderUuid(this.tenderUuid).then();
    }
  }

  async getTenderDatesByTenderUuid(uuid: string) {
    this.loading = true;
    const res: any = await this.graphqlService.fetchData({
      query: GET_TENDER_DATES_BY_TENDER_UUID,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        tenderUuid: uuid,
      },
    });

    if (res.data?.getTenderDatesByTenderUuid?.code === 9000) {
      this.tenderCalendarDates = (res.data.getTenderDatesByTenderUuid?.dataList) || [];
    } else {
      this.notificationService.errorMessage('Failed to load tender calendar')
    }
    this.loading = false;
  }
}
