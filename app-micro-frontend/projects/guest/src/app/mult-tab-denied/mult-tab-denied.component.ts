import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-mult-tab-denied',
    templateUrl: './mult-tab-denied.component.html',
    styleUrls: ['./mult-tab-denied.component.scss'],
    standalone: true
})
export class MultTabDeniedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  closeTab() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const isEdge = navigator.userAgent.toLowerCase().indexOf('edg') > -1;
    const isOpera = navigator.userAgent.toLowerCase().indexOf('opr') > -1;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isChrome || isFirefox || isEdge || isOpera || isSafari) {
      window.location.href = 'about:blank';
      window.close();
    } else {
      window.open('', '_self');
      window.close();
    }
  }

}
