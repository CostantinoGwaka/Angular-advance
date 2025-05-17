export interface PaginateResults {
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  numberOfRecords: number;
  recordsFilteredCount: number;
  metaData: any[];
  totalPages: number;
  totalRecords: number;
}
