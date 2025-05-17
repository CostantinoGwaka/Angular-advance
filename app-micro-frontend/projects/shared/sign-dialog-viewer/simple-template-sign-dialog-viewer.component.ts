import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { GraphqlService } from '../../services/graphql.service';
import { NotificationService } from '../../services/notification.service';
import { HTMLDocumentService } from '../../services/html-document.service';
import { ApolloNamespace } from '../../apollo.config';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { AuthUser } from '../../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { DoNotSanitizePipe } from '../word-processor/pipes/do-not-sanitize.pipe';
import { LoaderComponent } from '../components/loader/loader.component';
import { ModalHeaderComponent } from '../components/modal-header/modal-header.component';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { UPDATE_REJECTION_LETTER_UUID } from "../../modules/nest-tender-award/store/award-cancellation-request/award-cancellation-request.graphql";

export interface SimpleTemplateSignDialogViewerModal {
  templateCode: string;
  user: AuthUser;
  dsmsDescription: string;
  loadingMessage?: string;
  dsmsTitle: string;
  modalTitle: string;
  onlyHTML: boolean; // only if you want to display html document
  canSign: boolean; // Process html and sign then return
  templatePayload: SpecificTemplatePlaceholderValue[];
  tendererName?: string;
  letterUuid?: string;
}

interface SpecificTemplatePlaceholderValue {
  field: string;
  value: string | any;
}
@Component({
  selector: 'app-award-dialog-viewer',
  templateUrl: './simple-template-sign-dialog-viewer.component.html',
  styleUrls: ['./simple-template-sign-dialog-viewer.component.scss'],
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
export class SimpleTemplateSignDialogViewerComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: SimpleTemplateSignDialogViewerModal,
    public dialogRef: MatDialogRef<SimpleTemplateSignDialogViewerComponent>,
    private notificationService: NotificationService,
    private htmlDocumentService: HTMLDocumentService,
    private apollo: GraphqlService,
  ) { }

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
    this.title = this.data.modalTitle;
    this.viewTemplate().then();
  }

  closeModal(close?: boolean, data?: any): void {
    this.dialogRef.close(this.data);
  }

  async viewTemplate() {
    this.loading = true;
    this.loadingMessage = this.data.loadingMessage ? this.data.loadingMessage : 'Preparing template...';
    this.htmlContent = await this.htmlDocumentService.createSimpleHTMLDocument({
      procuringEntityUuid: this.data.user?.procuringEntity?.uuid,
      nonSTDTemplateCategoryCode: this.data.templateCode,
      specificTemplatePlaceholderValue: this.data.templatePayload,
    });
    this.loading = false;
    return this.htmlContent || '';
  }


  async signDocument() {
    this.signingDocument = true;
    this.signingDocumentFailed = false;

    try {
      if (this.htmlContent) {
        let attachmentUid = await this.htmlDocumentService.signHTMLDocument({
          description: this.data.dsmsDescription,
          title: this.data.dsmsTitle,
          passphrase: this.signKeyPhrase,
          htmlDoc: this.htmlContent,
          signaturePlaceHolder: 'SIGNATURE_PLACEHOLDER',
          user: this.data.user,
        });
        if (attachmentUid) {
          this.data = {
            ...this.data,
            letterUuid: attachmentUid,
          }
          this.notificationService.successSnackbar('Document Signed Successfully');
          this.signingDocument = false;
          this.signingDocumentFailed = true;
          this.closeModal(true, this.data);
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
