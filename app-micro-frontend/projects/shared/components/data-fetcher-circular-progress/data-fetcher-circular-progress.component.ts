import { GroupedBOQ } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import {
	Component,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output,
	Signal,
} from '@angular/core';
import {
	BOQSummarySums,
	BoqsService,
} from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs.service';
import { GraphqlService } from '../../../services/graphql.service';
import {
	BOQFetchingConfiguration,
	BoqFetcherComponent,
} from '../boqs/boq-fetcher/boq-fetcher.component';
import {
	EditableSpecificationItem,
	FlatNestedSpecificationItemView,
	FormulaNames,
} from '../nested-specifications-builder/store/model';
import { NestedSpecificationHTMLTableBuilderHelper } from '../nested-specifications-builder/nested-specification-html-table-builder-heper-util';
import { NestedSpecificationsService } from '../nested-specifications-builder/nested-specifications.service';
import { NestUtils } from '../../utils/nest.utils';
import { DocumentCreatorService } from '../../../services/document/document-creator.service';
import { Subscription } from 'rxjs';

import { CircularProgressLoaderComponent } from '../circular-progress-loader/circular-progress-loader.component';
import { SignalsStoreService } from '../../../services/signals-store.service';
import { ProgressCircularLoaderComponent } from '../../../modules/nest-tenderer/tender-submission/submission/progress-circular-loader/progress-circular-loader.component';
import { ApolloNamespace } from '../../../apollo.config';

export interface AfterDataFetchResults {
	fetchedData: any;
	payload: DataFetcherQueue;
}

export enum CustomFetcherComponentTypes {
	BOQ_FETCHER = 'BOQ_FETCHER',
	LOOPED_QUERY_FETCHER = 'LOOPED_QUERY_FETCHER',
	PAGINATED_FETCHER = 'PAGINATED_FETCHER',
}

export interface InnerDataFetcherQueue {
	label: string;
}
export interface SubLoader {
	label: string;
	progress: number;
}
export interface DataFetcherQueue {
	label: string;
	field: string;
	onDataNotFound?: 'CONTINUE' | 'STOP';
	onError?: 'CONTINUE' | 'STOP';
	notFoundErrorMessage?: string;
	query?: any;
	apolloNamespace?: ApolloNamespace;
	customFetcherComponent?: CustomFetcherComponentTypes;
	variables?: any;
	additionalData?: any;
	loopedItemsFetchVariablesConfiguration?: any[];
	dataFetcherProgressMessage?: string;
	fetchFunction?: (updateProgressFunction: Function) => Promise<any>;
	dataProcessorFunction?: (payload: AfterDataFetchResults) => Promise<any>;
	afterDataFetchFunction?: (payload: AfterDataFetchResults) => Promise<any>;
	afterLoopedItemsDataFetchFunction?: (loopedData: any[]) => void;
	beforeDataFetchFunction?: () => Promise<any>;
	updateQueueItemFunction?: (item: DataFetcherQueue) => DataFetcherQueue;
}

export interface DataFetcher {
	dataFetcherQueue: DataFetcherQueue[];
	onDataFetchingFinished?: (data: any) => void;
}

export interface QueryResults {
	data: any;
	isSuccess: boolean;
	message: string;
}

@Component({
	selector: 'app-data-fetcher-circular-progress',
	templateUrl: './data-fetcher-circular-progress.component.html',
	styleUrls: ['./data-fetcher-circular-progress.component.scss'],
	standalone: true,
	imports: [
    CircularProgressLoaderComponent,
    BoqFetcherComponent,
    ProgressCircularLoaderComponent
],
})
export class DataFetcherCircularProgressComponent implements OnInit {
	@Input()
	dataFetcher: DataFetcher;

	@Output()
	fetchingComplete: EventEmitter<any> = new EventEmitter();

	@Input()
	finishMessage = 'Finished';

	@Input()
	size = 250;

	@Input()
	forPPRAAdmin = false;

	@Input()
	abort = false;

	fetchedData: any;

	isFetchingData = false;

	hasError = false;

	progressColor = '#049E26';

	errorProgressColor = '#FF0000';

	percentageCompleted = 0;
	currentLoadingMessage = 'Loading...';

	errorMessage = '';

	fetchBOQ = false;

	defaultDataFetcherProgressMessage = 'Fetching items...';
	dataFetcherProgressMessage = this.defaultDataFetcherProgressMessage;

	loopedQueryProgress = 0;
	loopedQueryProgressIndex = 0;
	loopedQueryProgressTotal = 0;

	customFetcherFinishedFetching = false;

	customFetcherMessage = '';

	fetchingConfiguration: BOQFetchingConfiguration;

	fetchedGroupeBOQs: GroupedBOQ[] = [];

	fetchedBOQView: string = '';

	filledBOQItems: any[] = [];
	submittedTmaFees: any;

	hasLoopedFetcher = false;
	showProgressCircularLoader = false;
	private subscription: Subscription;

	signalsStoreService = inject(SignalsStoreService);
	mainLoaderMessage: string = 'loading';
	mainLoaderProgress: Signal<number>;
	totalRecordSignal: Signal<number>;
	mainLoading: boolean = true;

	constructor(
		private apollo: GraphqlService,
		private boqsService: BoqsService,
		private nestedSpecificationsService: NestedSpecificationsService,
		private documentCreatorService: DocumentCreatorService
	) {
		this.mainLoaderProgress =
			this.signalsStoreService.select('viewRecProgress');
		this.totalRecordSignal = this.signalsStoreService.select(
			'viewTotalRecordsKey'
		);
	}

	ngOnInit(): void {
		this.fetchData(0).then();
	}

	async fetchData(index: number) {
		this.showProgressCircularLoader = false;
		this.hasLoopedFetcher = false;

		if (this.abort) {
			this.isFetchingData = false;
			return;
		}

		if (index >= this.dataFetcher.dataFetcherQueue.length) {
			this.currentLoadingMessage = this.finishMessage;
			this.dataFetcher.onDataFetchingFinished?.(this.fetchedData);
			setTimeout(() => {
				this.isFetchingData = false;
				this.fetchingComplete.emit(this.fetchedData);
			}, 2000);
			return;
		}

		let queueItem = this.dataFetcher.dataFetcherQueue[index];

		if (queueItem.dataFetcherProgressMessage) {
			this.dataFetcherProgressMessage = queueItem.dataFetcherProgressMessage;
			this.hasLoopedFetcher = true;
		} else {
			this.dataFetcherProgressMessage = queueItem.dataFetcherProgressMessage;
		}

		if (queueItem.updateQueueItemFunction) {
			queueItem = queueItem.updateQueueItemFunction(queueItem);
		}

		this.currentLoadingMessage = 'Getting ' + queueItem.label + '...';

		let data = null;
		let queryHasAnError = false;

		let loopedItems = queueItem.loopedItemsFetchVariablesConfiguration || [''];

		this.hasLoopedFetcher = loopedItems.length > 1;

		let loopedData: any[] = [];

		if (
			queueItem.query &&
			queueItem.customFetcherComponent !=
				CustomFetcherComponentTypes.PAGINATED_FETCHER
		) {
			let queryBody = queueItem.query.loc?.source.body;

			loopedData = [];

			for (let i = 0; i < loopedItems.length; i++) {
				//
				data = null;
				let loopedItem = loopedItems[i];
				if (queryBody.replace(/\s/g, '').includes('items:')) {
					if (queueItem.loopedItemsFetchVariablesConfiguration?.length > 0) {
						queueItem.variables = {
							...queueItem.variables,
							input: {
								...queueItem.variables.input,
								...loopedItem,
							},
						};
					}
					let res = await this.queryDataPage(
						queueItem.query,
						queueItem.apolloNamespace,
						queueItem.variables
					);
					if (res.isSuccess) {
						data = res.data;
					} else {
						queryHasAnError = true;
					}
				} else {
					if (queueItem.loopedItemsFetchVariablesConfiguration?.length > 0) {
						queueItem.variables = {
							...queueItem.variables,
							...loopedItem,
						};
					}
					let res = await this.normalQuery(
						queueItem.query,
						queueItem.apolloNamespace,
						queueItem.variables
					);
					if (res.isSuccess) {
						data = res.data;
					} else {
						queryHasAnError = true;
					}
				}

				if (queueItem.afterLoopedItemsDataFetchFunction) {
					loopedData.push({
						configuration: loopedItem,
						data,
					});
					if (!queryHasAnError) {
						this.updateLoopedFetcherProgress(i, loopedItems.length);
					}
				}
			}
		}

		if (queueItem.customFetcherComponent === 'BOQ_FETCHER') {
			this.fetchingConfiguration = queueItem.variables.boqFetchingConfiguration;
			let boqsView: string = null;

			if (queueItem.beforeDataFetchFunction) {
				let res = await queueItem.beforeDataFetchFunction();


				boqsView =
					await this.fetchBOQsForRequisitionsAndReturnRequisitionsWithBOQs(
						res.mergedMainProcurementRequisition,
						res.filledBOQ || [],
						res.submittedTmaFees
					);

				data = boqsView;
			}
			if (data == null && queueItem.onDataNotFound === 'STOP') {
				this.hasError = true;
				this.errorMessage =
					queueItem.notFoundErrorMessage || `${queueItem.label} not found`;
				return;
			}
		}

		if (queueItem.customFetcherComponent === 'LOOPED_QUERY_FETCHER') {
			let resQueueItem = queueItem.variables?.hasLoopedFetcher;
			this.showProgressCircularLoader = true;
			this.subscription =
				this.documentCreatorService.itemizationItemCount$.subscribe((value) => {
					resQueueItem = value;
					this.updateLoopedFetcherProgress(
						resQueueItem?.item,
						resQueueItem?.totalItems
					);
					if (resQueueItem?.item === resQueueItem?.totalItems) {
						resQueueItem = {};
					}
				});
			// after finish items set it to false
		}

		if (queueItem.customFetcherComponent === 'PAGINATED_FETCHER') {
			this.hasLoopedFetcher = true;
			let paginatedDataResults = await this.getPaginatedResults(
				queueItem.query,
				queueItem.apolloNamespace,
				queueItem.variables
			);
			if (paginatedDataResults.length == 0) {
				queryHasAnError = true;
			} else {
				queryHasAnError = false;
				data = paginatedDataResults;
			}
		}

		if (queueItem.fetchFunction) {
			data = await queueItem.fetchFunction(
				(totalFinished: number, totalItems: number) => {
					this.updateLoopedFetcherProgress(totalFinished, totalItems);
				}
			);
		}

		if (queueItem.onError === 'STOP' && queryHasAnError) {
			this.hasError = true;
			this.errorMessage = `Error fetching data (${queueItem.label})`;
			return;
		}

		if (!data && queueItem.onDataNotFound === 'STOP') {
			this.hasError = true;
			this.errorMessage =
				queueItem.notFoundErrorMessage || `${queueItem.label} not found`;
			return;
		}

		if (queueItem?.dataProcessorFunction) {
			data = await queueItem.dataProcessorFunction({
				fetchedData: data,
				payload: queueItem,
			});
		}

		this.fetchedData = {
			...this.fetchedData,
			[queueItem.field]: data,
		};

		if (queueItem.afterDataFetchFunction) {
			await queueItem.afterDataFetchFunction({
				fetchedData: data,
				payload: queueItem,
			});
		}

		if (queueItem.afterLoopedItemsDataFetchFunction) {
			await queueItem.afterLoopedItemsDataFetchFunction(loopedData);
		}

		setTimeout(async () => {
			this.updateProgress(index + 1);
			await this.fetchData(index + 1);
		}, 500);
	}

	async getPaginatedResults(
		query: any,
		apolloNamespace: ApolloNamespace,
		variables: any
	) {
		let paginatedVariables = {
			...variables,
			input: {
				fields: [],
				mustHaveFilters: [],
				page: 1,
				pageSize: 5,
			},
		};

		let hasMore = true;
		let results = [];

		while (hasMore) {
			try {
				const response: any = await this.apollo.fetchData({
					query,
					apolloNamespace,
					variables: paginatedVariables,
				});

				if (response.data.items.rows) {
					results.push(...response.data.items.rows);
					//update progress
					this.updateLoopedFetcherProgress(
						paginatedVariables.input.page,
						response.data.items.totalPages
					);
					if (response.data.items.hasNext) {
						await new Promise((resolve) => setTimeout(resolve, 500));
						paginatedVariables.input.page++;
					} else {
						hasMore = false;
					}
				}
			} catch (e) {
				console.error(e);
				hasMore = false;
			}
		}

		return results;
	}

	updateLoopedFetcherProgress(index: number, totalItems: number) {
		this.hasLoopedFetcher = true;
		this.loopedQueryProgressIndex = index;
		this.loopedQueryProgressTotal = totalItems;
		this.loopedQueryProgress = (index / totalItems) * 100;
	}

	async queryDataPage(
		query: any,
		apolloNamespace: any,
		variables: any
	): Promise<QueryResults> {
		let results: QueryResults = {
			data: null,
			isSuccess: false,
			message: '',
		};

		try {
			const response: any = await this.apollo.fetchData({
				query,
				apolloNamespace,
				variables,
			});

			if (response.data.items.rows) {
				results.isSuccess = true;
				results.data = response.data.items.rows;
			}
		} catch (e) {
			console.error(e);
			results.message = e.message;
		}
		return results;
	}

	async normalQuery(
		query: any,
		apolloNamespace: any,
		variables: any
	): Promise<QueryResults> {
		let results: QueryResults = {
			data: null,
			isSuccess: false,
			message: '',
		};

		let queryName = query.definitions[0].name.value;

		try {
			const response: any = await this.apollo.fetchData({
				query,
				apolloNamespace,
				variables,
			});

			let code = null;
			if (response.data[queryName].hasOwnProperty('code')) {
				code = response.data[queryName].code;
			}

			if (response.data[queryName].data) {
				results.isSuccess = true;
				results.data = response.data[queryName].data;
			}
			if (response.data[queryName].dataList) {
				results.isSuccess = true;
				results.data = response.data[queryName].dataList;
			} else if (response.data[queryName]) {
				results.isSuccess = true;
				if (code == 9000) {
				}
				results.data = response.data[queryName];
			}
		} catch (e) {
			results.message = e.message;
		}

		return results;
	}

	updateProgress(finishedQueue: number) {
		this.percentageCompleted =
			(finishedQueue / this.dataFetcher.dataFetcherQueue.length) * 100;
	}

	fetchBOQsForRequisitionsAndReturnRequisitionsWithBOQs = async (
		mainRequisition: any,
		filledBOQItems: any[] = [],
		submittedTmaFees?:any,
	): Promise<any> => {




		this.customFetcherFinishedFetching = false;

		this.filledBOQItems = filledBOQItems;
		this.submittedTmaFees = submittedTmaFees;

		let requisitions: any[] = mainRequisition.mergedProcurementRequisitions;

		let fullView = '';

		for (let i = 0; i < requisitions.length; i++) {

			fullView += NestedSpecificationHTMLTableBuilderHelper.buildLotHeader(
				requisitions[i].lotNumber,
				requisitions[i].lotDescription,
				requisitions.length > 1
			);

			let mergedProcurementRequisitionItems: any[] =
				requisitions[i].mergedProcurementRequisitionItems;

			// for (let j = 0; j < mergedProcurementRequisitionItems.length; j++) {
			// 	let mergedProcurementRequisitionItem =
			// 		mergedProcurementRequisitionItems[j];
			// 	this.fetchBOQ = true;
			// 	this.customFetcherMessage = `Fetching BOQs for Lot ${i + 1} of ${
			// 		requisitions.length
			// 	}`;
			//
			// 	this.fetchingConfiguration.fetchByParentValue = mainRequisition.uuid;
			// 	this.fetchingConfiguration.fetchByValue =
			// 		mergedProcurementRequisitionItem.uuid;
			//
			// 	while (this.fetchBOQ) {
			// 		await new Promise((resolve) => setTimeout(resolve, 500));
			// 	}
			//
			// 	fullView +=
			// 		this.fetchedBOQView + '<div style="page-break-after: always;"></div>';
			//
			// 	await new Promise((resolve) => setTimeout(resolve, 500));
			// }
			for (let j = 0; j < mergedProcurementRequisitionItems.length; j++) {
				//reset fetchConfiguration
				this.fetchingConfiguration= {
					...this.fetchingConfiguration,
					fetchByValue: '',
					fetchByParentValue: ''
				}
				let mergedProcurementRequisitionItem = mergedProcurementRequisitionItems[j];
				this.fetchBOQ = true;
				this.customFetcherMessage = `Fetching BOQs for Lot ${i + 1} of ${requisitions.length}`;
				// this.fetchingConfiguration.fetchByParentValue = mainRequisition.uuid;
				// this.fetchingConfiguration.fetchByValue = mergedProcurementRequisitionItem.uuid;

				this.fetchingConfiguration= {
					...this.fetchingConfiguration,
					fetchByParentValue: mainRequisition.uuid,
					fetchByValue: mergedProcurementRequisitionItem.uuid
				}
				// Wait for fetchBOQ to be set to false (indicating the process for this item is complete)
				while (this.fetchBOQ) {
					await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 500ms before checking again
				}

				// Ensure this only happens once the item fetching is done
				fullView += this.fetchedBOQView + '<div style="page-break-after: always;"></div>';

				// Optional: short delay before the next item, you can adjust this time
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}

		this.customFetcherMessage = null;
		this.customFetcherFinishedFetching = true;

		return fullView;
	};

	onBOQFinishedLoading = async (
		flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
		summary: BOQSummarySums
	) => {
		flatNestedSpecificationItemView = this.applyFormulas(
			flatNestedSpecificationItemView
		);

		flatNestedSpecificationItemView = this.setFilledBOQItems(
			flatNestedSpecificationItemView
		);

		this.fetchedGroupeBOQs =
			this.boqsService.convertFlatSpecificationsViewToGroupedBOQItems(
				flatNestedSpecificationItemView,
				null
			);
		this.fetchedBOQView = await this.boqsService.createBOQTableWithSummary(
			flatNestedSpecificationItemView,
			summary?.provisionSumPhysicalContingencyPercent || 0,
			summary?.provisionSumVariationOfPricesPercent || 0,
			summary?.vatRequired || true,
			'',
			this.submittedTmaFees,
		);

		// NestedSpecificationHTMLTableBuilderHelper.buildNestedSpecificationHTMLView(
		//   flatNestedSpecificationItemView
		// );

		setTimeout(() => {
			this.fetchBOQ = false;
		}, 2000);
	};

	setFilledBOQItems(
		flatNestedSpecificationItemView: FlatNestedSpecificationItemView[]
	) {
		if (this.filledBOQItems.length > 0) {
			for (let i = 0; i < flatNestedSpecificationItemView.length; i++) {
				let item = flatNestedSpecificationItemView[i];
				if (item.type == 'NestedSpecificationItem') {
					let filledBOQItem = this.filledBOQItems.find(
						(x) => x.subBoqItemUuid == item.editableSpecificationItem.uuid
					);
					if (filledBOQItem) {
						item.editableSpecificationItem.value = filledBOQItem.quantity;
						item.editableSpecificationItem.unitRate = filledBOQItem.unitRate;
						item.editableSpecificationItem.total = filledBOQItem.total;
					}
				}
			}
		}
		return flatNestedSpecificationItemView;
	}

	applyFormulas(
		flatNestedSpecificationItemView: FlatNestedSpecificationItemView[]
	): FlatNestedSpecificationItemView[] {
		for (let i = 0; i < flatNestedSpecificationItemView.length; i++) {
			if (
				flatNestedSpecificationItemView[i].type == 'NestedSpecificationItem'
			) {
				let item = flatNestedSpecificationItemView[i];

				item.editableSpecificationItem.value =
					this.getQuantity(item)?.toString() || '';

				item.editableSpecificationItem.unitRate = this.getUnitRate(
					item,
					flatNestedSpecificationItemView
				);

				let value = item.editableSpecificationItem.value as unknown as number;

				if (
					item.editableSpecificationItem.value &&
					item.editableSpecificationItem.unitRate
				) {
					let total = value * item.editableSpecificationItem.unitRate;
					if (total >= 0 || total <= 0) {
						item.editableSpecificationItem.total = total;
					}
				} else {
					item.editableSpecificationItem.total = null;
				}
			}
		}

		return flatNestedSpecificationItemView;
	}

	getUnitRate = (
		flatNestedSpecificationItemView: FlatNestedSpecificationItemView,
		allItems: FlatNestedSpecificationItemView[]
	): number => {
		let editableItem =
			flatNestedSpecificationItemView.editableSpecificationItem;
		let formula = editableItem?.formula;
		if (
			formula?.formulaName == FormulaNames.PROVISION_SUM_PERCENT &&
			NestUtils.isProvisionSumItem(editableItem)
		) {
			let sourceItem = this.getPercentItemSource(
				allItems,
				editableItem.uuid,
				editableItem.formula.inputFields[0].itemId,
				flatNestedSpecificationItemView.groupId
			);
			if (sourceItem?.formula) {
				editableItem.unitRate =
					this.nestedSpecificationsService.getUnitRateFromPSFormula(
						sourceItem.formula
					) * (sourceItem.value as unknown as number);
			}
		} else if (
			formula?.formulaName == FormulaNames.PROVISION_SUM_AMOUNT &&
			NestUtils.isProvisionSumItem(editableItem)
		) {
			return this.nestedSpecificationsService.getUnitRateFromPSFormula(formula);
		}

		return editableItem?.unitRate;
	};

	getPercentItemSource = (
		flatNestedSpecificationItemsView: FlatNestedSpecificationItemView[],
		itemUuid: string,
		sourceId: string,
		groupId: number
	): EditableSpecificationItem => {
		let results: EditableSpecificationItem = null;
		for (let i = 0; i < flatNestedSpecificationItemsView.length; i++) {
			let item = flatNestedSpecificationItemsView[i];
			if (
				item.type == 'NestedSpecificationItem' &&
				(item.uuid == sourceId ||
					item.editableSpecificationItem.sourceUuid == sourceId) &&
				item.editableSpecificationItem.value != null &&
				item.groupId == groupId &&
				item.uuid != itemUuid
			) {
				results = item.editableSpecificationItem;
				break;
			}
		}
		return results;
	};

	getQuantity = (
		flatNestedSpecificationItemView: FlatNestedSpecificationItemView
	): number => {
		let formula =
			flatNestedSpecificationItemView?.editableSpecificationItem?.formula;

		if (formula?.formulaName == FormulaNames.PROVISION_SUM_PERCENT) {
			return null;
		} else
			return (
				parseFloat(
					flatNestedSpecificationItemView?.editableSpecificationItem?.value
				) || null
			);
	};

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
