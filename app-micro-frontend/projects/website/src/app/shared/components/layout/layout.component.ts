import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FooterComponent } from '../footer/footer.component';
import { CommonRealtimeClockComponent } from '../../../../shared/components/real-time/common-reatime-clock/common-realtime-clock.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'web-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [
        NavBarComponent,
        CommonRealtimeClockComponent,
        FooterComponent,
    ],
})
export class LayoutComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
