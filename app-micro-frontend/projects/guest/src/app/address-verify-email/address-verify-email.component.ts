import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../../shared/components/loader/loader.component';


@Component({
    selector: 'app-address-verify-email',
    templateUrl: './address-verify-email.component.html',
    styleUrls: ['./address-verify-email.component.scss'],
    standalone: true,
    imports: [LoaderComponent, MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule]
})
export class AddressVerifyEmailComponent implements OnInit {
  token: string;
  message: string;
  status: boolean = false;
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    this.activateAddressAccount(this.token).subscribe((data) => {
      this.status = data?.status;
      if (data?.status) {
        this.message = data.message;
      } else {
        this.message = data.message;
      }
      this.loading = false;
    });
  }


  activateAddressAccount(token: string): Observable<any> {
    return this.http.get<any>(
      environment.AUTH_URL + `/nest-uaa/get/verify/tenderer/address/` + token
    );
  }

}
