import {
  MustHaveFilter,
  MustHaveFilterOperation
} from "src/app/shared/components/paginated-data-table/must-have-filters.model";
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom, Subscription } from "rxjs";
import {
  GET_INVITED_PUBLISHED_ENTITIES,
  GET_MY_AWARDED_DATA,
  GET_MY_INTERESTED_SUBMISSIONS_STRING,
  GET_MY_SUBMISSION_TENDERER_DATA
} from "src/app/modules/nest-tenderer/store/submission/submission.graphql";
import { SearchOperation } from "../../../store/global-interfaces/organizationHiarachy";
import { TenderAll } from "src/app/modules/nest-tenderer/store/tenders/tenders.model";
import { GraphqlService } from "../../../services/graphql.service";
import { LayoutService } from "../../../services/layout.service";
import { PublicEntityItem } from "src/app/website/store/public-tenders-item.model";
import {
  GET_AWARD_TENDER_VIEW_FILTERED_BY_VISIBILITY_STATUS_DATA,
  GET_PUBLIC_AWARDED_ENTITIES,
  GET_PUBLIC_PUBLISHED_ENTITIES,
  GET_PUBLIC_PUBLISHED_ENTITIES_TRAINNING,
  GET_PUBLIC_PUBLISHED_FOR_NEST_ENTITIES,
  GET_PUBLISHED_ENTITIES_UN_FILTERED_BY_VISIBILITY,
  GET_UNFILTERED_PUBLIC_ENTITIES
} from "src/app/website/store/public-tenders.graphql";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  NotEligibleComponent
} from "../../../modules/nest-tenderer/tender-submission/not-eligible/not-eligible.component";
import { GET_TENDERER_BUSINESS_LINES } from "../../../modules/nest-uaa/store/user-management/user/user.graphql";
import { fadeIn, fadeInOut, fadeSmooth } from "../../animations/router-animation";
import { AttachmentService } from "../../../services/attachment.service";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../../store";
import { ItemsSortFilterComponent, ItemsSortOption } from "../items-sort-filter/items-sort-filter.component";
import { PaginatorInput } from "src/app/website/shared/models/web-paginator.model";
import { selectModifiedAuthUsers } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { first, map } from "rxjs/operators";
import * as moment from "moment";
import { NestUtils } from "../../utils/nest.utils";
import { FieldConfig, FieldType } from "../dynamic-forms-components/field.interface";
import {
  GET_ALL_ADMINISTRATIVE_AREAS_LIGHT_FOR_FILTERING,
  GET_PUBLIC_PROCURING_ENTITY_PAGINATED_FOR_FILTERING
} from "./store/advanced-search-store.graph";
import { ProcuringEntityPublic, RegionModel } from "./store/advanced-search-store.model";
import { NestGuideVideoComponent } from "src/app/page/nest-guide-video/nest-guide-video.component";
import { SettingsService } from "../../../services/settings.service";
import { NotificationService } from "../../../services/notification.service";
import { subCategory } from "./store/constants";
import { AuthUser } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { TranslatePipe } from "../../pipes/translate.pipe";
import {
  AdvancedTenderSearchTenderItemComponent
} from "./advanced-tender-search-tender-item/advanced-tender-search-tender-item.component";
import { LoaderComponent } from "../loader/loader.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { PaginatedSelectComponent } from "../dynamic-forms-components/paginated-select/paginated-select.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  FrontendPaginatorComponent
} from "../../../website/shared/components/frontend-paginator/frontend-paginator.component";
import { NgClass, NgFor, NgTemplateOutlet, ViewportScroller } from "@angular/common";
import { SelectComponent } from "../dynamic-forms-components/select/select.component";
import { ApolloNamespace } from "../../../apollo.config";
import { environment } from "../../../../environments/environment";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SelectFinancialYearComponent } from "../select-financial-year/select-financial-year.component";
import { GET_THREE_RECENT_FINANCIAL_YEARS } from "src/app/modules/nest-reports/store/reports/reports.graphql";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";

interface SortFields {
  isSearchable?: boolean;
  isSortable?: boolean;
  operation?: SearchOperation;
  orderDirection?: 'ASC' | 'DESC';
  fieldName?: string;
  searchValue?: string;
  searchValue2?: string;
}

interface SubmissionMasterFilter {
  tabTitle: string;
  tabCode: string;
  tabFilter: string;
  description: string;
}

@Component({
  selector: 'app-advanced-tender-search',
  templateUrl: './advanced-tender-search.component.html',
  styleUrls: ['./advanced-tender-search.component.scss'],
  animations: [fadeIn, fadeInOut, fadeSmooth],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FrontendPaginatorComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    PaginatedSelectComponent,
    MatIconModule,
    MatDatepickerModule,
    ItemsSortFilterComponent,
    LoaderComponent,
    AdvancedTenderSearchTenderItemComponent,
    NgClass,
    SelectFinancialYearComponent,
    NgFor,
    TranslatePipe,
    SelectComponent,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
  ],
})
export class AdvancedTenderSearchComponent implements OnInit, OnDestroy {
  @Input() from: string = 'tenderer';
  @Output() setTitle: EventEmitter<string> = new EventEmitter();
  @Output() setSubTitle: EventEmitter<string[]> = new EventEmitter();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  page = null;

  private queryParamsSubscription: Subscription;

  viewDetails: boolean = false;
  showSubmissionTabs: boolean = false;
  viewDetailsTitle = '';
  title: any;
  selectedUuid: string;
  activeTab: SubmissionMasterFilter;
  overrideActionButtons: boolean = false;
  selectedBidInterestUuid: { [uuid: string]: string } = {};
  bidInterestEntityUuids: string[] = [];
  tendersResults: PublicEntityItem[] = [];
  classEligibleObj: { [uuid: string]: boolean } = {};
  submissionFilter: 'PENDING' | 'SUBMITTED' | 'ALL' = 'ALL';
  viewType = '';
  previewDetails: boolean = false;
  tenderDetailsData: TenderAll;
  tenderViewDetailTitle: string;
  tendererUuid: string;
  tendererName: string;
  selectedTender: string;
  loading: boolean = false;
  paginating: boolean = false;
  fetchingCriteria: boolean = false;
  routeSub = Subscription.EMPTY;
  itemData: any;
  applicableCategories: string[] = [];
  applicableLineBusiness: string[] = [];
  mustHaveFilters: MustHaveFilter[] = [];
  pageMustHaveFilters: MustHaveFilter[] = [];
  subTitles: string[] = [];
  fields: SortFields[] = [];
  financialYearCode: string;
  pageMustHaveSortFields: SortFields[] = [];
  // bidInterests: BidInterest[] = [];
  showApplyBtn: boolean;
  showActionButtons: boolean = true;
  showAwardButtons: boolean = false;
  showAmount: boolean = false;
  showIntention: boolean = false;
  showAwardedTo: boolean = false;
  showAwardDate: boolean = false;
  showInvitationDate: boolean = true;
  showSubmissionDeadline: boolean = true;
  loadingFinancialYear: boolean = true;
  financialYears: any;
  showEntityNumber: boolean = true;
  allowHeaderClick: boolean = true;
  tendererType: string;
  isNestTenderer: boolean = false;
  queryParams = {};
  currentPage: number;
  first: boolean;
  totalRecords: number;
  filters = {
    search: 'ALL',
    category: 'ALL',
    procuringEntity: null,
    region: null,
    processStage: null,
    subCategory: null,
    invitationAfter: null,
    invitationBefore: null,
  };

  showAdvancedSearch: boolean = false;

  selectedPE: ProcuringEntityPublic;
  selectedRegion: RegionModel = null;

  categoryMap = {
    G: 'Goods',
    W: 'Works',
    C: 'Consultancy',
    NC: 'Non Consultancy',
  };

  paginatorInput: PaginatorInput = {
    loading: true,
  };

  sortFields: any[] = [];
  pageSize: number = 10;
  pageNumber: number = 1;

  sortOptions: ItemsSortOption[] = [];

  processStage: string;
  tenderSubCategory: string;

  peMustHaveFilters: MustHaveFilter[] = [
    {
      fieldName: 'uuid',
      operation: 'NE',
      value1: 'eb3a2300-27c2-437f-a34e-9c77df5fa784',
    },
  ];

  peSearchField: FieldConfig;

  regionSearchField: FieldConfig = {
    type: FieldType.paginatedselect,
    query: GET_ALL_ADMINISTRATIVE_AREAS_LIGHT_FOR_FILTERING,
    apolloNamespace: ApolloNamespace.uaa,
    optionValue: 'id',
    sortField: 'areaName',
    dynamicPipes: [],
    optionName: 'displayName',
    searchFields: ['areaName'],
    label: 'Select Region',
    selectorOptionLabel: 'All Regions',
    key: 'selectedRegion',
    mapFunction: (item) => {
      return {
        ...{
          id: 'ALL',
          uuid: 'ALL',
          areaName: 'All ',
        },
        ...item,
        displayName: `${item.areaName}`,
      };
    },
    pageSize: 10,
    validations: [],
    mustHaveFilters: [
      {
        fieldName: 'administrativeAreasType',
        operation: 'EQ',
        value1: 'Region',
      },
      {
        fieldName: 'areaName',
        operation: 'NE',
        value1: 'DAR ES SALAAM',
      },
    ],
  };

  subCategories: string[] = [];

  pageSizeOptions = [10, 25, 50];
  pageDisplayCount: number = 0;

  submissionMasterFilterList: SubmissionMasterFilter[] = [
    {
      tabCode: 'SUBMISSION_ON_PROGRESS',
      tabFilter: 'SUBMISSION_ON_PROGRESS',
      tabTitle: 'SUBMISSION_ON_PROGRESS',
      description: 'SUBMISSION_ON_PROGRESS_DESCRIPTION',
    },
    {
      tabCode: 'SUBMISSION_MODIFICATION',
      tabFilter: 'SUBMISSION_MODIFICATION',
      tabTitle: 'SUBMISSION_MODIFICATION',
      description: 'SUBMISSION_MODIFICATION_DESCRIPTION',
    },
    {
      tabCode: 'SUBMISSION_WITHDRAWN',
      tabFilter: 'SUBMISSION_WITHDRAWN',
      tabTitle: 'SUBMISSION_WITHDRAWN',
      description: 'SUBMISSION_WITHDRAWN_DESCRIPTION',
    },
    {
      tabCode: 'SUBMISSION_SUBMITTED',
      tabFilter: 'SUBMISSION_SUBMITTED',
      tabTitle: 'SUBMISSION_SUBMITTED',
      description: 'SUBMISSION_SUBMITTED_DESCRIPTION',
    },
  ];
  loadingBusinessLines = false;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
    public dialog: MatDialog,
    private notEligibleDialog: MatDialog,
    private settingsService: SettingsService,
    private store: Store<ApplicationState>,
    private attachmentService: AttachmentService,
    private apollo: GraphqlService,
    private viewportScroller: ViewportScroller,
    private notificationService: NotificationService
  ) {
    this.title = 'Published Tenders';
  }

  ngOnInit(): void {
    this.queryParamsSubscription = this.activeRoute.queryParams.subscribe(
      async (params) => {
        /** check if query params is not submission */
        if (
          params &&
          params['action'] !== undefined &&
          params['action'] == 'submission'
        ) {
          return;
        }

        this.setQueryParamToFilterInputs(params, 'category', 'category');
        this.setQueryParamToFilterInputs(params, 'search', 'search');
        this.setQueryParamToFilterInputs(params, 'peUuid', 'procuringEntity');

        this.tendersResults = [];

        /** Get url path segments and check page path */
        const segments = this.activeRoute.snapshot.url.map(
          (segment) => segment.path
        );
        this.page = segments[segments.length - 1];

        /** get page details */
        //this.getAuthUser().then((_) => this.getPage());
        this.getPage().then();

        /** set filter category to all if its null*/
        if (!this.filters.category) {
          this.filters.category = 'ALL';
        }

        /** after getting page details emit to title */
        this.setTitle.emit(this.title);
      }
    );

    this.getPEFields();
    if (this.page == 'opened-tenders') {
      this.getFinancialYears();
    }

  }

  async getFinancialYears() {
    try {
      this.loadingFinancialYear = true;
      const finaResults: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_THREE_RECENT_FINANCIAL_YEARS
      });

      this.financialYears = finaResults?.data?.getThreeRecentFinancialYears?.dataList;
      if (this.financialYears?.length > 0) {
        this.financialYearCode = this.financialYears[1]?.code;
        let financialYear = {
          value: this.financialYearCode,
        }
        this.selectedFinancialYear(financialYear);
      }
      this.loadingFinancialYear = false;

    } catch (e) {
      console.error(e);
      this.loadingFinancialYear = false;
    }
  }


  selectedFinancialYear(financialYear: any) {
    this.financialYearCode = financialYear.value;
    this.getEntities();
  }


  getPEFields() {
    this.peSearchField = {
      type: FieldType.paginatedselect,
      query: GET_PUBLIC_PROCURING_ENTITY_PAGINATED_FOR_FILTERING,
      apolloNamespace: ApolloNamespace.uaa,
      optionValue: 'uuid',
      sortField: 'name',
      dynamicPipes: [],
      optionName: 'displayName',
      searchFields: ['name', 'acronym'],
      label: 'Procuring Entity',
      key: 'selectedProcuringEntity',
      mapFunction: (item) => {
        return {
          ...item,
          displayName: `${item.name} (${item.acronym})`,
        };
      },

      pageSize: 10,
      validations: [],
      mustHaveFilters: this.peMustHaveFilters,

      // Add a filter step to exclude null items
    };
  }

  setQueryParamToFilterInputs(
    params: any,
    paramName: string,
    inputName: string
  ) {
    this.filters[inputName] =
      params && params[paramName] !== undefined ? params[paramName] : null;
  }

  async getAuthUser() {
    return;
  }

  onSortOptionChange(option: ItemsSortOption) {
    this.setSortOptionChange(option);
    this.getItems();
  }

  onPageNumberChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getItems();
  }

  onPageSizeChange(pageSize: number) {
    this.pageNumber = 1;
    this.pageSize = pageSize;
    this.getItems();
  }

  onYoutubeClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '640';
    dialogConfig.height = '450';
    dialogConfig.minWidth = '640px';
    dialogConfig.minHeight = '450px';
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = { videoId: 'JnGUtXLckow' };
    const dialogRef = this.dialog.open(NestGuideVideoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((_) => {
      this.notificationService.successSnackbar(
        'Whenever you are unsure, watch the guide video.'
      );
    });
  }

  getItems() {
    this.tendersResults = [];
    /// set title
    if (
      this.page == 'submitted-tenders' ||
      this.page == 'pending-submission' ||
      this.page == 'my-awarded-tenders' ||
      this.page == 'my-unsuccessfully-tenders' ||
      this.page == 'notice-of-intention-tenders' ||
      this.page == 'invited-tenders'
    ) {
      // if (this.page == 'submitted-tenders') {
      //   this.showSubmissionTabs = true;
      //   const activeTab = this.submissionMasterFilterList.find( item => item.tabCode = 'SUBMISSION_ON_PROGRESS');
      //   this.setActiveTabCode(activeTab);
      // }

      /** fetch only on progress tenders that tenderer has shown interest to bid */
      this.getMyTenderSubmissions().then();

      if (this.page == 'invited-tenders') {
        this.setTitle.emit('Current invited tenders');
      }
    } else {
      /** fetch all tenders based on filter */
      this.getEntities().then();
    }
  }

  ngAfterViewInit(): void {
    this.getItems();
  }

  setSortOptionChange(option: ItemsSortOption) {
    this.removeSortFields(this.sortOptions.map((option) => option.fieldName));
    this.setSortField(option.fieldName, option.orderDirection);
    this.resetPagination();
  }

  setSortField(fieldName: string, orderDirection: 'ASC' | 'DESC') {
    const filter = {
      fieldName: fieldName,
      isSortable: true,
      orderDirection: orderDirection,
    };

    this.sortFields = this.sortFields.filter(
      (filterField) =>
        !this.sortOptions.some(
          (sortOption) => sortOption.fieldName === filterField.fieldName
        )
    );
    this.sortFields.push(filter);
  }

  removeSortFields(fieldNames: string[]) {
    this.sortFields = this.sortFields.filter(
      (filterField) =>
        !fieldNames.some((fieldName) => fieldName === filterField.fieldName)
    );
  }

  resetPagination() {
    this.tendersResults = [];
    this.pageNumber = 1;
    this.paginatorInput = {
      loading: true,
    };
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  setMustHaveFilter(
    fieldName: string,
    operation: MustHaveFilterOperation,
    value1: string,
    inValues: string[] = null,
    value2: string = null
  ) {
    if (!(value1 || inValues)) {
      return;
    }
    this.pageMustHaveFilters = this.pageMustHaveFilters.filter(
      (filter) => filter.fieldName !== fieldName
    );

    let filter: MustHaveFilter = {
      fieldName,
      operation,
      inValues,
      value1,
      value2,
    };

    if (inValues == null) {
      delete filter?.inValues;
    }

    if (value1 == null) {
      delete filter?.value1;
    }

    if (value2 == null) {
      delete filter?.value2;
    }

    this.pageMustHaveFilters.push(filter);
  }

  setSortOptions() {
    switch (this.page) {
      case 'awarded-tenders':
        this.sortOptions = [
          {
            label: 'Award Date (Newest First)',
            fieldName: 'createdAt',
            orderDirection: 'DESC',
          },
          {
            label: 'Award Date (Old First)',
            fieldName: 'createdAt',
            orderDirection: 'ASC',
          },
          {
            label: 'Awarded Amount (Highest First)',
            fieldName: 'tzAmount',
            orderDirection: 'DESC',
          },
          {
            label: 'Awarded Amount (Lowest First)',
            fieldName: 'tzAmount',
            orderDirection: 'ASC',
          },
        ];
        break;
      default:
        this.sortOptions = [
          {
            label: 'Invitation Date (New First)',
            fieldName: 'invitationDate',
            orderDirection: 'DESC',
          },
          {
            label: 'Invitation Date (Old First)',
            fieldName: 'invitationDate',
            orderDirection: 'ASC',
          },
          {
            label: 'Submission Deadline (Earliest First)',
            fieldName: 'submissionOrOpeningDate',
            orderDirection: 'ASC',
          },
          {
            label: 'Submission Deadline (Latest First)',
            fieldName: 'submissionOrOpeningDate',
            orderDirection: 'DESC',
          },
        ];
    }

    this.setSortOptionChange(this.sortOptions[0]);
  }

  async getPage() {
    this.setSortOptions();
    switch (this.page) {
      case 'opened-tenders':
        this.title = 'Opened Tenders';
        this.setMustHaveFilter(
          'procuringEntityUuid',
          'NE',
          'eb3a2300-27c2-437f-a34e-9c77df5fa784'
        );

        this.setMustHaveFilter('entityStatus', 'IN', null, [
          'OPENED',
          'EVALUATION_COMPLETED',
          'EVALUATION_PRE_COMPLETED',
          'EVALUATION_STARTED',
          'NEGOTIATION_STARTED',
          'NEGOTIATION_COMPLETED',
          'INTENTION_TO_AWARD',
          'INTENTION_STARTED',
          'CONTRACT_CREATION',
          'CONTRACT_CREATED',
          'AWARDED',
          'INTENTION_TO_AWARD',
        ]);
        break;
      case 'all-awarded-tenders':
      case 'awarded-tenders':
        this.showActionButtons = false;
        this.showAmount = true;
        this.showAwardDate = true;
        this.showAwardedTo = true;
        this.showInvitationDate = false;
        this.showSubmissionDeadline = false;
        this.allowHeaderClick = false;

        this.title = 'All Awarded Tenders';
        //this.setMustHaveFilter('entityStatus', 'IN', null, ['AWARDED']);
        break;
      case 'tenders-closing-today':
        this.title = 'Tenders Closing Today';
        this.setMustHaveFilter('entityStatus', 'IN', null, ['PUBLISHED']);
        this.setMustHaveFilter(
          'submissionOrOpeningDate',
          'BTN',
          moment().format('YYYY-MM-DDT00:00'),
          null,
          moment().format('YYYY-MM-DDT23:59')
        );
        break;

      case 'my-awarded-tenders':
        this.title = 'My Awarded Tenders';
        this.showActionButtons = false;
        this.showAwardButtons = true;
        this.showAmount = false;
        // this.showAwardDate = true;
        this.showAwardedTo = true;
        this.showInvitationDate = false;
        this.showSubmissionDeadline = false;
        this.allowHeaderClick = false;
        this.setMustHaveFilter('isWinner', 'EQ', 'true');
        this.setMustHaveFilter('signedAwardDocumentUuid', 'NE', 'null');
        this.setMustHaveFilter('isAwardDocumentSigned', 'EQ', 'true');
        break;
      case 'my-unsuccessfully-tenders':
        this.title = 'My Unsuccessful Tenders';
        this.showActionButtons = false;
        this.showAwardButtons = true;
        this.showAmount = false;
        this.showIntention = true;
        // this.showAwardDate = true;
        this.showAwardedTo = true;
        this.showInvitationDate = false;
        this.showSubmissionDeadline = false;
        this.allowHeaderClick = false;
        this.setMustHaveFilter('isWinner', 'EQ', 'false');
        this.setMustHaveFilter('awardDocumentUuid', 'NE', 'null');
        this.setMustHaveFilter('isAwardDocumentSigned', 'EQ', 'true');
        break;

      case 'notice-of-intention-tenders':
        this.title = 'My Unsuccessful Tenders';
        this.showActionButtons = false;
        this.showAwardButtons = true;
        this.showAmount = false;
        this.showIntention = true;
        // this.showAwardDate = true;
        this.showAwardedTo = true;
        this.showInvitationDate = false;
        this.showSubmissionDeadline = false;
        this.allowHeaderClick = false;
        this.setMustHaveFilter('isWinner', 'EQ', 'true');
        this.setMustHaveFilter('awardDocumentUuid', 'NE', 'null');
        this.setMustHaveFilter('isAwardDocumentSigned', 'EQ', 'true');
        break;

      case 'submission':
        this.title = 'Published Tenders';
        this.setMustHaveFilter('entityStatus', 'IN', null, ['PUBLISHED']);
        this.showApplyBtn = true;
        await this.getMyInterestedSubmissions();
        await this.getTendererBusinessLines();
        break;

      case 'invited-tenders':
        this.title = 'Current Invited Tenders';
        this.setMustHaveFilter('entityStatus', 'IN', null, ['PUBLISHED']);
        this.showApplyBtn = true;
        await this.getMyInterestedSubmissions();
        await this.getTendererBusinessLines();
        break;

      case 'submitted-tenders':
        this.title = 'Submitted Tenders';
        this.setMustHaveFilter('entityStatus', 'IN', null, ['PUBLISHED']);
        this.showApplyBtn = true;
        this.submissionFilter = 'SUBMITTED';
        break;

      case 'pending-submission':
        this.title = 'On progress Tenders';
        this.setMustHaveFilter('entityStatus', 'IN', null, ['PUBLISHED']);
        this.showApplyBtn = true;
        this.submissionFilter = 'PENDING';
        break;

      default:
        this.title = 'Published Tenders';
        this.setMustHaveFilter('entityStatus', 'IN', null, ['PUBLISHED']);
        this.setSortField('invitationDate', 'DESC');
        break;
    }
  }

  removeMustHaveFilter(fieldName: string) {
    this.pageMustHaveFilters = this.pageMustHaveFilters.filter(
      (filter) => filter.fieldName !== fieldName
    );
  }

  onPeSelected(event: any) {
    this.selectedPE = { ...event.object };
    if (this.selectedPE) {
      this.setInputFilter(
        'procuringEntity',
        'procuringEntityUuid',
        this.selectedPE.uuid,
        `Procurement Entity "${this.selectedPE.name}"`
      );
    }
  }

  regionSelected(event: any) {
    this.selectedRegion = { ...event.object };
    if (this.filters.region) {
      const regionId = `${this.filters.region}`;
      this.peMustHaveFilters = [];
      this.peMustHaveFilters.push(
        {
          fieldName: 'uuid',
          operation: 'NE',
          value1: 'eb3a2300-27c2-437f-a34e-9c77df5fa784',
        },
        {
          fieldName: 'region.id',
          operation: 'EQ',
          value1: this.filters.region ? regionId : null,
        }
      );
      this.peSearchField = null;
      setTimeout(() => {
        this.getPEFields();
      }, 5);
    }
  }

  generateFilterOptions() {
    this.fields = [];
    this.subTitles = [];
    this.mustHaveFilters = [];

    let peFilter: any = null;

    if (this.filters.procuringEntity) {
      peFilter = {
        uuid: this.filters.procuringEntity,
      };
    }

    if (this.selectedPE?.uuid) {
      peFilter = { ...this.selectedPE };
    }

    if (this.filters.processStage) {
      this.setMustHaveFilter('entityType', 'EQ', this.filters.processStage);
    } else {
      this.removeMustHaveFilter('entityType');
    }

    if (this.filters.subCategory) {
      this.setMustHaveFilter(
        'entitySubCategoryName',
        'EQ',
        this.filters.subCategory
      );
    } else {
      this.removeMustHaveFilter('entitySubCategoryName');
    }

    if (this.filters.invitationAfter && this.filters.invitationBefore) {
      this.setMustHaveFilter(
        'invitationDate',
        'BTN',
        this.filters.invitationAfter.toISOString().split('T')[0],
        [],
        this.filters.invitationBefore.toISOString().split('T')[0]
      );
    } else {
      this.removeMustHaveFilter('invitationDate');
    }

    if (this.filters.invitationAfter && !this.filters.invitationBefore) {
      this.setMustHaveFilter(
        'invitationDate',
        'GTE',
        this.filters.invitationBefore.toISOString().split('T')[0]
      );
    } else {
      this.removeMustHaveFilter('invitationDate');
    }

    if (this.filters.invitationBefore && !this.filters.invitationAfter) {
      this.setMustHaveFilter(
        'invitationDate',
        'LTE',
        this.filters.invitationBefore.toISOString().split('T')[0]
      );
    } else {
      this.removeMustHaveFilter('invitationDate');
    }

    if (this.filters.category != 'ALL') {
      if (this.page == 'awarded-tenders') {
        this.setInputFilter(
          'category',
          'procurementCategoryName',
          this.categoryMap[this.filters.category],
          `Procurement Category "${this.categoryMap[this.filters.category]}"`
        );
      } else {
        this.setInputFilter(
          'category',
          'entityCategoryAcronym',
          this.filters.category,
          `Procurement Category "${this.categoryMap[this.filters.category]}"`
        );
      }
    } else {
      this.removeMustHaveFilter('entityCategoryAcronym');
    }

    this.setInputFilter(
      'procuringEntity',
      'procuringEntityUuid',
      peFilter?.uuid
    );
    this.applyKeywordSearchFields();

    if (this.subTitles.length) {
      this.setSubTitle.emit(this.subTitles);
    }

    this.mustHaveFilters = [
      ...this.mustHaveFilters,
      ...this.pageMustHaveFilters,
    ];

    this.fields = [...this.fields, ...this.pageMustHaveSortFields];
  }

  setInputFilter(
    filterName: string,
    filterMustHaveFieldName: string,
    filterValue: string,
    subTitle: string = null
  ) {
    if (
      this.page == 'opened-tenders' &&
      filterMustHaveFieldName == 'procuringEntityUuid'
    ) {
      if (this.selectedPE && this.selectedPE.uuid) {
        this.removeMustHaveFilter(filterMustHaveFieldName);
        this.setMustHaveFilter(filterMustHaveFieldName, 'EQ', filterValue);
      }
    } else {
      this.removeMustHaveFilter(filterMustHaveFieldName);
      this.setMustHaveFilter(filterMustHaveFieldName, 'EQ', filterValue);
      if (this.filters[filterName]) {
        if (subTitle) {
          this.subTitles.push(subTitle);
        }

        this.setMustHaveFilter(filterMustHaveFieldName, 'EQ', filterValue);
      }
    }
  }

  applyKeywordSearchFields() {
    this.resetSearchFields();
    let input = this.filters?.search?.trim();
    if (!input) return;
    this.subTitles.push(`Search text "${input}"`);

    this.setSearchQueryField('entityNumber', input);
    this.setSearchQueryField('procuringEntityName', input);

    if (this.page == 'awarded-tenders') {
      this.setSearchQueryField('entityDescription', input);
      this.setSearchQueryField('tendererName', input);
    } else if (this.page == 'submitted-tenders') {
      this.setSearchQueryField('descriptionOfTheProcurement', input);
      this.setSearchQueryField('entitySubCategoryName', input);
      this.setSearchQueryField('entityType', input);
      this.setSearchQueryField('procurementCategoryName', input);
    } else {
      this.setSearchQueryField('descriptionOfTheProcurement', input);
      this.setSearchQueryField('entitySubCategoryName', input);
      this.setSearchQueryField('entityType', input);
      this.setSearchQueryField('financialYearCode', input);
      this.setSearchQueryField('procurementCategoryName', input);
    }
  }

  resetSearchFields() {
    this.removeSortFields([
      'entityNumber',
      'tendererName',
      'entityDescription',
      'descriptionOfTheProcurement',
      'procuringEntityName',
      'entitySubCategoryName',
      'entityType',
      'financialYearCode',
      'procurementCategoryName',
    ]);
  }

  setSearchQueryField(fieldName: string, value: string) {
    const filter = {
      fieldName: fieldName,
      operation: SearchOperation.LK,
      isSearchable: true,
      searchValue: value,
    };

    this.sortFields = this.sortFields.filter(
      (filterField) => filterField.fieldName !== fieldName
    );
    this.sortFields.push(filter);
  }

  onAdd() {
    this.layoutService.openPanel({ action: 'view' });
    this.viewDetailsTitle = 'View Details';
  }

  closeDetails() {
    this.layoutService.closePanel();
    this.viewDetails = false;
    this.title = 'Published tenders';
  }

  viewTenderDetails(requisition: any) {
    this.tenderViewDetailTitle =
      requisition.descriptionOfTheProcurement +
      ' - ' +
      requisition.tenderNumber;
    this.previewDetails = true;
    this.tenderDetailsData = requisition;
  }

  async getMyInterestedSubmissions() {
    this.loading = true;
    try {
      let response: any = await this.apollo.fetchData({
        query: GET_MY_INTERESTED_SUBMISSIONS_STRING,
        apolloNamespace: ApolloNamespace.submission,
      });

      if (response.data.getMyInterestedSubmissions) {
        const result: {
          entityUuid: string;
          mainSubmissionUuid: string;
        }[] = response.data.getMyInterestedSubmissions?.dataList || [];

        this.bidInterestEntityUuids = result.map((item) => item.entityUuid);

        result.forEach((item) => {
          this.selectedBidInterestUuid[item.entityUuid] =
            item.mainSubmissionUuid;
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getMyTenderSubmissions() {
    try {
      this.generateFilterOptions();

      /** later to be able to control based on entity status
       *  - removed this since submissions do not need entity status for now */
      this.mustHaveFilters = this.mustHaveFilters.filter((item) => {
        return (
          item.fieldName !== 'entityStatus' &&
          item.fieldName !== 'financialYearCode'
        );
      });

      let query = GET_MY_SUBMISSION_TENDERER_DATA;
      let apolloNameSpace = ApolloNamespace.submission
      if (this.page == 'invited-tenders') {
        this.overrideActionButtons = false;
        query = GET_INVITED_PUBLISHED_ENTITIES;
        apolloNameSpace = ApolloNamespace.app
      } else if (this.page == 'my-awarded-tenders') {
        this.overrideActionButtons = true;
        query = GET_MY_AWARDED_DATA;
        apolloNameSpace = ApolloNamespace.submission
      } else if (
        this.page == 'my-unsuccessfully-tenders' ||
        this.page == 'notice-of-intention-tenders'
      ) {
        this.overrideActionButtons = true;
        query = GET_MY_AWARDED_DATA;
        apolloNameSpace = ApolloNamespace.submission
      } else {
        this.overrideActionButtons = true;
      }
      this.loading = true;
      let response: any = await this.apollo.fetchData({
        query: query,
        apolloNamespace: apolloNameSpace,
        variables: {
          input: {
            page: this.pageNumber,
            pageSize: this.pageSize,
            mustHaveFilters: this.mustHaveFilters,
            fields: this.sortFields,
          },
        },
      });
      let responseData;

      if (this.page == 'invited-tenders') {
        responseData = response.data.getInvitedPublishedEntities;
      } else if (this.page == 'my-awarded-tenders') {
        responseData = response.data.getSTendererSubmissions;
      } else if (
        this.page == 'my-unsuccessfully-tenders' ||
        this.page == 'notice-of-intention-tenders'
      ) {
        responseData = response.data.getSTendererSubmissions;
      } else {
        responseData = response.data.getMyOwnSubmissions;
      }

      this.paginatorInput = {
        loading: false,
        first: responseData?.first ?? false,
        last: responseData?.last ?? false,
        hasNext: responseData?.hasNext,
        hasPrevious: responseData?.hasPrevious,
        currentPage: responseData?.currentPage,
        numberOfRecords: responseData?.numberOfRecords,
        pageSize: responseData?.pageSize,
        totalPages: responseData?.totalPages,
        totalRecords: responseData?.totalRecords,
        recordsFilteredCount: responseData?.recordsFilteredCount,
      };

      const returnedData = responseData?.data;

      if (responseData?.data) {
        this.currentPage = responseData?.currentPage;
        this.first = responseData?.first;
        this.totalRecords = responseData?.recordsFilteredCount;
        this.tendersResults = returnedData;

        if (this.tendersResults.length) {
          this.tendersResults = this.tendersResults.map((item) => {
            return {
              ...item,
              isTendererEligible:
                !item.eligibleTypes ||
                item.eligibleTypes
                  ?.replace(/\s+/g, '')
                  ?.split(',')
                  ?.includes(this.tendererType?.replace(/\s+/g, '')),
            };
          });
          const uuidList = [];
          this.tendersResults.forEach((result) => {
            if (!uuidList.includes(result.procuringEntityUuid)) {
              uuidList.push(result.procuringEntityUuid);
            }
          });
          await this.fetchAttachments(uuidList);
        }
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  async getQuery() {
    let query: any;

    if (this.from == 'tenderer') {
      const user$ = this.store.pipe(
        select(selectModifiedAuthUsers),
        map((users) => users[0])
      );
      const user: AuthUser = await firstValueFrom(
        user$.pipe(first((i) => !!i))
      );
      this.isNestTenderer = user?.tenderer?.isForNest ?? false;
      this.tendererType = user?.tenderer?.tendererType;
    }

    switch (this.page) {
      case 'opened-tenders':
        query = {
          query: GET_PUBLISHED_ENTITIES_UN_FILTERED_BY_VISIBILITY, //GET_UNFILTERED_PUBLIC_ENTITIES, 
          apolloNamespace: ApolloNamespace.app
        }
        break;
      case 'awarded-tenders':
        query = {
          query: GET_AWARD_TENDER_VIEW_FILTERED_BY_VISIBILITY_STATUS_DATA, //GET_PUBLIC_AWARDED_ENTITIES,
          apolloNamespace: ApolloNamespace.submission
        }
        break;
      case 'published-tenders':
      default:
        query = {
          query: this.isNestTenderer ? GET_PUBLIC_PUBLISHED_FOR_NEST_ENTITIES : environment.production == false ? GET_PUBLIC_PUBLISHED_ENTITIES_TRAINNING : GET_PUBLIC_PUBLISHED_ENTITIES,
          apolloNamespace: ApolloNamespace.app
        }
        break;
    }

    return query;
  }

  async getEntities() {
    this.generateFilterOptions();
    this.loading = true;

    try {
      this.sortFields = [...this.sortFields, ...this.fields];

      let getQuery = await this.getQuery();

      let response: any = await this.apollo.fetchData({
        query: getQuery?.query,
        apolloNamespace: getQuery?.apolloNamespace,
        variables: {
          input: {
            page: this.pageNumber,
            pageSize: this.pageSize,
            fields: this.sortFields,
            mustHaveFilters: this.page == 'opened-tenders' && this.financialYearCode ?
              [
                ...this.mustHaveFilters,
                {
                  fieldName: 'financialYearCode',
                  operation: 'EQ',
                  value1: this.financialYearCode,
                },
              ] : this.mustHaveFilters,
          },
        },
      });

      this.loading = false;

      const results = response.data.items;
      this.paginatorInput = {
        loading: false,
        first: results?.first ?? false,
        last: results?.last ?? false,
        hasNext: results?.hasNext,
        hasPrevious: results?.hasPrevious,
        currentPage: results?.currentPage,
        numberOfRecords: results?.numberOfRecords,
        pageSize: results?.pageSize,
        totalPages: results?.totalPages,
        totalRecords: results?.totalRecords,
        recordsFilteredCount: results?.recordsFilteredCount,
      };

      if (results?.rows) {
        let items: any[] = results.rows;
        if (
          (this.page == 'submitted-tenders' ||
            this.page == 'invited-tenders' ||
            this.page == 'pending-submission') &&
          this.bidInterestEntityUuids.length > 0
        ) {
          items = items.filter((item: PublicEntityItem) =>
            this.bidInterestEntityUuids.includes(item.uuid)
          );
        }
        this.tendersResults = items.map((item) => {
          return {
            ...item,
            isTendererEligible:
              !item.eligibleTypes ||
              item.eligibleTypes
                ?.replace(/\s+/g, '')
                ?.split(',')
                ?.includes(this.tendererType?.replace(/\s+/g, '')),
          };
        });

        if (this.tendersResults.length) {
          const uuidList = [];
          this.tendersResults.forEach((result) => {
            if (!uuidList.includes(result.procuringEntityUuid)) {
              uuidList.push(result.procuringEntityUuid);
            }
          });
          this.fetchAttachments(uuidList).then();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async fetchAttachments(uuidList: string[]) {
    uuidList = uuidList.filter((uuid) => uuid !== null);
    this.attachmentService.fetchPELogoBulk(uuidList).then();
  }

  // async getTenderClarificationByUuid(uuid) {
  //   try {
  //     const result: any = await this.apollo.fetchData({
  //       query: GET_TENDER_CLARIFICATION_DEADLINE_BY_UUID,
  //       variables: {
  //         procurementRequisitionUuid: uuid,
  //       },
  //     });
  //     return result.data?.getClarificationDeadline?.data ?? 'N/A';
  //   } catch (e) {
  //     return 'N/A';
  //   }
  // }

  tendererNotEligible(requisition: PublicEntityItem) {
    const config = new MatDialogConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      tendererType: this.tendererType,
      eligibleTypes: requisition.eligibleTypes,
      myCategory: this.applicableCategories,
      myBusinessLine: this.applicableLineBusiness,
      tenderCategory: requisition?.procurementCategoryName,
    };
    config.panelClass = ['bottom__sheet'];
    this.notEligibleDialog.open(NotEligibleComponent, config).afterClosed();
  }

  async getTendererBusinessLines() {
    try {
      this.loadingBusinessLines = true;
      let response: any = await this.apollo.fetchData({
        query: GET_TENDERER_BUSINESS_LINES,
        apolloNamespace: ApolloNamespace.uaa,
      });
      this.loadingBusinessLines = false;

      const data = response.data?.getTendererBusinessLines?.data;
      let entitiesEligibleForClassCheck = [];
      this.tendersResults.forEach((i) => {
        let entity = i;
        this.classEligibleObj[entity.entityUuid] = true;

        if (entity.procurementCategoryAcronym == 'W') {
          this.classEligibleObj[entity.entityUuid] = false;
          entitiesEligibleForClassCheck.push(entity);
        }
      });
      if (data && data.tenderer) {
        data.tenderer?.tendererBusinessLineList?.forEach((item) => {
          const businessLineName: string = item?.businessLine?.name;
          const tenderCategoryName: string =
            item?.businessLine?.tenderCategory?.name;
          const checkExist: boolean =
            this.applicableCategories.includes(tenderCategoryName);
          if (item.approvalStatus == 'APPROVED') {
            entitiesEligibleForClassCheck.forEach((i) => {
              if (!this.classEligibleObj[i.entityUuid]) {
                this.classEligibleObj[i.entityUuid] = (
                  item?.tendererCertificateList || []
                ).some((cert) => i.contractorClasses?.includes(cert.className));
              }
            });
          }
          if (!checkExist) {
            if (item.approvalStatus == 'APPROVED') {
              this.applicableCategories.push(tenderCategoryName);
              this.applicableLineBusiness.push(businessLineName);
            }

            if (item.approvalStatus == 'EXPIRED') {
              item?.tendererCertificateList.forEach((certificate) => {
                if (
                  !certificate.description?.includes('Contractors') &&
                  !certificate.description?.includes('ARCHITECTS') &&
                  !certificate.description?.includes('ENGINEERS')
                ) {
                  const inputDateStr = certificate?.expiryDate;
                  const inputDate = new Date(inputDateStr);
                  inputDate.setDate(inputDate.getDate() + 14);
                  const currentDate = new Date();
                  // const updatedDateStrs = inputDate?.toISOString().slice(0, 10);

                  if (inputDate.toDateString() >= currentDate.toDateString()) {
                    this.applicableCategories.push(tenderCategoryName);
                    this.applicableLineBusiness.push(businessLineName);
                  }
                }
              });
            }
          }
        });
      }
    } catch (e) {
      this.loadingBusinessLines = false;

      console.error(e);
    }
  }

  // bottomReached(): boolean {
  //   const scrollContainer = this.scrollContainer.nativeElement;
  //   const scrollHeight = scrollContainer.scrollHeight;
  //   const scrollTop = scrollContainer.scrollTop;
  //   const clientHeight = scrollContainer.clientHeight;
  //   return scrollHeight === scrollTop + clientHeight;
  // }

  // categorySelected(value) {
  //   /** if selected option is all reset other inputs */
  //   if (value.includes('ALL')) {
  //     if (this.categoriesArray.includes('ALL')) {
  //       /// check if it exists in previous data
  //       this.categoriesArray = value.filter((i) => i !== 'ALL');
  //     } else {
  //       /// if it does not exist reset values to ALL
  //       this.categoriesArray = ['ALL'];
  //     }
  //   } else {
  //     this.categoriesArray = value;
  //   }
  //
  //   this.selectedTenderCategories = this.categoriesArray;
  //
  //   this.filters.category = this.selectedTenderCategories.join('-');
  // }

  async searchByInputFilters() {
    this.resetPagination();
    this.loading = true;
    /** Get current URL segments */
    const currentUrl = this.router.url.split('?')[0];
    const segments = currentUrl.split('/');

    /** Add query parameters to URL  */
    /** check if search text is empty set it to null  */
    if (this.filters.search == '') {
      this.filters.search = null;
    }

    const queryParams = {
      category: this.filters.category == 'ALL' ? null : this.filters.category,
      peUuid: this.filters.procuringEntity,
      search: this.filters.search,
      processStage: this.filters.processStage,
      subCategory: this.filters.subCategory,
      invitationDateAfter: this.filters.invitationAfter,
      invitationDateBefore: this.filters.invitationBefore,
    };

    /** Navigate to updated URL */
    await this.router.navigate(segments, {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });

    this.getItems();
    this.closeAdvancedSearch();
  }

  getPaginatorLabel() {
    return NestUtils.getPaginationCountLabel(this.paginatorInput);
  }

  async clearSearch() {
    const currentUrl = this.router.url.split('?')[0];
    const segments = currentUrl.split('/');
    this.filters.category = null;
    this.filters.search = null;
    this.filters.processStage = null;
    this.filters.subCategory = null;
    this.filters.invitationAfter = null;
    this.filters.invitationBefore = null;
    this.selectedRegion = null;
    this.filters.region = null;
    this.filters.procuringEntity = null;
    const queryParams = {
      category: null,
      search: null,
      peUuid: null,
      procuringEntity: null,
      processStage: null,
      subCategory: null,
      invitationDateAfter: null,
      invitationDateBefore: null,
    };
    await this.router.navigate(segments, {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });

    this.getPage().then();
    this.resetPagination();
    this.getItems();
  }

  advancedSearch() {
    this.showAdvancedSearch = true;
  }

  closeAdvancedSearch() {
    this.showAdvancedSearch = false;
  }

  getSubCategories(category: string, processStage: string) {
    try {
      if (processStage == 'TENDER') {
        this.subCategories = subCategory.tendering[category];
      }

      if (processStage == 'PLANNED_TENDER') {
        this.subCategories = subCategory.preQualification[category];
      }

      if (processStage == 'FRAMEWORK') {
        this.subCategories = subCategory.frameworks[category];
      }
    } catch (e) {
      this.subCategories = [];
    }
  }

  setActiveTabCode(tab: SubmissionMasterFilter) {
    this.activeTab = tab;
  }

  handleTabChange() { }
}
