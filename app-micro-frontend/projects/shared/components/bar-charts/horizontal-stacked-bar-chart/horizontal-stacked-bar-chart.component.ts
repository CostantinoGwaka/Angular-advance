import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  SingleHorizontalStackedBarChartItem,
  SingleHorizontalStackedBarChartComponent,
} from '../single-horizontal-stacked-bar-chart/single-horizontal-stacked-bar-chart.component';
import { NgClass } from '@angular/common';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import {
  HorizontalStackedBarChartWithLegendComponent,
  HorizontalStackedBarChartWithLegendData,
} from 'src/app/modules/nest-statistics/components/horizontal-stacked-bar-chart-with-legend/horizontal-stacked-bar-chart-with-legend.component';
import { MatIconModule } from '@angular/material/icon';
import { NestStatisticsServiceService } from 'src/app/modules/nest-statistics/nest-statistics-service.service';

export interface HorizontalStackedBarChatData {
  id?: string;
  code: string;
  data: SingleHorizontalStackedBarChartItem[];
  label: string;
  value?: number;
}

@Component({
  selector: 'horizontal-stacked-bar-chart',
  templateUrl: './horizontal-stacked-bar-chart.component.html',
  styleUrls: ['./horizontal-stacked-bar-chart.component.scss'],
  standalone: true,
  imports: [
    SingleHorizontalStackedBarChartComponent,
    NgClass,
    HorizontalStackedBarChartWithLegendComponent,
    MatIconModule
],
})
export class HorizontalStackedBarChartComponent implements OnInit {
  constructor(private statsService: NestStatisticsServiceService) {}

  verticalBars: any[] = [];

  @Input()
  dataSet: HorizontalStackedBarChatData[] = [];
  sortedDataSet: HorizontalStackedBarChatData[] = [];
  totalValues: number = 0;

  extraHeight: number = 10;
  wrapperHeight: number = this.extraHeight;

  expandedItemData: HorizontalStackedBarChartWithLegendData[] = [];
  expandedItemTitle: string = '';

  ngOnInit(): void {
    this.sortDataSet();
    this.createVerticalBars();
    this.setHeight();
  }

  setHeight() {
    this.wrapperHeight = this.dataSet.length * 50 + this.extraHeight;
  }

  createVerticalBars(): void {
    let totalSize =
      this.sortedDataSet.length > 0 ? this.sortedDataSet[0].value : 100;
    let barSize = totalSize / 5;

    this.totalValues = this.sortedDataSet.reduce((acc, item) => {
      return acc + item.value;
    }, 0);

    for (let i = 0; i < 5; i++) {
      let bar = {
        position: barSize * (i + 1),
      };
      this.verticalBars.push(bar);
    }
  }

  sortDataSet() {
    this.sortedDataSet = this.dataSet.sort((a, b) => {
      return this.getTotalValue(b) - this.getTotalValue(a);
    });
  }

  getTotalValue(item: HorizontalStackedBarChatData): number {
    item.value = item.data.reduce((acc, item) => {
      return acc + item.value;
    }, 0);
    return item.value;
  }

  separateByThousands(num: number): string {
    let _num = NestUtils.separateNumberIntoThousands(num);
    return NestUtils.roundNumber(_num.number, 1) + `${_num.suffix.charAt(0)}`;
  }

  expand(data: HorizontalStackedBarChatData) {
    this.expandedItemTitle = data.label;
    this.expandedItemData = data.data.map((item) => {
      return {
        label: item.label,
        id: item.id,
        value: item.value,
        color: item.color,
        textColor: item.textColor,
      };
    });
  }

  hideExpandedItem() {
    this.expandedItemData = [];
    this.expandedItemTitle = '';
  }
  onStatValueClick(code: string) {
    this.statsService.viewStatsInTable(code);
  }
}
