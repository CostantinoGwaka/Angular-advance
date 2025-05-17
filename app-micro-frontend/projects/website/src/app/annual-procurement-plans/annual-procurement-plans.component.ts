import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from '../../services/graphql.service';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { GET_PUBLIC_PUBLISHED_APP } from '../store/public-tenders.graphql';
import { PaginatorInput } from '../shared/models/web-paginator.model';
import { ItemsSortOption } from 'src/app/shared/components/items-sort-filter/items-sort-filter.component';
import { Router } from "@angular/router";
import * as procurementEntitiesSearchFields from "../procuring-entities/procurement-entities-search";
import { GET_THREE_RECENT_FINANCIAL_YEARS, } from "../../modules/nest-reports/store/reports/reports.graphql";
import { FinancialYear } from "../../modules/nest-app/store/settings/financial-year/financial-year.model";
import { SearchOperation } from "../../store/global-interfaces/organizationHiarachy";
import { FieldConfig } from "../../shared/components/dynamic-forms-components/field.interface";
import { Apollo } from "apollo-angular";
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { FrontendPaginatorComponent } from '../shared/components/frontend-paginator/frontend-paginator.component';
import { RenderTenderGpnComponent } from '../shared/components/render-tender-gpn/render-tender-gpn.component';
import { MatIconModule } from '@angular/material/icon';
import { ItemsSortFilterComponent } from '../../shared/components/items-sort-filter/items-sort-filter.component';
import { AdvancedSearchFilterComponent } from '../../shared/components/advanced-search-filter/advanced-search-filter.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';

@Component({
  selector: 'app-annual-procurement-plans',
  templateUrl: './annual-procurement-plans.component.html',
  styleUrls: ['./annual-procurement-plans.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LayoutComponent,
    ParallaxContainerComponent,
    LoaderComponent,
    AdvancedSearchFilterComponent,
    ItemsSortFilterComponent,
    MatIconModule,
    RenderTenderGpnComponent,
    FrontendPaginatorComponent,
    CurrencyPipe,
    DatePipe,
    TranslatePipe
],
})

export class AnnualProcurementPlansComponent implements OnInit {
  searchKeyWord: string;
  selectedFinancialYear: string;
  subtitle: string = '';
  pes: any[] = [];
  loading: boolean = false;
  loadLogo: any = {};
  peLogo: any = {};
  show: any = {};
  defaultYear: any;
  loadingFinancialYear: boolean = false;
  financialYears: FinancialYear[];

  paginatorInput: PaginatorInput = {
    loading: true,
  };

  page = 1;
  pageSize = 10;

  sortOptions: ItemsSortOption[] = [
    {
      label: 'Publication Date - Descending',
      fieldName: 'generalProcurementNoticeAdvertDate',
      orderDirection: 'DESC',
    },
    {
      label: 'Publication Date - Ascending',
      fieldName: 'generalProcurementNoticeAdvertDate',
      orderDirection: 'ASC',
    },
    {
      label: 'Estimated Budget - Descending',
      fieldName: 'estimatedBudget',
      orderDirection: 'DESC',
    },
    {
      label: 'Estimated Budget - Ascending',
      fieldName: 'estimatedBudget',
      orderDirection: 'ASC',
    },
    {
      label: 'Total GPN Tender - Ascending',
      fieldName: 'totalTenderCount',
      orderDirection: 'ASC',
    },
    {
      label: 'Total GPN Tender - Descending',
      fieldName: 'totalTenderCount',
      orderDirection: 'DESC',
    },
    {
      label: 'Procuring Entity Name - Ascending',
      fieldName: 'procuringEntityName',
      orderDirection: 'ASC',
    },
    {
      label: 'Procuring Entity Name - Descending',
      fieldName: 'procuringEntityName',
      orderDirection: 'DESC',
    },
  ];
  sortFields: any[] = [];
  mustHaveFilters: any[] = [];

  searchFilterItems: FieldConfig[] = procurementEntitiesSearchFields.fields;
  defaultSearchFilterItems: FieldConfig[] = procurementEntitiesSearchFields.fields;

  constructor(
    private router: Router,
    private apollo: GraphqlService
  ) {
  }

  ngOnInit(): void {
    this.getFinancialYears().then(_ => {
      this.setSortOptionChange(this.sortOptions[0]);
      this.getAPP().then();
    });
  }

  onSortOptionChange(option: ItemsSortOption) {
    this.setSortOptionChange(option);
    this.getAPP().then();
  }

  setMustHaveFilter(key: string, value: any) {

    const filter = {
      fieldName: key,
      operation: 'EQ',
      value1: value
    };
    if (value) {
      this.mustHaveFilters.push(filter);
    }
    this.resetPagination();
  }

  setSortOptionChange(option: ItemsSortOption) {
    const filter = {
      fieldName: option.fieldName,
      isSortable: true,
      orderDirection: option.orderDirection,
    };

    this.sortFields = this.sortFields.filter(
      (filterField) =>
        !this.sortOptions.some(
          (sortOption) => sortOption.fieldName === filterField.fieldName
        )
    );
    this.sortFields.push(filter);
    this.resetPagination();
  }

  resetPagination() {
    this.pes = [];
    this.page = 1;
    this.paginatorInput = {
      loading: true,
    };
  }

  async getAPP() {
    try {
      this.loading = true;
      const response: any = await this.apollo.fetchData({
        query: GET_PUBLIC_PUBLISHED_APP,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          input: {
            fields: this.sortFields,
            mustHaveFilters: this.mustHaveFilters,
            page: this.page,
            pageSize: this.pageSize,
          },
          withMetaData: true,
        },
      });

      const results = response.data.getPublicPublishedApp;

      this.paginatorInput = {
        loading: results.false,
        first: results.first,
        last: results.last,
        hasNext: results.hasNext,
        hasPrevious: results.hasPrevious,
        currentPage: results.currentPage,
        numberOfRecords: results.numberOfRecords,
        pageSize: results.pageSize,
        totalPages: results.totalPages,
        totalRecords: results.totalRecords,
        recordsFilteredCount: results.recordsFilteredCount,
      };

      this.pes = results.data ?? [];
      this.loading = false;
    } catch (e) {
      console.error(e);
    }
  }

  async getFinancialYears() {
    try {
      this.loadingFinancialYear = true;
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_THREE_RECENT_FINANCIAL_YEARS
      });

      if (response?.data?.getThreeRecentFinancialYears?.code == 9000) {
        this.financialYears = response?.data?.getThreeRecentFinancialYears?.dataList;
        const foundYear = this.financialYears.find(item => item.active);
        this.defaultYear = {
          name: foundYear.code,
          value: foundYear.code
        }

        const index = this.searchFilterItems.findIndex(item => item.key == 'financialYearCode');
        if (index && this.financialYears.length) {
          this.searchFilterItems[index].options = this.financialYears.map(yr => {
            return {
              name: yr.code,
              value: yr.code
            }
          });

          this.searchFilterItems[index].value = this.defaultYear.value;


          this.defaultSearchFilterItems = this.searchFilterItems;
          this.selectedFinancialYear = foundYear.code;

          this.setSubTitle();
          /// Set must have filter based on financial year
          this.setMustHaveFilter('financialYearCode', this.defaultYear.value);
        }
        this.loadingFinancialYear = false;

      } else {
        console.error(response?.data?.getThreeRecentFinancialYears?.message);
        this.loadingFinancialYear = false;

      }
    } catch (e) {
      console.error(e);
      this.loadingFinancialYear = false;
    }
  }

  searchByInputFilters(searchObject) {

    this.mustHaveFilters = [];
    //TODO: example of search object
    // const exampleSearchObject: any  = {
    //   searchParams: {
    //     searchKeyWord: "Tanesco",
    //     financialYearCode: "2023/2024"
    //   },
    //   advancedParams: {}
    // }

    Object.keys(searchObject).forEach(event => {
      let searchParamsData: any;
      if (event === 'searchParams') {
        searchParamsData = searchObject[event];
        Object.keys(searchParamsData).forEach(key => {


          if (key == 'searchKeyWord') {
            /// check for genericKeyWord
            this.searchKeyWord = searchParamsData[key];
            const filter = {
              fieldName: 'procuringEntityName',
              operation: SearchOperation.LK,
              isSortable: true,
              searchValue: this.searchKeyWord
            };

            /// remove repeated filter fields
            this.sortFields = this.sortFields.filter(
              (filterField) => filterField.fieldName !== filter.fieldName
            );
            this.sortFields.push(filter);
          } else {
            /// remove repeated filter fields
            this.mustHaveFilters = this.mustHaveFilters.filter(
              (filterField) => filterField.fieldName !== key
            );

            if (key == 'financialYearCode' && searchParamsData[key] !== null) {
              this.selectedFinancialYear = searchParamsData[key];
              this.setSubTitle();
            }
            this.setMustHaveFilter(key, searchParamsData[key]);
          }
        });
      }
    });

    this.getAPP().then();
  }


  setSubTitle() {
    this.subtitle = `A list of GPNs published for all PEs for the ${this.selectedFinancialYear} financial year.`;
  }

  clearSearchParams() {
    this.mustHaveFilters = [];
    this.sortFields = [];
    this.searchFilterItems = [];
    this.searchFilterItems = this.defaultSearchFilterItems;
    this.selectedFinancialYear = this.defaultYear?.value;
    this.setMustHaveFilter('financialYearCode', this.defaultYear.value);
    this.setSubTitle();
    this.getAPP().then();
  }

  checkGPNSummary() {
    const queryParams = {
      financialYear: this.selectedFinancialYear,
    };

    /** Navigate to updated URL */
    this.router.navigate(['/public-gpn-summary'],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }).then();
  }

  viewMore(pe: any) {
    let temp = this.show[pe.appUuid];
    this.show = {};
    this.show[pe.appUuid] = !temp;
  }

  handlePageEvent($event) {
    this.page = $event;
    this.getAPP().then();
  }

  expandedRowClose(peUuid) {
    this.show = {};
    this.show[peUuid] = false;
  }

  handlePageSizeEvent($event) {
    this.page = 1;
    this.pageSize = $event;
    this.getAPP().then();
  }
}
