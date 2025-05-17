import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { WorkflowPossibleActionsService } from '../../../../services/workflow/workflow-possible-actions.service';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import {
	WorkFlow,
	WorkflowTask,
} from 'src/app/store/work-flow/work-flow-interfaces';
import { Observable, map } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { selectModifiedAuthUsers } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { ApplicationState } from 'src/app/store';
import { WorkFlowQuickTaskInfoComponent } from './work-flow-quick-task-info/work-flow-quick-task-info.component';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';
import { CustomAlertBoxComponent } from '../../custom-alert-box/custom-alert-box.component';
import { LoaderComponent } from '../../loader/loader.component';
import { AttentionMessageComponent } from '../../attention-message/attention-message.component';

@Component({
	selector: 'app-work-flow-action-selector',
	templateUrl: './work-flow-action-selector.component.html',
	standalone: true,
	imports: [
		MatRippleModule,
		MatIconModule,
		WorkFlowQuickTaskInfoComponent,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
		MatOptionModule,
		MatInputModule,
		MatButtonModule,
		AttentionMessageComponent,
	],
})
export class WorkFlowActionSelectorComponent implements OnInit {
	@Input()
	possibleFlows: WorkFlow[] = [];
	@Input()
	mapFunction: Function;

	@Input()
	workflowTask: WorkflowTask;

	@Input()
	stageName: string;

	@Output()
	selectionChange: EventEmitter<WorkFlow> = new EventEmitter();

	selectedFlow: WorkFlow = null;

	showOptions: boolean = false;

	@ViewChild('actionOptionElementRef') optionElementRef: ElementRef;
	@ViewChild('actionButtonElementRef') actionButtonElementRef: ElementRef;

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

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		if (
			!this.optionElementRef?.nativeElement?.contains(event.target) &&
			!this.actionButtonElementRef?.nativeElement?.contains(event.target)
		) {
			this.showOptions = false;
		}
	}

	ngOnInit(): void {
		this.setPossibleFlowsActionProperties();
	}

	ngOnChanges(): void {}

	setPossibleFlowsActionProperties() {
		this.possibleFlows = this.possibleFlows.map((flow) => ({
			...flow,
			color: this.workflowPossibleActionsService.getActionColor(flow.action),
			isVisible: true,
		}));

		if (this.mapFunction) {
			this.possibleFlows = this.possibleFlows.map((flow) =>
				this.mapFunction(flow),
			);
		}
		this.possibleFlows = this.possibleFlows.filter((flow) => flow?.isVisible);
	}

	select(flow: WorkFlow) {
		this.showOptions = false;
		this.selectedFlow = flow;
		this.scrollToBottom();
		this.selectionChange.emit(flow);
	}

	toggleShowOptions() {
		setTimeout(() => {
			this.showOptions = !this.showOptions;
		}, 50);
		// this.scrollToBottom();
	}

	setNextTaskMessage(): string {
		let taskName = this.selectedFlow.nextTaskDefinition.taskName;
		let userGroup = this.selectedFlow.nextTaskDefinition.groupCommonName;

		return `After this, the next task will be <b>${taskName}</b> by <b>${userGroup}</b>`;
	}

	scrollToBottom() {
		setTimeout(() => {
			NestUtils.scrollToBottom();
		}, 500);
	}
}
