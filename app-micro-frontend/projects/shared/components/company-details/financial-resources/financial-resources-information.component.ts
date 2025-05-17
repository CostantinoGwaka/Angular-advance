import { Observable } from 'rxjs';
import { ApplicationState } from 'src/app/store';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from "@ngrx/store";
import { TendererFinancialResource } from "../../../../modules/nest-tenderer/store/settings/tenderer-financial-resource/tenderer-financial-resource.model";
import * as fromActions from "../../../../modules/nest-tenderer/store/settings/tenderer-financial-resource/tenderer-financial-resource.actions";
import * as fromSelector from "../../../../modules/nest-tenderer/store/settings/tenderer-financial-resource/tenderer-financial-resource.selectors";
import { TableConfiguration } from "../../paginated-data-table/paginated-table-configuration.model";
import { AsyncPipe } from '@angular/common';
import { FullDataTableComponent } from '../../full-data-table/full-data-table.component';

@Component({
    selector: 'app-financial-resources-information',
    templateUrl: './financial-resources-information.component.html',
    styleUrls: ['./financial-resources-information.component.scss'],
    standalone: true,
    imports: [FullDataTableComponent, AsyncPipe]
})
export class FinancialResourcesInformationComponent implements OnInit {

  tendererIncomeStatements$: Observable<TendererFinancialResource[]>;
  loading$: Observable<boolean>;

  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'currency', label: 'Currency' },
      { name: 'amountInTzs', label: 'Amount', type: 'number' },
      { name: 'sourceOfFund', label: 'Source of Fund' },
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
    hideExport: true,
    customPrimaryMessage: 'Manage',
    empty_msg: 'No data found',
  };

  constructor(
    private store: Store<ApplicationState>
  ) {
    this.store.dispatch(fromActions.getAllTendererFinancialResources({ deleted: false }));
  }

  ngOnInit(): void {
    this.tendererIncomeStatements$ = this.store.pipe(select(fromSelector.selectModifiedTendererFinancialResources));
    this.loading$ = this.store.pipe(select(fromSelector.selectTendererFinancialResourceLoading));
  }


}
