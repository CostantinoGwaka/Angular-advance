import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/router-animation';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NotificationService } from '../../services/notification.service';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { Title } from '@angular/platform-browser';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PasswordStrengthBarComponent } from '../../shared/components/password-strength-bar/password-strength-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';

@Component({
    selector: 'app-create-password',
    templateUrl: './create-password.component.html',
    styleUrls: ['./create-password.component.scss'],
    standalone: true,
    imports: [
    LayoutComponent,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    PasswordStrengthBarComponent,
    LoaderComponent,
    MatButtonModule,
    TranslatePipe
],
})
export class CreatePasswordComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  hide1 = true;
  hide2 = true;
  username = '';
  password = '';
  loading = false;
  passwordStrength: number;
  private subscription = new Subscription();
  private rememberToken: string;
  title: string;
  tokenValid: boolean;
  public changePasswordForm: UntypedFormGroup;
  public barLabel = 'Password strength:';
  constructor(
    private router: Router,
    private route: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) { }
  ngOnInit(): void {
    this.rememberToken = this.activatedRoute.snapshot.paramMap.get('token');
    if (this.router.url.includes('create-password')) {
      this.title = 'Create Password';
    } else {
      this.title = 'Reset Password';
    }
    this.validateToken(this.rememberToken);
    this.initLoginForm();
  }

  async validateToken(token: string) {
    this.authService.validateToken(token).subscribe((data) => {
      if (data?.status) {
        // this.tokenValid = data?.status;
        this.router.navigate([
          '',
          'create-password',
          data['data']?.activationToken,
        ]);
      } else {
        this.tokenValid = data?.status;
        this.notificationService.errorMessage(data.message);
        this.router.navigate(['', 'login']);
      }
    });
  }

  initLoginForm() {
    this.changePasswordForm = new UntypedFormGroup({
      newPassword: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      confirmPassword: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      activationToken: new UntypedFormControl(
        this.rememberToken ? this.rememberToken : null
      ),
      uuid: new UntypedFormControl(
        this.rememberToken ? this.rememberToken : null
      ),
    });
  }

  getStrength(value) {
    this.passwordStrength = value;
  }

  login() {
    localStorage.setItem('isLoggedin', 'true');
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submitCreatePassword() {
    this.loading = true;
    this.changePasswordForm.disable();

    this.subscription.add(
      this.authService.createPassword(this.changePasswordForm.value).subscribe(
        (res) => this.handleResponse(res),
        (error) => this.handleError(error)
      )
    );
    // this.store.dispatch(createPassword({createPassword: this.changePasswordForm.value}));
  }

  handleResponse(res) {
    if (res.status) {
      this.notificationService.successMessage('Password created successfully');
      this.router.navigate(['', 'login']).then();
    } else {
      this.errorMessage(res);
      this.loading = false;
      this.changePasswordForm.enable();
      // this.changePasswordForm.reset()
    }
  }

  handleError(error) {
    this.errorMessage(error);
  }

  errorMessage(data) {
    this.notificationService.errorMessage(data.message);
  }
}
