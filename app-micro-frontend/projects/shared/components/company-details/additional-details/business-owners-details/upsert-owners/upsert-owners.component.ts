import { countries } from '../../../../../../modules/nest-tenderer-management/store/country/countries';
import { Component, ElementRef, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/modules/nest-tenderer-management/store/country/country.model';
import { FieldConfig } from 'src/app/shared/components/dynamic-forms-components/field.interface';
import { GraphqlService } from '../../../../../../services/graphql.service';
import { NotificationService } from '../../../../../../services/notification.service';
import * as formConfigs from "./business-owner-form-fields";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CREATE_BUSINESS_OWNERSHIP } from 'src/app/modules/nest-uaa/store/user-management/user/user.graphql';
import { MainDynamicFormComponent } from '../../../../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-upsert-owners',
  templateUrl: './upsert-owners.component.html',
  styleUrls: ['./upsert-owners.component.scss'],
  standalone: true,
  imports: [MatStepperModule, MainDynamicFormComponent]
})
export class UpsertOwnersComponent implements OnInit {

  @Input() selectedUuid: string;

  isLinear = true;
  form: UntypedFormGroup;
  loading: boolean;
  fetchingItem: boolean;

  countryList: any[] = countries;
  countryCode = '';
  selectedCountry?: Country;
  tendererBusinessOwnershipDetailsUuid: string;
  selectedCountryId: string;
  selectedPhoneCountry?: string;
  countrySearch: string;
  @ViewChild('myInput') myInputField: ElementRef;
  selectedCountryCode: string = '';
  phoneNumber: string;
  fields: FieldConfig[] = formConfigs.fields;
  formData: any;
  constructor(
    private fb: UntypedFormBuilder,
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    private _bottomSheetRef: MatBottomSheetRef<UpsertOwnersComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: any,
  ) {
    if (data) {
      this.formData = data.ownerData;
      this.tendererBusinessOwnershipDetailsUuid = data.tendererBusinessOwnershipDetailsUuid;
    }
  }

  ngOnInit(): void {
    if (this.formData) {
      this.selectedUuid = this.formData.uuid;
      //
      this.form = this.fb.group({
        name: [this.formData.name, [Validators.required]],
        email: [this.formData.email, [Validators.required]],
        identificationNumber: [this.formData.identificationNumber, [Validators.required]],
        ownershipValue: [this.formData.ownershipValue, [Validators.required]],
        phoneNumber: [this.formData.phoneNumber, [Validators.required]],
        countryUuid: [this.formData?.country?.uuid, [Validators.required]],
      });
    }
    else {
      this.form = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required]],
        identificationNumber: [null, [Validators.required]],
        ownershipValue: [null, [Validators.required]],
        phoneNumber: [null, [Validators.required]],
        countryUuid: [null, [Validators.required]],
      });
    }
  }

  countrySelected($event: string) {
    this.selectedCountry = this.countryList.find(i => i.phoneCode === $event);
    this.selectedPhoneCountry = this.selectedCountry?.phoneCode;
    this.selectedCountryCode = this.selectedCountry?.phoneCode;
    setTimeout(() => this.myInputField.nativeElement.focus(), 100);
  }

  async submitForm() {
    this.loading = true;
    let formValues = {
      ...this.form.value
    }
    this.loading = true;
    let dataToSave = {
      ...formValues,
      tendererBusinessOwnershipDetailsUuid: this.tendererBusinessOwnershipDetailsUuid
    }

    if (this.selectedUuid) {
      dataToSave = {
        ...dataToSave,
        uuid: this.selectedUuid,
        tendererBusinessOwnershipDetailsUuid: this.tendererBusinessOwnershipDetailsUuid
      }
    }

    this.loading = false;

    try {
      const response = await this.apollo.mutate({
        mutation: CREATE_BUSINESS_OWNERSHIP,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererBusinessOwnersDetailsDto: dataToSave,
        },
      });
      if (response.data.createTendererBusinessRegistrationDetails.code == 9005) {
        this.notificationService.errorMessage('Failed to register owner');
      } else if (response.data.createTendererBusinessRegistrationDetails.code != 9000) {
        console.error(response.data.createTendererBusinessRegistrationDetails);
        this.notificationService.errorMessage('Problem occurred while saving information, please try again');
      } else {
        this.notificationService.successMessage('Saved Successfully');
        this.loading = false;
        this.close(dataToSave);
      }
    } catch (e) {
      this.notificationService.errorMessage('Failed to save');
    }
    // this.close(dataToSave);
  }

  close(data: any) {
    this._bottomSheetRef.dismiss(data)
  }

  private fetchOne() {

  }

}
