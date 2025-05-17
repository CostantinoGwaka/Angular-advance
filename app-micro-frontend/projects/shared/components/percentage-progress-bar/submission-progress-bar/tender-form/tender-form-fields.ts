import {Validators} from '@angular/forms';
import {FieldConfig, FieldType,} from 'src/app/shared/components/dynamic-forms-components/field.interface';
import {
  GET_TENDERER_OFFICE_LOCATION_TENDER_FORM
} from "../../../../../modules/nest-tenderer/store/settings/office-location/office-location.graphql";
import {ApolloNamespace} from "../../../../../apollo.config";

export const fields: FieldConfig[] = [
  {
    type: FieldType.checkbox,
    label: 'Use office location(s) as address',
    key: 'useOfficeLocation',
    value: false,
    rowClass: 'col-span-6',
  },
  {
    type: FieldType.paginatedselect,
    query: GET_TENDERER_OFFICE_LOCATION_TENDER_FORM,
    apolloNamespace: ApolloNamespace.uaa,
    optionName: 'name',
    optionValue: 'name',
    searchFields: [
      'physicalAddress',
      'postalAddress'
    ],
    sortField: 'physicalAddress',
    dynamicPipes: [],
    multiple: false,
    label: 'Office Location',
    key: 'officeLocation',
    rowClass: 'col-span-6',
    showWhen: '{(useOfficeLocation)(==)(true)}',
    mapFunction: (item) => {
      let address = '';
      let lastAreaName = '';

      const addAreaName = (area) => {
        const areaName = item?.[area]?.areaName;
        if (areaName && areaName !== lastAreaName) {
          address += areaName + ' ';
          lastAreaName = areaName;
        }
      };
      const areas = ['street', 'district'];
      areas.forEach(addAreaName);
      address += item?.physicalAddress + ',' + item?.postalAddress;
      return { ...item, name: address };
    },
    mustHaveFilters: [],
    validations: [
      {
        message: 'Office location is required',
        validator: Validators.required,
        name: 'required'
      }],
  },
  {
    type: FieldType.button,
    label: 'Continue',
    rowClass: 'col12',
  },
];
