import { savebusinessLine } from '../modules/nest-tenderer-management/store/business-line/business-line.actions';
import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseCodeService } from './response-code.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import {
	BlockingDialogData,
	BlockingLoaderComponent,
} from '../shared/components/blocking-loader/blocking-loader.component';
import {
	SimpleInputModelComponentData,
	TextInputModelComponent,
} from '../shared/components/text-input-model/text-input-model.component';
import {
	BlockingNotificationErrorComponent,
	BlockingNotificationErrorData,
} from '../shared/components/blocking-notification-error/blocking-notification-error.component';
import {
	BlockingNotificationMessageComponent,
	BlockingNotificationMessageData,
} from '../shared/components/blocking-notification-message/blocking-notification-message.component';
import {
	ConfirmationDialogData,
	ConfirmationDialogComponent,
} from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarLoaderCustomComponent } from '../shared/components/snackbar-loader-custom/snackbar-loader-custom.component';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	showError(arg0: string) {
		throw new Error('Method not implemented.');
	}
	loaderDialogRef: any;

	constructor(
		private router: Router,
		private snackbar: MatSnackBar,
		private authService: AuthService,
		private responseCodeService: ResponseCodeService,
		private dialog: MatDialog
	) {}

	determineSnackbar(data: { code: string | number; description: string }) {
		if (data.code === 9000) {
			this.successSnackbar(data?.description);
		} else if (
			data.code === 9002 ||
			data.code === 9003 ||
			data.code === 9004 ||
			data.code === 9005 ||
			data.code === 9006 ||
			data.code === 9007 ||
			data.code === 9008 ||
			data.code === 9009 ||
			data.code === 9010 ||
			data.code === 9011 ||
			data.code === 9012 ||
			data.code === 9013 ||
			data.code === 9012 ||
			data.code === 9014 ||
			data.code === 9015 ||
			data.code === 9016 ||
			data.code === 9017 ||
			data.code === 9018 ||
			data.code === 9019 ||
			data.code === 9020 ||
			data.code === 9021 ||
			data.code === 9022 ||
			data.code === 9023
		) {
			this.errorSnackbar(data?.description + ': ' + data?.code);
		} else {
			this.warningSnackbar(data?.description + ': ' + data?.code);
		}
	}

	confirmationSnackbar(message: string, action?: string) {
		// return this.snackbar.open(message, action, {
		// 	duration: 3000,
		// 	horizontalPosition: 'center',
		// 	verticalPosition: 'top',
		// 	panelClass: 'green-snackbar',
		// });
		return this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'top',
			panelClass: ['custom-snackbar'],
			data: {
				message: message,
				backgroundColor: '#62a832',
				isSuccess: true,
			},
		});
	}

	successSnackbar(message: string, action?: string) {
		// return this.snackbar.open(message, action, {
		// 	duration: 5000,
		// 	horizontalPosition: 'center',
		// 	panelClass: 'green-snackbar',
		// });
		return this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'top',
			panelClass: ['custom-snackbar'],
			data: {
				message: message,
				backgroundColor: '#62a832',
				isSuccess: true,
			},
		});
	}

	errorSnackbar(message: string, action?: string) {
		if (message?.includes('at position')) {
			this.errorSnackbar(
				'You logged in another session. This session was terminated.'
			);
			this.authService.logout();
			return null;
		}

		// return this.snackbar.open(message, action, {
		// 	duration: 3000,
		// 	verticalPosition: 'top',
		// 	panelClass: 'red-snackbar',
		// });
		return this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'top',
			panelClass: ['custom-snackbar'],
			data: {
				message: message,
				backgroundColor: '#62a832',
				isSuccess: false,
			},
		});
	}

	warningSnackbar(message: string, action?: string) {
		// return this.snackbar.open(message, action, {
		//   duration: 3000,
		//   verticalPosition: 'top',
		//   horizontalPosition: 'center',
		//   panelClass: 'warning-snackbar',
		// });
		return this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'top',
			panelClass: ['custom-snackbar'],
			data: {
				message: message,
				backgroundColor: '#62a832',
				isSuccess: false,
			},
		});
	}

	internetSnackbar(message: string, action?: string) {
		// return this.snackbar.open(message, action, {
		//   duration: 3000,
		//   verticalPosition: 'top',
		//   panelClass: 'warning-snackbar',
		// });
		return this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'top',
			panelClass: ['custom-snackbar'],
			data: {
				message: message,
				backgroundColor: '#62a832',
				isSuccess: false,
			},
		});
	}

	successMessage(message: string, duration?: number, action?: string) {
		// return this.snackbar.open(message, action, {
		//   duration: duration ? duration : 2500,
		//   // horizontalPosition: 'center',
		//   verticalPosition: 'top',
		//   panelClass: 'green-snackbar',
		// });
		return this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'top',
			panelClass: ['custom-snackbar'],
			data: {
				message: message,
				backgroundColor: '#2b6930',
				isSuccess: true,
			},
		});
	}

	errorMessage(message: string, action?: string) {
		if (message && message.includes('ECONNREFUSED')) {
			this.warningSnackbar(
				'Try again after a few minutes, the changes have been pushed'
			);
			return null;
		}

		if (
			message &&
			(message.includes(': Access is denied') ||
				message.includes('Unauthorized access'))
		) {
			this.errorMessage('According to NeST, you are access is denied.');
			return null;
		}

		if (message && message.includes('ECONNREFUSED')) {
			this.warningSnackbar(
				'Try again after a few minutes, the changes have been pushed'
			);
			return null;
		}

		if (message && message.includes('at position')) {
			this.errorMessage(
				'You logged in another session. This session was terminated.'
			);
			this.authService.logout();
			return null;
		}

		//error check stack
		// 'ApolloError',
		const substringsToCheck = [
			'Http failure response for https',
			'400',
			'401',
			'Apache',
		];

		//error check stack
		const databaseErrorToCheck = [
			'Could not roll back JPA transaction',
			'rollback against JDBC Connection',
		];

		let substringFound = false;
		let databaseErrorFound = false;

		// Loop through the substrings and check if any of them are in the message
		for (const substring of substringsToCheck) {
			if (
				message != "Cannot read properties of undefined (reading 'includes')" &&
				message?.includes(substring)
			) {
				substringFound = true;
				break; // Exit the loop if any substring is found
			}
		}

		// Loop through the substrings and check if any of them are in the message
		for (const substring of databaseErrorToCheck) {
			if (
				message != "Cannot read properties of undefined (reading 'includes')" &&
				message?.includes(substring)
			) {
				databaseErrorFound = true;
				break; // Exit the loop if any substring is found
			}
		}

		if (substringFound) {
			// NeST Already Sent Error to Support Team
			this.errorMessage(
				"Something went wrong, but don't worry it's not your fault. Let's try reloading the page."
			);
			console.error(message);
			return null;
		}
		//error handler end here

		//database error
		if (databaseErrorFound) {
			this.errorMessage(
				'Sorry, Something Went wrong (Database roll back transaction)!!'
			);
			console.error(message);
			return null;
		}

		if (message == "Cannot read properties of undefined (reading 'includes')") {
			this.errorMessage('Sorry, Something Went wrong');
			return null;
		}

		// if message not found
		if (message == null) {
			this.errorMessage(
				"Something went wrong, but don't worry it's not your fault. Let's try reloading the page."
			);
			return null;
		}

		// c70424
		// return this.snackbar.open(message, action, {
		//   duration: 7000,
		//   // horizontalPosition: 'center',
		//   verticalPosition: 'top',
		//   panelClass: 'red-snackbar',
		// });
		return this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'top',
			panelClass: ['custom-snackbar'],
			data: {
				message: message,
				backgroundColor: '#c70424',
				isSuccess: false,
			},
		});
	}

	successMessageWithRedirect(message: string, route: string | UrlTree) {
		// const response = this.snackbar.open(message, '', {
		//   duration: 3000,
		//   horizontalPosition: 'center',
		//   panelClass: 'green-snackbar',
		// });
		const response = this.snackbar.openFromComponent(
			SnackbarLoaderCustomComponent,
			{
				duration: 3000,
				horizontalPosition: 'right',
				verticalPosition: 'top',
				panelClass: ['custom-snackbar'],
				data: {
					message: message,
					backgroundColor: '#2b6930',
					isSuccess: true,
				},
			}
		);

		if (response) {
			return this.router.navigateByUrl(route);
		}
		return null;
	}

	catchError(message: string, action?: string) {
		return catchError((error) => {
			// this.snackbar.open(message, action, {
			// 	duration: 3000,
			// 	verticalPosition: 'top',
			// 	panelClass: 'red-snackbar',
			// });
			this.snackbar.openFromComponent(SnackbarLoaderCustomComponent, {
				duration: 3000,
				horizontalPosition: 'right',
				verticalPosition: 'top',
				panelClass: ['custom-snackbar'],
				data: {
					message: message,
					backgroundColor: '#62a832',
					isSuccess: false,
				},
			});
			return of([]);
		});
	}

	handleErrorMessage(data: any) {
		const responseCode = this.responseCodeService.getCodeDescription(
			data?.code
		);
		const message =
			responseCode[0]?.code + ' : ' + responseCode[0]?.description;
		return this.errorMessage(message);
	}

	formatDate(dateReceived, format: string = 'YYYY-MM-DD') {
		if (typeof dateReceived === 'string' && dateReceived !== '') {
			dateReceived = new Date(dateReceived);
		}
		return dateReceived ? moment(dateReceived).format(format) : undefined;
	}
	formatDateTime(dateReceived, format: string = 'YYYY-MM-DD HH:MM') {
		if (typeof dateReceived === 'string' && dateReceived !== '') {
			dateReceived = new Date(dateReceived);
		}
		return dateReceived ? moment(dateReceived).format(format) : undefined;
	}

	// formatDate(date: string | number | Date, format: string = 'dd/MM/yyyy'): string {
	//   return new Date(date).toISOString().substring(0, 10);
	//   // return new Date(date).toLocaleString().substring(0, 10);
	// }

	showLoader(data: BlockingDialogData) {
		this.loaderDialogRef = this.dialog.open(BlockingLoaderComponent, {
			width: '450px',
			data,
			disableClose: data.allowCancel ? false : true,
		});
		return this.loaderDialogRef;
	}

	hideLoader(loaderReference: any = null) {
		if (loaderReference) {
			loaderReference.close();
			return;
		}
		if (this.loaderDialogRef) {
			this.loaderDialogRef.close();
		}
	}

	showSimpleInput(data: SimpleInputModelComponentData, width: string = '60%') {
		return this.dialog.open(TextInputModelComponent, {
			width,
			data,
			disableClose: true,
		});
	}

	showConfirmMessage(data: ConfirmationDialogData, width: string = '450px') {
		return this.dialog.open(ConfirmationDialogComponent, {
			width,
			data,
			disableClose: true,
		});
	}

	showErrorDialog(data: BlockingNotificationErrorData) {
		this.loaderDialogRef = this.dialog.open(
			BlockingNotificationErrorComponent,
			{
				width: '450px',
				data,
			}
		);
	}
}
