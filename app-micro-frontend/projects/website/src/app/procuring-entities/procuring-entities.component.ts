import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from '../../services/graphql.service';
import {
  fadeIn,
  fadeInOut,
  fadeSmooth,
} from 'src/app/shared/animations/router-animation';
import { PaginatorInput } from '../shared/models/web-paginator.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsSortOption, ItemsSortFilterComponent } from '../../shared/components/items-sort-filter/items-sort-filter.component';
import * as procurementEntitiesSearchFields from './procurement-entities-search';
import { FinancialYear } from '../../modules/nest-app/store/settings/financial-year/financial-year.model';
import { ProcuringEntityLite, ProcuringEntityItemComponent } from './procuring-entity-item/procuring-entity-item.component';
import { GET_PUBLIC_PROCURING_ENTITIES_LITE } from './store/procuring-entities.graphql';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import {
  MustHaveFilter,
  MustHaveFilterOperation,
} from 'src/app/shared/components/paginated-data-table/must-have-filters.model';
import { SearchOperation } from 'src/app/store/global-interfaces/organizationHiarachy';
import { firstValueFrom, Subscription } from 'rxjs';
import { FieldConfig } from "../../shared/components/dynamic-forms-components/field.interface";
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { FrontendPaginatorComponent } from '../shared/components/frontend-paginator/frontend-paginator.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NgClass, DecimalPipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { CustomAlertBoxModel } from 'src/app/shared/components/custom-alert-box/custom-alert-box.model';
import { CustomAlertBoxComponent } from 'src/app/shared/components/custom-alert-box/custom-alert-box.component';
import { PaginatedDataService } from '../../services/paginated-data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface SortFields {
  isSearchable?: boolean;
  isSortable?: boolean;
  operation?: SearchOperation;
  orderDirection?: 'ASC' | 'DESC';
  fieldName?: string;
  searchValue?: string;
  searchValue2?: string;
}
@Component({
	selector: 'app-procuring-entities',
	templateUrl: './procuring-entities.component.html',
	styleUrls: ['./procuring-entities.component.scss'],
	animations: [fadeIn, fadeInOut, fadeSmooth],
	standalone: true,
	imports: [
		LayoutComponent,
		ParallaxContainerComponent,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatIconModule,
		DecimalPipe,
		ItemsSortFilterComponent,
		LoaderComponent,
		ProcuringEntityItemComponent,
		FrontendPaginatorComponent,
		TranslatePipe,
		NgClass,
		CustomAlertBoxComponent,
		MatProgressSpinnerModule,
	],
})
export class ProcuringEntitiesComponent implements OnInit {
	filters = {
		search: '',
	};

	searchKeyWord: string;
	selectedIndex = 0;
	peMain: number = 0;
	peLower: number = 0;
	loadCount: boolean = false;

	pageSize: number = 10;
	items: ProcuringEntityLite[] = [];
	itemsLowerLevel: ProcuringEntityLite[] = [];
	loading: boolean = false;
	pageMustHaveFilters: MustHaveFilter[] = [];
	loadingFinancialYear: boolean = false;
	loadLogo: any = {};
	peLogo: any = {};
	show: any = {};
	paginatorInput: PaginatorInput = {
		loading: true,
	};
	defaultYear: any;
	financialYears: FinancialYear[];
	selectedFinancialYear: string;
	fields: SortFields[] = [];
	pageMustHaveSortFields: SortFields[] = [];
	subtitle: string = '';
	sortFields: any[] = [];
	mustHaveFilters: any[] = [];
	currentSortOption: ItemsSortOption;
	sortOptions: ItemsSortOption[] = [
		{
			label: 'Procuring Entity Name - Ascending',
			fieldName: 'name',
			orderDirection: 'ASC',
		},
		{
			label: 'Procuring Entity Name - Descending',
			fieldName: 'name',
			orderDirection: 'DESC',
		},
	];
	advancedSearchFilterItems: FieldConfig[] =
		procurementEntitiesSearchFields.fields;
	defaultSearchFilterItems: FieldConfig[];

	pageNumber: number = 1;

	reportAlert: CustomAlertBoxModel = {
		title: 'Definition notice',
		details: [
			{
				icon: 'info',
				message:
					'Procuring Entity means a public body and any other body, or  unit established and mandated by government to carry out public functions.',
			},
		],
	};

	lowerlevel: CustomAlertBoxModel = {
		title: 'Definition notice',
		details: [
			{
				icon: 'info',
				message:
					'Lower Level Procuring Entity refers to a facility established by the government specifically to deliver essential community services at the local level.This includes entities responsible for basic administrative functions, education, and health services, such as schools, health facilities, wards, and village.',
			},
		],
	};

	private queryParamsSubscription: Subscription;

	constructor(
		private router: Router,
		private activeRoute: ActivatedRoute,
		private apollo: GraphqlService,
		private http: HttpClient,
		private paginatedDataService: PaginatedDataService,
	) {}

	ngOnInit(): void {
		this.queryParamsSubscription = this.activeRoute.queryParams.subscribe(
			async (params) => {
				this.filters?.search?.trim();
				this.setQueryParamToFilterInputs(params, 'search', 'search');
				this.items = [];
				if (!this.filters.search) {
					this.filters.search = '';
				}
			},
		);
		this.onSortOptionChange(this.sortOptions[0]);
		this.setSelectedIndex(0);
		this.getItemsCount().then();
	}

	setSelectedIndex(index: number) {
		this.selectedIndex = index;
    this.getItems().then();
	}

	setQueryParamToFilterInputs(
		params: any,
		paramName: string,
		inputName: string,
	) {
		this.filters[inputName] =
			params && params[paramName] !== undefined ? params[paramName] : null;
	}

	async searchByInputFilters() {
		this.resetPagination();
		this.loading = true;
		/** Get current URL segments */
		const currentUrl = this.router.url.split('?')[0];
		const segments = currentUrl.split('/');

		/** Add query parameters to URL  */
		/** check if search text is empty set it to null  */
		if (this.filters.search == '') {
			this.filters.search = null;
		}

		const queryParams = {
			search: this.filters.search,
		};

		/** Navigate to updated URL */
		await this.router.navigate(segments, {
			queryParams: queryParams,
			queryParamsHandling: 'merge',
		});

		this.getItems().then();
	}

	getPaginatorLabel() {
		return NestUtils.getPaginationCountLabel(this.paginatorInput);
	}

	async clearSearch() {
		const currentUrl = this.router.url.split('?')[0];
		const segments = currentUrl.split('/');
		this.filters.search = null;
		const queryParams = {
			category: null,
			search: null,
		};
		await this.router.navigate(segments, {
			queryParams: queryParams,
			queryParamsHandling: 'merge',
		});
		window.location.reload();
	}

	setSubTitle() {
		this.subtitle = `A list of procuring entities`;
	}

	setMustHaveFilter(
		fieldName: string,
		operation: MustHaveFilterOperation,
		value1: string,
		inValues: string[] = null,
	) {
		if (!(value1 || inValues)) {
			return;
		}
		this.pageMustHaveFilters = this.pageMustHaveFilters.filter(
			(filter) => filter.fieldName !== fieldName,
		);

		let filter: MustHaveFilter = {
			fieldName,
			operation,
			inValues,
			value1,
		};

		if (inValues == null) {
			delete filter?.inValues;
		}

		if (value1 == null) {
			delete filter?.value1;
		}

		this.pageMustHaveFilters.push(filter);
	}

	async getItemsCount() {
		this.loadCount = true;
		let listPe = [];

		try {
			const results = await firstValueFrom(
				this.http.get<any>(
					environment.AUTH_URL +
						`/nest-uaa/report/procuring-entity/count-all-pe`,
				),
			);

			this.peMain = results ?? 0;

			const resultsLowerLevel = await firstValueFrom(
				this.http.get<any>(
					environment.AUTH_URL +
						`/nest-uaa/report/procuring-entity/count-all-ll`,
				),
			);

			this.peLower = resultsLowerLevel ?? 0;

			this.loadCount = false;
		} catch (e) {
			this.loadCount = false;
		}
	}

	async getItems() {
		this.generateFilterOptions();

		this.sortFields = [...this.sortFields, ...this.fields];
		this.loading = true;

		const response: any = await this.apollo.fetchData({
			query: GET_PUBLIC_PROCURING_ENTITIES_LITE,
			apolloNamespace: ApolloNamespace.uaa,
			variables: {
				withMetaData: false,
				input: {
					page: this.pageNumber,
					pageSize: this.pageSize,
					fields: this.sortFields,
					mustHaveFilters: this.mustHaveFilters,
				},
			},
		});

		const results = response.data.items;
		this.paginatorInput = {
			loading: false,
			first: results?.first ?? false,
			last: results?.last ?? false,
			hasNext: results?.hasNext,
			hasPrevious: results?.hasPrevious,
			currentPage: results?.currentPage,
			numberOfRecords: results?.numberOfRecords,
			pageSize: results?.pageSize,
			totalPages: results?.totalPages,
			totalRecords: results?.totalRecords,
			recordsFilteredCount: results?.recordsFilteredCount,
		};


    if (this.selectedIndex == 0){
      this.items =results.rows
    }else{
      this.itemsLowerLevel = results.rows
    }



		// this.items = (results.rows ?? []).filter(
		// 	(item) => item.isLowerLevel === false || item.isLowerLevel === null,
		// );
		// this.itemsLowerLevel = (results.rows ?? []).filter(
		// 	(item) => item.isLowerLevel === true,
		// );
		this.loading = false;
	}

	generateFilterOptions() {
		this.fields = [];
    this.mustHaveFilters = [];

		this.mustHaveFilters = [
			{
				fieldName: 'id',
				operation: SearchOperation.NE,
				value1: '61851',
			},
      {
        fieldName: 'isLowerLevel',
        operation: SearchOperation.EQ,
        value1: this.selectedIndex == 0 ? 'false' : 'true',
      }
		];

    if (this.selectedIndex == 1){
      this.mustHaveFilters.push({
        fieldName: 'parentProcuringEntity.id',
        operation: SearchOperation.NE,
        value1: '61851',
      })
    }

		this.applyKeywordSearchFields();

		this.mustHaveFilters = [
			...this.mustHaveFilters,
			...this.pageMustHaveFilters,
		];

		this.fields = [...this.fields, ...this.pageMustHaveSortFields];
	}

	applyKeywordSearchFields() {
		this.resetSearchFields();
		let input = this.filters?.search?.trim();
		if (!input) return;
		this.setSearchQueryField('name', input);
		this.setSearchQueryField('acronym', input);
		this.setSearchQueryField('nameSW', input);
		this.setSearchQueryField('physicalAddress', input);
		this.setSearchQueryField('postalAddress', input);
		this.setSearchQueryField('acronym', input);
	}

	resetSearchFields() {
		this.removeSortFields([
			'acronym',
			'nameSW',
			'physicalAddress',
			'postalAddress',
			'acronym',
		]);
	}

	removeSortFields(fieldNames: string[]) {
		this.sortFields = this.sortFields.filter(
			(filterField) =>
				!fieldNames.some((fieldName) => fieldName === filterField.fieldName),
		);
	}

	setSearchQueryField(fieldName: string, value: string) {
		let filter: any = {
			fieldName: fieldName,
			operation: SearchOperation.LK,
			isSearchable: true,
			searchValue: value,
		};

		if (this.currentSortOption.fieldName === fieldName) {
			filter = {
				...filter,
				orderDirection: this.currentSortOption.orderDirection,
			};
		}

		this.sortFields = this.sortFields.filter(
			(filterField) => filterField.fieldName !== fieldName,
		);

		this.sortFields.push(filter);
	}

	setInputFilter(
		filterName: string,
		filterMustHaveFieldName: string,
		filterValue: string,
		subTitle: string = null,
	) {
		this.removeMustHaveFilter(filterMustHaveFieldName);
		this.setMustHaveFilter(filterMustHaveFieldName, 'EQ', filterValue);
		if (this.filters[filterName]) {
			this.setMustHaveFilter(filterMustHaveFieldName, 'EQ', filterValue);
		}
	}

	removeMustHaveFilter(fieldName: string) {
		this.pageMustHaveFilters = this.pageMustHaveFilters.filter(
			(filter) => filter.fieldName !== fieldName,
		);
	}

	handlePageEvent($event) {
		this.pageNumber = $event;
		this.getItems().then();
	}

	handlePageSizeEvent($event) {
		this.pageNumber = 1;
		this.pageSize = $event;
		this.getItems().then();
	}

	onSortOptionChange(option: ItemsSortOption) {
		this.setSortOptionChange(option);
	}

	onPageNumberChange(pageNumber: number) {
		this.pageNumber = pageNumber;
		this.getItems().then();
	}

	setSortOptionChange(option: ItemsSortOption) {
		this.currentSortOption = option;
		let filter: any = {
			fieldName: option.fieldName,
			isSortable: true,
			orderDirection: option.orderDirection,
		};

		let existingSortField = this.sortFields.find(
			(sortField) => sortField.fieldName === option.fieldName,
		);

		if (existingSortField) {
			filter = {
				...filter,
				operation: existingSortField.operation,
			};
		}

		this.sortFields = this.sortFields.filter(
			(filterField) =>
				!this.sortOptions.some(
					(sortOption) => sortOption.fieldName === filterField.fieldName,
				),
		);

		this.sortFields.push(filter);
		this.resetPagination();
		this.getItems().then();
	}

	onPageSizeChange(pageSize: number) {
		this.pageNumber = 1;
		this.pageSize = pageSize;
		this.getItems().then();
	}

	resetPagination() {
		this.items = [];
		this.itemsLowerLevel = [];
		this.pageNumber = 1;
		this.paginatorInput = {
			loading: true,
		};
	}
}
