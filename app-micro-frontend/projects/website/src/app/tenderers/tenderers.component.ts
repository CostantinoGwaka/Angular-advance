import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AttachmentService } from '../../services/attachment.service';
import { GraphqlService } from '../../services/graphql.service';
import {
  GET_ACTUAL_TENDERER_REGISTRATION_STATUS,
  GET_ACTUAL_TENDERER_REGISTRATION_STATUS_BY_CATEGORY,
} from '../store/public-tenders.graphql';
import { ChartConfiguration } from 'chart.js';
import { PEStatistics } from '../procuring-entities/procurement-entities-search';
import { StatisticsItemComponent } from '../../modules/nest-tenderer-management/tenderer-management-dashboard/statistics-item/statistics-item.component';
import { MatDividerModule } from '@angular/material/divider';
import { TendererSummaryViewComponent } from './tenderer-summary-view/tenderer-summary-view.component';
import { NgChartsModule } from 'ng2-charts';
import { QuickStatsComponent } from '../../shared/components/stats/quick-stats/quick-stats.component';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import {ApolloNamespace} from "../../apollo.config";

@Component({
    selector: 'app-tenderers',
    templateUrl: './tenderers.component.html',
    styleUrls: ['./tenderers.component.scss'],
    standalone: true,
    imports: [
    LayoutComponent,
    ParallaxContainerComponent,
    NgClass,
    MatIconModule,
    LoaderComponent,
    MatCardModule,
    QuickStatsComponent,
    NgChartsModule,
    TendererSummaryViewComponent,
    MatDividerModule,
    StatisticsItemComponent
],
})
export class TenderersComponent implements OnInit {
  searchKeyWord: string;
  page: number = 0;
  pageSize: number = 20;
  pes: PEStatistics[] = [];
  loading: boolean = false;
  loadLogo: any = {};
  peLogo: any = {};
  show: any = {};

  items: any[] = [];
  dashboardLoading: boolean = false;
  tenderRegistrationStatusData: TendererRegistrationStatus[] = [];
  approvedCountByDescription: Record<string, number> = {};
  categories: string[] = [];
  doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [],
      label: 'Tenderer Type',
      backgroundColor: ['#47BDFE', '#3D85AD', '#315A71', '#6F8B9A'],
    },
  ];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    maintainAspectRatio: true,
  };

  approvedCountByTendererType: Record<string, {
    totalTenderer?: number,
    approvedCount?: number,
  }> = {}

  localTendererType = [
    { id: 'COMPANY_LOCAL', name: 'Company Local' },
    { id: 'INDIVIDUAL_LOCAL', name: 'Individual Consultant Local' },
    { id: 'MANUFACTURER_LOCAL', name: 'Manufacture Local' },
    { id: 'SOLE_PROPRIETOR_LOCAL', name: 'Sole Proprietor Local' },
    { id: 'SPECIAL_GROUP', name: 'Special Group' },
    { id: 'COMPANY_FOREIGN', name: 'Company Foreign' },
    { id: 'INDIVIDUAL_FOREIGN', name: 'Individual Consultant Foreign' },
    { id: 'MANUFACTURER_FOREIGN', name: 'Manufacturer Foreign' },
    { id: 'SOLE_PROPRIETOR_FOREIGN', name: 'Sole Proprietor Foreign' },
  ];

  categoriesTendererColor1: string[] = ['#001E43',
    '#11346D',
    '#235CA4',
    '#3576DA',
    '#72A6F1',
    '#A5C8F7',
    '#D8EBFD',
    '#F5FAFF',
    '#315A71'
  ];

  tendererTypes: string[] = [];

  localTenderer = 0;
  foreignTenderer = 0;
  localTendererPercent = 0;
  foreignTendererPercent = 0;
  totalTenderer = 0;

  tenderRegistrationStatus: TendererRegistrationStatus[];

  constructor(
    private apollo: GraphqlService,
    private attachmentService: AttachmentService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initializeStatistics().then();
    this.initializeTypes().then();
    this.initializeStatisticsPercentage();
    this.tendererTypes = this.localTendererType.map((item: any) => item.name);
  }

  /// actual statistics
  async initializeStatisticsPercentage() {
    const response: any = await this.apollo.fetchData({
      query: GET_ACTUAL_TENDERER_REGISTRATION_STATUS,
      apolloNamespace: ApolloNamespace.uaa
    });

    this.tenderRegistrationStatus = response.data.getActualTendererRegistrationStatus || [];
    this.getTotalTotalValuesCount(this.tenderRegistrationStatus);

    this.getLocalAndForeignTendererCount();
  }

  getTotalTotalValuesCount(data: TendererRegistrationStatus[]) {
    for (const entry of data) {
      this.addDataForLocalAndForeign(entry);
    }
  }

  addDataForLocalAndForeign(data: TendererRegistrationStatus) {
    if (data.tendererType.includes('FOREIGN')) {
      this.foreignTenderer += data.approvedCount;
    } else {
      this.localTenderer += data.approvedCount;
    }
  }

  getLocalAndForeignTendererCount() {
    this.totalTenderer = this.localTenderer + this.foreignTenderer;
    this.localTendererPercent = Math.round((this.localTenderer / this.totalTenderer) * 100)
    this.foreignTendererPercent = Math.round((this.foreignTenderer / this.totalTenderer) * 100)
  }

  async initializeTypes() {
    this.localTendererType.forEach((item: any) => {
      this.approvedCountByTendererType[item.id] = {
        totalTenderer: 0,
        approvedCount: 0,
      };
    });
    const response: any = await this.apollo.fetchData({
      query: GET_ACTUAL_TENDERER_REGISTRATION_STATUS,
      apolloNamespace: ApolloNamespace.uaa
    });
    if (response.data.getActualTendererRegistrationStatus) {
      const tendererTYpeKeys = this.localTendererType.map(i => i.id);
      response.data.getActualTendererRegistrationStatus.forEach((item: any) => { // item is an object
        if (tendererTYpeKeys.includes(item.tendererType)) {
          this.approvedCountByTendererType[item.tendererType].totalTenderer = item.totalTenderer || 0;
          this.approvedCountByTendererType[item.tendererType].approvedCount = item.approvedCount || 0;
        }
      });
    }

  }

  formatLabel(label: string) {
    return label
      .split('_')
      .map((item: string) => item.charAt(0) + item.toLowerCase().substring(1))
      .join(' ');
  }

  async initializeStatistics() {
    this.dashboardLoading = true;
    const response: any = await this.apollo.fetchData({
      query: GET_ACTUAL_TENDERER_REGISTRATION_STATUS_BY_CATEGORY,
      apolloNamespace: ApolloNamespace.uaa
    });

    this.tenderRegistrationStatusData =
      response.data.getActualTendererRegistrationStatusByCategory || [];
    this.getTotalTotalValues(this.tenderRegistrationStatusData);
    this.dashboardLoading = false;
  }

  getTotalTotalValues(data: TendererRegistrationStatus[]) {
    this.doughnutChartDatasets[0].data = [];
    this.approvedCountByDescription = {};
    for (const entry of data) {
      this.addEntry(entry);
    }
    this.categories = Object.keys(this.approvedCountByDescription);

    this.categories.forEach((category) => {
      // for donut
      this.doughnutChartDatasets[0].data.push(
        this.approvedCountByDescription[category]
      );
    });
  }

  addEntry(entry: TendererRegistrationStatus): void {
    const { approvedCount, description } = entry;
    if (this.approvedCountByDescription.hasOwnProperty(description)) {
      this.approvedCountByDescription[description] += approvedCount;
    } else {
      this.approvedCountByDescription[description] = approvedCount;
    }
  }
}

export interface TendererRegistrationStatus {
  approvedCount: number;
  description: string;
  id: number;
  notApprovedCount: number;
  submittedCount: number;
  tendererType: string;
}
