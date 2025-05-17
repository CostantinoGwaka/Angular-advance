import {
  FieldConfig,
  FieldType,
} from 'src/app/shared/components/dynamic-forms-components/field.interface';
import {Validators} from "@angular/forms";
import { SearchOperation } from 'src/app/store/global-interfaces/organizationHiarachy';
import { emailValidator, noNumberRegex, noSpaceRegex, onlyNumberInputValidator, phoneNumberValidator } from 'src/app/shared/validators/input-validators';
import { CountryDtoInput } from 'src/app/modules/nest-tenderer-management/store/country/country.model';
import { GET_COUNTRY_PAGINATED } from 'src/app/modules/nest-tenderer-management/store/country/country.graphql';
import {ApolloNamespace} from "../../../../../../apollo.config";

export interface BusinessOwnerField {
  uuid?: string;
  country?: CountryDtoInput;
  countryName?: string;
  countryUuid?: string;
  name: string;
  email: string;
  identificationNumber: string;
  ownershipValue: string;
  phoneNumber: string;
}

export const fields: FieldConfig[] = [
  {
    type: FieldType.input,
    label: 'Company / Person Name',
    key: 'name',
    validations: [
      {
        message: 'Company / Person Name is Required',
        validator: Validators.required,
        name: 'required',
      },
      {
        message: 'Only character are allowed a-z or A-Z',
        validator: Validators.pattern(noNumberRegex),
        name: 'pattern',
      },
    ],
    rowClass: 'col-span-12 md:col-span-6',
  },
  {
    type: FieldType.input,
    label: 'Email address',
    key: 'email',
    validations: [
      {
        message: 'Must be an email address',
        validator: Validators.email,
        name: 'required'
      },
      {
        message: 'Enter a correct email',
        validator: Validators.pattern(emailValidator),
        name: 'pattern',
      },
    ],
    rowClass: 'col-span-12 md:col-span-6',
  },
  {
    type: FieldType.input,
    label: 'Phone Number',
    key: 'phoneNumber',
    validations: [
      {
        message: 'Phone number is Required',
        validator: Validators.required,
        name: 'required',
      },
      {
        message: '15 maxmum characters is allowed',
        validator: Validators.maxLength(15),
        name: 'minLength',
      },
      {
        message: '10 minimum characters is allowed',
        validator: Validators.minLength(10),
        name: 'minLength',
      },
      {
        message: 'Only number are allowed 0-9',
        validator: Validators.pattern(onlyNumberInputValidator),
        name: 'pattern',
      },
    ],
    rowClass: 'col-span-12 md:col-span-6',
  },
  {
    type: FieldType.input,
    label: 'National / Passport Number',
    key: 'identificationNumber',
    validations: [
      {
        message: 'National / Passport Number is Required',
        validator: Validators.required,
        name: 'required',
      },
      {
        message: 'Only number are allowed 0-9',
        validator: Validators.pattern(onlyNumberInputValidator),
        name: 'pattern',
      },
    ],
    rowClass: 'col-span-12 md:col-span-6',
  },
  {
    type: FieldType.paginatedselect,
    query: GET_COUNTRY_PAGINATED,
    apolloNamespace: ApolloNamespace.uaa,
    optionName: 'name',
    optionValue: 'uuid',
    searchFields: ['name'],
    sortField: 'name',
    dynamicPipes: [],
    icon: 'assignment',
    hint: '',
    label: 'Select Nationality',
    key: 'countryUuid',
    mapFunction: (item) => ({...item}),
    mustHaveFilters: [
      {
        fieldName: "name",
        operation: SearchOperation.NE,
        value1: "Zanzibar",
      },
    ],
    multiple:false,
    pageSize:1000,
    validations: [
      {
        message: 'This field is Required',
        validator: Validators.required,
        name: 'required'
      }
    ],
    rowClass: 'col-span-12 md:col-span-6',
  },
  {
    type: FieldType.input,
    label: 'Ownership Value',
    key: 'ownershipValue',
    validations: [
      {
        message: 'Ownership Value is Required',
        validator: Validators.required,
        name: 'required',
      },
      {
        message: 'Only number are allowed 0-9',
        validator: Validators.pattern(onlyNumberInputValidator),
        name: 'pattern',
      },
    ],
    rowClass: 'col-span-12 md:col-span-6',
  },
  {
    type: FieldType.button,
    label: 'Submit',
    rowClass: 'col12',
  },
];
