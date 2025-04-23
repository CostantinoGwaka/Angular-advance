import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FilterComponent {

  counter = 0;

  constructor(private readonly cd: ChangeDetectorRef) {
    setInterval(() => {
      this.counter += 1;
      // this.cd.detectChanges();
    }, 1000);
  }
}
