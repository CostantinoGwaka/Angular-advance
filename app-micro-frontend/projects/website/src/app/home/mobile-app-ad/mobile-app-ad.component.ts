import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-mobile-app-ad',
    templateUrl: './mobile-app-ad.component.html',
    styleUrls: ['./mobile-app-ad.component.scss'],
    standalone: true,
    imports: [TranslatePipe]
})
export class MobileAppAdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
