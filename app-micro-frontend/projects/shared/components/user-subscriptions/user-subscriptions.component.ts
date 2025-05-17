import { Component, OnInit, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from "../../../services/graphql.service";
import { BusinessLine } from "../../../modules/nest-tenderer-management/store/business-line/business-line.model";
import { fadeInOut } from "../../animations/router-animation";
import { fadeIn } from "../../animations/router-animation";
import { first, map } from "rxjs/operators";
import { GET_SUBSCRIPTION_BY_EMAIL } from "../../../modules/nest-tenderer-management/store/subscription/subscription.graphql";
import { select, Store } from "@ngrx/store";
import { selectModifiedAuthUsers } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { ApplicationState } from "../../../store";
import { Observable } from "rxjs";
import { AuthUser } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { User } from "../../../modules/nest-uaa/store/user-management/user/user.model";
import {
  SubscriptionBusinessLine,
  SubscriptionData
} from "../../../modules/nest-tenderer-management/store/subscription/subscription.model";
import { ItemDetailWithIcon } from '../item-detail-with-icon/item-detail-with-icon';
import { LoaderComponent } from '../loader/loader.component';



@Component({
  selector: 'user-subscriptions',
  templateUrl: './user-subscriptions.component.html',
  styleUrls: ['./user-subscriptions.component.scss'],
  animations: [fadeIn, fadeInOut],
  standalone: true,
  imports: [
    LoaderComponent,
    ItemDetailWithIcon
],
})
export class UserSubscriptionsComponent implements OnInit {

  loading: boolean = true;
  @Input() userAccountUuid: string;
  @Input() user: User;
  businessLineList: BusinessLine[] = [];
  user$: Observable<AuthUser>;
  constructor(
    private apollo: GraphqlService,
    private store: Store<ApplicationState>,
  ) {
    this.user$ = this.store.pipe(select(selectModifiedAuthUsers), map(users => users[0]));
  }

  ngOnInit(): void {
    this.initiateUpdate().then();
  }

  async initiateUpdate() {
    const user = await this.user$.pipe(first(i => !!i)).toPromise();
    try {
      this.loading = true;
      const result: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_SUBSCRIPTION_BY_EMAIL,
        variables: {
          email: user?.email
        },
      });

      const currentSubscription: SubscriptionData = result.data.getSubscriptionByEmail.data;
      if (currentSubscription?.subscriptionsBusinessLines) {
        this.businessLineList = currentSubscription.subscriptionsBusinessLines.map(this.mapFunction);
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }


  mapFunction(item: SubscriptionBusinessLine) {
    return {
      ...item.businessLine,
      categoryName: item.businessLine.tenderCategory.name
    }
  }
}
