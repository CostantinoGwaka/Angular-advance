export interface BOQFetchingConfiguration {
  fetchBy: 'query' | 'categoryId';
  fetchByValue?: string;
  fetchByParentValue?: string;
  groupId?: number;
  endPointName?: string;
  requisitionObjectFieldName?: string;
  requisitionItemsFieldName?: string;
  requisitionItemsItemizationsFieldName?: string;
  isFilled: boolean;
}
