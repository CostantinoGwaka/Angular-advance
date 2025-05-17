import { Component } from '@angular/core';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { GraphqlService } from '../../../../services/graphql.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-web-internet-status-bar',
  standalone: true,
  imports: [],
  templateUrl: './web-internet-status-bar.component.html',
  styleUrl: './web-internet-status-bar.component.scss'
})
export class WebInternetStatusBarComponent {
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;

  constructor(
    private apollo: GraphqlService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.checkNetworkStatus();
  }

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine))
      .subscribe(status => {
        this.networkStatus = status;
        if (this.networkStatus) {
          // this.notificationService.successMessage('You\'re online. Ready to Go.');
        } else {
          console.error('You\'re offline. Check your connection.');
          // this.notificationService.internetSnackbar('You\'re offline. Check your connection.');
        }
      });
  }
}
