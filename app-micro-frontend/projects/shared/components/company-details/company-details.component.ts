import { PreviewCvComponent } from './../preview-cv/preview-cv.component';
import { map, first } from 'rxjs/operators';
import { select } from '@ngrx/store';
import { selectAllUsers } from './../../../modules/nest-uaa/store/user-management/user/user.selectors';
import { Store } from '@ngrx/store';
import { ApplicationState } from 'src/app/store';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { Embassy } from './../../../modules/nest-pe-management/store/embassy/embassy.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { VerticalTabsStep } from "../vertical-tabs/interfaces/vertical-tabs-step";
import { SettingsService } from "../../../services/settings.service";
import { Tenderer } from "../../../modules/nest-tenderer-management/store/tenderer/tenderer.model";
import { environment } from "../../../../environments/environment";
import { Institution } from "../../../modules/nest-pe-management/store/institution/institution.model";
import { fadeIn } from "../../animations/router-animation";
import { MatBottomSheet, MatBottomSheetConfig } from "@angular/material/bottom-sheet";
import { SAVE_TENDERER, UPDATE_TENDERER_DETAILS } from 'src/app/modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { AdditionalDetailsComponent } from './additional-details/additional-details.component';
import { GovernmentTendererComponent } from './government-tenderer/government-tenderer.component';
import { CompanyBusinessLinesComponent } from './company-business-lines/company-business-lines.component';
import { ItemDetailWithIcon } from '../item-detail-with-icon/item-detail-with-icon';
import { LoaderComponent } from '../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { AlertDialogService } from '../alert-dialog/alert-dialog-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { UpdateBrelaNumberComponent } from 'src/app/modules/nest-tenderer-management/all-tenderer/view-tenderer/update-brela-number/update-brela-number.component';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    LoaderComponent,
    ItemDetailWithIcon,
    CompanyBusinessLinesComponent,
    GovernmentTendererComponent,
    AdditionalDetailsComponent,
    DatePipe,
    ReplacePipe
  ],
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  @Output() updateResume: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateCompany: EventEmitter<boolean> = new EventEmitter<boolean>();
  fetchingAttachment: { [id: string]: boolean } = {};
  @Input() showInstitutionProfile: boolean = false;
  @Input() showEmbassyProfile: boolean = false;
  @Input() institution: Institution;
  @Input() user: User;
  @Input() tendererSide: boolean = false;
  @Input() embassy: Embassy;
  @Input() tenderer: Tenderer;
  @Input() showDetailedProfile: boolean = true;
  @Output() updateBusinessLines = new EventEmitter<any>();
  users: User;

  //brela data update
  companyName: string;
  companyRegNumber: string;
  businessType: string;
  physicalAddress: string;
  postalAddress: string;
  phoneNumber: string;
  tinNumber: string;
  email: string;
  fetchingDetails: boolean = false;
  brellaFailed: boolean = false;
  tinRequired = false;
  fetchingData = false;
  businessOwnersList: any = [];


  additionalDetailsConfig = {
    hideBusinessRegistration: false,
    hideAssociatesDetails: true,
    hideBusinessOwners: false,
    hideTaxDetails: false,
    hideCv: true,

  };
  currentTab: string = 'company-experience';
  tabItems: VerticalTabsStep[] = [
    {
      label: "Company Work Experience",
      id: "company-experience",
      isActive: true,
    },
    {
      label: "Personnel Information",
      id: "personnel-profile",
      isActive: false,
    },
    {
      label: "Financial Statement",
      id: "financial-capability",
      isActive: false,
    },
    {
      label: "Work Equipments",
      id: "work-equipment",
      isActive: false,
    },
    {
      label: "Litigation Records",
      id: "litigation-record",
      isActive: false,
    },
    {
      label: "Office Locations",
      id: "office-location",
      isActive: false,
    },
    {
      label: "Financial Resources",
      id: "financial-resources",
      isActive: false,
    },
    {
      label: "Annual Turnover",
      id: "annual-turnover",
      isActive: false,
    },
  ];
  routeSub = Subscription.EMPTY;

  constructor(
    private activeRoute: ActivatedRoute,
    private settingService: SettingsService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private apollo: GraphqlService,
    private _bottomSheet: MatBottomSheet,
    private alertDialogService: AlertDialogService,
    private store: Store<ApplicationState>,
    private router: Router,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    if (!this.showInstitutionProfile) {
      this.routeSub = this.activeRoute.queryParams.subscribe(items => {
        this.currentTab = items['tab'] ?? 'company-experience';
        this.setCurrentTab(this.currentTab);
      })
    }
    if (this.tenderer?.tendererType == 'COMPANY_FOREIGN') {
      this.additionalDetailsConfig.hideAssociatesDetails = false;
    }

    // for special group
    else if ((['SPECIAL_GROUP', 'GOVERNMENT_ENTERPRISE'].includes(this.tenderer?.tendererType))) {
      this.additionalDetailsConfig.hideBusinessOwners = true;
    }
    this.onEmbassy().then();

  }

  async onEmbassy() {
    this.users = await firstValueFrom(this.store.pipe(select(selectAllUsers), map(items => items[0]), first(i => !!i)));
  }

  onStepSelection(selectedTab) {
    this.currentTab = selectedTab;
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
  async viewAttachment(attachmentUuid: string) {
    this.fetchingAttachment[attachmentUuid] = true;

    try {
      const antiBriberyPolicy = await firstValueFrom(this.http
        .post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment/list/`, [
          attachmentUuid
        ]));

      this.settingService.viewFile(antiBriberyPolicy[0].signedDocBase64Attachment, 'pdf').then(() => this.fetchingAttachment[attachmentUuid] = false);
    } catch (e) {
      this.fetchingAttachment[attachmentUuid] = false;
      console.error(e);
    }
  }

  viewTendererCv(tenderer?: Tenderer) {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.panelClass = ['bottom__sheet', 'w-100'];
    config.data = { tenderer: tenderer, allview: true };
    this._bottomSheet.open(PreviewCvComponent, config);
  }

  setCurrentTab(currentTab: string) {
    this.tabItems = this.tabItems.map((item: VerticalTabsStep) => {
      item.isActive = (item.id == currentTab);
      return item;
    });
  }

  getBudgetingSystem(data: string) {
    switch (data) {
      case 'PLAN_REP_TAMI':
        return 'PLANREP TAMISEMI';
      case 'PLAN_REP_OTR':
        return 'PLANREP OTR';
      case 'OTHER':
        return 'OTHER';
      default:
        return 'NOT SET'
    }
  }

  updateCurrentBusinessLines() {
    this.updateBusinessLines.emit();
  }

  updateBrelaNumber(uuid: string, name: string) {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      tendererUuid: uuid,
      tendererName: name,
    };

    config.panelClass = ['bottom__sheet'];

    this._bottomSheet.open(UpdateBrelaNumberComponent, config).afterDismissed()
      .subscribe(
        async (data) => {
          this.router.navigateByUrl('/nest-tenderer/dashboard').then();
        });
  }

  getOwnerName(personId: string, shareList: any[]) {
    let value = shareList?.find(share => share?.shareholder_item == personId);
    if (value && value?.shareholder_name) {
      return value?.shareholder_name;
    }
    return '';
  }
  getOwnershipNames(personId: string, shareList: any[]) {
    let value = shareList?.find(share => share?.shareholder_item == personId);
    if (value && value?.number_of_shares) {
      return value?.number_of_shares.toString();
    }
    return '';
  }

  getOwnershipValue(personId: string, shareList: any[]) {
    let value = shareList?.find(share => share?.shareholder_item == personId);
    if (value && value?.number_of_shares) {
      return value?.number_of_shares.toString();
    }
    return '';
  }

  async updateCompanyBrela(brela: boolean = false, tendererUuid, brelaNumber) {

    let businessOwnersListaLL = [];

    let hasError = false;

    if (brela && (brelaNumber == null || brelaNumber == '' || brelaNumber === undefined || brelaNumber == 'N/A')) {
      hasError = true;
      this.alertDialogService.openDialog(
        {
          title: 'Error',
          status: 'warning',
          showCancelBtn: false,
          message: 'No brela number found. Please contact PPRA'
        }).then(async (action) => {
        });
      return;
    }

    if (!hasError) {
      this.fetchingData = true;

      let data;
      let dataToSave = {};

      const currentClient = this.storageService.getItem('currentClient');

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + currentClient,
        'Content-Type': 'application/json',
      });

      if (brela) {
        data = await firstValueFrom(this.http.get<any>(environment.SERVER_URL + `/nest-api/api/brela/company-data/${brelaNumber}`));
      } else {
        data = await firstValueFrom(this.http.get<any>(environment.SERVER_URL + `/nest-api/tra/tin/${brelaNumber}`, { headers }));
      }

      if (brela && data && data?.companyName) {
        this.companyName = data?.companyName;
        this.businessType = data?.businessType;
        this.physicalAddress = data?.physicalAddress == null ? "" : data?.physicalAddress;
        this.postalAddress = data?.postalAddress;
        this.phoneNumber = data?.phoneNumber;
        this.tinNumber = data?.tinNumber;
        this.email = data?.email;

        // data from online
        let brelaData = {
          companyName: data?.companyName,
          businessType: data?.businessType,
          physicalAddress: data?.physicalAddress == null ? "" : data?.physicalAddress,
          postalAddress: data?.postalAddress,
          phoneNumber: data?.phoneNumber,
          tinNumber: data?.tinNumber,
          email: data?.email,
          regDate: '',
          country: "Tanzania",
          shareHolders: data?.shareHolders ?? [],
          hasRegisteredByBrela: true,
          shareholderShares: data?.shareholderShares ?? null
        }

        if (brelaData && brelaData?.shareHolders) {
          // let shareHolderShares = this.brelaData.shareholderShares;
          let shareHolderShares = brelaData.shareholderShares;
          brelaData.shareHolders.forEach((shareholder) => {
            let countryCode = shareholder?.country_of_passport ? shareholder?.country_of_passport :
              shareholder?.residence_country ? shareholder?.residence_country :
                shareholder?.country ? shareholder?.country : '';
            if (countryCode) {
              countryCode = countryCode.split('-')[1];
            } else {
              countryCode = 'TZ';
            }

            businessOwnersListaLL?.push({
              name: this.getOwnerName(shareholder?.person_uid, shareHolderShares),
              legalPersonName: this.getOwnerName(shareholder?.person_uid, shareHolderShares),
              tendererBusinessOwnersType: "NATURAL_PERSON",
              tendererBusinessOwnershipDetailsUuid: null,
              email: shareholder?.email,
              identificationNumber: shareholder?.national_id ?
                shareholder?.national_id?.toString() :
                shareholder?.passport_number ? shareholder?.passport_number?.toString() : '',
              ownershipValue: this.getOwnershipValue(shareholder?.person_uid, shareHolderShares),
              countryCode: countryCode ?? '',
              phoneNumber: shareholder?.mob_phone?.toString(),
            });

          });

          this.businessOwnersList = businessOwnersListaLL;
        }

        this.fetchingDetails = false;
        this.brellaFailed = false;

        dataToSave = {
          physicalAddress: brelaData?.physicalAddress,
          uuid: tendererUuid,
          phoneNumber: brelaData?.phoneNumber,
          postalAddress: brelaData?.postalAddress,
          hasRegisteredByBrela: true,
          brelaNumber: data?.companyNo,
          companyName: brelaData?.companyName,
          majorityOwnershipType: null,
          majorityOwnershipTypeReason: null,
          tendererBusinessOwnersDetailList: this.businessOwnersList,
        };

      } else {
        this.companyName = data?.tpname;
        this.businessType = data?.businessactivity;
        this.physicalAddress = `${data?.location} ${data?.district} ${data?.region}`;
        this.postalAddress = `${data?.pobox} ${data?.postalcity}`;
        this.phoneNumber = data?.telephone1 || data?.telephone2;
        this.email = data?.email;
        this.tinNumber = data?.otin;

        let tinData = {
          companyName: data?.tpname,
          businessType: data?.businessactivity,
          physicalAddress: `${data?.location} ${data?.district} ${data?.region}`,
          postalAddress: `${data?.pobox} ${data?.postalcity}`,
          phoneNumber: data?.telephone1 || data?.telephone2,
          email: data?.email,
          tinNumber: data?.otin,
          tinType: data?.tinType,
          firstName: data?.firstname,
          middleName: data?.middlename,
          lastName: data?.lastname,
          hasRegisteredByBrela: false,
          country: "Tanzania"
        }

        this.brellaFailed = true;
        this.fetchingData = false;

        dataToSave = {
          physicalAddress: tinData?.physicalAddress,
          phoneNumber: tinData?.phoneNumber,
          uuid: tendererUuid,
          postalAddress: tinData?.postalAddress,
          hasRegisteredByBrela: false,
          companyName: tinData?.companyName,
        };

      }

      try {
        const response: any = await this.apollo.mutate({
          mutation: UPDATE_TENDERER_DETAILS,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            tendererDetailDto: dataToSave,
          }
        });

        if (response.data.updateTendererDetails?.code != 9000) {
          this.notificationService.errorMessage(
            `Fail to update info from  ${brela ? 'Brela' : 'TRA'}`);
          this.fetchingData = false;
          return;
        } else {
          this.notificationService.successMessage(
            `Company Information Updated Successfully from ${brela ? 'Brela' : 'TRA'} successfully`
          );
          // this.router.navigateByUrl('/nest-tenderer/dashboard').then();
          this.fetchingData = false;
          this.updateCompany.emit();
          return;

        }

      } catch (e) {
        this.notificationService.errorMessage("Error Updating Company Information");
        this.fetchingData = false;
      }
    }

  }

  showIndividualResumeForm(condition) {
    this.updateResume.emit(condition);
  }

}
