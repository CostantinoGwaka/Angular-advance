import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { colors, getColor } from 'src/app/shared/colors';
import { CircularProgressBarComponent } from '../../circular-progress-bar/circular-progress-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
    selector: 'quick-stats',
    templateUrl: './quick-stats.component.html',
    styleUrls: ['./quick-stats.component.scss'],
    standalone: true,
    imports: [
    NgClass,
    MatIconModule,
    CircularProgressBarComponent
],
})
export class QuickStatsComponent implements OnInit {
  @Input() title: string = '';
  @Input() iconColor: string = '#21a43f';
  @Input() icon: string = '';
  @Input() value: any = '';
  @Input() showIcon = true;
  @Input() showPercentageChart: boolean = false;
  @Input() percentageChartColor = '#21a43f';
  @Input() percentageChartValue: number = 0;
  @Input() isActive = false;

  _showPercentageChart = false;

  transparentColor = '';
  iconStyle = '';

  colors = colors;

  constructor() { }

  ngOnChanges(): void {
    if (this.showPercentageChart) {
      setTimeout(() => {
        this._showPercentageChart = false;
        this._showPercentageChart = true;
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this._showPercentageChart = false;
  }

  ngOnInit(): void {
    let iconColor = getColor(this.iconColor);
    this.transparentColor = iconColor + '30';
    this.iconStyle = `background-color: ${this.transparentColor}; color:${iconColor}`;
  }
}
