import { Observable } from 'rxjs';
import { ApplicationState } from 'src/app/store';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from "@ngrx/store";
import * as fromActions from "../../../../modules/nest-tenderer/store/settings/tenderer-work-experience/tenderer-work-experience.actions";
import * as fromSelector from "../../../../modules/nest-tenderer/store/settings/tenderer-work-experience/tenderer-work-experience.selectors";
import { TendererWorkExperience } from "../../../../modules/nest-tenderer/store/settings/tenderer-work-experience/tenderer-work-experience.model";
import { TableConfiguration } from "../../paginated-data-table/paginated-table-configuration.model";
import { GET_TENDERER_WORK_EXPERIENCE_BY_UUID_DATA } from "../../../../modules/nest-tenderer/store/settings/tenderer-work-experience/tenderer-work-experience.graphql";
import { ViewWorkExperienceComponent } from './view-work-experience/view-work-experience.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../loader/loader.component';
import { PaginatedDataTableComponent } from '../../paginated-data-table/paginated-data-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-company-experience',
    templateUrl: './company-experience.component.html',
    styleUrls: ['./company-experience.component.scss'],
    standalone: true,
    imports: [PaginatedDataTableComponent, LoaderComponent, MatCardModule, MatButtonModule, MatIconModule, ViewWorkExperienceComponent, AsyncPipe]
})
export class CompanyExperienceComponent implements OnInit {

  experiences$: Observable<TendererWorkExperience[]>;
  loading$: Observable<boolean>;
  selectedUuid: string;
  viewDetailsTitle: string;
  viewType: string = 'table';

  query = GET_TENDERER_WORK_EXPERIENCE_BY_UUID_DATA;
  uaaApolloNamespace = ApolloNamespace.uaa;

  selectedWorkExperience: TendererWorkExperience = null;

  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'contractNumber', label: 'Contract Number' },
      { name: 'contractStatus', label: 'Contract Status' },
      { name: 'institution', label: 'Institution/Employer' },
      { name: 'fromDate', label: 'From Date' },
      { name: 'toDate', label: 'To date' },
      { name: 'totalContractValue', label: 'Total Contract value' },
      { name: 'contractStatus', label: 'Status' }
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
    private store: Store<ApplicationState>
  ) {
    this.store.dispatch(fromActions.getAllTendererWorkExperiences({ deleted: false }));
  }

  ngOnInit(): void {
    this.experiences$ = this.store.pipe(select(fromSelector.selectModifiedTendererWorkExperiences));
    this.loading$ = this.store.pipe(select(fromSelector.selectTendererWorkExperienceLoading));
  }


  viewItem(event: any) {

    this.selectedWorkExperience = event;

    this.viewType = 'view';
    this.selectedUuid = event.uuid;
    this.viewDetailsTitle = `Work Experience: ${(event?.employerType == 'PRIVATE_INSTITUTION') ? event?.employerName : event?.procuringEntity.name}`;
  }

  closeDetails() {
    this.viewType = 'table';
  }

  mapFunction(item) {
    const institution = (item.employerType == 'PRIVATE_INSTITUTION') ? item.employerName : item.procuringEntity?.name;

    return {
      ...item,
      institution: institution,
      contractStatus: item.contractStatus.replace('_', ' '),
      actionButtons: {
        edit: item.contractStatus === 'ON_PROGRESS',
        delete: item.contractStatus === 'ON_PROGRESS',
      },
    };
  }
}
