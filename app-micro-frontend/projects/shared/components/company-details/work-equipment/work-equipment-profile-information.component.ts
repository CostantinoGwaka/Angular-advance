import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationState } from 'src/app/store';
import { UntypedFormBuilder } from '@angular/forms';
import { NotificationService } from '../../../../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from "@ngrx/store";
import * as fromActions from "../../../../modules/nest-tenderer/store/settings/work-equipment/work-equipment.actions";
import * as fromSelector from "../../../../modules/nest-tenderer/store/settings/work-equipment/work-equipment.selectors";
import { WorkEquipment } from "../../../../modules/nest-tenderer/store/settings/work-equipment/work-equipment.model";
import { TableConfiguration } from "../../paginated-data-table/paginated-table-configuration.model";
import { ViewWorkEquipmentComponent } from './view-work-equipment/view-work-equipment.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FullDataTableComponent } from '../../full-data-table/full-data-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-work-equipment-profile-information',
    templateUrl: './work-equipment-profile-information.component.html',
    styleUrls: ['./work-equipment-profile-information.component.scss'],
    standalone: true,
    imports: [FullDataTableComponent, MatCardModule, MatButtonModule, MatIconModule, ViewWorkEquipmentComponent, AsyncPipe]
})
export class WorkEquipmentProfileInformationComponent implements OnInit {

  workEquipments$: Observable<WorkEquipment[]>;
  loading$: Observable<boolean>;
  viewType: string = 'table';
  selectedUuid: string;
  viewDetailsTitle: string;
  selectedWorkEquipment: WorkEquipment;
  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'oem', label: 'OEM' },
      { name: 'quantity', label: 'Quantity' },
      { name: 'yearOfManufacturer', label: 'Year of Manufacture' },
      { name: 'workEquipmentSource', label: 'Equipment Source' },
      { name: 'powerRating', label: 'Power Rating' },
      { name: 'currentLocation', label: 'Current Location' },
      { name: 'equipmentType', label: 'Equipment Type' },
      { name: 'commitment', label: 'Commitment' },
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
    private notificationService: NotificationService,
    private fb: UntypedFormBuilder,
    private store: Store<ApplicationState>,
    public dialog: MatDialog,
  ) {
    this.store.dispatch(fromActions.getAllTendererWorkEquipments({ deleted: false }));
  }

  ngOnInit(): void {
    this.workEquipments$ = this.store.pipe(select(fromSelector.selectModifiedWorkEquipments));
    this.loading$ = this.store.pipe(select(fromSelector.selectWorkEquipmentLoading));
  }

  viewMoreDetails(event: WorkEquipment) {
    this.viewType = 'view';
    this.selectedWorkEquipment = event;
    this.selectedUuid = event.uuid;
    this.viewDetailsTitle = `Work Equipment/Plant: ${event?.equipmentType} - ${event?.oem}`;
  }

  closeDetails() {
    this.viewType = 'table';
  }

}
