import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HtmlViewerContentComponent } from './html-viewer-content/html-viewer-content.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface HtmlViewerData {
  html: string;
  title?: string;
}

@Component({
    selector: 'app-html-viewer',
    templateUrl: './html-viewer.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        HtmlViewerContentComponent,
    ],
})
export class HtmlViewerComponent implements OnInit {
  @Input() data: HtmlViewerData;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: HtmlViewerData,
    private dialogRef: MatDialogRef<HtmlViewerComponent>
  ) {}

  ngOnInit(): void {
    if (this.dialogData) {
      this.data = this.dialogData;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
