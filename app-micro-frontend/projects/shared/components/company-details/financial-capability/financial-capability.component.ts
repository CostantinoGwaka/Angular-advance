import { firstValueFrom, Observable } from 'rxjs';
import { ApplicationState } from 'src/app/store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from "@ngrx/store";
import { TendererFinancialStatement } from "../../../../modules/nest-tenderer/store/settings/tenderer-cash-flow/tenderer-cash-flow.model";
import * as fromActions from "../../../../modules/nest-tenderer/store/settings/tenderer-cash-flow/tenderer-cash-flow.actions";
import * as fromSelector from "../../../../modules/nest-tenderer/store/settings/tenderer-cash-flow/tenderer-cash-flow.selectors";
import { first, map } from "rxjs/operators";
import { AuthUser } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { TableConfiguration } from "../../paginated-data-table/paginated-table-configuration.model";
import { selectAllAuthUsers } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { GET_TENDERER_FINANCIAL_CASH_FLOW_BY_UUID_DATA } from "../../../../modules/nest-tenderer/store/settings/tenderer-cash-flow/tenderer-cash-flow.graphql";
import { ViewCashFlowsComponent } from './view-cash-flows/view-cash-flows.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../loader/loader.component';
import { PaginatedDataTableComponent } from '../../paginated-data-table/paginated-data-table.component';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'app-financial-capability',
    templateUrl: './financial-capability.component.html',
    styleUrls: ['./financial-capability.component.scss'],
    standalone: true,
    imports: [PaginatedDataTableComponent, LoaderComponent, MatCardModule, MatButtonModule, MatIconModule, ViewCashFlowsComponent, AsyncPipe]
})
export class FinancialCapabilityComponent implements OnInit {

  tendererCashFlows$: Observable<TendererFinancialStatement[]>;
  selectedCashFLow: TendererFinancialStatement
  loading$: Observable<boolean>;

  viewDetails: boolean = false;
  viewDetailsTitle = '';
  @Input() viewType: string = 'table';
  @Output() setCurrentTab = new EventEmitter();
  selectedUuid: string;
  query = GET_TENDERER_FINANCIAL_CASH_FLOW_BY_UUID_DATA;
  uaaApolloNamespace = ApolloNamespace.uaa;

  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'year', label: 'Year' },
      { name: 'currency', label: 'Currency', },
      { name: 'cashFlow', label: 'Cash Flow', type: 'number' },
      { name: 'totalRevenue', label: 'Total', type: 'number' },
      { name: 'workingCapital', label: 'Working Capital', type: 'number' },
      { name: 'totalLiabilities', label: 'Total Liabilities', type: 'number' },
      { name: 'totalEquity', label: 'Total Equity', type: 'number' },
    ],
    tableCaption: '',
    showNumbers: false,
    tableNotifications: '',
    showSearch: false,
    useFullObject: true,
    showBorder: true,
    allowPagination: true,
    actionIcons: {
      edit: false,
      delete: false,
      more: true,
      print: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    customPrimaryMessage: 'Manage',
    empty_msg: 'No data found',
  };

  constructor(
    private store: Store<ApplicationState>,
  ) {
  }

  ngOnInit(): void {
    this.tendererCashFlows$ = this.store.pipe(select(fromSelector.selectModifiedTendererCashFlows));
    this.loading$ = this.store.pipe(select(fromSelector.selectTendererCashFlowLoading));
    this.getTenderer().then();
  }

  async getTenderer() {
    const user: AuthUser = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers),
      first(items => items.length > 0),
      map(i => i[0])));
    this.store.dispatch(fromActions.getAllTendererCashFlows({ deleted: false, tendererUuid: user?.tenderer?.uuid }));
  }

  viewItem(event: TendererFinancialStatement) {
    this.selectedCashFLow = event;
    this.viewType = 'view';
    this.selectedUuid = event.uuid;
    this.viewDetailsTitle = `Financial Statement for : ${event?.year}`;
  }

  closeDetails(shouldUpdate = false) {
    this.viewType = 'table';
  }
}
