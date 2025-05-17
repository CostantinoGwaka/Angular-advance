import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    standalone: true
})
export class ResetPasswordComponent implements OnInit {

  private rememberToken: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.rememberToken = this.activatedRoute.snapshot.paramMap.get('token');
    this.validateToken(this.rememberToken).then();
  }

  async validateToken(token: string) {
    this.authService.resetPasswordToken(
      {
        resetToken: token
      }
    ).subscribe(data => {
      if (data?.status) {
        // this.notificationService.successMessage(data.message);
        this.router.navigate(['', 'create-password', data['data']?.activationToken]);
      } else {
        this.notificationService.errorMessage("User not found");
        this.router.navigate(['', 'login']);
      }
    });
  }

}
