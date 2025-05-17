import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
	MAT_SNACK_BAR_DATA,
	MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { fadeIn } from '../../animations/router-animation';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-snackbar-loader-custom',
	standalone: true,
	imports: [MatIconModule, NgIf],
	templateUrl: './snackbar-loader-custom.component.html',
	styleUrl: './snackbar-loader-custom.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class SnackbarLoaderCustomComponent implements OnInit {
	progress = 0;
	duration = 3000;
	backgroundColor: string;
	progressBarColor: string;
	isSuccess: boolean = false;

	constructor(
		public snackBarRef: MatSnackBarRef<SnackbarLoaderCustomComponent>,
		@Inject(MAT_SNACK_BAR_DATA) public data: any
	) {
		this.backgroundColor = data.backgroundColor || '#ffffff';
		this.isSuccess = data.isSuccess || false;
	}

	dismiss() {
		this.snackBarRef.dismiss();
	}

	ngOnInit(): void {
		this.startProgress();
	}

	startProgress(): void {
		const stepTime = 100; // Update the progress every 100 ms
		const interval = setInterval(() => {
			this.progress += (stepTime / this.duration) * 100;
			if (this.progress >= 100) {
				clearInterval(interval);
				this.snackBarRef.dismiss();
			}
		}, stepTime);
	}

	onClose() {
		this.snackBarRef.dismiss();
	}
}
