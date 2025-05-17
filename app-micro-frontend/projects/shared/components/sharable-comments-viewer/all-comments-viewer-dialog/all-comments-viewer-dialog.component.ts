import { Component, Inject, Input } from '@angular/core';
import { WorkflowPossibleActionsService } from '../../../../services/workflow/workflow-possible-actions.service';
import { WorkflowApproval } from 'src/app/store/work-flow/work-flow-interfaces';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AllCommentsViewerComponent } from '../all-comments-viewer/all-comments-viewer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface CommentsDialogData {
  comments: WorkflowApproval[];
  approvalStartDate: any;
  assignedUser: string;
}

@Component({
    selector: 'app-all-comments-viewer-dialog',
    templateUrl: './all-comments-viewer-dialog.component.html',
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        AllCommentsViewerComponent,
    ],
})
export class AllCommentsViewerDialogComponent {
  @Input() comments: WorkflowApproval[] = [];
  @Input() approvalStartDate: any;
  @Input() assignedUser: string;

  constructor(
    public commentsDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: CommentsDialogData,
    public workflowPossibleActionsService: WorkflowPossibleActionsService
  ) {
    this.comments = data.comments;
    this.approvalStartDate = data.approvalStartDate;
    this.assignedUser = data.assignedUser;
  }
}
