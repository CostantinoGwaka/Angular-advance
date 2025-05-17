import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from "../../../animations/router-animation";


@Component({
  selector: 'app-step',
  template: `@if (!hide) {<ng-content @fadeIn></ng-content>}`,
  animations: [fadeIn],
  standalone: true,
  imports: []
})
export class StepComponent implements OnChanges {
  @Input() stepTitle: string;
  @Input() permissions: string[] = [];
  @Input() buttonLabel: string;
  @Input() hideButton: boolean = false;
  @Input() stepDone: boolean = false;
  @Input() hasErrors: boolean = false;
  @Input() errorsCount: number = 0;
  @Input() index: number;
  isCurrentStep: boolean = false;
  isLastStep: boolean = false;
  hide: boolean = true;

  @Output() onStepDone: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  set setStepDone(status: boolean) {
    this.stepDone = status;
    if (status) {
      this.onStepDone.emit(status);
    }
  }

  ngOnChanges(): void {
    // console.log(this.buttonLabel);
  }

}
