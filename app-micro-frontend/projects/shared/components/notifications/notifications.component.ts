import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Store } from '@ngrx/store';
import { GraphqlService } from '../../../services/graphql.service';
import { ApplicationState } from 'src/app/store';
import { Go } from 'src/app/store/router/router.action';
import { MatIconModule } from '@angular/material/icon';


export interface Notification {
  id?: string;
  model: string;
  count: string;
  url: string;
  message?: string;
  tasks?: string[]
}

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    standalone: true,
    imports: [MatIconModule]
})
export class NotificationsComponent implements OnInit {

  @Input() notifications: Notification[] = [];

  // @Input() total:any;
  constructor(
    private apollo: GraphqlService,
    private store: Store<ApplicationState>) {
  }

  ngOnInit(): void {
    // this.getTaskSummary();
  }

  goToTaskUi(url: string) {
    if (url && url.length > 0) {
      this.store.dispatch(new Go({ path: url.split("/") }));
    }

  }


}
