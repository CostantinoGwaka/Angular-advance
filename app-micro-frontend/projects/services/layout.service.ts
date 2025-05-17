import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { ActivatedRoute, Router } from "@angular/router";
import { TableConfiguration } from "../shared/components/paginated-data-table/paginated-table-configuration.model";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {


  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  openPanel(queryParams: { [id: string]: string }) {
    const path = this.router.url.split('?')[0].split('/');
    this.router.navigate(path, { queryParams }).then();
  }

  closePanel() {
    const path = this.router.url.split('?')[0].split('/');
    this.router.navigate(path).then();
  }

  setDeleted(itemId, tableConfiguration: any, value = true) {
    return {
      ...tableConfiguration,
      deleting: { [itemId]: value }
    }
  }

  resetDeleted(itemId, tableConfiguration: any) {
    return {
      ...tableConfiguration,
      deleting: {}
    }
  }


  setActive(itemId, tableConfiguration: TableConfiguration, value = true): TableConfiguration {
    return {
      ...tableConfiguration,
      active: { [itemId]: value }
    }
  }
}
