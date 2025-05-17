import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { NestVerticalStepComponent } from './nest-vertical-step/nest-vertical-step.component';

export interface Step { index: number, title: string, active: boolean, id: string };
@Component({
    selector: 'app-nest-vertical-stepper',
    templateUrl: './nest-vertical-stepper.component.html',
    styleUrls: ['./nest-vertical-stepper.component.scss'],
    standalone: true,
    imports: [NestVerticalStepComponent]
})
export class NestVerticalStepperComponent implements OnInit {
  steps: Step[] = [
    { index: 1, title: 'Price Schedule for Spare Parts', active: false, id: 'spareParts' },
    { index: 2, title: 'Related Services', active: false, id: 'relatedService' },
    { index: 3, title: 'Incidental Services', active: false, id: 'incidentalService' },
    { index: 4, title: 'After Sales Services', active: false, id: 'afterSaleService' },
  ];
  currentStep: Step;
  @Output() onStepChangedEvent: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit(): void {
    // Initialize the stepper with the first step
    this.setCurrentStep(0);
  }

  setCurrentStep(stepIndex: number): void {
    this.steps.map((step: Step): boolean => step.active = false);
    this.steps[stepIndex].active = true;
    this.currentStep = this.steps[stepIndex];
  }

  onStepSelectedEvent(stepIndex: number): void {
    this.setCurrentStep(stepIndex);
    this.onStepChangedEvent.emit(this.currentStep);
  }



}
