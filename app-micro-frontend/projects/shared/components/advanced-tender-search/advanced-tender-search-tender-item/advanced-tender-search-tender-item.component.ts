import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	HostListener,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Router, RouterLink } from '@angular/router';
import * as moment from 'moment';
import { AttachmentService } from '../../../../services/attachment.service';
import { GraphqlService } from '../../../../services/graphql.service';
import { StorageService } from '../../../../services/storage.service';
import { PublicEntityItem } from 'src/app/website/store/public-tenders-item.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmSubmissionComponent } from '../../../../modules/nest-tenderer/tender-submission/confirmation/confirm-submission.component';
import {
	IndexdbLocalStorageService,
	Tables,
} from '../../../../services/indexdb-local-storage.service';
import { SettingsService } from '../../../../services/settings.service';
import { GET_MERGED_MAIN_PROCUREMENT_REQUISITION_FOR_DOCUMENT_BY_UUID } from 'src/app/modules/nest-tender-initiation/store/tender-document-creation/tender-document-creation.graphql';
import { NotificationService } from '../../../../services/notification.service';
import { AuthService } from '../../../../services/auth.service';
import { Store } from '@ngrx/store';
import { ApplicationState } from 'src/app/store';
import { setSelectedPublishedEntity } from 'src/app/store/temporary/views/views.actions';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
	selector: 'app-advanced-tender-search-tender-item',
	templateUrl: './advanced-tender-search-tender-item.component.html',
	styleUrls: ['./advanced-tender-search-tender-item.component.scss'],
	standalone: true,
	imports: [
		NgClass,
		HasPermissionDirective,
		MatProgressSpinnerModule,
		DecimalPipe,
		TranslatePipe,
	],
})
export class AdvancedTenderSearchTenderItemComponent implements OnInit {
	@Input()
	showApplyBtn: boolean; /** it controls continue/apply btn */

	@Input() isPublic: boolean = false;

	@Input() tendererType: string;

	@Input()
	actionStatus: 'PENDING' | 'SUBMITTED' | 'ALL' =
		'ALL'; /** it controls action button */

	@Input()
	isEligible: boolean = false; /** it controls continue/apply btn */

	@Input()
	submissionUuid: string; /** submission uuid tender has already shown interest */

	@Input()
	tenderIsInterested: boolean; /** it controls tenderer is already interested in that tender */

	@Input()
	requisitionItem: PublicEntityItem;

	@Input()
	showAmount: boolean = false;

	@Input()
	showAwardedTo: boolean = false;

	@Input()
	showAwardDate: boolean = false;

	@Input()
	showActionButtons: boolean = true;

	@Input()
	showAwardButtons: boolean = false;

	@Input()
	showIntention: boolean = false;

	@Input()
	showInvitationDate: boolean = true;

	@Input()
	showSubmissionDeadline: boolean = true;

	@Input()
	showEntityNumber: boolean = true;

	@Input()
	allowHeaderClick: boolean = true;

	@Input()
	overrideActionButtons: boolean =
		false; /** it controls apply and continue button - in eligible button */

	entityTypeLabels: { [key: string]: string } = {
		PLANNED_TENDER: 'Pre Qualification',
		TENDER: 'Tender',
		FRAMEWORK: 'Framework',
		CONTRACT: 'Contract',
	};

	@Output()
	tendererNotEligible: EventEmitter<PublicEntityItem> =
		new EventEmitter(); /** Control tenderer eligibility to apply for the tender */

	closingSoonDaysCount = 0;
	recursiveBreakerCount = 0;
	submissionButtonText: string = 'Apply';
	invitationDate: string;
	deadline: string;
	isClosingSoon: boolean = false;
	peLogo: string = null;
	loadLogo: boolean = false;
	loadingAward: boolean = false;
	trimmedDescription: string;
	eligibleTendererType: boolean = false;

	@ViewChild('contentWrapper', { static: false }) contentWrapper: ElementRef;
	@ViewChild('logoWrapper', { static: false }) logoWrapper: ElementRef;

	constructor(
		private attachmentService: AttachmentService,
		private settingServices: SettingsService,
		private settingService: SettingsService,
		private apollo: GraphqlService,
		private storageService: StorageService,
		private confirmationDialog: MatDialog,
		private authService: AuthService,
		private notificationService: NotificationService,
		private indexDbLocalStorageService: IndexdbLocalStorageService,
		private router: Router,
		private store: Store<ApplicationState>,
	) { }

	ngAfterViewInit() {
		this.setTitleWrapperWidth();
	}

	@HostListener('window:resize')
	onWindowResize() {
		this.setTitleWrapperWidth();
	}

	private setTitleWrapperWidth() {
		// const contentWidth = this.contentWrapper.nativeElement.offsetWidth;
		// const logoWidth = this.logoWrapper.nativeElement.offsetWidth;
		//
		// const titleWrapperWidth = contentWidth - (logoWidth + 15);
		// this.renderer.setStyle(
		//   this.titleWrapper?.nativeElement,
		//   'width',
		//   `${titleWrapperWidth}px`
		// );
	}

	ngOnInit(): void {
		if (this.overrideActionButtons) {
			this.tenderIsInterested = true;
		}

		if (this.actionStatus && this.tenderIsInterested) {
			this.submissionButtonText = 'Continue';
		}

		if (
			this.requisitionItem.entityStatus == 'OPENED' ||
			this.requisitionItem.entityStatus == 'EVALUATION_COMPLETED'
		) {
			this.submissionButtonText = 'View Bid';
		}

		if (this.tendererType && this.isEligible) {
			this.isEligible = this.requisitionItem?.eligibleTypes?.includes(
				this.tendererType,
			);
		}

		this.trimmedDescription = this.settingServices.subStringText(
			this.requisitionItem?.descriptionOfTheProcurement ??
			this.requisitionItem?.entityDescription,
			160,
		);
		this.init().then();
	}

	async init() {
		this.setDates();
		this.getPEDetails(this.requisitionItem.procuringEntityUuid);
	}

	getPEDetails(peUuid: string) {
		/** added this recursive function to help with checking if logo is found in indexedDb
		 * added a 15 seconds check if logo does not exist to end this recursive */
		this.loadLogo = true;
		this.indexDbLocalStorageService
			.getByKey(Tables.InstitutionLogo, peUuid)
			.then((checker) => {
				if (checker) {
					this.loadLogo = false;
					this.peLogo = checker.data.hasLogo
						? checker.data.base64Attachment
						: '/assets/images/emblen.png';
				} else if (this.recursiveBreakerCount <= 3) {
					this.recursiveBreakerCount++;
					setTimeout(() => this.getPEDetails(peUuid), 2500);
				} else {
					/// fetch it's not available in indexedDb
					this.getPELogo(peUuid).then();
				}
			});
	}

	async getPELogo(logoUuid: string) {
		this.loadLogo = true;
		const logo = await this.attachmentService.getPELogo(logoUuid);
		if (logo) {
			this.peLogo = logo;
		} else {
			/// set no data
			this.attachmentService.setPeLogInLocalStorage({
				uuid: logoUuid,
				logoUuid: logoUuid,
				title: logoUuid,
				description: logoUuid,
				base64Attachment: '',
				signedDocBase64Attachment: '',
				fileExtension: '',
				hasLogo: false,
			});
			this.peLogo = '/assets/images/emblen.png';
		}
		this.loadLogo = false;
	}

	async viewOnlySubmission(submission: PublicEntityItem) {
		const isTendererValid = this.checkLoggedInAndUserType('TENDERER', false);
		const isManufacturerValid = this.checkLoggedInAndUserType(
			'MANUFACTURER',
			false,
		);
		const checkUser = isTendererValid || isManufacturerValid;
		if (checkUser) {
			await this.router.navigate(['/nest-tenderer/tenders/submission'], {
				queryParams: {
					action: 'view-submission',
					id: submission.uuid,
					acronym: submission.procurementCategoryAcronym,
					bid: this.submissionUuid,
					submission: submission.mainSubmissionUuid,
					entityType: this.requisitionItem.entityType,
				},
			});
		}
	}

	async continueSubmission(publicEntityItem: PublicEntityItem): Promise<void> {
		const isTendererValid = this.checkLoggedInAndUserType('TENDERER', false);
		const isManufacturerValid = this.checkLoggedInAndUserType(
			'MANUFACTURER',
			false,
		);
		const checkUser = isTendererValid || isManufacturerValid;
		if (checkUser) {
			if (this.overrideActionButtons) {
				/// Only to be used if action buttons are overridden submissionUuid obtained from view
				this.submissionUuid = publicEntityItem.mainSubmissionUuid;
			}

			if (publicEntityItem.lotCount > 1) {
				/// Go to lot selection-proccess page
				this.router
					.navigate(
						[
							'/nest-tenderer',
							'tenders',
							'submission',
							'lot-selection-proccess',
						],
						{
							queryParams: {
								entity: publicEntityItem.entityType,
								id: publicEntityItem.uuid,
								bid: this.submissionUuid,
								lot: true,
								entityNumber: publicEntityItem.entityNumber,
							},
						},
					)
					.then();
			} else {
				await this.router.navigate(['/nest-tenderer/tenders/submission'], {
					queryParams: {
						action: 'submission',
						id: publicEntityItem.uuid,
						acronym: publicEntityItem.procurementCategoryAcronym,
						bid: this.submissionUuid,
						entityType: this.requisitionItem.entityType,
					},
				});
			}
		}
	}

	// navigateViewSubmissionDetails(requisitionItem: PublicEntityItem) {
	//
	//   this.router.navigate([
	//     '/nest-tenderer/bid-submission',
	//     requisitionItem.uuid,
	//     requisitionItem.uuid
	//   ]).then();
	// }

	generateRouterLink(requisitionItem: PublicEntityItem) {
		const isTendererValid = this.checkLoggedInAndUserType('TENDERER', false);
		const isManufacturerValid = this.checkLoggedInAndUserType(
			'MANUFACTURER',
			false,
		);
		const checkUser = isTendererValid || isManufacturerValid;

		if (checkUser) {
			return [
				'/nest-tenderer/submission',
				requisitionItem.uuid,
				requisitionItem.uuid,
				requisitionItem.entityType,
			];
		} else {
			return ['/tender-details'];
		}
	}

	generateQueryParams(requisitionItem: PublicEntityItem): any | null {
		const isTendererValid = this.checkLoggedInAndUserType('TENDERER', false);
		const isManufacturerValid = this.checkLoggedInAndUserType(
			'MANUFACTURER',
			false,
		);
		const checkUser = isTendererValid || isManufacturerValid;
		if (checkUser) {
			return ['/tender-details'];
		} else {
			return {
				tender: JSON.stringify(requisitionItem.uuid),
				reqUuid: JSON.stringify(requisitionItem.uuid),
				entityType: requisitionItem.entityType,
			};
		}
	}

	navigateViewDetails(requisitionItem: PublicEntityItem) {
		this.store.dispatch(
			setSelectedPublishedEntity({ selectedPublishedEntity: requisitionItem }),
		);

		const isTendererValid = this.checkLoggedInAndUserType('TENDERER', false);
		const isManufacturerValid = this.checkLoggedInAndUserType(
			'MANUFACTURER',
			false,
		);
		const checkUser = isTendererValid || isManufacturerValid;
		if (checkUser) {
			this.router
				.navigate([
					'/nest-tenderer/submission',
					requisitionItem.uuid,
					requisitionItem.uuid,
					requisitionItem.entityType,
				])
				.then();
		} else {
			const tenderQueryParamString = JSON.stringify(requisitionItem.uuid);
			const reqUuid = JSON.stringify(requisitionItem.uuid);
			this.router.navigate(['/tender-details']).then();
		}
	}

	async navigateToOpeningReport(requisitionItem: PublicEntityItem) {
		let checkUser = false;
		let pathUrl: any = '';
		if (this.isPublic == true) {
			pathUrl = '/reports/report-view';
		} else {
			checkUser = this.checkLoggedInAndUserType('TENDERER');
			pathUrl = checkUser
				? '/nest-tenderer/report-view'
				: '/reports/report-view';
		}
		const report = 'opening';
		const tid = requisitionItem.uuid;
		const rid = requisitionItem.uuid;
		const type = requisitionItem.entityType;
		const tno = requisitionItem.entityNumber;

		/** simplified and make it more readable */
		await this.router.navigate([pathUrl], {
			queryParams: {
				report,
				tid,
				rid,
				type,
				tno,
			},
		});
	}

	setDates() {
		this.setIsClosingSoon();
	}

	formatDate(date: string, withTime: boolean = false) {
		let formattedDate = moment(date).format('DD MMM YYYY');
		try {
			if (withTime) {
				formattedDate += ' ' + moment(date).format('h:mm A');
			}
		} catch (e) { }
		return date ? formattedDate : 'N/A';
	}

	setIsClosingSoon() {
		let deadline = moment(this.requisitionItem?.submissionOrOpeningDate);
		let today = moment();

		let diff = deadline.diff(today, 'days');

		this.isClosingSoon = diff <= this.closingSoonDaysCount;
	}

	// formatDateTIME(date: string) {
	//   return moment(date).format('YYYY-MM-DD HH:MM');
	// }

	subStringTitle(title: string) {
		if (title?.length > 30) {
			const subTitle = title.replace('<br>', '').substring(0, 15);
			return subTitle + '..';
		} else {
			return title;
		}
	}

	checkLoggedInAndUserType(userType: string, useAlerts: boolean = true) {
		const isLoggedIn = this.storageService.getItem('isLoggedin') === 'true';
		const serviceUserType = this.storageService.getItem('serviceUserType');
		const hasSignature = this.storageService.getItem('hasSignature') === 'true';
		if (useAlerts) {
			if (!isLoggedIn) {
				this.notificationService.errorMessage(
					'You are not logged in. Please log in to continue',
				);
				this.authService.logout().then();
				return false;
			} else if (serviceUserType !== userType) {
				this.notificationService.errorMessage(
					`You are not registered as ${userType}. Please register as ${userType}`,
				);
				return false;
			} else if (!hasSignature) {
				this.notificationService.errorMessage(
					'You have not set your digital signature. Please set your digital signature',
				);
				return false;
			}
			return true;
		} else {
			return isLoggedIn && serviceUserType === userType && hasSignature;
		}
	}

	submitNotEligible(event: PublicEntityItem) {
		this.tendererNotEligible.emit(event);
	}

	async confirmSubmission(event: PublicEntityItem) {
		const isTendererValid = this.checkLoggedInAndUserType('TENDERER', false);
		const isManufacturerValid = this.checkLoggedInAndUserType(
			'MANUFACTURER',
			false,
		);

		const checkUser = isTendererValid || isManufacturerValid;
		if (!checkUser) {
			return;
		}
		if (
			this.requisitionItem.entityStatus == 'OPENED' ||
			this.requisitionItem.entityStatus == 'EVALUATION_COMPLETED'
		) {
			await this.viewOnlySubmission(event);
		} else if (this.tenderIsInterested) {
			await this.continueSubmission(event);
		} else {
			this.confirmRequisitionDialog(event);
		}
	}
	confirmRequisitionDialog(event) {
		if (event.lotCount > 1) {
			/// Go to lot selection-proccess page
			this.router
				.navigate(
					['/nest-tenderer', 'tenders', 'submission', 'lot-selection-proccess'],
					{
						queryParams: {
							entity: event.entityType,
							id: event.uuid,
							entityNumber: event.entityNumber,
						},
					},
				)
				.then();
		} else {
			// const config = new MatDialogConfig();
			// config.autoFocus = 'dialog';
			// config.closeOnNavigation = false;
			// config.data = {
			// 	requisition: event,
			// 	invitationDate: this.settingService.formatDate(
			// 		event.objectActualDateViewEntity?.invitationDate,
			// 	),
			// 	openingDate: event.objectActualDateViewEntity?.submissionOrOpeningDate,
			// };

			const config = new MatDialogConfig();
			//   // Ensure the dialog is centered
			config.panelClass = 'centered-dialog'; // Apply a custom class for centering
			config.autoFocus = true; // Focus on the dialog when opened
			config.width = '80%'; // Set a fixed width (adjust as needed)
			config.height = '90%'; // Allow height to adjust dynamically
			config.closeOnNavigation = false;
			config.disableClose = true; // Prevent closing by clicking outside

			config.data = {
				requisition: event,
				invitationDate: this.settingService.formatDate(
					event.objectActualDateViewEntity?.invitationDate,
				),
				openingDate: event.objectActualDateViewEntity?.submissionOrOpeningDate,
			};

			// config.panelClass = ['bottom__sheet'];

			this.confirmationDialog
				.open(ConfirmSubmissionComponent, config)
				.afterClosed()
				.subscribe((result) => {
					if (result) {
						/// set power of attorney
						this.submissionUuid = result;
						this.continueSubmission(event).then();
					}
				});
		}
	}

	async getMergedMainProcurementRequisitionByUuid(uuid: string) {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_MERGED_MAIN_PROCUREMENT_REQUISITION_FOR_DOCUMENT_BY_UUID,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					uuid,
				},
			});
			if (
				response.data.getMergedMainProcurementRequisitionByUuid.code === 9000
			) {
				return response.data.getMergedMainProcurementRequisitionByUuid.data;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async viewDocument(awardDocumentUuid: string) {
		this.loadingAward = true;
		if (awardDocumentUuid) {
			const data = await this.attachmentService.getSignedAttachment(
				awardDocumentUuid,
			);
			this.loadingAward = false;
			this.settingServices.viewFile(data, 'pdf').then(() => {
				this.loadingAward = false;
			});
		} else {
			this.notificationService.errorMessage('No Awarded Letter Found');
			this.loadingAward = false;
		}
	}

	subStringDescription(description: string) {
		// return this.settingServices.subStringText(description, 15);
	}

	roundNumber(number: number) {
		return Math.round(number);
	}
}
