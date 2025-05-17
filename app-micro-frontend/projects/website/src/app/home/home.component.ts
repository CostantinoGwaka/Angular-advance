import { fields } from './../../shared/components/requisitions/tenderer-selection/tenderer-selection.form';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Router, RouterLink } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';
import { PublicTenderListResults } from '../store/public-tenders-results.model';
import { PublicTendersTenderCategoryStats } from '../store/public-tenders-tender-category-stats';
import { GET_PUBLIC_PUBLISHED_ENTITIES } from '../store/public-tenders.graphql';
import { StatsKeys, StatsLoadingChange, StatsBarComponent } from './stats-bar/stats-bar.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { FeaturesAndServicesComponent } from '../features-and-services/features-and-services.component';
import { MobileAppAdComponent } from './mobile-app-ad/mobile-app-ad.component';
import { TendersListComponent } from '../tenders/tenders-list/tenders-list.component';
import { CategoryFilterComponent } from '../tenders/category-filter/category-filter.component';
import { SectionHeaderComponent } from '../shared/components/section-header/section-header.component';
import { SummariesViewComponent } from '../summaries-view/summaries-view.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatIconModule } from '@angular/material/icon';
import { ConnectedDotsComponent } from './connected-dots/connected-dots.component';
import { CommonRealtimeClockComponent } from '../../shared/components/real-time/common-reatime-clock/common-realtime-clock.component';
import { NavBarComponent } from '../shared/components/nav-bar/nav-bar.component';
import {
  WebInternetStatusBarComponent
} from '../shared/components/web-internet-status-bar/web-internet-status-bar.component';

export interface HomeStats {
  awardedContracts: {
    awardContract: number;
    awardContractValue: number;
  };
  tendersToBeOpened: number;
}

export interface StatsLoadingStatus {
  failedToLoad: boolean;
  loading: boolean;
  data: any;
}

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	standalone: true,
	imports: [
		NavBarComponent,
		CommonRealtimeClockComponent,
		ConnectedDotsComponent,
		RouterLink,
		MatIconModule,
		MatProgressSpinnerModule,
		SearchBarComponent,
		StatsBarComponent,
		SummariesViewComponent,
		SectionHeaderComponent,
		CategoryFilterComponent,
		TendersListComponent,
		MobileAppAdComponent,
		FeaturesAndServicesComponent,
		FooterComponent,
		TranslatePipe,
		WebInternetStatusBarComponent,
	],
})
export class HomeComponent implements OnInit {
	@ViewChild('currentTenders', { static: false }) currentTenders: ElementRef;
	@ViewChild('currentTendersWrapper', { static: false })
	currentTendersWrapper: ElementRef;

	constructor(
		private apollo: GraphqlService,
		private router: Router,
	) {}

	statsKeys = StatsKeys;

	peCount = 0;
	tenderersCount = 0;
	totalTenders = 0;

	statsLoadingStatusObject: { [key: string]: StatsLoadingStatus };

	tendersResults: PublicTenderListResults;
	homeStats: HomeStats;

	tenderCategoriesStats: PublicTendersTenderCategoryStats[] = [];

	loadingCategories = false;
	loadingTenders = false;

	peCountLoading = true;
	tenderersCountLoading = true;
	totalTendersLoading = true;
	failedToLoadTotalTenders = false;

	loadingStats = true;

	selectedCategoryName = 'all';
	selectedCategoryAcronym: string = null;

	firstFetchCalled = false;

	ngOnInit(): void {}

	ngAfterViewInit() {
		this.observeCurrentTenders();
	}

	observeCurrentTenders() {
		const currentTendersElement = this.currentTendersWrapper.nativeElement;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.fetchTendersAfterFirstAppearance();
					observer.disconnect();
				}
			});
		});

		observer.observe(currentTendersElement);
	}

	fetchTendersAfterFirstAppearance() {
		if (this.firstFetchCalled == false) {
			this.firstFetchCalled = true;
			this.fetchTenders(1).then();
		}
	}

	resetStatsLoadingStatusObject(key: string) {
		this.statsLoadingStatusObject[key].loading = true;
		this.statsLoadingStatusObject[key].failedToLoad = false;
	}

	scrollToTenders() {
		const rect = this.currentTenders.nativeElement.getBoundingClientRect();
		window.scrollBy({
			top: rect.top - 80,
			behavior: 'smooth',
		});
	}

	async fetchTenders(page: number, categoryAcronym: string = 'all') {
		this.tendersResults = null;
		this.loadingTenders = true;

		let mustHaveFilters = [];

		mustHaveFilters.push({
			fieldName: 'entityStatus',
			operation: 'IN',
			inValues: ['PUBLISHED'],
		});

		if (categoryAcronym != 'ALL' && categoryAcronym != 'all') {
			mustHaveFilters.push({
				fieldName: 'entityCategoryAcronym',
				operation: 'EQ',
				value1: categoryAcronym,
			});
		}

		let sortFields = [
			{
				fieldName: 'invitationDate',
				orderDirection: 'DESC',
			},
		];

		try {
			const response = await this.apollo.fetchData({
				query: GET_PUBLIC_PUBLISHED_ENTITIES,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					input: {
						fields: sortFields,
						page: page,
						pageSize: 5,
						mustHaveFilters,
					},
				},
			});
			if (response.data['items']) {
				this.tendersResults = response.data['items'];
			}
		} catch (e: any) {}
		this.loadingTenders = false;
	}

	onStatLoadingChange(event: StatsLoadingChange) {
		if (event.key == this.statsKeys.tenderCategoriesCount) {
			if (event.success == true) {
				this.tenderCategoriesStats = event.results;
				this.totalTendersLoading = false;
				this.failedToLoadTotalTenders = false;
				this.totalTenders = event.results.reduce(
					(accumulator: number, category: any) => accumulator + category.count,
					0,
				);
			}
			if (
				event.success == false &&
				event.results == null &&
				event.isLoading == false
			) {
				this.totalTenders = null;
				this.totalTendersLoading = false;
				this.failedToLoadTotalTenders = true;
			}
		}
	}

	onStatsClick = (key: StatsKeys) => {
		switch (key) {
			case StatsKeys.tenderCategoriesCount:
				this.scrollToTenders();
				break;
			case StatsKeys.tenderersCount:
				this.router.navigate(['/tenderers/']).then();
				break;
			case StatsKeys.pesCount:
				this.router.navigate(['/procuring-entities/']).then();
				break;
			case StatsKeys.tendersToBeOpenedCount:
				this.router.navigate(['/tenders/tenders-closing-today']).then();
				break;
			case StatsKeys.awardedContractsCount:
				this.router.navigate(['/tenders/awarded-tenders']).then();
				break;
		}
	};

	onCategorySelect(category: PublicTendersTenderCategoryStats) {
		this.selectedCategoryName = category.tenderCategoryName;
		this.selectedCategoryAcronym = category.tenderCategoryAcronym;
		this.fetchTenders(1, category.tenderCategoryAcronym).then();
	}
}
