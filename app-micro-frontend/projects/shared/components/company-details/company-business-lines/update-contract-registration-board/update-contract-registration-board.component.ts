import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { GraphqlService } from '../../../../../services/graphql.service';
import { NotificationService } from '../../../../../services/notification.service';
import { SettingsService } from '../../../../../services/settings.service';
import { ModalHeaderComponent } from '../../../modal-header/modal-header.component';
import { DatePipe, NgClass } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../../../loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectSearchComponent } from '../../../mat-select-search/mat-select-search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SaveAreaComponent } from '../../../save-area/save-area.component';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { SAVE_CERTIFICATE_WITH_ATTACHMENT, UPDATE_BUSINESS_LINE } from 'src/app/modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import { RouterLink } from '@angular/router';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
  selector: 'app-update-contract-registration-board',
  standalone: true,
  imports: [ModalHeaderComponent, RouterLink, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgClass, LoaderComponent, MatButtonModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatSelectSearchComponent, MatProgressSpinnerModule, MatIconModule, SaveAreaComponent, DatePipe, SearchPipe, TranslatePipe],
  templateUrl: './update-contract-registration-board.component.html',
  styleUrl: './update-contract-registration-board.component.scss'
})
export class UpdateContractRegistrationBoardComponent implements OnInit {


  config: any;
  crbDataFetched: any;
  uploadForm: UntypedFormGroup;
  authority: boolean = false;
  loading: boolean = false;
  fetchingData = false;
  checkComplete = false;
  previousData: any;
  fileUploadedName: string = '';
  fileUplaodedFile: any;
  selectedFile: any;
  licenseNumber: string;
  businessLineConfigurationUuid: string;
  sendToPPRA: boolean = false;
  itemData: any;
  regNo: string;


  constructor(
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private apollo: GraphqlService,
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private dialogRef: MatBottomSheetRef<UpdateContractRegistrationBoardComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data
  ) {
    this.config = data;
    this.previousData = data.selectedBusinessLine
  }
  closeModal(): void {
    this.dialogRef.dismiss();
  }

  ngOnInit(): void {
  }
  async checkData() {
    let boardname = 'Contractors';
    this.fetchingData = true;
    this.crbDataFetched = null;
    try {

      const data = await firstValueFrom(this.http
        .post<any>('https://nest.go.tz/gateway/nest-api/api/crb/contractor/detail', {
          regNo: this.regNo,
        }).pipe(
          timeout(90000), // Timeout duration in milliseconds (e.g., 90000 for 1 minutes)
          catchError((error) => {
            if (error.name === 'TimeoutError') {
              return throwError('Request timed out');
            }
            return throwError(error);
          })
        ));
      if (!data) {
        this.fetchingData = false;
      } else {
        this.crbDataFetched = data;
      }

      if (this.crbDataFetched?.regNo == null) {
        this.notificationService.errorMessage(`No details found or Details not available from CRB`);
      }

      this.fetchingData = false;
      this.checkComplete = true;
    } catch (e) {
      this.fetchingData = false;
      this.notificationService.errorMessage(`No details found or Details not available from CRB`);
      this.crbDataFetched = null;
    }
  }

  trimStr(str) {
    if (!str) return str;
    return str.replace(/^\s+|\s+$/g, '');
  }

  async sendForApproval() {
    this.loading = true;

    let config;

    for (let data of this.config?.businessLine?.businessLine.businessLineConfigurationList) {

      if (data?.tendererType == this.config?.tenderer?.tendererType && data?.statutoryOffer.statutoryBoard.name == "Contractors Registration Board") {
        config = data;
      }
    }

    try {
      let itemToSave: any = {
        statutoryOfferClassUuid: null,
        businessLineConfigurationUuid: config?.uuid,
        description: config.statutoryOffer?.offerType?.name + ' from ' + config.statutoryOffer?.statutoryBoard?.name,
        isVerified: false,
        tendererBusinessLineUuid: this.config.businessLine?.uuid,
        certificateNumber: this.trimStr(this.crbDataFetched?.regNo),
        expiryDate: null,
        uuid: this.config.selectedBusinessLine?.uuid,
        attachmentPath: null,
        name: this.crbDataFetched?.name,
        email: this.crbDataFetched?.email != "NULL" ? this.crbDataFetched?.email : this.config.tenderer.email,
        phone: this.crbDataFetched?.phone,
        postalAddress: this.crbDataFetched?.postalAddress,
        className: this.crbDataFetched?.className,
        classType: this.crbDataFetched?.classType,
        registrationDate: this.crbDataFetched?.registrationDate,
        isOtherCertificate: false,
      };

      const response = await this.apollo.mutate({
        mutation: SAVE_CERTIFICATE_WITH_ATTACHMENT,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererCertificateDto: itemToSave,
        }
      });
      if (response.data.createTendererCertificateWithAttachment.code === 9000) {
        const response = await this.apollo.mutate({
          mutation: UPDATE_BUSINESS_LINE,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            tendererBusinessLineRequestDTO: {
              tendererUuid: this.config?.tenderer?.uuid,
              businessLineUuid: this.config.businessLine?.businessLine?.uuid,
              status: "APPROVED",
            },
          },
        });
        if (response.data?.updateTendererBusinessLineStatus?.code == 9000) {
          this.loading = false;
          this.sendToPPRA = true;
          this.notificationService.successMessage('Saved successfully');
        }

      } else {
        console.error(response.data.createTendererCertificateWithAttachment.message);
        this.loading = false;
        this.notificationService.errorMessage('Failed to upload certificate');
      }
    } catch (e) {
      this.loading = false;
      this.notificationService.errorMessage('Failed to upload certificate');
    }
  }


}
