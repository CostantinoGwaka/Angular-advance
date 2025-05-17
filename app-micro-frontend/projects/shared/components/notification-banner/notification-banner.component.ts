import { Component, Input, OnInit } from '@angular/core';
import { NotificationBanner } from '../../../modules/nest-app/store/tender-validity/tender-validity.model';
import {
  NotificationBannerService
} from '../../../modules/nest-app/store/tender-validity/notification-banner.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
	ExtendTenderValidityComponent
} from '../../../modules/nest-app/app-settings/tender-validity/extend-tender-validity/extend-tender-validity.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
	selector: 'app-notification-banner',
	standalone: true,
	imports: [HasPermissionDirective],
	templateUrl: './notification-banner.component.html',
	styleUrl: './notification-banner.component.scss',
})
export class NotificationBannerComponent implements OnInit {
	@Input() mainPermission: string[] = [];
	@Input() buttonPermission: string[] = [];
	currentNotification?: NotificationBanner;
	currentIndex: number = 0;
	totalNotifications: number = 0;

	constructor(
		private notificationBannerService: NotificationBannerService,
		private dialog: MatDialog,
	) {}

	ngOnInit() {
		this.initializeNotification().then();
	}

	async initializeNotification(): Promise<void> {
		this.totalNotifications =
			await this.notificationBannerService.getNotificationsCount();
		if (this.totalNotifications >= 1) {
			this.updateCurrentNotification();
			this.notificationBannerService.currentNotificationIndex$.subscribe(
				(index) => {
					this.currentIndex = index;
					this.updateCurrentNotification();
				},
			);
		}
	}

	previousNotification() {
		this.notificationBannerService.previousNotification();
	}

	nextNotification() {
		this.notificationBannerService.nextNotification();
	}

	private updateCurrentNotification() {
		this.currentNotification =
			this.notificationBannerService.getCurrentNotification();
	}

	extendTenderValidity(currentNotification: NotificationBanner) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '50%';
		dialogConfig.data = currentNotification.notificationObject;
		this.dialog
			.open(ExtendTenderValidityComponent, dialogConfig)
			.afterClosed()
			.subscribe((result: any) => {
				if (result.code === 9000) {
					this.initializeNotification().then();
				}
			});
	}
}
