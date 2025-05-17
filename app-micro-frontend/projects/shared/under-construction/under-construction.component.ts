import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { firstValueFrom, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-under-construction',
    templateUrl: './under-construction.component.html',
    styleUrls: ['./under-construction.component.scss'],
    standalone: true,
    imports: [MatIconModule]
})
export class UnderConstructionComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {

  }

  routeSub = Subscription.EMPTY;
  description: any;

  ngOnInit(): void {
    this.routeSub = this.activeRoute.queryParams.subscribe((items) => {
      this.description = items['data'];
    });
  }

  async checkIsActivated() {
    await this.router.navigate(['/login']);
  }

}
