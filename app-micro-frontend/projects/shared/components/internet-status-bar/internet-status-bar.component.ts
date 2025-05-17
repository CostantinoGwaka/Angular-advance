import { GraphqlService } from '../../../services/graphql.service';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { firstValueFrom, fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { SYSTEM_CHECK_LOCK } from "../../../modules/nest-uaa/store/user-management/user/user.graphql";
import { StorageService } from "../../../services/storage.service";
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-internet-status-bar',
  templateUrl: './internet-status-bar.component.html',
  styleUrls: ['./internet-status-bar.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class InternetStatusBarComponent implements OnInit {

  networkStatus: boolean = false;
  updateAvailable: boolean = false;
  isTrainingInstance: boolean = false;
  currentVersion: string;
  tenderValidity: number;
  networkStatus$: Subscription = Subscription.EMPTY;

  constructor(
    private apollo: GraphqlService,
    private storageService: StorageService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.checkNetworkStatus();
    this.checkNestVersion().then();
    this.checkTenderValidity().then();
    if (environment.NEST_ALERT) {
      this.isTrainingInstance = true;
    }
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

  hardReloadNest() {
    this.storageService.setItem('SYSTEM_VERSION', this.currentVersion);
    window.location.replace(window.location.href);
  }

  ignoreUpdate() {
    this.updateAvailable = false;
  }

  async findGlobalSettingByKey(settingKey: string) {
    try {
      // const response: any = await this.apollo.fetchData({
      //   query: SYSTEM_CHECK_LOCK,
      //   apolloNamespace: ApolloNamespace.uaa,
      //   variables: {
      //     settingKey: settingKey,
      //   },
      // });
      // const values: any = response?.data?.findGlobalSettingByKey?.data;
      const data = await firstValueFrom(
        this.http.get<any>(
          environment.AUTH_URL + `/nest-cache/settings/by/key/${settingKey}`
        )
      );

      if (data?.value) {
        return data?.value;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async checkNestVersion() {
    this.currentVersion = await this.findGlobalSettingByKey('SYSTEM_VERSION');
    this.currentVersion = await this.findGlobalSettingByKey('TENDER_VALIDITY_CHECKER');
    const localVersion = this.storageService.getItem('SYSTEM_VERSION');
    if (this.currentVersion && !localVersion) {
      this.storageService.setItem('SYSTEM_VERSION', this.currentVersion);
    } else if (this.currentVersion && this.currentVersion != null && this.currentVersion !== localVersion) {
      this.updateAvailable = true;
    }
  }

  async checkTenderValidity() {
    this.tenderValidity = await this.findGlobalSettingByKey('TENDER_VALIDITY_CHECKER');
    if (this.tenderValidity) {
      this.storageService.setItem('TENDER_VALIDITY_CHECKER', this.tenderValidity);
    }
  }

}
