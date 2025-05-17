import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import * as moment from 'moment';
import { firstValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';

export enum RealTimeClockChangeType {
  FETCHING_TIME = 'FETCHING_TIME',
  TIME_FETCHED = 'TIME_FETCHED',
  TIME_FETCH_FAILED = 'TIME_FETCH_FAILED',
  TIME_PULSE = 'TIME_PULSE',
  USER_INACTIVE = 'USER_INACTIVE',
  USER_BECAME_ACTIVE = 'USER_BECAME_ACTIVE',
}

export interface RealTimeClockChange {
  timeString?: string;
  timeObject?: any;
  changeType: RealTimeClockChangeType;
}

@Injectable({
  providedIn: 'root',
})
export class RealTimeClockService {
  fetchedTime: moment.Moment;
  timeToDisplay: moment.Moment;
  timeFetchingInterval = 8 * 60 * 1000; //Minutes*Seconds*Milliseconds
  maximumTimeDifferenceToFetchTimeAfterAppWasIdle = 5 * 60; //Minutes*Seconds
  timeDifferenceForAppRefreshAfterTheAppWasIdle = 8 * 60 * 60; //Hours*Minutes*Seconds
  maximumIdleTime = 3 * 1000; //Seconds*Milliseconds
  realTime: string;
  loading: boolean = true;
  timeFetchMaxRetryCount = 10;
  timeFetchRetryCounts = 0;
  stopTimeUpdate = false;
  firstTimeFetchNotified = false;
  idleTimeout: any;

  private realTimeClockChangeEvent = new Subject<RealTimeClockChange>();
  private previousTimestamp: number;

  private appIsVisible = true;
  private isFetchingTime = false;
  private lastTimeAppWasActive: moment.Moment;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.startWebActivityTracking();
    this.startClock();
    document.addEventListener(
      'visibilitychange',
      this.visibilityChangeListener
    );
  }

  visibilityChangeListener = () => {
    let isTabVisible = !document.hidden;
    if (isTabVisible) {
      this.updateTimeIfConditionsAreSatisfied();
    }
  };

  refreshIfUserIsDifferent() {
    let storedUserID = this.storageService.get('userID');
    let currentUserData = JSON.parse(
      document.getElementById('userData').innerHTML
    );
  }

  startWebActivityTracking() {
    this.updateTimeIfConditionsAreSatisfied();
    document.addEventListener(
      'mousemove',
      this.updateTimeIfConditionsAreSatisfied
    );
    document.addEventListener(
      'keydown',
      this.updateTimeIfConditionsAreSatisfied
    );
  }

  updateTimeIfConditionsAreSatisfied = () => {
    let currentTime = moment();

    let timeDifference = currentTime.diff(this.lastTimeAppWasActive, 'seconds');

    if (timeDifference > this.timeDifferenceForAppRefreshAfterTheAppWasIdle) {
      window.location.reload();
      return;
    }

    if (timeDifference > this.maximumTimeDifferenceToFetchTimeAfterAppWasIdle) {
      this.getTime(false);
    }

    this.lastTimeAppWasActive = moment();
  };

  startClock() {
    this.getTimePeriodically();
    this.broadcastTemplateSectionSelectionChange({
      changeType: RealTimeClockChangeType.FETCHING_TIME,
    });
  }

  broadcastTemplateSectionSelectionChange(change: RealTimeClockChange) {
    this.realTimeClockChangeEvent.next(change);
  }

  getChange() {
    return this.realTimeClockChangeEvent.asObservable();
  }

  ngOnDestroy() {
    this.stopTimeUpdate = true;
    document.removeEventListener(
      'mousemove',
      this.updateTimeIfConditionsAreSatisfied
    );
    document.removeEventListener(
      'keydown',
      this.updateTimeIfConditionsAreSatisfied
    );
    document.removeEventListener(
      'visibilitychange',
      this.visibilityChangeListener
    );
  }

  async getTime(showLoader = true) {
    this.timeFetchRetryCounts = 0;
    this.loading = showLoader;
    this.fetchTime();
  }

  async fetchTime() {
    if (this.isFetchingTime) {
      return;
    } else {
      this.isFetchingTime = true;
    }

    if (this.stopTimeUpdate) {
      return;
    }

    try {
      const results = await firstValueFrom(
        environment.ALLOW_PERMISSIONS
          ? this.http.get<any>(
            environment.AUTH_URL + `/nest-monitor/get/server/time`
          )
          : this.http.get<any>(
            environment.AUTH_URL + `/nest-uaa/get/server/time`
          )
      );
      this.isFetchingTime = false;
      if (results.data) {
        this.loading = false;
        this.timeFetchRetryCounts = 0;
        this.fetchedTime = this.convertServerTimeStringToTime(results.data);

        setTimeout(() => {
          this.updateTimeToDisplayAfterEverySecond();
          if (!this.firstTimeFetchNotified) {
            this.broadcastTemplateSectionSelectionChange({
              changeType: RealTimeClockChangeType.TIME_FETCHED,
            });
          }
          this.firstTimeFetchNotified = true;
        }, 1500);
      } else {
        this.retry();
      }
    } catch (e) {
      this.retry();
    }
  }

  async retry() {
    this.isFetchingTime = false;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.timeFetchRetryCounts++;
    if (this.timeFetchRetryCounts < this.timeFetchMaxRetryCount) {
      this.fetchTime();
    } else {
      this.loading = false;
    }
  }

  convertServerTimeStringToTime(
    serverTimeString: string,
    fetchTimeSecondsDifference: number = 0
  ) {
    let time = moment(serverTimeString);
    time.add(fetchTimeSecondsDifference, 'seconds');
    return time;
  }

  updateTimeToDisplayAfterEverySecond() {
    const updateClock = (timestamp: number) => {
      const timeDifference = (timestamp - this.previousTimestamp) / 1000;
      this.fetchedTime.add(timeDifference, 'seconds');
      this.timeToDisplay = this.fetchedTime;
      this.setRealTime();

      //this.doTaskAfterAppWasInactive();
      //this.handleThrottledTask();

      this.broadcastTemplateSectionSelectionChange({
        changeType: RealTimeClockChangeType.TIME_PULSE,
        timeString: this.realTime,
        timeObject: moment(this.fetchedTime),
      });

      this.previousTimestamp = timestamp;
      requestAnimationFrame(updateClock);
    };
    const startClock = (timestamp: number) => {
      this.previousTimestamp = timestamp;
      requestAnimationFrame(updateClock);
    };
    requestAnimationFrame(startClock);
  }

  // handleThrottledTask = (() => {
  //   let timeout: any = null;

  //   return () => {
  //     if (timeout !== null) {
  //       clearTimeout(timeout);
  //     }

  //     timeout = setTimeout(() => {
  //       this.doTaskAfterAppWasInactive();
  //       timeout = null;
  //     }, 1000);
  //   };
  // })();

  setRealTime() {
    this.realTime =
      moment(this.fetchedTime).format('DD-MM-yyyy h:mm:ss A') + ' EAT';
  }

  getTimePeriodically() {
    const fetchTime = () => {
      this.getTime();
      setTimeout(() => {
        if (this.appIsVisible) {
          fetchTime();
        }
      }, this.timeFetchingInterval);
    };
    fetchTime();
  }
}
