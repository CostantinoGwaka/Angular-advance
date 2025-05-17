import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss'],
    standalone: true,
    imports: [LayoutComponent, ParallaxContainerComponent]
})
export class TermsAndConditionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
