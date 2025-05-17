import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TendersComponent } from './tenders/tenders.component';
import { WebsiteAdvancedTenderSearchComponent } from './website-advanced-tender-search/website-advanced-tender-search.component';
import { WebsiteReportViewComponent } from './reports/website-report-view/website-report-view.component';
import { VerifyComponent } from './verify/verify.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { DowloadComponent } from './file/dowload/dowload.component';
import { ComingSoonPageComponent } from 'projects/shared/coming-soon-page/coming-soon-page.component';
import { ViewTenderDetailsComponent } from './tenders/view-tender-details/view-tender-details.component';
import { PubicGpnSummaryComponent } from './public-gpn-summary/public-gpn-summary.component';
import { PublicGpnListComponent } from './public-gpn-list/public-gpn-list.component';
import { AnnualProcurementPlansComponent } from './annual-procurement-plans/annual-procurement-plans.component';
import { ProcuringEntitiesComponent } from './procuring-entities/procuring-entities.component';
import { TenderersComponent } from './tenderers/tenderers.component';
import { SharedDocumentsComponent } from './shared-documents/shared-documents.component';
import { PublicFormsComponent } from './public-forms/public-forms.component';
import { SpecialGroupsComponent } from './special-groups/special-groups.component';
import { SharedDocumentsViewerComponent } from './shared-documents/shared-documents-viewer/shared-documents-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'tenders',
    component: TendersComponent,
  },
  {
    path: 'tenders/opened-tenders',
    component: WebsiteAdvancedTenderSearchComponent,
  },
  {
    path: 'tenders/awarded-tenders',
    component: WebsiteAdvancedTenderSearchComponent,
  },
  {
    path: 'tenders/published-tenders',
    component: WebsiteAdvancedTenderSearchComponent,
  },
  {
    path: 'tenders/tenders-closing-today',
    component: WebsiteAdvancedTenderSearchComponent,
  },
  {
    path: 'tenders/opened-tenders/report-view',
    component: WebsiteReportViewComponent,
  },
  {
    path: 'reports/report-view',
    component: WebsiteReportViewComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
  },
  {
    path: 'file/download/:file_uuid',
    component: DowloadComponent,
  },
  {
    path: 'coming-soon',
    component: ComingSoonPageComponent,
  },
  {
    path: 'tender-details',
    component: ViewTenderDetailsComponent,
  },
  {
    path: 'public-gpn-summary',
    component: PubicGpnSummaryComponent,
  },
  {
    path: 'public-gpn-list',
    component: PublicGpnListComponent,
  },
  {
    path: 'annual-procurement-plans',
    component: AnnualProcurementPlansComponent,
  },
  {
    path: 'procuring-entities',
    component: ProcuringEntitiesComponent,
  },
  {
    path: 'tenderers',
    component: TenderersComponent,
  },
  {
    path: 'documents',
    component: SharedDocumentsComponent,
  },
  {
    path: 'documents/forms',
    component: PublicFormsComponent,
  },
  {
    path: 'special-groups',
    component: SpecialGroupsComponent,
  },
  {
    path: 'documents-details',
    component: SharedDocumentsViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
