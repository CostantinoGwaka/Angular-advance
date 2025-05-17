import { Validators } from "@angular/forms";
import { GET_DIRECT_MANUFACTURE_DATA_PAGINATED } from "src/app/modules/nest-tenderer-management/manufacturer/manufacturer.graphql";
import { FieldConfig, FieldType } from "../../dynamic-forms-components/field.interface";
import {ApolloNamespace} from "../../../../apollo.config";


export const fields: FieldConfig[] = [

  {
    type: FieldType.paginatedselect,
    query: GET_DIRECT_MANUFACTURE_DATA_PAGINATED,
    apolloNamespace: ApolloNamespace.uaa,
    optionName: 'accountName',
    optionValue: 'uuid',
    searchFields: ['accountName'],
    sortField: 'accountName',
    dynamicPipes: [],
    mapFunction: (item) => ({ ...item }),
    multiple: true,
    label: 'Manufacturer',
    key: 'manufacturer',
    rowClass: 'col-span-12 md:col-span-12',
    mustHaveFilters: [],
    validations: [
      {
        message: 'Field is Required',
        validator: Validators.required,
        name: 'required',
      },
    ],
  },

  {
    type: FieldType.button,
    label: 'Add Manufacturers',
    rowClass: 'col12',
  },
];
