import { Tenderer } from '../../../../modules/nest-tenderer-management/store/tenderer/tenderer.model';
import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { VerticalTabsStep } from "../../vertical-tabs/interfaces/vertical-tabs-step";
import { SettingsService } from "../../../../services/settings.service";
import { fadeIn } from "../../../animations/basic-animation";
import { additionalDetailConstant } from "./additional-detail-constants";
import { CurriculumVitaeComponent } from './curriculum-vitae/curriculum-vitae.component';
import { TaxDetailsComponent } from './tax-details/tax-details.component';
import { BusinessOwnersDetailsComponent } from './business-owners-details/business-owners-details.component';
import { AssociatesDetailsComponent } from './associates-details/associates-details.component';
import { BusinessRegistrationDetailsComponent } from './business-registration-details/business-registration-details.component';

import { VerticalTabsComponent } from '../../vertical-tabs/vertical-tabs.component';

@Component({
    selector: 'app-additional-details',
    templateUrl: './additional-details.component.html',
    styleUrls: ['./additional-details.component.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [
    VerticalTabsComponent,
    BusinessRegistrationDetailsComponent,
    AssociatesDetailsComponent,
    BusinessOwnersDetailsComponent,
    TaxDetailsComponent,
    CurriculumVitaeComponent
],
})
export class AdditionalDetailsComponent implements OnInit {

  loading: boolean = false;
  fetchingAttachment: boolean = false;
  currentTab: string = 'business-registration';
  @Input() configuration: {
    hideBusinessRegistration: boolean,
    hideAssociatesDetails: boolean,
    hideBusinessOwners: boolean,
    hideTaxDetails: boolean,
    hideCv: boolean,
  }
  isIndividualRegistration: boolean = false;
  @Input() tenderer: Tenderer;
  @Input() tendererSide: boolean = false;
  @Input() tendererUuid;
  @Input() embassy: boolean = false;
  @Input() ppra: boolean = false;

  tabItems: VerticalTabsStep[] = additionalDetailConstant.generalItems;

  constructor(
    private activeRoute: ActivatedRoute,
    private settingService: SettingsService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.isIndividualRegistration = ['INDIVIDUAL_LOCAL', 'INDIVIDUAL_FOREIGN'].includes(this.tenderer?.tendererType);
    if (this.isIndividualRegistration) {
      this.tabItems = additionalDetailConstant.individualItems;
    }

    if (this.configuration) {
      if (this.configuration.hideBusinessRegistration) {
        this.tabItems = this.tabItems.filter(item => item.id != 'business-registration');
        this.currentTab = 'associate-details';
      }
      if (this.configuration.hideAssociatesDetails) {
        this.tabItems = this.tabItems.filter(item => item.id != 'associate-details');
        this.currentTab = 'business-owners';
      }
      if (this.configuration.hideBusinessOwners) {
        this.tabItems = this.tabItems.filter(item => item.id != 'business-owners');
        this.currentTab = 'tax-details';
      }
      if (this.configuration.hideTaxDetails) {
        this.tabItems = this.tabItems.filter(item => item.id != 'tax-details');
      }
      if (this.configuration.hideCv) {
        this.tabItems = this.tabItems.filter(item => item.id != 'curriculum-vitae');
      }
    }
  }

  onStepSelection(selectedTab) {
    this.currentTab = selectedTab;
  }

  async viewAttachment(attachmentUuid: string) {
    // this.fetchingAttachment = true;
    //
    // try {
    //   const antiBriberyPolicy = await firstValueFrom(this.http
    //     .post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment/list/`, [
    //       attachmentUuid
    //     ]));
    //
    //   this.settingService.viewFile(antiBriberyPolicy[0].signedDocBase64Attachment, 'pdf').then( () =>  this.fetchingAttachment = false);
    // } catch (e) {
    //   this.fetchingAttachment = false;
    //   console.error(e);
    // }

  }

  setCurrentTab(currentTab: string) {
    this.tabItems = this.tabItems.map((item: VerticalTabsStep) => {
      item.isActive = (item.id == currentTab);
      return item;
    });
  }
}
