import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';
import { inject, Injectable, signal } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as fromState from '../store';
import { GraphqlService } from './graphql.service';
import { AuthUser } from '../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import {
  clearUsers,
  getMyDetails,
} from '../modules/nest-uaa/store/user-management/user/user.actions';
import { loadAuthUsers } from '../modules/nest-uaa/store/user-management/auth-user/auth-user.actions';
import { LivecharthelperService } from './livechart/livecharthelper.service';
import * as fromStoreAction from '../store';
import { IndexdbLocalStorageService } from './indexdb-local-storage.service';
import { NotificationService } from './notification.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { selectAllAuthUsers } from '../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { GET_GLOBAL_SETTING_BY_SETTING_KEY } from '../modules/nest-settings/store/global-settings/global-settings.graphql';
import { BillPaymentCheck } from '../modules/nest-app/store/tender/tender.model';
import { CHECK_TENDERER_REGISTRATION_PAYMENT_STATUS } from '../modules/nest-app/store/annual-procurement-plan/annual-procurement-plan.graphql';
import { selectAllUsers } from '../modules/nest-uaa/store/user-management/user/user.selectors';
import { User } from '../modules/nest-uaa/store/user-management/user/user.model';
import * as fromAuthUserActions from '../modules/nest-uaa/store/user-management/auth-user/auth-user.actions';
import * as fromActions from '../modules/nest-uaa/store/user-management/user/user.actions';
import { MY_DETAILS, SET_USER_AGENT_DETAILS } from '../modules/nest-uaa/store/user-management/user/user.graphql';
import { GET_APP_FEATURE_PE_BY_PE } from '../modules/nest-settings/store/nest-features/nest-features.graphql';



export interface AuthResponse {
  status: 'success' | 'fail';
  authToken?: AuthTokenModel;
  message?: string;
}

export interface AuthTokenModel {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  objectPerms: any;
  perms: any;
  private errorCode: any;
  savingData: boolean = false;
  subscription = new Subscription();
  isTenderer = signal<boolean>(false);
  notificationService = inject(NotificationService)

  browser: string;
  platform: string;
  os: string;
  deviceType: string;
  userAgent: string;
  userInfo: AuthUser;

  currentTime = Date.now(); // Current timestamp in ms
  expireDuration = 15 * 60 * 1000; // 15 minutes = 900000 ms
  remainTime = 120;

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private apollo: GraphqlService,
    private snackbar: MatSnackBar,
    private store: Store<fromState.ApplicationState>,
    private storageService: StorageService,
    private indexDbLocalStorageService: IndexdbLocalStorageService,
    private liveChatHelperService: LivecharthelperService,
    private dialogRef: MatDialog,
    private bottomSheetDialogRef: MatBottomSheet
  ) { }


  getBrowserName(): string {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
      return 'Google Chrome';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      return 'Apple Safari';
    } else if (userAgent.indexOf('Firefox') > -1) {
      return 'Mozilla Firefox';
    } else if (userAgent.indexOf('Edg') > -1) {
      return 'Microsoft Edge';
    } else if (userAgent.indexOf('MSIE') > -1 || !!document.DOCUMENT_NODE) {
      return 'Internet Explorer';
    } else {
      return 'Unknown Browser';
    }
  }

  getOSName(): string {
    const platform = window.navigator.platform;
    if (platform.startsWith('Win')) {
      return 'Windows';
    } else if (platform.startsWith('Mac')) {
      return 'MacOS';
    } else if (platform.startsWith('Linux')) {
      return 'Linux';
    } else if (/Android/.test(this.userAgent)) {
      return 'Android';
    } else if (/iPhone|iPad|iPod/.test(this.userAgent)) {
      return 'iOS';
    } else {
      return 'Unknown OS';
    }
  }

  getDeviceType(): string {
    if (/Mobile|iP(hone|od|ad)|Android/.test(this.userAgent)) {
      return 'Mobile';
    } else if (/Tablet/.test(this.userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  }

  generateDeviceId(): string {
    const uuid = this.generateUUID();
    this.storageService.setItem(
      'deviceId', uuid
    );
    return uuid;
  }

  getDeviceId(): string {

    let deviceId = this.storageService.getItem(
      'deviceId'
    );
    if (deviceId == null || deviceId == 'null') {
      deviceId = this.generateDeviceId();
    }
    return deviceId;
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async login(formData: any): Promise<AuthResponse> {


    this.storageService.setItem('clientUserName', formData.username);
    const body = `username=${encodeURIComponent(
      formData.username
    )}&password=${encodeURIComponent(formData.password)}&grant_type=password`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization:
        'Basic ' +
        btoa(environment.CLIENT_ID + ':' + environment.CLIENT_SECRET),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    });

    try {

      this.getIPAddress().then();

      return await firstValueFrom(
        this.http
          .post<AuthTokenModel>(
            environment.AUTH_URL + `/nest-uaa/oauth/token`,
            body,
            { headers }
          )
          .pipe(
            map(async (user) => {
              // login successful if there's a jwt token in the response
              if (user && user.access_token) {
                //
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.storageService.setItem('currentClient', user.access_token);
                this.storageService.setItem('refreshToken', user.refresh_token);
                this.storageService.setItem('expireTime', user.expires_in);
                this.storageService.setItem('isLoggedin', 'true');

                // send access token to GRAPHQL API
                // this.http.get(environment.GRAPHQL_URL + '/clients-access-token').subscribe();
              }

              return { status: 'success', authToken: user, message: null };
            })
          )
      );
    } catch (e) {
      let message = this.onErrorRequest(e);
      return {
        status: 'fail',
        authToken: null,
        message: message.includes('could not execute')
          ? 'Please enter valid email address'
          : message,
      };
    }
  }

  async getIPAddress() {
    const regexExp =
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    const res: any = await lastValueFrom(
      this.http.get('https://api.ipify.org/?format=json')
    );

    this.userAgent = window.navigator.userAgent;
    this.platform = window.navigator.platform;
    this.browser = this.getBrowserName();
    this.os = this.getOSName();
    this.deviceType = this.getDeviceType();

    if (regexExp.test(res.ip)) {
      this.storageService.setItem('ipAddress', res.ip);
      this.storageService.setItem('userAgent', this.userAgent);
      this.storageService.setItem('platform', this.platform);
      this.storageService.setItem('os', this.os);
      this.storageService.setItem('browser', this.browser);
      this.storageService.setItem('deviceType', this.deviceType);
    }
  }


  // async keyPhrase() {
  //   const composed = {
  //     userId: this.storageService.getItem('userUuid').replace(/"/g, ''),
  //     commonName: this.storageService.getItem('email'),
  //     password: '12345678',
  //   };

  //   const response = await firstValueFrom(
  //     this.http.post<any>(
  //       environment.AUTH_URL + `/nest-dsms/api/signature/request `,
  //       composed
  //     )
  //   );

  //   if (response) {
  //     this.storageService.setItem('changedKeyPhrase', true);
  //   } else {
  //     this.storageService.setItem('changedKeyPhrase', true);
  //   }
  // }

  requestResetLink(data: { email: string | number | boolean }) {
    const body = `email=${encodeURIComponent(data.email)}`;
    return this.http.post(environment.AUTH_URL + '/requestResetPassword', data);
  }

  alreadyLoggedIn() {
    return !!this.storageService.getItem('currentClient');
  }

  async logout(): Promise<any> {
    // remove user from local storage to log user out
    const currentClient = this.storageService.getItem('currentClient');
    const refreshToken = this.storageService.getItem('refreshToken');
    const body = new HttpParams().set('token', currentClient!);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    });
    try {
      await firstValueFrom(
        this.http.post<any>(
          environment.AUTH_URL +
          `/nest-uaa/oauth/token/revoke?` +
          body +
          `&refresh-token=` +
          refreshToken,
          { headers }
        )
      );
      this.storageService.clearStorage();
      this.indexDbLocalStorageService.deleteDB();
      this.dialogRef.closeAll();
      this.bottomSheetDialogRef.dismiss();
      this.store.dispatch(new fromStoreAction.Logout());
      this.storageService.setItem('expireIn', null);
      window.location.href = '/login';
      // this.router.navigateByUrl('/login').then();
    } catch (e) {
      this.storageService.clearStorage();
      this.indexDbLocalStorageService.deleteDB();
      this.dialogRef.closeAll();
      this.bottomSheetDialogRef.dismiss();
      this.store.dispatch(new fromStoreAction.Logout());
      this.storageService.setItem('expireIn', null);
      window.location.href = '/login';
      // this.router.navigateByUrl('/login').then();
    }

    // return this.http
    //   .post<any>(environment.AUTH_URL + `/nest-uaa/oauth/token/revoke?` + body + `&refresh-token=` + refreshToken, {headers})
    //   .pipe(
    //     map(data => {
    //       if (data.code === 9000) {
    //         this.storageService.clearStorage();
    //         this.router.navigateByUrl('/login');
    //         // logout successful if there's a jwt token in the response
    //       }
    //     })
    //   ).subscribe();
  }

  getCurrentUser(): Observable<string | string[]> {
    return new Observable((observer) => {
      const authorities = this.storageService.getItem('authorities');
      observer.next(authorities ? authorities : []);
      observer.complete();
    });
  }

  checkAppMetadata(myDetails: any) {
    this.storageService.setItem(
      'hasDepartment',
      (myDetails.department != null).toString()
    );

    if (myDetails.rolesListStrings?.length > 0) {
      this.storageService.setItem(
        'isProcurementOfficer',
        (
          myDetails.rolesListStrings.indexOf('PROCUREMENT_OFFICER') >= 0
        ).toString()
      );
      this.storageService.setItem(
        'isHPMU',
        (myDetails.rolesListStrings.indexOf('HEAD_OF_PMU') >= 0).toString()
      );
      this.storageService.setItem(
        'isAccountingOfficer',
        (myDetails.rolesListStrings.indexOf('ACCOUNTING_OFFICER') >= 0).toString()
      );
      this.storageService.setItem(
        'userSystemAccessRoles',
        myDetails?.rolesListStrings.join(',')
      );
    }

  }

  async getAppFeaturePeByPe(peUuid, apollo?: GraphqlService): Promise<any> {
    try {
      const response: any = await apollo.fetchData({
        query: GET_APP_FEATURE_PE_BY_PE,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          peUuid: peUuid,
        }
      });
      const values: any = response.data.getAppFeaturePeByPe?.data;
      if (values) {
        return values;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async authRole(token?: string, apollo?: GraphqlService,) {
    this.isTenderer.set(false);
    if (token) {
      this.storageService.setItem('currentClient', token);
    }
    this.perms = token ? token : this.storageService.getItem('currentClient');
    if (this.perms) {

      // await this.store.dispatch(getMyDetails());
      // this.store.dispatch(clearUsers());

      try {
        const result: any = await apollo.fetchData({
          apolloNamespace: ApolloNamespace.uaa,
          query: MY_DETAILS,
        });
        const itemData = result.data.myDetails;
        if (itemData?.code === 9000) {
          const myDetails = itemData.data;
          this.store.dispatch(
            fromAuthUserActions.upsertAuthUser({
              authUser: myDetails,
            })
          );

          this.store.dispatch(
            fromActions.upsertUser({ user: myDetails })
          );
          this.checkAppMetadata(myDetails);

        } else {
          this.store.dispatch(
            fromActions.loadUsers({ users: [{ id: 0 }] })
          );
        }
      } catch (e) {
        console.error(e);
      }

      // const datax = await firstValueFrom(
      //   this.http.get(environment.AUTH_URL + '/nest-uaa/user')
      // );

      let data = await firstValueFrom(
        this.store.pipe(
          select(selectAllAuthUsers),
          map((i) => i[0])
        )
      );

      // this.userData = { ...data };

      // let finalArray = data?.permissions || [];

      this.userInfo = { ...data };

      // this.userInfo.permissions = finalArray;
      this.storageService.setItem('userID', JSON.stringify(this.userInfo.id));
      this.storageService.setItem('userType', this.userInfo.userType);
      this.storageService.setItem('email', this.userInfo.email);
      this.storageService.setItem('perms', this.userInfo.permissions);
      this.storageService.setItem(
        'NeSTLastTokenRefresh',
        Date.now().toString()
      );

      this.storageService.setItem(
        'institutionUuid',
        this.userInfo?.procuringEntity?.uuid
      );

      let accessFeatures = await this.getAppFeaturePeByPe(this.userInfo?.procuringEntity?.uuid, apollo);

      const accessPeFeatures = accessFeatures.map(feature => feature.feature.code);

      this.storageService.setItem('accessPeFeatures', accessPeFeatures);

      this.storageService.setItem(
        'accountUuid',
        this.userInfo?.uuid
      );
      this.checkAppMetadata(this.userInfo);
      //
      //

      if (this.userInfo?.procuringEntity) {
        this.storageService.setItem(
          'institutionRegComplete',
          this.userInfo?.procuringEntity?.isRegistrationComplete || false
        );

        this.storageService.setItem(
          'isLowerLevel',
          this.userInfo?.procuringEntity?.isLowerLevel || false
        );
        this.storageService.setItem(
          'budgetSystemVoteCode',
          this.userInfo?.procuringEntity?.budgetSystemVoteCode
        );
        this.storageService.setItem(
          'financialSystem',
          this.userInfo?.procuringEntity?.financialSystem
        );
      }
      if (this.userInfo?.tenderer) {
        this.storageService.setItem(
          'institutionRegComplete',
          this.userInfo?.tenderer?.isRegistrationComplete || false
        );
      }
      // Get User Details

      // if (user.id === 0) {
      //   return this.logout();
      // }

      //get to see if user is an institutional admin
      this.storageService.setItem(
        'isInstitutionAdministrator',
        this.userInfo?.isProcuringEntityAdministrator
      );
      //
      // < ==================== CUSTOME USER PERMISSION REDIRECTION ================================================================>

      this.storageService.setItem(
        'institutionId',
        this.userInfo.procuringEntity?.id + ''
      );
      this.storageService.setItem(
        'institutionUuid',
        this.userInfo?.procuringEntity?.uuid
      );
      this.storageService.setItem(
        'institutionName',
        this.userInfo?.procuringEntity?.name
      );
      this.storageService.setItem('hasSignature', !!this.userInfo?.hasSignature);
      this.storageService.setItem('hasHandover', !!this.userInfo?.hasHandover);
      this.storageService.setItem(
        'handedOverUserGroups',
        this.userInfo?.handedOverUserGroups
      );
      this.storageService.setItem(
        'institutionUpdate',
        !!this.userInfo.procuringEntity?.administrativeArea
      );


      if (this.userInfo.rolesListStrings?.length > 0) {
        this.userInfo.rolesListStrings.forEach((item) => {
          this.userInfo = {
            ...this.userInfo,
            permissions: [...this.userInfo.permissions, item]
          };
        });
      }

      if (this.userInfo.userTypeEnum === 'PPRA') {
        // try {
        //   this.userInfo.permissions.push('ROLE_PPRA_USER_ROLE');
        // } catch (e) {
        //   console.log(e);
        // }
        // this.userInfo.permissions.push('ROLE_PPRA_USER_ROLE');
        this.userInfo = {
          ...this.userInfo,
          permissions: [...this.userInfo.permissions, 'ROLE_PPRA_USER_ROLE']
        };
        this.storageService.setItem('serviceUserType', 'PPRA');
      } else if (this.userInfo.userTypeEnum === 'EMBASSY') {
        // this.userInfo.permissions.push('ROLE_EMBASSY_USER_ROLE');
        this.userInfo = {
          ...this.userInfo,
          permissions: [...this.userInfo.permissions, 'ROLE_EMBASSY_USER_ROLE']
        };
        this.storageService.setItem('serviceUserType', 'EMBASSY');
        this.storageService.setItem('hasSignature', !!this.userInfo?.hasSignature);
      } else if (this.userInfo.userTypeEnum === 'PROCURING_ENTITY') {
        // this.userInfo.permissions.push('ROLE_PE_USER_ROLE');
        this.userInfo = {
          ...this.userInfo,
          permissions: [...this.userInfo.permissions, 'ROLE_PE_USER_ROLE']
        };
        this.storageService.setItem('serviceUserType', 'PROCURING_ENTITY');
      } else if (this.userInfo.userTypeEnum === 'DIRECT_MANUFACTURER') {
        this.isTenderer.set(true);
        // this.userInfo.permissions.push('ROLE_DIRECT_MANUFACTURER_USER');
        this.userInfo = {
          ...this.userInfo,
          permissions: [...this.userInfo.permissions, 'ROLE_DIRECT_MANUFACTURER_USER']
        };
        this.storageService.setItem('serviceUserType', 'MANUFACTURER');
      } else if (this.userInfo.userTypeEnum === 'TENDERER') {
        this.isTenderer.set(true);
        // this.userInfo.permissions.push('ROLE_TENDERER_USER_ROLE');
        this.userInfo = {
          ...this.userInfo,
          permissions: [...this.userInfo.permissions, 'ROLE_TENDERER_USER_ROLE']
        };
        this.storageService.setItem('serviceUserType', 'TENDERER');
        this.storageService.setItem(
          'isNestTenderer',
          this.userInfo?.tenderer?.isForNest
        );
        this.storageService.setItem(
          'institutionId',
          this.userInfo.tenderer?.id + ''
        );
        this.storageService.setItem(
          'institutionUuid',
          this.userInfo?.tenderer?.uuid
        );
        this.storageService.setItem(
          'institutionName',
          this.userInfo?.tenderer?.name
        );
      } else if (this.userInfo.userTypeEnum === 'SUBSCRIBER') {
        // this.userInfo.permissions.push('ROLE_SUBSCRIBER_USER_ROLE');
        this.userInfo = {
          ...this.userInfo,
          permissions: [...this.userInfo.permissions, 'ROLE_SUBSCRIBER_USER_ROLE']
        };
        this.storageService.setItem('serviceUserType', 'SUBSCRIBER');
      } else {
        this.storageService.setItem('serviceUserType', 'ROLE_UNDEFINIED_USER');
      }
      //  <  ==================================== END OF CUSTOME USER PERMISSION REDIRECTION ===============================================>

      this.storageService.setItem('userUuid', JSON.stringify(this.userInfo?.uuid));
      this.storageService.setItem('phone', this.userInfo?.phone);
      this.storageService.setItem('fullName', this.userInfo?.fullName);
      this.storageService.setItem(
        'budgetSystem',
        this.userInfo?.procuringEntity?.budgetSystem
      );

      if (this.userInfo?.procuringEntity) {
        // Create a shallow copy of procuringEntity
        const procuringEntityCopy = { ...this.userInfo.procuringEntity };

        // Modify the copy
        procuringEntityCopy.uuid = this.userInfo?.procuringEntity?.uuid;
        procuringEntityCopy.logoUuid = this.userInfo?.procuringEntity?.logoUuid;

        // Reassign the modified copy back to this.userInfo.procuringEntity
        this.userInfo.procuringEntity = procuringEntityCopy;
      }

      // this.store.dispatch(getMyDetails());

      //
      this.store.dispatch(
        loadAuthUsers({
          authUsers: [
            {
              ...this.userInfo,
              userRoles: this.userInfo.userRoles,
              userDelegateProcuringEntityList:
                this.userInfo.userDelegateProcuringEntityList,
            },
          ],
        })
      );

      this.storageService.setItem('authorities', this.userInfo.permissions);
      this.liveChatHelperService.loadUserDetails();
      this.getDeviceId();

      return data;
    } else {
      return null;
    }
  }
  validateToken(token: string): Observable<any> {
    return this.http.get<any>(
      environment.AUTH_URL + `/nest-uaa/activate-account/` + token
    );
  }

  resetPasswordToken(formData: { resetToken: string }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/set-password`,
      formData
    );
  }

  resetPasswordTokenPE(formData: {
    otpToken: string;
    activationToken: string;
  }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/register/verify-token`,
      formData
    );
  }

  resendTokenPE(formData: { email: string }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/register/resend/otp/activation-token`,
      formData
    );
  }

  acceptMessageToken(token: string): Observable<any> {
    return this.http.get<any>(
      environment.AUTH_URL + `/nest-uaa/accept-profile/` + token
    );
  }

  checkIfActivated(formData: {
    email: string;
    activationToken: string;
  }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/register/check-otp`,
      formData
    );
  }

  rejectMessageToken(token: string): Observable<any> {
    return this.http.get<any>(
      environment.AUTH_URL + `/nest-uaa/reject-profile/` + token
    );
  }

  createPassword(formData: {
    newPassword: string;
    confirmPassword: string;
    activationToken: string;
    uuid: string;
  }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/change-password`,
      formData
    );
  }

  forgotPassword(formData: any): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL +
      `/nest-uaa/shd/anonymous/reset-password?email=` +
      formData.email,
      formData
    );
  }

  registerTenderer(formData: {
    email: string;
    phone: string;
  }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/register/tenderer`,
      formData
    );
  }

  sendResetToken(formData: { email: string }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/forgot-password`,
      formData
    );
  }

  sendEmail(formData: { email: string }): Observable<any> {
    return this.http.post<any>(
      environment.AUTH_URL + `/nest-uaa/register/resend`,
      formData
    );
  }

  onErrorRequest(error) {
    if (error.status === 400) {
      const message = error.error.error_description.includes(
        'could not execute'
      )
        ? 'Please enter valid email address'
        : error.error.error_description;
      const action = 'Dismiss';
      this.snackbar.open(message, action, {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'red-snackbar',
      });
      return message;
    }
    if (error.status === 401) {
      const message = error.error.error_description.includes(
        'could not execute'
      )
        ? 'Please enter valid email address'
        : error.error.error_description;
      const action = 'Dismiss';
      this.snackbar.open(message, action, {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'red-snackbar',
      });
      return message;
    }
  }

  saveCurrentDetails() {
    let currentLocation = this.storageService.getItem('loginRedirectURL') || '';
    let path = window.location.pathname;

    if (path != '/login' && path != '/register') {
      currentLocation = window.location.href;
    }

    this.storageService.setItem('loginRedirectURL', currentLocation);
    let currentUser = this.storageService.getItem('userID');
    this.storageService.setItem('previousUserID', currentUser);
  }

  redirectToLogin() {
    this.storageService.clearStorage();
    this.saveCurrentDetails();
    window.location.href = '/login';
    // this.router.navigateByUrl('/login');
  }

  collectFailedRequest(err: any): void {
    this.errorCode = err.status;
    if (this.errorCode === 400) {
      const message = 'Bad request';
      const action = 'Dismiss';
      // this.snackbar.open(message, action, {
      //   duration: 5000,
      //   verticalPosition: 'top',
      //   panelClass: 'red-snackbar',
      // });
    }

    if (this.errorCode === 401) {
      this.redirectToLogin();
    }

    if (this.errorCode === 404) {
      const message = 'Service Temporarily Unavailable';
      const action = 'Dismiss';
      // this.snackbar.open(message, action, {
      //   duration: 5000,
      //   verticalPosition: 'bottom',
      //   panelClass: 'red-snackbar',
      // });
      console.error('Service Temporarily Unavailable');
    }
    if (this.errorCode === 500) {
      const message = 'Service Temporarily Unavailable';
      const action = 'Dismiss';
      // this.snackbar.open(message, action, {
      //   duration: 5000,
      // });
      console.error('Service Temporarily Unavailable');
    }
    if (this.errorCode === 504) {
      const message = 'Service Temporarily Unavailable';
      const action = 'Dismiss';
      // this.snackbar.open(message, action, {
      //   duration: 5000,
      //   verticalPosition: 'bottom',
      //   panelClass: 'red-snackbar',
      // });
      console.error('Service Temporarily Unavailable');
    }
    if (this.errorCode === 0) {
      const message = 'Service Temporarily Unavailable';
      const action = 'Dismiss';
      // this.snackbar.open(message, action, {
      //   duration: 5000,
      //   verticalPosition: 'bottom',
      //   panelClass: 'red-snackbar',
      // });
    }
  }

  hasPermission(permission: string | string[]) {
    if (environment.ALLOW_PERMISSIONS && permission && permission?.length > 0) {
      const data = this.storageService.getItem('authorities')?.split(',');
      return data?.some((a) =>
        (Array.isArray(permission) ? permission : [permission]).includes(a)
      );
    }
    return true;
  }

  hasAccessFeatures(featureCode: string | string[]) {
    if (environment.ALLOW_PERMISSIONS && featureCode && featureCode?.length > 0) {
      const data = this.storageService.getItem('accessPeFeatures')?.split(',');
      return data?.some((a) =>
        (Array.isArray(featureCode) ? featureCode : [featureCode]).includes(a)
      );
    }
    return true;
  }

  checkLoggedInUserPermission(permission: string | string[]) {
    let hasPermission = this.hasPermission(permission);
    if (!hasPermission) {
      this.notificationService.errorMessage(
        "You don't have permission to access this page"
      );
      const canGoBack = window.history.length > 1;
      if (canGoBack) {
        this.location.back();
      } else {
        this.router.navigate(['/']).then();
      }
    }
  }

  processUserRedirectedRouteAfterLogin(users: AuthUser, router: Router) {
    if (users.hasSignature && users.tenderer.hasAcceptPolicy) {
      if (
        users.tenderer.businessType === 'FOREIGN_COMPANY' &&
        users.tenderer.embassyRegistrationStatus === 'REJECTED'
      ) {
        router.navigateByUrl('/tenderer_registration/account-locked').then();
      } else if (users.tenderer.isBlacklisted) {
        router.navigateByUrl('/tenderer_registration/account-blacklist').then();
      } else {
        if (users.tenderer.physicalAddress == 'null') {
          router
            .navigateByUrl('/tenderer_registration/physical-address')
            .then();
        } else {
          router.navigate(['', 'nest-tenderer', 'dashboard']).then();
        }
      }
    } else {
      router.navigateByUrl('/tenderer_registration/profile-completion').then();
    }
  }

  async setUserAgentDetails(item, apollo: GraphqlService) {
    this.savingData = true;
    if (item) {
      const response = await apollo.mutate({
        mutation: SET_USER_AGENT_DETAILS,
        apolloNamespace: ApolloNamespace.monitor,
        variables: {
          userAgentRequestDto: {
            browser: item.browser ?? "",
            deviceId: item.deviceId ?? "",
            deviceType: item.deviceType ?? "",
            email: item.email ?? "",
            fullName: item.fullName ?? "",
            ipAddress: item.ipAddress ?? "",
            os: item.os ?? "",
            platform: item.platform ?? "",
            userAgent: item.userAgent ?? "",
            userID: item.userID ?? "",
            userUuid: item.userUuid ?? "",
            userType: item.userType ?? "",
          },
        },
      });

      if (response?.data?.setUserAgentDetails?.code === 9000) {
        this.savingData = false;
      } else {
        console.error(response?.data?.setUserAgentDetails?.message ?? "Failed to set user agent details");
        this.savingData = false;
      }
    }

  }

  handlePageRedirectionAfterLoginSuccessful = async (
    notificationService: NotificationService,
    apollo: GraphqlService,
    router: Router
  ) => {
    const token = this.storageService.getItem('currentClient');

    await this.authRole(token, apollo);
    const serviceUserType = this.storageService.getItem('serviceUserType');
    const peRegComplete = this.storageService.getItem('institutionRegComplete');
    const hasSignature = this.storageService.getItem('hasSignature');
    const hasHandover = this.storageService.getItem('hasHandover');
    const isLowerLevel = this.storageService.getItem('isLowerLevel');

    const handedOverUserGroups = this.storageService.getItem(
      'handedOverUserGroups'
    );

    const userIsPeAdmin = this.storageService.getItem(
      'isInstitutionAdministrator'
    );

    const users: AuthUser = await firstValueFrom(
      this.store.pipe(
        select(selectAllAuthUsers),
        first((items) => items.length > 0),
        map((i) => i[0])
      )
    );


    const ipAddress = this.storageService.getItem('ipAddress');
    const userAgent = this.storageService.getItem('userAgent');
    const platform = this.storageService.getItem('platform');
    const os = this.storageService.getItem('os');
    const browser = this.storageService.getItem('browser');
    const deviceType = this.storageService.getItem('deviceType');
    const deviceId = this.storageService.getItem('deviceId');
    const email = this.storageService.getItem('email');
    const userUuid = this.storageService.getItem('userUuid');
    const fullName = this.storageService.getItem('fullName');
    const userID = this.storageService.getItem('userID');


    let setUserAgentDetails = {
      "deviceId": deviceId,
      "ipAddress": ipAddress,
      "userAgent": userAgent,
      "platform": platform,
      "os": os,
      "browser": browser,
      "deviceType": deviceType,
      "email": email,
      "userUuid": userUuid,
      "fullName": fullName,
      "userID": userID,
      "userType": serviceUserType
    };

    if (environment.MONITORING_ENABLED) {
      this.setUserAgentDetails(setUserAgentDetails, apollo);
    }

    console.log(users);

    if (serviceUserType === 'SUBSCRIBER' || serviceUserType === 'TENDERER') {
      if (users.tenderer) {
        if (
          users.tenderer?.isBusinessLineApproved ||
          users.tenderer.registrationStatus == 'APPROVED'
        ) {
          notificationService.successMessage('Welcome to NeST Platform.');
          const { billingStatus, failedToGetBillingStatus } =
            await this.getBillingStatus(apollo);
          if (!billingStatus && !failedToGetBillingStatus) {
            this.processUserRedirectedRouteAfterLogin(users, router);
          } else {
            const registrationBillPaymentCheck: BillPaymentCheck =
              await this.checkTendererRegistrationPaymentStatus(
                users.tenderer.uuid,
                apollo
              );
            if (
              registrationBillPaymentCheck &&
              registrationBillPaymentCheck.itemPaymentStatus
            ) {
              this.processUserRedirectedRouteAfterLogin(users, router);
            } else if (
              registrationBillPaymentCheck &&
              !registrationBillPaymentCheck.itemPaymentStatus
            ) {
              if (!billingStatus && !failedToGetBillingStatus) {
                this.processUserRedirectedRouteAfterLogin(users, router);
              } else if (billingStatus && !failedToGetBillingStatus) {
                router.navigateByUrl('/tenderer_registration').then();
              }
            }
          }
        } else {
          notificationService.successMessage(
            'Welcome to NeST Platform. Please register or subscribe for service'
          );
          router.navigateByUrl('/tenderer_registration').then();
        }
      } else {
        notificationService.successMessage(
          'Welcome to NeST Platform. Please register or subscribe for service'
        );
        router.navigateByUrl('/tenderer_registration').then();
      }
    } else if (serviceUserType === 'PPRA') {
      if (
        hasSignature == '' ||
        hasSignature == null ||
        hasSignature == 'false'
      ) {
        router.navigateByUrl('/pe-signature').then();
      } else {
        if (
          hasHandover == 'true' &&
          (handedOverUserGroups == 'null' ||
            handedOverUserGroups == null ||
            handedOverUserGroups == '')
        ) {
          router
            .navigateByUrl('/tenderer_registration/account-hand-over')
            .then();
        } else {
          // router.navigateByUrl('/landing?from=l').then();
          window.location.href = '/landing';
          // this.router.navigate(['/landing'], { state: { from: 'login' } });
          if (users.fullName) {
            notificationService.successMessage(`Welcome, ${users.salutation && users.salutation !== 'null' ? users.salutation + ' ' : ''}${users.fullName}`
            );
          } else {
            notificationService.successMessage('Welcome to NeST Dashboard');
          }
        }
      }
    } else if (serviceUserType === 'PROCURING_ENTITY') {


      if (isLowerLevel == 'true') {
        // console.log("isLowerLevel :", isLowerLevel, ' - ', isLowerLevel == 'true');
        router.navigateByUrl('/is-lower-level').then();
        return;
      }

      if (userIsPeAdmin === 'true') {
        if (peRegComplete === 'true') {
          if (
            hasSignature == '' ||
            hasSignature == null ||
            hasSignature == 'false'
          ) {
            router.navigateByUrl('/pe-signature').then();
          } else {
            if (
              hasHandover == 'true' &&
              (handedOverUserGroups == 'null' ||
                handedOverUserGroups == null ||
                handedOverUserGroups == '')
            ) {
              router
                .navigateByUrl('/tenderer_registration/account-hand-over')
                .then();
            } else {

              // router.navigateByUrl('/landing?from=l').then();
              this.router.navigate(['/landing'], { state: { from: 'login' } });
              if (users.fullName) {
                notificationService.successMessage(`Welcome, ${users.salutation && users.salutation !== 'null' ? users.salutation + ' ' : ''}${users.fullName}`
                );
              } else {
                notificationService.successMessage('Welcome to NeST Dashboard');
              }
            }
          }
        } else {
          if (
            hasSignature == '' ||
            hasSignature == null ||
            hasSignature == 'false'
          ) {
            router.navigateByUrl('/pe-signature').then();
          } else {
            router.navigateByUrl('/pe-self-registration').then();
            notificationService.successMessage(
              'Please update your institution details'
            );
          }
        }
      } else {
        if (
          hasSignature == '' ||
          hasSignature == null ||
          hasSignature == 'false'
        ) {
          router.navigateByUrl('/pe-signature').then();
        } else {
          if (
            hasHandover == 'true' &&
            (handedOverUserGroups == 'null' ||
              handedOverUserGroups == null ||
              handedOverUserGroups == '')
          ) {
            router
              .navigateByUrl('/tenderer_registration/account-hand-over')
              .then();
          } else {
            this.router.navigateByUrl('/landing', {
              state: { from: 'login' }
            });
            if (users.fullName) {
              notificationService.successMessage(`Welcome, ${users.salutation && users.salutation !== 'null' ? users.salutation + ' ' : ''}${users.fullName}`
              );
            } else {
              notificationService.successMessage('Welcome to NeST Dashboard');
            }
          }
        }
      }
    } else if (serviceUserType === 'EMBASSY') {
      if (
        hasSignature == '' ||
        hasSignature == null ||
        hasSignature == 'false'
      ) {
        router.navigateByUrl('/pe-signature').then();
      } else {
        router.navigate(['', 'nest-embassys', 'dashboard']).then();
        notificationService.successMessage('Welcome to NeST Dashboard');
      }
    } else if (serviceUserType === 'MANUFACTURER') {
      router.navigate(['nest-tenderer/tenders/invited-tenders']).then();
      notificationService.successMessage('Welcome to NeST Dashboard');
    } else {
      return await this.logout();
    }
  };

  getBillingStatus = async (
    apollo: GraphqlService
  ): Promise<{
    billingStatus: boolean;
    failedToGetBillingStatus: boolean;
  }> => {
    try {
      // const result: any = await apollo.fetchData({
      //   query: GET_GLOBAL_SETTING_BY_SETTING_KEY,
      //   apolloNamespace: ApolloNamespace.uaa,
      //   variables: { settingKey: 'ALLOW_BILLING' },
      // });

      // if (result.data.findGlobalSettingByKey.code === 9000) {
      //   const billingSettingsData = result.data.findGlobalSettingByKey.data;
      // const data: any = await firstValueFrom(
      //   this.http.get<any>(
      //     environment.AUTH_URL + `/nest-cache/settings/by/key/ALLOW_BILLING`
      //   )
      // );
      //
      // const billingSettingsData = data?.value;
      //
      // if (billingSettingsData) {
      //   return {
      //     billingStatus: billingSettingsData === 'ON',
      //     failedToGetBillingStatus: false,
      //   };
      // } else {
      //   return {
      //     failedToGetBillingStatus: true,
      //     billingStatus: false,
      //   };
      // }
      const billingSettingsData = environment.ALLOW_BILLING_SERVICE;
      return {
        billingStatus: billingSettingsData,
        failedToGetBillingStatus: false,
      };
    } catch (e) {
      console.error(e);
      return {
        failedToGetBillingStatus: true,
        billingStatus: false,
      };
    }
  };

  checkTendererRegistrationPaymentStatus = async (
    tendererUuid: string,
    apollo: GraphqlService
  ): Promise<BillPaymentCheck> => {
    const response: any = await apollo.fetchData({
      apolloNamespace: ApolloNamespace.billing,
      query: CHECK_TENDERER_REGISTRATION_PAYMENT_STATUS,
      variables: {
        tendererUuid: tendererUuid,
      },
    });
    if (
      [9000, 9005].includes(
        response.data.checkTendererRegistrationPaymentStatus.code
      )
    ) {
      return response.data.checkTendererRegistrationPaymentStatus.data;
    } else {
      return null;
    }
  };
}
