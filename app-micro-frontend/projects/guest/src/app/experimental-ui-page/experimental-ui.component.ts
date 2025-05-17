import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { GraphqlService } from "../../services/graphql.service";
import { NotificationService } from "../../services/notification.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {MatCheckbox} from "@angular/material/checkbox";
import {
  ConfirmPricingAmountComponent
} from "../../modules/nest-tenderer/tender-submission/submission/components/pricing/confirm-pricing-amount/confirm-pricing-amount.component";

@Component({
    selector: 'experimental-ui-page',
    templateUrl: './experimental-ui.component.html',
    styleUrls: ['./experimental-ui.component.scss'],
    standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule, MatProgressSpinnerModule, MatCheckbox, ConfirmPricingAmountComponent]
})

export class ExperimentalUiComponent implements OnInit {
  hasError: boolean = false;
  loading: boolean = true;
  status: string;
  token: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private apollo: GraphqlService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {}

}
