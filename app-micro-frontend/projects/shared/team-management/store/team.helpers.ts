import { EntityObjectTypeEnum } from './team.model';

export function getEntityName(entityType: EntityObjectTypeEnum): string {
  switch (entityType) {
    case EntityObjectTypeEnum.TENDER:
      return 'Tender';
    case EntityObjectTypeEnum.FRAMEWORK:
      return 'Framework';
    case EntityObjectTypeEnum.PLANNED_TENDER:
      return 'Pre Qualification';
    case EntityObjectTypeEnum.CONTRACT:
      return 'Contract';
    case EntityObjectTypeEnum.NEGOTIATION:
      return 'Negotiation';
    default:
      return '';
  }
}

export function getEntityTypeFromString(entityType : string) {
  switch (entityType) {
    case 'Tender':
      return EntityObjectTypeEnum.TENDER;
    case 'Framework':
      return EntityObjectTypeEnum.FRAMEWORK;
    case 'Pre Qualification':
      return EntityObjectTypeEnum.PLANNED_TENDER;
    case 'Contract':
      return EntityObjectTypeEnum.CONTRACT;
    case 'Negotiation':
      return EntityObjectTypeEnum.NEGOTIATION;
    default:
      return null;
  }
}
