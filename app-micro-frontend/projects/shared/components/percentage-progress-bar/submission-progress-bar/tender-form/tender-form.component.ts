import { AttachmentVerificationService } from '../../../../../services/document/attachment-verification.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { GraphqlService } from '../../../../../services/graphql.service';
import { ApplicationState } from '../../../../../store';
import { COMPLETE_SUBMISSION_WITH_FORM } from '../../../../../modules/nest-tenderer/store/submission/submission.graphql';
import { NotificationService } from '../../../../../services/notification.service';
import { HTMLDocumentService } from '../../../../../services/html-document.service';
import { GET_TAX_SUMMARY_BY_SUBMISSION, GET_TENDER_FORM } from '../../store/tender-form/tender-form.graphql';
import { TenderFormModel } from '../../store/tender-form/tender-form.model';
import { AttachmentService } from '../../../../../services/attachment.service';

import { first, firstValueFrom, map } from 'rxjs';
import { selectAllAuthUsers } from '../../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { GeneralService } from '../../../../../services/general.service';
import { UntypedFormGroup, FormsModule } from '@angular/forms';
import { FieldConfig } from '../../../dynamic-forms-components/field.interface';
import * as formConfigs from '../tender-form/tender-form-fields';
import { DynamicFormService } from '../../../dynamic-forms-components/dynamic-form.service';
import { CustomAlertBoxModel } from '../../../custom-alert-box/custom-alert-box.model';
import { DoNotSanitizePipe } from '../../../../word-processor/pipes/do-not-sanitize.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmAreaComponent } from '../../../confirm-area/confirm-area.component';
import { MainDynamicFormComponent } from '../../../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';
import { CustomAlertBoxComponent } from '../../../custom-alert-box/custom-alert-box.component';
import { LoaderComponent } from '../../../loader/loader.component';

import { ModalHeaderComponent } from '../../../modal-header/modal-header.component';
import { JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReplacePipe } from 'src/app/shared/pipes/replace.pipe';
import { BidInterest } from 'src/app/modules/nest-tenderer/store/submission/submission.model';
import { environment } from 'src/environments/environment';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-tender-form',
	templateUrl: './tender-form.component.html',
	styleUrls: ['./tender-form.component.scss'],
	standalone: true,
	imports: [
		LoaderComponent,
		CustomAlertBoxComponent,
		MainDynamicFormComponent,
		ConfirmAreaComponent,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatExpansionModule,
		FormsModule,
		ReplacePipe,
		DoNotSanitizePipe,

	],
})
export class TenderFormComponent implements OnInit {
	submissionUuid: string;
	procuringEntityUuid: string;
	passphrase: string;
	loading: boolean;
	submission: BidInterest;
	showConfirm: boolean = false;
	withHoldingTaxLocal: any;
	savingData: boolean;
	savingDataMessage: string = '';
	hide: boolean = false;
	useOfficeLocation: boolean = true;
	signedDocument: boolean = false;
	html: any;
	attachmentUid: string;
	formListTenderSubmissionForm: any[];
	officeLocation: string;
	tenderForm: TenderFormModel;
	userData: any;
	htmlFinancial: any;
	htmlTechnical: any;


	supportForm: UntypedFormGroup;
	fields: FieldConfig[] = formConfigs.fields;

	showAlert = false;
	addressDetectedAlert: CustomAlertBoxModel = {
		title: 'Important notice',
		buttonTitle: '',
		showButton: false,
		details: [],
	};
	loadingTemplate = false;

	constructor(
		private notificationService: NotificationService,
		private apollo: GraphqlService,
		private htmlDocumentService: HTMLDocumentService,
		private attachmentService: AttachmentService,
		private dialogRef: MatBottomSheetRef<TenderFormComponent>,
		private generalService: GeneralService,
		private dynamicFormService: DynamicFormService,
		private store: Store<ApplicationState>,
		private http: HttpClient,
		private settingService: SettingsService,
		public attachmentVerificationService: AttachmentVerificationService,
		@Inject(MAT_BOTTOM_SHEET_DATA) data
	) {
		this.submissionUuid = data?.submissionUuid;
		this.tenderForm = data?.tenderForm;
		this.procuringEntityUuid = data?.procuringEntityUuid;
		this.formListTenderSubmissionForm = this.tenderForm?.formListTenderSubmissionForm;
		this.submission = data?.submission;
	}

	ngOnInit(): void {
		this.getUser().then();
		if (this.tenderForm?.tendererAddress) {
			this.showAlert = true;
			this.addressDetectedAlert.details = [
				{
					icon: 'info',
					message:
						'This address will be used in tender form ' +
						this.tenderForm?.tendererAddress,
				},
			];
		} else {
			this.showAlert = false;
		}

		this.supportForm = this.dynamicFormService.createControl(this.fields, null);
	}

	async getUser() {
		this.userData = await firstValueFrom(
			this.store.pipe(
				select(selectAllAuthUsers),
				map((i) => i[0])
			)
		);
	}

	async getTenderForm() {
		this.loading = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_TENDER_FORM,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					submissionUuid: this.submissionUuid,
				},
			});

			if (response.data.getTenderForm.code === 9000) {
				const data = response.data.getTenderForm.data;
				this.tenderForm.bidAmountInFigures = data.bidAmountInFigures;
				this.tenderForm.tenderCurrency = data.financialCurrency
					? data.financialCurrency
					: 'TZS';
			}

			this.loading = false;
		} catch (e) {
			console.error(e);
			this.loading = false;
		}
	}

	async viewSubmissionFormTechnical(formKey) {
		const today = new Date();

		const day = today.getDate();
		const month = today.getMonth() + 1;
		const year = today.getFullYear();

		if (this.htmlTechnical == null) {
			const tendererHTMLDocumentDto = {
				procuringEntityUuid: this.procuringEntityUuid,
				nonSTDTemplateCategoryCode: formKey,
				specificTemplatePlaceholderValue: [
					{
						field: 'tendererName',
						value: this.submission?.tendererName,
					},
					{
						field: 'tendererAddress',
						value:
							this.tenderForm?.tendererAddress &&
								this.tenderForm?.tendererAddress !== 'null'
								? this.tenderForm?.tendererAddress.replace(/,/g, '<br>')
								: 'TENDERER #: ' + this.submission?.entityNumber,
					},
					{
						field: 'deadlineForTenderSubmissionDate',
						value: this.tenderForm?.deadlineForTenderSubmissionDate,
					},
					{
						field: 'deadlineForTenderSubmissionTime',
						value: this.tenderForm?.deadlineForTenderSubmissionTime,
					},
					{
						field: 'tenderDescription',
						value: this.tenderForm?.tenderDescription,
					},
					{
						field: 'tenderNumber',
						value: this.submission?.entityNumber,
					},
					{
						field: 'currency',
						value: this.tenderForm?.tenderCurrency,
					},
					{
						field: 'bidAmountInFigures',
						value: this.settingService.formatNumber(
							this.tenderForm?.bidAmountInFigures,
							0,
							2
						),
					},
					{
						field: 'tenderLotAmountInWords',
						value: this.generalService.numberToWords(
							this.tenderForm?.bidAmountInFigures
						),
					},
					{
						field: 'tenderSubmissionDate',
						value: this.tenderForm.tendererAddress + "," + this.returnDate(this.tenderForm?.deadlineForTenderSubmissionDate),
					},
					{
						field: 'planSubmissionDate',
						// value: day + '/' + month + '/' + year,
						value: this.returnDate(this.tenderForm?.deadlineForTenderSubmissionDate),
					},
					{
						field: 'tendererSignature',
						value: 'TENDERER_SIGNATURE',
					},
					{
						field: 'tendererAuthorizedSignatoryName',
						value: this.submission?.mainSubmission?.powerOfAttorneyFirstName + ' ' +
							this.submission?.mainSubmission?.powerOfAttorneyLastName,
					},
					{
						field: 'tendererTitleOfSignatory',
						value: this.submission?.mainSubmission?.powerOfAttorneyLegalCapacity,
					},
				],
			};
			this.loadingTemplate = true;
			this.htmlTechnical = await this.htmlDocumentService.createSimpleHTMLDocument(
				tendererHTMLDocumentDto
			);
		}
		this.loadingTemplate = false;
	}

	returnDate(date) {
		const dateObject = new Date(date);

		const year = dateObject.getUTCFullYear();
		const month = dateObject.getUTCMonth() + 1; // Month is zero-based, so add 1
		const day = dateObject.getUTCDate();

		// Create a formatted date string in the desired format (e.g., "YYYY-MM-DD")
		const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

		return formattedDate;
	}

	async viewSubmissionFormFinancial(formKey) {

		await this.getTaxSummaryBySubmission();

		const today = new Date();

		const day = today.getDate();
		const month = today.getMonth() + 1;
		const year = today.getFullYear();

		if (this.htmlFinancial == null) {
			const tendererHTMLDocumentDto = {
				procuringEntityUuid: this.procuringEntityUuid,
				nonSTDTemplateCategoryCode: formKey,
				specificTemplatePlaceholderValue: [
					{
						field: 'tendererName',
						value: this.submission?.tendererName,
					},
					{
						field: 'tendererAddress',
						value:
							this.tenderForm?.tendererAddress &&
								this.tenderForm?.tendererAddress !== 'null'
								? this.tenderForm?.tendererAddress.replace(/,/g, '<br>')
								: 'TENDERER #: ' + this.submission?.entityNumber,
					},
					{
						field: 'deadlineForTenderSubmissionDate',
						value: this.returnDate(this.tenderForm?.deadlineForTenderSubmissionDate),
					},
					{
						field: 'deadlineForTenderSubmissionTime',
						value: this.tenderForm?.deadlineForTenderSubmissionTime,
					},
					{
						field: 'tenderDescription',
						value: this.tenderForm?.tenderDescription,
					},
					{
						field: 'tenderNumber',
						value: this.submission?.entityNumber,
					},
					{
						field: 'currency',
						value: this.tenderForm?.tenderCurrency,
					},
					{
						field: 'localTenderTaxesSubmissionAmountInWords',
						value: this.generalService.numberToWords(this.withHoldingTaxLocal),
					},
					{
						field: 'localTendererTaxesSubmissionAmount',
						value: this.settingService.formatNumber(
							this.withHoldingTaxLocal,
							0,
							2
						),
					},
					{
						field: 'bidAmountInFigures',
						value: this.settingService.formatNumber(
							this.tenderForm?.bidAmountInFigures,
							0,
							2
						),
					},
					{
						field: 'tenderLotAmountInWords',
						value: this.generalService.numberToWords(
							this.tenderForm?.bidAmountInFigures
						),
					},
					{
						field: 'planSubmissionDate',
						value: day + '/' + month + '/' + year,
					},
					{
						field: 'tendererAuthorizedSignatoryName',
						value: this.submission?.mainSubmission?.powerOfAttorneyFirstName + ' ' +
							this.submission?.mainSubmission?.powerOfAttorneyLastName,
					},
					{
						field: 'tendererTitleOfSignatory',
						value: this.submission?.mainSubmission?.powerOfAttorneyLegalCapacity,
					},
					{
						field: 'tendererSignature',
						value: 'TENDERER_SIGNATURE',
					},
					{
						field: 'tenderSubmissionCurrency',
						value: this.tenderForm?.tenderCurrency,
					},
					{
						field: 'tenderSubmissionAmount',
						value: this.settingService.formatNumber(
							this.tenderForm?.bidAmountInFigures,
							0,
							2
						),
					},
					{
						field: 'tenderSubmissionAmountInWords',
						value: this.generalService.numberToWords(this.tenderForm?.bidAmountInFigures),
					},

				],
			};
			this.loadingTemplate = true;
			this.htmlFinancial = await this.htmlDocumentService.createSimpleHTMLDocument(
				tendererHTMLDocumentDto
			);
		}
		this.loadingTemplate = false;
	}

	async getHTMLTemplate() {
		const tendererHTMLDocumentDto = {
			procuringEntityUuid: this.procuringEntityUuid,
			nonSTDTemplateCategoryCode: 'TENDER_SUBMISSION_FORM',
			specificTemplatePlaceholderValue: [
				{
					field: 'tendererName',
					value: this.tenderForm.tendererName,
				},
				{
					field: 'tendererAddress',
					value:
						this.tenderForm?.tendererAddress &&
							this.tenderForm?.tendererAddress !== 'null'
							? this.tenderForm?.tendererAddress.replace(/,/g, '<br>')
							: 'TENDERER #: ' + this.tenderForm?.tendererNumber,
				},
				{
					field: 'deadlineForTenderSubmissionDate',
					value: this.tenderForm?.deadlineForTenderSubmissionDate,
				},
				{
					field: 'deadlineForTenderSubmissionTime',
					value: this.tenderForm?.deadlineForTenderSubmissionTime,
				},
				{
					field: 'tenderDescription',
					value: this.tenderForm?.tenderDescription,
				},
				{
					field: 'tenderNumber',
					value: this.tenderForm?.tenderNumber,
				},
				{
					field: 'currency',
					value: this.tenderForm?.tenderCurrency,
				},
				{
					field: 'bidAmountInFigures',
					value: `${this.tenderForm?.bidAmountInFigures}`,
				},
				{
					field: 'tenderLotAmountInWords',
					value: this.generalService.numberToWords(
						this.tenderForm?.bidAmountInFigures
					),
				},
				{
					field: 'tenderSubmissionDate',
					value: this.tenderForm?.tenderSubmissionDate,
				},
				{
					field: 'tendererAuthorizedRepresentative',
					value: this.tenderForm?.tendererAuthorizedRepresentative,
				},
				{
					field: 'singleSignature',
					value: 'POWER_OF_ATTORNEY_SIGNATURE',
				},
				{
					field: 'tendererAuthorizedLegalRepresentativeCapacity',
					value: this.tenderForm?.tendererAuthorizedLegalRepresentativeCapacity,
				},
			],
		};
		this.loadingTemplate = true;
		this.html = await this.htmlDocumentService.createSimpleHTMLDocument(
			tendererHTMLDocumentDto
		);
		this.loadingTemplate = false;
	}

	combineHtml(htmlTechnical: string, htmlFinancial: string): string {
		return htmlTechnical && htmlFinancial
			? `
			   ${htmlFinancial}
				<div style="height: 600px;"></div>
			   ${htmlTechnical}
			`
			: htmlTechnical || htmlFinancial;
	}



	async signSubmissionDocument() {
		if (this.userData?.userTypeEnum === 'DIRECT_MANUFACTURER') {
			await this.completeSubmissionWithoutSigning();
		} else if (this.formListTenderSubmissionForm.length > 0 && (this.htmlTechnical || this.htmlFinancial)) {
			try {
				this.savingData = true;
				this.savingDataMessage = 'Signing tender form, please wait...';
				const title = `Tender form for ${this.tenderForm?.tendererName} on Tender number
       			${this.tenderForm?.tenderNumber} `;
				this.attachmentUid = await this.htmlDocumentService.signHTMLDocument({
					description: title,
					title: title,
					passphrase: this.passphrase,
					htmlDoc: this.combineHtml(this.htmlTechnical, this.htmlFinancial),
					signaturePlaceHolder: 'TENDERER_SIGNATURE',
					user: this.userData,
				});

				const data = await firstValueFrom(this.http
					.post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment/list/`, [
						this.attachmentUid
					]));

				this.settingService.viewFile(data[0].signedDocBase64Attachment, 'pdf').then();

				if (this.attachmentUid) {
					await this.completeSubmissionWithForm();
					this.savingData = false;
				} else {
					this.savingData = false;
					this.showConfirm = true;
				}
			} catch (e) {
				console.error(e);
			}
		} else {
			try {
				this.savingData = true;
				this.savingDataMessage = 'Signing tender form, please wait...';
				const title = `Tender form for ${this.tenderForm?.tendererName} on Tender number
       			${this.tenderForm?.tenderNumber} `;
				this.attachmentUid = await this.htmlDocumentService.signHTMLDocument({
					description: title,
					title: title,
					passphrase: this.passphrase,
					htmlDoc: this.html,
					signaturePlaceHolder: 'POWER_OF_ATTORNEY_SIGNATURE',
					user: this.userData,
				});

				if (this.attachmentUid) {
					await this.completeSubmissionWithForm();
					this.savingData = false;
				} else {
					this.savingData = false;
					this.showConfirm = true;
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	async completeSubmissionWithForm() {
		try {
			this.savingData = true;
			this.savingDataMessage =
				'Submitting your bid information, please wait...';
			const response = await this.apollo.mutate({
				mutation: COMPLETE_SUBMISSION_WITH_FORM,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					bidSubmissionDTO: {
						signedTenderFormUuid: this.attachmentUid,
						submissionUuid: this.submissionUuid,
					},
				},
			});
			if (response.data.completeSubmissionWithForm.code == 9000) {
				this.notificationService.successMessage(
					'Congratulations your Bid is submitted Successfully.'
				);
				this.closeModal(true);
			} else {
				console.error(response.data);
				this.notificationService.errorMessage(
					'Failed to submit bid, Please try again'
				);
			}

			this.savingData = false;
		} catch (e) {
			console.error(e);
			this.savingData = false;
			this.notificationService.errorMessage(
				'Failed to submit bid, Please try again'
			);
		}
	}
	async completeSubmissionWithoutSigning() {
		try {
			this.savingData = true;
			this.savingDataMessage =
				'Submitting your bid information, please wait...';
			const response = await this.apollo.mutate({
				mutation: COMPLETE_SUBMISSION_WITH_FORM,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					bidSubmissionDTO: {
						signedTenderFormUuid: this.submissionUuid,
						submissionUuid: this.submissionUuid,
					},
				},
			});
			if (response.data.completeSubmissionWithForm.code == 9000) {
				this.notificationService.successMessage(
					'Congratulations your Bid is submitted Successfully.'
				);
				this.closeModal(true);
			} else {
				console.error(response.data);
				this.notificationService.errorMessage(
					'Failed to submit bid, Please try again'
				);
			}
			this.savingData = false;
		} catch (e) {
			console.error(e);
			this.savingData = false;
			this.notificationService.errorMessage(
				'Failed to submit bid, Please try again'
			);
		}
	}

	closeModal(close?: boolean): void {
		this.dialogRef.dismiss(close);
	}

	setOfficeLocation(event) {
		this.useOfficeLocation = false;
		if (event.useOfficeLocation && event.officeLocation) {
			this.tenderForm.tendererAddress = event.officeLocation;
		} else {
			this.tenderForm.tendererAddress =
				this.tenderForm?.tendererAddress &&
					this.tenderForm?.tendererAddress !== 'null'
					? this.tenderForm?.tendererAddress.replace(/,/g, '<br>')
					: 'TENDERER #: ' + this.tenderForm?.tendererNumber;
		}


		if (this.formListTenderSubmissionForm.length == 0) {
			this.getTenderForm().then(async (_) => {
				await this.getHTMLTemplate();
			});
		} else {
			this.getTenderForm();
		}

	}

	async getTaxSummaryBySubmission() {
		this.loading = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_TAX_SUMMARY_BY_SUBMISSION,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					submissionUuid: this.submissionUuid,
				},
			});
			// console.log("money :", response.data.getTaxSummaryBySubmission);
			if (response.data.getTaxSummaryBySubmission.code === 9000) {
				const data = response.data.getTaxSummaryBySubmission.data;
				this.withHoldingTaxLocal = data.valueAddedTax;
			}

			this.loading = false;
		} catch (e) {
			console.error(e);
			this.loading = false;
		}
	}

	capitalizeWords(str) {
		return str
			.toLowerCase()
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
}
