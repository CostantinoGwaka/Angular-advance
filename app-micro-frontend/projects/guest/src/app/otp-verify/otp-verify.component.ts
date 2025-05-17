import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-otp-verify',
    templateUrl: './otp-verify.component.html',
    styleUrls: ['./otp-verify.component.scss'],
    standalone: true,
    imports: [FormsModule, LoaderComponent]
})
export class OtpVerifyComponent implements OnInit {

  rememberToken: string;
  phoneNumber: string;
  verifyBool: boolean = false;
  activateButton: boolean = false;
  countdown: string;

  oneNumber: string;
  twoNumber: string;
  threeNumber: string;
  fourthNumber: string;
  fiveNumber: string;
  email: string;
  showCount: boolean = true;


  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.rememberToken = this.activatedRoute.snapshot.paramMap.get('token');
    this.phoneNumber = this.activatedRoute.snapshot.paramMap.get('phone');
    this.email = this.activatedRoute.snapshot.paramMap.get('email');
    this.checkEndIfUserAlreadyActivate();
    // Set the countdown time in seconds
    const totalSeconds = 2 * 60 + 57;
    // Start the countdown
    this.startCountdown(totalSeconds);
  }


  startCountdown(totalSeconds: number) {
    this.showCount = true;
    const interval = setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // Format the countdown string
      this.countdown = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;

      totalSeconds--;

      if (totalSeconds < 0) {
        // Countdown is finished
        clearInterval(interval);
        this.countdown = '00:00';
        this.showCount = false;
      }
    }, 1000);
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }


  checkEndIfUserAlreadyActivate() {
    this.authService.checkIfActivated(
      {
        email: this.email,
        activationToken: this.rememberToken,
      }
    ).subscribe(data => {
      if (data?.status) {
        if (data['data']?.activationToken) {
          this.router.navigate(['', 'create-password', data['data']?.activationToken]).then();
        } else {
          this.notificationService.successMessage(`OTP sent to this ${this.phoneNumber}  number`);
        }
      } else {
        this.notificationService.errorMessage(data.message);
      }
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    //
  }

  twoNumberChange() {
  }

  threeNumberChange() {
  }


  fourthNumberChange() {
  }

  fiveNumberChange() {
  }

  isNumber(data) {
    return typeof data === 'number';
  }

  oneNumberChange() {
  }

  @ViewChild('otp4Input', { static: false }) otp4Input: ElementRef;

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.fiveNumber = null;
      this.fourthNumber = null;
    }
  }

  resendToken() {
    this.verifyBool = true;
    // Set the countdown time in seconds
    const totalSeconds = 2 * 60 + 57;
    // Start the countdown
    this.startCountdown(totalSeconds);
    this.authService.resendTokenPE(
      {
        email: this.email,
      }
    ).subscribe(data => {
      if (data?.status) {
        this.notificationService.successMessage(data.message);
        this.verifyBool = false;
      } else {
        this.notificationService.errorMessage(data.message);
        this.verifyBool = false;
      }
    });
  }

  verify() {
    this.verifyBool = true;
    this.authService.resetPasswordTokenPE(
      {
        otpToken: this.oneNumber.toString() + this.twoNumber.toString() + this.threeNumber.toString() + this.fourthNumber.toString() + this.fiveNumber.toString(),
        activationToken: this.rememberToken,
      }
    ).subscribe(data => {
      if (data?.status) {
        this.router.navigate(['', 'create-password', data['data']?.activationToken]).then();
        this.verifyBool = false;
      } else {
        this.notificationService.errorMessage(data.message);
        this.verifyBool = false;
      }
    });
  }

}
