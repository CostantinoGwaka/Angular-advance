import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SaveAreaComponent } from '../../save-area/save-area.component';
import { GraphqlService } from 'src/app/services/graphql.service';
import { NotificationService } from 'src/app/services/notification.service';
// import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { ApplicationState } from 'src/app/store';
import { select, Store } from '@ngrx/store';
import { SettingsService } from 'src/app/services/settings.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReplacePipe } from 'src/app/shared/pipes/replace.pipe';
import { LoaderComponent } from '../../loader/loader.component';
import { TableConfiguration } from '../../paginated-data-table/paginated-table-configuration.model';
import { FullDataTableComponent } from '../../full-data-table/full-data-table.component';
import { BusinessOwnerField } from '../additional-details/business-owners-details/upsert-owners/business-owner-form-fields';
import { InfoWrapperComponent } from '../../info-wrapper/info-wrapper.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { DoNotSanitizePipe } from 'src/app/shared/word-processor/pipes/do-not-sanitize.pipe';
import { selectAllAuthUsers } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { HTMLDocumentService } from 'src/app/services/html-document.service';
import { BrelaShareCalculatorService } from './brela-calculator/brela-share-calculator.service';
import { UPDATE_TENDERER_DETAILS } from 'src/app/modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import { ApolloNamespace } from 'src/app/apollo.config';

interface Owner {
  shareId: string;
  name: string;
  email: string;
  identificationNumber: string;
  ownershipValue: string;
  percentage: number;
  countryCode: string;
  phoneNumber: string;
  incorporation_number?: string;
  children?: Owner[]; // To store child owners
}

interface ChildOwner {
  companyName: string;
  values: Owner[];
}

@Component({
  selector: 'app-update-tenderer-details',
  standalone: true,
  imports: [MatProgressSpinnerModule, DoNotSanitizePipe,
    InfoWrapperComponent, DecimalPipe, MatIconModule, MatButtonModule, FormsModule, ReplacePipe, LoaderComponent, SaveAreaComponent],
  templateUrl: './update-tenderer-details.component.html',
  styleUrl: './update-tenderer-details.component.scss'
})

export class UpdateTendererDetailsComponent {

  tenderer: any;
  regNumber: string;
  brelaData: any;
  firstbrelaData: any;
  levels: number;
  companyName: string;
  businessType: string;
  physicalAddress: string;
  postalAddress: string;
  phoneNumber: string;
  email: string;
  tinNumber: string;
  expiringDate: string;
  isDownloding: boolean = false;
  summaryAfterValidate: any;
  description: string;
  totalOwnershipSum: any;
  loaderMessage = 'Please wait, while loading information....';
  message: string;
  status: string;
  regNo: string;
  allReasonCaluation: any;
  fetching: boolean = false;
  savingData: boolean = false;
  businessOwnersList: any = [];
  businessOwnersListaLLocal: any[] = [];
  notRemovedbusinessOwnersListaLLocal: any[] = [];
  publicnotRemovedbusinessOwnersListaLLocal: any[] = [];
  mainStatistics: any;

  tableConfigurations: TableConfiguration = {
    tableColumns: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'email', label: 'Email' },
      { name: 'identificationNumber', label: 'National ID' },
      { name: 'ownershipValue', label: 'Ownership Value' },
      { name: 'phoneNumber', label: 'Phone Number' },
    ],
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: false,
    useFullObject: true,
    showBorder: true,
    allowPagination: false,
    actionIcons: {
      edit: false,
      delete: false,
      more: false,
      print: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    empty_msg: 'No users found',
  };

  constructor(
    private apollo: GraphqlService,
    private http: HttpClient,
    private store: Store<ApplicationState>,
    private settingService: SettingsService,
    private attachmentService: AttachmentService,
    private notificationService: NotificationService,
    private brelaShareCalculatorService: BrelaShareCalculatorService,
    private htmlDocumentService: HTMLDocumentService,
    @Inject(MAT_DIALOG_DATA) data: {
      tenderer: any;
    },
    private _dialogRef: MatDialogRef<UpdateTendererDetailsComponent>
  ) {
    this.tenderer = data.tenderer;
    this.regNumber = this.tenderer.brelaNumber;
  }

  close(event) {
    this._dialogRef.close(true);
  }

  mapFunction(item: BusinessOwnerField) {
    return {
      ...item,
      country: item.country ? item.country?.name : item.countryName,
      fullName: `${item?.name}`
    }
  }

  calculatePercentage(listValue: any[], value: number): number {
    if (!listValue || listValue.length === 0) {
      return 0; // Return 0 if the list is empty
    }

    // Convert `number_of_shares` to a number before summing
    let totalOwnershipValue = listValue.reduce((sum, owner) => sum + (Number(owner.number_of_shares) || 0), 0);

    if (totalOwnershipValue === 0) {
      return 0; // Avoid division by zero
    }

    let percentage = (value / totalOwnershipValue) * 100;
    return parseFloat(percentage.toFixed(5)); // Apply five decimal places;
  }


  async checkMethod(brelaNambuer?: String, secondTime: boolean = false, companyName?: String, level?: number) {
    this.fetching = true;
    this.levels = 1;
    // ${ this.regNumber }
    try {
      const data = await firstValueFrom(this.http.get<any>(
        secondTime && brelaNambuer ? `https://training.nest.go.tz/gateway/nest-api/api/brela/company-data/${brelaNambuer}`
          : `https://training.nest.go.tz/gateway/nest-api/api/brela/company-data/22018`
      ));
      if (data && data?.companyName) {
        this.companyName = data?.companyName;
        this.businessType = data?.businessType;
        this.physicalAddress = data?.physicalAddress == null ? "" : data?.physicalAddress;
        this.postalAddress = data?.postalAddress;
        this.phoneNumber = data?.phoneNumber;
        this.tinNumber = data?.tinNumber;
        this.email = data?.email;
        // data from online
        this.brelaData = {
          companyName: data?.companyName,
          businessType: data?.businessType,
          physicalAddress: data?.physicalAddress == null ? "" : data?.physicalAddress,
          postalAddress: data?.postalAddress,
          phoneNumber: data?.phoneNumber,
          tinNumber: data?.tinNumber,
          email: data?.email,
          regDate: '',
          country: "Tanzania",
          issuedShareCapital: data?.issuedShareCapital,
          shareHolders: data?.shareHolders ?? [],
          hasRegisteredByBrela: true,
          shareholderShares: data?.shareholderShares ?? null
        }

        if (secondTime) {
          this.loaderMessage = 'Please wait, while loading information for ' + companyName;
        }

        if (!secondTime) {
          this.firstbrelaData = this.brelaData;
        }

        if (this.brelaData && this.brelaData?.shareHolders) {
          let shareHolderShares = this.brelaData.shareholderShares;
          this.brelaData.shareHolders.forEach((shareholder) => {
            let countryCode = shareholder?.country_of_passport ? shareholder?.country_of_passport :
              shareholder?.residence_country ? shareholder?.residence_country :
                shareholder?.country ? shareholder?.country : '';
            if (countryCode) {
              countryCode = countryCode.split('-')[1];
            } else {
              countryCode = 'TZ';
            }

            if (!secondTime) {
              this.businessOwnersList?.push({
                shareId: shareholder?.person_uid,
                name: this.getOwnerName(shareholder?.person_uid, shareHolderShares),
                email: shareholder?.email,
                identificationNumber: shareholder?.national_id ?
                  shareholder?.national_id?.toString() :
                  shareholder?.passport_number ? shareholder?.passport_number?.toString() : '',
                ownershipValue: this.getOwnershipValue(shareholder?.person_uid, shareHolderShares),
                percentage: this.calculatePercentage(shareHolderShares, this.getOwnershipValue(shareholder?.person_uid, shareHolderShares)),
                countryCode: countryCode ?? "",
                incorporation_number: shareholder?.incorporation_number,
                phoneNumber: shareholder?.mob_phone?.toString(),
              });
            }

            if (shareholder.type_of_person === 'PT-CB' && shareholder.country === 'CN-TZ' && shareholder.incorporation_number != null) {
              this.businessOwnersListaLLocal.push(shareholder);
            }

            if (secondTime) {

              this.businessOwnersListaLLocal = this.businessOwnersListaLLocal.filter(
                (item) => item.incorporation_number !== brelaNambuer
              );

              this.notRemovedbusinessOwnersListaLLocal.push({
                shareId: shareholder?.person_uid,
                companyName: companyName,
                level: level,
                name: this.getOwnerName(shareholder?.person_uid, shareHolderShares),
                email: shareholder?.email,
                identificationNumber: shareholder?.national_id ?
                  shareholder?.national_id?.toString() :
                  shareholder?.passport_number ? shareholder?.passport_number?.toString() : '',
                ownershipValue: this.getOwnershipValue(shareholder?.person_uid, shareHolderShares),
                percentage: this.calculatePercentage(shareHolderShares, this.getOwnershipValue(shareholder?.person_uid, shareHolderShares)),
                countryCode: countryCode ?? "",
                incorporation_number: shareholder?.incorporation_number,
                phoneNumber: shareholder?.mob_phone?.toString(),
              });

              this.notRemovedbusinessOwnersListaLLocal = this.notRemovedbusinessOwnersListaLLocal.filter(localOwner => {
                return !this.businessOwnersList.some(owner =>
                  owner.incorporation_number
                    ? owner.incorporation_number === localOwner.incorporation_number
                    : owner.name === localOwner.name
                );
              });

              this.notRemovedbusinessOwnersListaLLocal = this.notRemovedbusinessOwnersListaLLocal.filter((owner, index, self) =>
                index === self.findIndex(o => o.shareId === owner.shareId)
              );

              this.publicnotRemovedbusinessOwnersListaLLocal = Object.entries(
                this.notRemovedbusinessOwnersListaLLocal.reduce((acc, owner) => {
                  if (!acc[owner.companyName]) {
                    acc[owner.companyName] = [];
                  }
                  acc[owner.companyName].push(owner);
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([companyName, values]) => ({ companyName, values }));
            }

          });

          if (this.businessOwnersListaLLocal.length > 0) {
            this.checkOtheBusinessOwnersFromLocal(this.levels);
          }

        }
        this.fetching = false;
      } else {
        this.brelaData = null;
        this.fetching = false;
      }
    } catch (e) {
      this.brelaData = null;
      this.fetching = false;
      if (!secondTime) {
        this.notificationService.errorMessage('NeST has been unable to retrieve data from Brela. It looks like their servers are down or are not available');
      } else {
        console.error('NeST has been unable to retrieve data from Brela. It looks like their servers are down or are not available');
      }
    }
    this.mainStatistics = this.calculateOwnershipStats(this.businessOwnersList);

    const mergedOwners = this.createOwnershipTreeStrcture(this.businessOwnersList, this.publicnotRemovedbusinessOwnersListaLLocal);

    this.summaryAfterValidate = this.brelaShareCalculatorService.getCompanyOwnership(mergedOwners);

    this.allReasonCaluation = this.brelaShareCalculatorService.getCalculations(mergedOwners);

  }


  createOwnershipTreeStrcture(
    businessOwnersList,
    childOwnersList
  ): any[] {
    return businessOwnersList.map(owner => {
      // Find matching child ownerships
      const matchingChild = childOwnersList.find(child => child.companyName.trim() === owner.name.trim());

      // If found, attach child owners to the parent
      return {
        ...owner,
        owned_by: matchingChild ? matchingChild.values : []
      };
    });
  }

  calculateOwnershipStats(ownersList: any[]): any {
    if (!ownersList || ownersList.length === 0) {
      return {
        localCount: 0,
        foreignCount: 0,
        localPercentage: 0,
        foreignPercentage: 0
      };
    }

    // Count local and foreign owners
    let localCount = ownersList.filter(owner => owner.countryCode === 'TZ').length;
    let foreignCount = ownersList.filter(owner => owner.countryCode !== 'TZ').length;

    // Sum percentages for local and foreign owners
    let localPercentage = ownersList
      .filter(owner => owner.countryCode === 'TZ')
      .reduce((sum, owner) => sum + (Number(owner.percentage) || 0), 0);

    let foreignPercentage = ownersList
      .filter(owner => owner.countryCode !== 'TZ')
      .reduce((sum, owner) => sum + (Number(owner.percentage) || 0), 0);

    return {
      localCount,
      foreignCount,
      localPercentage: parseFloat(localPercentage.toFixed(2)), // Format to 2 decimal places
      foreignPercentage: parseFloat(foreignPercentage.toFixed(2)) // Format to 2 decimal places
    };
  }



  async checkOtheBusinessOwnersFromLocal(level) {
    for (let [index, shareholders] of this.businessOwnersListaLLocal.entries()) {
      let values = shareholders;
      let companyName = values?.name || values?.other_name || values?.company_name || '';
      await this.checkMethod(values.incorporation_number, true, companyName, level);
    }
    this.levels++;
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


  print() {
    let element: any = document.getElementById('sectionToPrint');
    const iframe = document.body.appendChild(document.createElement('iframe'));
    iframe.style.display = 'none';
    const idoc = iframe.contentDocument;
    idoc.head.innerHTML = document.head.innerHTML;
    idoc.body.innerHTML = element.innerHTML;
    window.setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 1000);
  }

  async saveUpdateFunction() {

    this.savingData = true;

    let dataToSave = {
      email: "",
      majorityOwnershipTypeReason: "majorityOwnershipTypeReason",
      majorityOwnershipType: "majorityOwnershipType",
      uuid: "tendererUuid",
    };

    try {
      const response: any = await this.apollo.mutate({
        mutation: UPDATE_TENDERER_DETAILS,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererDetailDto: dataToSave,
        }
      });

      if (response.data.updateTendererDetails?.code != 9000) {
        this.savingData = false;
      } else {
        this.savingData = false;
        this.notificationService.successMessage("Company Information Updated successfully");
      }

    } catch (e) {
      this.notificationService.errorMessage("Error Updating Company Information");
      this.savingData = false;
    }
  }

}
