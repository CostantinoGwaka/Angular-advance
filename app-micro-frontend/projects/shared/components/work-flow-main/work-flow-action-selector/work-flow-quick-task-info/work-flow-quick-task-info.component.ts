import { Component, Input, OnInit } from '@angular/core';
import { WorkflowTaskDefinition } from 'src/app/store/work-flow/work-flow-interfaces';
import { Observable, map } from 'rxjs';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { WorkflowPossibleActionsService } from '../../../../../services/workflow/workflow-possible-actions.service';
import { Store, select } from '@ngrx/store';
import { selectModifiedAuthUsers } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { ApplicationState } from 'src/app/store';
import { WorkflowUsersListData } from '../../workflow-users-list/workflow-users-list.component';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-work-flow-quick-task-info',
	templateUrl: './work-flow-quick-task-info.component.html',
	standalone: true,
	imports: [MatIcon],
})
export class WorkFlowQuickTaskInfoComponent implements OnInit {
	@Input({ required: true })
	task: WorkflowTaskDefinition;

	user$: Observable<AuthUser>;
	user: AuthUser;

	constructor(
		private workflowPossibleActionsService: WorkflowPossibleActionsService,
		private store: Store<ApplicationState>,
	) {
		this.user$ = this.store.pipe(
			select(selectModifiedAuthUsers),
			map((users) => users[0] as AuthUser),
		);
	}

	ngOnInit() {}

	viewUsers() {
		let data: WorkflowUsersListData = {
			task: this.task,
			institutionUuid: this.user.institutionUuid,
		};
		this.workflowPossibleActionsService.showTaskUsersList(data);
	}

	removeUnderscores(text: string): string {
		return text.replace(/_/g, ' ');
	}
}
