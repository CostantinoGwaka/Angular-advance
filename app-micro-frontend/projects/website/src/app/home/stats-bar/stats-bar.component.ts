import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { firstValueFrom } from 'rxjs';
import { GraphqlService } from '../../../services/graphql.service';
import { environment } from 'src/environments/environment';
import {
  GET_ACTUAL_TENDERER_REGISTRATION_APPROVED_STATUS,
  GET_COUNT_OF_AWARDED_CONTRACT,
  GET_COUNT_OF_TENDERS_TO_BE_OPENED,
  GET_COUNT_OF_TENDER_CATEGORIES, GET_COUNT_OF_TENDER_CATEGORIES_NEW, GET_COUNT_OF_AWARDED_CONTRACT_BY_FINANCIAL_YEAR,
} from '../../store/public-tenders.graphql';
import { StatsLoadingStatus } from '../home.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { StatsLoaderComponent } from './stats-loader/stats-loader.component';
import { AnimatedDigitComponent } from '../../../shared/components/animated-digit/animated-digit.component';


export enum StatsKeys {
  awardedContractsCount = 'awardedContractsCount',
  tendersToBeOpenedCount = 'tendersToBeOpenedCount',
  tenderersCount = 'tenderersCount',
  pesCount = 'pesCount',
  tenderCategoriesCount = 'tenderCategoriesCount',
}

export interface StatsLoadingChange {
  key: StatsKeys;
  results: any;
  success: boolean;
  isLoading: boolean;
}

@Component({
  selector: 'app-stats-bar',
  templateUrl: './stats-bar.component.html',
  standalone: true,
  imports: [
    AnimatedDigitComponent,
    StatsLoaderComponent,
    TranslatePipe
],
})
export class StatsBarComponent implements OnInit {
  @Input() totalTenders = 0;

  @Input() onStatsClick: (key: StatsKeys) => void;

  @Output() onStatLoadingChange: EventEmitter<StatsLoadingChange> =
    new EventEmitter();

  statsLoadingStatusObject: { [key: string]: StatsLoadingStatus };

  awardContractValueWithSuffix: { value: number; suffix: string } = {
    value: 0,
    suffix: '',
  };

  statsKeys = StatsKeys;

  constructor(private http: HttpClient, private apollo: GraphqlService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnChanges() { }

  _onStatsClick(key: StatsKeys) {

    if (this.statsLoadingStatusObject[key].failedToLoad === false) {
      this.onStatsClick(key);
    }
  }

  numberToSuffix(number: number): { value: number; suffix: string } {
    if (number < 1000) return { value: number, suffix: '' };
    number = Math.round(number);

    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixNum = Math.floor(('' + number).length / 3);
    let result = number / Math.pow(10, suffixNum * 3);
    result = Math.round(result * 100) / 100;

    return { value: result, suffix: suffixes[suffixNum] };
  }

  async loadStats() {
    this.initializeStatsLoadingStatusObject();
    this.getPEsCount();
    this.getTenderersCount();
    this.getCountOfTenderToBeOpened();
    this.getCountOfAwardedContract();
    this.getTenderCategoriesStat();
  }

  initializeStatsLoadingStatusObject() {
    this.statsLoadingStatusObject = {
      [this.statsKeys.awardedContractsCount]: {
        failedToLoad: false,
        loading: false,
        data: null,
      },
      [this.statsKeys.tendersToBeOpenedCount]: {
        failedToLoad: false,
        loading: false,
        data: null,
      },
      [this.statsKeys.tenderersCount]: {
        failedToLoad: false,
        loading: false,
        data: null,
      },
      [this.statsKeys.pesCount]: {
        failedToLoad: false,
        loading: false,
        data: null,
      },
      [this.statsKeys.tenderCategoriesCount]: {
        failedToLoad: false,
        loading: false,
        data: null,
      },
    };
  }

  async getPEsCount() {
    const key = this.statsKeys.pesCount;
    this.resetStatsLoadingStatusObject(key);

    try {
      const results = await firstValueFrom(
        this.http.get<any>(
          environment.AUTH_URL + `/nest-uaa/report/procuring-entity/count-all`
        )
      );
      this.statsLoadingStatusObject[key].data = results;
    } catch (e) {
      this.statsLoadingStatusObject[key].failedToLoad = true;
    }
    this.statsLoadingStatusObject[key].loading = false;
  }

  resetStatsLoadingStatusObject(key: StatsKeys) {
    this.statsLoadingStatusObject[key].loading = true;
    this.statsLoadingStatusObject[key].failedToLoad = false;
    this.onStatLoadingChange.emit({
      key,
      results: null,
      success: false,
      isLoading: true,
    });
  }

  async getTenderersCount() {
    const key = this.statsKeys.tenderersCount;
    this.resetStatsLoadingStatusObject(key);
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_ACTUAL_TENDERER_REGISTRATION_APPROVED_STATUS,
        apolloNamespace: ApolloNamespace.uaa
      });
      const results = response?.data?.results;
      if (results >= 0) {
        this.statsLoadingStatusObject[key].data = results;
      } else {
        this.statsLoadingStatusObject[key].failedToLoad = true;
      }
    } catch (e: any) {
      this.statsLoadingStatusObject[key].failedToLoad = true;
    }
    this.statsLoadingStatusObject[key].loading = false;
  }

  async getCountOfTenderToBeOpened() {
    const key = this.statsKeys.tendersToBeOpenedCount;
    this.resetStatsLoadingStatusObject(key);
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_COUNT_OF_TENDERS_TO_BE_OPENED,
        apolloNamespace: ApolloNamespace.app,
      });
      const results = response?.data?.results;
      if (results >= 0) {
        this.statsLoadingStatusObject[key].data = results;
      } else {
        this.statsLoadingStatusObject[key].failedToLoad = true;
      }
    } catch (e: any) {
      this.statsLoadingStatusObject[key].failedToLoad = true;
    }
    this.statsLoadingStatusObject[key].loading = false;
  }

  getFinancialYearBasedOnTodayDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12

    let thisYear: number;
    let nextYear: number;

    if (month >= 6) { // If current month is June or later
      thisYear = year;
      nextYear = year + 1;
    } else { // If current month is before June
      thisYear = year - 1;
      nextYear = year;
    }

    return `${thisYear}/${nextYear}`;
  }
  async getCountOfAwardedContract() {
    const key = this.statsKeys.awardedContractsCount;
    const financialYear = this.getFinancialYearBasedOnTodayDate();
    this.resetStatsLoadingStatusObject(key);
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_COUNT_OF_AWARDED_CONTRACT_BY_FINANCIAL_YEAR,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          financialYear: financialYear
        }
      });
      const results = response?.data?.results?.data;
      if (results) {
        this.statsLoadingStatusObject[key].data = results;

        this.awardContractValueWithSuffix = this.numberToSuffix(
          results.awardContractValue
        );
      } else {
        this.statsLoadingStatusObject[key].failedToLoad = true;
      }
    } catch (e: any) {
      this.statsLoadingStatusObject[key].failedToLoad = true;
    }
    this.statsLoadingStatusObject[key].loading = false;
  }

  async getTenderCategoriesStat1() {
    const key = StatsKeys.tenderCategoriesCount;
    this.resetStatsLoadingStatusObject(key);

    try {
      const response: any = await this.apollo.fetchData({
        query: GET_COUNT_OF_TENDER_CATEGORIES,
        apolloNamespace: ApolloNamespace.app,
      });
      const results = response?.data?.results;
      if (results) {
        const total = results.reduce(
          (accumulator: number, category: any) => accumulator + category.count,
          0
        );

        this.statsLoadingStatusObject[key].data = total;
        this.onStatLoadingChange.emit({
          key,
          results,
          success: true,
          isLoading: false,
        });
      } else {
        this.statsLoadingStatusObject[key].failedToLoad = true;
        this.onStatLoadingChange.emit({
          key,
          results: null,
          success: false,
          isLoading: false,
        });
      }
    } catch (e: any) {
      this.statsLoadingStatusObject[key].failedToLoad = true;
      this.onStatLoadingChange.emit({
        key,
        results: null,
        success: false,
        isLoading: false,
      });
    }
    this.statsLoadingStatusObject[key].loading = false;
  }
  async getTenderCategoriesStat() {
    const key = StatsKeys.tenderCategoriesCount;
    this.resetStatsLoadingStatusObject(key);

    try {
      const response: any = await this.apollo.fetchData({
        query: GET_COUNT_OF_TENDER_CATEGORIES_NEW,
        apolloNamespace: ApolloNamespace.app,
      });
      const results = response?.data?.results;
      if (results) {
        const total = results.reduce(
          (accumulator: number, category: any) => accumulator + category.count,
          0
        );

        this.statsLoadingStatusObject[key].data = total;
        this.onStatLoadingChange.emit({
          key,
          results,
          success: true,
          isLoading: false,
        });
      } else {
        this.statsLoadingStatusObject[key].failedToLoad = true;
        this.onStatLoadingChange.emit({
          key,
          results: null,
          success: false,
          isLoading: false,
        });
      }
    } catch (e: any) {
      this.statsLoadingStatusObject[key].failedToLoad = true;
      this.onStatLoadingChange.emit({
        key,
        results: null,
        success: false,
        isLoading: false,
      });
    }
    this.statsLoadingStatusObject[key].loading = false;
  }
}
