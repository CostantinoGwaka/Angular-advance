import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { UntypedFormBuilder, FormsModule } from '@angular/forms';
import {
  fadeIn,
  ROUTE_ANIMATIONS_ELEMENTS,
} from 'src/app/shared/animations/router-animation';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { StorageService } from '../../services/storage.service';
import { TranslationService } from '../../services/translation.service';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { Title } from '@angular/platform-browser';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [
    LayoutComponent,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RecaptchaModule,
    LoaderComponent,
    TranslatePipe
  ],
})
export class ForgetPasswordComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  savedSuccessful = false;
  email: string;
  showConfirm = false;
  savingData = false;
  emailFound = false;
  captcha: string;
  emailSecret: string = '';
  showCaptcha: boolean = false;

  showMessage: boolean = true;
  countdown: number = 90;
  countdownInterval: any;
  remainingTime: any;
  errorTimeMessage: any;
  errorMessageFound: boolean = false;

  languages = [
    { id: 'gb', name: 'English', key: 'ENGLISH', code: 'en' },
    { id: 'tz', name: 'Swahili', key: 'SWAHILI', code: 'sw' },
  ];
  defaultLanguage: string;
  currentFlag: string;
  currentLabel: string;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private translateService: TranslationService,
    private storageService: StorageService,
    private titleService: Title
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

  ngOnInit(): void {
  }

  checkEmailData(email) {
    const emailResent = this.storageService.getItem('emailResent');
    const nextTimeResentEmail = this.storageService.getItem('nextTimeResentEmail');

    if (emailResent == email && nextTimeResentEmail) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(nextTimeResentEmail, 10);

      const twentyMinutes = 20 * 60 * 1000; // 20 minutes in milliseconds

      if (timeElapsed < twentyMinutes) {
        // Less than 20 minutes passed
        this.errorMessageFound = true;
        const remainingTimeMs = twentyMinutes - timeElapsed;

        // Calculate minutes and seconds
        const remainingMinutes = Math.floor(remainingTimeMs / (60 * 1000));
        const remainingSeconds = Math.floor((remainingTimeMs % (60 * 1000)) / 1000);

        this.errorTimeMessage = `Please wait ${remainingMinutes} minute(s) and ${remainingSeconds} second(s) before resending the email.`;
      }
    } else {
      this.errorMessageFound = false;
    }
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }

  validateEmail(email: any) {
    this.checkEmailData(email);
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  onCancelShowConfirm() {
    this.showConfirm = false;
  }

  onSave(b: boolean) {
    this.forgotPassword({
      emailAddress: this.email,
    });
  }

  forgotPassword(formData: any) {
    this.savingData = true;
    this.authService
      .sendResetToken({
        email: formData.emailAddress,
      })
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.notificationService.successMessage(
              'Password reset link has been sent to your email',
              15000
            );
            // this.startCountdown();
            const now = Date.now();
            this.storageService.setItem('emailResent', formData.emailAddress);
            this.storageService.setItem('nextTimeResentEmail', now.toString());
            this.savedSuccessful = true;
            this.emailFound = true;
          } else {
            this.notificationService.errorMessage(response.message);
          }
          this.savingData = false;
        },
        error: (err) => {
          this.savingData = false;
          this.notificationService.errorMessage('User Not Found');
          this.emailFound = false;
        },
      });
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.clearCountdownInterval();
      }
    }, 1000);

    // Hide the message after 30 seconds
    setTimeout(() => {
      this.showMessage = false;
    }, 90000);
  }

  clearCountdownInterval() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
