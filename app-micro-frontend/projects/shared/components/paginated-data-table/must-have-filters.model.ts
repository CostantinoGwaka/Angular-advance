interface BaseFilter {
  fieldName: string;
  value1?: string;
  value2?: string;
  inValues?: string[];
  orderDirection?: 'ASC' | 'DESC';
}

export type MustHaveFilterOperation =
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
  | 'MS'
  | 'BTN'
  | '';

interface WithNull extends BaseFilter {
  isNull: boolean;
  operation?: MustHaveFilterOperation;
}

interface WithoutNull extends BaseFilter {
  isNull?: boolean;
  operation: MustHaveFilterOperation;
}

export type MustHaveFilter = WithoutNull | WithNull;
