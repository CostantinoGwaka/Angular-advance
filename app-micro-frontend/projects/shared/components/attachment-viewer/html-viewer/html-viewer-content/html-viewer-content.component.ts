import { Component, Input, OnInit } from '@angular/core';
import { DoNotSanitizePipe } from '../../../../word-processor/pipes/do-not-sanitize.pipe';

@Component({
    selector: 'app-html-viewer-content',
    templateUrl: './html-viewer-content.component.html',
    standalone: true,
    imports: [DoNotSanitizePipe],
})
export class HtmlViewerContentComponent implements OnInit {
  @Input({ required: true }) html: string;

  constructor() {}

  ngOnInit(): void {}
}
