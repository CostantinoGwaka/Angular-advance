import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { TendersListComponent } from '../tenders/tenders-list/tenders-list.component';
import { GET_REGISTERED_SPECIAL_GROUP_DATA, GET_SPECIAL_GROUP_PAGINATED } from './special-group.graphql';
import { PaginatedDataTableComponent } from 'src/app/shared/components/paginated-data-table/paginated-data-table.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { MustHaveFilter } from 'src/app/shared/components/paginated-data-table/must-have-filters.model';
import { AdministrativeArea } from 'src/app/modules/nest-pe-management/store/administrative-area/administrative-area.model';
import { Observable, Subscription } from 'rxjs';
import { ValidationType } from 'src/app/modules/nest-tenderer-management/store/validation-type/validation-type.model';
import { BusinessLine } from 'src/app/modules/nest-tenderer-management/store/business-line/business-line.model';
import { initializedPageableParameter, PageableParam, SearchOperation } from 'src/app/store/global-interfaces/organizationHiarachy';
import { ActionButton } from 'src/app/shared/components/paginated-data-table/action-button.model';
import { ApplicationState } from 'src/app/store';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-special-groups',
  standalone: true,
  imports: [
    LayoutComponent,
    ParallaxContainerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatIconModule,
    NgClass,
    PaginatedDataTableComponent, AsyncPipe],
  templateUrl: './special-groups.component.html',
  styleUrl: './special-groups.component.scss'
})
export class SpecialGroupsComponent implements OnInit, OnDestroy {
  viewDetails: boolean = false;
  viewDetailsTitle = '';
  selectedUuid: string;
  tableConfigurations = {
    tableColumns: [
      { name: 'name', label: 'Group Name' },
      { name: 'tinNumber', label: 'TIN' },
      { name: 'groupType', label: 'Group Type' },
      { name: 'areaName', label: 'Location' },
      { name: 'phoneNumber', label: 'Phone Number' },
      { name: 'economicActivity', label: 'Economic Activity' },
    ],
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: true,
    useFullObject: true,
    showBorder: true,
    allowPagination: true,
    actionIcons: {},
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    empty_msg: 'No Special Groups found',
  };

  query = GET_REGISTERED_SPECIAL_GROUP_DATA;
  apolloNamespace = ApolloNamespace.uaa;
  filterToUse: MustHaveFilter[] = [];
  viewType = '';

  districts: AdministrativeArea[] = [];
  loadingDistricts: boolean;
  regions$: Observable<AdministrativeArea[]>;
  district$: Observable<AdministrativeArea[]>;
  tendererCategories$: Observable<ValidationType[]>;
  businessLines$: Observable<BusinessLine[]>;
  loading$: Observable<boolean>;
  registryUuid: string;
  pageable: PageableParam = initializedPageableParameter;
  pagePage: PageableParam = { size: 1000, first: 0, sortBy: 'id', sortDirection: 'DESC' };

  updated: boolean;
  buttons: ActionButton[] = [];
  routeSub = Subscription.EMPTY;
  selectedIndex = 0;

  constructor(
    private store: Store<ApplicationState>,
  ) {
  }

  mapFunction(item) {
    return {
      ...item,
      businessLines: item.businessLineList?.map(i => i.name).join(', ')
    };
  }

  ngOnInit(): void {
    this.setSelectedIndex(0);
  }



  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  filterToUse1: MustHaveFilter[] = [
    {
      fieldName: 'isRegistered',
      operation: SearchOperation.EQ,
      value1: 'true'
    }
  ];

  filterToUse2: MustHaveFilter[] = [
    {
      fieldName: 'isRegistered',
      operation: SearchOperation.EQ,
      value1: 'false'
    }
  ];

  viewItem(event: any) { }
}


