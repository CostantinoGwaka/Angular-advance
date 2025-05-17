import {
	Component,
	ElementRef,
	Inject,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	Validators,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialogModule,
} from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { map, firstValueFrom, Observable, first } from 'rxjs';
import { GraphqlService } from '../../../../services/graphql.service';
import { HTMLDocumentService } from '../../../../services/html-document.service';
import { NotificationService } from '../../../../services/notification.service';
import { ApplicationState } from 'src/app/store';
import {
	selectAllAuthUsers,
	selectModifiedAuthUsers,
} from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { DocumentCreatorService } from '../../../../services/document/document-creator.service';
import { LoaderComponent } from '../../loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HtmlViewerContentComponent } from '../html-viewer/html-viewer-content/html-viewer-content.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgTemplateOutlet } from '@angular/common';
import { ModalHeaderComponent } from '../../modal-header/modal-header.component';

export interface SpecificTemplatePlaceholderValue {
	field: String;
	value: String | String[] | { [key: string]: any } | { [key: string]: any }[];
}

export interface PDFPlaceholderValuePair {
	placeholder: string;
	value: string;
}

export interface DigitalSignatureDocumentData {
	signaturePlaceHolder: string;
	pdfData?: {
		pdfUuid?: string;
		pdfPlaceholderValuePair?: PDFPlaceholderValuePair[];
	};
	htmlData?: {
		templateCode?: string;
		specificTemplatePlaceholderValues?: SpecificTemplatePlaceholderValue[];
	};
	procuringEntityUuid?: string;
}
export interface DigitalSignatureDialogData {
	showDocumentPreview?: boolean;
	documentTitle: string;
	type: 'HTML' | 'PDF';
	previewOnly: boolean;
	digitalSignatureData: DigitalSignatureDocumentData;
}

export interface DigitalSignatureSignResponse {
	success: boolean;
	message: string;
	data?: {
		signedDocumentUuid: string;
		unSignedDocumentUuid?: string;
		generatedHTML?: string;
	};
}

@Component({
	selector: 'app-digital-signature-input',
	templateUrl: './digital-signature-input.component.html',
	standalone: true,
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		NgTemplateOutlet,
		HtmlViewerContentComponent,
		MatProgressSpinnerModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		LoaderComponent,
		ModalHeaderComponent,
	],
})
export class DigitalSignatureInputComponent implements OnInit {
	showPasswordInput = false;

	form: UntypedFormGroup;

	isLoading: boolean;

	errorMessage: string = null;

	showDocumentPreview: boolean = false;
	documentLoaded: boolean = false;
	loadingDocument: boolean = false;

	user$: Observable<AuthUser>;
	user: AuthUser;

	data: DigitalSignatureDialogData;

	populatingData: boolean = false;
	creatingPDF: boolean = false;
	signingDocument: boolean = false;
	fetchingDocument: boolean = false;
	showPDFDocument: boolean = false;
	showHTMLDocument: boolean = false;
	htmlData: string;
	canSign: boolean = false;

	loadedPDFDocumentBase64: string;

	@ViewChild('iframeContainer') iframeContainer: ElementRef;

	constructor(
		private fb: UntypedFormBuilder,
		private apollo: GraphqlService,
		private notificationService: NotificationService,
		private htmlDocumentService: HTMLDocumentService,
		private attachmentService: AttachmentService,
		private store: Store<ApplicationState>,
		private renderer: Renderer2,
		@Inject(MAT_DIALOG_DATA)
		public _data: DigitalSignatureDialogData,
		private dialogRef: MatDialogRef<DigitalSignatureInputComponent>,
		private documentCreatorService: DocumentCreatorService,
	) {
		this.data = _data;

		this.user$ = this.store.pipe(
			select(selectModifiedAuthUsers),
			map((users) => users[0] as AuthUser),
		);
	}

	ngOnInit(): void {
		this.init();
	}

	async init() {
		this.user = await firstValueFrom(
			this.user$.pipe(
				first((i) => !!i && (!!i.procuringEntity || !!i.tenderer)),
			),
		);

		try {
			this.form = this.fb.group({
				keyPhrase: [null, [Validators.required]],
			});
			setTimeout(() => {
				this.showPasswordInput = true;
			}, 500);
		} catch (e) {}

		this.setFile();
	}

	setFile() {
		this.errorMessage = null;
		switch (this.data.type) {
			case 'PDF':
				this.fetchBase64PDFByUuid();
				break;

			case 'HTML':
				this.populateHTML();
				break;
		}
	}

	async fetchBase64PDFByUuid() {
		this.showHTMLDocument = false;
		this.showPDFDocument = false;
		this.fetchingDocument = true;
		if (this.data?.digitalSignatureData) {
			if (this.data.digitalSignatureData?.pdfData?.pdfUuid) {
				this.loadedPDFDocumentBase64 =
					await this.attachmentService.fetchAttachmentBase64(
						this.data.digitalSignatureData.pdfData.pdfUuid,
					);

				if (!this.loadedPDFDocumentBase64) {
					this.errorMessage = 'No PDF document found';
					return;
				}

				this.showPDFDocument = true;
				this.loadBase64PDF(this.loadedPDFDocumentBase64);
			} else {
				this.errorMessage = 'No PDF document found';
				this.notificationService.showErrorDialog({
					message: 'The contract has no document to sign, please contact PPRA',
				});
				this.dialogRef.close({
					success: false,
					message: 'Document signing cancelled',
				});
			}
		} else {
			this.showPDFDocument = true;
		}

		this.fetchingDocument = false;
	}

	async populateHTML() {
		this.errorMessage = null;
		this.canSign = false;
		this.showHTMLDocument = false;
		this.showPDFDocument = false;

		let templateCode = this.data.digitalSignatureData.htmlData.templateCode;

		// let template = await this.documentCreatorService.getPublishedTemplateByCode(
		//   templateCode
		// );

		// if (!template) {
		//   this.canSign = false;
		//   this.errorMessage = `No template found for this document (${templateCode}). Please contact PPRA for assistance.`;
		//   return;
		// }

		this.populatingData = true;
		let results = await this.htmlDocumentService.createSimpleHTMLDocument({
			procuringEntityUuid:
				this.data?.digitalSignatureData?.procuringEntityUuid ??
				this.user?.procuringEntity?.uuid,
			nonSTDTemplateCategoryCode: templateCode,
			specificTemplatePlaceholderValue:
				this.data.digitalSignatureData.htmlData
					.specificTemplatePlaceholderValues,
		});

		if (!results) {
			this.notificationService.showErrorDialog({
				message: `Error in ${templateCode} template. Please contact PPRA for assistance.`,
			});
			this.dialogRef.close({
				success: false,
				message: 'Document signing cancelled',
			});
			return;
		}

		this.htmlData = results;
		this.populatingData = false;
		this.canSign = true;
		this.showHTMLDocument = true;
	}

	async onSign() {
		this.errorMessage = null;
		this.isLoading = true;
		this.signingDocument = false;
		const userData = await firstValueFrom(
			this.store.pipe(
				select(selectAllAuthUsers),
				map((i) => i[0]),
			),
		);

		let signedDocumentUuid = null;

		this.signingDocument = true;

		if (this.data.type === 'HTML') {
			signedDocumentUuid = await this.htmlDocumentService.signHTMLDocument({
				passphrase: this.form.get('keyPhrase').value,
				htmlDoc: this.htmlData,
				signaturePlaceHolder:
					this.data.digitalSignatureData.signaturePlaceHolder,
				title: this.data.documentTitle,
				description: this.data.documentTitle,
				user: userData,
			});
		}

		//placeholderDataList

		if (this._data.type === 'PDF') {
			const response =
				await this.htmlDocumentService.signPDFWithPlaceholdersDocument({
					passphrase: this.form.get('keyPhrase').value,
					fileUuid: this.data.digitalSignatureData.pdfData.pdfUuid,
					signaturePlaceHolder:
						this.data.digitalSignatureData.signaturePlaceHolder,
					user: userData,
					location: 'contract-signing',
					placeholderDataList:
						this.data.digitalSignatureData.pdfData.pdfPlaceholderValuePair,
				});

			if (response.message == 'SUCCESS') {
				signedDocumentUuid = response.data?.uuid;
				const signedDocument = await this.attachmentService.getSignedAttachment(
					signedDocumentUuid,
					true,
				);

				signedDocumentUuid = response.data?.uuid;
				this.loadBase64PDF(signedDocument.signedDocBase64Attachment);
				this.data = {
					...this.data,
					previewOnly: true,
				};
			} else {
				this.errorMessage = 'Document signing failed, please try again';
				this.notificationService.errorMessage(this.errorMessage);

				this.isLoading = false;
				return;
			}
		}

		this.signingDocument = false;

		if (signedDocumentUuid) {
			this.dialogRef.close({
				success: true,
				message: 'Document signed successfully',
				data: {
					signedDocumentUuid,
				},
			});
		} else {
			this.errorMessage =
				'Document signing failed, please make sure your passphrase is correct';
			this.notificationService.errorMessage(this.errorMessage);
		}
		this.isLoading = false;
	}

	close() {
		this.dialogRef.close({
			success: false,
			message: 'Document signing cancelled',
		});
	}

	loadBase64PDF(base64String: string): void {
		this.showPDFDocument = true;

		const byteCharacters = atob(base64String);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512);
			const byteNumbers = new Array(slice.length);

			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);

		const iframe = document.createElement('iframe');
		iframe.src = url;
		iframe.style.width = '100%';
		iframe.style.height = '100%';

		setTimeout(() => {
			const container = document.getElementById('pdf-container');
			container.innerHTML = '';
			container.appendChild(iframe);
			iframe.addEventListener('load', () => {
				iframe.contentWindow.onbeforeunload = function () {
					return false;
				};
			});
			if (base64String) {
				this.canSign = true;
			}
		}, 500);
	}

	onDocumentPreview() {}
}
