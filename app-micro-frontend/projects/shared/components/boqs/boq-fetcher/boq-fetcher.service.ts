import { requisition } from '../../../../services/svg/icons/requisition';
import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Injectable({
  providedIn: 'root',
})
export class BoqFetcherService {
  constructor() { }

  getWorksRequisitionItemsByRequisitionUuid(requisitionUuid: string) {
    //getWorksRequisitionItemItemizationPaginated
  }

  getWorksRequisitionItemsItemizationsByRequisitionUuid(
    requisitionUuid: string
  ) { }

  getWorksRequisitionItemizationPaginated() {
    //getWorksRequisitionItemizationPaginated
  }

  getWorksRequisitionSpecificationPaginated() {
    //getWorksRequisitionSpecificationPaginated
  }
}
