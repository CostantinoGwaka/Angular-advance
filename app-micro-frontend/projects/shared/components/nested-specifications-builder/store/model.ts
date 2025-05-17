export enum FormulaNames {
  PROVISION_SUM_PERCENT = 'PROVISION_SUM_PERCENT',
  PROVISION_SUM_AMOUNT = 'PROVISION_SUM_AMOUNT',
}

export interface FormularField {
  itemId: string;
  inputField?: 'unitRate' | 'total';
}

export interface Formula {
  resultsField?: 'unitRate' | 'total';
  inputFields: FormularField[];
  formulaName: FormulaNames;
  formula?: string;
  description?: string;
}

export interface NestedSpecificationItem {
  id?: number;
  uuid?: string;
  level: number;
  parentId?: string;
  description: string;
  sourceUuid?: string;
  code?: string;
  children?: NestedSpecificationItem[];
  specifications?: EditableSpecificationItem[];
  isNew?: boolean;
  rowId?: string;
  isEditable: boolean;
  isSelected?: boolean;
  total?: number;
}

export interface NestedSpecificationGroupItem {
  id?: number;
  uuid?: string;
  name?: string;
}

export interface NestedSpecificationGroupItemFooter {
  id?: number;
  uuid?: string;
  name?: string;
  total?: number;
}

export interface EditableSpecificationItemBase {
  description: string;
  name?: string;
  sourceUuid?: string;
  isNew?: boolean;
  uuid?: string;
  id?: number | string;
  rowId?: string;
  isEditable?: boolean;
  value?: string;
}

export interface EditableSpecificationItem
  extends EditableSpecificationItemBase {
  copiedUuid?: string;
  unitOfMeasure?: string;
  parentId?: string;
  code?: string;
  level?: number;
  isSelected?: boolean;
  unitRate?: number;
  total?: number;
  formula?: Formula;
  showFullDescription?: boolean;
  state?: ItemState;
  incompleteReasons?: string[];
  options?: string[];
}

export enum FlatNestedSpecificationItemViewChangeTypes {
  ADD = 'ADD_ITEM',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
  STATE_CHANGE = 'STATE_CHANGE',
  REFRESH = 'REFRESH',
}

export enum ItemsStateCodes {
  LOADING = 'LOADING',
  SAVE_ERROR = 'SAVE_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
  SUCCESS = 'SUCCESS',
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  MODIFIED = 'MODIFIED',
}
export interface ItemState {
  code: ItemsStateCodes;
  message?: string;
}

export type FlatNestedSpecificationItemViewType =
  | 'GroupItem'
  | 'GroupItemFooter'
  | 'ItemDescription'
  | 'NestedSpecificationItem'
  | 'NestedSpecificationTableHeader'
  | 'NestedSpecificationFooter';
export interface FlatNestedSpecificationItemView {
  type: FlatNestedSpecificationItemViewType;
  id?: string | number;
  isNew?: boolean;
  uuid?: string;
  level: number;
  parentId?: string;
  groupId?: number;
  parentIsExpanded: boolean;
  editableSpecificationItem?: EditableSpecificationItem;
  nestedSpecificationItem?: NestedSpecificationItem;
  nestedSpecificationGroupItem?: NestedSpecificationGroupItem;
  nestedSpecificationGroupItemFooter?: NestedSpecificationGroupItemFooter;
}

interface ItemDetails {
  foundItem: NestedSpecificationItem;
  foundItemIndex: number;
  foundParent: NestedSpecificationItem;
  foundParentIndex: number;
}
