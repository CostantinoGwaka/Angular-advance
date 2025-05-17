export interface FieldRequestInput {
  fieldName: string;
  searchValue?: string;
  isSearchable?: boolean;
  isSortable?: boolean;
  orderDirection?: 'ASC' | 'DESC';
  operation?:
    | 'GT'
    | 'LT'
    | 'GTE'
    | 'LTE'
    | 'NE'
    | 'EQ'
    | 'ILK'
    | 'IN'
    | 'NIN'
    | 'LK'
    | 'ME'
    | 'MS';
}
