import { ValidationErrors } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { MustHaveFilter } from '../paginated-data-table/must-have-filters.model';
import { ApolloNamespace } from 'src/app/apollo.config';

// Common types
export type Time = `${HH}:${MM}`;
type HH =
	| '00'
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23';
type MM =
	| '00'
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
	| '29'
	| '30'
	| '31'
	| '32'
	| '33'
	| '34'
	| '35'
	| '36'
	| '37'
	| '38'
	| '39'
	| '40'
	| '41'
	| '42'
	| '43'
	| '44'
	| '45'
	| '46'
	| '47'
	| '48'
	| '49'
	| '50'
	| '51'
	| '52'
	| '53'
	| '54'
	| '55'
	| '56'
	| '57'
	| '58'
	| '59';

// Enums
export enum FieldType {
	input = 'input',
	textarea = 'textarea',
	radiobutton = 'radiobutton',
	select = 'select',
	paginatedselect = 'paginatedselect',
	phoneInput = 'phoneInput',
	groupselect = 'groupselect',
	date = 'date',
	time = 'time',
	time24 = 'time24',
	button = 'button',
	checkbox = 'checkbox',
	attachment = 'attachment',
	sampleAttachment = 'sampleAttachment',
	number = 'number',
	formattedNumber = 'formattedNumber',
}

export type InputType =
	| 'email'
	| 'formattedNumber'
	| 'password'
	| 'tel'
	| 'text'
	| 'rich-text'
	| 'attachment'
	| 'time'
	| 'url'
	| 'hidden'
	| 'datetime-local';

export type FileType = '.pdf' | '.xls' | '.png' | '.jpg' | '.doc' | '.docx';

export type DynamicPipe = {
	pipe:
		| 'financialYear'
		| 'numberWithComma'
		| 'replace'
		| 'date'
		| 'titleCase'
		| 'upperCase'
		| 'defaultCase';
	firstArgs?: any;
	secondArgs?: any;
	thirdArgs?: any;
};

export interface Validator {
	name: string;
	validator: ValidationErrors;
	message: string;
}

export interface Option {
	value: any;
	name: string;
	disabled?: boolean;
	loading?: boolean;
}

export interface TableColumn {
	name: string;
	label: string;
	type?: string;
	info?: string;
	case?: 'titlecase' | 'uppercase' | 'lowercase';
}

// Base configuration interface with improved organization
export interface BaseFieldConfig {
	// Basic field properties
	key?: string;
	otherKey?: string; // For related field connections
	label?: string;
	type?: FieldType;
	value?: any;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	visible?: boolean;
	order?: number;

	// Display options
	placeholder?: string;
	hint?: string;
	icon?: string;
	hideLabel?: boolean;
	hideRequiredMarker?: boolean;
	hintDanger?: boolean;
	showCounter?: boolean;
	rowClass?: string;
	showWhen?: string; // Conditional display based on other field values
	headingTitle?: string; // Title for section headers
	useTranslation?: boolean; // Whether to use translation for texts

	// Validation
	validations?: Validator[];
	allowedLength?: number;
	maxCharacter?: number;
	acceptedDecimalPoints?: number;

	// Input specific
	inputType?: InputType;
	richTextOptions?: string[][];
	maxTime?: Time;
	minTime?: Time;
	minInput?: Time | number;
	maxInput?: Time | number;
	rowsNumber?: number;
	acceptType?: FileType[]; // Accepted file types for file inputs

	// Date specific
	minDate?: Date | string;
	maxDate?: Date | string;
	pickerDateFilters?: DateFilterFn<Date>;
	dateFormat?: string;
	dateFormatValue?: boolean;
	disableWeekendDates?: boolean;

	// Select/Options specific
	options?: Observable<Option[] | any[]> | Option[] | any[];
	multiple?: boolean;
	virtualScroll?: boolean;
	showOtherOption?: boolean;
	optionName?: string; // Property name to display as option label
	optionValue?: string; // Property name to use as option value
	optionData?: {
		value: any;
		loading: boolean;
		error?: any;
	};
	selectorOptionLabel?: string; // Label for selector options

	// Button specific
	buttonColor?: 'primary' | 'accent' | 'warn';
	buttonConfirmFirst?: boolean;
	buttonConfirmText?: boolean;
	cancelText?: string; // Text for cancel button
	saveIcon?: string; // Icon for save button
	isLoading?: boolean; // Loading state for buttons
	confirmFirst?: boolean; // Confirmation before action
	showCancel?: boolean; // Whether to show cancel button

	// Advanced features
	apolloNamespace?: ApolloNamespace;
	fetchPolicy?: 'cache-first' | 'network-only';
	mustHaveFilters?: MustHaveFilter[];
	dynamicPipes?: DynamicPipe[];
	tableColumns?: TableColumn[];
	searchFields?: string[];
	sortField?: string;

	noSearchFields?: string[]; // Fields to exclude from search
	pageSize?: number;
	additionalVariables?: { [key: string]: any }; // Additional query variables
	/** @deprecated Use options with Observable type instead */
	useObservable?: boolean;
	query?: any; // GraphQL query configuration
	paginatedSearchFieldKey?: string; // Key field for paginated search
	duplicateCheckKey?: string; // Key for duplicate checking
	preventConcat?: boolean; // Prevent concatenation of results
	removeUnderscore?: boolean; // Remove underscores from values
	/** @deprecated Use filterKey instead */
	filterValueKey?: string;
	/** @deprecated */
	filterKey?: string;
	/** @deprecated Use query instead */
	queryKey?: string;
	/** @deprecated Use apolloNamespace instead */
	collections?: any;

	// Callbacks and transformations
	onAddNew?: Function;
	mapFunction?: (item: any) => any;
}

// Specific field type interfaces
export interface InputField extends BaseFieldConfig {
	type: FieldType.input;
	inputType: InputType;
}

export interface AttachmentField extends BaseFieldConfig {
	type: FieldType.attachment | FieldType.sampleAttachment;
	acceptType: FileType[]; // Required for attachment fields
}

export interface SelectField extends BaseFieldConfig {
	type: FieldType.select | FieldType.radiobutton;
	options: Observable<Option[]> | Option[];
}

export interface PaginatedSelectField extends BaseFieldConfig {
	type: FieldType.paginatedselect;
	searchFields: string[];
	sortField?: string;
	query: any;
	optionName: string;
	optionValue: string;
	apolloNamespace: ApolloNamespace;
}

export interface GroupSelectField extends BaseFieldConfig {
	type: FieldType.groupselect;
	groupOptions?: Observable<{ groupItems: any[] }[]>;
}

// Union type for all possible field configurations
export type FieldConfig =
	| InputField
	| AttachmentField
	| SelectField
	| PaginatedSelectField
	| GroupSelectField
	| BaseFieldConfig;

// Helper interface for document attachments
export interface AttachedDocument {
	fieldKey: string;
	title?: string;
	attachmentUuid: string;
	format: string;
}

export interface PreviousDocument {
	fieldKey: string;
	title?: string;
	attachmentUuid: string;
	format: string;
}
