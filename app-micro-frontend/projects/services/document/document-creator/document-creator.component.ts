import { StorageService } from "../../storage.service";
import { AttachmentService } from '../../attachment.service';
import { TemplateInfo } from '../../../shared/interfaces';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ApolloNamespace } from '../../../apollo.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DataFetcher,
  DataFetcherCircularProgressComponent,
} from '../../../shared/components/data-fetcher-circular-progress/data-fetcher-circular-progress.component';
import { GraphqlService } from '../../graphql.service';
import {
  DocumentCreationStep,
  DocumentCreatorStepComponent,
} from './document-creator-step/document-creator-step.component';
import {
  SEND_DOCUMENT_CREATOR_COMMAND,
  SET_DOCUMENT_AS_FAILED_POPULATING_DATA,
} from '../store/document-creator.graphql';
import { TemplateDocumentTypesEnum } from '../store/document-creator.model';
import { DOCUMENT_CREATION_STATUS } from '../../../modules/nest-tender-initiation/store/tender-document-creator/tender-document.graphql';
import {
  DocumentCreatorResults,
  PlaceholderReplacementSummary,
} from '../../../modules/nest-tender-initiation/store/tender-document-creator/tender-document.model';
import { NestUtils } from '../../../shared/utils/nest.utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { PlaceholdersReplacementSummaryComponent } from './placeholders-replacement-summary/placeholders-replacement-summary.component';
import { MatCardModule } from '@angular/material/card';
import { DataFetcherCircularProgressComponent as DataFetcherCircularProgressComponent_1 } from '../../../shared/components/data-fetcher-circular-progress/data-fetcher-circular-progress.component';

import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RemoteLogService } from '../../../shared/utils/remote-log.service';
import { TextConfig } from '../../../shared/utils/ttext.service';

export enum DocumentCreatorCommandEnum {
  INITIALIZE = 'INITIALIZE',
  POPULATE_DATA = 'POPULATE_DATA',
  SAVE_DATA = 'SAVE_DATA',
  CREATE_PDF = 'CREATE_PDF',
  SAVE_DOCUMENT = 'SAVE_DOCUMENT',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
}

export interface DocumentCreationData {
  title: string;
  data: any;
  template: TemplateInfo;
  item_uuid: string;
  addTableOfContents?: boolean;
  keepHTML?: boolean;
  documentType: TemplateDocumentTypesEnum;
  dataFetcher?: DataFetcher;
  withTableOfContents?: boolean;
  forPPRAAdmin?: boolean;
}

@Component({
  selector: 'app-document-creator',
  templateUrl: './document-creator.component.html',
  styleUrls: ['./document-creator.component.scss'],
  standalone: true,
  imports: [
    MatRippleModule,
    MatIconModule,
    DataFetcherCircularProgressComponent_1,
    MatCardModule,
    DocumentCreatorStepComponent,
    PlaceholdersReplacementSummaryComponent,
    MatButtonModule,
    MatProgressSpinnerModule
],
})
export class DocumentCreatorComponent implements OnInit,OnDestroy {
  documentCreationData: DocumentCreationData;

  isFetchingData = false;

  creationSteps: DocumentCreationStep[] = [];

  documentUuid: string = null;
  pdfDocumentUuid: string = null;
  cancel: boolean = false;
  finished: boolean = false;
  accepted: boolean = false;

  errorMessage: string = null;
  gettingFile: boolean = false;

  isFetchingStatus = false;

  isInitializing = true;
  hasReachedMaximumChecks = false;
  documentCreatorResults: DocumentCreatorResults;

  statusCheckInterval: any;
  statusCheckInterval2: any;
  statusCheckIntervalPeriod: number = 1000 * 10; //10 seconds
  maximumTimeForRequestToBeConsideredFailed: number = 1000 * 60 * 6; //
  isBuilding = false;

  maxStatusCheckCount: number = 40;
  statusCheckCount: number = 0;

  placeholdersErrorsExist = false;

  stopOnDocumentErrors = false;
  canContinue = false;
  canViewDocument = false;

  placeholderReplacementSummary: PlaceholderReplacementSummary;

  data: any = null;

  @ViewChild('dataFetcher') dataFetcher: DataFetcherCircularProgressComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogDataDocumentCreationData: DocumentCreationData,
    private dialogRef: MatDialogRef<DocumentCreatorComponent>,
    private apollo: GraphqlService,
    private attachmentService: AttachmentService,
    private storageService: StorageService,
    private remoteLogService: RemoteLogService
  ) {
    this.documentCreationData = dialogDataDocumentCreationData;
  }

  ngOnInit(): void {
    let allowedPEUuidsForTestingDocumentCreation = [
      'eb3a2300-27c2-437f-a34e-9c77df5fa784',
    ];

    let peUuid = this.storageService.getItem('institutionUuid');

    this.stopOnDocumentErrors = NestUtils.isLiveEnvironment();

    if (allowedPEUuidsForTestingDocumentCreation.includes(peUuid)) {
      this.stopOnDocumentErrors = false;
    }

    this.documentCreationData = this.dialogDataDocumentCreationData;

    this.data = JSON.parse(JSON.stringify(this.documentCreationData.data));

    if (this.documentCreationData?.dataFetcher) {
      this.fetchDataInQueue();
    } else {
      this.startDocumentCreation().then();
    }
  }

  fetchDataInQueue() {
    this.isFetchingData = true;
  }

  updateData(documentCreationData: any) {
    this.documentCreationData = documentCreationData;
    this.data = JSON.parse(JSON.stringify(this.documentCreationData.data));
    //
  }

  onFetchingComplete(data: any) {
    this.isFetchingData = false;
    this.startDocumentCreation().then();
  }

  ngOnDestroy() {
    this.cancel = true;
    if (!this.accepted) {
      this.sendCommand(
        DocumentCreatorCommandEnum.DELETE_DOCUMENT,
        this.documentUuid,
        {}
      ).then();
    }
  }

  exit() {
    this.cancel = true;
    this.dialogRef.close();
  }

  save() {
    this.accepted = true;
    this.dialogRef.close({
      documentUuid: this.documentUuid,
      pdfDocumentUuid: this.pdfDocumentUuid,
      payload: this.documentCreationData,
    });
  }

  initializeSteps() {
    this.creationSteps = [
      {
        code: 'INITIALIZE',
        title: 'Initializing',
        stage: 'PENDING',
      },
      {
        code: 'SENDING_DATA',
        title: 'Sending Data',
        stage: 'PENDING',
      },
      {
        code: 'POPULATING_DATA',
        title: 'Populating data',
        stage: 'PENDING',
      },
      {
        code: 'CREATING_PDF',
        title: 'Creating PDF',
        stage: 'PENDING',
      },
      {
        code: 'FINISH',
        title: 'Finishing',
        stage: 'PENDING',
      },
    ];
  }

  async goToCreationStep(step: DocumentCreationStep) {
    if (!this.storageService.getItem('isLoggedin')) {
      return;
    }
    this.cancel = false;
    try {
      this.markStepOnProgress(step);

      let results: any;
      step.requestStartTime = new Date();

      switch (step.code) {
        case 'INITIALIZE':
          results = await this.sendCommand(
            DocumentCreatorCommandEnum.INITIALIZE,
            this.documentUuid,
            {
              templateUuid: this.documentCreationData.template.uuid,
              documentType: this.documentCreationData.documentType,
              itemUuid: this.documentCreationData.item_uuid,
            }
          );
          if (results?.code == 9000) {
            this.documentUuid = results.data.documentUuid ?? results.data.data.documentUuid;
            if (this.documentUuid){
              await this.markStepFinished(step);
              this.goToCreationStep(this.creationSteps[1]).then();
            }else{
              this.canContinue = false;
              this.stopProcess(step, 'Error initializing document creation');
              break;
            }
          } else {
            this.canContinue = false;
            this.stopProcess(step, 'Error initializing document creation');
            break;
          }
          break;

        case 'SENDING_DATA':
          results = await this.sendCommand(
            DocumentCreatorCommandEnum.SAVE_DATA,
            this.documentUuid,
            this.data
          );
          if (results?.code == 9000) {
            await this.markStepFinished(step);
            this.goToCreationStep(this.creationSteps[2]).then();
          } else {
            this.canContinue = false;
            this.stopProcess(step, 'Error in sending data');
            break;
          }
          break;

        case 'POPULATING_DATA':
          results = await this.sendCommand(
            DocumentCreatorCommandEnum.POPULATE_DATA,
            this.documentUuid
          );

          if (results?.code == 9000) {
            this.statusCheckIntervalPeriod = 1000 * 10; //10 seconds
            this.getStatusPeriodically(async (creationResults: any) => {
              if (creationResults?.document?.creationStep == 'POPULATE_DATA') {
                if (creationResults?.document?.stepStatus == 'FINISHED') {
                  await this.finishPlaceholderReplacement(
                    creationResults,
                    step
                  );
                  return true;
                }

                if (creationResults?.document?.stepStatus == 'FAILED') {
                  this.stopProcess(step, 'Error in population data');
                  this.canViewDocument = false;
                  return false;
                }
              } else if (
                creationResults?.document?.creationStep == 'GENERATE_PDF'
              ) {
                await this.finishPlaceholderReplacement(creationResults, step);
                return true;
              }

              if (this.maximumTimeHasPassed(step)) {
                let message = 'Error in populating data. Request timed out.';
                this.stopProcess(step, message);
                if (this.storageService.getItem('isLoggedin')) {
                  //this.setDocumentAsFailed(this.documentUuid);
                  this.remoteLogService.log(
                    'Template:PopulatingDataTimeout\n',
                    message +
                      this.getDocumentInfoAsString() +
                      '\n' +
                      this.documentCreatorResults?.document?.statusMessage,
                    TextConfig.TEMPLATE
                  );
                }
                return true;
              }

              this.canViewDocument = false;
              return false;
            });
          } else if (results?.code == 9020) {
            this.canContinue = false;
            this.stopProcess(step, results.message);
            break;
          } else {
            this.canContinue = false;
            this.stopProcess(step, 'Error in populating data');
            break;
          }

          break;

        case 'CREATING_PDF':
          try {
            this.statusCheckIntervalPeriod = 1000 * 10; //10 seconds
            this.getStatusPeriodically2(async (creationResults: any) => {
              //
              if (creationResults?.document?.creationStep == 'GENERATE_PDF') {
                if (creationResults?.document?.stepStatus == 'FINISHED') {
                  this.pdfDocumentUuid = creationResults.document.fileUuid;
                  if (this.pdfDocumentUuid) {
                    this.canViewDocument = true;
                    await this.markStepFinished(step);
                    this.goToCreationStep(this.creationSteps[4]).then();
                  }
                  return true;
                }
                if (creationResults?.document?.stepStatus == 'FAILED') {
                  this.canViewDocument = false;
                  const message = 'Error in creating PDF, something went wrong';
                  this.stopProcess(
                    step,
                    'Error in creating PDF, something went wrong'
                  );
                  this.remoteLogService.log(
                    'Template:CreatingPDF',
                    message +
                      '\n\n' +
                      JSON.stringify(this.documentCreatorResults?.document),
                    TextConfig.TEMPLATE
                  );
                  return true;
                }
              }

              if (this.maximumTimeHasPassed(step)) {
                this.stopProcess(
                  step,
                  'Error in creating PDF. Request timed out.'
                );
                return true;
              }
              return false;
            });
          } catch (e) {
            console.error('CREATING_PDF', e);
          }

          break;

        case 'FINISH':
          results = await this.sendCommand(
            DocumentCreatorCommandEnum.SAVE_DOCUMENT,
            this.documentUuid,
            {
              clearHTMLSections: this.documentCreationData?.keepHTML
                ? !this.documentCreationData.keepHTML
                : true,
            }
          );

          if (results?.code == 9000) {
            this.canViewDocument = true;
            this.canContinue = true;
            await this.markStepFinished(step);
          } else {
            this.stopProcess(step, 'Error in saving document');
            break;
          }

          this.finished = true;

          break;

        default:
          this.cancel = true;
          console.warn(`Unknown step code: ${step.code}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async finishPlaceholderReplacement(
    creationResults: any,
    step: DocumentCreationStep
  ) {
    this.placeholderReplacementSummary =
      creationResults?.document?.placeholderReplacementSummary;
    this.canViewDocument = false;
    this.placeholdersErrorsExist = this.hasPlaceholderErrors(
      this.placeholderReplacementSummary
    );

    if (this.placeholdersErrorsExist && this.stopOnDocumentErrors) {
      this.stopProcess(step, 'Error in populating data');
    } else {
      await this.markStepFinished(step);
      this.goToCreationStep(this.creationSteps[3]).then();
    }
  }

  maximumTimeHasPassed(step: DocumentCreationStep) {
    let now = new Date();
    let timePassed = now.getTime() - step.requestStartTime.getTime();
    //
    return timePassed > this.maximumTimeForRequestToBeConsideredFailed;
  }

  async startDocumentCreation() {
    this.placeholdersErrorsExist = false;
    this.initializeSteps();
    this.finished = false;
    this.pdfDocumentUuid = null;
    this.cancel = false;
    this.canContinue = false;
    this.canViewDocument = false;

    this.goToCreationStep(this.creationSteps[0]).then();
  }

  retry(stepCode: string) {}

  markStepOnProgress(step: DocumentCreationStep) {
    this.errorMessage = '';
    step.stage = 'ON_PROGRESS';
  }

  async markStepFinished(step: DocumentCreationStep) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    step.stage = 'FINISHED';
  }

  stopProcess(step: DocumentCreationStep, errorMessage: string = null) {
    this.errorMessage = errorMessage;
    step.stage = 'FAILED';
    this.cancel = true;
  }

  async viewDocument() {
    this.gettingFile = true;
    await this.attachmentService.fetchAttachment(
      this.pdfDocumentUuid,
      'pdf',
      this.documentCreationData.title
    );
    this.gettingFile = false;
  }

  async sendCommand(
    command: DocumentCreatorCommandEnum,
    documentUuid: string = null,
    data: any = null
  ): Promise<any> {
    let results = null;
    try {
      const response: any = await this.apollo.fetchData({
        query: SEND_DOCUMENT_CREATOR_COMMAND,
        apolloNamespace: ApolloNamespace.template,
        variables: {
          input: {
            command,
            data,
            documentUuid,
          },
        },
      });
      if (response.data.sendDocumentCreatorCommand) {
        results = response.data.sendDocumentCreatorCommand;
        this.storageService.setItem(
          'NeSTLastTokenRefresh',
          Date.now().toString()
        );
      }
    } catch (e) {}
    return results;
  }

  async setDocumentAsFailed(documentUuid: string): Promise<any> {
    let results = null;
    try {
      const response: any = await this.apollo.fetchData({
        query: SET_DOCUMENT_AS_FAILED_POPULATING_DATA,
        apolloNamespace: ApolloNamespace.template,
        variables: {
          documentUuid,
        },
      });
      if (response.data.results) {
        results = response.data.results;
      }
    } catch (e) {
      console.error(e);
    }
    return results;
  }

  hasPlaceholderErrors(
    placeholderReplacementSummary: PlaceholderReplacementSummary
  ): boolean {
    let hasErrors = false;

    if (
      placeholderReplacementSummary.placeholdersWithNoValues?.length > 0 ||
      placeholderReplacementSummary.placeholderNotFoundInDatabase?.length > 0 ||
      placeholderReplacementSummary.placeholdersWithUnknownError?.length > 0
    ) {
      hasErrors = true;
    }

    return hasErrors;
  }

  getStatusPeriodically = (
    stepIsFinished: (documentCreatorResults: any) => Promise<boolean>
  ) => {
    this.statusCheckInterval = setInterval(async () => {
      if (this.cancel) {
        this.isBuilding = false;
        clearInterval(this.statusCheckInterval);
        return;
      }

      await this.getStatus();
      if (await stepIsFinished(this.documentCreatorResults)) {
        this.isBuilding = false;
        clearInterval(this.statusCheckInterval);
      }
    }, this.statusCheckIntervalPeriod);
  };

  getStatusPeriodically2 = (
    stepIsFinished: (documentCreatorResults: any) => Promise<boolean>
  ) => {
    this.statusCheckInterval2 = setInterval(async () => {
      if (this.cancel) {
        this.isBuilding = false;
        clearInterval(this.statusCheckInterval2);
        return;
      }

      await this.getStatus();
      if (await stepIsFinished(this.documentCreatorResults)) {
        this.isBuilding = false;
        clearInterval(this.statusCheckInterval2);
      }
    }, this.statusCheckIntervalPeriod);
  };

  async getStatus() {
    if (!this.storageService.getItem('isLoggedin')) {
      return;
    }
    this.isFetchingStatus = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: DOCUMENT_CREATION_STATUS,
        apolloNamespace: ApolloNamespace.template,
        variables: {
          documentUuid: this.documentUuid,
        },
      });
      if (response.data?.getDocumentCreationStatus) {
        const accessToken = this.storageService.getItem('currentClient');
        if (accessToken) {
          this.storageService.setItem(
            'NeSTLastTokenRefresh',
            Date.now().toString()
          );
        }
        let resData = response.data.getDocumentCreationStatus.data;
        this.documentCreatorResults =
          response.data.getDocumentCreationStatus.data;
        if (resData.document.placeholderReplacementSummary) {
          this.documentUuid = this.documentCreatorResults.document.uuid;
          this.documentCreatorResults = {
            ...this.documentCreatorResults,
            document: {
              ...this.documentCreatorResults.document,
              placeholderReplacementSummary: JSON.parse(
                resData.document.placeholderReplacementSummary
              ),
            },
          };
        } else {
        }
      } else {
      }
    } catch (e) {}
    this.isFetchingStatus = false;
  }

  getDocumentInfoAsString() {
    return `
Document UUID: ${this.documentUuid}\n
Title: ${this.documentCreationData.title}\n
Item UUID: ${this.documentCreationData.item_uuid}\n
\n
Template Subcategory: ${this.documentCreationData.template?.subCategoryName}\n
Template UUID: ${this.documentCreationData.template.uuid}\n
Template Name: ${this.documentCreationData.template.name}\n
Template Version: ${this.documentCreationData.template.version}\n
`;
  }
}
