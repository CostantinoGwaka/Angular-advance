import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'projects/shared/shared.module';
import { HomeComponent } from './home/home.component';
import { TendersComponent } from './tenders/tenders.component';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { TenderItemComponent } from './shared/components/tender-item/tender-item.component';
import { TenderCategoryComponent } from './shared/components/tender-category/tender-category.component';
import { QuickStatComponent } from './shared/components/quick-stat/quick-stat.component';
import { QuickInfoComponent } from './shared/components/quick-info/quick-info.component';
import { SearchAreaComponent } from './tenders/search-area/search-area.component';
import { CategoryFilterComponent } from './tenders/category-filter/category-filter.component';
import { TendersListComponent } from './tenders/tenders-list/tenders-list.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ParallaxContainerComponent } from './shared/components/parallax-container/parallax-container.component';
import { VerifyComponent } from './verify/verify.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { DowloadComponent } from './file/dowload/dowload.component';
import { SearchBarComponent } from './home/search-bar/search-bar.component';
import { StatsBarComponent } from './home/stats-bar/stats-bar.component';
import { CategoriesSelectorComponent } from './home/search-bar/categories-selector/categories-selector.component';
import { ConnectedDotsComponent } from './home/connected-dots/connected-dots.component';
import { MobileAppAdComponent } from './home/mobile-app-ad/mobile-app-ad.component';
import { ViewTenderDetailsComponent } from './tenders/view-tender-details/view-tender-details.component';
import { WebsiteAdvancedTenderSearchComponent } from './website-advanced-tender-search/website-advanced-tender-search.component';
import { WebsiteReportViewComponent } from './reports/website-report-view/website-report-view.component';
import { PubicGpnSummaryComponent } from './public-gpn-summary/public-gpn-summary.component';
import { PublicGpnListComponent } from './public-gpn-list/public-gpn-list.component';
import { ProcuringEntitiesComponent } from './procuring-entities/procuring-entities.component';
import { AnnualProcurementPlansComponent } from './annual-procurement-plans/annual-procurement-plans.component';
import { RenderTenderGpnComponent } from './shared/components/render-tender-gpn/render-tender-gpn.component';
import { TenderersComponent } from './tenderers/tenderers.component';
import { TendererSummaryViewComponent } from './tenderers/tenderer-summary-view/tenderer-summary-view.component';
import { StatsLoaderComponent } from './home/stats-bar/stats-loader/stats-loader.component';
import { ProcuringEntityItemComponent } from './procuring-entities/procuring-entity-item/procuring-entity-item.component';
import { RenderPublicOpeningReportComponent } from './reports/render-public-opening-report/render-public-opening-report.component';
import { SharedDocumentsComponent } from './shared-documents/shared-documents.component';
import { SharedDocumentsItemsComponent } from './shared-documents/shared-documents-items/shared-documents-items.component';
import { PublicFormsComponent } from './public-forms/public-forms.component';
import { SpecialGroupsComponent } from './special-groups/special-groups.component';
import { SharedDocumentsViewerComponent } from './shared-documents/shared-documents-viewer/shared-documents-viewer.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    TendersComponent,
    TenderCategoryComponent,
    QuickStatComponent,
    QuickInfoComponent,
    SearchAreaComponent,
    CategoryFilterComponent,
    LayoutComponent,
    ParallaxContainerComponent,
    VerifyComponent,
    TermsAndConditionsComponent,
    SearchBarComponent,
    CategoriesSelectorComponent,
    ConnectedDotsComponent,
    MobileAppAdComponent,
    WebsiteAdvancedTenderSearchComponent,
    WebsiteReportViewComponent,
    TendererSummaryViewComponent,
    StatsLoaderComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
