import { AdministrativeArea } from "src/app/modules/nest-pe-management/store/administrative-area/administrative-area.model";

export interface SpecialGroup {
  id?: number;
  uuid?: string;
  active: string;
  createdAt?: string;
  createdBy?: string;
  name: string;
  nidaID: string;
  age: number;
  phoneNumber: string;
  position: string;
  email?: string;
  validUntil: string;
  region?: AdministrativeArea;
  council?: AdministrativeArea;
  district?: AdministrativeArea;
  ward?: AdministrativeArea;
  street?: AdministrativeArea;

  updatedAt?: string;
  updatedBy?: string;
}
