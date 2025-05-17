import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-tenderer-summary-view',
    templateUrl: './tenderer-summary-view.component.html',
    styleUrls: ['./tenderer-summary-view.component.scss'],
    standalone: true
})
export class TendererSummaryViewComponent implements OnInit {
  @Input() color: string;
  @Input() tendererCategory: string;
  @Input() amount: number;

  constructor() { }

  ngOnInit(): void {
  }

}
