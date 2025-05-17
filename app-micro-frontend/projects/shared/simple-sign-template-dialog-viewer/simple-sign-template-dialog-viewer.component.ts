import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgClass, NgTemplateOutlet} from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {ModalHeaderComponent} from "../components/modal-header/modal-header.component";
import {LoaderComponent} from "../components/loader/loader.component";
import {DoNotSanitizePipe} from "../word-processor/pipes/do-not-sanitize.pipe";
import {HTMLDocumentService} from "../../services/html-document.service";
import {NotificationService} from "../../services/notification.service";
import {GraphqlService} from "../../services/graphql.service";
import {AuthUser} from "../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";

export interface SimpleSignTemplateDialogViewerComponentModal {
  templateCode: string;
  user:AuthUser;
  onlyHTML: boolean; // only if you want to display html document
  canSign: boolean; // Process html and sign then return
  useMultipleSection?: boolean; // Process html and sign then return
  templatePayload: SpecificTemplatePlaceholderValue[];
  title: string;
  signedLetterUuid?: string;
  uuid: string
}

interface SpecificTemplatePlaceholderValue {
  field: string;
  value: string | any;
}
@Component({
  selector: 'app-simple-sign-template-dialog-viewer',
  templateUrl: './simple-sign-template-dialog-viewer.component.html',
  styleUrls: ['./simple-sign-template-dialog-viewer.component.scss'],
  standalone: true,
  imports: [
    ModalHeaderComponent,
    LoaderComponent,
    DoNotSanitizePipe,
    MatIcon,
    NgTemplateOutlet,
    FormsModule,
    NgClass,
  ],
})
export class SimpleSignTemplateDialogViewerComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: SimpleSignTemplateDialogViewerComponentModal,
    public dialogRef: MatDialogRef<SimpleSignTemplateDialogViewerComponent>,
    public _dialogRef: MatDialogRef<SimpleSignTemplateDialogViewerComponent>,
    private notificationService: NotificationService,
    private htmlDocumentService: HTMLDocumentService,
    private apollo: GraphqlService,
  ) {}

  loadingMessage: string = 'Loading ... !';
  loading: boolean = false;
  viewType: string;
  title: string = '';
  htmlContent: string = null;
  hide: boolean = false;
  signKeyPhrase: string;
  signingDocument: boolean = false;
  signingDocumentFailed: boolean = false;

  ngOnInit(): void {
    this.title = this.data.title;
    this.viewTemplate().then();
  }

  closeModal(close?: boolean, data?: any): void {
    this._dialogRef.close(this.data);
  }

  async viewTemplate() {
    this.loading = true;
    this.loadingMessage =
      'Preparing ' + this.data.title;

    if (this.data.useMultipleSection) {
      const htmlSection = await this.htmlDocumentService.createSimpleHTMLDocumentMultipleSection({
        procuringEntityUuid: this.data.user?.procuringEntity?.uuid,
        nonSTDTemplateCategoryCode: this.data.templateCode,
        specificTemplatePlaceholderValue: this.data.templatePayload,
      });

      this.htmlContent = htmlSection[0]?.htmlText + '<div style="page-break-after: always;"></div>' + htmlSection[1].htmlText + '<div style="page-break-after: always;"></div>' + htmlSection[2]?.htmlText;
    }else {
      this.htmlContent = await this.htmlDocumentService.createSimpleHTMLDocument({
        procuringEntityUuid: this.data.user?.procuringEntity?.uuid,
        nonSTDTemplateCategoryCode: this.data.templateCode,
        specificTemplatePlaceholderValue: this.data.templatePayload,
      });
    }
    this.loading = false;
    return this.htmlContent || '';
  }


  async signDocument() {
    this.signingDocument = true;
    this.signingDocumentFailed = false;

    try {
      if (this.htmlContent) {
        let attachmentUid = await this.htmlDocumentService.signHTMLDocument({
          description: 'Award to ' + this.data.title,
          title: 'Awarding',
          passphrase: this.signKeyPhrase,
          htmlDoc: this.htmlContent,
          signaturePlaceHolder: 'SIGNATURE_PLACEHOLDER',
          user: this.data.user,
        });
        if (attachmentUid) {
          this.data = {
            ...this.data,
            signedLetterUuid: attachmentUid,
          }
          this.notificationService.successSnackbar('Successful');
          this.closeModal(true,this.data);
        } else {
          this.notificationService.errorMessage('Failed to Sign Document... Please verify your signature key phrase');
          await this.htmlDocumentService.deleteHTMLDocuments([attachmentUid]);
          this.signingDocument = false;
          this.signingDocumentFailed = true;
        }
      }
    } catch (e) {
      this.signingDocument = false;
      this.signingDocumentFailed = false;
      console.error(e);
      this.notificationService.errorMessage('Failed to sign document');
    }
  }
}
