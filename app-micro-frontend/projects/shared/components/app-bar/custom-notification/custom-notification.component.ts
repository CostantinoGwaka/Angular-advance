import { Component, OnInit, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-custom-notification',
    templateUrl: './custom-notification.component.html',
    styleUrls: ['./custom-notification.component.scss'],
    standalone: true,
    imports: [MatIconModule]
})
export class CustomNotificationComponent implements OnInit {

  @Input() url: string;
  @Input() countTenderUpdate: string;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }


}
