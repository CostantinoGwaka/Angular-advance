import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { lastValueFrom, Subscription } from "rxjs";
import { Report } from "../../../modules/nest-reports/store/reports/reports.model";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ExcelReaderService } from "../../../services/excel-reader.service";
import { environment } from "../../../../environments/environment";
import { EntityObjectTypeEnum } from "../../../modules/nest-app/store/tender/tender.model";
import { RenderPdfComponent } from '../../../shared/components/render-pdf/render-pdf.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { OpeningReportGeneratorComponent } from '../../../modules/nest-opening/opening-report-generator/opening-report-generator.component';


@Component({
  selector: 'app-render-public-opening-report',
  templateUrl: './render-public-opening-report.component.html',
  styleUrls: ['./render-public-opening-report.component.scss'],
  standalone: true,
  imports: [OpeningReportGeneratorComponent, LoaderComponent, MatButtonModule, MatMenuModule, MatIconModule, RenderPdfComponent]
})
export class RenderPublicOpeningReportComponent implements OnInit {
  private queryParamsSubscription: Subscription;
  report = null;
  tenderUuid = null;
  requisitionUuid = null;

  reports: Report[] = [];
  reportData: Report;
  reportFile: any;
  loading: boolean = false;
  newReport: boolean = true;
  tenderNumber: string;
  entityType = EntityObjectTypeEnum.TENDER;

  constructor(
    private activeRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private excelReaderService: ExcelReaderService
  ) {
    this.queryParamsSubscription = this.activeRoute.queryParams.subscribe(
      (params) => {
        try {
          this.report = params['report'];
          this.tenderUuid = params['tid'];
          this.requisitionUuid = params['rid'];
          this.entityType = this.getEntityType(params['type'] ?? 'tender');
          this.tenderNumber = params['tno'];


        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  getEntityType(type: string): EntityObjectTypeEnum {
    try {
      type = type.toLowerCase();
      switch (type) {
        case 'tender':
          return EntityObjectTypeEnum.TENDER;

        case 'planned_tender':
          return EntityObjectTypeEnum.PLANNED_TENDER;

        case 'framework':
          return EntityObjectTypeEnum.FRAMEWORK;

        case 'contract':
          return EntityObjectTypeEnum.CONTRACT;
        default:
          return EntityObjectTypeEnum.TENDER;
      }
    } catch (e) {
      return EntityObjectTypeEnum.TENDER;
    }
  }

  getReport() {
    switch (this.report) {
      case 'openig_report':
        break;
    }
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  useNormalReport(event) {

    if (event) {
      this.newReport = false;
      this.autoFetchReport().then();
    }
  }

  // async loadReports() {
  //   try {
  //     this.loading = true;
  //     this.reports = await lastValueFrom<Report[]>(
  //       this.httpClient.get<Report[]>(
  //         environment.SERVER_URL + `/nest-report/report/list/`
  //       )
  //     );
  //
  //     if (this.reports.length !== 0) {
  //       this.reportData = this.reports.find(
  //         (i) => i.module === 'TENDER' && i.name == 'tenderopenreport'
  //       );
  //       await this.autoFetchReport();
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     this.loading = false;
  //   }
  // }

  async autoFetchReport(): Promise<void> {
    this.loading = true;
    if (!this.tenderNumber) {
      return;
    }
    const payload: string = `PDF?reportType=PDF&tender_number=${this.tenderNumber}`;
    try {
      this.reportFile = await lastValueFrom(
        this.httpClient.get(
          environment.SERVER_URL + `/nest-report/report/public/base64/${payload}`,
          { responseType: 'text' }
        )
      );
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  exportReport(reportType: string) {
    if (reportType == 'PDF') {
      // this.reportFile = this.fileResult;
      this.excelReaderService.base64ToBlob2(this.reportFile, 'application/pdf');
    } else if (reportType == 'XLSX' || reportType == 'CSV') {
      this.excelReaderService.base64ToBlob(
        this.reportFile,
        this.excelReaderService.uuid()
      );
    } else if (reportType == 'RTF') {
      this.excelReaderService.base64ToBlob2(this.reportFile, 'application/rtf');
    } else if (reportType == 'XML') {
      this.excelReaderService.base64ToBlob2(this.reportFile, 'text/xml');
    } else if (reportType == 'DOCX') {
      this.excelReaderService.base64ToBlob2(
        this.reportFile,
        'application/docx'
      );
    }
  }
}
