import { data } from 'autoprefixer';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import {
	Observable,
	catchError,
	map,
	of,
	lastValueFrom,
	takeUntil,
	Subject,
	Subscription,
	switchMap,
} from 'rxjs';
import {
	DataPage,
	DataRequestInput,
} from '../shared/components/paginated-data-table/data-page.model';
import { FieldRequestInput } from '../shared/components/paginated-data-table/field-request-input.model';
import { GraphqlService } from './graphql.service';
import { NotificationService } from './notification.service';
import { MustHaveFilter } from '../shared/components/paginated-data-table/must-have-filters.model';
import { TypedDocumentNode } from 'apollo-angular';

import { BehaviorSubject } from 'rxjs';
import { BlockingDialogData } from '../shared/components/blocking-loader/blocking-loader.component';
import {
	BlockingProgressDialogData,
	BlockingProgressLoaderComponent,
} from '../shared/components/blocking-progress-loader/blocking-progress-loader.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from './settings.service';
import { SignalsStoreService } from './signals-store.service';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class PaginatedDataService implements OnDestroy {
	private dataSources = new Map<
		string,
		BehaviorSubject<BlockingProgressDialogData>
	>();

	dialogData: BlockingProgressDialogData;
	signalStoreServices = inject(SignalsStoreService);
	allData: any[] = [];
	routerSubscription = Subscription.EMPTY;
	private cancelRequests$ = new Subject<void>();
	private activeRequests: Observable<any>[] = [];

	constructor(
		private graphService: GraphqlService,
		private notificationService: NotificationService,
		private dialog: MatDialog,
		private router: Router,
		private settingsService: SettingsService,
	) {
		this.routerSubscription = this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.cancelRequests$.next();
			}
		});
	}

	async getAllDataWithLoader(
		paginatedDataInput: PaginatedDataInput,
		loaderTitle: string,
		loadingMessage: string,
	) {
		this.allData = [];
		let loaderId = Math.random().toString(36).substring(7);
		this.showLoadingDialog(loaderId, loaderTitle, loadingMessage);
		this.getAllData(paginatedDataInput);
	}

	getAllDataObservable(
		paginatedDataInput: PaginatedDataInput,
		page = 1,
		recalledWithin = false,
	): Observable<any[] | null> {
		return this.getDataFromSource({
			...paginatedDataInput,
			page,
			fields: [
				...(paginatedDataInput.fields || []),
				{
					fieldName: 'id',
					isSortable: true,
					orderDirection: 'ASC',
				},
			],
		}).pipe(
			switchMap(async (res) => {
				if (!recalledWithin) {
					// If not recalled within, initialize allData with new data
					this.allData = res.rows;
				} else {
					// If recalled within, append only new data to allData
					this.allData = this.allData.concat(
						res.rows?.filter((row: any) => !this.allData?.includes(row)),
					);
				}

				if (res.currentPage < res.totalPages) {
					// If there are more pages, recursively fetch them
					return lastValueFrom(
						this.getAllDataObservable(
							paginatedDataInput,
							res.currentPage + 1,
							true,
						),
					);
				} else {
					// All data collected, return unique allData
					return this.allData;
				}
			}),
		);
	}

	async getAllDataOld(
		paginatedDataInput: PaginatedDataInput,
		page = 1,
		recalledWithin = false,
		checkCancelDataStatus = true,
	): Promise<any[]> {
		if (
			this.signalStoreServices.select('cancelGetData')() &&
			checkCancelDataStatus
		) {
			return [];
		}
		if (!recalledWithin) {
			this.signalStoreServices.set(
				paginatedDataInput.progressLoadingKey || 'paginatedDataProgress',
				0,
			);
			this.signalStoreServices.set(
				paginatedDataInput.totalRecordsKey || 'paginatedTotalRecords',
				0,
			);
		}
		this.signalStoreServices.set(
			paginatedDataInput.currentPageKey || 'currentPageKey',
			page,
		);

		const request = this.getDataFromSource({
			...paginatedDataInput,
			page,
			fields: [
				...(paginatedDataInput.fields || []),
				{
					fieldName: 'id',
					isSortable: true,
					orderDirection: 'ASC',
				},
			],
		});

		const res = await lastValueFrom(request);

		if (!recalledWithin) {
			this.allData = res?.rows || [];
		} else {
			this.allData = this.allData.concat(
				res.rows.filter((row: any) => !this.allData?.includes(row)),
			);
		}

		if (res) {
			let value = +((res.currentPage / res.totalPages) * 100).toFixed(1);
			this.signalStoreServices.set(
				paginatedDataInput.progressLoadingKey || 'paginatedDataProgress',
				value,
			);
			this.signalStoreServices.set(
				paginatedDataInput.totalRecordsKey || 'paginatedTotalRecords',
				res.totalRecords,
			);
			if (res.currentPage < res.totalPages) {
				await new Promise((resolve) => setTimeout(resolve, 500));
				return await this.getAllDataOld(
					paginatedDataInput,
					res.currentPage + 1,
					true,
					checkCancelDataStatus,
				);
			} else {
				return this.allData;
			}
		} else {
			return this.allData;
		}
	}

	async getTotalRecords(
		paginatedDataInput: PaginatedDataInput,
	): Promise<number> {
		const request = this.getDataFromSource({
			...paginatedDataInput,
			pageSize: 1,
			page: 1,
			fields: [
				...(paginatedDataInput.fields || []),
				{
					fieldName: 'id',
					isSortable: true,
					orderDirection: 'ASC',
				},
			],
		});
		const res = await lastValueFrom(request);
		return res?.totalRecords || 0;
	}

	getPageSize(totalRecords: number): number {
		const pageSize = Math.ceil(totalRecords / 5);
		// Logic to determine the pageSize based on totalRecords
		// For example, you could set a default pageSize or calculate based on totalRecords
		return pageSize > 100 ? 200 : pageSize; // Dividing totalRecords into 5 chunks
		// return pageSize; // Dividing totalRecords into 5 chunks
	}

	async fetchPage(
		paginatedDataInput: PaginatedDataInput,
		pageSize: number,
		page: number,
	): Promise<any[]> {
		const request = this.getDataFromSource({
			...paginatedDataInput,
			pageSize,
			page,
			fields: [
				...(paginatedDataInput.fields || []),
				{
					fieldName: 'id',
					isSortable: true,
					orderDirection: 'ASC',
				},
			],
		});
		const res = await lastValueFrom(request);
		return res.rows;
	}

	async fetchDataMultiQuery(
		paginatedDataInput: PaginatedDataInput,
		pageSize: number,
		totalRecords: number,
	): Promise<any[]> {
		const allData: any[] = [];
		const batchSize = 10;
		const totalPages = Math.ceil(totalRecords / pageSize); // Calculate total number of total pages
		const totalBatches = Math.ceil(totalPages / batchSize); // Calculate total number of batches
		this.signalStoreServices.set(
			paginatedDataInput.batches || 'paginatedBatches',
			totalBatches,
		);
		this.signalStoreServices.set(
			paginatedDataInput.pages || 'paginatedPages',
			totalPages,
		);

		// Define a recursive function to fetch each batch of data
		const fetchBatch = async (batchIndex: number) => {
			const batchStartPage = batchIndex * batchSize + 1; // Calculate the starting page number for the current batch
			const batchEndPage = Math.min((batchIndex + 1) * batchSize, totalPages); // Calculate the ending page number for the current batch
			const requests: any[] = [];
			// Iterate over pages in the current batch
			for (let page = batchStartPage; page < batchEndPage + 1; page++) {
				requests.push(this.fetchPage(paginatedDataInput, pageSize, page)); // Push fetchPage promise into requests array
			}
			// Wait for all page requests to resolve
			const responses = await Promise.all(requests);
			let value = +(((batchIndex + 1) / totalBatches) * 100).toFixed(1);
			this.signalStoreServices.set(
				paginatedDataInput.progressLoadingKey || 'paginatedDataProgress',
				value,
			);

			// Flatten and push data from responses into allData array
			allData.push(...responses.flatMap((data) => data));

			//
			this.signalStoreServices.set(
				paginatedDataInput.perBatches || 'paginatedPerBatches',
				batchIndex + 1,
			);

			// If there are more batches, recursively fetch the next batch
			if (batchIndex + 1 < totalBatches) {
				await fetchBatch(batchIndex + 1); // Recursive call for next batch
			}
		};
		await fetchBatch(0); // Start fetching data from the first batch
		return allData; // Return all collected data
	}

	async fetchAllPages(
		paginatedDataInput: PaginatedDataInput,
		page = 1,
	): Promise<any[]> {
		const request = this.getDataFromSource({
			...paginatedDataInput,
			page,
			fields: [
				...(paginatedDataInput.fields || []),
				{
					fieldName: 'id',
					isSortable: true,
					orderDirection: 'ASC',
				},
			],
		});
		const res = await lastValueFrom(request);
		if (res != null) {
			let value = +((res.currentPage / res.totalPages) * 100).toFixed(1);
			this.signalStoreServices.set(
				paginatedDataInput.progressLoadingKey || 'paginatedDataProgress',
				value,
			);
			this.signalStoreServices.set(
				paginatedDataInput.totalRecordsKey || 'paginatedTotalRecords',
				res.totalRecords,
			);
		}
		if (res.currentPage == res.totalPages || res.totalRecords == 0) {
			// We've fetched all data
			return res.rows;
		} else {
			// Fetch next page recursively
			const rows = await this.fetchAllPages(
				paginatedDataInput,
				res.currentPage + 1,
			);
			return res.rows.concat(rows);
		}
	}

	async getAllDataNew(
		paginatedDataInput: PaginatedDataInput,
	): Promise<any[] | null> {
		this.signalStoreServices.set(
			paginatedDataInput.progressLoadingKey || 'paginatedDataProgress',
			0,
		);
		this.signalStoreServices.set(
			paginatedDataInput.totalRecordsKey || 'paginatedTotalRecords',
			0,
		);

		this.signalStoreServices.set(
			paginatedDataInput.batches || 'paginatedBatches',
			0,
		);
		this.signalStoreServices.set(
			paginatedDataInput.pages || 'paginatedPages',
			0,
		);
		this.signalStoreServices.set(
			paginatedDataInput.perBatches || 'paginatedPerBatches',
			0,
		);

		if (paginatedDataInput.multiQuery) {
			let totalRecords = await this.getTotalRecords(paginatedDataInput);
			this.signalStoreServices.set(
				paginatedDataInput.totalRecordsKey || 'paginatedTotalRecords',
				totalRecords,
			);

			if (totalRecords == 0) {
				return [];
			}
			let pageSize = this.getPageSize(totalRecords);
			return this.fetchDataMultiQuery(
				paginatedDataInput,
				pageSize,
				totalRecords,
			);
		} else {
			// Normal single request behavior
			return this.fetchAllPages(paginatedDataInput);
		}
	}

	async getAllData(
		paginatedDataInput: PaginatedDataInput,
		page = 1,
		recalledWithin = false,
		withLoader = false,
		loaderId = '1',
	): Promise<any[] | null> {
		if (!recalledWithin) {
			this.signalStoreServices.set(
				paginatedDataInput.progressLoadingKey || 'paginatedDataProgress',
				0,
			);
			this.signalStoreServices.set(
				paginatedDataInput.totalRecordsKey || 'paginatedTotalRecords',
				0,
			);
		}
		this.signalStoreServices.set(
			paginatedDataInput.currentPageKey || 'currentPageKey',
			page,
		);
		const res: any = await lastValueFrom(
			this.getDataFromSource({ ...paginatedDataInput, page }),
		);
		if (res === null) {
			if (withLoader) {
				this.updateProgress(loaderId, page, res.totalPages, true);
			}
			return this.allData;
		} else {
			let value = +((res.currentPage / res.totalPages) * 100).toFixed(1);
			this.signalStoreServices.set(
				paginatedDataInput.progressLoadingKey || 'paginatedDataProgress',
				value,
			);
			this.signalStoreServices.set(
				paginatedDataInput.totalRecordsKey || 'paginatedTotalRecords',
				res.totalRecords,
			);

			if (paginatedDataInput.onProgress) {
				paginatedDataInput.onProgress({
					currentPage: res.currentPage,
					totalPages: res.totalPages,
					totalRecords: res.totalRecords,
					progress: value,
				});
			}
		}

		if (withLoader) {
			this.updateProgress(loaderId, page, res.totalPages);
		}

		this.allData = recalledWithin ? [...this.allData, ...res.rows] : res.rows;
		if (res.hasNext) {
			await this.getAllData(
				paginatedDataInput,
				res.currentPage + 1,
				true,
				withLoader,
				loaderId,
			);
		}
		// if (res.currentPage + 1 == res.totalPages) {
		return this.allData;
		// }
		// return null;
	}

	updateProgress(
		dialogId: string,
		currentPage: number,
		totalPages: number,
		failed = false,
	) {
		let percentageProgress = Math.round((currentPage / totalPages) * 100);
		this.updateProgressData(dialogId, {
			...this.dialogData,
			failed,
			progress: percentageProgress,
		});
	}

	getProgressData(dialogId: string) {
		if (!this.dataSources.has(dialogId)) {
			this.dataSources.set(dialogId, new BehaviorSubject<any>(null));
		}
		return this.dataSources.get(dialogId)?.asObservable();
	}

	updateProgressData(dialogId: string, data: BlockingProgressDialogData) {
		if (!this.dataSources.has(dialogId)) {
			this.dataSources.set(dialogId, new BehaviorSubject<any>(null));
		}
		this.dataSources.get(dialogId)?.next(data);
	}

	getObservableData(dialogId: string) {
		if (!this.dataSources.has(dialogId)) {
			this.dataSources.set(dialogId, new BehaviorSubject<any>(null));
		}
		return this.dataSources.get(dialogId)?.asObservable();
	}

	showLoadingDialog(loaderId: string, title: string, message: string) {
		this.dialogData = {
			dialogId: loaderId,
			allowCancel: false,
			title: title,
			message: message,
			progress: 0,
			failed: false,
		};
		this.dialog.open(BlockingProgressLoaderComponent, {
			disableClose: true,
			data: this.dialogData,
			width: '400px',
		});
		this.updateProgressData(loaderId, this.dialogData);
	}

	getDataFromSource(
		paginatedDataInput: PaginatedDataInput,
	): Observable<DataPage> {
		try {
			let request: Observable<any>;
			let input: DataRequestInput = {
				page: paginatedDataInput.page ?? 0,
				pageSize: paginatedDataInput.pageSize ?? 20,
				fields: paginatedDataInput.fields || [],
			};
			if (paginatedDataInput.mustHaveFilters) {
				input = {
					...input,
					mustHaveFilters: paginatedDataInput.mustHaveFilters,
				};
			}
			if (
				paginatedDataInput.customMainFilters &&
				Object.keys(paginatedDataInput.customMainFilters).length > 0
			) {
				let newParam = paginatedDataInput.customMainFilters;
				if (newParam['input'].fields) {
					// input.page = page ?? newParam.page;
					// input.pageSize = pageSize ?? newParam.pageSize;
					input.fields.push(...newParam['input'].fields);
				}

				if ((newParam.input.mustHaveFilters || []).length) {
					input.mustHaveFilters = newParam.input.mustHaveFilters;
				}

				const variables = paginatedDataInput.additionalVariables
					? { ...paginatedDataInput.additionalVariables, input }
					: { input };

				request = this.graphService
					.fetchDataObservable(
						{
							query: paginatedDataInput.query,
							apolloNamespace: paginatedDataInput.apolloNamespace || 'default',
							variables,
						},
						paginatedDataInput.fetchPolicy ?? 'network-only',
					)
					.pipe(
						map(({ data, errors }: any) => {
							if (errors) {
								console.error(errors);
								this.notificationService.errorMessage(errors[0]?.message);
							}
							return data ? Object.values(data)[0] : errors;
						}),
						catchError((error) => {
							console.error(error);
							this.notificationService.errorMessage(
								error.message || error[0].message,
							);
							return of([]);
						}),
					);
			} else {
				let variables = paginatedDataInput.additionalVariables
					? {
							input,
							...paginatedDataInput.additionalVariables,
					  }
					: { input };
				variables.input.page = paginatedDataInput.page ?? variables.input.page;
				variables.input.pageSize =
					paginatedDataInput.pageSize ?? variables.input.pageSize;
				request = this.graphService
					.fetchDataObservable(
						{
							query: paginatedDataInput.query,
							apolloNamespace: paginatedDataInput.apolloNamespace || 'default',
							variables,
						},
						paginatedDataInput.fetchPolicy ?? 'network-only',
					)
					.pipe(
						map(({ data, errors }: any) => {
							if (errors) {
								console.error(errors);
								this.notificationService.errorMessage(errors[0]?.message);
							}
							return data ? Object.values(data)[0] : errors;
						}),
						catchError((error) => {
							console.error(error);
							this.notificationService.errorMessage(
								error.message || error[0].message,
							);
							return of([]);
						}),
					);
			}

			this.activeRequests.push(request);
			// Automatically cancel request if cancelRequests$ emits
			return request.pipe(takeUntil(this.cancelRequests$));
		} catch (error: any) {
			console.error(error);
			this.notificationService.errorMessage(error.message || error[0].message);
			return this.activeRequests[this.activeRequests.length - 1];
		}
		// },0);
	}

	cancelAllRequests() {
		this.cancelRequests$.next();
	}

	ngOnDestroy() {
		// Unsubscribe from router events subscription when the service is destroyed
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}
}

export interface PaginatedDataProgressData {
	currentPage: number;
	totalPages: number;
	totalRecords: number;
	progress: number;
}

export interface PaginatedDataInput {
	mustHaveFilters?: MustHaveFilter[];
	customMainFilters?: any;
	additionalVariables?: any;
	query: TypedDocumentNode | any;
	apolloNamespace: ApolloNamespace;
	fetchPolicy?: 'cache-first' | 'network-only';
	page?: number;
	multiQuery?: boolean;
	pageSize?: number;
	fields?: FieldRequestInput[];
	progressLoadingKey?: string;
	totalRecordsKey?: string;
	currentPageKey?: string;
	batches?: string;
	pages?: string;
	perBatches?: string;
	onProgress?: (progressData: PaginatedDataProgressData) => void;
	onErrors?: (errors: {
		progressData: PaginatedDataProgressData;
		errors: any[];
	}) => void;
}
