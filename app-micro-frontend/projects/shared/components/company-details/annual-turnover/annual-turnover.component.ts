import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { map } from 'rxjs';
import { GET_TURNOVERS } from '../../../../modules/nest-tenderer/store/settings/annual-turnover/turnover.graphql';
import { initializedPageableParameter } from 'src/app/store/global-interfaces/organizationHiarachy';
import { PageableParam } from '../../../../store/global-interfaces/organizationHiarachy';
import { Observable } from 'rxjs';
import { AnnualTurnOver } from '../../../../modules/nest-tenderer/store/settings/annual-turnover/turnover.model';
import { ActionButton } from '../../paginated-data-table/action-button.model';
import { ApplicationState } from '../../../../store';
import { GraphqlService } from '../../../../services/graphql.service';
import { LayoutService } from '../../../../services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { selectAllAuthUsers } from '../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PaginatedDataTableComponent } from '../../paginated-data-table/paginated-data-table.component';
import {ApolloNamespace} from "../../../../apollo.config";

@Component({
    selector: 'app-annual-turnover',
    templateUrl: './annual-turnover.component.html',
    styleUrls: ['./annual-turnover.component.scss'],
    standalone: true,
    imports: [PaginatedDataTableComponent, AsyncPipe]
})
export class AnnualTurnoverComponent implements OnInit, OnDestroy {

  viewDetails: boolean = false;
  viewDetailsTitle = '';
  title = 'Annual Turnover';
  selectedUuid: string;
  usersData: AuthUser;
  tableConfigurations = {
    tableColumns: [
      { name: 'year', label: 'Year' },
      { name: 'amount', label: 'Amount' },
      { name: 'currencyName', label: 'Currency' },
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
      more: false,
      print: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: false,
    customPrimaryMessage: 'Activate',
    empty_msg: 'No data found',
  };
  query = GET_TURNOVERS;
  uaaApolloNamespace = ApolloNamespace.uaa;
  viewType = '';
  buttons: ActionButton[] = [];
  items$: Observable<AnnualTurnOver[]>;
  loading$: Observable<boolean>;
  pageable: PageableParam = initializedPageableParameter;
  pagePage: PageableParam = {
    size: 1000,
    first: 0,
    sortBy: 'id',
    sortDirection: 'DESC',
  };
  refreshDataTable: boolean = false;
  routeSub = Subscription.EMPTY;

  constructor(
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private apollo: GraphqlService,
    private store: Store<ApplicationState>
  ) {
  }

  ngOnInit(): void {
    this.routeSub = this.activeRoute.queryParams.subscribe((items) => {
      this.viewDetails = !!items['action'];
      this.viewType = items['action'] ?? '';
      this.selectedUuid = items['uuid'] ?? '';
    });
    this.getData().then();
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe()
  }
  async getData() {
    this.usersData = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), first(items => items.length > 0), map(i => i[0])));
  }


  mapFunction = (item: any) => {
    return {
      ...item,
    }
  }
}
