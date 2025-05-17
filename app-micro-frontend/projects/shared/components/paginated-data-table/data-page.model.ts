import { FieldRequestInput } from "./field-request-input.model";
import { MustHaveFilter } from "./must-have-filters.model";

export interface DataPage {
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  isLast: boolean;
  isFirst: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  numberOfRecords: number;
  recordsFilteredCount: number;
  pageSize: number;
    rows: any[];
  data?: any;
  dataList?: any;
  metaData: {
    fieldName: string;
    isSearchable: string;
    isSortable: boolean;
    isEnum: boolean
  }[];

  message?: string,
  status?: boolean
}

export interface DataRequestInput {
  page: number,
  pageSize: number
  fields: FieldRequestInput[],
  mustHaveFilters?: MustHaveFilter[]
}

