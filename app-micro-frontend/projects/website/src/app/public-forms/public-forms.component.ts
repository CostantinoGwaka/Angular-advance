import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { SharedDocuments } from "../../modules/nest-settings/store/shared-documents/shared-documents.model";
import {
  MustHaveFilter,
  MustHaveFilterOperation
} from "../../shared/components/paginated-data-table/must-have-filters.model";
import { PaginatorInput } from "../shared/models/web-paginator.model";
import { FinancialYear } from "../../modules/nest-app/store/settings/financial-year/financial-year.model";
import { ItemsSortOption, ItemsSortFilterComponent } from "../../shared/components/items-sort-filter/items-sort-filter.component";
import {
  GET_SHAREABLE_DOCUMENT_DATA
} from "../../modules/nest-settings/store/shared-documents/shared-documents.graphql";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { GraphqlService } from "../../services/graphql.service";
import { NestUtils } from "../../shared/utils/nest.utils";
import { SearchOperation } from "../../store/global-interfaces/organizationHiarachy";
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { FrontendPaginatorComponent } from '../shared/components/frontend-paginator/frontend-paginator.component';
import { SharedDocumentsItemsComponent } from '../shared-documents/shared-documents-items/shared-documents-items.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
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
    selector: 'app-public-forms',
    templateUrl: './public-forms.component.html',
    styleUrls: ['./public-forms.component.scss'],
    standalone: true,
    imports: [LayoutComponent, ParallaxContainerComponent, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, ItemsSortFilterComponent, LoaderComponent, SharedDocumentsItemsComponent, FrontendPaginatorComponent, TitleCasePipe, TranslatePipe]
})
export class PublicFormsComponent implements OnInit {
  filters = {
    search: '',
  };
  loading: boolean = false;
  formTitle: string = 'A list of all published forms';

  items: SharedDocuments[] = [];
  searchKeyWord: string;
  pageSize: number = 10;
  pageMustHaveFilters: MustHaveFilter[] = [];
  getCode: any;
  loadLogo: any = {};
  peLogo: any = {};
  show: any = {};
  paginatorInput: PaginatorInput = {
    loading: true,
  };
  financialYears: FinancialYear[];
  selectedFinancialYear: string;
  fields: SortFields[] = [];
  pageMustHaveSortFields: SortFields[] = [];
  sortFields: any[] = [];
  mustHaveFilters: any[] = [];
  currentSortOption: ItemsSortOption;
  pageNumber: number = 1;
  sortOptions: ItemsSortOption[] = [
    {
      label: 'Created At - Ascending',
      fieldName: 'createdAt',
      orderDirection: 'ASC',
    },
    {
      label: 'Created At - Descending',
      fieldName: 'createdAt',
      orderDirection: 'DESC',
    },
  ];


  private queryParamsSubscription: Subscription;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apollo: GraphqlService
  ) { }

  ngOnInit(): void {
    this.queryParamsSubscription = this.activeRoute.queryParams.subscribe(
      async (params) => {
        this.getCode = params;
        this.filters?.search?.trim();
        this.setQueryParamToFilterInputs(params, 'search', 'search');
        this.items = [];
        if (!this.filters.search) {
          this.filters.search = '';
        }
        this.onSortOptionChange(this.sortOptions[0]);
        this.resetPagination();
        this.getItems().then();
      }
    );
    this.onSortOptionChange(this.sortOptions[0]);
  }


  setQueryParamToFilterInputs(
    params: any,
    paramName: string,
    inputName: string
  ) {
    this.filters[inputName] = params && params[paramName] !== undefined ? params[paramName] : null;
    this.setMustHaveFilter('shareableDocumentCategoryCode', 'EQ', 'FORMS');
  }


  async clearSearch() {
    const currentUrl = this.router.url.split('?')[0];
    const segments = currentUrl.split('/');
    this.filters.search = null;
    const queryParams = {
      search: null,
    };
    await this.router.navigate(segments);


    window.location.reload();
  }

  async searchByInputFilters() {
    this.resetPagination();
    this.loading = true;
    this.formTitle = `A list of all published forms | filtered by ${this.filters.search}`;
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

  resetPagination() {
    this.items = [];
    this.pageNumber = 1;
    this.paginatorInput = {
      loading: true,
    };
  }

  getPaginatorLabel() {
    return NestUtils.getPaginationCountLabel(this.paginatorInput);
  }

  onSortOptionChange(option: ItemsSortOption) {
    this.setSortOptionChange(option);
  }
  setSortOptionChange(option: ItemsSortOption) {
    this.currentSortOption = option;
    let filter: any = {
      fieldName: option.fieldName,
      isSortable: true,
      orderDirection: option.orderDirection,
    };

    let existingSortField = this.sortFields.find(
      (sortField) => sortField.fieldName === option.fieldName
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
          (sortOption) => sortOption.fieldName === filterField.fieldName
        )
    );

    this.sortFields.push(filter);
    this.resetPagination();
    this.getItems().then();
  }



  async getItems() {
    this.setMustHaveFilter('documentPrivacy', 'EQ', 'PUBLIC');
    this.generateFilterOptions();
    this.sortFields = [...this.sortFields, ...this.fields];
    this.loading = true;

    const response: any = await this.apollo.fetchData({
      query: GET_SHAREABLE_DOCUMENT_DATA,
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

    const results = response.data.getShareableDocumentData;
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

    this.items = results.rows ?? [];
    this.loading = false;
  }

  generateFilterOptions() {
    this.fields = [];
    this.mustHaveFilters = [];

    this.applyKeywordSearchFields();

    this.mustHaveFilters = [
      ...this.mustHaveFilters,
      ...this.pageMustHaveFilters,
    ];

    this.fields = [...this.fields, ...this.pageMustHaveSortFields];
  }

  removeSortFields(fieldNames: string[]) {
    this.sortFields = this.sortFields.filter(
      (filterField) =>
        !fieldNames.some((fieldName) => fieldName === filterField.fieldName)
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
      (filterField) => filterField.fieldName !== fieldName
    );

    this.sortFields.push(filter);
  }

  applyKeywordSearchFields() {
    this.resetSearchFields();
    let input = this.filters?.search?.trim();
    if (!input) return;
    this.setSearchQueryField('title', input);
    this.setSearchQueryField('code', input);
    this.setSearchQueryField('description', input);
  }

  resetSearchFields() {
    this.removeSortFields([
      'shareableDocumentCategoryCode',
      'title',
    ]);
  }

  onPageSizeChange(pageSize: number) {
    this.pageNumber = 1;
    this.pageSize = pageSize;
    this.getItems().then();
  }

  onPageNumberChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getItems().then();
  }

  setInputFilter(
    filterName: string,
    filterMustHaveFieldName: string,
    filterValue: string,
    subTitle: string = null
  ) {
    this.removeMustHaveFilter(filterMustHaveFieldName);
    this.setMustHaveFilter(filterMustHaveFieldName, 'EQ', filterValue);
    if (this.filters[filterName]) {
      if (subTitle) {
        this.formTitle = subTitle;
      }
      this.setMustHaveFilter(filterMustHaveFieldName, 'EQ', filterValue);
    }
  }

  removeMustHaveFilter(fieldName: string) {
    this.pageMustHaveFilters = this.pageMustHaveFilters.filter(
      (filter) => filter.fieldName !== fieldName
    );
  }


  setMustHaveFilter(
    fieldName: string,
    operation: MustHaveFilterOperation,
    value1: string,
    inValues: string[] = null,
    value2: string = null
  ) {
    if (!(value1 || inValues)) {
      return;
    }
    this.pageMustHaveFilters = this.pageMustHaveFilters.filter(
      (filter) => filter.fieldName !== fieldName
    );

    let filter: MustHaveFilter = {
      fieldName,
      operation,
      inValues,
      value1,
      value2,
    };

    if (inValues == null) {
      delete filter?.inValues;
    }

    if (value1 == null) {
      delete filter?.value1;
    }

    if (value2 == null) {
      delete filter?.value2;
    }

    this.pageMustHaveFilters.push(filter);
  }

}
