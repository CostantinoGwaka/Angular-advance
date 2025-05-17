import { EditableListItem } from 'src/app/shared/components/editable-list-items-selector/editable-list-item/editable-list-item.component';
import { InputConstraint } from "../../../../modules/nest-tender-initiation/store/settings/input-constraint/input-constraint.model";
import { KeyValueItem } from "../../key-value-list-input/key-value-input/key-value-input.component";
export interface VisibilityControl {
  field: string;
  requiedValue: string;
}

export interface SelectorConfiguration {
  keyValueInputProperties?: any;
  selectionKey?: string;
  selections?: EditableListItem[];
  options?: KeyValueItem[];
  valueField: string;
  labelField: string;
  codeField?: string;
  dbValueField?: string | number;
  identifierName?: string;
  code?: string;
}

export interface EditableListProperties {
  listDBName?: string;
  onAddNewItem?: (item: string, identifier: string, code: string) => void;
  allowAdd?: boolean;
}

export interface KeyValueInputProperties {
  listDBName?: string;
  onAddNewItem?: (item: string, identifier: string, code: string) => void;
  allowAdd?: boolean;
}

export enum tenderCategories {
  ALL = 'ALL',
  GENERAL_GOODS = 'GENERAL_GOODS',
  MEDIUM_AND_LARGE_WORKS = 'MEDIUM_AND_LARGE_WORKS',
  SMALL_WORKS = 'SMALL_WORKS',
  CONSULTANCY_LUMPSUM = 'CONSULTANCY_LUMPSUM',
  SUPPLY_AND_INSTALLATION_INFORMATION_SYSTEM = 'SUPPLY_AND_INSTALLATION_INFORMATION_SYSTEM',
  SUPPLY_AND_INSTALLATION_PLANT_AND_EQUIPMENT = 'SUPPLY_AND_INSTALLATION_PLANT_AND_EQUIPMENT',
  DESIGN_AND_BUILD = 'DESIGN_AND_BUILD',
  GENERAL_NON_CONSULTANCY = 'GENERAL_NON_CONSULTANCY',
  QUOTATION_NON_CONSULTANCY = 'QUOTATION_NON_CONSULTANCY',
  QUOTATION_GOODS = 'QUOTATION_GOODS',
  HEALTH_SECTOR_GOODS = 'HEALTH_SECTOR_GOODS',
  QUOTATION_FOR_WORKS = 'QUOTATION_FOR_WORKS',
  PRE_QUALIFICATION_WORKS = 'PRE_QUALIFICATION_WORKS',
  PRE_QUALIFICATION_GOODS = 'PRE_QUALIFICATION_GOODS',
  PRE_QUALIFICATION_NON_CONSULTANCY = 'PRE_QUALIFICATION_NON_CONSULTANCY',
  PRE_QUALIFICATION_CONSULTANCY = 'PRE_QUALIFICATION_CONSULTANCY',
  INVITATION_FOR_EXPRESSION_OF_INTEREST = 'INVITATION FOR EXPRESSION OF INTEREST',
  FRAMEWORK_AGREEMENT_GOODS_OPEN = 'FRAMEWORK AGREEMENT GOODS (OPEN)',
  FRAMEWORK_AGREEMENT_GOODS_CLOSED = 'FRAMEWORK AGREEMENT GOODS (CLOSED)',
  FRAMEWORK_NON_CONSULTANCY_OPEN = 'FRAMEWORK NON CONSULTANCY (OPEN)',
  FRAMEWORK_NON_CONSULTANCY_CLOSED = 'FRAMEWORK NON CONSULTANCY (CLOSED)',
  MINOR_VALUE_PROCUREMENT_GOODS = 'MINOR VALUE PROCUREMENT GOODS',
  MINOR_VALUE_PROCUREMENT_WORKS = 'MINOR VALUE PROCUREMENT WORKS',
  MINOR_VALUE_PROCUREMENT_NON_CONSULTANCY = 'MINOR VALUE PROCUREMENT NON CONSULTANCY',
  RFP_INDIVIDUAL_CONSULTANTS = 'RFP INDIVIDUAL CONSULTANTS',
  TEXTBOOKS_AND_READING_MATERIAL = 'TEXTBOOKS AND READING MATERIAL',
  COMMODITIES = 'COMMODITIES',
  PETROLEUM = 'PETROLEUM',
  PESTICIDES = 'PESTICIDES',
  WORKS_SUBCONTRACTS = 'WORKS – SUBCONTRACTS',
  LEASING_OF_PUBLIC_ASSETS = 'LEASING OF PUBLIC ASSETS',
  DISPOSAL_OF_PUBLIC_ASSETS = 'DISPOSAL OF PUBLIC ASSETS OF PUBLIC ASSETS',
  UKUSANYAJI_MAPATO = 'UKUSANYAJI MAPATO',
  KOTESHENI_YA_UNUNUZI_WA_VIFAA = 'KOTESHENI YA UNUNUZI WA VIFAA',
  KOTESHENI_HUDUMA_ZISIZO_ZA_KITAALAM = 'KOTESHENI HUDUMA ZISIZO ZA KITAALAM',
  KOTESHENI_MAKUNDI_MAALUM = 'KOTESHENI MAKUNDI MAALUM',
  KOTESHENI_KANDARASI_ZA_UJENZI = 'KOTESHENI KANDARASI ZA UJENZI',
  CONSULTANCY_TIMEBASED = 'CONSULTANCY TIMEBASED',
  FRAMEWORK_AGREEMENT_WORKS_OPEN = 'FRAMEWORK AGREEMENT WORKS (OPEN)',
  FRAMEWORK_AGREEMENT_WORKS_CLOSED = 'FRAMEWORK AGREEMENT WORKS (CLOSED)',
  WB_RFP_CONSULTING_SUPERVISION = 'WB_RFP_CONSULTING_SUPERVISION',
  EXPRESSION_OF_INTEREST = 'EXPRESSION_OF_INTEREST',
  IFAD_REOI_SERVICES = 'IFAD_REOI_SERVICES',
  IFAD_RFP_SERVICES_STP = 'IFAD_RFP_SERVICES_STP'
}

export interface DisplayCondition {
  requiredValue?: string | number;
  requiredCode?: string | number;
  comparison?: 'EQ' | 'NE';
}

export enum UserType {
  USER = 'USER',
  PMU = 'PMU',
}

export interface ControlledField {
  displayCondition: DisplayCondition;
  fieldName: string;
}

export type fieldType =
  | 'TEXT'
  | 'NUMBER'
  | 'RICHTEXT'
  | 'TEXT-AREA'
  | 'SELECTOR'
  | 'EDITABLE-LIST'
  | 'KEY-VALUE-LIST'
  | 'DATE'
  | 'TIME'
  | 'TIME24'
  | 'ATTACHMENT'
  | 'EMPTY';

export interface VerticalStepsFormField
  extends FormFieldNameAndLabel {
  id?: string;
  uuid: string;
  formFieldType: fieldType;
  label: string;
  placeholder: string;
  rowSpan: string;
  keyLabel?: string;
  valueLabel?: string;
  hint?: string;
  userType: UserType[];
  name: string;
  value?: any;
  fieldClass?: string;
  isHidden?: boolean;
  isFilledByPPRA?: boolean;
  hideForDonorSourceOfFund?: boolean;
  hideForOtherSourceOfFund?: boolean;
  isValid?: boolean;
  onChange?: any;
  controlledFields?: ControlledField[];
  tenderCategories: string[];
  constraint?: InputConstraint;
  affectGeneralConstraint?: boolean;
  removeForDonorSourceOfFund?: boolean;
  editableListProperties?: EditableListProperties;
  keyValueInputProperties?: KeyValueInputProperties;
  selectorConfiguration?: SelectorConfiguration;
  modelName?: string;
}

export interface FormFieldNameAndLabel {
  name: string;
  label: string;
}

export interface FormEntity {
  name: string;
  label: string;
}
