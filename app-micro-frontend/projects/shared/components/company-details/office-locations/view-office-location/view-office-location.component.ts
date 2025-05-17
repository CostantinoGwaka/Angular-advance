import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import * as fromGraphql from "../../../../../modules/nest-tenderer/store/settings/office-location/office-location.graphql";
import { OfficeLocation } from "../../../../../modules/nest-tenderer/store/settings/office-location/office-location.model";
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { LoaderComponent } from '../../../loader/loader.component';



@Component({
  selector: 'app-view-office-location',
  templateUrl: './view-office-location.component.html',
  standalone: true,
  imports: [
    LoaderComponent,
    ViewDetailsItemComponent
],
})
export class ViewOfficeLocationComponent implements OnInit {
  @Input() selectedUuid: string;
  @Input() selectedOfficeLocation: OfficeLocation;
  @Output() closeForm = new EventEmitter<boolean>();
  fetchingItem: boolean = false;
  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
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
        query: fromGraphql.GET_OFFICE_LOCATION_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.selectedUuid,
        }
      });
      if (response?.data?.findTendererOfficeByUuid?.code === 9000) {
        const values: OfficeLocation = response?.data?.findTendererOfficeByUuid?.data;
        if (values) {
          this.selectedOfficeLocation = values;
        }
      } else {
        this.notificationService.errorMessage('Failed to fetch records');
      }
      this.fetchingItem = false;
    } catch (e) {
      this.notificationService.errorMessage('Failed to fetch records');
      this.fetchingItem = false;
      throw new Error(e);
    }
  }

}
