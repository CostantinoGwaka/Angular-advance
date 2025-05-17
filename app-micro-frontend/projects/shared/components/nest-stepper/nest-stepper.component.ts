import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnInit,
  Output,
  EventEmitter,
  OnChanges, AfterViewInit, Input, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {ApolloNamespace} from 'src/app/apollo.config';
import {StepComponent} from "./step/step.component";
import {fadeIn} from "../../animations/basic-animation";
import {fadeOut} from "../../animations/router-animation";
import {TranslatePipe} from '../../pipes/translate.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HasPermissionDirective} from '../../directives/has-permission.directive';
import {NgClass} from '@angular/common';

export interface StepUpdateEvent {
  stepNumber: number;
  isLastStep: boolean;
  stepLabel: string;
}

@Component({
  selector: 'app-nest-stepper',
  templateUrl: './nest-stepper.component.html',
  styleUrls: ['./nest-stepper.component.scss'],
  animations: [fadeIn, fadeOut],
  standalone: true,
  imports: [NgClass, HasPermissionDirective, MatButtonModule, MatIconModule, TranslatePipe]
})
export class NestStepperComponent implements AfterContentInit, OnInit, OnChanges, AfterViewInit {
  @ContentChildren(StepComponent) steps: QueryList<StepComponent>;
  @Output() saveAndContinueEvent: EventEmitter<StepUpdateEvent> = new EventEmitter<StepUpdateEvent>();
  @Output() onChangeStep: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRadioValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAfterViewInit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() showStepLabel: boolean = false;
  @Input() validateStep: boolean = true;
  @Input() useAsRadio: boolean = false;
  @Input() confirmStep: boolean = true;
  @Input() selectedRadioValue: string;
  @Input() useSaveAndContinue: boolean = true;
  currentStepIndex: number;
  saveAttempted: boolean = false;
  currentStep: StepComponent;

  constructor(private cdr: ChangeDetectorRef) {
    // this.initiateCurrentStep();
  }

  ngOnInit(): void {
    this.setCurrentStep();
  }


  initiateCurrentStep() {
    this.currentStepIndex = this.getIndexOfDefaultStep(this.selectedRadioValue);
    this.goToStep(this.currentStepIndex);
  }

  getIndexOfDefaultStep(selectedRadioValue: string): number {
    if (selectedRadioValue) {
      let indexOfStep = 1;
      (this.steps || []).forEach((step: StepComponent, index: number): void => {
        if (step.stepTitle == selectedRadioValue) {
          indexOfStep = index;
        }
      });
      this.onRadioValueChange.emit(selectedRadioValue);
      return indexOfStep;
    } else {
      return 1;
    }
  }

  triggerUIChanges(setDone: boolean = false) {
    this.cdr.detectChanges();
    this.currentStep = this.steps[this.currentStepIndex];
    if (setDone) {
      this.setCurrentStepDone();
    } else {
      this.unSetCurrentStepDone();
    }
  }

  ngAfterContentInit(): void {
    this.initiateCurrentStep();
    (this.steps || []).forEach((step: StepComponent, index: number): void => {
      step.index = index + 1;
      step.hide = index + 1 !== this.currentStepIndex;
    });
    (this.steps || []).map((item: StepComponent, index: number) => {
      if (this.currentStepIndex - 1 > index) {
        item.stepDone = true;
      }
      return item;
    });
  }

  getCurrentIndexFromTitle(title: string) {

    (this.steps || []).forEach((step: StepComponent, index: number): void => {
      if (step.stepTitle == title) {
        this.currentStepIndex = index + 1;
        this.goToStep(this.currentStepIndex);
      }
    });
  }

  goToStep(index: number): void {
    try {
      if (this.currentStepIndex == index) {
        this.steps[index] = this.currentStep;
      } else {
        if (this.validateStep) {
          if (index == 1 || index > 1 && index <= this.steps.length && (this.steps.get(index - 2).stepDone == true || !this.steps.get(index - 2))) {
            (this.steps || []).forEach((step: StepComponent): void => {
              step.hide = step.index !== index;
            });
            this.currentStepIndex = index;
            this.setCurrentStep();
          }
        } else {
          (this.steps || []).forEach((step: StepComponent): void => {
            step.hide = step.index !== index;
          });
          this.currentStepIndex = index;
          this.setCurrentStep();
        }

      }

      if (this.useAsRadio && this.currentStep) {
        this.onRadioValueChange.emit(this.currentStep.stepTitle);
      }

      this.onChangeStep.emit(this.currentStep);
    } catch (e) {
    }
    this.checkAndSetIsLastStep(index);
  }

  private checkAndSetIsLastStep(index) {
    (this.steps || []).forEach((step: StepComponent): void => {
      if (this.steps.length == index) {
        step.isLastStep = true;
      }
    });
  }

  unSetCurrentStepDone(): void {
    (this.steps || []).forEach((step: any, stepIndex: number) => {
      if (stepIndex == this.currentStepIndex - 1) {
        step.stepDone = false;
      }
      return step;
    });
    this.setCurrentStep();
    this.currentStep.stepDone = false;
    this.cdr.detectChanges();

  }

  setCurrentStepDone(): void {
    (this.steps || []).forEach((step: any, stepIndex: number) => {
      if (stepIndex == this.currentStepIndex - 1) {
        step.stepDone = true;
      }
      return step;
    });
    this.setCurrentStep();
    this.currentStep.stepDone = true;
    this.cdr.detectChanges();

  }

  refresh() {
    this.cdr.detectChanges();
  }

  setCurrentStepNotDone(): void {
    (this.steps || []).forEach((step: any, stepIndex: number) => {
      if (stepIndex == this.currentStepIndex - 1) {
        step.stepDone = false;
      }
      return step;
    });
    this.setCurrentStep();
    this.currentStep.stepDone = false;
  }

  setNextStepNotDone(): void {
    (this.steps || []).forEach((step: any, stepIndex: number) => {
      if (stepIndex == this.currentStepIndex) {
        step.stepDone = false;
      }
      return step;
    });
  }

  setNextStepDone(): void {
    (this.steps || []).forEach((step: any, stepIndex: number) => {
      if (stepIndex == this.currentStepIndex) {
        step.stepDone = true;
      }
      return step;
    });
  }

  setLastStepNotDone(): void {
    (this.steps || []).forEach((step: any, stepIndex: number) => {
      if (stepIndex == this.steps.length - 1) {
        step.stepDone = false;
      }
      return step;
    });
  }

  setLastStepDone(): void {
    (this.steps || []).forEach((step: any, stepIndex: number) => {
      if (stepIndex == this.steps.length - 1) {
        step.stepDone = true;
      }
      return step;
    });
  }

  public nextStep(): void {
    const nextStepIndex: number = this.currentStepIndex + 1;
    if (nextStepIndex <= this.steps.length) {
      this.goToStep(nextStepIndex);
    }
  }

  public prevStep(): void {
    const nextStepIndex: number = this.currentStepIndex > 0 ? this.currentStepIndex - 1 : 0;
    if (nextStepIndex <= this.steps.length) {
      this.goToStep(nextStepIndex);
    }
  }

  setCurrentStep() {
    if (this.steps) {
      this.steps.forEach((step: StepComponent, index: number): void => {
        if (this.currentStepIndex - 1 == index) {
          this.currentStep = step;
        }
      });
    }
  }

  saveAndContinue(): void {
    let event: StepUpdateEvent = {
      stepNumber: this.currentStepIndex,
      isLastStep: this.steps.find((step: StepComponent) => step.index == this.currentStepIndex).isLastStep,
      stepLabel: this.steps.find((step: StepComponent) => step.index == this.currentStepIndex).stepTitle
    }
    this.saveAndContinueEvent.emit(event);
    this.saveAttempted = false;
  }

  attemptSave() {
    if (this.confirmStep) {
      this.saveAttempted = true;
    } else {
      this.saveAndContinue();
    }
  }

  ngOnChanges(): void {
    if (this.currentStepIndex) {
      this.initiateCurrentStep();
      (this.steps || []).forEach((step: StepComponent, index: number): void => {
        step.index = index + 1;
        step.hide = index + 1 !== this.currentStepIndex;
      });
      (this.steps || []).map((item: StepComponent, index: number) => {
        if (this.currentStepIndex - 1 > index) {
          item.stepDone = true;
        }
        return item;
      });
    }

  }

  ngAfterViewInit(): void {
    this.initiateCurrentStep();
    this.steps.forEach((step: StepComponent, index: number): void => {
      step.index = index + 1;
      step.hide = index + 1 !== this.currentStepIndex;
    });
    this.steps.map((item: StepComponent, index: number) => {
      if (this.currentStepIndex - 1 > index) {
        item.stepDone = true;
      }
      return item;
    });
    this.onAfterViewInit.emit(true);
  }
}
