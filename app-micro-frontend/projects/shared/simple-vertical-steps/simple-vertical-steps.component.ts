import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

export enum SimpleVerticalStepActivityStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  WAITING = 'WAITING',
  SENT = 'SENT',
  REJECTED = 'REJECTED',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_APPROVAL = 'READY_FOR_APPROVAL',
  WAITING_ASSIGNMENT = 'WAITING_ASSIGNMENT',
  WAITING_ACCEPTANCE = 'WAITING_ACCEPTANCE',
}

export type colorTypes = 'danger' | 'success' | 'primary' | 'secondary';

export interface ActivityMessage {
  statuses: SimpleVerticalStepActivityStatus[];
  text: string;
  color: colorTypes;
}

export interface ActivityButton {
  statuses: SimpleVerticalStepActivityStatus[];
  roles?: string[];
  action: string;
  label: string;
  color: colorTypes;
}

export interface SimpleVerticalStepActivity {
  id?: string;
  title: string;
  description?: string;
  isChecked?: boolean;
  code: string;
  isLoading?: boolean;
  status: SimpleVerticalStepActivityStatus;
  attentionMessage?: string;
  messages?: ActivityMessage[];
  buttons?: ActivityButton[];
  data?: any;
  checkBoxNotEditable?: boolean;
}

export interface SimpleVerticalStepActivityEvent {
  activity: SimpleVerticalStepActivity;
  activityButton: ActivityButton;
}

@Component({
  selector: 'app-simple-vertical-steps',
  templateUrl: './simple-vertical-steps.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
],
})
export class SimpleVerticalStepsComponent implements OnInit {
  @Input()
  isChronological = true;

  @Input({ required: true })
  activities: SimpleVerticalStepActivity[] = [];

  @Input()
  hasCheckBoxes = false;

  @Input()
  userRoles: string[] = [];

  @Output()
  onActionButtonClick: EventEmitter<SimpleVerticalStepActivityEvent> =
    new EventEmitter<SimpleVerticalStepActivityEvent>();

  @Output()
  onCheckBoxClick: EventEmitter<{
    item: SimpleVerticalStepActivity;
    allItems: SimpleVerticalStepActivity[];
  }> = new EventEmitter<{
    item: SimpleVerticalStepActivity;
    allItems: SimpleVerticalStepActivity[];
  }>();

  activityStatus = SimpleVerticalStepActivityStatus;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.activities = this.activities.map((activity) => {
      return {
        ...activity,
      };
    });
  }

  getButtonColor(color: colorTypes) {
    switch (color) {
      case 'danger':
        return {
          background: '#dc3545',
          color: '#fff',
        };

      case 'success':
        return {
          background: '#28a745',
          color: '#fff',
        };

      case 'primary':
        return {
          background: '#1294db',
          color: '#fff',
        };

      case 'secondary':
        return {
          background: '#6c757d',
          color: '#fff',
        };

      default:
        return {
          background: '#6c757d',
          color: '#fff',
        };
    }
  }

  getMessageColor(color: colorTypes) {
    switch (color) {
      case 'danger':
        return '#dc3545';

      case 'success':
        return '#28a745';

      default:
        return '#7f7e7e';
    }
  }

  onActionButtonClicked(event: SimpleVerticalStepActivityEvent) {
    this.onActionButtonClick.emit(event);
  }

  getAllowedButtons(buttons: ActivityButton[]) {
    return buttons?.filter((button) => {
      if (button?.roles?.length) {
        return button.roles.some((role) => this.userRoles.includes(role));
      }
      return true;
    });
  }

  onCheckBoxClicked(activity: SimpleVerticalStepActivity, event: any) {
    activity.isChecked = event.checked;
    if (this.onCheckBoxClick) {
      this.onCheckBoxClick.emit({
        item: activity,
        allItems: this.activities,
      });
    }
  }
}
