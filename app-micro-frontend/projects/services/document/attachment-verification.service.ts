import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AttachmentService } from '../attachment.service';
import { badAttachemnt } from './sample-bad-attachemnt';
import { goodAttachemnt } from './sample-good-attachemnt';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AttachmentVerificationResponse {
	isValid: boolean;
	message: string;
}

@Injectable({
	providedIn: 'root',
})
export class AttachmentVerificationService {
	sample_bad_base64 = badAttachemnt;
	sample_good_base64 = goodAttachemnt;

	isVerifyingAttachment = signal<boolean>(false);
	attachmentVerificationResponse = signal<AttachmentVerificationResponse>(null);

	constructor(
		private http: HttpClient,
		public attachmentService: AttachmentService
	) {}

	ngOnInit() {
		this.isVerifyingAttachment.set(false);
		this.attachmentVerificationResponse.set(null);
	}

	test() {
		if (this.isBase64Pdf(this.sample_good_base64)) {
			console.log('Valid Base64 PDF');
		} else {
			console.log('Invalid Base64 PDF');
		}
	}

	isValidBase64(base64String: string) {
		if (base64String === null || base64String === undefined) {
			return false;
		}
		if (base64String.length % 4 !== 0) {
			return false;
		}
		const invalidCharacters = /[^A-Za-z0-9+/=]/g;
		if (invalidCharacters.test(base64String)) {
			return false;
		}
		const firstPaddingChar = base64String.indexOf('=');
		if (firstPaddingChar !== -1 && firstPaddingChar < base64String.length - 2) {
			return false;
		}

		try {
			const decoded = atob(base64String);
			const base64 = btoa(decoded);
			return base64 === base64String;
		} catch (e) {
			return false;
		}
	}

	isBase64Pdf(str: string): boolean {
		if (!this.isValidBase64(str)) {
			return false;
		}

		try {
			const decoded = atob(str);
			const pdfHeader = decoded.slice(0, 5);
			if (pdfHeader !== '%PDF-') {
				return false;
			}
		} catch (error) {
			return false;
		}

		return true;
	}

	async verifyAttachmentByUuid(
		documentUuid: string,
		documentType: 'signed' | 'unsigned' | 'all' = 'signed'
	): Promise<AttachmentVerificationResponse> {
		this.isVerifyingAttachment.set(true);
		this.attachmentVerificationResponse.set(null);
		let response: AttachmentVerificationResponse;

		try {
			const data = await firstValueFrom(
				this.http.post<any>(
					environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
					[documentUuid]
				)
			);

			let signedAttachment = data[0].signedDocBase64Attachment;
			let unsignedAttachment = data[0].base64Attachment;

			if (documentType === 'signed') {
				if (this.isBase64Pdf(signedAttachment)) {
					response = { isValid: true, message: ' Valid signed document' };
				} else {
					response = {
						isValid: false,
						message: 'Invalid signed attachment, please try again',
					};
				}
			} else if (documentType === 'unsigned') {
				if (this.isBase64Pdf(unsignedAttachment)) {
					response = { isValid: true, message: ' Valid unsigned document' };
				} else {
					response = {
						isValid: false,
						message: 'Invalid unsigned attachment, please try again',
					};
				}
			} else {
				let isValidSigned = this.isBase64Pdf(signedAttachment);
				let isValidUnsigned = this.isBase64Pdf(unsignedAttachment);
				if (isValidSigned && isValidUnsigned) {
					response = {
						isValid: true,
						message: 'Valid signed and unsigned document',
					};
				} else if (!isValidSigned) {
					response = {
						isValid: false,
						message: 'Invalid unsigned attachment, please try again',
					};
				} else if (!isValidUnsigned) {
					response = {
						isValid: false,
						message: 'Invalid signed attachment, please try again',
					};
				}
			}
		} catch (e) {
			console.error(e);
			response = {
				isValid: false,
				message: ' Failed to verify attachment, please try again',
			};
		}
		this.isVerifyingAttachment.set(false);
		this.attachmentVerificationResponse.set(response);

		return response;
	}
}
