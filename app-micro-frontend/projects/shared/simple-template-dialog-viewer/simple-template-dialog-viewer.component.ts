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

export interface SimpleTemplateDialogViewerComponentModal {
  templateCode: string;
  title: string;
  procuringEntityUuid: string;
  loadingMessage: string;
  onlyHTML: boolean; // only if you want to display html document
  canSign: boolean; // Process html and sign then return
  templatePayload: SpecificTemplatePlaceholderValue[];
  uuid: string
}

interface SpecificTemplatePlaceholderValue {
  field: string;
  value: string | any;
}
@Component({
  selector: 'app-simple-template-dialog-viewer',
  templateUrl: './simple-template-dialog-viewer.component.html',
  styleUrls: ['./simple-template-dialog-viewer.component.scss'],
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
export class SimpleTemplateDialogViewerComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: SimpleTemplateDialogViewerComponentModal,
    public _dialogRef: MatDialogRef<SimpleTemplateDialogViewerComponent>,
    private htmlDocumentService: HTMLDocumentService,
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
    const combineData = {
      ...this.data,
      htmlContent: this.htmlContent
    }
    this._dialogRef.close(combineData);
  }

  async viewTemplate() {
    this.loading = true;
    this.loadingMessage = this.data.loadingMessage;
    this.htmlContent = await this.htmlDocumentService.createSimpleHTMLDocument({
      procuringEntityUuid: this.data.procuringEntityUuid,
      nonSTDTemplateCategoryCode: this.data.templateCode,
      specificTemplatePlaceholderValue: this.data.templatePayload,
    });
    this.loading = false;
    return this.htmlContent || '';
  }
}
