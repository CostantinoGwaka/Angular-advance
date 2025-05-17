import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { GraphqlService } from "./graphql.service";
import { GET_OBJECT_ADDITIONAL_DETAILS_BY_UUID_TYPE_FIELD_NAME } from "../modules/nest-tender-initiation/store/tender-workspace/tender-workspace.graphql";
import { GET_TENDER_FORM } from "../shared/components/percentage-progress-bar/store/tender-form/tender-form.graphql";
import { TenderFormModel } from "../shared/components/percentage-progress-bar/store/tender-form/tender-form.model";
import { GeneralService } from "./general.service";
import { HTMLDocumentService } from "./html-document.service";
import { GET_OBJECT_ACTUAL_DATE_AND_TIME_BY_UUID_AND_STAGE } from "../modules/nest-tender-initiation/tender-requisition/store/tender-requisition.graphql";
import {
  GET_TENDERER_SUBMISSION_MINI, UPDATE_TENDER_FORM
} from "../modules/nest-tenderer/store/submission/submission.graphql";
import { firstValueFrom, Observable, Subject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { AttachmentService } from "./attachment.service";
import { selectAllAuthUsers } from "../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { ApplicationState } from "../store";

@Injectable({
  providedIn: 'root',
})
export class TenderFormGeneratorService {
  tenderForm: TenderFormModel;
  html: any;
  tenderFormGeneratorChange: TenderFormGeneratorChange = {
    loading: true,
    completed: false,
    message: 'loading',
    documentUuid: null
  }

  tenderFormGeneratorChangeEvent = new Subject<TenderFormGeneratorChange>();

  constructor(
    private apollo: GraphqlService,
    private store: Store<ApplicationState>,
    private generalService: GeneralService,
    private attachmentService: AttachmentService,
    private htmlDocumentService: HTMLDocumentService
  ) {

  }

  generateTenderForm(submissionUuid: string): Observable<any> {
    this.getTendererSubmission(submissionUuid).then();
    return this.tenderFormGeneratorChangeEvent.asObservable();
  }

  // getChange() {
  //   return this.tenderFormGeneratorChangeEvent.asObservable();
  // }

  broadcastDataStateChange(change: TenderFormGeneratorChange) {
    this.tenderFormGeneratorChangeEvent.next(change);
  }

  async getObjectAdditionalValue(uuid: string, entityType: string) {
    try {
      const fieldNames: string[] = ["currencyOfPayment"];

      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'checking additional details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      const response: any = await this.apollo.fetchData({
        query: GET_OBJECT_ADDITIONAL_DETAILS_BY_UUID_TYPE_FIELD_NAME,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          objectUuid: uuid,
          fieldNames: fieldNames,
          objectType: entityType
        },
      });

      const result = response.data.getObjectAdditionalDetailsValuesByUuidAndTypeByFieldNames;

      if (result?.code === 9000) {
        const data = result?.dataList;
        /** IT will continue if currency is not found set default TZS */
        if (data.length !== 0) {
          this.tenderForm.tenderCurrency = data[0].value.code;
        } else {
          this.tenderForm.tenderCurrency = "TZS"
        }
        await this.getHTMLTemplate();
      } else {
        this.tenderFormGeneratorChange = {
          loading: false,
          completed: false,
          failed: true,
          message: 'Failed getting additional details',
          documentUuid: null
        }
        this.broadcastDataStateChange(this.tenderFormGeneratorChange);
      }

    } catch (e) {
      console.error(e);
      this.tenderFormGeneratorChange = {
        loading: false,
        completed: false,
        failed: true,
        message: 'Failed getting additional details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

    }
  }

  async fetchCurrentData(submissionUuid: string) {
    try {
      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'checking bid amount details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      const response: any = await this.apollo.fetchData({
        query: GET_TENDER_FORM,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionUuid: submissionUuid
        },
      });

      if (response.data.getTenderForm.code === 9000) {
        const data = response.data?.getTenderForm?.data;
        this.tenderForm.bidAmountInFigures = data.bidAmountInFigures;
        await this.getHTMLTemplate();
      } else {
        this.tenderFormGeneratorChange = {
          loading: false,
          completed: false,
          failed: true,
          message: 'Failed getting bid amount details',
          documentUuid: null
        }
        this.broadcastDataStateChange(this.tenderFormGeneratorChange);
      }

    } catch (e) {
      console.error(e);
      this.tenderFormGeneratorChange = {
        loading: false,
        completed: false,
        failed: true,
        message: 'Failed getting bid amount details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);
    }
  }

  async getHTMLTemplate() {

    try {
      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'Generating tender form details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      const tendererHTMLDocumentDto = {
        procuringEntityUuid: this.tenderForm?.procuringEntityUuid,
        nonSTDTemplateCategoryCode: 'TENDER_SUBMISSION_FORM',
        specificTemplatePlaceholderValue: [
          {
            field: "tendererName",
            value: this.tenderForm?.tendererName
          },
          {
            field: "tendererAddress",
            value: (
              this.tenderForm?.tendererAddress &&
              this.tenderForm?.tendererAddress !== 'null') ?
              this.tenderForm?.tendererAddress : 'TENDERER #: ' + this.tenderForm?.tendererNumber
          },
          {
            field: "deadlineForTenderSubmissionDate",
            value: this.tenderForm?.deadlineForTenderSubmissionDate
          },
          {
            field: "deadlineForTenderSubmissionTime",
            value: this.tenderForm?.deadlineForTenderSubmissionTime
          },
          {
            field: "tenderDescription",
            value: this.tenderForm?.tenderDescription
          },
          {
            field: "tenderNumber",
            value: this.tenderForm?.tenderNumber
          },
          {
            field: "currency",
            value: this.tenderForm?.tenderCurrency
          },
          {
            field: "bidAmountInFigures",
            value: `${this.tenderForm?.bidAmountInFigures}`
          },
          {
            field: "tenderLotAmountInWords",
            value: this.generalService.numberToWords(this.tenderForm?.bidAmountInFigures)
          },
          {
            field: "tenderSubmissionDate",
            value: this.tenderForm?.tenderSubmissionDate
          },
          {
            field: "tendererAuthorizedRepresentative",
            value: this.tenderForm?.tendererAuthorizedRepresentative
          },
          {
            field: "singleSignature",
            value: this.tenderForm?.tendererAuthorizedRepresentativeSignature
          },
          {
            field: "tendererAuthorizedLegalRepresentativeCapacity",
            value: this.tenderForm?.tendererAuthorizedLegalRepresentativeCapacity
          },
        ],
      };

      const html = await this.htmlDocumentService.createSimpleHTMLDocument(tendererHTMLDocumentDto);
      if (html) {
        await this.saveGeneratedDocument(this.tenderForm?.uuid, html);
      } else {
        this.tenderFormGeneratorChange = {
          loading: true,
          failed: false,
          completed: false,
          message: 'Failed to generate tender form details',
          documentUuid: null
        }
        this.broadcastDataStateChange(this.tenderFormGeneratorChange);
      }
    } catch (e) {
      console.error(e);

      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'Failed to generate tender form details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);
    }

  }

  async saveGeneratedDocument(submissionUuid: string, reportFile: any) {
    try {
      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'Saving generated tender form details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      const userData = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), map(i => i[0])));
      const reportTitle = `Tender form for ${this.tenderForm?.tendererName} on Tender number ${this.tenderForm?.tenderNumber}`;
      const base64File = this.htmlDocumentService.htmlToBase64(reportFile);
      const attachmentData = await this.attachmentService.addHtmlAttachment(
        base64File,
        userData.uuid,
        reportTitle,
        reportTitle,
        34488,
        'Submission',
        'Award',
        'Tender form Unsigned'
      );

      if (attachmentData) {
        const attachmentUid = attachmentData.data[0].uuid;
        await this.updateTenderForm(submissionUuid, attachmentUid);
      } else {
        this.tenderFormGeneratorChange = {
          loading: true,
          failed: false,
          completed: false,
          message: 'Failed to save generated tender form details',
          documentUuid: null
        }
        this.broadcastDataStateChange(this.tenderFormGeneratorChange);
      }
    } catch (e) {
      console.error(e);
      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'Failed to save generated tender form details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);
    }
  }

  async getObjectActualDateAndTimeByUuidAndStage(submissionUuid: string, mergedMainProcurementUuid: string) {
    try {
      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'checking tender calendar details',
        documentUuid: null
      }

      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      let results: any = await this.apollo.fetchData({
        query: GET_OBJECT_ACTUAL_DATE_AND_TIME_BY_UUID_AND_STAGE,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          procurementStageCode: 'SUBMISSION_OR_OPENING',
          objectUuid: mergedMainProcurementUuid
        }
      });
      if (results.data.getObjectActualDateAndTimeByUuidAndStage?.code === 9000) {
        const data = results.data.getObjectActualDateAndTimeByUuidAndStage.data;

        this.tenderForm.deadlineForTenderSubmissionDate = data?.actualDate;
        this.tenderForm.deadlineForTenderSubmissionTime = data?.actualTime;

        await this.fetchCurrentData(submissionUuid);
      } else {
        this.tenderFormGeneratorChange = {
          loading: false,
          completed: false,
          failed: true,
          message: 'Failed getting tender calendar details',
          documentUuid: null
        }
        this.broadcastDataStateChange(this.tenderFormGeneratorChange);
      }
    } catch (e) {
      console.error(e);
      this.tenderFormGeneratorChange = {
        loading: false,
        completed: false,
        failed: true,
        message: 'Failed getting tender calendar details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);
    }
  }

  async getTendererSubmission(submissionUuid: string) {
    try {
      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'checking submission details',
        documentUuid: null
      }

      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      const response: any = await this.apollo.fetchData({
        query: GET_TENDERER_SUBMISSION_MINI,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: submissionUuid
        }
      });

      if (response.data.getSubmission.code == 9000) {
        const submission = response.data.getSubmission.data;

        if (submission) {
          /// fetch submission deadline
          const fullName = submission?.mainSubmission.powerOfAttorneyFirstName + ' ' +
            submission?.mainSubmission.powerOfAttorneyLastName;
          this.tenderForm = {
            uuid: submission?.uuid,
            entityUuid: submission?.mainSubmission.entityUuid,
            tendererName: submission?.tendererName,
            tendererNumber: submission?.tendererNumber,
            tendererAddress: submission?.physicalAddress ?? 'Address not provided',
            procuringEntityUuid: submission?.procuringEntityUuid,
            tendererAuthorizedRepresentative: fullName,
            tendererAuthorizedLegalRepresentativeCapacity: submission?.mainSubmission?.powerOfAttorneyLegalCapacity,
            tendererAuthorizedRepresentativeSignature: fullName,
            bidAmountInFigures: 0,
            deadlineForTenderSubmissionDate: "",
            deadlineForTenderSubmissionTime: "",
            discountMethodologyOffered: "",
            discountsOffered: "",
            entityType: submission?.entityType,
            peAddress: "",
            peName: "",
            tenderCurrency: "",
            tenderDescription: submission?.descriptionOfTheProcurement,
            tenderLotAmountInWords: "",
            tenderNumber: submission?.entityNumber,
            tenderSubmissionDate: ""
          }
          await this.getObjectActualDateAndTimeByUuidAndStage(submissionUuid, this.tenderForm.entityUuid);
        }
      }
    } catch (e) {
      console.error(e);
      this.tenderFormGeneratorChange = {
        loading: false,
        completed: false,
        failed: true,
        message: 'Failed getting submission details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);
    }
  }

  async updateTenderForm(submissionUuid: string, attachmentUid: string) {
    try {
      this.tenderFormGeneratorChange = {
        loading: true,
        failed: false,
        completed: false,
        message: 'saving submission form details',
        documentUuid: null
      }

      this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      const response = await this.apollo.mutate({
        mutation: UPDATE_TENDER_FORM,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          bidSubmissionDTO: {
            signedTenderFormUuid: attachmentUid,
            submissionUuid: submissionUuid
          },
        },
      });
      if (response.data.updateTenderForm.code == 9000) {
        this.tenderFormGeneratorChange = {
          loading: false,
          failed: false,
          completed: true,
          message: 'Tender form generated successfully',
          documentUuid: attachmentUid
        }

        this.broadcastDataStateChange(this.tenderFormGeneratorChange);

      } else {
        console.error(response.data);
        this.tenderFormGeneratorChange = {
          loading: false,
          completed: false,
          failed: true,
          message: 'Failed saving submission form details',
          documentUuid: null
        }
        this.broadcastDataStateChange(this.tenderFormGeneratorChange);
      }
    } catch (e) {
      console.error(e);
      this.tenderFormGeneratorChange = {
        loading: false,
        completed: false,
        failed: true,
        message: 'Failed saving submission form details',
        documentUuid: null
      }
      this.broadcastDataStateChange(this.tenderFormGeneratorChange);
    }
  }
}


export interface TenderFormGeneratorChange {
  loading?: boolean;
  message?: string;
  failed?: boolean;
  completed?: boolean;
  documentUuid?: string;
}
