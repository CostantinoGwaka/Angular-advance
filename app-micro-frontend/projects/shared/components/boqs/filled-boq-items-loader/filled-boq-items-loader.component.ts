import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { PaginatedBOQSubItemsResults } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import { DataRequestInput } from '../../paginated-data-table/data-page.model';
import { FieldRequestInput } from '../../paginated-data-table/field-request-input.model';
import { MustHaveFilter } from '../../paginated-data-table/must-have-filters.model';
import { GraphqlService } from '../../../../services/graphql.service';
import { MatButtonModule } from '@angular/material/button';

import { SimpleLinearProgressBarComponent } from '../../simple-linear-progress-bar/simple-linear-progress-bar.component';

@Component({
  selector: 'app-filled-boq-items-loader',
  templateUrl: './filled-boq-items-loader.component.html',
  standalone: true,
  imports: [SimpleLinearProgressBarComponent, MatButtonModule],
})
export class FilledBoqItemsLoaderComponent implements OnInit {
  loaderProgress: number = 0;

  @Input({ required: true })
  endpoint: any;

  @Input({ required: true })
  identifierUuid: string;

  @Input({ required: true })
  nameSpace: ApolloNamespace;

  @Output() onFinishedLoading: EventEmitter<any[]> = new EventEmitter();

  showRetryButton: boolean = false;
  failed: boolean = false;
  loadedPage: number = 0;
  isFetching: boolean = false;
  failedPageNumber: number = null;

  loadedItems: any[] = [];
  totalPages: number = 0;
  cancel = false;

  retryCounts = 0;

  retryMessagesByCount = [
    'Failed to load items, please retry',
    'Please retry again, we are still having trouble loading items',
    'Please be patient, retry again, our servers are very busy right now',
    'Failed to load items, please retry until the progress bar reaches 100%',
  ];

  constructor(private apollo: GraphqlService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.startLoading();
  }

  ngOnDestroy(): void {
    this.cancel = true;
  }

  startLoading() {
    this.failed = false;
    this.loaderProgress = 0;
    this.showRetryButton = false;
    this.load();
  }

  retryLoading() {
    this.retryCounts++;
    this.failed = false;
    this.showRetryButton = false;
    this.load(this.loadedPage, this.failedPageNumber);
  }

  async load(loadedPage: number = 0, startPage: number = 1) {
    this.loadedPage = loadedPage;
    this.isFetching = true;

    const loadItems = async (page: number) => {
      let results: PaginatedBOQSubItemsResults;

      try {
        results = await this.fetchItems(page);

        if (results?.success) {
          if (results?.boqSubItems?.length == 0 && page <= 1) {
            this.loaderProgress = 100;
            this.isFetching = false;
            this.onFinishedLoading.emit([]);
            return;
          } else {
            this.loadedItems = [...this.loadedItems, ...results.boqSubItems];
            this.loadedPage++;
            if (results.totalPages) {
              this.totalPages = results.totalPages;
            }
            this.updateLoadingPercent();
          }
        } else {
          this.failed = true;
          this.showRetryButton = true;
          this.isFetching = false;
        }
      } catch (e) {
        this.failed = true;
        this.showRetryButton = true;
        this.isFetching = false;
        console.log('Error loading items');
        console.error(e);
      }
    };

    await loadItems(startPage);

    for (let i = startPage + 1; i < this.totalPages + 1; i++) {
      if (!this.cancel && !this.failed) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await loadItems(i);
      } else {
        break;
      }
    }

    if (this.failed) {
      this.showRetryButton = true;
    } else {
      this.updateLoadingPercent();
    }
  }

  get retryMessage() {
    return this.retryMessagesByCount[
      this.retryCounts < 4 ? this.retryCounts : 3
    ];
  }

  updateLoadingPercent() {
    if (this.totalPages == 0) {
      this.loaderProgress = 0;
    } else {
      this.loaderProgress = Math.ceil(
        (this.loadedPage / this.totalPages) * 100
      );
    }
    if (this.loaderProgress >= 100) {
      this.isFetching = false;
      this.onFinishedLoading.emit(this.loadedItems);
    }
  }

  async fetchItems(page: number): Promise<PaginatedBOQSubItemsResults> {
    let pageSize = 25;
    let fields: FieldRequestInput[] = [
      {
        fieldName: 'id',
        orderDirection: 'ASC',
      },
    ];

    let mustHaveFilters: MustHaveFilter[] = [];

    let input: DataRequestInput = {
      page,
      pageSize,
      fields,
      mustHaveFilters,
    };

    let success = false;
    let result: any = null;
    let items: any[] = [];

    try {
      result = await this.apollo.fetchData({
        apolloNamespace: this.nameSpace,
        query: this.endpoint,
        variables: {
          submissionCriteriaUuid: this.identifierUuid,
          input: input,
        },
      });
      items = result.data.items.rows;
      success = true;
    } catch (e) {
      this.failedPageNumber = page;
      console.error(e);
      success = false;
    }

    let res: PaginatedBOQSubItemsResults = {
      success,
      boqSubItems: result?.data?.items?.rows ? result?.data?.items?.rows : [],
      totalRecords: result?.data?.items?.totalRecords,
      numberOfRecords: result?.data?.items?.totalRecords,
      pageSize: result?.data?.items?.pageSize,
      totalPages: result?.data?.items?.totalPages,
      currentPage: result?.data?.items?.currentPage,
      hasNext: result?.data?.items?.hasNext,
      recordsFilteredCount: result?.data?.items?.recordsFilteredCount,
    };

    return res;
  }
}
