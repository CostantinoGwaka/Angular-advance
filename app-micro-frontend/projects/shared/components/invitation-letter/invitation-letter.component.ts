import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom, map } from "rxjs";
import { select, Store } from "@ngrx/store";
import { selectAllAuthUsers } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { HTMLDocumentService } from "../../../services/html-document.service";
import { ApplicationState } from "../../../store";
import { GraphqlService } from "../../../services/graphql.service";
import { NotificationService } from "../../../services/notification.service";
import {
  GET_APPOINTMENT_LETTER_BY_UUID,
  SIGN_APPOINTMENT_LETTER_FOR_ALL_LOTS
} from "./store/invitation-letter.graph";
import { InvitationLetter } from "./store/invitiation-letter.model";
import { AttachmentService } from "../../../services/attachment.service";
import { SettingsService } from "../../../services/settings.service";
import { StorageService } from "../../../services/storage.service";
import { ExcelReaderService } from "../../../services/excel-reader.service";
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { LoaderComponent } from '../loader/loader.component';

import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
  selector: 'app-invitation-letter',
  templateUrl: './invitation-letter.component.html',
  styleUrls: ['./invitation-letter.component.scss'],
  standalone: true,
  imports: [
    LoaderComponent,
    HasPermissionDirective,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    SafeHtmlPipe,
    DoNotSanitizePipe
]
})
export class InvitationLetterComponent implements OnInit {
  @Input() teamMemberUuid: string;
  @Input() teamMemberLetterUuid: string;
  @Output() setPanelTitle = new EventEmitter<any>();
  @Output() closePanelTitle = new EventEmitter<any>();

  htmlContent: any;
  htmlDocument: any;
  savingData: boolean;
  loadingTemplate: boolean;
  loadingDocument: boolean;
  hide: boolean;
  loading: boolean;
  signDocument: boolean = false;
  passphrase: string;
  loadingMessage: string;
  attachmentUid: string;
  appointmentLetterTitle: string;
  userSystemAccessRoles: string;
  reportFile: string;
  invitationLetter: InvitationLetter;

  constructor(
    private store: Store<ApplicationState>,
    private apollo: GraphqlService,
    private settingServices: SettingsService,
    private attachmentService: AttachmentService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private excelReaderService: ExcelReaderService,
    private htmlDocumentService: HTMLDocumentService,
  ) {
    this.initAccess().then();
  }

  ngOnInit(): void {
    this.getAppointmentLetterByUuid().then(async _ => {
      if (this.invitationLetter && !this.invitationLetter.isAppointmentLetterSigned) {
        await this.getCreatedTemplate();
      } else {
        await this.viewSignedDocument();
      }
    });
  }



  async getAppointmentLetterByUuid() {
    try {
      this.loading = true;
      const response: any = await this.apollo.fetchData({
        query: GET_APPOINTMENT_LETTER_BY_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.teamMemberLetterUuid
        }
      });
      if (response.data.getAppointmentLetterByUuid.code == 9000) {
        this.invitationLetter = response.data.getAppointmentLetterByUuid.data;
        this.appointmentLetterTitle = `Invitation letter of ${this.invitationLetter.nameOfEvaluator} on Tender #${this.invitationLetter?.tenderNumber}`;
        this.setPanelTitle.emit(this.appointmentLetterTitle);
      } else {
        this.notificationService.errorMessage('Invitation letter not found, Please try again');
        console.error(response.data.getAppointmentLetterByUuid.message);
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }


  // InvitationLetter
  async getCreatedTemplate() {
    this.loading = true;
    const user = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers),
      map(i => i[0]))
    );
    this.htmlContent = null;
    this.htmlContent = await this.htmlDocumentService.createSimpleHTMLDocument({
      procuringEntityUuid: user.procuringEntity.uuid,
      nonSTDTemplateCategoryCode: 'EVALUATION_COMMITTEE_APPOINTMENT_LETTER',
      specificTemplatePlaceholderValue:
        [
          // {field: "singleSignature", value: this.invitationLetter?.originAccountingOfficerName},
          { field: "singleSignature", value: this.invitationLetter.uuid },
          { field: "nameOfEvaluator", value: this.invitationLetter?.nameOfEvaluator },
          { field: "evaluationDays", value: `${this.invitationLetter?.evaluationDays}` },
          { field: "evaluationCommitteePosition", value: this.invitationLetter?.position },
          { field: "headOfDepartment", value: this.invitationLetter.headOfDepartment },
          { field: "tenderDescription", value: (this.invitationLetter?.tenderDescription ?? '').toUpperCase() },
          { field: "tenderNumber", value: this.invitationLetter?.tenderNumber },
          { field: "accountingOfficerName", value: this.invitationLetter?.originAccountingOfficerName },
          { field: "folioNumber", value: this.invitationLetter?.folioNumber },
          { field: "evaluationStartDate", value: this.invitationLetter?.evaluationStartDate },
          { field: "evaluationEndDate", value: this.invitationLetter?.evaluationEndDate },
          { field: "accountingOfficerTitle", value: this.invitationLetter?.accountingOfficerTitle },
        ]
    });
    this.loading = false;
    this.htmlDocument = this.htmlContent;

  }


  async getSignedHtmlDocument() {
    this.loadingTemplate = true;
    this.loadingMessage = 'Loading document details .....';
    const userData = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), map(i => i[0])));
    if (this.htmlDocument) {
      this.attachmentUid = await this.htmlDocumentService.signHTMLDocument({
        description: this.appointmentLetterTitle,
        title: this.appointmentLetterTitle,
        passphrase: this.passphrase,
        htmlDoc: this.htmlDocument,
        user: userData,
        signaturePlaceHolder: this.invitationLetter.uuid,
      });

      if (this.attachmentUid) {
        await this.signAppointmentLetterForAllLots(this.attachmentUid);
      } else {
        this.notificationService.errorSnackbar("Failed to sign document");
      }
      this.loadingTemplate = false;

    } else {
      this.loadingTemplate = false;
      this.notificationService.errorSnackbar("Failed to sign document");
    }
    this.loadingTemplate = false;
  }


  async signAppointmentLetterForAllLots(attachmentUuid) {
    try {
      this.savingData = true;
      this.loadingMessage = 'Saving document details .....';
      const response: any = await this.apollo.mutate({
        mutation: SIGN_APPOINTMENT_LETTER_FOR_ALL_LOTS,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          appointmentLetterDto: {
            uuid: this.invitationLetter.uuid,
            signedLetterUuid: attachmentUuid,
          }
        }
      });

      if (response.data.signAppointmentLetterForAllLots.code === 9000) {
        this.savingData = false;
        this.notificationService.successMessage("Invitation letter signed successfully");
        await this.previewSignedDocument(attachmentUuid);
      } else {
        await this.htmlDocumentService.deleteHTMLDocuments([attachmentUuid]);
        this.notificationService.errorSnackbar("Failed to sign document, please check your key phrase and try again");
        this.savingData = false;
      }
    } catch (e) {
      console.error(e);
      await this.htmlDocumentService.deleteHTMLDocuments([attachmentUuid])
      this.notificationService.errorSnackbar("Failed to sign document, Please try again");
      this.savingData = false;
    }
  }

  async previewSignedDocument(attachment) {
    try {
      this.loadingDocument = true;
      if (attachment) {
        const data = await this.attachmentService.getSignedAttachment(attachment)
        this.settingServices.viewFile(data, 'pdf').then(() => {
          this.loadingDocument = false;
          this.closePanelTitle.emit();
        });
      } else {
        this.loadingDocument = false;
        this.notificationService.errorSnackbar("Failed to fetch appointment letter document ");
      }
    } catch (e) {
      console.error(e);
    }
  }


  async viewSignedDocument() {
    this.loading = true;
    if (this.invitationLetter?.signedLetterUuid) {
      this.reportFile = await this.attachmentService.getSignedAttachment(this.invitationLetter?.signedLetterUuid);
      this.loading = false;
    } else {
      this.loading = false;
    }
  }


  isAO() {
    return this.userSystemAccessRoles?.indexOf('ACCOUNTING_OFFICER') >= 0;
  }

  async initAccess() {
    this.userSystemAccessRoles = await this.storageService.getItem('userSystemAccessRoles');
  }

  exportReport(reportType: string) {
    if (reportType == 'PDF') {
      // this.reportFile = this.fileResult;
      this.excelReaderService.base64ToBlob2(this.reportFile, "application/pdf")
    } else if (reportType == 'XLSX' ||
      reportType == 'CSV') {
      this.excelReaderService.base64ToBlob(this.reportFile, this.excelReaderService.uuid())
    } else if (reportType == 'RTF') {
      this.excelReaderService.base64ToBlob2(this.reportFile, "application/rtf")
    } else if (reportType == 'XML') {
      this.excelReaderService.base64ToBlob2(this.reportFile, "text/xml")
    } else if (reportType == 'DOCX') {
      this.excelReaderService.base64ToBlob2(this.reportFile, "application/docx")
    }
  }

}
