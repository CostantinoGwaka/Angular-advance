
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader-horizontal-stacked-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-loader-horizontal-stacked-bar-chart.component.html',
})
export class SkeletonLoaderHorizontalStackedBarChartComponent {
  @Input() numberOItems: number = 4;

  get items(): number[] {
    return Array.from({ length: this.numberOItems });
  }
}
