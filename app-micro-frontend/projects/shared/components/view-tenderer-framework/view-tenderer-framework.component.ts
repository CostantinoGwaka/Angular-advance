import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ObjectForEntityDetail } from 'src/app/modules/nest-app/store/tender/tender.model';
import {
  GET_MAIN_SUBMISSION_ONE_LOT_LIST,
  GET_SUBMISSION_CRITERIA_BY_SUBMISSION_UUID_MINI,
  GET_TENDERER_SUBMISSION_MINI,
  IS_MY_SUBMISSION,
} from "../../../modules/nest-tenderer/store/submission/submission.graphql";
import { GraphqlService } from "../../../services/graphql.service";
import { BidInterest, SubmissionCriteria } from "../../../modules/nest-tenderer/store/submission/submission.model";
import { EvaluationCriteriaGroup } from "../../../modules/nest-tender-evaluation/store/criteria-group/criteria-group.model";
import { GET_TEAM_SUMMARY_BY_SUBMISSION_UUID } from "../../../modules/nest-tender-evaluation/store/evaluation/evaluation.graphql";
import { NotificationService } from "../../../services/notification.service";
import { fadeIn } from "../../animations/basic-animation";
import { Router } from "@angular/router";
import { showEvaluationProgressBar } from "../percentage-progress-bar/store/evaluation-progress/evaluation-progress.actions";
import { Store } from "@ngrx/store";
import * as fromState from "../../../modules/nest-app/store/nest-app.reducer";
import { showPercentageProgressBar } from "../percentage-progress-bar/store/submission-progress/submission-progress.actions";
import { Observable, Subscription } from "rxjs";
import { AttachmentService } from "../../../services/attachment.service";
import { SettingsService } from "../../../services/settings.service";
import { map, startWith } from "rxjs/operators";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounce } from "lodash";
import { EvaluationResultByCriteriaComponent } from '../../../modules/nest-tender-evaluation/evaluation-team/evaluation-result-by-criteria/evaluation-result-by-criteria.component';
import { SubmissionCriteriaItemComponent } from '../../../modules/nest-tenderer/tender-submission/submission/submission-criteria-item/submission-criteria-item.component';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewDetailsItemComponent } from '../view-details-item/view-details-item.component';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-view-tenderer-framework',
    templateUrl: './view-tenderer-framework.component.html',
    styleUrls: ['./view-tenderer-framework.component.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [
    LoaderComponent,
    MatIconModule,
    ViewDetailsItemComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatOptionModule,
    NgTemplateOutlet,
    SubmissionCriteriaItemComponent,
    EvaluationResultByCriteriaComponent,
    AsyncPipe
],
})
export class ViewTendererFrameworkComponent implements OnInit, OnDestroy {

  @Input() submissionUuid: string;
  @Input() teamUuid: string;
  @Input() viewDetailsTitle: string;
  @Input() checkRequired: boolean = false; /** to be used when submission uuid is passed */
  @Input() selectedWinner: boolean = false; /** to be used when submission uuid is passed */
  @Input() automaticEvaluation: boolean = false; /** to be used when boolean automatically is passed */
  @Input() updateBidPrice: boolean = false; /** to be used when submission uuid is passed */
  @Input() showEvaluationDetail: boolean = false; /** to be used when submission is viewed after evaluation */
  @Input() mainSubmissionUuid: string;
  @Output() panelTitle: EventEmitter<string> = new EventEmitter<string>();
  @Output() dataCheckEmit = new EventEmitter();

  filteredOptions: Observable<{ uuid: string; name: string }[]>;
  searchFormControl = new FormControl('');
  searchItem: string = null;
  activeTabIndex: string;
  activeChildTabIndex: string;
  submission: BidInterest;
  objectForEntityDetail: ObjectForEntityDetail;
  objectForMainEntityDetail: ObjectForEntityDetail;
  evaluationCriteria: SubmissionCriteria[] = [];
  procurementCategoryAcronym: 'G' | 'C' | 'W' | 'NC';
  evaluationCriteriaGroup: EvaluationCriteriaGroup[] = [];

  /** table for evaluation details*/
  tableHeaders: string[] = [];
  tableRows: any[] = [];
  tableRowsMap: { [id: string]: any } = {};
  tableConfigurations = {
    tableColumns: [],
    tableCaption: '',
    showNumbers: false,
    tableNotifications: '',
    showSearch: false,
    useFullObject: true,
    showBorder: true,
    allowPagination: false,
    actionIcons: {
      edit: false,
      delete: false,
      more: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    customPrimaryMessage: 'Justification',
    hideExport: true,
    empty_msg: 'No data found',
  };
  // tenderFormGeneratorService$: Observable<TenderFormGeneratorChange>;
  subscriptions: Subscription[] = [];

  powerOfAttorney: {
    uuid: string,
    email: string,
    fullName: string,
    legalCapacity: string
  }

  searchOptions: any[] = [];
  loading: boolean = false;
  checking: boolean = false;


  constructor(
    private router: Router,
    private apollo: GraphqlService,
    private store: Store<fromState.State>,
    private notificationService: NotificationService,
    private attachmentService: AttachmentService,
    private settingServices: SettingsService,
    // private tenderFormGeneratorService: TenderFormGeneratorService,
  ) { }

  ngOnInit(): void {
    if (this.checkRequired) {
      this.isMySubmission(this.submissionUuid).then(_ => {
        this.fetchSubmission()
      });
    } else {
      this.fetchSubmission();
    }


    this.filteredOptions = this.searchFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );



    this.store.dispatch(
      showEvaluationProgressBar({ showEvaluationProgressBar: false })
    );

    this.store.dispatch(
      showPercentageProgressBar({ showPercentageProgressBar: false })
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  dataCheck(data) {
    this.dataCheckEmit.emit(data);
  }


  private _filter(value: string): { uuid: string, name: string }[] {
    if (this.searchOptions.length && value !== '' && typeof value !== 'object') {
      const filterValue = value.toLowerCase();
      return this.searchOptions.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    return this.searchOptions;
  }


  fetchSubmission() {
    if (!this.submissionUuid) {
      this.getTendererBidInterest().then();
    } else {
      this.getLotSubmission().then(async _ => {
        await this.fetchEvaluationCriteria();
      });
    }
  }

  async getTendererBidInterest() {
    this.loading = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_MAIN_SUBMISSION_ONE_LOT_LIST,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.mainSubmissionUuid
        }
      });

      if (response.data.getMainSubmission.code == 9000) {
        const mainSubmission = response.data.getMainSubmission.data;
        const submission = mainSubmission?.submissions[0];
        if (submission) {
          this.submissionUuid = submission.uuid;
          // await this.getLotSubmission();
          this.getLotSubmission().then(async _ => {
            await this.fetchEvaluationCriteria();
          });
        }
      }
      /// if there is an error show check bid interest again
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  async getLotSubmission() {
    this.loading = true;
    try {
      /** Fetch submission with submission criteria list */
      const response: any = await this.apollo.fetchData({
        query: GET_TENDERER_SUBMISSION_MINI,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.submissionUuid
        }
      });

      if (response.data.getSubmission.code == 9000) {
        this.submission = response.data.getSubmission.data;


        this.panelTitle.emit(
          `Showing submission of ${this.submission.tendererName} on tender # ${this.submission.entityNumber}`
        );

        /** check power of attorney */
        if (this.submission?.mainSubmission?.hasPowerOfAttorney) {
          const mainSubmission = this.submission?.mainSubmission;
          this.powerOfAttorney = {
            fullName: `${mainSubmission?.powerOfAttorneyFirstName} ${mainSubmission?.powerOfAttorneyLastName}`,
            legalCapacity: mainSubmission?.powerOfAttorneyLegalCapacity,
            uuid: mainSubmission?.powerOfAttorneyUuid,
            email: mainSubmission?.powerOfAttorneyEmail
          }
        }

        /** get category acronym */
        const entityNumberArray = this.submission.entityNumber.split('/');
        const acronym = entityNumberArray.find(item => (item == 'G' || item == 'C' || item == 'W' || item == 'NC'));
        this.procurementCategoryAcronym = acronym as 'G' | 'C' | 'W' | 'NC';

        /** set object for entity detail */
        this.objectForEntityDetail = {
          objectUuid: this.submission?.entityUuid,
          objectType: this.submission?.mainSubmission?.entityType
        }

        /** set object for main entity detail - PE requirement */
        this.objectForMainEntityDetail = {
          objectUuid: this.submission.mainEntityUuid,
          objectType: this.submission?.mainSubmission?.entityType
        }

        // this.evaluationCriteria = this.submission.submissionCriterias;
        // await this.getSubmissionReport();
        this.loading = false;
      }
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  setCriteriaGroupMap() {
    this.evaluationCriteria.sort((a, b) =>
      a.groupSortNumber - b.groupSortNumber);
  }


  async fetchEvaluationCriteria() {
    this.loading = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_SUBMISSION_CRITERIA_BY_SUBMISSION_UUID_MINI,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionUuid: this.submission.uuid
        }
      });

      if (response.data.getSubmissionCriteriaBySubmissionUuid.code == 9000) {
        this.evaluationCriteria = (response.data.getSubmissionCriteriaBySubmissionUuid.dataList || []);
        this.searchOptions = this.evaluationCriteria.map((criteria) => {
          return {
            uuid: criteria.uuid,
            name: criteria.name
          }
        });
        this.setCriteriaGroupMap();
        this.loading = false;
      } else {
        console.error(response.data.getSubmission.message);
        this.loading = false;
      }

    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }


  async getSubmissionReport() {
    try {
      this.loading = true;
      const response: any = await this.apollo.fetchData({
        query: GET_TEAM_SUMMARY_BY_SUBMISSION_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: { submissionUuid: this.submission.uuid }
      });

      if (response.data.getTeamSummaryBySubmissionUuid.data) {
        const result = response.data.getTeamSummaryBySubmissionUuid.data;
        this.tableHeaders = result.headers;
        this.tableRows = result.tendererEvaluationScores || [];

        this.tableRows.forEach(item => {
          this.tableRowsMap[item.submissionCriteria.uuid] = item;
        });

        const headerData = [];
        if (this.tableHeaders.length !== 0) {
          this.tableHeaders.forEach((item, index) => {
            headerData.push(
              { name: 'header' + index, label: item }
            );
          });
        }

        this.tableConfigurations.tableColumns = headerData;
      }
      this.loading = false;

    } catch (e) {
      console.error(e);
      this.loading = false;
      this.notificationService.errorMessage('Problem Occurred while fetching tenderer evaluation details, Please  try again')
    }
  }

  getTableRows(submissionCriteriaUuid: string) {
    return this.tableRows.filter(item => item.submissionCriteria.uuid === submissionCriteriaUuid);
  }

  async isMySubmission(submissionUuid: string) {
    this.loading = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: IS_MY_SUBMISSION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionUuid: submissionUuid
        }
      });

      if (response.data.isMySubmission.code == 9000) {
        if (!response.data.isMySubmission.data) {
          this.notificationService.errorMessage('Access denied, you are not allowed to view this bid details')
          await this.router.navigateByUrl('/nest-tenderer/dashboard');
        }
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  setActiveIndex(criteriaUuid: string, parentCriteriaUuid: string = null) {
    if (parentCriteriaUuid) {
      this.activeTabIndex = parentCriteriaUuid;
      this.activeChildTabIndex = criteriaUuid;
      this.onViewportScroll(parentCriteriaUuid);
    } else {
      this.activeTabIndex = criteriaUuid;
      this.onViewportScroll(criteriaUuid);
    }
  }

  async showTenderForm() {
    this.checking = true;
    const data = await this.attachmentService.getSignedAttachment(
      this.submission.signedTenderFormUuid
    );
    this.settingServices.viewFile(data, 'pdf').then(() => {
      this.checking = false;
    });
  }

  onOptionSelected(option: any) {
    this.searchItem = option.name;
    this.setActiveIndex(option.uuid);
    this.clearSearch();
  }

  clearSearch() {
    this.searchItem = null;
    this.searchFormControl.setValue(null);
  }

  onViewportScroll(elementId: string) {
    this.debouncedScroll(elementId);
  }

  debouncedScroll = debounce((elementId: string) => {
    const offset = 0;
    const parentElement = document.getElementById(
      'shared-layout-content-wrapper'
    );

    const childElement = document.getElementById(elementId);
    const distance =
      childElement.getBoundingClientRect().top -
      parentElement.getBoundingClientRect().top;

    const parentScrollableWrapper = document.getElementById('content_wrapper');

    if (distance > offset) {
      parentScrollableWrapper.scrollTo({
        top: distance - offset,
        behavior: 'smooth',
      });
    }
  }, 100);

}
