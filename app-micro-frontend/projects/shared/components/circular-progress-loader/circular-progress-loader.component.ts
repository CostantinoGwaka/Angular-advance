import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { CircularProgressBarComponent } from '../circular-progress-bar/circular-progress-bar.component';
import { AnimatedDigitComponent } from '../animated-digit/animated-digit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
    selector: 'app-circular-progress-loader',
    templateUrl: './circular-progress-loader.component.html',
    styleUrls: ['./circular-progress-loader.component.scss'],
    standalone: true,
    imports: [
    CircularProgressBarComponent,
    MatProgressSpinnerModule,
    AnimatedDigitComponent
],
})
export class CircularProgressLoaderComponent implements OnInit {
  @Input()
  percentageProgress = 0;

  prevPercentageProgress = 0;

  @Input()
  message = 'Loading...';

  @Input()
  size = 250;

  @Input()
  progressColor = '#049E26';

  @Input()
  showLoadingIndicator = false;

  @ViewChild('progressRef')
  progressRef: CircularProgressBarComponent;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['percentageProgress']) {
      const value = changes['percentageProgress'].currentValue;
      this.updateLoadingPercent(value);
    }
    if (changes['progressColor']) {
      this.progressRef?.updateColor(
        changes['progressColor'].currentValue,
        changes['progressColor'].currentValue + '10'
      );
    }
  }

  updateLoadingPercent(value: number) {
    this.percentageProgress = value;
    this.prevPercentageProgress = this.percentageProgress;
    this.progressRef?.updateValue(this.percentageProgress);
  }
}
