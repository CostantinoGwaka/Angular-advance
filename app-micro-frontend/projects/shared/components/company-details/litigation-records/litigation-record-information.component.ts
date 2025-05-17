import { firstValueFrom, Observable } from 'rxjs';
import { ApplicationState } from 'src/app/store';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from "@ngrx/store";
import { LitigationRecord } from "../../../../modules/nest-tenderer/store/settings/litigation-record/litigation-record.model";
import * as fromActions from "../../../../modules/nest-tenderer/store/settings/litigation-record/litigation-record.actions";
import * as fromSelector from "../../../../modules/nest-tenderer/store/settings/litigation-record/litigation-record.selectors";
import { first, map } from "rxjs/operators";
import { AuthUser } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { TableConfiguration } from "../../paginated-data-table/paginated-table-configuration.model";
import { selectAllAuthUsers } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { ViewLitigationRecordComponent } from './view-litigation-record/view-litigation-record.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FullDataTableComponent } from '../../full-data-table/full-data-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-litigation-record-information',
    templateUrl: './litigation-record-information.component.html',
    styleUrls: ['./litigation-record-information.component.scss'],
    standalone: true,
    imports: [FullDataTableComponent, MatCardModule, MatButtonModule, MatIconModule, ViewLitigationRecordComponent, AsyncPipe]
})
export class LitigationRecordInformationComponent implements OnInit {

  litigationRecords$: Observable<LitigationRecord[]>;
  selectedLitigationRecord: LitigationRecord;
  loading$: Observable<boolean>;
  selectedUuid: string;
  viewDetailsTitle: string;
  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'contractName', label: 'Contract Name ' },
      { name: 'awardDecision', label: 'Award Decision' },
      { name: 'amountInDispute', label: 'Amount in Dispute', type: 'number' },
      { name: 'contractSum', label: 'Contract Amount Sum', type: 'number' },
      { name: 'currency', label: 'Contract Currency' },
      // {name: 'nameOfPurchaser', label: 'Name of Purchaser'},
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

  viewType = 'table';

  constructor(
    private store: Store<ApplicationState>
  ) {
  }

  ngOnInit(): void {
    this.litigationRecords$ = this.store.pipe(select(fromSelector.selectModifiedLitigationRecord));
    this.loading$ = this.store.pipe(select(fromSelector.selectLitigationRecordLoading));
    this.getTenderer().then();
  }

  async getTenderer() {
    const user: AuthUser = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers),
      first(items => items.length > 0),
      map(i => i[0])));
    this.store.dispatch(fromActions.getAllLitigationRecords({ deleted: false, tendererUuid: user?.tenderer?.uuid }));
  }

  viewItem(event: LitigationRecord) {
    this.selectedLitigationRecord = event;
    this.viewType = 'view';
    this.selectedUuid = event.uuid;
    this.viewDetailsTitle = `Litigation record: ${(event.purchaserType === 'PUBLIC_INSTITUTION') ? event.procuringEntity.name : event.nameOfPurchaser}`;
  }

  closeDetails() {
    this.viewType = 'table';
  }

}
