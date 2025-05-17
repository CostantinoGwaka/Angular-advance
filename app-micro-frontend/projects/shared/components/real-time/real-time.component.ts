import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import {
  RealTimeClockChange,
  RealTimeClockChangeType,
  RealTimeClockService,
} from '../../real-time-clock.service';


@Component({
    selector: 'real-time-clock',
    templateUrl: './real-time.component.html',
    styleUrls: ['./real-time.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: []
})
export class RealTimeComponent implements OnInit, OnDestroy {

  @Input()
  format: string = 'D MMM, h:mm:ss A';


  timeChangeSubscription = Subscription.EMPTY;
  realTime: string;
  realTimeClockChangeType = RealTimeClockChangeType;
  loading: boolean = true;
  formattedRealTime: string;

  constructor(
    private realTimeClockService: RealTimeClockService,
    private changeDetectionRef: ChangeDetectorRef) { }
  ngOnDestroy(): void {
    this.timeChangeSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.timeChangeSubscription = this.realTimeClockService
      .getChange()
      .subscribe((change: RealTimeClockChange) => {
        this.onRealTimeClockChangeEvent(change);
        this.changeDetectionRef.detectChanges();

      });
  }

  onRealTimeClockChangeEvent(change: RealTimeClockChange) {
    switch (change.changeType) {
      case RealTimeClockChangeType.FETCHING_TIME:
        this.loading = true;
        break;
      case RealTimeClockChangeType.TIME_FETCHED:
        this.loading = false;
        break;
      case RealTimeClockChangeType.TIME_FETCH_FAILED:
        this.loading = false;
        break;
      case RealTimeClockChangeType.TIME_PULSE:
        this.realTime = change.timeString;
        this.formattedRealTime = moment(change.timeObject).format(this.format) + ' EAT';
        this.loading = false;
        break;
      default:
        break;
    }
  }
}
