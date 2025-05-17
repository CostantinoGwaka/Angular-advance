import { NgSwitch, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';

@Component({
	selector: 'app-attention-message',
	standalone: true,
	imports: [MatIconModule, DoNotSanitizePipe, NgSwitch],
	templateUrl: './attention-message.component.html',
	styleUrl: './attention-message.component.scss',
})
export class AttentionMessageComponent {
	@Input({ required: true }) message: string = '';
	@Input() type: 'warning' | 'danger' | 'success' | 'info' | 'normal' =
		'normal';
	@Input() actionButtonLabel: string;
	@Output() onActionButtonClick = new EventEmitter();
	constructor() {}

	onActionClick() {
		this.onActionButtonClick.emit();
	}
}
