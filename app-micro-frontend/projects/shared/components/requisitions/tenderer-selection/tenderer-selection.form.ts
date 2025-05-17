import { Validators } from '@angular/forms';
import {
	FieldConfig,
	FieldType,
} from 'src/app/shared/components/dynamic-forms-components/field.interface';
import { GET_BUSINESS_LINE_PAGINATED_MINIMAL } from '../../../../modules/nest-tenderer-management/store/business-line/business-line.graphql';
import { GET_COUNTRY_PAGINATED } from 'src/app/modules/nest-tenderer-management/store/country/country.graphql';
import { flags } from 'src/app/modules/nest-tenderer-management/store/country/country-flags';
import { TendererType } from '../../../../modules/nest-tenderer-management/store/tenderer-type/tendere-type.model';
import { ApolloNamespace } from 'src/app/apollo.config';

export const searchFields: FieldConfig[] = [
	{
		type: FieldType.paginatedselect,
		query: GET_BUSINESS_LINE_PAGINATED_MINIMAL,
		apolloNamespace: ApolloNamespace.uaa,
		optionName: 'name',
		optionValue: 'id',
		searchFields: ['name'],
		sortField: 'name',
		dynamicPipes: [],
		multiple: true,
		label: 'Applicable Business Line',
		key: 'businessLineId',
		rowClass: 'col-span-6',
		mapFunction: (item) => ({ ...item, catName: item.tenderCategory?.name }),
		mustHaveFilters: [],
		validations: [
			{
				message: 'Business Line is Required',
				validator: Validators.required,
				name: 'required',
			},
		],
	},
	{
		type: FieldType.paginatedselect,
		query: GET_COUNTRY_PAGINATED,
		apolloNamespace: ApolloNamespace.uaa,
		optionName: 'flagName,name',
		optionValue: 'id',
		searchFields: ['name'],
		sortField: 'name',
		dynamicPipes: [],
		label: 'Operating Country',
		multiple: true,
		key: 'operatingCountryId',
		showWhen: '{(businessLineId)(!=)(null)}',

		mapFunction: (item) => ({ ...item, flagName: flags[item.code] }),
		mustHaveFilters: [
			{
				fieldName: 'name',
				operation: 'NE',
				value1: 'Zanzibar',
			},
		],
		rowClass: 'col-span-6',
		validations: [
			{
				message: 'Business Line is Required',
				validator: Validators.required,
				name: 'required',
			},
		],
	},
	{
		type: FieldType.button,
		label: 'Get Tenderers',
		rowClass: 'col-span-12',
	},
	// {
	//   type: FieldType.paginatedselect,
	//   query: GET_ALL_BUSINESS_LINE_UNSPSC_CODE,
	//   optionName: 'unspscCode.commodityTitle',
	//   optionValue: 'unspscCodeUuid',
	//   noSearchFields: ['unspscCodeUuid'],
	//   searchFields: ['unspscCode.commodityTitle', 'unspscCode.uuid'],
	//   sortField: 'unspscCode.commodityTitle',
	//   dynamicPipes: [],
	//   showWhen: '{(businessLineUuid)(!=)(null)}',
	//   hint: '',
	//   label: 'Select Commodity/Services',
	//   key: 'unspscCodeUuids',
	//   mapFunction: (item) => {
	//     return {
	//       ...item,
	//       unspscCodeUuid: item.unspscCode.uuid
	//     }
	//   },
	// },
];
export const fields: FieldConfig[] = [
	{
		type: FieldType.select,
		label: 'Reasons',
		key: 'reasonUid',
		options: [],
		validations: [
			{
				message: 'Reason is Required',
				validator: Validators.required,
				name: 'required',
			},
		],
		rowClass: 'col-span-12',
	},
	{
		type: FieldType.textarea,
		label: 'Tender Comments',
		key: 'tenderComment',
		showWhen: '{(reasonUid)(!=)(null)}',
		rowClass: 'col-span-12',
		validations: [
			{
				message: 'Tender Comment is Required',
				validator: Validators.required,
				name: 'required',
			},
		],
	},
];

export interface SelectedTenderer {
	id: number;
	uuid: string;
	tendererUuid: string;
	tendererId: number;
	tendererName: string;
	name: string;
	email: string;
	phone: string;
	tendererPhoneNumber?: string;
	tendererType: TendererType | string;
	uniqueIdentificationNumber: string;
}
