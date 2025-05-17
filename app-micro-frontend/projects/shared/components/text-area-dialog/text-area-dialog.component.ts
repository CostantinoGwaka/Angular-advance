import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { TOOL_BAR_POSITION, WordProcessorComponent } from "../../word-processor/word-processor.component";
import { MatButtonModule } from '@angular/material/button';

export interface ImportableTextAreaDialog {
  id: any;
  title: any;
  existingContent: string;
}

export interface ExportableTextAreaDialog {
  id: any;
  content: any;
}

@Component({
    selector: 'app-text-area-dialog',
    templateUrl: './text-area-dialog.component.html',
    styleUrls: ['./text-area-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, WordProcessorComponent, MatButtonModule]
})
export class TextAreaDialogComponent implements OnInit {

  selectedToolBarButtons: any = [
    ['bold', 'italic', 'underline', 'strike'],
    ['justifyLeft', 'justifyCenter', 'justifyRight'],
    ['orderedList', 'unOrderedList'],
    ['removeFormat'],
  ];

  toolBarPosition: TOOL_BAR_POSITION = TOOL_BAR_POSITION.TOP;

  private message: string;

  item: ImportableTextAreaDialog;

  constructor(
    private dialogRef: MatDialogRef<TextAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.item = data;
  }

  ngOnInit(): void {
  }

  onEditorChanged(event: any) {
    this.message = event;
  }

  getTextData() {
    this.dialogRef.close(<ExportableTextAreaDialog>{ id: this.item.id, content: this.message || null });
  }

}
