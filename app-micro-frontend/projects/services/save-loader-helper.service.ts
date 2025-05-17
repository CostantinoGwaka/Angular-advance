import { inject, Injectable, signal } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { SaveLoaderComponent } from '../shared/components/save-loader/save-loader.component';
import { NotificationService } from './notification.service';
import { SignalsStoreService } from "./signals-store.service";

export interface LoaderData {
	isLoading: boolean;
	loaderMessage: string;
	hasError?: boolean;
	showTimeCountDown?: boolean;
	countDownSeconds?: number;
  maxSeconds?: number;
	retryFunction?: () => void;
	retryBtnText?: string;
}

@Injectable({
	providedIn: 'root',
})
export class SaveLoaderHelper {
	signalStoreService = inject(SignalsStoreService);

	loaderData = signal<LoaderData | null>(null);
	dialogRef: any;

	constructor(
		private dialog: MatDialog,
		private notificationService: NotificationService
	) {}

	setLoader(loaderData: LoaderData): void {
		this.signalStoreService.set('blockLoaderDataKey',loaderData);

		// this.loaderData = signal(loaderData);
		this.loaderData.set(loaderData);
		if (loaderData.isLoading) {
			if (!this.dialogRef) {
				this.openDialog();
			}
		} else {
			if ( !loaderData.hasError) {
				this.closeDialog(loaderData?.loaderMessage);
			}
		}
	}

	private openDialog(): void {
		this.dialogRef = this.dialog.open(SaveLoaderComponent, {
			minWidth: '400px',
			maxWidth:'800px',
			disableClose: true,
		});
	}


	closeDialog(loaderMessage?: string): void {
		if (this.dialogRef) {
			this.dialogRef.close(); // Close the dialog
			if (loaderMessage) {
				this.notificationService.successMessage(loaderMessage);
			}
			this.dialogRef = null; // Reset dialogRef to allow reopening
		}
	}
}
