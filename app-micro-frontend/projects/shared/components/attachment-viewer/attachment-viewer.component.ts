import { AttachmentService } from '../../../services/attachment.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
	DigitalSignatureDialogData,
	DigitalSignatureDocumentData,
	DigitalSignatureInputComponent,
	DigitalSignatureSignResponse,
} from './digital-signature-input/digital-signature-input.component';
import { HtmlViewerComponent } from './html-viewer/html-viewer.component';
import { Observable, Subject, first, firstValueFrom, map } from 'rxjs';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { HttpClient } from '@angular/common/http';
import { Store, on, select } from '@ngrx/store';
import { NotificationService } from '../../../services/notification.service';
import { SettingsService } from '../../../services/settings.service';
import { ApplicationState } from 'src/app/store';
import { environment } from 'src/environments/environment';
import { selectModifiedAuthUsers } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

export interface AttachmentView {
	type: 'HTML' | 'PDF';
	documentUuid?: string;
	title: string;
	description?: string;
	signedDocumentUuid?: string;
	digitalSignatureDocumentData?: DigitalSignatureDocumentData;
}

export enum AcceptedFileType {
	PDF = 'PDF',
	IMAGE = 'IMAGE',
}

export interface DSMSModelData {
	model: string;
	modelId: number;
	modelUuid: string;
	subModule: string;
	title: string;
	description: string;
}

@Component({
	selector: 'app-attachment-viewer',
	templateUrl: './attachment-viewer.component.html',
	standalone: true,
	imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule],
})
export class AttachmentViewerComponent implements OnInit {
	@Input() attachment: AttachmentView;
	@Input() singButtonText = 'Sign';
	@Input() previewButtonText = 'Preview';
	@Input() viewButtonText = 'View';
	@Input() showSignButton = false;
	@Input() autoSign = false;
	@Input() showPreviewButton = false;
	@Input() showViewDocumentButton = false;
	@Input() uploadMode = false;
	@Input() signAfterUpload = false;
	@Input() allowDelete = false;
	@Input() allowHTMLDocSignAgain = false;
	@Input() hideUnsignedDocumentAfterSigning = false;
	@Input() acceptedFileTypes: AcceptedFileType[] = [
		AcceptedFileType.PDF,
		AcceptedFileType.IMAGE,
	];
	@Output() onAttachmentSigned: EventEmitter<AttachmentView> =
		new EventEmitter<AttachmentView>();

	@Output() onAttachmentUploaded: EventEmitter<AttachmentView> =
		new EventEmitter<AttachmentView>();

	@Output() onAttachmentDeleted: EventEmitter<AttachmentView> =
		new EventEmitter<AttachmentView>();

	@Input() attachmentDSMSData: DSMSModelData;

	uploading = false;
	deleting = false;
	hasError = false;

	fileUploadedName?: string;
	attachmentKey?: string;
	selectedFile?: string | ArrayBuffer;
	uploadedImage: any;
	accept?: string;
	showPhoto = false;
	fileFormat: any;
	uploadedFiles: Array<any> = [];
	uploadedFile: any = null;
	fileSizeUnit: number = 1024;
	inputValue: string;
	user$: Observable<AuthUser>;
	user: AuthUser;

	_hideUnsignedDocumentAfterSigning = false;

	constructor(
		private dialog: MatDialog,
		private http: HttpClient,
		private settingService: SettingsService,
		private attachmentService: AttachmentService,
		private notificationService: NotificationService,
		private store: Store<ApplicationState>,
	) {
		this.user$ = this.store.pipe(
			select(selectModifiedAuthUsers),
			map((users) => users[0]),
		);
	}

	ngOnInit(): void {
		firstValueFrom(this.user$.pipe(first((i) => !!i))).then(
			(data) => (this.user = data),
		);
		this.setAcceptedFileTypes();
	}

	setAcceptedFileTypes() {
		this.accept = '';
		if (this.acceptedFileTypes.includes(AcceptedFileType.IMAGE)) {
			this.accept += 'image/*';
		}
		if (this.acceptedFileTypes.includes(AcceptedFileType.PDF)) {
			this.accept += ',application/pdf';
		}
	}

	onPreview() {
		if (this.attachment.digitalSignatureDocumentData) {
			this.attachmentService.signAttachment(
				{
					showDocumentPreview: true,
					documentTitle: this.attachment.title,
					type: this.attachment.type,
					digitalSignatureData: this.attachment.digitalSignatureDocumentData,
					previewOnly: true,
				},
				(res: DigitalSignatureSignResponse) => {},
			);
		} else {
			this.attachmentService.fetchAttachment(
				this.attachment.documentUuid,
				'pdf',
			);
		}
	}

	onViewDocument() {
		console.log('onViewDocument', this.attachment);
		if (this.attachment.signedDocumentUuid) {
			this.attachmentService.fetchSignedAttachment(
				this.attachment.signedDocumentUuid,
			);
		} else {
			this.attachmentService.fetchAttachment(
				this.attachment.documentUuid,
				'pdf',
			);
		}
	}

	uploadAttachment() {}

	onSign() {
		let digitalSignatureDialogData: DigitalSignatureDialogData = {
			showDocumentPreview: true,
			documentTitle: this.attachment.title,
			type: this.attachment.type,
			previewOnly: false,
			digitalSignatureData: undefined,
		};

		if (this.attachment.type === 'HTML') {
			digitalSignatureDialogData.digitalSignatureData = {
				signaturePlaceHolder:
					this.attachment.digitalSignatureDocumentData.signaturePlaceHolder,
				procuringEntityUuid:
					this.attachment.digitalSignatureDocumentData?.procuringEntityUuid,
				htmlData: {
					templateCode:
						this.attachment.digitalSignatureDocumentData.htmlData.templateCode,
					specificTemplatePlaceholderValues:
						this.attachment.digitalSignatureDocumentData.htmlData
							.specificTemplatePlaceholderValues,
				},
			};
		} else {
			digitalSignatureDialogData.digitalSignatureData = {
				signaturePlaceHolder:
					this.attachment.digitalSignatureDocumentData.signaturePlaceHolder,
				procuringEntityUuid:
					this.attachment.digitalSignatureDocumentData?.procuringEntityUuid,
				pdfData: {
					pdfUuid: this.attachment.documentUuid,
				},
			};
		}

		this.attachmentService.signAttachment(
			digitalSignatureDialogData,
			(res: DigitalSignatureSignResponse) => {
				if (res?.success) {
					this.attachment.signedDocumentUuid = res.data.signedDocumentUuid;
					this.onAttachmentSigned.emit(this.attachment);
					if (this.hideUnsignedDocumentAfterSigning) {
						this._hideUnsignedDocumentAfterSigning = true;
					}
				} else {
					if (this.signAfterUpload) {
						this.deleteAttachment();
					}
				}
			},
		);
	}

	async onFileSelected(event: any) {
		let files: any[] = event?.target?.files || [];
		await this.handleUpload(files);
	}

	getFileSize(fileSize: number): number {
		if (fileSize > 0) {
			if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
				fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
			} else if (
				fileSize <
				this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
			) {
				fileSize = parseFloat(
					(fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2),
				);
			}
		}
		return fileSize;
	}

	getFileSizeUnit(fileSize: number) {
		let fileSizeInWords = 'bytes';

		if (fileSize > 0) {
			if (fileSize < this.fileSizeUnit) {
				fileSizeInWords = 'bytes';
			} else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
				fileSizeInWords = 'KB';
			} else if (
				fileSize <
				this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
			) {
				fileSizeInWords = 'MB';
			}
		}
		return fileSizeInWords;
	}

	async handleUpload(files) {
		const file = files[0];

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = async (event: any) => {
			//verify file type, check if it is in this.accept
			if (!this.accept.includes(file.type)) {
				this.notificationService.errorMessage(
					'Please upload files of type ' + this.accept,
				);
				return;
			}

			this.uploadedFile = {
				fileName: file.name,
				fileSize:
					this.getFileSize(file.size) + ' ' + this.getFileSizeUnit(file.size),
				fileType: file.type,
				isImage:
					file.type.includes('image') ||
					file.type.includes('png') ||
					file.type.includes('jpg') ||
					file.type.includes('jpeg'),
				fileUrl: event.target.result,
				fileProgressSize: 0,
				fileProgress: 0,
				ngUnsubscribe: new Subject<any>(),
			};

			if (this.uploadedFile) {
				await this.uploadDocument(this.uploadedFile);
			}
		};

		// this.setSampleAttachmentValue();
	}

	async uploadDocument(selectedFile) {
		try {
			this.uploading = true;
			const attachData = await firstValueFrom(
				this.http.post<any>(
					environment.AUTH_URL + `/nest-dsms/api/attachment`,
					[
						{
							createdByUuid: this.user.uuid,
							title: this.attachmentDSMSData.title,
							description: this.attachmentDSMSData.description,
							model: this.attachmentDSMSData.description,
							subModule: this.attachmentDSMSData.subModule,
							modelId: this.attachmentDSMSData.modelId,
							modelUuid: this.settingService.makeId(),
							base64Attachment: selectedFile?.fileUrl.split(',')[1],
						},
					],
				),
			);

			this.uploading = false;
			if (attachData.message === 'ERROR') {
				this.uploadedFile = null;
				this.notificationService.errorMessage(
					'Failed to upload sample document. Please try again',
				);
			} else {
				this._hideUnsignedDocumentAfterSigning = false;
				this.attachment.documentUuid = attachData.data[0].uuid;

				if (this.onAttachmentUploaded) {
					this.onAttachmentUploaded.emit(this.attachment);
				}
				if (this.signAfterUpload) {
					this.onSign();
				}
			}
		} catch (e) {
			console.error(e);
			this.uploading = false;
			this.uploadedFile = null;
			this.notificationService.errorMessage(
				'Failed to upload sample document. Please try again',
			);
		}
	}

	processFiles(files) {
		for (const file of files) {
			const reader = new FileReader();
			reader?.readAsDataURL(file); // read file as data url
			reader.onloadend = (event: any) => {
				// called once readAsDataURL is completed

				this.uploadedFiles.push({
					fileName: file.name,
					fileSize:
						this.getFileSize(file.size) + ' ' + this.getFileSizeUnit(file.size),
					fileType: file.type,
					isImage:
						file.type.includes('image') ||
						file.type.includes('png') ||
						file.type.includes('jpg') ||
						file.type.includes('jpeg'),
					fileUrl: event.target.result,
					fileProgressSize: 0,
					fileProgress: 0,
					ngUnsubscribe: new Subject<any>(),
				});
			};
		}
	}

	fieldChange(event) {
		this.inputValue = event.target.value;
	}

	async deleteAttachment() {
		try {
			this.deleting = true;

			let toDelete = [];
			toDelete.push(this.attachment.documentUuid);

			if (this.attachment.signedDocumentUuid) {
				toDelete.push(this.attachment.signedDocumentUuid);
			}

			const response = await this.attachmentService.deleteAttachmentDocuments(
				toDelete,
			);
			if (response === 'SUCCESS') {
				this.attachment.documentUuid = null;
				this.attachment.signedDocumentUuid = null;
				this.uploadedFile = null;
				this.attachment.documentUuid = null;
				this.attachment.signedDocumentUuid = null;
				this.notificationService.successMessage(
					'Document deleted successfully',
				);
				if (this.onAttachmentDeleted) {
					this.onAttachmentDeleted.emit(this.attachment);
				}
			} else {
				this.notificationService.errorMessage(
					'Problem occurred while deleting document, please try again',
				);
			}
			this.deleting = false;
		} catch (e) {
			console.error(e);
			this.deleting = false;
			this.notificationService.errorMessage(
				'Problem occurred while deleting document, please try again',
			);
		}
	}
}
