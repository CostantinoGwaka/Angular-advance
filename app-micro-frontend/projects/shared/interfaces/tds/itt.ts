export interface ITTClause {
  id: string;
  description: string;
  linkedTds?: string[];
  linkedTdsIndexes?: number[];
}

export interface ITT {
  id: string;
  descripription: string;
  clauses: ITTClause[];
}
