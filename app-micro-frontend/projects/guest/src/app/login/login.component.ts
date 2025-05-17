
import { ApplicationState } from 'src/app/store';
import { selectAllAuthUsers } from '../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { AuthUser } from '../../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { GraphqlService } from '../../services/graphql.service';
import { TENDERER_MY_DETAILS } from '../../modules/nest-uaa/store/user-management/user/user.graphql';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, ElementRef, OnInit, Renderer2, ViewChild, } from '@angular/core';
import { fadeIn, ROUTE_ANIMATIONS_ELEMENTS, } from '../../shared/animations/router-animation';
import { AuthResponse, AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { firstValueFrom, fromEvent, merge, of, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import { TranslationService } from '../../services/translation.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  GET_GLOBAL_SETTING_BY_SETTING_KEY
} from '../../modules/nest-settings/store/global-settings/global-settings.graphql';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MatButtonModule } from '@angular/material/button';
import { RecaptchaModule } from 'ng-recaptcha';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LayoutComponent } from '../layout/layout.component';
import { NgIf, NgClass } from '@angular/common';
import { clearUsers } from 'src/app/modules/nest-uaa/store/user-management/user/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LayoutComponent,
    NgClass,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    LoaderComponent,
    RecaptchaModule,
    MatButtonModule,
    RouterLink,
    TranslatePipe,
  ],
})
export class LoginComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  hide = true;
  username = '';
  password = '';
  loading = false;
  languages = [
    { id: 'gb', name: 'English', key: 'ENGLISH', code: 'en' },
    { id: 'tz', name: 'Swahili', key: 'SWAHILI', code: 'sw' },
  ];
  defaultLanguage: string;
  try = 0;
  showBot = false;
  currentFlag: string;
  currentLabel: string;
  currentRegistrations: any;
  users: AuthUser;
  isValidEmail: boolean = false;
  authResponse: AuthResponse;
  showCaptcha: boolean = false;
  captcha: string;
  emailSecret: string = '';
  email: string = '';
  @ViewChild('myInput') myInput: ElementRef;
  billingStatus: boolean = false;
  failedToGetBillingStatus: boolean = false;
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  isExternalLogin = false;

  constructor(
    private router: Router,
    private route: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private translateService: TranslationService,
    private store: Store<ApplicationState>,
    private apollo: GraphqlService,
    private renderer: Renderer2,
    private http: HttpClient,
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
  ) {
    this.captcha = '';
    this.email = '';
    this.emailSecret = 'secret@ppra.go.tz';

    this.defaultLanguage = localStorage.getItem('language');

    if (this.defaultLanguage) {
      translateService.setDefaultLanguage(this.defaultLanguage);
    } else {
      this.defaultLanguage = translateService.getDefaultLanguage();
      translateService.setDefaultLanguage(this.defaultLanguage);
    }
  }

  async ngOnInit(): Promise<void> {
    const queryParams = await firstValueFrom(this.activatedRoute.queryParams);
    const withParamKey = Object.keys(queryParams).find(key => key.startsWith('with'));

    if (withParamKey && withParamKey.length > 4) {
      this.storageService.clearStorage();
      this.isExternalLogin = true;
      this.username = 'EXTERNAL_LOGIN';
      this.password = withParamKey;
      this.isValidEmail = true;
      await this.submitLogin({ username: this.username, password: this.password });
    } else {
      this.checkNetworkStatus();
      this.checkSystemLock().then();
      this.username = '';
      this.password = '';
    }
  }

  item = 0;

  checkValue() {
    this.item++;
    return this.checkCredentials(this.username, this.password, this.isValidEmail);
    // if (this.username == 'EXTERNAL_LOGIN') return true;
    // if ((!this.username || !this.password) && this.isValidEmail === false) {
    //   return false;
    // } else if (
    //   !this.username &&
    //   !this.password &&
    //   this.isValidEmail === false
    // ) {
    //   return true;
    // } else if (this.username && this.password && this.isValidEmail) {
    //   return false;
    // } else if (this.username && this.password && this.isValidEmail === false) {
    //   return true;
    // } else if (this.username && this.isValidEmail === false) {
    //   return true;
    // } else if (!this.username || !this.password) {
    //   return true;
    // } else {
    //   return true;
    // }
  }

  checkCredentials(username, password, isValidEmail) {
    return (
      username === 'EXTERNAL_LOGIN' ||
      (!username || !password) ||
      (username && !isValidEmail)
    );
  }

  ngAfterViewInit() {
    const buttonElement = this.elementRef.nativeElement.querySelector('button');
    this.renderer.listen(buttonElement, 'click', () => {
    });

    // Programmatically trigger click event on button element
    this.renderer.selectRootElement(buttonElement).click();
  }

  async checkSystemLock() {
    // try {
    //   const response: any = await this.apollo.fetchData({
    //     query: SYSTEM_CHECK_LOCK,
    //     variables: {
    //       settingKey: "SYSTEM_LOCKOUT",
    //     },
    //   });
    //   const values: any = response?.data?.findGlobalSettingByKey?.data;
    //   if (values) {
    //     if(values.value === "true"){
    //       await this.router.navigate(['/under-construction']);
    //     }
    //   }
    //
    // } catch (e) { }

    try {
      const data = await firstValueFrom(
        this.http.get<any>(
          environment.AUTH_URL + `/nest-uaa/get/system-status/`
        )
      );

      if (data?.data?.value === 'true') {
        await this.router.navigate(['/under-construction'], {
          queryParams: { data: data?.data.description },
        });
      } else {
        await this.router.navigate(['/login']);
      }
    } catch (e) {
      console.error(e);
    }

    // if (localStorage.getItem('activate') != 'YES') {

    // }
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.showBot = false;
  }

  onInputValueChangedUsername(event: any) {
    this.username = event.target.value;
    this.validateEmail();
  }

  onInputValueChangedPassword(event: any) {
    this.password = event.target.value;
  }

  login() {
    localStorage.setItem('isLoggedin', 'true');
    this.router.navigate(['/']);
  }

  validateEmail() {
    if (this.username == 'EXTERNAL_LOGIN') return;
    this.isValidEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/.test(
      this.username
    );
  }

  onUserNameInput() {
    //
  }

  async submitLogin(auth: any) {
    this.validateEmail();
    if (this.isValidEmail) {
      try {
        this.loading = true;
        const checker = this.authService.alreadyLoggedIn();
        checker === true
          ? this.storageService.clearStorage()
          : (this.authResponse = await this.authService.login(auth));

        if (this.authResponse.status == 'success') {
          const currentTime = Date.now(); // Current timestamp in ms
          const expireDuration = 15 * 60 * 1000; // 15 minutes = 900000 ms

          this.storageService.setItem('loginTime', currentTime.toString());
          this.storageService.setItem('expireIn', (currentTime + expireDuration).toString());
          await this.authService.handlePageRedirectionAfterLoginSuccessful(
            this.notificationService,
            this.apollo,
            this.router);
        } else {
          if (this.try == 0 || this.try == 1) {
            this.try = this.try + 1;
          } else {
            this.showBot = true;
          }
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    } else {
      this.authResponse = {
        status: 'fail',
        authToken: null,
        message: 'Please enter valid email address',
      };
      // this.notificationService.errorMessage('Please enter valid email address');
    }
  }

  ngOnDestroy(): void {
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


  async fetchUserDetails() {
    return await firstValueFrom(
      this.store.pipe(
        select(selectAllAuthUsers),
        first((items) => items.length > 0),
        map((i) => i[0])
      )
    );
  }

  navigateToPage(page: any, byUrl: boolean = true) {
    if (byUrl) {
      this.route.navigateByUrl(page).then();
    } else {
      this.router.navigate(page).then();
    }
  }

}
