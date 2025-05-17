import { AdvancedSearchFilterModel } from '../../shared/components/advanced-search-filter/advanced-search-filter-model';
import {FieldConfig, FieldType} from "../../shared/components/dynamic-forms-components/field.interface";

/*** Please make sure that key matches the filters you want to use
 * for default search keyword which will have multiple searches use searchKeyWord
 * */
export const fields: FieldConfig[] = [
  {
    label: 'SEARCH_BY_KEYWORD',
    key: 'searchKeyWord',
    type: FieldType.input,
    rowClass: 'col-span-4',
  },
  {
    label: 'Financial Year',
    placeholder: 'Select financial year',
    key: 'financialYearCode',
    type: FieldType.select,
    options: [],
    value: null,
  },
];

export interface PEStatistics {
  financialYearCode: string;
  logoUuid: string;
  procurementEntityUuid: string;
  procuringEntityName: string;
  publishedApp: number;
  tenderCount: number;
  website: string;
  appUuid: string;
}
