import { catchError, first, firstValueFrom, map, throwError, timeout } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '../../../dynamic-forms-components/dynamic-form.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule } from '@angular/forms';
import { GraphqlService } from '../../../../../services/graphql.service';
import { NotificationService } from '../../../../../services/notification.service';
import { FieldConfig, FieldType } from '../../../dynamic-forms-components/field.interface';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import {
  CREATE_GOV_COMPLIANCE,
  CREATE_TENDERER_GOV_COMPLIANCE,
  GET_GOV_COMPLIANCES,
  GET_MAIN_OFFICE_DETAILS,
  GET_TENDERER_GOVERNMENT_COMPLIANCE_BY_TIN_AND_COMPLIANCE_UUID
} from "../../../../../modules/nest-tenderer-management/store/gov-compliance/gov-compliance.graphql";
import { ApplicationState } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { selectAllUsers } from 'src/app/modules/nest-uaa/store/user-management/user/user.selectors';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { LoaderComponent } from '../../../loader/loader.component';
import { SaveAreaComponent } from '../../../save-area/save-area.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PaginatedSelectComponent } from '../../../dynamic-forms-components/paginated-select/paginated-select.component';
import { ModalHeaderComponent } from '../../../modal-header/modal-header.component';
import { ReplacePipe } from 'src/app/shared/pipes/replace.pipe';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
  selector: 'app-add-government',
  templateUrl: './add-government.component.html',
  styleUrls: ['./add-government.component.scss'],
  standalone: true,
  imports: [ModalHeaderComponent, PaginatedSelectComponent, ReplacePipe, FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, SaveAreaComponent, LoaderComponent]
})
export class AddGovernmentComponent implements OnInit {

  @Output() closeForm = new EventEmitter<boolean>();
  selectedPeUid: string;
  selectedTE: string;
  loading = false;
  @Input() selectedUuid: string;
  billableEntityType: string;
  billableEntityUuid: string;
  govTypeEnum: any;
  selectServices: [];
  description: string;
  govType: string;
  supportForm: UntypedFormGroup;
  constraintEnum: any;
  govNumber: number;
  employerName: string;
  tinNumber: string;
  officePhone: string;
  officeMail: string;
  businessType: string;
  businessSector: string;
  postalAddress: string;
  physicalAddress: string;
  industry: string;
  sector: string;
  businessRegistrationNumber: string;
  businessRegistrationDate: string;
  sourceOfRegistration: string;
  tin_number: string;
  bussiness_type: string;
  business_sector: string;
  office_phone: string;
  office_location: string;
  employer_name: string;
  postal_address: string;
  physical_address: string;
  office_mail: string;
  bussiness_registration_number: string;
  bussiness_registration_date: string;
  source_of_registration: string;
  searchSearch: boolean = false;
  numberOfEmployees: string;
  loadingchecking: boolean = false;
  fetchedData: any;
  complianceCheckData: any;
  registeredData: any;
  user: User;
  tendererType: any;
  selectedPeData: any;
  noData: boolean = false;
  isNssfRegistration: boolean = false;
  governConfiguration: any;
  fetchSavedDate: any;


  field: FieldConfig = {
    type: FieldType.paginatedselect,
    query: GET_GOV_COMPLIANCES,
    apolloNamespace: ApolloNamespace.uaa,
    optionName: 'name',
    optionValue: 'uuid',
    searchFields: ['name'],
    sortField: 'name',
    dynamicPipes: [],
    icon: 'account_balance',
    hint: '',
    label: 'Select Government Compliance',
    key: 'selectedPeUid',
    mapFunction: (item) => ({ ...item }),
    mustHaveFilters: [],
    rowClass: 'col12',
    pageSize: 100,
    validations: [{ message: 'This field is Required', validator: Validators.required, name: 'required' }],
  };

  constructor(
    private dynamicFormService: DynamicFormService,
    private fb: UntypedFormBuilder,
    private dialogRef: MatBottomSheetRef<AddGovernmentComponent>,
    private apollo: GraphqlService,
    private http: HttpClient,
    private store: Store<ApplicationState>,
    private notificationService: NotificationService,
    private _bottomSheetRef: MatBottomSheetRef<AddGovernmentComponent>,
  ) {
    this.govTypeEnum = [
      {
        name: 'Registered',
        value: 'REGISTERED'
      },
      {
        name: 'Not Registered',
        value: 'UN_REGISTERED'
      }
    ];
  }


  ngOnInit(): void {
    this.getData().then();
  }

  async checkRegistration(uuid) {
    this.loadingchecking = true;
    const response: any = await this.apollo.fetchData({
      query: GET_TENDERER_GOVERNMENT_COMPLIANCE_BY_TIN_AND_COMPLIANCE_UUID,
      apolloNamespace: ApolloNamespace.uaa,
      variables: {
        customTendererGovernmentComplianceRequestDTO: {
          governmentComplianceUuid: uuid,
          tinNumber: this.user?.tenderer.taxIdentificationNumber.toString(),
        }
      }
    });
    const dataEv = response.data.getTendererGovernmentComplianceByTinAndComplianceUuid?.data;

    if (response.data.getTendererGovernmentComplianceByTinAndComplianceUuid?.code == 9000) {
      this.fetchSavedDate = dataEv;
    }
    this.loadingchecking = false;
  }

  async getData() {
    this.user = await firstValueFrom(this.store.pipe(select(selectAllUsers), first(items => items.length > 0), map(i => i[0])));
  }

  selectedgovType(event) {
    this.fetchedData = null;
    this.govNumber = null;
  }

  close(shouldUpdate) {
    this._bottomSheetRef.dismiss();
    this.closeForm.emit(shouldUpdate);
  }


  async retriveData() {
    this.searchSearch = true;

    let officeDetails;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${month}/${day}/${year}`;

    try {
      const response: any = await this.apollo.fetchData({
        query: GET_MAIN_OFFICE_DETAILS,
        apolloNamespace: ApolloNamespace.uaa,
      });
      const values: any = response?.data?.getMainOfficeDetails;
      if (values?.code == 9000) {
        officeDetails = values?.data;
      }
    }
    catch (e) { }

    const data = await firstValueFrom(this.http
      .post<any>(this.governConfiguration.registrationCheckUrl, {
        regNo: `${this.govNumber}`,
      }).pipe(
        timeout(60000),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            this.searchSearch = false;
            this.notificationService.errorMessage('Failure on fetching Information');
            this.closeModal();
            return throwError('Request timed out');
          }
          this.searchSearch = false;
          this.notificationService.errorMessage('Failure on fetching Information');
          this.closeModal();
          return throwError(error);
        })
      ));
    if (data) {
      this.searchSearch = false;
      this.loading = false;
      //data found

      this.fetchedData = data;

      try {
        if (this.fetchedData.message) {
          const response = await this.apollo.mutate({
            mutation: CREATE_TENDERER_GOV_COMPLIANCE,
            apolloNamespace: ApolloNamespace.uaa,
            variables: {
              governmentComplianceRequestDTO: {
                complianceStatus: (this.fetchedData.message == "NOT_REGISTERED" || this.fetchedData.message == 0) ? "NOT_COMPLY" : "COMPLY",
                governmentComplianceUuid: this.selectedPeData,
                registrationNumber: this.fetchedData?.nssf_employer_number ?? this.fetchedData?.employer_number,
                registrationStatus: (this.fetchedData.message == "NOT_REGISTERED" || this.fetchedData.message == 0) ? "NOT_REGISTERED" : "REGISTERED",
                tendererUuid: this.user?.tenderer?.uuid,
                bussinessRegistrationDate: formattedDate,
                bussinessType: this.user?.tenderer?.businessType,
                contactPersonEmail: this.user?.email,
                contactPersonName: this.user?.firstName + " " + this.user?.middleName + " " + this.user?.lastName,
                contactPersonPhone: this.user?.tenderer.phone,
                contactPersonTitle: this.user.rolesListStrings[0],
                district: officeDetails?.district ?? "Not Found",
                numberOfEmployees: "" + this.numberOfEmployees,
                ownerEmail: this.user?.email,
                ownerPhone: this.user?.tenderer.phone,
                ownerTittle: this.user.rolesListStrings[0],
                region: officeDetails?.region ?? "Not Found",
                ward: officeDetails?.ward ?? "Not Found",
                sourceOfRegistration: 'NeST',
                ownerName: this.user?.firstName + " " + this.user?.middleName + " " + this.user?.lastName,
                temporaryRegistrationNumber: this.registeredData?.regNo ?? this.registeredData?.employer_number,
                uuid: null,
                commencementDate: formattedDate
              },
            },
          });

          if (response.data.createTendererGovernmentCompliance.code == 9005) {
            this.notificationService.errorMessage(response.data.createTendererGovernmentCompliance.message);
          }
        }


      } catch (e) {
        this.notificationService.errorMessage('Failed to save');
      }

    } else {
      this.searchSearch = false;
      this.noData = true;
      this.loading = false;
      this.notificationService.errorMessage('Failure on fetching Information');
      this.closeModal();
      //data not found
    }
  }

  async complianceCheck(govNumber, check = false) {
    this.searchSearch = true;
    const data = await firstValueFrom(this.http
      // environment.SERVER_URL + `/nest-api/api/nssf/compliance/status`
      .post<any>(`${this.governConfiguration.complianceCheckUrl}`, {
        regNo: `${govNumber}`,
      }).pipe(
        timeout(60000),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            this.searchSearch = false;
            this.notificationService.errorMessage('Failure on fetching Information');
            this.closeModal();
            return throwError('Request timed out');
          }
          this.searchSearch = false;
          this.notificationService.errorMessage('Failure on fetching Information');
          this.closeModal();
          return throwError(error);
        })
      ));
    if (data) {
      this.notificationService.successMessage('Information Found');
      this.searchSearch = false;
      this.loading = false;
      //data found
      this.complianceCheckData = data;
      if (this.complianceCheckData?.message) {
        const response = await this.apollo.mutate({
          mutation: CREATE_TENDERER_GOV_COMPLIANCE,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            governmentComplianceRequestDTO: {
              tendererUuid: this.user?.tenderer?.uuid,
              registrationNumber: govNumber,
              complianceStatus: this.complianceCheckData?.message == 'UN_COMPLIED' ? 'NOT_COMPLY' : 'COMPLY',
              registrationStatus: (this.complianceCheckData?.status == 'Not-registered' || this.complianceCheckData?.status == 0) ? "NOT_REGISTERED" : "REGISTERED",
              governmentComplianceUuid: this.selectedPeData,
            },
          },
        });

        if (response.data.createTendererGovernmentCompliance.code == 9005) {
          this.notificationService.errorMessage(response.data.createTendererGovernmentCompliance.message);
        } else if (response.data.createTendererGovernmentCompliance.code == 9000) {
          this.notificationService.successMessage("Information updated successfully");
          if (check) {
            this.closeModal();
          }
        }
      }
      this.searchSearch = false;
      // return this.complianceCheckData;
    } else {
      this.searchSearch = false;
      this.noData = true;
      this.notificationService.errorMessage('Failure on fetching Information');
      this.closeModal();
      //data not found
    }
  }

  async saveInformation() {
    this.loading = true;
    this.user = await firstValueFrom(this.store.pipe(select(selectAllUsers), first(items => items.length > 0), map(i => i[0])));
    const data: any = await this.complianceCheck(this.fetchedData?.nssf_employer_number ?? this.fetchedData?.employer_number, true);

    //save
    try {

      const response = await this.apollo.mutate({
        mutation: CREATE_TENDERER_GOV_COMPLIANCE,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          governmentComplianceRequestDTO: {
            complianceStatus: data?.message == 'UN_COMPLIED' ? 'NOT_COMPLY' : 'COMPLY' ?? "NOT_COMPLY",
            governmentComplianceUuid: this.selectedPeData,
            registrationNumber: this.fetchedData?.nssf_employer_number ?? this.fetchedData?.employer_number,
            registrationStatus: this.fetchedData?.message, //REGISTERED NOT_REGISTERED
            tendererUuid: this.user?.tenderer?.uuid,
            uuid: null,
          },
        },
      });

      if (response.data.createTendererGovernmentCompliance.code == 9005) {
        this.notificationService.errorMessage(response.data.createTendererGovernmentCompliance.message);
      } else if (response.data.createTendererGovernmentCompliance.code != 9000) {
        console.error(response.data.createTendererGovernmentCompliance);
        this.notificationService.errorMessage('Problem occurred while saving information, please try again');
        this.loading = false;
      } else {
        this.notificationService.successMessage('Saved Successfully');
        this.loading = false;
        this.closeModal();
      }

    } catch (e) {
      this.notificationService.errorMessage('Failed to save');
    }
    this.loading = false;
  }

  async saveNSSFRegisterData() {
    let officeDetails;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${month}/${day}/${year}`;

    try {
      const response: any = await this.apollo.fetchData({
        query: GET_MAIN_OFFICE_DETAILS,
        apolloNamespace: ApolloNamespace.uaa,
      });
      const values: any = response?.data?.getMainOfficeDetails;
      if (values?.code == 9000) {
        officeDetails = values?.data;
      }
    }
    catch (e) { }
    this.loading = true;

    let nssfOtherField = {
      employer_name: this.user?.tenderer.name,
      tin_number: this.user?.tenderer.taxIdentificationNumber.toString().padStart(3, '0').match(/.{1,3}/g)?.join('-'),
      office_mail: this.user?.email,
      office_phone: this.user?.tenderer.phone,
      industry: "Not Found",
      bussiness_type: this.user?.tenderer.businessType,
      physical_address: this.user?.tenderer.physicalAddress,
      office_location: this.user?.tenderer.physicalAddress,
      business_sector: "Not Found",
      bussiness_registration_date: formattedDate,
      bussiness_registration_number: this.user?.tenderer?.taxIdentificationNumber,
      postal_address: this.user?.tenderer.postalAddress,
      sector: "Not Found",
      source_of_registration: 'NeST',

      contact_person_name: this.user?.firstName + " " + this.user?.middleName + " " + this.user?.lastName,
      contact_person_title: this.user.rolesListStrings[0],
      contact_person_phone: this.user?.tenderer.phone,
      owner_title: officeDetails?.directorTitle ?? "Not Found",
      ward: officeDetails?.ward ?? "Not Found",
      district: officeDetails?.district ?? "Not Found",
      region: officeDetails?.region ?? "Not Found",
      owner_name: this.user?.firstName + " " + this.user?.middleName + " " + this.user?.lastName,
      owner_email: this.user?.email,
      owner_tittle: this.user.rolesListStrings[0],
      owner_phone: this.user?.tenderer.phone,
      contact_person_email: this.user?.email,
      commencement_date: formattedDate,
      number_of_employees: this.numberOfEmployees?.toString() ?? 0,
    }


    let normalField = {
      employer_name: this.user?.tenderer.name,
      tin_number: this.user?.tenderer.taxIdentificationNumber.toString().padStart(3, '0').match(/.{1,3}/g)?.join('-'),
      office_mail: this.user?.email,
      office_phone: this.user?.tenderer.phone,
      industry: "Not Found",
      bussiness_type: this.user?.tenderer.businessType,
      physical_address: this.user?.tenderer.physicalAddress,
      office_location: this.user?.tenderer.physicalAddress,
      business_sector: "Not Found",
      bussiness_registration_date: formattedDate,
      bussiness_registration_number: this.user?.tenderer?.taxIdentificationNumber,
      postal_address: this.user?.tenderer.postalAddress,
      sector: "Not Found",
      source_of_registration: 'NeST',
    }


    const data = await firstValueFrom(this.http
      .post<any>(this.governConfiguration?.registrationUrl, this.isNssfRegistration ? nssfOtherField : normalField).pipe(
        timeout(60000),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            this.searchSearch = false;
            this.loading = false;
            this.notificationService.errorMessage('Failure on sending Information');
            this.closeModal();
            return throwError('Request timed out');
          }
          this.loading = false;
          this.notificationService.errorMessage('Failure on sending Information');
          this.closeModal();
          return throwError(error);
        })
      ));
    if (data) {
      this.notificationService.successMessage('Successfully Sent to Government Compliance Agency');
      this.registeredData = data;
      try {
        if (this.registeredData?.regNo || this.registeredData?.employer_number) {
          const response = await this.apollo.mutate({
            mutation: CREATE_TENDERER_GOV_COMPLIANCE,
            apolloNamespace: ApolloNamespace.uaa,
            variables: {
              governmentComplianceRequestDTO: {
                complianceStatus: "NOT_COMPLY",
                governmentComplianceUuid: this.selectedPeData,
                registrationNumber: "NEW",
                registrationStatus: "NOT_REGISTERED",
                tendererUuid: this.user?.tenderer?.uuid,
                bussinessRegistrationDate: formattedDate,
                bussinessType: this.user?.tenderer?.businessType,
                contactPersonEmail: this.user?.email,
                contactPersonName: this.user?.firstName + " " + this.user?.middleName + " " + this.user?.lastName,
                contactPersonPhone: this.user?.tenderer.phone,
                contactPersonTitle: this.user.rolesListStrings[0],
                district: officeDetails?.district ?? "Not Found",
                numberOfEmployees: "" + this.numberOfEmployees ?? 0,
                ownerEmail: this.user?.email,
                ownerPhone: this.user?.tenderer.phone,
                ownerTittle: this.user.rolesListStrings[0],
                region: officeDetails?.region ?? "Not Found",
                ward: officeDetails?.ward ?? "Not Found",
                sourceOfRegistration: 'NeST',
                ownerName: this.user?.firstName + " " + this.user?.middleName + " " + this.user?.lastName,
                temporaryRegistrationNumber: this.registeredData?.regNo ?? this.registeredData?.employer_number,
                uuid: null,
                commencementDate: formattedDate
              },
            },
          });

          if (response.data.createTendererGovernmentCompliance.code == 9005) {
            this.notificationService.errorMessage(response.data.createTendererGovernmentCompliance.message);
          }
        }


      } catch (e) {
        this.notificationService.errorMessage('Failed to save');
      }
      this.searchSearch = false;
      this.loading = false;
      //data found
    } else {
      this.loading = false;
      this.notificationService.errorMessage('Failure on sending Information');
      this.closeModal();
    }
  }

  selectPE(event) {
    this.isNssfRegistration = false;
    if (event.object?.uuid) {
      this.selectedPeData = event.object?.uuid;
      this.governConfiguration = event.object;
      this.checkRegistration(this.selectedPeData);
    }

    if (this.governConfiguration?.description?.includes("National")) {
      this.isNssfRegistration = true;
    }
    //
    this.govType = null;
    this.fetchedData = null;
    this.govNumber = null;
  }

  closeModal(): void {
    this.dialogRef.dismiss();
  }
}
