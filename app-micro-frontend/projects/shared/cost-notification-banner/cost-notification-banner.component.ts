import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-cost-notification-banner',
    templateUrl: './cost-notification-banner.component.html',
    styleUrls: ['./cost-notification-banner.component.scss'],
    standalone: true,
    imports: [],
})
export class CostNotificationBannerComponent implements OnInit {
  @Input() isEvaluating;
  ngOnInit(): void {}


}
