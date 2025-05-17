import {
	Component,
	OnInit,
	Input,
	OnDestroy,
	Output,
	EventEmitter,
	AfterViewInit,
	OnChanges,
	forwardRef,
	ViewChild,
	inject,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
	UntypedFormControl,
	UntypedFormGroup,
	NG_VALUE_ACCESSOR,
	ControlValueAccessor,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import {
	Subject,
	merge,
	of,
	lastValueFrom,
	Observable,
	firstValueFrom,
} from 'rxjs';
import {
	debounceTime,
	tap,
	filter,
	map,
	takeUntil,
	mapTo,
	startWith,
	distinctUntilChanged,
	mergeMap,
	catchError,
	first,
	take,
} from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { GraphqlService } from '../../../../services/graphql.service';
import { SettingsService } from '../../../../services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { PaginatedSelectTableComponent } from './paginated-select-table/paginated-select-table.component';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { NotificationService } from '../../../../services/notification.service';
import { FieldRequestInput } from '../../paginated-data-table/field-request-input.model';
import { HelpTextService } from '../../../../services/help-text.service';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { DisableDuplicatePipe } from '../pipes/disable-duplicate.pipe';
import { DynamicPipe } from '../../../pipes/dynamic.pipe';
import { SearchPipe } from '../../../pipes/search.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SelectSearchComponent } from '../select/select-search/select-search.component';
import { MatOptionModule } from '@angular/material/core';
import { SelectInfiniteScrollDirective } from '../select/select-infinite-scroll.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { PaginatedDataService } from '../../../../services/paginated-data.service';
import { PaginatedSelectService } from './paginated-select.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-paginated-select',
	// changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './paginated-select.component.html',
	styleUrls: ['./paginated-select.component.scss'],
	providers: [
		PaginatedSelectService,
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PaginatedSelectComponent),
			multi: true,
		},
	],
	animations: [fadeIn],
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		SelectInfiniteScrollDirective,
		MatOptionModule,
		SelectSearchComponent,
		NgClass,
		MatButtonModule,
		MatIconModule,
		SearchPipe,
		DynamicPipe,
		DisableDuplicatePipe,
		TranslatePipe,
	],
})
export class PaginatedSelectComponent
	implements OnInit, OnDestroy, AfterViewInit, OnChanges, ControlValueAccessor
{
	/** Indicates if the help page should be shown */
	showHelp: boolean = false;

	/** Label for displaying the number of selected items */
	selectedCountLabel: string = '';

	/** Input for field configuration */
	@Input() field: FieldConfig;

	/** Input indicating if the component is in a loading state */
	@Input() loading: boolean = false;

	/** Input for the form group associated with this component */
	@Input() group: UntypedFormGroup = new UntypedFormGroup({});

	/** Input to determine if the component is disabled */
	@Input() disabled: boolean = false;

	/** Output event emitter for field value changes */
	@Output() fieldValue: EventEmitter<any> = new EventEmitter();

	/** Output event emitter for all field changes */
	@Output() allField: EventEmitter<any> = new EventEmitter();

	/** Output event emitter for data fetched events */
	@Output() onDataFetched: EventEmitter<any> = new EventEmitter();

	/** Indicates if the field is required */
	required: boolean = false;

	/** Filter value used in searches */
	filterVal: any;

	/** Label displayed when no entries are found */
	noEntriesFoundLabel: string = 'No entry matches';

	/** Reference to the MatSelect component for paginated selection */
	@ViewChild('paginatedSelector') paginatedSelector: MatSelect;

	/** Array of options for the selection */
	options: any[] = [];

	/** Current page number for pagination */
	page: number = 1;

	/** Indicates if a search operation is in progress */
	public searching: boolean = false;

	/** Subject for incrementing page size */
	private incrementPageSize$: Subject<void> = new Subject<void>();

	/** Subject for resetting page size */
	private resetPageSize$: Subject<void> = new Subject<void>();

	/** Subject for handling component destruction */
	private destroy$: Subject<void> = new Subject<void>();

	/** Total number of pages available for pagination */
	totalPages: number = 0;

	/** Indicates if data is currently being loaded */
	loadingData: boolean = false;

	/** Total number of options to check for pagination */
	totalOptionsToCheck: number = 0;

	/** Number of options previously available before the latest data load */
	previousOptionCount: number = 0;

	/** Selected value(s) */
	selected: any;

	/** Indicates if the data fetching is complete */
	complete: boolean = false;

	/** Indicates if the table view should be shown */
	showTable: boolean = false;

	/** Array of all available options */
	allOptions: any[] = [];

	/** Array of options filtered by search */
	searchOptions: any[] = [];

	/** Indicates if the user is scrolling */
	scrolling: boolean = false;

	/** Key of the field used for various operations */
	fieldKey: string;

	/** Callback function for when the field value changes */
	onChange: any = (): void => {};

	/** Callback function for when the field is touched */
	onTouched: any = (): void => {};

	/** Initial loading state for the component */
	initialLoading: { [key: string]: boolean } = {};

	isIntialValue = true;
	isStandAlone = false;

	/** Service for handling paginated selection logic */
	paginatedSelectService = inject(PaginatedSelectService);

	/**
	 * Constructor for injecting necessary services
	 * @param helpTextService Service for handling help text
	 * @param dialog Angular Material dialog service
	 * @param graphService Service for GraphQL operations
	 * @param settings Service for application settings
	 * @param notificationService Service for showing notifications
	 */
	constructor(
		public helpTextService: HelpTextService,
		private dialog: MatDialog,
		private graphService: GraphqlService,
		private settings: SettingsService,
		private notificationService: NotificationService
	) {}

	/**
	 * Opens the help page for the field and manages the help page visibility.
	 *
	 * This method sets `showHelp` to `true`, invokes the `helpTextService` to open the help page with the specified field details,
	 * and then sets `showHelp` to `false` after the help page has been opened.
	 *
	 * @returns A promise that resolves when the help page has been successfully opened.
	 */
	async openHelpPage(): Promise<void> {
		try {
			// Set the help page visibility to true before opening the help page
			this.showHelp = true;

			// Open the help page using the helpTextService with the field details
			await this.helpTextService.openHelpPage({
				key: this.field.key,
				label: this.field.label,
				hint: this.field.hint,
			});
		} catch (error) {
			// Log any errors that occur while opening the help page
			console.error('Error opening help page:', error);
		} finally {
			// Ensure that help page visibility is set to false after the operation
			this.showHelp = false;
		}
	}

	ngOnInit(): void {
		try {
			// Set default values or configurations for the component
			this.setDefault();

			// Check if all required fields for the field object are present
			this.checkRequiredFields(this.field, 'field');

			// If the field has a key, proceed with initialization
			if (this.field?.key) {
				// Mark the field as initially loading
				this.initialLoading[this.field.key] = true;
				// If the form group has no controls, add a new control for the field
				if (
					Object.keys(this.group?.controls || {}).length === 0 ||
					this.checkIfControlExists(this.field.key)
				) {
					this.isStandAlone = true;
					this.group.addControl(this.field.key, new UntypedFormControl('', []));
				}

				// Determine if the field is required by checking form control errors
				this.required =
					(this.group?.get(this.field.key)?.errors !== null &&
						this.group?.get(this.field.key)?.errors?.['required']) ||
					false;

				// Disable or enable the form control based on the field's disabled state
				if (this.field.disabled) {
					this.group?.get(this.field.key)?.disable();
				} else {
					this.group?.get(this.field.key)?.enable();
				}

				// Set the filter value based on the form control or selected value
				this.filterVal =
					this.group?.get(this.field.filterValueKey || '')?.value ||
					this.selected;
			}
		} catch (error) {
			// Log any errors encountered during initialization
			console.error(error);
		}
	}

	checkIfControlExists(controlName: string): boolean {
		return !!this.group?.get(controlName); // Returns true if the control exists, false otherwise
	}

	ngOnChanges(): void {
		// Set the default values or configurations for the component
		this.setDefault();

		// Check if the field has a key before proceeding
		if (this.field.key) {
			if (
				Object.keys(this.group?.controls || {}).length === 0 ||
				this.checkIfControlExists(this.field.key)
			) {
				this.isStandAlone = true;
				this.group.addControl(this.field.key, new UntypedFormControl('', []));
			}

			// Check if all required fields for the field object are present
			this.checkRequiredFields(this.field, 'field');

			// Initialize or reset the options arrays based on the preventConcat setting
			this.allOptions = this.field?.preventConcat ? [] : this.allOptions;
			this.options = this.field?.preventConcat ? [] : this.options;

			// If the fetch policy is set to 'cache-first', reset the page size
			if (this.field.fetchPolicy === 'cache-first') {
				this.resetPageSize$.next();
			}

			// Disable or enable the form control based on the disabled state
			if (this.disabled) {
				this.group.controls[this.field.key]?.disable();
			} else {
				this.group.controls[this.field.key]?.enable();
			}
		}
	}

	ngAfterViewInit(): void {
		// Subscribe to search control value changes
		this.paginatedSelectService.searchCtrl.valueChanges
			.pipe(
				// Filter out empty or falsy search values
				filter((search) => !!search),

				// Set the searching flag to true when a search starts
				tap(() => (this.searching = true)),

				// Automatically unsubscribe when the component is destroyed
				takeUntil(this.destroy$),

				// Wait for 300ms after the last keystroke before sending a request
				debounceTime(300),

				// Only proceed if the search value has changed
				distinctUntilChanged(),

				// Merge the search observable with the server request observable
				mergeMap(() => this.getDataFromServer()),

				// Set the searching flag to false when the search completes
				tap(() => (this.searching = false))
			)
			.subscribe((res) => {
				// Generate options based on the response from the server
				this.generateOptions(res);
			});

		// Check if the field has a key and an initial value, then fetch initial data
		if (this.field.key && this.isIntialValue) {
			// Assuming 'this.group' is your FormGroup and 'this.field.key' is the key of the form control
			let initialValue = this.group.get(this.field.key)?.value;

			// Subscribe to value changes and fetch the initial data once
			firstValueFrom(
				this.group.get(this.field.key)?.valueChanges.pipe(
					filter((value) => value !== null && value !== ''), // Filter out null or empty values
					take(1) // Take the first emitted value and then complete the subscription
				)
			).then((value) => {
				initialValue = value;
				this.getInitialData(initialValue);
				this.isIntialValue = false; // Ensure this block only runs once
			});

			// Handle the case where the initial value is already present
			if (initialValue && this.isIntialValue) {
				// this.getInitialData(initialValue);
				this.isIntialValue = false; // Ensure this block only runs once
			}
		}

		// Setup timeout to handle page size increment/reset events
		setTimeout(() => {
			merge(
				// Emit true when page size is incremented
				this.incrementPageSize$.pipe(map(() => true)),

				// Emit false when page size is reset
				this.resetPageSize$.pipe(map(() => false))
			)
				.pipe(
					// Start with a non-scrolling state (false)
					startWith(false),

					// Handle scrolling and loading flags
					tap((scrolling) => {
						if (scrolling) {
							this.searching = true;
						} else {
							this.loadingData = true;
						}
					}),

					// Merge the page size change observable with the server request observable
					mergeMap((doIncrement) => this.getDataFromServer(doIncrement)),

					// Reset loading and searching flags when the data is loaded
					tap(() => {
						this.loadingData = false;
						this.searching = false;
					}),

					// Automatically unsubscribe when the component is destroyed
					takeUntil(this.destroy$)
				)
				.subscribe((res: any) => {
					// Generate options based on the response from the server
					this.generateOptions(res);
				});
		}, 0);
	}

	getInitialData(initVal?: any, setValue = true): void {
		// Retrieve the control associated with the current field key
		const control = this.group?.controls[this.field?.key as string];

		// Determine the initial value to be processed (can be passed in, from the form control, or the selected value)
		const initValue = initVal || control?.value || this.selected;
		// Proceed if there's an initial value
		if (initValue) {
			// Handle case where the initial value is an array (multiple selections)
			if (this.settings.isArray(initValue)) {
				const initialElements: any[] = [];

				// Loop through each value in the array
				initValue.forEach((value) => {
					// Check if the current field's option value is not in the noSearchFields list
					if (
						(this.field.noSearchFields || []).indexOf(
							this.field?.optionValue
						) === -1
					) {
						// Add the value to the initialElements array as a string
						initialElements.push(value + '');
						// Proceed if the field has a paginated search key
						if (
							this.field?.paginatedSearchFieldKey ||
							this.field?.optionValue
						) {
							// Fetch additional data from the server based on the current value
							this.fetchInitialDataFromServer([
								{
									fieldName:
										this.field?.paginatedSearchFieldKey ||
										this.field?.optionValue,
									isSearchable: true,
									isSortable: false,
									operation: 'EQ',
									searchValue: value + '',
								},
							]);
						}
					}
				});
				control?.setValue(initialElements);
				if (setValue) {
					// Set the processed array of values to the form control
					this.settingValue(initialElements);
				}
			} else {
				// Handle case where the initial value is a single item (not an array)
				if (
					(this.field.noSearchFields || []).indexOf(this.field?.optionValue) ===
					-1
				) {
					control?.setValue(initValue + '');

					if (setValue) {
						// Set the single value to the form control
						this.settingValue(initValue + '');
					}
					// Proceed if the field has a paginated search key
					if (this.field?.paginatedSearchFieldKey || this.field?.optionValue) {
						// Fetch additional data from the server for the single value
						this.fetchInitialDataFromServer([
							{
								fieldName:
									this.field?.paginatedSearchFieldKey ||
									this.field?.optionValue,
								isSearchable: true,
								isSortable: false,
								operation: 'EQ',
								searchValue: initValue + '',
							},
						]);
					}
				}
			}
		}
	}

	/**
	 * Retrieves a nested property value from an object using a path array.
	 *
	 * @param arr - An array representing the path to the nested property.
	 * @param item - The object from which to retrieve the property value.
	 * @returns The value of the nested property, or undefined if the path is not found.
	 */
	toObject(arr: string[], item: any): any {
		// Handle the case for a single-level property
		if (arr.length === 1) {
			return item[arr[0]];
		}

		// Handle the case for a two-level nested property
		if (arr.length === 2) {
			return item[arr[0]] ? item[arr[0]][arr[1]] : undefined;
		}

		// Handle the case for a three-level nested property
		if (arr.length === 3) {
			return item[arr[0]]
				? item[arr[0]][arr[1]]
					? item[arr[0]][arr[1]][arr[2]]
					: undefined
				: undefined;
		}

		// Return undefined for unsupported path lengths
		return undefined;
	}

	/**
	 * Get initial options from the server using specified fields and generate options
	 * @param customFields - Custom fields to use for the server request
	 */
	private fetchInitialDataFromServer(customFields: any[]): void {
		// Set the loading state to true before starting the data fetch
		this.loadingData = true;

		// Fetch data from the server with the provided custom fields
		this.getDataFromServer(false, customFields)
			.pipe(
				// Automatically unsubscribe when the component is destroyed
				takeUntil(this.destroy$),

				// Set the loading state to false once the data fetch is complete
				tap(() => (this.loadingData = false))
			)
			.subscribe((res: any) => {
				// Generate options based on the response from the server
				this.generateOptions(res);
			});
	}

	/**
	 * Modifies the server response to match the options format required by mat-select.
	 *
	 * @param res - The response object from the server containing rows of data.
	 * @returns An array of modified data items formatted for mat-select options.
	 */
	getData(res: any): any[] {
		// Map the response rows using the field's mapFunction if provided
		const data = this.field.mapFunction
			? (res?.rows || []).map(this.field.mapFunction)
			: res?.rows || [];

		// Process and format the data
		return (data || [])
			.filter((item) => !!item) // Remove null or undefined items
			.map((item) => {
				// Construct the 'name' field based on 'optionName' property
				const name =
					this.field?.optionName
						?.split(',')
						.map(
							(name) =>
								name.includes('.')
									? this.toObject(name.split('.'), item) // Resolve nested properties
									: !!item
									? item[name] // Get the property value
									: '' // Default to empty string if property is not found
						)
						.filter((i) => !!i) // Remove empty strings
						.join(' - ') || item['name']; // Use 'name' if 'optionName' is not defined

				// Return the formatted option item
				return {
					...item,
					name, // Constructed name string
					optionValue: item[this.field?.optionValue || ''] + '', // Ensure optionValue is a string
				};
			});
	}

	/**
	 * Generates options for the UI component based on the server response.
	 * Handles options while scrolling and searching.
	 *
	 * @param res - The response object from the server containing options data.
	 */
	generateOptions(res: any): void {
		if (res) {
			// Get the key for the option value
			const optionValue = this.field?.optionValue || '';

			// Update the total pages count
			this.totalPages = res.totalPages + 1;

			// Get the modified options from the response
			const modifiedOptions = this.getData(res);

			// Extract existing option values to avoid duplicates
			const existingOptionValues = this.allOptions.map(
				(opt) => opt[optionValue]
			);

			// Concatenate new options that are not already in `allOptions`
			this.allOptions = this.allOptions.concat(
				modifiedOptions.filter(
					(item: any) => !existingOptionValues.includes(item[optionValue])
				)
			);

			// Handle search-related options
			if (this.paginatedSelectService.searchCtrl?.value) {
				if (this.scrolling) {
					// Extract existing search option values to avoid duplicates
					const existingSearchOptionValues = this.searchOptions.map(
						(opt) => opt[optionValue]
					);

					// Concatenate new search options that are not already in `searchOptions`
					this.searchOptions = this.searchOptions.concat(
						modifiedOptions.filter(
							(item) => !existingSearchOptionValues.includes(item[optionValue])
						)
					);
					this.options = this.searchOptions;
				} else {
					// Set search options if not scrolling
					this.searchOptions = modifiedOptions;
					this.options = modifiedOptions;
				}
			} else {
				// Set all options if no search value is provided
				this.options = this.allOptions;
			}

			// Sort the options based on `optionName` in ascending order
			this.options = this.settings.sortArray(this.options, 'optionName', 'ASC');

			// Update the count of options to check
			this.totalOptionsToCheck =
				res.currentPage * res.numberOfRecords +
				(res.currentPage - 1) * res.numberOfRecords;

			// Update the options with their index
			this.options = this.options.map((opt, i) => ({
				...opt,
				optionIndex:
					res.currentPage * res.numberOfRecords - res.numberOfRecords + i + 1,
			}));

			// Calculate the difference in the number of options
			const diff = this.totalOptionsToCheck - this.previousOptionCount;

			// Adjust the scroll position if there is a difference
			if (diff > 0) {
				const scrollAmount =
					this.paginatedSelector?.panel?.nativeElement?.scrollHeight;
				if (scrollAmount) {
					this.paginatedSelector.panel.nativeElement.scrollTop +=
						scrollAmount * diff;
				}
			}

			// Emit an event after fetching data
			if (this.onDataFetched) {
				this.onDataFetched.emit(this.options);
			}
		}
	}

	/**
	 * Fetches data from the server with specified filters.
	 * @param doIncrement - Whether to increment the page number for pagination.
	 * @param customFields - Optional custom fields to be used in the query.
	 * @returns Observable containing the fetched data or an empty array in case of an error.
	 */
	getDataFromServer(doIncrement: boolean = false, customFields = null) {
		// Manage pagination: increment page number or reset to the first page
		this.scrolling = doIncrement;
		this.page = doIncrement ? this.page + 1 : 1;

		// Store the current number of options to keep track of changes
		this.previousOptionCount = this.totalOptionsToCheck;

		// Proceed only if it's the first page or if there are more pages to load
		if (this.page === 1 || this.totalPages > this.page) {
			// Determine which fields to use for the query, either custom or default
			const fields = customFields === null ? this.queryFields() : customFields;

			// Construct the input object for the server query
			let input: { [key: string]: any } = {
				page: this.page,
				pageSize: this.field?.pageSize,
				fields,
			};

			// Add mandatory filters if specified in the field
			if (this.field?.mustHaveFilters) {
				input = { ...input, mustHaveFilters: this.field?.mustHaveFilters };
			}

			// If there are additional variables, include them in the query
			if (
				this.field.additionalVariables &&
				Object.keys(this.field.additionalVariables).length > 0
			) {
				const newParam = this.field.additionalVariables;

				// Fetch data from the server using the GraphQL service
				return this.graphService
					.fetchDataObservable(
						{
							query: this.field?.query,
							apolloNamespace: this.field?.apolloNamespace,
							variables: { input, ...newParam },
						},
						this.field?.fetchPolicy
					)
					.pipe(
						map(({ data, errors }: any) => {
							if (data) {
								// Check if the current page is the last one
								const obj: any = Object.values(data)[0];
								this.complete = obj?.currentPage === obj?.totalPages;
							}

							if (errors) {
								console.error(errors);
								// Optionally display an error message using the notification service
								// this.notificationService.errorMessage(errors[0]?.message);
							}

							return data ? Object.values(data)[0] : errors;
						}),
						catchError((error) => {
							console.error(error);
							this.notificationService.errorMessage(
								error.message ||
									error[0].message ||
									'Failed to get: ' + this.field.label
							);
							return of([]);
						})
					);
			} else {
				// Fetch data from the server without additional variables
				return this.graphService
					.fetchDataObservable(
						{
							query: this.field?.query,
							apolloNamespace: this.field?.apolloNamespace,
							variables: { input },
						},
						this.field?.fetchPolicy
					)
					.pipe(
						map(({ data, errors }: any) => {
							if (data) {
								// Check if the current page is the last one
								const obj: any = Object.values(data)[0];
								this.complete = obj?.currentPage === obj?.totalPages;
							}

							if (errors) {
								console.error(errors);
								this.notificationService.errorMessage(
									errors[0]?.message || 'Failed to get: ' + this.field.label
								);
							}

							return data ? Object.values(data)[0] : errors;
						}),
						catchError((error) => {
							this.loadingData = false;
							this.searching = false;
							console.error(error);
							this.notificationService.errorMessage(
								error.message ||
									error[0].message ||
									'Failed to get: ' + this.field.label
							);
							return of([]);
						})
					);
			}
		}

		// Return an empty observable if no more pages are available to load
		return of([]);
	}

	/**
	 * Load the next page of data.
	 * @param fetchData - Whether to fetch new data or just trigger the pagination.
	 */
	getNextPage(fetchData: boolean): void {
		if (!this.searching && fetchData) {
			// Debounce to avoid rapid consecutive calls
			debounceTime(500);

			// Notify to increment page size, triggering data fetch for the next page
			this.incrementPageSize$.next();
		}
	}

	/**
	 * Handle changes in the field value and emit updated information.
	 * @param event - The event containing the new value.
	 */
	fieldChange(event): void {
		let object: any;
		// Update the field value
		this.settingValue(event.value);

		// Determine the corresponding options based on whether multiple values are allowed
		if (this.field.multiple) {
			object =
				this.allOptions?.filter((element) =>
					event.value.includes(element.optionValue)
				) || null;
		} else {
			object =
				this.allOptions?.find(
					(element) => element.optionValue + '' === event.value + ''
				) || null;
		}

		// Emit the updated field value and corresponding object
		this.fieldValue.emit({ value: event.value, field: this.field, object });
	}

	/**
	 * Toggle the selection of all options.
	 * @param selectAllValue - Whether to select all options or clear selection.
	 */
	toggleSelectAll(selectAllValue: boolean): void {
		const key = this.field?.key as string;

		if (selectAllValue) {
			// Select all options and update the form control
			const values = this.options.map((option) => option.optionValue);
			if (this.group) {
				this.group?.controls[key]?.setValue(values);
			}
			this.selected = values;
			this.fieldChange({ value: values });
		} else {
			// Clear all selections and update the form control
			this.selected = [];
			if (this.group) {
				this.group?.controls[key]?.patchValue(null);
			}
			this.fieldChange({ value: [] });
		}
	}

	/**
	 * Generates an array of field request inputs based on the current search configuration.
	 * @returns An array of `FieldRequestInput` objects, each representing a field and its search criteria.
	 */
	queryFields(): FieldRequestInput[] {
		const fields: FieldRequestInput[] = [];

		// Iterate over each field defined in `searchFields`
		this.field?.searchFields?.forEach((field) => {
			// Create a base request object for the field
			let value: FieldRequestInput = {
				fieldName: field,
				isSearchable: true,
				isSortable: false,
				operation: 'LK', // 'LK' stands for "like", typically used for partial matches
				searchValue: this.paginatedSelectService.searchCtrl?.value || '', // Get the current search value
			};

			// If the field is the one to be sorted by, update the request object to include sorting information
			if (this.field?.sortField === field) {
				value = {
					...value,
					isSortable: true,
					orderDirection: 'ASC', // Default sort order is ascending
				};
			} else {
				// Remove sorting properties if the field is not the one to be sorted by
				if ('isSortable' in value) {
					delete value.isSortable;
				}
				if ('orderDirection' in value) {
					delete value.orderDirection;
				}
			}

			// Add the configured field request object to the fields array
			fields.push(value);
		});

		// Return the array of field request inputs
		return fields;
	}

	/**
	 * Handles the change event when the dropdown opens or closes.
	 * @param opened - A boolean indicating whether the dropdown is opened or closed.
	 */
	openedChange(opened: boolean): void {
		if (opened) {
			// Reset pagination and fetch new data when the dropdown opens
			this.resetPageSize$.next();
		} else {
			// Restore all options when the dropdown closes
			this.options = this.allOptions;
		}
	}

	/**
	 * Set default values for the `field` property if not already defined.
	 */
	setDefault(): void {
		/** Define default values for the `field` property */
		this.field = {
			...this.field,

			// Ensures `label` is set, defaulting to an empty string if not provided
			label: this.field?.label || '',
			selectorOptionLabel: this.field?.selectorOptionLabel || '--- Select ---',

			// Determines whether to hide the required marker, defaulting to true if not specified
			hideRequiredMarker: this.field?.hideRequiredMarker ?? true,

			// Provides a default key if not defined
			key: this.field?.key || 'id',

			// Sets a placeholder text, defaulting to the label if no placeholder is provided
			placeholder: this.field?.placeholder || this.field?.label || '',

			// Allows multiple selections if specified, defaults to false
			multiple: this.field?.multiple ?? false,

			// Sets the filter key for the field, defaulting to an empty string if not provided
			filterKey: this.field?.filterKey || '',

			// Configures dynamic pipes with default values if not provided
			dynamicPipes: this.field?.dynamicPipes || [
				{ pipe: 'defaultCase' },
				{
					pipe: 'replace',
					firstArgs: '_',
					secondArgs: ' ',
				},
			],

			// Provides a hint text if specified, defaulting to an empty string
			hint: this.field?.hint || '',

			// Initializes validations, defaulting to an empty array if not provided
			validations: this.field?.validations || [],

			// Determines whether to prevent concatenation, defaulting to false
			preventConcat: this.field?.preventConcat ?? false,

			// Sets the page size for pagination, defaulting to 10
			pageSize: this.field?.pageSize ?? 10,

			// Assigns a default value, setting it to null if the value is null or undefined
			value: this.settings.isNullOrUndefined(this.field?.value)
				? null
				: this.field?.value,

			// Sets required filters, defaulting to an empty array if not specified
			mustHaveFilters: this.field?.mustHaveFilters || [],

			// Defines the option value field, defaulting to 'id' if not provided
			optionValue: this.field?.optionValue || 'id',

			// Provides the option name field, defaulting to an empty string if not provided
			optionName: this.field?.optionName || '',

			// Sets the fetch policy for data retrieval, defaulting to 'cache-first'
			fetchPolicy: this.field?.fetchPolicy || 'cache-first',

			// Configures search fields, defaulting to an empty array if not specified
			searchFields: this.field?.searchFields || [],
		};
	}
	/**
	 * Updates the selected value and triggers related methods.
	 * @param value - The new value to set as selected.
	 */
	settingValue(value: any): void {
		if (this.isIntialValue && value && this.isStandAlone) {
			this.getInitialData(value, false);
			this.isIntialValue = false;
		}
		this.selected = value; // Update the selected value
		this.setTotalSelected(); // Recalculate the total selected items
		this.onChange(this.selected); // Notify changes to parent component or form control
	}

	/**
	 * Writes a new value to the form control.
	 * @param value - The value to write to the control.
	 */
	writeValue(value: any): void {
		this.selected = value; // Update the selected value
		// Uncomment if additional form data checks are needed
		// this.checkFormData();
		this.fieldChange({ value }); // Trigger field change event
	}

	/**
	 * Registers a callback function to be called when the value changes.
	 * @param onChange - The callback function to register.
	 */
	registerOnChange(onChange: any): void {
		this.onChange = onChange; // Store the callback function for value changes
	}

	/**
	 * Registers a callback function to be called when the control is touched.
	 * @param onTouched - The callback function to register.
	 */
	registerOnTouched(onTouched: any): void {
		this.onTouched = onTouched; // Store the callback function for control touch events
	}

	/**
	 * Sets the disabled state of the form control.
	 * @param isDisabled - A boolean indicating whether the control should be disabled.
	 */
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled; // Update the disabled state
		const key = this.field.key as string; // Get the key of the field

		if (isDisabled) {
			this.group.controls[key]?.disable(); // Disable the form control
		} else {
			this.group.controls[key]?.enable(); // Enable the form control
		}
	}

	/**
	 * Checks if a required field is provided.
	 * @param input - The value of the attribute to check.
	 * @param attr - The name of the attribute being checked.
	 */
	checkRequiredFields(input: any, attr: string): void {
		if (input === null || input === undefined) {
			console.error(`Attribute '${attr}' is required`); // Log an error if the attribute is missing
		}
	}

	/**
	 * Cleanup logic to be executed when the component is destroyed.
	 */
	ngOnDestroy(): void {
		this.destroy$.next(); // Signal that the component is being destroyed to clean up subscriptions
	}

	/**
	 * Opens a dialog to show a table with paginated data.
	 * This function is only executed if the component is not disabled.
	 */
	showTableFn(): void {
		if (!this.disabled) {
			this.showTable = true; // Show the table

			// Open a dialog with the PaginatedSelectTableComponent
			const dialogRef = this.dialog.open(PaginatedSelectTableComponent, {
				width: '80%',
				data: {
					title: this.field.label,
					query: this.field.query,
					fields: this.queryFields(),
					multiple: this.field.multiple,
					isPaginated: true,
					tableColumns: this.field.tableColumns,
					mapFunction: this.field.mapFunction,
					noSearchFields: this.field.noSearchFields,
					mustHaveFilters: this.field.mustHaveFilters,
					optionValue: this.field.optionValue,
					initialSelection: this.group.controls[this.field.key]?.value, // Initial value of the form control
				},
			});

			// Uncomment and modify the following lines to handle selection from the dialog
			// const sub = dialogRef.componentInstance.onSelectData.subscribe((data: any) => {
			//   // Handle selected data
			// });

			dialogRef
				.afterClosed()
				.pipe(takeUntil(this.destroy$)) // Ensure subscription is cleaned up on destroy
				.subscribe((result: any) => {
					this.showTable = false; // Hide the table

					if (result) {
						// Process the result from the dialog
						this.generateOptions({
							rows: this.field.multiple ? result : [result],
							totalPages: this.totalPages - 1, // Adjust total pages
						});
						this.selected = this.field.multiple
							? result?.map(
									(item: any) => item[this.field.optionValue || ''] + ''
							  )
							: result[this.field.optionValue || ''] + '';
						this.group.controls[this.field.key as string]?.patchValue(
							this.selected
						); // Update form control value
						this.fieldChange({ value: this.selected }); // Notify field change
					}
				});
		}
	}

	/**
	 * Opens a dialog to add a new item.
	 * The user is prompted to enter a new item, which is then processed by the `onAddNew` method of the field.
	 */
	addNew(): void {
		this.paginatedSelector.close(); // Close the paginated selector

		// Show a notification with an input field for adding a new item
		this.notificationService.showSimpleInput({
			title: 'Add new', // Title of the dialog
			inputLabel: 'Item to add', // Label for the input field
			onConfirm: (input: string): void => {
				// Handle confirmation: Call the `onAddNew` method with the provided input
				this.field.onAddNew(input);
			},
			confirmButtonText: '', // Text for the confirm button
			cancelButtonText: '', // Text for the cancel button
		});
	}

	/**
	 * Updates the label showing the total number of selected items.
	 */
	setTotalSelected(): void {
		// Get the current values of the form control associated with the field key
		let values = this.group.controls[this.field.key as string]?.value;
		// Check if multiple values are selected and update the label accordingly
		if (this.field?.multiple && Array.isArray(values) && values.length > 0) {
			this.selectedCountLabel = ` (${values.length})`; // Set label to show the count of selected items
		} else {
			this.selectedCountLabel = ''; // Reset the label if no items are selected
		}
	}
}
