export interface ProcuringEntityPublic {
  uuid: string;
  name: string;
  website?: string;
  postalCode?: string;
  logoUuid?: string;
  acronym?: string;
  physicalAddress?: string;
  hasCustomLogo?: boolean;
}


export interface RegionModel {
  id?: number|any;
  areaName: string;
  uuid: string;
}

