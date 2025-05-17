import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report } from 'src/app/modules/nest-reports/store/reports/reports.model';
import { EntityObjectTypeEnum } from "../../../modules/nest-app/store/tender/tender.model";
import { OpeningReportGeneratorComponent } from '../../../modules/nest-opening/opening-report-generator/opening-report-generator.component';

@Component({
    selector: 'app-url-listener-report-viewer',
    templateUrl: './url-listener-report-viewer.component.html',
    styleUrls: ['./url-listener-report-viewer.component.scss'],
    standalone: true,
    imports: [OpeningReportGeneratorComponent],
})
export class UrlListenerReportViewerComponent implements OnInit, OnDestroy {
  private queryParamsSubscription: Subscription;
  report = null;
  tenderUuid = null;
  requisitionUuid = null;
  reports: Report[] = [];
  reportData: Report;
  reportFile: any;
  loading: boolean = false;
  tenderNumber: string;
  entityType = EntityObjectTypeEnum.TENDER;
  constructor(
    private activeRoute: ActivatedRoute,
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

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  ngOnInit(): void { }
}
