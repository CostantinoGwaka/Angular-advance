import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { NestStatisticsServiceService } from 'src/app/modules/nest-statistics/nest-statistics-service.service';

export interface SingleHorizontalStackedBarChartItem {
  id?: string;
  value: number;
  label: string;
  color: string;
  textColor?: string;
}

@Component({
  selector: 'single-horizontal-stacked-bar-chart',
  templateUrl: './single-horizontal-stacked-bar-chart.component.html',
  styleUrls: ['./single-horizontal-stacked-bar-chart.component.scss'],
  standalone: true,
})
export class SingleHorizontalStackedBarChartComponent implements OnInit {
  constructor(private statsService: NestStatisticsServiceService) {}

  @Input() items: SingleHorizontalStackedBarChartItem[] = [];
  @Input() barHeight: number = null;
  @Input() wrapperClass: string = '';
  @Input({ required: true }) isClickable: boolean = false;

  itemsSortedByValue: SingleHorizontalStackedBarChartItem[] = [];

  ngOnInit(): void {}

  getBarItemWidth(itemValue: number): number {
    return (itemValue / this.getTotalValue()) * 100;
  }

  getTotalValue(): number {
    return this.items.reduce((acc, item) => {
      return acc + item.value;
    }, 0);
  }

  commaSeparate(num: number) {
    return NestUtils.commasSeparateNumber(num);
  }

  onStatValueClick(code: string) {
    if (!this.isClickable) return;
    this.statsService.viewStatsInTable(code);
  }
}
