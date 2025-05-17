import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ROUTE_ANIMATIONS_ELEMENTS } from "../../shared/animations/router-animation";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { StorageService } from "../../services/storage.service";
import { NotificationService } from "../../services/notification.service";
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, NgIf } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-request-change-password',
  templateUrl: './request-change-password.component.html',
  styleUrls: ['./request-change-password.component.scss'],
  standalone: true,
  imports: [LayoutComponent, NgClass, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, NgIf, LoaderComponent, MatButtonModule, RouterLink]
})
export class RequestChangePasswordComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  hide = true;
  username = '';
  password = '';
  loading = false;

  constructor(
    private router: Router,
    private route: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private apollo: GraphqlService,
    private notificationService: NotificationService,
  ) { }
  ngOnInit(): void { }

  login() {
    localStorage.setItem('isLoggedin', 'true');
    this.router.navigate(['/']);
  }

  async submitLogin(auth: any) {
    try {
      this.loading = true;
      // this.storageService.clearStorage();
      await this.authService.alreadyLoggedIn() == true ? this.storageService.clearStorage() :
        await this.authService.login(auth);
      const token = this.storageService.getItem('currentClient');
      await this.authService.authRole(token, this.apollo).then();
      const serviceUserType = this.storageService.getItem('serviceUserType');
      const institutionUpdate = this.storageService.getItem('institutionUpdate');
      const isFirstLogin = this.storageService.getItem('firstLogin');
      if (serviceUserType === 'SUBSCRIBER' || serviceUserType === 'TENDERER') {
        this.notificationService
          .successMessage('Logged in Successfully, !Welcome to NeST Platform, Please Register or Subscribe for service',);
        this.route.navigateByUrl('/tenderer_registration');
      } else if (serviceUserType === 'PPRA') {
        this.notificationService.successMessage('Logged in  Successfully, !Welcome to NeST Dashboard',);
        // this.route.navigateByUrl('/landing');
        window.location.href = '/landing';

      }
      else if (serviceUserType === 'PROCURING_ENTITY') {
        if (!!institutionUpdate === true) {
          if (!!isFirstLogin === true) {
            this.notificationService.successMessage('Logined Successfuly, !PLease Create Department of your institution',);
            this.route.navigateByUrl('/settings/departments');
          } else {
            this.notificationService.successMessage('Logined Successfuly, !Welcome to NeST Dasboard',);
            // this.route.navigateByUrl('/landing');
            window.location.href = '/landing';

          }
        } else {
          this.notificationService.successMessage('Logined Successfuly, !PLease Update your institution Details',);
          this.route.navigateByUrl('/institution/edit-intitution-details');
        }
      }
      else {
        // this.notificationService.warningMessage('Dear Coustomer !, your profile is missing some details, Please Register First', );
        return await this.authService.logout();

      }
    } catch (e) {
      this.loading = false;
    }
  }
}
