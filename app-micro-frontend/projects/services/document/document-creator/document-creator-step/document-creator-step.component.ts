import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from '../../../../apollo.config';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

export type DocumentCreationStepCode =
  | 'INITIALIZE'
  | 'SENDING_DATA'
  | 'CREATING_PDF'
  | 'SAVING_DOCUMENT'
  | 'FINISH'
  | 'POPULATING_DATA';

export type DocumentCreationStepStage =
  | 'PENDING'
  | 'ON_PROGRESS'
  | 'FINISHED'
  | 'FAILED';
export interface DocumentCreationStep {
  code: DocumentCreationStepCode;
  title: string;
  stage: DocumentCreationStepStage;
  requestStartTime?: Date;
}

@Component({
    selector: 'document-creator-step',
    templateUrl: './document-creator-step.component.html',
    styleUrls: ['./document-creator-step.component.scss'],
    standalone: true,
    imports: [
    MatIconModule,
    MatProgressSpinnerModule
],
})
export class DocumentCreatorStepComponent implements OnInit {
  @Input()
  isFirst: boolean = false;

  @Input()
  isLast: boolean = false;

  @Input()
  creationStep: DocumentCreationStep;

  constructor() { }

  ngOnInit(): void { }
}
