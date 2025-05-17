import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {CustomWorkflowApproval} from "./custom-workflow-approval.model";
import { SortByPipe } from '../../pipes/sort-pipe';
import { SafeDatePipe } from '../../pipes/safe-date.pipe';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-sharable-comments-viewer-custom',
    templateUrl: './sharable-comments-viewer-custom.component.html',
    styleUrls: ['./sharable-comments-viewer-custom.component.scss'],
    standalone: true,
    imports: [
    MatIconModule,
    SafeDatePipe,
    SortByPipe
],
})
export class SharableCommentsViewerCustomComponent implements OnInit, OnChanges {
  @Input() comments: CustomWorkflowApproval[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments']) {
      this.comments = changes['comments'].currentValue;
      this.comments = this.comments.map(comment => {
        return {
          ...comment,
          approvalStatus: comment.approvalStatus?.replace(/_/g, ' ')
        }
      })
    }
  }
}
