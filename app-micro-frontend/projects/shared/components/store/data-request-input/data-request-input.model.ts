export interface FieldRequestInputInput {
  fieldName: string,
  isSearchable?: boolean,
  isSortable?: boolean,
  operation: SearchOperation,
  orderDirection: Direction
  searchValue?: string,
  searchValue2?: string,
}

export interface MandatoryFilterInputInput {
  fieldName?: string;
  inValues?: string[];
  isNull?: boolean;
  operation?: SearchOperation;
  value1?: string;
  value2?: string;
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SearchOperation {
  BTN = 'BTN',
  EQ = 'EQ',
  GT = 'GT',
  GTE = 'GTE',
  ILK = 'ILK',
  IN = 'IN',
  LK = 'LK',
  LT = 'LT',
  LTE = 'LTE',
  ME = 'ME',
  MS = 'MS',
  NE = 'NE',
  NIN = 'NIN'
}
