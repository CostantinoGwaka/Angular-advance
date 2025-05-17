import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { colors } from '../../colors';

export interface chartDataSet {
  data: number[];
  label: string;
  color: string;
}

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    standalone: true,
})
export class ChartComponent implements OnInit {
  @Input() type: string;
  @Input() labels: string[];
  @Input() datasets: chartDataSet[];
  @Input() showLegend: boolean;
  @Input() title: string;

  constructor() { }

  colors = colors;

  chartLabels: string[];
  chartDataset: ChartConfiguration;
  chartOptions: ChartOptions;

  createDougnutChart() { }

  ngOnInit(): void {
    this.createDougnutChart();
  }
}
