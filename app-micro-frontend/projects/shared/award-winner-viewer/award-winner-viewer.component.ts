import { Component, EventEmitter, input, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { ApolloNamespace } from 'src/app/apollo.config';
import { SelectedAward } from '../../modules/nest-tender-award/store/pending-tender-award/pending-tender-awards.model';
import { PaginatorInput } from '../../website/shared/models/web-paginator.model';
import { MatDialog } from '@angular/material/dialog';
import { AwardDialogViewerComponent } from '../../modules/nest-tender-award/pending-tender-award/award-dialog-viewer/award-dialog-viewer.component';
import { MergedMainProcurementRequisition } from '../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model';
import { RemoveUnderScorePipe } from '../pipes/remove-underscore.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
	NgTemplateOutlet,
	UpperCasePipe,
	DecimalPipe,
	DatePipe,
} from '@angular/common';
import { SafeDatePipe } from '../pipes/safe-date.pipe';
import {
	SimpleTemplateSignDialogViewerComponent,
	SimpleTemplateSignDialogViewerModal,
} from '../sign-dialog-viewer/simple-template-sign-dialog-viewer.component';
import { firstValueFrom, map } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAllAuthUsers } from '../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { AuthUser } from '../../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { ApplicationState } from '../../store';
import { SettingsService } from "../../services/settings.service";
import { StorageService } from "../../services/storage.service";
import { data } from "autoprefixer";
import { result } from "lodash";
import { GeneralService } from "../../services/general.service";
import { AwardHelperService } from "../../modules/nest-tender-award/award-helper.service";
import { AttachmentService } from "../../services/attachment.service";
import { NotificationService } from "../../services/notification.service";
import { LoaderComponent } from "../components/loader/loader.component";
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { HasPermissionDirective } from '../directives/has-permission.directive';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
	selector: 'app-award-winner-viewer',
	templateUrl: './award-winner-viewer.component.html',
	styleUrls: ['./award-winner-viewer.component.scss'],
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		NgTemplateOutlet,
		MatPaginatorModule,
		UpperCasePipe,
		DecimalPipe,
		RemoveUnderScorePipe,
		SafeDatePipe,
		LoaderComponent,
		MatMenu,
		MatMenuTrigger,
		MatMenuItem,
		HasPermissionDirective,
		MatTooltip,
	],
})
export class AwardWinnerViewerComponent
	implements OnInit, OnDestroy, OnChanges
{
	@Input() selectedAward: SelectedAward;
	// @Input() multipleSelectedAward: SelectedAward[] = [];
	multipleSelectedAward = input<SelectedAward[]>([]);
	@Input() isMultiple: boolean;
	@Input() canSign: boolean;
	@Input() jvcDetail: any;
	@Input() mergedMainProcurementRequisition: MergedMainProcurementRequisition;
	@Input() invitationDate: string;
	@Input() customAdditionalDetails: any;
	@Output() showSubmission = new EventEmitter();
	@Output() isRevertClicked = new EventEmitter();
	@Output() signedAwardDocument = new EventEmitter();

	displayedMultipleSelectedAward: SelectedAward[] = [];
	pageSize: number = 10;
	pageNumber: number = 1;
	activeTabIndex: string;
	awardModalData: any;

	paginatorInput: PaginatorInput = {
		loading: true,
	};
	userSystemAccessRoles: string;
	equivalentBidAmount = '';
	referenceNumber: string;
	isModalClosed: boolean = false;
	lettersNotPrepared: boolean = true;

	mappedSelectedAward: any;
	loadingDocument = false;
	docLoadingMessage = 'Loading document';

	constructor(
		private dialog: MatDialog,
		private store: Store<ApplicationState>,
		private settingsService: SettingsService,
		private storageService: StorageService,
		private generalService: GeneralService,
		private awardHelperService: AwardHelperService,
		private attachmentService: AttachmentService,
		private notificationService: NotificationService,
	) {}

	ngOnInit() {
		if (this.isMultiple) {
			this.selectedAward = {
				...this.selectedAward,
				entityNumber: this.multipleSelectedAward()[0].entityNumber,
				entityDescription: this.multipleSelectedAward()[0].entityDescription,
				entityType: this.multipleSelectedAward()[0].entityType,
				entityUuid: this.multipleSelectedAward()[0].entityUuid,
				coolOffPeriodEndDate:
					this.multipleSelectedAward()[0].coolOffPeriodEndDate,
				entitySubCategoryAcronym:
					this.multipleSelectedAward()[0].entitySubCategoryAcronym.replace(
						/_/g,
						' ',
					),
			};

			this.mappedSelectedAward = this.multipleSelectedAward().map((item) => {
				let unitPrice: any;
				let quantity: any;

				if (!item?.commodity) {
					unitPrice = null;
					quantity = null;
				} else {
					unitPrice =
						item?.financialCurrency +
						' ' +
						item?.commodity[0]?.unitPrice
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
					quantity = item?.commodity[0]?.quantity;
				}

				return {
					goodsDescription: item?.entityDescription,
					supplierName: item?.tendererName,
					unitPrice: unitPrice,
					quantity: quantity,
					contractAmount:
						item?.financialCurrency +
						' ' +
						item?.contractAmount
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
				};
			});
		}
	}

	ngOnChanges() {
		this.updateDisplayedData();
	}

	async viewCommodities() {
		let data = {
			...this.selectedAward,
			dataType: 'LIST_OF_COMMODITY',
		};
		const dialogRef = this.dialog.open(AwardDialogViewerComponent, {
			width: '70%',
			maxHeight: '100vh',
			data,
		});
		dialogRef.afterClosed().subscribe((result) => {
			// if (result) {
			//   this.getTenderer().then();
			// }
		});
	}

	viewSubmission(data: any) {
		this.showSubmission.emit(data);
	}

	async viewAwardLetter(selectedAward: any) {
		if (selectedAward?.attachmentUuid) {
			this.docLoadingMessage =
				'Preparing ' + selectedAward?.tendererName + ' Document';
			this.loadingDocument = true;
			if (selectedAward?.attachmentUuid) {
				const data = await this.attachmentService.getSignedAttachment(
					selectedAward?.attachmentUuid,
				);
				this.settingsService.viewFile(data, 'pdf').then(() => {
					this.loadingDocument = false;
				});
			} else {
				this.notificationService.errorMessage(
					'Something went wrong. Please try again...',
				);
			}
			this.loadingDocument = false;
			return;
		}

		const user: AuthUser = await firstValueFrom(
			this.store.pipe(
				select(selectAllAuthUsers),
				map((i) => i[0]),
			),
		);

		this.userSystemAccessRoles = this.storageService.getItem(
			'userSystemAccessRoles',
		);
		const isAO = this.userSystemAccessRoles?.indexOf('ACCOUNTING_OFFICER') >= 0;
		let nonSTDTemplateCategoryCode: string = '';
		if (selectedAward.entityType === 'TENDER') {
			nonSTDTemplateCategoryCode =
				this.mergedMainProcurementRequisition?.tender
					?.procurementCategoryAcronym == 'W'
					? 'LETTER_OF_ACCEPTANCE_WORKS'
					: 'LETTER_OF_ACCEPTANCE';
		} else {
			let frameworkType: string;
			if (
				this.mergedMainProcurementRequisition.tender
					.tenderSubCategoryAcronym === 'FRAMEWORK_AGREEMENT_GOODS_OPEN'
			) {
				frameworkType = 'OPENED';
			}
			nonSTDTemplateCategoryCode =
				frameworkType === 'OPENED'
					? 'LETTER_OF_ACCEPTANCE_FRAMEWORK_OPEN'
					: 'LETTER_OF_ACCEPTANCE_FRAMEWORK_CLOSED';
		}

		let esPerformanceSecurityType: string;
		if (
			this.customAdditionalDetails?.esPerformanceSecurityType == 'APPLICABLE'
		) {
			esPerformanceSecurityType =
				'and ' +
				this.customAdditionalDetails?.esPerformanceSecurityType.toLowerCase();
		} else {
			esPerformanceSecurityType = ' ';
		}

		if (selectedAward?.financialCurrency != 'TZS') {
			/** fix  equivalentBidAmount if is null  */
			const equivalentBidAmount = selectedAward?.equivalentBidAmount ?? 0;
			const eBidAmount = equivalentBidAmount
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			this.equivalentBidAmount =
				', (which is equivalent to TZS ' + eBidAmount + ')';
		} else {
			this.equivalentBidAmount = null;
		}

		this.referenceNumber = selectedAward?.entityNumber + '/' + (1 || 0);
		let dateFormat: string = 'DD, MMM yyyy';
		const today = this.settingsService.formatDate(new Date(), dateFormat);

		let data: SimpleTemplateSignDialogViewerModal = {
			templateCode: nonSTDTemplateCategoryCode,
			dsmsDescription: 'Award to ' + selectedAward.tendererName,
			dsmsTitle: 'Awarding',
			onlyHTML: false,
			canSign: this.canSign,
			user: user,
			tendererName: selectedAward.tendererName + ' Award Letter',
			modalTitle: selectedAward.tendererName + ' Award Letter',
			loadingMessage:
				'Preparing ' + selectedAward.tendererName + ' Award Letter',
			templatePayload: [
				{ field: 'folioNumber', value: this.referenceNumber },
				{
					field: 'tenderNumber',
					value: selectedAward?.entityNumber,
				},
				{ field: 'contractNumber', value: selectedAward.entityNumber },
				{
					field: 'performanceSecurityType',
					value: this.customAdditionalDetails?.tenderSecurityPerformanceType
						? this.customAdditionalDetails?.tenderSecurityPerformanceType
						: this.customAdditionalDetails?.tenderSecurityPerformanceTypeCustom,
				},
				{
					field: 'esPerformanceSecurityType',
					value: esPerformanceSecurityType,
				},
				{
					field: 'contractAmountInWords',
					value: this.generalService?.numberToWords(
						selectedAward?.contractAmount,
					),
				},
				{
					field: 'submissionCurrency',
					value: selectedAward?.financialCurrency,
				},
				{
					field: 'contractAmount',
					value: selectedAward.contractAmount
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
				},
				{ field: 'equivalentBidAmount', value: this.equivalentBidAmount },
				{
					field: 'tenderDescription',
					value: selectedAward?.entityDescription.toUpperCase(),
				},
				{
					field: 'tendererName',
					value: this.jvcDetail?.useJvcCheck
						? this.jvcDetail?.name
						: selectedAward?.tendererName,
				},
				{
					field: 'invitationDate',
					value:
						this.invitationDate ??
						new DatePipe('en-GB').transform(
							selectedAward?.mergedMainProcurementRequisition.tender
								?.invitationDate,
							'dd/M/y',
						),
				},
				{
					field: 'letterDate',
					value: new DatePipe('en-GB').transform(new Date(), 'dd/M/y'),
				},
				{
					field: 'tendererAddress',
					value: selectedAward?.tendererAddress
						? selectedAward?.tendererAddress
						: selectedAward?.email,
				},
				{ field: 'date', value: today },
				{
					field: 'listOfTenderersForCommodity',
					value: this.multipleSelectedAward().map((item) => {
						return {
							goodsDescription: item.entityDescription,
							supplierName: item.tendererName,
							unitPrice:
								item.financialCurrency +
								' ' +
								item.commodity[0].unitPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
							quantity: item.commodity[0].quantity,
							contractAmount:
								item.financialCurrency +
								' ' +
								item.contractAmount
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						};
					}),
				},
				{
					field: 'listOfTenderersForCommodityTwo',
					value: this.isMultiple
						? await this.awardHelperService
								.createCommodityHTMLTable(this.mappedSelectedAward)
								.then()
						: null,
				},
				{
					field: 'signatoryName',
					value: isAO ? user?.fullName : '.......................',
				},
				{ field: 'singleSignature', value: 'SIGNATURE_PLACEHOLDER' },
			],
		};

		const dialogRef = this.dialog.open(
			SimpleTemplateSignDialogViewerComponent,
			{
				width: '70%',
				maxHeight: '100vh',
				data,
				disableClose: true,
			},
		);
		dialogRef
			.afterClosed()
			.subscribe(async (result: SimpleTemplateSignDialogViewerModal) => {
				if (result && result?.letterUuid) {
					this.signedAwardDocument.emit(result?.letterUuid);
					this.isModalClosed = true;
					this.lettersNotPrepared = false;
				} else {
					this.lettersNotPrepared = true;
				}
			});
	}

	pageEvent(event: any) {
		this.pageSize = event.pageSize;
		this.pageNumber = event.pageIndex + 1;
		this.updateDisplayedData();
	}

	updateDisplayedData() {
		const startIndex = (this.pageNumber - 1) * this.pageSize;
		const endIndex = startIndex + this.pageSize;
		this.displayedMultipleSelectedAward = this.multipleSelectedAward().slice(
			startIndex,
			endIndex,
		);
	}

	setActiveIndex(index: string) {
		this.activeTabIndex = this.activeTabIndex === index ? null : index;

		if (this.activeTabIndex) {
			/// TODO fetch award by uuid
		}
	}


	revertIntentionOfAward() {
		this.isRevertClicked.emit(true);
	}

	ngOnDestroy(): void {}
}
