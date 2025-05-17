import { Component, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "../../../../../services/settings.service";
import { fadeIn } from "../../../../animations/basic-animation";
import { AuthUser } from "../../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { firstValueFrom } from "rxjs";
import { select } from "@ngrx/store";
import { selectAllAuthUsers } from "../../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { first, map } from "rxjs/operators";
import {
  FIND_TENDERER_ASSOCIATED_BY_TENDERER_UUID,
  TENDERER_ASSOCIATES_DETAILS,
  TENDERER_PARENT_SUBSIDIARY_DETAILS
} from "../../../../../modules/nest-uaa/store/user-management/user/user.graphql";
import { GraphqlService } from "../../../../../services/graphql.service";
import { NotificationService } from "../../../../../services/notification.service";
import {
  TendererParentSubsiaryDetails,
  TendererSubsidiaryAssociatesDetails
} from "../../../../../modules/nest-tenderer-management/store/tenderer/tenderer.model";
import { ViewDetailsItemComponent } from '../../../view-details-item/view-details-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../../loader/loader.component';


@Component({
  selector: 'app-associates-details',
  templateUrl: './associates-details.component.html',
  styleUrls: ['./associates-details.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LoaderComponent,
    MatCardModule,
    ViewDetailsItemComponent
],
})
export class AssociatesDetailsComponent implements OnInit {

  loading: boolean = true;
  associateType: string;
  parentSubsidiaryDetails: TendererSubsidiaryAssociatesDetails;
  associatesDetails: TendererParentSubsiaryDetails[];
  @Input() tendererUuid;

  constructor(
    private http: HttpClient,
    private apollo: GraphqlService,
    private settingService: SettingsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.findTendererAssociatedDetailsByTendererUuid().then();
  }

  async findTendererAssociatedDetailsByTendererUuid() {
    this.loading = true;
    try {
      const result: any = await this.apollo.fetchData({
        query: FIND_TENDERER_ASSOCIATED_BY_TENDERER_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.tendererUuid,
        }
      });

      if (result.data.findTendererAssociatedDetailsByTendererUuid?.code == 9000) {
        const data = result.data.findTendererAssociatedDetailsByTendererUuid?.data;
        this.associateType = data.associateType;
        this.parentSubsidiaryDetails = data.parentDetails;
        this.associatesDetails = data.associated;
      } else {
        this.notificationService.errorMessage('Failed to get Associated details');
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.error(e);
      this.notificationService.errorMessage('Failed to get Associated details');

    }
  }
}
