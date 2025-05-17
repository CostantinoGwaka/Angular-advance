import {
	Component,
	Inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { WorkflowPossibleActionsService } from '../../../services/workflow/workflow-possible-actions.service';
import { WorkflowApproval } from '../../../store/work-flow/work-flow-interfaces';
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AllCommentsViewerDialogComponent } from './all-comments-viewer-dialog/all-comments-viewer-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { AllCommentsViewerComponent } from './all-comments-viewer/all-comments-viewer.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
	selector: 'app-sharable-comments-viewer',
	templateUrl: './sharable-comments-viewer.component.html',
	styleUrls: ['./sharable-comments-viewer.component.scss'],
	standalone: true,
	imports: [NgTemplateOutlet, AllCommentsViewerComponent, MatIconModule],
})
export class SharableCommentsViewerComponent implements OnInit, OnChanges {
	@Input() comments: WorkflowApproval[] = [];
	@Input() approvalStartDate: any;
	@Input() assignedUser: string;
	@Input() showMinimumComments: boolean = false;
	@Input() minimumCommentsCount: number = 1;
	@Input() title = 'Workflow Activities';

	commentsToShow: WorkflowApproval[] = [];

	constructor(
		public commentsDialog: MatDialog,
		public workflowPossibleActionsService: WorkflowPossibleActionsService,
	) {}

	ngOnInit(): void {}

	showAll() {
		this.commentsDialog.open(AllCommentsViewerDialogComponent, {
			data: {
				comments: this.comments,
				approvalStartDate: this.approvalStartDate,
				assignedUser: this.assignedUser,
			},
			width: '80%',
			height: 'auto',
			maxHeight: '90vh',
			maxWidth: '90vw',
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['comments']) {
			this.comments = changes['comments'].currentValue;
			this.setComments();
		}
		if (changes['approvalStartDate']) {
			this.approvalStartDate = changes['approvalStartDate'].currentValue;
		}
	}

	setComments() {
		if (this.showMinimumComments) {
			this.commentsToShow = [...this.comments].slice(
				-this.minimumCommentsCount,
			);
		} else {
			this.commentsToShow = [...this.comments];
		}
	}

	calculateDuration(id: number): string {
		const comments = this.comments;

		comments.sort((a, b) => a.id - b.id);

		const currentIndex = comments.findIndex((comment) => comment.id == id);

		const maxDate = new Date(this.comments[currentIndex].createdAt).valueOf();
		const minDate = new Date(
			currentIndex - 1 < 0
				? this.approvalStartDate
				: this.comments[currentIndex - 1]?.createdAt,
		).valueOf();
		let diffTime = Math.abs(maxDate - minDate);
		let days = diffTime / (24 * 60 * 60 * 1000);
		let hours = (days % 1) * 24;
		let minutes = (hours % 1) * 60;
		let secs = (minutes % 1) * 60;
		[days, hours, minutes, secs] = [
			Math.floor(days),
			Math.floor(hours),
			Math.floor(minutes),
			Math.floor(secs),
		];

		let duration = secs + ' sec';
		if (minutes > 0) duration = minutes + ' minutes, ' + secs + ' sec';
		if (hours > 0)
			duration = hours + ' hours,' + minutes + ' minutes,' + secs + ' sec';
		if (days > 0)
			duration =
				days +
				' days,' +
				hours +
				' hours,' +
				minutes +
				' minutes,' +
				secs +
				' sec';
		return duration;
	}
}
