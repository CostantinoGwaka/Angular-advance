import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';


export type DataCreationStepStage =
  | 'PENDING'
  | 'ON_PROGRESS'
  | 'FINISHED'
  | 'FAILED';

export interface DataGenerationStep {
  code: string;
  title: string;
  progress?: number;
  stage: DataCreationStepStage;
}

@Component({
    selector: 'data-generation-step',
    templateUrl: './data-generation-step.component.html',
    styleUrls: ['./data-generation-step.component.scss'],
    standalone: true,
    imports: [
    MatIconModule,
    MatProgressSpinnerModule
],
})

export class DataGenerationStepComponent implements OnInit {
  @Input()
  creationSteps: DataGenerationStep[];

  constructor() { }

  ngOnInit(): void { }
}
