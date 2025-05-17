import { NonStdTemplateCategory } from '../../modules/templates/store/non-std-template-categories/non-std-template-category.model';
import { TemplateTypeEnums } from '../../modules/templates-editor/store/templatetype-model';

export interface TenderSubcategroy {
  name: string;
  id?: string;
  acronym?: string;
  uuid?: string;
  tenderCategory?: {
    uuid?: string;
  };
}

export interface TenderCategory {
  name: string;
  id?: string;
  uuid?: string;
  subcategories?: TenderSubcategroy[];
}

export interface TemplateCategory {
  name: string;
  id: string;
  uuid: string;
  parentId: string;
}

export interface SectionDetails {
  name: string;
  code: string;
  id: string;
  description: string;
}

export interface ImportedSections {
  uuid: string;
  content: string;
}

export interface TemplateInfo {
  id?: number;
  uuid?: string;
  name: string;
  categoryId?: string;
  subCategoryId?: string;
  code?: string;
  mainCategory?: TenderCategory;
  categoryName?: string;
  subCategoryName?: string;
  templateType: TemplateTypeEnums;
  subCategory?: TenderSubcategroy;
  status?: string;
  previousDocumentId?: number;
  languageName: string;
  languageUuid: string;
  peName: string;
  peUuid: string;
  donorName: string;
  donorUuid: string;
  version?: number;
  nonSTDTemplateCategory?: NonStdTemplateCategory;
  nonSTDTemplateCategoryUuid?: string;
  metaData: string;
  importedSections?: ImportedSections[];
  importUuid?: string;
  updateIfImportExists?: boolean;
}
export interface Section {
  id: string;
  name: string;
  descrtiption?: string;
  data_type: string;
  parent?: string;
  data?: any;
}
