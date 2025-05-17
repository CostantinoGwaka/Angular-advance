import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, forkJoin } from 'rxjs';
import { GET_ANNUAL_PROCUREMENT_PLAN_PUBLISHED } from 'src/app/modules/nest-app/store/annual-procurement-plan/annual-procurement-plan.graphql';
import { AnnualProcurementPlan } from 'src/app/modules/nest-app/store/annual-procurement-plan/annual-procurement-plan.model';
import { Tender } from 'src/app/modules/nest-app/store/tender/tender.model';
import { ProcurementRequisition } from 'src/app/modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.model';
import { TenderAll } from 'src/app/modules/nest-tenderer/store/tenders/tenders.model';
import { AttachmentService } from '../../services/attachment.service';
import { GraphqlService } from '../../services/graphql.service';
import { LayoutService } from '../../services/layout.service';
import { ApplicationState } from 'src/app/store';
import { GET_PUBLIC_TENDERS_PROCURING_ENTITY_BY_UUID } from 'src/app/website/store/public-tenders.graphql';
import { environment } from 'src/environments/environment';
import { PublicTendersTenderCalendarDate } from '../store/public-tenders-item.model';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ViewDetailsItemComponent } from '../../shared/components/view-details-item/view-details-item.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';

@Component({
    selector: 'app-public-gpn-list',
    templateUrl: './public-gpn-list.component.html',
    styleUrls: ['./public-gpn-list.component.scss'],
    standalone: true,
    imports: [
    LayoutComponent,
    ParallaxContainerComponent,
    LoaderComponent,
    ViewDetailsItemComponent,
    CurrencyPipe,
    DatePipe,
    TranslatePipe
],
})
export class PublicGpnListComponent implements OnInit {
  toggler: any = {};
  togglerTender: any = {};
  viewDetails: boolean = false;
  viewDetailsTitle = '';
  selectedUuid: string;
  viewType = '';
  priviewDetails: boolean = false;
  tenderDetailsData: TenderAll;
  tenderViewDetailTitle: string = '';
  selectedTender: string = '';
  requisitions: ProcurementRequisition[] = [];
  loading: boolean = false;

  financialYears: { name: string; value: string }[];
  currentSelectedFinancialYear: string;
  selecctedFinancialYear: string;
  selectedProcuringEntity: string;
  @Input() isPublic: boolean = true;
  @Input() defaultPEuuid: string;
  @Input() selectedPEs: any[] = [];
  annualProcurementPlans: AnnualProcurementPlan[] = [];
  gpnList: Tender[] = [];
  isShown: any = {};
  loadingGpn: boolean = false;
  publishedApps: any[] = [];
  appPublishedTenders: any[] = [];
  loadLogo: any = {};
  peLogo: any = {};
  loadTenders: boolean = false;
  activeTab: any = {};
  budgetBySource: any[] = [];
  budgetByCategory: any[] = [];
  budgetMethod: any[] = [];

  groups: any[] = [];
  groupsItems: any = {};
  constructor(
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private apollo: GraphqlService,
    private confirmationDialog: MatDialog,
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private attachmentService: AttachmentService
  ) { }

  ngOnInit(): void {
    this.activeTab['summary'] = true;
    this.getTwoLastFinancialYears();
    this.getRequisitions().then();
    this.getBudget();
  }

  getTotal(budgetMethod: any[], field: string) {
    return (budgetMethod || []).reduce(
      (total: number, item: any) => total + item[field],
      0
    );
  }

  async getBudget(): Promise<void> {
    firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-app/get/consolidated/budget/stats`,
        {}
      )
    ).then(
      (response) => {
        this.budgetBySource = response;

        this.groups = [
          ...new Set(this.budgetBySource.map((item) => item.budgetPurposeId)),
        ];
        this.groups.forEach((groupName: string) => {
          const filteredItems = this.budgetBySource.filter(
            (item) => item.budgetPurposeId === groupName
          );
          this.groupsItems[groupName] = filteredItems;
        });
        //
      },
      (error) => { }
    );

    firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL +
        `/nest-app/get/consolidated/procurement/method/stats`,
        {}
      )
    ).then(
      (response) => {
        this.budgetMethod = response;
      },
      (error) => { }
    );

    firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL +
        `/nest-app/get/consolidated/procurement/category/stats`,
        {}
      )
    ).then(
      (response) => {
        this.budgetByCategory = response;
      },
      (error) => { }
    );
  }

  async getPEDetails(peUuid: string) {
    const response = await this.apollo.fetchData({
      query: GET_PUBLIC_TENDERS_PROCURING_ENTITY_BY_UUID,
      apolloNamespace:ApolloNamespace.uaa,
      variables: {
        uuid: peUuid,
      },
    });
    if (response.data['findProcuringEntityByUuid']?.data) {
      let pe = response.data['findProcuringEntityByUuid'].data;
      if (pe) {
        const peIndex = this.publishedApps.findIndex(
          (app: any) => app.procurementEntityUuid == pe.uuid
        );
        // if (this.publishedApps[peIndex].procurementEntityName == null) {
        this.publishedApps[peIndex] = {
          ...this.publishedApps[peIndex],
          procurementEntityName: pe.name,
        };
        // }

        this.getPELogo(pe.logoUuid, peUuid);
      }
    }
  }

  async getPELogo(logoUuid: string, peUuid: string) {
    this.loadLogo[peUuid] = true;
    const logo = await this.attachmentService.getPELogo(logoUuid);
    if (logo) {
      this.peLogo[peUuid] = logo;
    }
    this.loadLogo[peUuid] = false;
  }

  toggleView(uuid: string) {
    const memory = this.toggler[uuid];
    this.toggler = {};
    this.toggler[uuid] = !memory;
    if (this.toggler[uuid] == true) {
      this.getTendersByAnnualProcurementPlanUuidByStatus(uuid);
    }
  }

  toggleTenderView(uuid: string) {
    const memory = this.togglerTender[uuid];
    this.togglerTender = {};
    this.togglerTender[uuid] = !memory;
  }

  async getPublishedAnnulaProcurementPlans(financialYearCode: string) {
    this.loadingGpn = true;
    const response: any = await this.apollo.fetchData({
      query: GET_ANNUAL_PROCUREMENT_PLAN_PUBLISHED,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        input: {
          fields: [],
          page: 1,
          pageSize: 10,
          mustHaveFilters: [
            {
              fieldName: 'financialYearCode',
              operation: 'EQ',
              value1: financialYearCode,
            },
          ],
        },
        status: 'PUBLISHED',
      },
    });

    this.annualProcurementPlans =
      response.data.getAnnualProcurementPlansByStatus.data;
    if (this.annualProcurementPlans.length > 0) {
      await this.getTendersByAnnualProcurementPlanUuidByStatus(
        this.annualProcurementPlans[0].uuid
      );
    }
    this.loadingGpn = false;
  }

  async getTendersByAnnualProcurementPlanUuidByStatus(appUuid: string) {
    this.appPublishedTenders = [];
    this.loadTenders = true;
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-app/get/published/tenders`,
        {
          input: { fields: [], page: 1, pageSize: 10000, mustHaveFilters: [] },
          withMetaData: false,
          annualProcurementPlanUuid: appUuid,
        }
      )
    );
    this.loadTenders = false;
    this.appPublishedTenders = data.data;

  }

  showGPN(plan: AnnualProcurementPlan) {
    if (this.isShown[plan.uuid] == null || this.isShown[plan.uuid] == false) {
      this.getGPNByAPPUuid(plan.uuid).then();
      this.isShown[plan.uuid] = true;
    } else if (this.isShown[plan.uuid] == true) {
      this.isShown[plan.uuid] = false;
      this.gpnList = [];
    }
  }

  async getGPNByAPPUuid(appUuid: string) {
    this.loadingGpn = true;
    await this.getTendersByAnnualProcurementPlanUuidByStatus(appUuid);
    this.loadingGpn = false;
  }

  getEligibileTenderer(tendererTypes: any[]) {
    return tendererTypes.map((tenderer: any) => tenderer.name).join(', ');
  }

  getTwoLastFinancialYears() {
    this.financialYears = [
      {
        name:
          new Date().getFullYear() - 3 + '/' + (new Date().getFullYear() - 2),
        value:
          new Date().getFullYear() - 3 + '/' + (new Date().getFullYear() - 2),
      },
      {
        name:
          new Date().getFullYear() - 2 + '/' + (new Date().getFullYear() - 1),
        value:
          new Date().getFullYear() - 2 + '/' + (new Date().getFullYear() - 1),
      },
      {
        name: new Date().getFullYear() - 1 + '/' + new Date().getFullYear(),
        value: new Date().getFullYear() - 1 + '/' + new Date().getFullYear(),
      },
    ];

    if (this.isPublic == true) {

    } else if (this.isPublic == false) {
      this.currentSelectedFinancialYear = this.financialYears[2].value;
      this.getPublishedAnnulaProcurementPlans(
        this.currentSelectedFinancialYear
      ).then();
    }
  }

  getCalendarDate(
    tenderCalenderDates: PublicTendersTenderCalendarDate[],
    calendarType:
      | 'APPROVAL_OF_AWARD'
      | 'AWARD_NOTIFICATION'
      | 'COOL_OF_PERIOD_END'
      | 'COOL_OF_PERIOD_START'
      | 'INVITATION'
      | 'PRE_APPLICANTS_NOTIFICATION'
      | 'PRE_INVITATION'
      | 'PRE_SUBMISSION_OR_OPENING'
      | 'SIGNING_OF_CONTRACT'
      | 'START_OF_CONTRACT'
      | 'SUBMISSION_OR_OPENING'
      | 'VETTING_OF_CONTRACT'
  ) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.columnName == calendarType
      )?.plannedDate ?? ''
    );
  }

  getSubmissionDate(tenderCalenderDates: PublicTendersTenderCalendarDate[]) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Submission or opening'
      )?.plannedDate ?? ''
    );
  }

  getApprovalDate(tenderCalenderDates: PublicTendersTenderCalendarDate[]) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Approval of award'
      )?.plannedDate ?? ''
    );
  }

  getCoolOfStartDate(tenderCalenderDates: PublicTendersTenderCalendarDate[]) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Cool off period start'
      )?.plannedDate ?? ''
    );
  }

  getCoolOfEndDate(tenderCalenderDates: PublicTendersTenderCalendarDate[]) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Cool off period end'
      )?.plannedDate ?? ''
    );
  }

  getAwardNotificationDate(
    tenderCalenderDates: PublicTendersTenderCalendarDate[]
  ) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Submission or opening'
      )?.plannedDate ?? ''
    );
  }

  getVettingDate(tenderCalenderDates: PublicTendersTenderCalendarDate[]) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Vetting of contract'
      )?.plannedDate ?? ''
    );
  }

  getSigningOfContractDate(
    tenderCalenderDates: PublicTendersTenderCalendarDate[]
  ) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Signing of contract'
      )?.plannedDate ?? ''
    );
  }

  getContractStartDate(tenderCalenderDates: PublicTendersTenderCalendarDate[]) {
    return (
      tenderCalenderDates.find(
        (calender: PublicTendersTenderCalendarDate) =>
          calender.procurementStage.name == 'Contract Start Date'
      )?.plannedDate ?? ''
    );
  }

  selectFinancialYear(event: any) {
    this.selecctedFinancialYear = event.value;
    this.getPublishedAnnulaProcurementPlans(this.selecctedFinancialYear).then();
  }

  selectProcuringEntity(event: any) {
    this.selecctedFinancialYear = event.value;
  }

  getGPNSummary() {
    // approvalStatus
  }

  refresh() {
    window.location.reload();
  }

  viewItem(event: any) {
    this.selectedTender = event;
    this.viewDetailsTitle = `Tender Details : ${event?.year}`;
  }

  backToTenders() {
    this.priviewDetails = false;
  }

  viewTenderDetails(tender: any) {
    this.tenderViewDetailTitle =
      tender.descriptionOfTheProcurement + '-' + tender.tenderNumber;
    this.priviewDetails = true;
    this.tenderDetailsData = tender;
  }

  setActiveTab(tabName: string) {
    const memory = this.activeTab[tabName];
    this.activeTab = {};
    this.activeTab[tabName] = !memory;
  }

  async getRequisitions() {
    this.loading = true;
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-app/get/published/app`,
        {
          input: { fields: [], page: 1, pageSize: 10, mustHaveFilters: [] },
          withMetaData: false,
        }
      )
    );
    this.publishedApps = data.data;
    await firstValueFrom(
      forkJoin(
        this.publishedApps.map((app: any) =>
          this.getPEDetails(app.procurementEntityUuid)
        )
      )
    );
    this.loading = false;
  }
}
