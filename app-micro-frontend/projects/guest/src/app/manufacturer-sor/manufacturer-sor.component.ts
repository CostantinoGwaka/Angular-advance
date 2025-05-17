import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import * as formConfigs from './manufacturer-sor-form';
import { FieldConfig } from 'src/app/shared/components/dynamic-forms-components/field.interface';
import { environment } from 'src/environments/environment';
import { DynamicFormService } from 'src/app/shared/components/dynamic-forms-components/dynamic-form.service';
import { UntypedFormGroup } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { GraphqlService } from '../../services/graphql.service';
import { GET_SCHEDULE_OF_REQUIREMENT_DATA_BY_TENDER_PAGINATED } from 'src/app/modules/nest-tenderer-management/manufacturer/manufacturer.graphql';
import {
  fadeIn,
  fadeOut,
  fadeSmooth,
} from 'src/app/shared/animations/router-animation';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MainDynamicFormComponent } from '../../shared/components/dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';
import { ProgressCircularLoaderComponent } from '../../modules/nest-tenderer/tender-submission/submission/progress-circular-loader/progress-circular-loader.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';


@Component({
  selector: 'app-manufacturer-sor',
  templateUrl: './manufacturer-sor.component.html',
  styleUrls: ['./manufacturer-sor.component.scss'],
  animations: [fadeSmooth, fadeIn, fadeOut],
  standalone: true,
  imports: [
    LoaderComponent,
    ProgressCircularLoaderComponent,
    MainDynamicFormComponent,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatFormFieldModule
  ],
})
export class ManufacturerSorComponent implements OnInit {
  //******* Start of loader ****** //
  mainLoaderMessage: string = 'loading';
  mainLoaderProgress: number = 0;
  mainLoading: boolean = true;
  //******* End of loader ****** //
  loading: boolean;
  loging: boolean = false;
  loadingStatus: boolean;
  token: any;
  tokenStatus: boolean;
  loadingData: boolean;
  @Output() closeForm = new EventEmitter<boolean>();
  fields: FieldConfig[] = formConfigs.fields;
  supportForm: UntypedFormGroup;
  dataToSubmit: any;
  invitationStatus: boolean = false;
  informations: any;
  sorStatus: boolean;
  manufacturerStatus: any;
  displayForm: boolean;
  constructor(
    private http: HttpClient,
    private dynamicFormService: DynamicFormService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private apollo: GraphqlService,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.token = params?.token;
      this.token ? this.verifyToken(this.token) : (this.tokenStatus = false);
    });
    this.supportForm = this.dynamicFormService.createControl(this.fields, null);
    let currentUrl = this.router.url;
    let url: string = environment.SERVER_URL;
    let originalString = url;
    let newString = originalString.replace("/gateway", "");
    this.storageService.setItem('loginRedirectURL', newString + currentUrl);

  }


  async confirm(param: any) {
    this.invitationStatus = false;
    const response = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-app/invitation-response`,
        param
      )
    );

    if (response?.access_token) {
      this.invitationStatus = true;
      this.notificationService.successMessage(
        'Invitation submitted successfull, Please Proceed'
      );

      this.submitLogin(response);
    } else {
      this.notificationService.errorMessage('Failed to Submit Invitation');
    }
  }

  // Handle Progress
  async setProgressStatus(progress: number) {
    this.mainLoaderProgress = progress;
    this.mainLoaderMessage = 'Loading Menus';
    await this.simulateIncrement();
  }

  async simulateIncrement() {
    for (let i = this.mainLoaderProgress; i <= 100; i++) {
      if (this.mainLoaderProgress < 100) {
        this.mainLoaderProgress += 1
      } else {
        this.mainLoaderMessage = 'Loading completed';

      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  async submitLogin(user: any) {
    this.mainLoaderProgress = 65;
    this.mainLoaderMessage = 'Authenticating'

    this.loadingStatus = true;
    if (user?.access_token) {
      this.loadingStatus = false
      this.storageService.setItem('currentClient', user.access_token);
      this.storageService.setItem('refreshToken', user.refresh_token);
      this.storageService.setItem('expireTime', user.expires_in);
      this.storageService.setItem('isLoggedin', 'true');
      const token = this.storageService.getItem('currentClient');
      await this.authService.authRole(token, this.apollo).then();
      const serviceUserType = this.storageService.getItem('serviceUserType');
      if (serviceUserType === 'MANUFACTURER') {
        this.mainLoaderMessage = 'Loading Module';
        await this.setProgressStatus(96);
        await this.simulateIncrement();
        //this.router.navigate(['nest-tenderer/tenders/submitted-tenders']);
        await this.router.navigate(['/nest-manufacturer/submission'], {
          queryParams: {
            lotUuid: user?.entityUuid,
            tenderUuid: user?.mainEntityUuid,
            entityType: user?.entityType,
            action: 'submission'
          },
        });
        this.notificationService.successMessage('Welcome to NeST ');
      } else {
        this.router.navigate(['/manufacturer-redirect']);
      }
    }
    try {
    } catch (e) {
      this.loadingStatus = false;
      this.loading = false;
    }
  }

  close(shouldUpdate = false) {
    this.closeForm.emit(shouldUpdate);
  }

  fieldSelected($event) { }

  submitForm($event) {
    this.dataToSubmit = {};
    this.dataToSubmit = {
      invitationToken: this.token,
      hasAcceptedInvitation: $event.decision === 'REJECT' ? false : true,
      reasonForRejection: $event.comment,
    };

    this.confirm(this.dataToSubmit);
  }

  async verifyToken(param: any) {

    this.loadingStatus = true;
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-app/verify-invitation-token`,
        param
      )
    );

    this.loadingData = true;
    this.tokenStatus = data.status;

    if (this.tokenStatus) {
      this.loadingStatus = false;
      this.notificationService.successMessage('Token Validated');
      this.checkInvitation(param);
    } else {
      this.router.navigate(['/manufacturer-redirect']);
      this.notificationService.errorMessage(
        'Invalid Token, Youre Token Expired'
      );
    }
  }

  async checkInvitation(param: any) {
    this.loadingStatus = true;
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-app/check-invitation`,
        param
      )
    );
    if (data?.status) {
      this.loadingStatus = false;
      if (data.data && Object.keys(data.data).length > 0) {
        this.displayForm = false;
        this.submitLogin(data.data);
      } else {
        this.displayForm = true;
        this.loading = false;
      }
    } else {
      this.loadingStatus = false;
      this.notificationService.errorMessage(
        'Invalid Invitation'
      );
      this.router.navigate(['/manufacturer-redirect']);
    }


    this.manufacturerStatus = data.status;

  }

  onSubmit() { }
}
