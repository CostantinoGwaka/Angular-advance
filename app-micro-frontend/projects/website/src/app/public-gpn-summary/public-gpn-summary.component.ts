import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GraphqlService } from '../../services/graphql.service';
import { LayoutService } from '../../services/layout.service';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import * as XLSX from 'xlsx';
import {
  GET_PROCUREMENT_CATEGORY_CONSOLIDATED_REPORT,
  GET_PROCUREMENT_METHOD_CONSOLIDATED_REPORT,
  GET_SOURCE_FUND_BY_CONSOLIDATED
} from "./store/public-gpn-summary.graph";
import { PublicGpnSummaryModel } from "./store/public-gpn-summary.model";
import { GET_THREE_RECENT_FINANCIAL_YEARS } from "../../modules/nest-reports/store/reports/reports.graphql";
import { FinancialYear } from "../../modules/nest-app/store/settings/financial-year/financial-year.model";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';

@Component({
  selector: 'app-pubic-gpn-summary',
  templateUrl: './public-gpn-summary.component.html',
  styleUrls: ['./public-gpn-summary.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [LayoutComponent, ParallaxContainerComponent, RouterLink, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatProgressSpinnerModule, CurrencyPipe]
})
export class PubicGpnSummaryComponent implements OnInit, OnDestroy {

  sourceFundByConsolidated: PublicGpnSummaryModel[] = [];
  procurementMethodConsolidatedReport: PublicGpnSummaryModel[] = [];
  procurementCategoryConsolidatedReport: PublicGpnSummaryModel[] = [];
  routeSub = Subscription.EMPTY;
  loadingGpn: boolean = false;
  loadingMessage: string = '';
  financialYearCode: string = '2023/2024';
  loadingFinancialYear: boolean = false;
  financialYears: FinancialYear[];
  groups: any[] = [];
  groupsItems: any = {};

  constructor(
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private apollo: GraphqlService
  ) {
  }

  ngOnInit(): void {
    this.routeSub = this.activeRoute.queryParams.subscribe(items => {
      this.financialYearCode = items['financialYear'] ?? '2023/2024';
      this.fetchReportsSummary(this.financialYearCode);
    })
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }


  fetchReportsSummary(financialYear: string) {
    this.getFinancialYears().then(_ => {
      this.getSourceFundByConsolidated(financialYear).then();
      this.getProcurementMethodConsoReport(financialYear).then();
      this.getProcurementCategoryConsoReport(financialYear).then();
    });
  }


  exportTableToExcel(tableId, filename = 'table') {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById(tableId));
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  getTotal(budgetMethod: any[], field: string) {
    return (budgetMethod || []).reduce((total: number, item: any) => total + item[field], 0);
  }


  async getSourceFundByConsolidated(financialYearCode: string) {
    this.loadingGpn = true;
    const response: any = await this.apollo.fetchData({
      query: GET_SOURCE_FUND_BY_CONSOLIDATED,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        financialYear: financialYearCode
      }
    });
    this.sourceFundByConsolidated = response.data.getSourceFundByConsolidated;

    if (this.sourceFundByConsolidated.length) {
      this.groups = [...new Set(this.sourceFundByConsolidated.map(item => item.budgetPurposeId))];
      this.groups.forEach((groupName: string) => {
        this.groupsItems[groupName] = this.sourceFundByConsolidated.filter(item => item.budgetPurposeId === groupName);
      });


    }
  }


  async getProcurementMethodConsoReport(financialYearCode: string) {
    this.loadingGpn = true;
    const response: any = await this.apollo.fetchData({
      query: GET_PROCUREMENT_METHOD_CONSOLIDATED_REPORT,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        financialYear: financialYearCode
      }
    });

    this.procurementMethodConsolidatedReport = response.data.getProcurementMethodConsoReport;
  }

  async getProcurementCategoryConsoReport(financialYearCode: string) {
    this.loadingGpn = true;
    const response: any = await this.apollo.fetchData({
      query: GET_PROCUREMENT_CATEGORY_CONSOLIDATED_REPORT,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        financialYear: financialYearCode
      }
    });

    this.procurementCategoryConsolidatedReport = response.data.getProcurementCategoryConsoReport;
  }

  refresh() {
    window.location.reload();
  }


  async getFinancialYears() {
    try {
      this.loadingFinancialYear = true;
      const finaResults: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_THREE_RECENT_FINANCIAL_YEARS
      });

      this.financialYears = finaResults?.data?.getThreeRecentFinancialYears?.dataList;
      this.loadingFinancialYear = false;

    } catch (e) {
      console.error(e);
      this.loadingFinancialYear = false;
    }
  }

  onChangeFinancialYear(event) {
    this.fetchReportsSummary(this.financialYearCode);
  }

}
