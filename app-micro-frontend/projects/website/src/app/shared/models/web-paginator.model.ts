export interface PaginatorInput {
  loading?: boolean,
  first?: boolean,
  hasNext?: boolean,
  hasPrevious?: boolean,
  last?: boolean,
  currentPage?: number,
  numberOfRecords?: number,
  pageSize?: number,
  recordsFilteredCount?: number,
  totalPages?: number,
  pageSizeList?: number[],
  totalRecords?: number
}
