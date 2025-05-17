import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormControl } from '@angular/forms';
import {
	Observable,
	Subject,
	catchError,
	map,
	of,
	retry,
	startWith,
	switchMap,
} from 'rxjs';
import { emptyDataPage } from '../../../../services/graph-operation.service';
import {
	PaginatedDataInput,
	PaginatedDataService,
} from '../../../../services/paginated-data.service';
import { FieldRequestInput } from '../../paginated-data-table/field-request-input.model';
import { GraphqlService } from 'src/app/services/graphql.service';

export interface PaginatedDataState {
	items: any[];
	filter: string | null;
	error: string | null;
	status: 'loading' | 'success' | 'error';
	paginatedDataInput: PaginatedDataInput | null;
}
export interface SelectOption {
	name: string;
	optionValue: string;
	disabled?: boolean;
	danger?: boolean;
	[key: string]: any;
}

@Injectable()
export class PaginatedSelectService {
	private apiService = inject(PaginatedDataService);

	private state = signal<PaginatedDataState>({
		items: [],
		filter: null,
		error: null,
		status: 'loading',
		paginatedDataInput: null,
	});

	searchCtrl = new UntypedFormControl();

	// selectors
	items = computed(() => this.state().items);
	filter = computed(() => this.state().filter);
	error = computed(() => this.state().error);
	status = computed(() => this.state().status);
	paginatedDataInput = computed(() => this.state().paginatedDataInput);

	filtereditems = computed(() => {
		const filter = this.filter();

		return filter
			? this.items().filter((article) =>
					article.title.toLowerCase().includes(filter.toLowerCase()),
			  )
			: this.items();
	});

	// sources
	retry$ = new Subject<void>();
	error$ = new Subject<Error>();
	paginatedDataInput$ = new Subject<PaginatedDataInput>();

	itemsForPage$ = this.paginatedDataInput$.pipe(
		startWith(null),
		switchMap((paginatedDataInput) => {
			if (paginatedDataInput) {
				return this.apiService.getDataFromSource(paginatedDataInput).pipe(
					retry({
						delay: (err) => {
							this.error$.next(err);
							return this.retry$;
						},
					}),
				);
			}
			return of(emptyDataPage);
		}),
	);

	filter$ = this.searchCtrl.valueChanges;

	constructor(private graphqlService: GraphqlService) {
		// reducers
		this.itemsForPage$.pipe(takeUntilDestroyed()).subscribe((res) =>
			this.state.update((state) => ({
				...state,
				items: res.rows,
				status: 'success',
			})),
		);

		this.paginatedDataInput$
			.pipe(takeUntilDestroyed())
			.subscribe((paginatedDataInput) =>
				this.state.update((state) => ({
					...state,
					paginatedDataInput,
					status: 'loading',
					items: [],
				})),
			);

		this.filter$.pipe(takeUntilDestroyed()).subscribe((filter) =>
			this.state.update((state) => ({
				...state,
				filter: filter === '' ? null : filter,
			})),
		);

		this.retry$
			.pipe(takeUntilDestroyed())
			.subscribe(() =>
				this.state.update((state) => ({ ...state, status: 'loading' })),
			);

		this.error$.pipe(takeUntilDestroyed()).subscribe((error) =>
			this.state.update((state) => ({
				...state,
				status: 'error',
				error: error.message,
			})),
		);
	}

	fetchData(params: {
		query: string;
		fields: FieldRequestInput[];
		page: number;
		pageSize: number;
		apolloNamespace?: string;
		fetchPolicy?: string;
		additionalVariables?: Record<string, any>;
		mustHaveFilters?: any[];
	}): Observable<any> {
		const input = {
			page: params.page,
			pageSize: params.pageSize,
			fields: params.fields,
			...(params.mustHaveFilters && {
				mustHaveFilters: params.mustHaveFilters,
			}),
		};

		const variables = {
			input,
			...params.additionalVariables,
		};

		return this.graphqlService
			.fetchDataObservable(
				{
					query: params.query,
					apolloNamespace: params.apolloNamespace,
					variables,
				},
				params.fetchPolicy,
			)
			.pipe(
				map(({ data, errors }: any) => {
					if (errors) {
						throw new Error(errors[0]?.message || 'Failed to fetch data');
					}
					return data ? Object.values(data)[0] : null;
				}),
				catchError((error) => {
					console.error('Error fetching data:', error);
					return of({ data: [], totalPages: 0, currentPage: 0 });
				}),
			);
	}

	fetchSelectedOptions(params: {
		query: string;
		value: any;
		optionValue: string;
		apolloNamespace?: string;
	}): Observable<any[]> {
		const searchField: FieldRequestInput = {
			fieldName: params.optionValue,
			isSearchable: true,
			isSortable: false,
			operation: 'EQ',
			searchValue: params.value + '',
		};

		return this.fetchData({
			query: params.query,
			fields: [searchField],
			page: 1,
			pageSize: Array.isArray(params.value) ? params.value.length : 1,
			apolloNamespace: params.apolloNamespace,
		}).pipe(map((response) => response.data));
	}
}
