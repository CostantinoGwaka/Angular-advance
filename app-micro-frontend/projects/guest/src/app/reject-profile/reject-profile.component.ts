import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-reject-profile',
    templateUrl: './reject-profile.component.html',
    styleUrls: ['./reject-profile.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule]
})
export class RejectProfileComponent implements OnInit {

  private rememberToken: string;
  message: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.rememberToken = this.activatedRoute.snapshot.paramMap.get('token');
    this.validateToken(this.rememberToken);
  }


  async validateToken(token: string) {
    this.authService.rejectMessageToken(token).subscribe(data => {
      if (data?.status) {
        this.message = data.message;
      }
      else {
        this.message = data.message;
      }
    });
  }
}
