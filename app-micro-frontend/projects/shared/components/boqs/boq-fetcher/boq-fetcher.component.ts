import { NotificationService } from '../../../../services/notification.service';
import { NestedSpecificationsService } from 'src/app/shared/components/nested-specifications-builder/nested-specifications.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  BoqsService,
  BOQSummarySums,
  GetBOQSubItemsResults,
  RequisitionItemItemizations,
} from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs.service';
import {
  BOQItem,
  GroupedBOQ,
} from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import { BOQSubItem } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-sub-items/boq-sub-item.model';
import { colors } from 'src/app/shared/colors';
import { CircularProgressBarComponent } from '../../circular-progress-bar/circular-progress-bar.component';
import { FlatNestedSpecificationItemView } from '../../nested-specifications-builder/store/model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AnimatedDigitComponent } from '../../animated-digit/animated-digit.component';

export type fetchBy = 'query' | 'categoryId';
export interface BOQFetchingConfiguration {
  fetchBy: 'query' | 'categoryId';
  fetchByValue?: string;
  fetchByParentValue?: string;
  groupId?: number;
  endPointName?: string;
  requisitionObjectFieldName?: string;
  requisitionItemsFieldName?: string;
  requisitionItemsItemizationsFieldName?: string;
  isFilled: boolean;
}

@Component({
  selector: 'app-boq-fetcher',
  templateUrl: './boq-fetcher.component.html',
  styleUrls: ['./boq-fetcher.component.scss'],
  standalone: true,
  imports: [
    CircularProgressBarComponent,
    AnimatedDigitComponent,
    MatButtonModule,
    MatIconModule
  ],
})
export class BoqFetcherComponent implements OnInit {
  colors = colors;

  @Input()
  fetchingConfiguration: BOQFetchingConfiguration;

  @Input()
  forPPRAAdmin: boolean = false;

  @Input()
  onBOQFinishedLoading: (
    flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
    boqSummarySums?: BOQSummarySums
  ) => void;

  constructor(
    private boqsService: BoqsService,
    private nestedSpecificationsService: NestedSpecificationsService,
    private notificationService: NotificationService
  ) { }

  boqItems: BOQItem[] = [];
  boqSubItems: BOQSubItem[] = [];

  cancel = false;

  boqItemsPercentageProgress = 0;
  prevBOQItemsPercentageProgress = 0;
  boqSubItemsPercentageProgress = 0;
  prevBOQSubItemsPercentageProgress = 0;
  sortingpercentageProgress = 0;

  totalPages = 0;
  loadedPage = 0;
  boqSubItemsLoadedPage = 0;

  fetchedBOQItems: Map<string, BOQItem[]>;
  fetchedSubBOQItems: Map<string, BOQSubItem[]>;

  parentBOQItems: BOQItem[] = [];

  @ViewChild('boqItemsProgressRef')
  boqItemsProgressRef: CircularProgressBarComponent;

  @ViewChild('boqSubItemsProgressRef')
  boqSubItemsProgressRef: CircularProgressBarComponent;

  @ViewChild('sortingProgressRef')
  sortingProgressRef: CircularProgressBarComponent;

  boqItemsIsFetching = false;
  boqSubItemsIsFetching = false;

  requisitionItems: RequisitionItemItemizations[] = [];

  failed_at: 'main_items' | 'sub_items' = null;
  retryFunction: any;

  ngOnInit(): void {
    // this.fetch();
  }

  ngOnChanges() {
    this.fetch();
  }

  fetch() {
    this.fetchedBOQItems = new Map();
    this.fetchedSubBOQItems = new Map();

    if (this.fetchingConfiguration) {
      switch (this.fetchingConfiguration?.fetchBy) {
        case 'categoryId':
          if (this.fetchingConfiguration.fetchByValue) {
            this.loadedPage = 0;
            this.loadBOQsByCategoryId(
              1,
              parseInt(this.fetchingConfiguration.fetchByValue),
              this.fetchingConfiguration.groupId
            );
          }
          break;
        case 'query':
          this.loadFillableBOQItemsByRequisitionUuidAndItemUuid(
            this.fetchingConfiguration
          );
          break;

        default:
          console.error('Invalid fetching configuration');
          break;
      }
    }
  }

  loadBOQsByCategoryId = async (
    startPage: number,
    categoryId: number,
    groupId: number = null
  ) => {
    if (this.cancel) {
      return;
    }
    this.boqItemsIsFetching = true;
    await this.loadItemsByBOQByPageNumberAndCategoryId(startPage, categoryId);

    for (let i = startPage + 1; i < this.totalPages + 1; i++) {
      if (!this.cancel) {
        await this.loadItemsByBOQByPageNumberAndCategoryId(
          i,
          categoryId,
          groupId
        );
      } else {
        break;
      }
    }
    if (!this.cancel) {
      await this.loadBOQSubItemsByParentIds();
    }
    this.boqItemsIsFetching = false;
  };

  loadItemsByBOQByPageNumberAndCategoryId = async (
    page: number,
    categoryId: number,
    groupId: number = null
  ) => {
    if (this.cancel) {
      return;
    }

    let results: any;

    results = await this.boqsService.getPaginatedBOQsByCategory(
      categoryId,
      page
    );

    if (results?.boqItems?.length == 0 && page <= 1) {
      this.onBOQFinishedLoading([], null);
    }

    if (results.success) {
      if (results?.boqItems) {
        this.boqItems = [...this.boqItems, ...results.boqItems];
      }

      this.boqItems.sort((a, b) => {
        return a.weight - b.weight;
      });

      this.addFetchedBOQItems(results.boqItems);

      this.loadedPage++;
      if (results.totalPages) {
        this.totalPages = results.totalPages;
      }
      this.updateBOQItemsLoadingPercent();
    } else {
      this.cancel = true;
      this.issueRetry(() => {
        this.loadBOQsByCategoryId(page, categoryId, groupId);
      }, 'main_items');
    }
  };

  issueRetry(retryFunction: () => void, failedIn: 'main_items' | 'sub_items') {
    this.cancel = true;
    this.notificationService.errorMessage(
      "'Failed to load BOQs, click 'Retry'"
    );

    this.boqItemsProgressRef.updateColor('#FF0000', '#FF000020');
    this.boqSubItemsProgressRef.updateColor('#FF0000', '#FF000020');

    this.retryFunction = retryFunction;
    this.failed_at = failedIn;
  }

  retry() {
    this.boqItemsProgressRef.updateColor('#000000', '#D7D7D7');
    this.boqSubItemsProgressRef.updateColor(this.colors.accent.main, '#D7D7D7');

    this.cancel = false;
    this.failed_at = null;

    this.retryFunction();
  }

  async loadFillableBOQItemsByRequisitionUuidAndItemUuid(
    fetchingConfiguration: BOQFetchingConfiguration
  ) {

    this.loadedPage = 0;
    this.boqItemsIsFetching = true;

    this.requisitionItems =
      await this.boqsService.getWorksRequisitionItemItemizationsByRequisitionUuid(
        fetchingConfiguration
      );
    let requisitionItemizationsIds = this.requisitionItems.map((item) =>
      item.id.toString()
    );

    if (requisitionItemizationsIds.length > 0) {
      const loadItems = async (page: number) => {
        let results: any;

        results = await this.boqsService.getWorksBOQItemsByItemIds(
          requisitionItemizationsIds,
          page
        );

        this.boqItems = [...this.boqItems, ...results.boqItems];
        this.addFetchedBOQItems(results.boqItems);

        this.loadedPage++;
        if (results.totalPages) {
          this.totalPages = results.totalPages;
        }

        this.updateBOQItemsLoadingPercent();
      };

      await loadItems(1);

      for (let i = 2; i < this.totalPages + 1; i++) {
        if (!this.cancel) {
          await loadItems(i);
        } else {
          break;
        }
      }

      await this.loadRequisitionBOQSubItems();
    } else {
      this.onBOQFinishedLoading([], null);
      console.error('No requisition items found');
    }
    this.arrangeRequisitionIntoListView();
  }

  addFetchedBOQItems(items: BOQItem[]) {
    for (let i = 0; i < items.length; i++) {
      if (items[i]?.boqItem?.uuid) {
        // let existingItems = this.fetchedBOQItems.get(items[i]?.boqItem?.uuid);
        // if (existingItems) {
        //   existingItems.push(items[i]);
        // } else {
        //   existingItems = [];
        //   existingItems.push(items[i]);
        // }
        // this.fetchedBOQItems.set(items[i]?.boqItem?.uuid, existingItems);

        const existingItems = this.fetchedBOQItems.get(items[i].boqItem.uuid) ?? [];
        existingItems.push(items[i]);
        this.fetchedBOQItems.set(items[i].boqItem.uuid, existingItems);
      } else {
        this.parentBOQItems.push(items[i]);
      }
      //
    }
  }

  addFetchedBOQSubItems(items: BOQSubItem[]) {
    for (let i = 0; i < items.length; i++) {
      let parentUuid: string = items[i]?.boqItem?.uuid;
      if (parentUuid) {
        let existingItems = this.fetchedSubBOQItems.get(parentUuid);
        if (existingItems) {
          existingItems.push(items[i]);
        } else {
          existingItems = [];
          existingItems.push(items[i]);
        }
        this.fetchedSubBOQItems.set(parentUuid, existingItems);
      }
    }
  }

  ngOnDestroy() {
    this.cancel = true;
  }

  updateBOQItemsLoadingPercent() {
    if (this.cancel) {
      return;
    }
    this.prevBOQItemsPercentageProgress = this.boqItemsPercentageProgress;

    if (this.totalPages == 0) {
      this.boqItemsPercentageProgress = 0;
    } else {
      this.boqItemsPercentageProgress = Math.ceil(
        (this.loadedPage / this.totalPages) * 100
      );
    }
    this.boqItemsProgressRef?.updateValue(this.boqItemsPercentageProgress);
  }

  updateBOQSubItemsLoadingPercent(totalPages: number, loadedPages: number) {
    if (this.cancel) {
      return;
    }
    this.prevBOQSubItemsPercentageProgress = this.boqSubItemsPercentageProgress;

    if (totalPages == 0) {
      this.boqSubItemsPercentageProgress = 0;
    } else {
      this.boqSubItemsPercentageProgress = Math.ceil(
        (loadedPages / totalPages) * 100
      );
    }

    this.boqSubItemsProgressRef?.updateValue(
      this.boqSubItemsPercentageProgress
    );

    if (this.boqSubItemsPercentageProgress >= 100) {
      this.finishLoading();
    }
  }

  finishLoading() {
    this.arrangeItemsIntoListView(this.fetchingConfiguration.groupId);
  }

  updateSortingProgressPercent(totalItems: number, totalFinished: number) {
    let progress = Math.ceil((totalFinished / totalItems) * 100);

    this.sortingProgressRef?.updateValue(progress);
  }

  // loadBOQSubItems = async (startPage: number) => {
  //   if (this.cancel) {
  //     return;
  //   }
  //   this.boqSubItemsIsFetching = true;
  //   let batchSize = 80;

  //   let subItems = this.boqItems.flatMap((item) => item.boqSubItems);

  //   if (subItems.length == 0 && startPage == 0) {
  //     this.finishLoading();
  //   }

  //   let totalBOQSubItemsToLoad = subItems.length;
  //   let totalPages = Math.ceil(totalBOQSubItemsToLoad / batchSize);

  //   for (let i = startPage; i < totalPages; i++) {
  //     if (!this.cancel) {
  //       await this.loadBOQSubItemsByPageNumber(i);
  //     } else {
  //       break;
  //     }
  //   }
  // };

  // async loadBOQSubItemsByPageNumber(page: number) {
  //   let boqSubItems: any[];
  //   let boqSubItemsResults: GetBOQSubItemsResults;

  //   let boqItemIds = this.boqItems.map((item) => item.id);

  //   boqSubItemsResults = await this.boqsService.getBOQSubItemsByParentIds(
  //     boqItemIds,
  //     this.fetchingConfiguration.isFilled
  //   );

  //   if (boqSubItemsResults.success) {
  //     boqSubItems = boqSubItemsResults.boqSubItems;
  //     this.loadedPage++;
  //     this.boqSubItems.push(...boqSubItems);
  //     this.boqSubItems.sort((a, b) => {
  //       return a.weight - b.weight;
  //     });
  //     this.addFetchedBOQSubItems(boqSubItems);
  //     this.updateBOQSubItemsLoadingPercent(totalPages, page + 1);
  //   } else {
  //     this.cancel = true;
  //     this.issueRetry(() => {
  //       this.loadBOQSubItems(page);
  //     }, 'sub_items');
  //   }
  // }

  async loadBOQSubItemsByParentIds() {
    let parentIds = this.boqItems.map((item) => item.id);
    const loadItems = async (page: number) => {
      let results: any;

      results = await this.boqsService.getBOQSubItemsByParentIds(
        parentIds,
        page,
        this.fetchingConfiguration.isFilled
      );

      if (results.totalPages > 0) {
        this.totalPages = results.totalPages;

        let boqSubItems = results.rows;

        this.boqSubItems.push(...boqSubItems);

        this.addFetchedBOQSubItems(boqSubItems);
        this.updateBOQSubItemsLoadingPercent(this.totalPages, page);
      } else if (results.totalPages === 0) {
        this.updateBOQSubItemsLoadingPercent(1, 1);
      } else {
        this.cancel = true;
        this.issueRetry(() => {
          this.loadBOQSubItemsByParentIds();
        }, 'sub_items');
      }
    };

    await loadItems(1);

    for (let i = 2; i < this.totalPages + 1; i++) {
      if (!this.cancel) {
        await loadItems(i);
      } else {
        break;
      }
    }
  }

  async loadRequisitionBOQSubItems() {
    // let subItems = this.boqItems.flatMap((item) => item.boqSubItems || []);
    await this.loadRequisitionBOQSubItemsByRequisitionItemizationIds();
  }

  async loadRequisitionBOQSubItemsByRequisitionItemizationIds() {
    let itemizationIds = this.boqItems.map((item) => item.id);
    const loadItems = async (page: number) => {
      let results: any;

      results = await this.boqsService.getWorksSubBOQItemsByParentBOQIds(
        itemizationIds,
        page,
        this.forPPRAAdmin,
        this.fetchingConfiguration.isFilled
      );
      if (results.totalPages) {
        this.totalPages = results.totalPages;

        let boqSubItems = results.boqSubItems;

        this.boqSubItems.push(...boqSubItems);

        this.addFetchedBOQSubItems(boqSubItems);
        this.updateBOQSubItemsLoadingPercent(this.totalPages, page);
      }
    };

    await loadItems(1);

    for (let i = 2; i < this.totalPages + 1; i++) {
      if (!this.cancel) {
        await loadItems(i);
      } else {
        break;
      }
    }
  }

  arrangeItemsIntoListView(groupId: number = null) {
    let firstParents = this.boqItems.filter((item) => item.boqItem === null);

    let flatNestedSpecificationItemView: FlatNestedSpecificationItemView[] = [];

    for (let i = 0; i < firstParents.length; i++) {
      if (!this.cancel) {
        this.nestedSpecificationsService.setParentBOQItemToFlatView(
          flatNestedSpecificationItemView,
          firstParents[i],
          groupId,
          this.fetchedBOQItems,
          this.fetchedSubBOQItems
        );
        this.updateSortingProgressPercent(i + 1, firstParents.length);
      } else {
        break;
      }
    }

    if (!this.cancel) {
      const uniqueItems = Array.from(
        new Set(
          flatNestedSpecificationItemView.map((item) => JSON.stringify(item))
        )
      ).map((itemString) => JSON.parse(itemString));
      setTimeout(() => {
        this.onBOQFinishedLoading(uniqueItems);
      }, 200);
    }
  }

  arrangeRequisitionIntoListView() {
    let firstParents = this.boqItems.filter((item) => item.boqItem === null);

    let flatNestedSpecificationItemView: FlatNestedSpecificationItemView[] = [];
    let groupedParentsByItems = this.groupFirstParentsByItems(firstParents);

    for (let j = 0; j < groupedParentsByItems.length; j++) {
      let parents = groupedParentsByItems[j].boqItems;
      flatNestedSpecificationItemView.push({
        type: 'GroupItem',
        level: 0,
        groupId: groupedParentsByItems[j].groupId,
        parentIsExpanded: false,
        uuid: groupedParentsByItems[j].groupUuid,
        nestedSpecificationGroupItem: {
          id: groupedParentsByItems[j].groupId,
          uuid: groupedParentsByItems[j].groupUuid,
          name: groupedParentsByItems[j].groupName,
        },
      });
      for (let i = 0; i < parents.length; i++) {
        if (!this.cancel) {
          this.nestedSpecificationsService.setParentBOQItemToFlatView(
            flatNestedSpecificationItemView,
            parents[i],
            groupedParentsByItems[j].groupId,
            this.fetchedBOQItems,
            this.fetchedSubBOQItems
          );
          this.updateSortingProgressPercent(i + 1, parents.length);
        } else {
          break;
        }
      }
    }

    if (!this.cancel) {
      const uniqueItems = Array.from(
        new Set(
          flatNestedSpecificationItemView.map((item) => JSON.stringify(item))
        )
      ).map((itemString) => JSON.parse(itemString));

      setTimeout(() => {
        let item = this.requisitionItems[0]?.procurementRequisitionItem;
        let summary: BOQSummarySums;
        if (item) {
          summary = {
            provisionSumVariationOfPricesPercent:
              item.pricesVariationPercentagePS,
            provisionSumPhysicalContingencyPercent:
              item.physicalContingencyPercentagePS,
            vatRequired: item.vatRequired,
            bidPrice: item?.totalCost || 0,
          };
        }
        this.onBOQFinishedLoading(uniqueItems, summary);
      }, 1000);
    }
  }

  groupFirstParentsByItems(firstParents: BOQItem[]): GroupedBOQ[] {
    let groupedBOQ: GroupedBOQ[] = [];

    for (let i = 0; i < this.requisitionItems.length; i++) {
      let item = this.requisitionItems[i];

      let parentItems: BOQItem[] = [];

      try {
        for (let j = 0; j < firstParents.length; j++) {
          if (item.id == firstParents[j]?.group?.id) {
            parentItems.push(firstParents[j]);
          }
        }
        groupedBOQ.push({
          groupId: item.id,
          groupUuid: item.uuid,
          groupName: item.description,
          boqItems: parentItems,
        });
      } catch (e) {
        console.error(e);
      }
    }

    return groupedBOQ;
  }
}
