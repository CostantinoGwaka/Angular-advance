import { ObjectForEntityDetail } from 'src/app/modules/nest-app/store/tender/tender.model';
import { Observable } from 'rxjs';
import { ApplicationState } from 'src/app/store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { select, Store } from "@ngrx/store";
import { PersonnelInformation } from "../../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.model";
import { TableConfiguration } from "../../paginated-data-table/paginated-table-configuration.model";
import {
  GET_ALL_TENDERER_PERSONNEL_INFORMATION_PAGINATED,
  SUBMISSION_GET_ALL_TENDERER_PERSONNEL_INFORMATION_PAGINATED,
  SUBMISSION_GET_ALL_TENDERER_PERSONNEL_INFORMATION_PAGINATED_SUBMISSION,
  SUBMISSION_GET_ALL_TENDERER_PERSONNEL_INFORMATION_PAGINATED_SUBMISSION_FOR_NEGO
} from "../../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.graphql";
import { AuthUser } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { selectAllAuthUsers } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { MatBottomSheet, MatBottomSheetConfig } from "@angular/material/bottom-sheet";
import { PreviewCvComponent } from "../../preview-cv/preview-cv.component";
import { MustHaveFilter } from '../../paginated-data-table/must-have-filters.model';
import { SearchOperation } from 'src/app/store/global-interfaces/organizationHiarachy';
import { PaginatedDataTableComponent } from '../../paginated-data-table/paginated-data-table.component';


@Component({
  selector: 'app-personnel-profile-institution',
  templateUrl: './personnel-profile-information.component.html',
  styleUrls: ['./personnel-profile-information.component.scss'],
  standalone: true,
  imports: [PaginatedDataTableComponent]
})
export class PersonnelProfileInformationComponent implements OnInit {

  loading$: Observable<boolean>;
  loading: boolean = true;
  query = SUBMISSION_GET_ALL_TENDERER_PERSONNEL_INFORMATION_PAGINATED_SUBMISSION;
  queryForNego = SUBMISSION_GET_ALL_TENDERER_PERSONNEL_INFORMATION_PAGINATED_SUBMISSION_FOR_NEGO;
  uaaApolloNamespace = ApolloNamespace.uaa;

  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'dateOfBirth', label: 'Date of Birth' },
      { name: 'gender', label: 'Gender' },
      { name: 'jobTitle', label: 'Job Title' },
      { name: 'languageProficiency', label: 'Language Proficiency' },
      { name: 'phone', label: 'Phone #' },
      { name: 'dateOfEmploymentMod', label: 'Employment Date' },
    ],
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: false,
    useFullObject: true,
    showBorder: true,
    allowPagination: true,
    useRowClick: false,
    actionIcons: {
      edit: false,
      delete: false,
      more: true,
      print: false,
      customPrimary: true,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    customPrimaryMessage: 'View CV',
    empty_msg: 'No data found',
  };
  selectedUuid: string;
  viewDetailsTitle: string;
  selectedPersonnel: PersonnelInformation;
  @Input() viewType: string = 'table';
  @Input() tendererUuid: string;
  @Input() objectForMainEntityDetail: ObjectForEntityDetail;
  @Input() showTitle: boolean = true;
  @Input() useCheckBoxSelector: boolean = false;
  @Input() forNegotiation: boolean = false;
  @Output() itemCheckBoxSelected = new EventEmitter<boolean>();
  customMainFilters = {};
  userDetails$: Observable<AuthUser[]>;


  constructor(
    private store: Store<ApplicationState>,
    private _bottomSheet: MatBottomSheet,
  ) {
  }


  filterToUse: MustHaveFilter[] = [
    // {
    //   fieldName: 'isForJointVenture',
    //   operation: SearchOperation.EQ,
    //   value1: "false"
    // },
  ];

  ngOnInit(): void {

    if (!this.tendererUuid) {
      this.userDetails$ = this.store.pipe(select(selectAllAuthUsers));
      this.userDetails$.subscribe((res: any) => {
        this.loading = false;
        if (res[0]?.tenderer) {
          this.tendererUuid = res[0]?.tenderer.uuid;
          this.customMainFilters = {
            tendererUuid: this.tendererUuid
          };
        }
      });
    } else {
      this.customMainFilters = {
        tendererUuid: this.tendererUuid
      };
    }

    if (this.useCheckBoxSelector) {
      this.tableConfigurations.tableColumns = [
        { name: 'fullName', label: 'Full Name' },
        { name: 'jobTitle', label: 'Job Title' },
        { name: 'languageProficiency', label: 'Language Proficiency' },
        { name: 'jvcProfileSharedBy', label: 'From' },
        { name: 'dateOfEmployment', label: 'Employment Date' },
      ];

      this.tableConfigurations.actionIcons = {
        checkBox: true,
        edit: false,
        delete: false,
        more: false,
        print: false,
        customPrimary: true,
      }
    }
  }

  viewItem(event: PersonnelInformation) {
    // this.selectedPersonnel = event;
    // this.viewType = 'view';
    // this.selectedUuid = event.uuid;
    // this.viewDetailsTitle = `Personnel Information for : ${event?.fullName}`;
  }

  mapFunction(item) {
    return {
      ...item,
      fullName: `${item?.firstName} ${item?.middleName} ${item?.lastName}`,
      jvcProfileSharedBy: item.jvcProfileSharedBy?.name == null ?
        item?.tenderer?.name : item.jvcProfileSharedBy?.name,
      jvcProfileSharedByUuid: item.jvcProfileSharedBy?.uuid == null ?
        item?.tenderer?.uuid : item.jvcProfileSharedBy?.uuid,
      jvcProfileSharedAt: item.jvcProfileSharedBy?.createdAt == null ?
        null : item.jvcProfileSharedBy?.createdAt,
      jointVentureId: item.jointVenture == null ?
        null : item.jointVenture?.id,
      jointVentureUuid: item.jointVenture == null ?
        null : item.jointVenture?.uuid,
    }
  }

  itemSelected(event) {

    this.itemCheckBoxSelected.emit(event);
  }

  viewTendererCv(tenderer) {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.panelClass = ['bottom__sheet', 'w-100'];
    config.data = { tenderer: tenderer, allview: true, userPersonnelCv: true };
    this._bottomSheet.open(PreviewCvComponent, config);
  }

  closeDetails(shouldUpdate = false) {
    this.viewType = 'table';
  }


  protected readonly ApolloNamespace = ApolloNamespace;
}
