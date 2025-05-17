import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { RealTimeComponent } from '../real-time.component';

@Component({
    selector: 'common-realtime-clock',
    templateUrl: './common-realtime-clock.component.html',
    standalone: true,
    imports: [RealTimeComponent],
})
export class CommonRealtimeClockComponent implements OnInit {

  @Input()
  xPosition: 'center' | 'left' | 'right' = 'center';

  constructor() { }

  ngOnInit(): void { }
}
