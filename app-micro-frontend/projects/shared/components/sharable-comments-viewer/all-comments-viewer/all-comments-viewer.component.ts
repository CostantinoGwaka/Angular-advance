import {
	Component,
	Inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { WorkflowPossibleActionsService } from '../../../../services/workflow/workflow-possible-actions.service';
import { WorkflowApproval } from 'src/app/store/work-flow/work-flow-interfaces';
import { SortByPipe } from '../../../pipes/sort-pipe';
import { SafeDatePipe } from '../../../pipes/safe-date.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-all-comments-viewer',
	templateUrl: './all-comments-viewer.component.html',
	standalone: true,
	imports: [SafeDatePipe, SortByPipe],
})
export class AllCommentsViewerComponent implements OnInit, OnChanges {
	@Input() comments: WorkflowApproval[] = [];
	@Input() approvalStartDate: any;
	@Input() assignedUser: string;

	commentsToShow: WorkflowApproval[] = [];

	constructor(
		public workflowPossibleActionsService: WorkflowPossibleActionsService,
	) {}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['comments']) {
			this.comments = changes['comments'].currentValue;
		}
		if (changes['approvalStartDate']) {
			this.approvalStartDate = changes['approvalStartDate'].currentValue;
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
