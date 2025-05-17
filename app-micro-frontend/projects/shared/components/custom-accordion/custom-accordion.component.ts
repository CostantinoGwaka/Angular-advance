import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-custom-accordion',
    templateUrl: './custom-accordion.component.html',
    styleUrls: ['./custom-accordion.component.scss'],
    standalone: true
})
export class CustomAccordionComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
