import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';


@Component({
  selector: 'circular-progress-bar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
  standalone: true,
  imports: [NgChartsModule],
})
export class CircularProgressBarComponent implements OnInit {
  @Input() class = '';
  @Input() showValue = true;
  @Input() text = '';
  @Input() style = '';
  @Input() color = '#FF4136';
  @Input() backgroundColor = '#f1f1f1';
  @Input() valueStyle = '';
  @Input() textStyle = '';
  @Input() thickness = '80%';
  @Input() value = 0;
  @Input() valueIsPercent = true;

  constructor() {}

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  ngOnInit(): void {
    this.setComponent(this.value);
  }

  public doughnutProgressChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [];

  public doughnutProgressChartOptions = {
    responsive: false,
    cutout: '90%',
    plugins: {
      tooltip: { enabled: false },
    },
  };

  setComponent(value: number): void {
    this.doughnutProgressChartOptions = {
      ...this.doughnutProgressChartOptions,
      cutout: this.thickness,
    };

    this.doughnutProgressChartDatasets = [
      {
        data: [value, 100 - value],
        backgroundColor: [this.color, this.backgroundColor],
        borderWidth: 0,
      },
    ];
  }

  updateValue(value: number) {
    this.doughnutProgressChartDatasets[0].data = [value, 100 - value];
    this.chart.update();
    this.value = value;
  }

  updateColor(color: string, backgroundColor: string) {
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.doughnutProgressChartDatasets[0].backgroundColor = [
      this.color,
      this.backgroundColor,
    ];
    this.chart.update();
  }
}
