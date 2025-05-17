import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaveAreaComponent } from '../components/save-area/save-area.component';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-show-time-out-popup',
  standalone: true,
  imports: [SaveAreaComponent],
  templateUrl: './show-time-out-popup.component.html',
  styleUrl: './show-time-out-popup.component.scss'
})
export class ShowTimeOutPopupComponent {

  totalTime = 300; // 5 minutes in seconds
  timeLeft = this.totalTime;
  timerInterval: any;

  countdownText!: HTMLElement;
  countdownCircle!: SVGCircleElement;
  extendBtn!: HTMLElement;
  cancelBtn!: HTMLElement;

  // Circle circumference: 2 * π * r
  radius = 36;
  circumference = 2 * Math.PI * this.radius;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private authService: AuthService,
    public _dialogRef: MatDialogRef<ShowTimeOutPopupComponent>
  ) { }

  ngOnInit(): void {
    this.countdownText = document.getElementById('countdownText')!;
    this.countdownCircle = document.getElementById('countdownCircle') as unknown as SVGCircleElement;
    this.extendBtn = document.getElementById('extendBtn')!;
    this.cancelBtn = document.getElementById('cancelBtn')!;

    this.countdownCircle.style.strokeDasharray = `${this.circumference}`;
    this.countdownCircle.style.strokeDashoffset = `0`;

    this.startTimer();
  }

  updateTimerDisplay(): void {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.countdownText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const progress = this.timeLeft / this.totalTime;
    const offset = this.circumference * (1 - progress);
    this.countdownCircle.style.strokeDashoffset = offset.toString();
  }

  startTimer(): void {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft <= 0) {
        this.cancelTimer();
        this._dialogRef.close();
      } else {
        this.timeLeft--;
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  extendTime(): void {
    this.notificationService.successSnackbar('Session Time Extended Successfully');
    const currentTime = Date.now(); // Current timestamp in ms
    const expireDuration = 15 * 60 * 1000; // 15 minutes = 900000 ms
    this.storageService.setItem('expireIn', (currentTime + expireDuration).toString());
    this._dialogRef.close(true);
  }

  cancelTimer(): void {
    this._dialogRef.close(false);
  }
}
