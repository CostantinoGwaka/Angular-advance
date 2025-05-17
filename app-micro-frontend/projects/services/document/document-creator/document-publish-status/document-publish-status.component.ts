import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApolloNamespace } from '../../../../apollo.config';
import { Subscription } from 'rxjs';
import { AttachmentService } from '../../../attachment.service';
import {
  DocumentCreationChange,
  DocumentCreationChangeType,
  DocumentCreatorService,
} from '../../document-creator.service';
import { TemplateDocumentTypesEnum } from '../../store/document-creator.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-document-publish-status',
    templateUrl: './document-publish-status.component.html',
    standalone: true,
    imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    DatePipe
],
})
export class DocumentPublishStatusComponent implements OnInit {
  @Input()
  itemUuid: string;

  @Input() hideContinueButton = false;

  @Input()
  title: string;

  @Input()
  documentType: TemplateDocumentTypesEnum;

  isCreatingDocument: boolean = false;

  @Output()
  onCreateButtonClick: EventEmitter<any> = new EventEmitter();

  @Output()
  onDocumentFetched: EventEmitter<any> = new EventEmitter();

  @Output()
  onContinueButtonClick: EventEmitter<any> = new EventEmitter();

  @Input()
  hasHTMLDocument: boolean = false;

  isGettingDocument: boolean = true;

  documentUuid: string = null;

  pdfDocumentUuid: string = null;

  documentCreationDate: string;

  gettingFile: boolean = false;

  changeSubscription = Subscription.EMPTY;

  constructor(
    private attachmentService: AttachmentService,
    private documentCreatorService: DocumentCreatorService
  ) { }


  ngOnInit(): void {
    this.getDocument();
    this.changeSubscription = this.documentCreatorService
      .getChange()
      .subscribe((change: DocumentCreationChange) => {
        this.onDocumentCreationChanges(change);
      });
  }

  onDocumentCreationChanges(change: DocumentCreationChange) {
    if (
      change.changeType === DocumentCreationChangeType.CREATION_CANCELLED ||
      change.changeType === DocumentCreationChangeType.CREATION_FINISHED
    ) {
      this.isCreatingDocument = false;
      this.getDocument();
    }

    if (change.changeType === DocumentCreationChangeType.CREATION_STARTED) {
      this.isCreatingDocument = true;
    }
  }

  ngOnDestroy() {
    this.changeSubscription?.unsubscribe();
  }

  start() {
    this.onCreateButtonClick.emit();
  }

  async downloadDocument() {
    if (this.pdfDocumentUuid) {
      this.gettingFile = true;
      await this.attachmentService.fetchAttachment(
        this.pdfDocumentUuid,
        'pdf',
        this.title
      );
    }
    this.gettingFile = false;
  }

  async getDocument() {
    this.isGettingDocument = true;
    let res =
      await this.documentCreatorService.getDocumentByItemUuidAndDocumentType(
        this.itemUuid,
        this.documentType
      );

    this.isGettingDocument = false;

    this.documentUuid = res.documentUuid;
    this.pdfDocumentUuid = res.pdfDocumentUuid;
    this.documentCreationDate = res.createdAt;
    this.onDocumentFetched.emit({
      documentUuid: this.documentUuid,
      pdfDocumentUuid: this.pdfDocumentUuid,
    });
  }

  onContinue() {
    this.onContinueButtonClick.emit();
  }
}
