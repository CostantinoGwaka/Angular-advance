import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'animated-digit',
    templateUrl: './animated-digit.component.html',
    styleUrls: ['./animated-digit.component.scss'],
    standalone: true,
})
export class AnimatedDigitComponent implements AfterViewInit, OnChanges {
  @Input() duration: number;
  @Input() digit: number;
  @Input() fromDigit: number = 0;
  @Input() steps: number;
  @ViewChild('animatedDigit') animatedDigit: ElementRef;

  animateCount() {
    if (!this.duration) {
      this.duration = 1000;
    }

    if (typeof this.digit === 'number') {
      this.counterFunc(this.digit, this.duration, this.animatedDigit);
    }
  }

  counterFunc(endValue, durationMs, element) {
    if (!this.steps) {
      this.steps = 12;
    }

    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (endValue - 0) / stepCount;
    const sinValueIncrement = Math.PI / stepCount;

    let currentValue = this.fromDigit;
    let currentSinValue = 0;

    function step() {
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

      try {
        element.nativeElement.textContent = Math.abs(Math.floor(currentValue));

        if (currentSinValue < Math.PI) {
          window.requestAnimationFrame(step);
        }
      } catch (e) { }
    }

    step();
  }

  ngAfterViewInit() {
    if (this.digit) {
      this.animateCount();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['digit'] || changes['fromDigit']) {
      this.animateCount();
    }
  }
}
