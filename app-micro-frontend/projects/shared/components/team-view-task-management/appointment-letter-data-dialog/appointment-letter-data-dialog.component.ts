import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApolloNamespace } from "../../../../apollo.config";
import { NotificationService } from "../../../../services/notification.service";
import { GraphqlService } from "../../../../services/graphql.service";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatCard } from "@angular/material/card";
import {
  DataGenerationStepComponent
} from "../../data-generation-step/data-generation-step.component";
import {
  ModalHeaderComponent
} from "../../modal-header/modal-header.component";
import {
  GET_APPOINTMENT_LETTER_BY_UUID,
  PREPARE_TEAM_MEMBER_APPOINTMENT_LETTER, SIGN_APPOINTMENT_LETTER_FOR_ALL_LOTS
} from "../../invitation-letter/store/invitation-letter.graph";
import {
  AttentionMessageComponent
} from "../../attention-message/attention-message.component";
import {
  ProgressCircularLoaderComponent
} from "../../../../modules/nest-tenderer/tender-submission/submission/progress-circular-loader/progress-circular-loader.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  CustomAlertBoxComponent
} from "../../custom-alert-box/custom-alert-box.component";
import {
  CustomAlertBoxModel
} from "../../custom-alert-box/custom-alert-box.model";
import {
  InvitationLetter
} from "../../invitation-letter/store/invitiation-letter.model";
import { firstValueFrom, map } from "rxjs";
import { select, Store } from "@ngrx/store";
import {
  selectAllAuthUsers
} from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { ApplicationState } from "../../../../store";
import {
  HTMLDocumentService
} from "../../../../services/html-document.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-appointment-letter-data-dialog',
  standalone: true,
  imports: [
    MatCard,
    DataGenerationStepComponent,
    ModalHeaderComponent,
    AttentionMessageComponent,
    ProgressCircularLoaderComponent,
    CustomAlertBoxComponent,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './appointment-letter-data-dialog.component.html',
  styleUrl: './appointment-letter-data-dialog.component.scss'
})

export class AppointmentLetterDataDialogComponent implements OnInit {

  mainLoaderProgress = 0;
  requestKeyPhrase = false;
  hide = true;
  generalStatus: GeneralStatusModel = {
    title: '',
    action: 'PREPARE',
    errorMessage: '',
    hasError: false,
    loadingMessage: 'loading',
    allowClose: false,
    isLoading: true,
    keyPhrase: null,
    retriesCount: 0,
    result: [],
    members: []
  }
  noDataAlert: CustomAlertBoxModel = {
    title: 'Important Information',
    showButton: false,
    details: [
      {
        icon: 'info',
        message: 'This dialog allows you to sign all appointment letters at' +
          ' once.'
      },
      {
        icon: 'info',
        message: 'Before continuing Key Phrase is required to allow multiple' +
          ' document signing.'
      }
    ]
  };


  constructor(
    private graphqlService: GraphqlService,
    private notificationService: NotificationService,
    private htmlDocumentService: HTMLDocumentService,
    private store: Store<ApplicationState>,
    @Inject(MAT_DIALOG_DATA) data: GeneralStatusModel,
    private matDialogRef: MatDialogRef<AppointmentLetterDataDialogComponent>) {
    this.generalStatus = data;
  }


  ngOnInit(): void {
    this.initializer();
  }

  initializer(isRetry: boolean = false) {
    this.mainLoaderProgress = 0;
    this.generalStatus = {
      ...this.generalStatus,
      isLoading: true,
      loadingMessage: 'Loading',
      hasError: false
    }
    if (!isRetry) {
      this.prepareMembersData();
    }
    if (this.generalStatus.action == 'PREPARE') {
      this.requestKeyPhrase = false;
      this.prepareAppointmentLetters().then();
    } else if (this.generalStatus.action == 'SIGN') {
      /// ask for keyPhrase
      this.requestKeyPhrase = true;
    }
  }

  closeDetails(event?: any) {
    this.matDialogRef.close(event);
  }


  prepareMembersData() {
    this.generalStatus.result = this.generalStatus.members.map((member: any) => {
      return {
        memberUuid: member.uuid,
        memberNames: `${member?.firstName} ${member?.middleName} ${member?.lastName}`,
        appointmentLetterUuid: member?.appointmentLetterUuid,
        isPrepared: false
      };
    });
  }

  async prepareAppointmentLetters() {
    this.mainLoaderProgress = 0;
    let results: DataHandlingResult[] = this.generalStatus.result
      .filter(result => !result.isPrepared);
    for (let i = 0; i < results.length; i++) {
      const data = results[i];
      const prog = (i + 1);
      this.mainLoaderProgress = ((prog / results.length) * 100) || 0;
      this.generalStatus.loadingMessage = `Processing details for member: ${data.memberNames}`;
      results[i].isPrepared = await this.prepareLetterAppointmentLetter(data);
    }
    const isCompleted = results.findIndex(item => !item.isPrepared) == -1;

    this.generalStatus.result = results;
    this.generalStatus.hasError = !isCompleted;
    this.generalStatus.isLoading = false;
    if (!isCompleted) {
      this.generalStatus.errorMessage = 'Process did not complete' +
        ' successfully, Please try again.';
    } else {
      this.generalStatus.loadingMessage = 'Process completed successfully,' +
        ' Please close this dialog';

      this.notificationService.successMessage('Process completed successfully,' +
        ' Please close this dialog');
      this.closeDetails(true);
    }
  }

  async signAppointmentLetters() {
    let counter = 1;
    this.prepareMembersData();
    let results: DataHandlingResult[] = this.generalStatus.result
      .filter(result => !result.isPrepared);
    this.requestKeyPhrase = false;
    try {
      for (let i = 0; i < results.length; i++) {
        if(this.generalStatus.hasError) {
          break;
        }
        const data = results[i];
        this.mainLoaderProgress = ((counter / results.length) * 100) || 0;
        this.generalStatus.loadingMessage = `Preparing details for member: ${data.memberNames}`;
        const invitationLetter: InvitationLetter =  await this.getAppointmentLetterByUuid(data.appointmentLetterUuid);
        if(invitationLetter != null) {
         const htmlDocument = await this.getCreatedTemplate(invitationLetter);
         const status =  await this.getSignedHtmlDocument(htmlDocument, invitationLetter);
          if(status) {
            results[i].isPrepared = true;
          } else {
            this.generalStatus.hasError = true;
            this.generalStatus.errorMessage = 'Failed to sign document,' +
              ' Check your Key Phrase and try again';
            this.generalStatus.isLoading = false;
          }
        } else {
          this.generalStatus.hasError = true;
          this.generalStatus.errorMessage = 'Failed to prepare invitation' +
            ` letter for ${data.memberNames}`;
          this.generalStatus.isLoading = false;
        }
        counter++;
      }
      this.generalStatus.result = results;
      this.generalStatus.isLoading = false;

      if(!this.generalStatus.hasError) {
        this.notificationService.successMessage('Process completed successfully,' +
          ' Please close this dialog');
        this.closeDetails(true);
      }
    } catch (e) {
      console.log(e);
      this.generalStatus.hasError = true;
      this.generalStatus.isLoading = false;
      this.generalStatus.errorMessage = e.message;
    }
  }

  async prepareLetterAppointmentLetter(member: any) {
    try {
      const response: any = await this.graphqlService.mutate({
        mutation: PREPARE_TEAM_MEMBER_APPOINTMENT_LETTER,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          memberUuid: member.memberUuid,
        },
      });

      return response.data.prepareTeamMemberAppointmentLetter.code === 9000;

    } catch (e) {
      console.error(e);
      this.notificationService.errorMessage(e);
      return false;
    }
  }

  async getAppointmentLetterByUuid(uuid: string) {
    try {
      const response: any = await this.graphqlService.fetchData({
        query: GET_APPOINTMENT_LETTER_BY_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: uuid
        }
      });
      if (response.data.getAppointmentLetterByUuid.code == 9000) {
        //// return only unsigned appointment letter
        const invitationLetter: InvitationLetter = response.data.getAppointmentLetterByUuid.data;
        if (!invitationLetter.isAppointmentLetterSigned) {
          return invitationLetter;
        }
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getCreatedTemplate(invitationLetter: InvitationLetter) {
    this.generalStatus.loadingMessage = 'Preparing appointment letter' +
      ` template for ${invitationLetter?.nameOfEvaluator}`;
    const user = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers),
      map(i => i[0]))
    );

    return await this.htmlDocumentService.createSimpleHTMLDocument({
      procuringEntityUuid: user.procuringEntity.uuid,
      nonSTDTemplateCategoryCode: 'EVALUATION_COMMITTEE_APPOINTMENT_LETTER',
      specificTemplatePlaceholderValue:
        [
          // {field: "singleSignature", value: this.invitationLetter?.originAccountingOfficerName},
          { field: "singleSignature", value: invitationLetter.uuid },
          {
            field: "nameOfEvaluator",
            value: invitationLetter?.nameOfEvaluator
          },
          {
            field: "evaluationDays",
            value: `${invitationLetter?.evaluationDays}`
          },
          {
            field: "evaluationCommitteePosition",
            value: invitationLetter?.position
          },
          {
            field: "headOfDepartment",
            value: invitationLetter.headOfDepartment
          },
          {
            field: "tenderDescription",
            value: (invitationLetter?.tenderDescription ?? '').toUpperCase()
          },
          { field: "tenderNumber", value: invitationLetter?.tenderNumber },
          {
            field: "accountingOfficerName",
            value: invitationLetter?.originAccountingOfficerName
          },
          { field: "folioNumber", value: invitationLetter?.folioNumber },
          {
            field: "evaluationStartDate",
            value: invitationLetter?.evaluationStartDate
          },
          {
            field: "evaluationEndDate",
            value: invitationLetter?.evaluationEndDate
          },
          {
            field: "accountingOfficerTitle",
            value: invitationLetter?.accountingOfficerTitle
          },
        ]
    });
  }

  async getSignedHtmlDocument(htmlDocument: any, invitationLetter: InvitationLetter) {
    const userData = await firstValueFrom(this.store.pipe(
      select(selectAllAuthUsers), map(i => i[0]))
    );
    const  appointmentLetterTitle =
      `Invitation letter of ${invitationLetter.nameOfEvaluator} on Tender #${invitationLetter?.tenderNumber}`;

    this.generalStatus.loadingMessage = `Signing ${appointmentLetterTitle}`;

    let attachmentUid: string = await this.htmlDocumentService.signHTMLDocument({
      description: appointmentLetterTitle,
      title: appointmentLetterTitle,
      passphrase: this.generalStatus.keyPhrase,
      htmlDoc: htmlDocument,
      user: userData,
      signaturePlaceHolder: invitationLetter.uuid,
    });

    if (attachmentUid) {
      this.generalStatus.loadingMessage = `Saving signed ${appointmentLetterTitle}`;
      return await this.signAppointmentLetterForAllLots(attachmentUid, invitationLetter.uuid);
    }
    return false
  }

  async signAppointmentLetterForAllLots(attachmentUuid: string, invitationLetterUuid: string) {
    try {
      const response: any = await this.graphqlService.mutate({
        mutation: SIGN_APPOINTMENT_LETTER_FOR_ALL_LOTS,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          appointmentLetterDto: {
            uuid: invitationLetterUuid,
            signedLetterUuid: attachmentUuid,
          }
        }
      });

      return response.data.signAppointmentLetterForAllLots.code === 9000;
    } catch (e) {
      console.error(e);
      await this.htmlDocumentService.deleteHTMLDocuments([attachmentUuid])
      return false
    }
  }

  protected readonly isNaN = isNaN;
}

export interface DataHandlingResult {
  memberUuid: string,
  memberNames: string,
  appointmentLetterUuid?: string,
  isPrepared: boolean,
}

export interface GeneralStatusModel {
  members: any[],
  result: DataHandlingResult[],
  action: 'PREPARE'| 'SIGN',
  title: string,
  loadingMessage: string,
  keyPhrase?: string,
  retriesCount: number,
  allowClose: boolean,
  isLoading: boolean,
  hasError: boolean,
  errorMessage: string,
}


