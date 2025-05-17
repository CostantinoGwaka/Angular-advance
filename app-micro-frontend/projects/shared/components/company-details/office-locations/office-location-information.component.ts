import { Observable, Subscription } from 'rxjs';
import { ApplicationState } from 'src/app/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from "@ngrx/store";
import { OfficeLocation } from "../../../../modules/nest-tenderer/store/settings/office-location/office-location.model";
import * as fromSelector from "../../../../modules/nest-tenderer/store/settings/office-location/office-location.selectors";
import { AdministrativeArea } from "../../../../modules/nest-pe-management/store/administrative-area/administrative-area.model";
import { selectModifiedAdministrativeAreasByType } from "../../../../modules/nest-pe-management/store/administrative-area/administrative-area.selectors";
import { getAllAdministrativeAreasByType } from "../../../../modules/nest-pe-management/store/branch/branch.actions";
import { AdministrativeAreasTypeEnum } from "../../../../modules/nest-pe-management/store/branch/branch.model";
import { TableConfiguration } from "../../paginated-data-table/paginated-table-configuration.model";
import { LayoutService } from "../../../../services/layout.service";
import { ActivatedRoute } from "@angular/router";
import {
  GET_TENDERER_OFFICE_BY_UUID
} from "../../../../modules/nest-tenderer/store/settings/office-location/office-location.graphql";
import { ViewOfficeLocationComponent } from './view-office-location/view-office-location.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaginatedDataTableComponent } from '../../paginated-data-table/paginated-data-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-office-location-information',
    templateUrl: './office-location-information.component.html',
    styleUrls: ['./office-location-information.component.scss'],
    standalone: true,
    imports: [PaginatedDataTableComponent, MatButtonModule, MatIconModule, ViewOfficeLocationComponent, AsyncPipe]
})
export class OfficeLocationInformationComponent implements OnInit, OnDestroy {

  selectedOfficeLocation: OfficeLocation;
  regions$: Observable<AdministrativeArea[]>;
  districts$: Observable<AdministrativeArea[]>;
  loading$: Observable<boolean>;

  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'directorTitle', label: 'Officer in Charge Title' },
      { name: 'phone', label: 'Phone' },
      { name: 'email', label: 'Email Address' },
      { name: 'physicalAddress', label: 'Physical Address' },
      { name: 'postalAddress', label: 'Postal Address' },
      { name: 'region', label: 'Region' },
      { name: 'district', label: 'District' },
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

  query = GET_TENDERER_OFFICE_BY_UUID;
  uaaApolloNamespace = ApolloNamespace.uaa;
  viewDetailsTitle = '';
  viewDetails: boolean = false;
  selectedUuid: string;
  viewType = 'table';
  routeSub = Subscription.EMPTY;

  constructor(
    private store: Store<ApplicationState>,
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
  ) {
    this.store.dispatch(getAllAdministrativeAreasByType({ areaType: AdministrativeAreasTypeEnum.Region }))
  }

  ngOnInit(): void {
    this.regions$ = this.store.select(selectModifiedAdministrativeAreasByType(AdministrativeAreasTypeEnum.Region));
    this.districts$ = this.store.select(selectModifiedAdministrativeAreasByType(AdministrativeAreasTypeEnum.District));
    this.loading$ = this.store.pipe(select(fromSelector.selectOfficeLocationLoading));

    this.routeSub = this.activeRoute.queryParams.subscribe(items => {
      this.viewDetails = !!items['action'];
      this.viewType = items['action'] ?? 'table';
      this.selectedUuid = items['id'] ?? '';
    })
  }

  mapFunction(item) {
    return {
      ...item,
      district: item.district?.areaName,
      region: item.region?.areaName
    };
  }

  viewItem(event: OfficeLocation) {
    this.viewType = 'view';
    this.selectedOfficeLocation = event;
    this.viewDetailsTitle = `Office location: ${event?.directorTitle}`;
  }

  closeDetails() {
    this.viewType = 'table';
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
