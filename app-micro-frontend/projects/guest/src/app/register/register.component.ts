import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  countries,
  Country,
} from '../../modules/nest-tenderer-management/store/country/countries';
import { NotificationService } from '../../services/notification.service';
import {
  fadeIn,
  ROUTE_ANIMATIONS_ELEMENTS,
} from 'src/app/shared/animations/router-animation';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from '../../services/translation.service';
import { HTMLCleanerUtility } from '../../shared/utils/html.cleaner.utils';
import { Title } from '@angular/platform-browser';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectSearchComponent } from '../../shared/components/mat-select-search/mat-select-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutComponent } from '../layout/layout.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LayoutComponent,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    NgClass,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatSelectSearchComponent,
    MatOptionModule,
    MatInputModule,
    RecaptchaModule,
    LoaderComponent,
    SearchPipe,
    TranslatePipe
],
})
export class RegisterComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  currentYear: any;
  loading = false;
  loginView = false;
  subscription: Subscription = new Subscription();
  tendererRegistrationForm: UntypedFormGroup;
  token: any;
  countryList: Country[] = countries;
  countryCode = '';
  selectedCountry?: Country;
  phoneCountry?: Country;

  selectedCountryId: string;
  selectedPhoneCountry?: string;
  countrySearch: string;
  phoneNumber: string;
  email: string = '';
  showConfirm = false;
  savingData = false;
  savedSuccessful = false;
  @ViewChild('myInput') myInputField: ElementRef;
  captcha: string;
  emailSecret: string = '';
  showCaptcha: boolean = false;
  resendEmailcheck: boolean = false;
  userAccountNotActive: boolean = false;
  selectedCountryCode: string = '';
  phoneError: boolean = false;

  languages = [
    { id: 'gb', name: 'English', key: 'ENGLISH', code: 'en' },
    {
      id: 'tz',
      name: 'Swahili',
      key: 'SWAHILI',
      code: 'sw',
    },
  ];
  defaultLanguage: string;
  currentFlag: string;
  currentLabel: string;
  routeSub = Subscription.EMPTY;

  // constructor(
  //   private store: Store<ApplicationState>,
  //   private translateService: TranslateService,
  //   private storageService: StorageService

  // ) {

  //   /**
  //    * Language Translation  Codes
  //    */
  //    this.defaultLanguage = storageService.getItem('language');
  //    if (this.defaultLanguage){
  //      translateService.setDefaultLanguage(this.defaultLanguage);
  //    } else{
  //      this.defaultLanguage = translateService.getDefaultLanguage();
  //    }
  //    this.currentFlag = this.languages.find((lang:any)=>lang.code == translateService.getDefaultLanguage()).id;
  //    this.currentLabel = this.languages.find((lang:any)=>lang.code == translateService.getDefaultLanguage()).key;

  // }

  changeLanguage(language: string) {
    this.translateService.setDefaultLanguage(language);
    this.storageService.setItem('language', language);
    this.currentFlag = this.languages.find(
      (lang: any) => lang.code == language
    ).id;
    this.currentLabel = this.languages.find(
      (lang: any) => lang.code == language
    ).key;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private translateService: TranslationService,
    private storageService: StorageService
  ) {
    this.captcha = '';
    this.email = '';
    this.emailSecret = 'secret@ppra.go.tz';

    /**
     * Language Translation  Codes
     */
    this.defaultLanguage = storageService.getItem('language');
    if (this.defaultLanguage) {
      translateService.setDefaultLanguage(this.defaultLanguage);
    } else {
      this.defaultLanguage = translateService.getDefaultLanguage();
    }
    this.currentFlag = this.languages.find(
      (lang: any) => lang.code == translateService.getDefaultLanguage()
    ).id;
    this.currentLabel = this.languages.find(
      (lang: any) => lang.code == translateService.getDefaultLanguage()
    ).key;
  }

  ngOnInit(): void {
    this.tendererRegistrationForm = this.fb.group({
      mobileNumber: [null, [Validators.required, Validators.minLength(6)]],
      emailAddress: [null, [Validators.required, Validators.email]],
      countryCode: [null, [Validators.required]],
      countrySearch: [null],
    });
    this.routeSub = this.activeRoute.queryParams.subscribe((items) => {
      this.email = items['email'];
      this.savedSuccessful =
        !!items['email'] && items['completed'] === 'success';
    });
    this.checkNetworkStatus();
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }

  omitChar(event: { charCode: any }): boolean {
    const k = event.charCode;
    return k >= 48 && k <= 57;
  }

  resendEmail(email: string) {
    this.authService
      .sendEmail({
        email: email,
      })
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.notificationService.successMessage(
              'Activation link has been re-sent to your email address',
              15000
            );
            this.resendEmailcheck = true;
          } else {
            this.notificationService.errorMessage(response.message);
          }
          this.resendEmailcheck = false;
        },
        error: (err) => {
          this.notificationService.errorMessage('User Not Found');
          this.resendEmailcheck = false;
        },
      });
  }

  register(formData: any) {
    this.savingData = true;
    // if (this.tendererRegistrationForm.valid) {
    // this.router.navigate(['/verification']);
    this.authService
      .registerTenderer({
        email: formData.emailAddress,
        phone: formData.mobileNumber,
      })
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.notificationService.successMessage(
              'Your account has been created successfully. Before you can login, you must activate your account with the link sent to your email address',
              15000
            );
            // this.router.navigate(['/login']);
            const path = this.router.url.split('?')[0].split('/');
            this.router
              .navigate(path, {
                queryParams: {
                  completed: 'success',
                  email: formData.emailAddress,
                },
              })
              .then();
            this.savedSuccessful = true;
          } else {
            if (
              response.status == false &&
              response.message.includes('Tenderer registered successful.')
            ) {
              this.savedSuccessful = true;
              this.notificationService.successMessage(
                'Your account has been created successfully. Before you can login, you must activate your account with the link sent to your email address',
                15000
              );
              const path = this.router.url.split('?')[0].split('/');
              this.router
                .navigate(path, {
                  queryParams: {
                    completed: 'success',
                    email: formData.emailAddress,
                  },
                })
                .then();
              this.savedSuccessful = true;
              // this.notificationService.errorMessage();
            } else {
              this.userAccountNotActive = true;
              this.notificationService.errorMessage(response.message);
            }
          }
          this.savingData = false;
        },
        error: (err) => {
          this.savingData = false;
          this.notificationService.errorMessage(err);
        },
      });
  }

  countrySelected($event: string) {
    this.selectedCountry = this.countryList.find((i) => i.phoneCode === $event);
    this.selectedPhoneCountry = this.selectedCountry?.phoneCode;
    this.selectedCountryCode = this.selectedCountry?.phoneCode;
    setTimeout(() => this.myInputField.nativeElement.focus(), 100);
  }

  setPhoneCountry($event: MatSelectChange) {
    this.phoneCountry = this.countryList.find(
      (i) => i.phoneCode === $event.value
    );
  }

  trimPhoneNumber(value: string) {
    return value && value.length > 10
      ? value.trim().substring(value.trim().length - 9)
      : value;
  }

  phoneNumberValid() {
    const phone = `+${this.selectedPhoneCountry}${this.trimPhoneNumber(
      this.phoneNumber
    )}`;
    const testRegex =
      // /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{2,4})[-. )]*(\d{3,4})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    return testRegex.test(phone);
  }

  validateEmail(email: any) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  onKeyDown(event: KeyboardEvent) {
    // Get the key code of the pressed key
    const keyCode = event.keyCode || event.which;

    // Check if the key is 'e' (69 is the key code for 'e')
    if (keyCode === 69 || keyCode === 190 || keyCode === 110) {
      event.preventDefault();
    }
  }

  onInputChange(): void {
    if (this.phoneNumber.length > 15) {
      this.phoneNumber = this.phoneNumber.slice(0, 15);
      this.phoneError = true;
    } else {
      this.phoneError = false;
    }
  }

  onSelect(cd: string) {
    this.countryCode = cd;
  }

  onSave(b: boolean) {
    this.register({
      emailAddress: this.email,
      mobileNumber: `+${this.selectedPhoneCountry}${this.trimPhoneNumber(
        this.phoneNumber
      )}`,
    });
  }

  onCancelShowConfirm() {
    this.showConfirm = false;
  }

  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.networkStatus$.unsubscribe();
  }

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((status) => {
        this.networkStatus = status;
        if (this.networkStatus) {
          // this.notificationService.successMessage('You\'re online. Ready to Go.');
        } else {
          console.error("You're offline. Check your connection.");
          // this.notificationService.internetSnackbar('You\'re offline. Check your connection.');
        }
      });
  }

  fieldChange(v: any = null, inputKey) {
    let value = v?.target?.value;
    if (inputKey == 'email') {
      this.email = HTMLCleanerUtility.stripHtmlTags(value);
    }
  }
}
