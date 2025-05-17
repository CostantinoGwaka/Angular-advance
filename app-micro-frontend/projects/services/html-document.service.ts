import { AttachmentVerificationService } from './document/attachment-verification.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser } from '../modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { GraphqlOperationService } from './graph-operation.service';
import { SettingsService } from './settings.service';
import { NotificationService } from './notification.service';
import { ApolloNamespace } from '../apollo.config';
import { GraphqlService } from './graphql.service';
import { CREATE_SIMPLE_HTML_DOCUMENT } from '../modules/templates-editor/store/template-editor.graphql';

export interface SimpleHTMLDocumentDto {
	procuringEntityUuid: String;
	nonSTDTemplateCategoryCode: String;
	specificTemplatePlaceholderValue: {
		field: String;
		value:
			| String
			| String[]
			| { [key: string]: any }
			| { [key: string]: any }[];
	}[];
}

@Injectable({
	providedIn: 'root',
})
export class HTMLDocumentService {
	constructor(
		private graphqlOperationService: GraphqlOperationService,
		private graphqlService: GraphqlService,
		private http: HttpClient,
		private settingsService: SettingsService,
		private notificationService: NotificationService,
		private attachmentVerificationService: AttachmentVerificationService
	) {}

	async createSimpleHTMLDocument(simpleHTMLDocumentDto: SimpleHTMLDocumentDto) {

		try {
			const response = await this.graphqlService.mutate({
				apolloNamespace: ApolloNamespace.template,
				mutation: CREATE_SIMPLE_HTML_DOCUMENT,
				variables: {
						simpleHTMLDocumentDto : simpleHTMLDocumentDto
				},
			});

			if (response.data?.createSimpleHTMLDocument?.code === 9000) {
				return response.data?.createSimpleHTMLDocument.data?.documentSections[0]?.htmlText
			} else {
				this.notificationService.errorMessage(response.data?.createSimpleHTMLDocument?.message);
				return null
			}
		} catch (error) {
			this.notificationService.errorMessage('Error occurred, while getting template, operation failed');
			return null
		}

		// return await lastValueFrom(
		// 	this.graphqlOperationService
		// 		.mutate({
		// 			apolloNamespace: ApolloNamespace.template,
		// 			hideSuccessNotifications: true,
		// 			graphName: 'createSimpleHTMLDocument',
		// 			responseFields: 'documentSections { htmlText } documentUuid',
		// 			inputs: [
		// 				{
		// 					simpleHTMLDocumentDto,
		// 					inputType: 'SimpleHTMLDocumentDtoInput',
		// 				},
		// 			],
		// 		})
		// 		.pipe(map((res) => res?.data?.documentSections[0]?.htmlText))
		// );
	}

	async createSimpleHTMLDocumentMultipleSection(
		simpleHTMLDocumentDto: SimpleHTMLDocumentDto
	) {
		try {
			const response = await this.graphqlService.mutate({
				apolloNamespace: ApolloNamespace.template,
				mutation: CREATE_SIMPLE_HTML_DOCUMENT,
				variables: {
					simpleHTMLDocumentDto : simpleHTMLDocumentDto
				},
			});

			if (response.data?.createSimpleHTMLDocument?.code === 9000) {
				return response.data?.createSimpleHTMLDocument.data?.documentSections
			} else {
				this.notificationService.errorMessage(response.data?.createSimpleHTMLDocument?.message);
				return null
			}
		} catch (error) {
			this.notificationService.errorMessage('Error occurred, while getting template, operation failed');
			return null
		}

		// const res = await lastValueFrom(
		// 	this.graphqlOperationService.mutate({
		// 		apolloNamespace: ApolloNamespace.template,
		// 		hideSuccessNotifications: true,
		// 		graphName: 'createSimpleHTMLDocument',
		// 		responseFields: 'documentSections { htmlText } documentUuid',
		// 		inputs: [
		// 			{
		// 				simpleHTMLDocumentDto,
		// 				inputType: 'SimpleHTMLDocumentDtoInput',
		// 			},
		// 		],
		// 	})
		// );
		// return res?.data?.documentSections;
	}

	encodeHTML(s) {
		return s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/"/g, '&quot;');
	}

	htmlToBase64(htmlString: string): string {
		// Parse HTML string to DOM document
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');

		// Get the outerHTML of the document
		const modifiedHtmlString = doc.documentElement.outerHTML;

		// Encode the HTML string to base64
		return btoa(unescape(encodeURIComponent(modifiedHtmlString)));
	}

	async signHTMLDocument(parameter: {
		htmlDoc: string;
		description: string;
		signaturePlaceHolder: string;
		passphrase: string;
		title: string;
		user: AuthUser;
	}) {
		try {
			const base64html = this.htmlToBase64(parameter.htmlDoc);
			const response = await firstValueFrom(
				this.http.post<any>(
					environment.AUTH_URL +
						`/nest-dsms/api/attachment/create/sign/pdf/fromhtml`,
					{
						userId: parameter.user.uuid,
						reason: 'Security',
						location: 'Iringa',
						contactinfo: parameter.user.phone,
						passphrase: parameter.passphrase,
						signaturePlaceHolder: parameter.signaturePlaceHolder,
						attachmentDetail: {
							createdByUuid: parameter.user.uuid,
							description: parameter.description,
							title: parameter.title,
							model: 'HTML',
							modelId: 10,
							modelUuid: this.settingsService.makeId(),
							subModule: 'HTML',
							encrypt: true,
						},
						base64html,
					}
				)
			);

			if (response.length > 0) {
				const verificationResponse =
					await this.attachmentVerificationService.verifyAttachmentByUuid(
						response[0]?.uuid
					);
				if (verificationResponse.isValid) {
					return response[0]?.uuid;
				} else {
					this.notificationService.showErrorDialog({
						message: verificationResponse.message,
					});
					return null;
				}
			} else {
				this.notificationService.showErrorDialog({
					message:
						'Failed to sign document, please make sure your key phrase is correct and try to sign again.',
				});
			}
			return null;
		} catch (e) {
			console.error(e);

			this.notificationService.errorMessage(
				'Failed to sign document ' + e.message
			);
			return null;
		}
	}

	async signedAttachmentRequest(parameter: {
		htmlDoc: string;
		description: string;
		passphrase: string;
		title: string;
		user: AuthUser;
	}) {
		try {
			const response = await firstValueFrom(
				this.http.post<any>(
					environment.AUTH_URL + `/nest-dsms/api/attachment`,
					[
						{
							createdByUuid: parameter.user.uuid,
							title: parameter.title,
							description: parameter.description,
							passphrase: parameter.passphrase,
							model: 'HTML',
							modelId: 10,
							modelUuid: this.settingsService.makeId(),
							subModule: 'HTML',
							base64Attachment: parameter.htmlDoc,
							encrypt: true,
						},
					]
				)
			);
			if (response.data.length > 0) {
				return response.data[0]?.uuid;
			}
			return null;

			// this.settingService.viewFile(dataReturned[0].signedDocBase64Attachment, 'pdf');
		} catch (e) {
			console.error(e);

			this.notificationService.errorMessage(
				'Failed to sign document ' + e.message
			);
			return null;
		}
	}

	async createSavePdfFromHtml(parameter: {
		html: string;
		description: string;
		title: string;
		user: AuthUser;
	}) {
		try {
			const base64html = this.htmlToBase64(parameter.html);
			const attachmentDto = {
				createdByUuid: parameter.user.uuid,
				title: parameter.title,
				description: parameter.description,
				model: 'HTML',
				modelId: 10,
				modelUuid: this.settingsService.makeId(),
				subModule: 'HTML',
				base64Attachment: base64html,
				encrypt: true,
			};


			const response = await firstValueFrom(
				this.http.post<any>(
					environment.AUTH_URL +
						`/nest-dsms/api/attachment/create/save/pdf/fromhtml`,attachmentDto
				)
			);
			if (response.data.length > 0) {
				return response.data[0]?.uuid;
			}
			return null;
		} catch (e) {
			console.error(e);

			this.notificationService.errorMessage(
				'Failed to sign document ' + e.message
			);
			return null;
		}
	}

	async signPDFDocument(parameter: {
		DocUuid: string;
		signaturePlaceHolder: string;
		passphrase: string;
		user: AuthUser;
	}) {
		try {
			const response = await firstValueFrom(
				this.http.post<any>(
					environment.AUTH_URL + `/nest-dsms/api/signature/sign-doc`,
					{
						userId: parameter.user.uuid,
						fileUid: parameter.DocUuid,
						reason: 'Security',
						location: 'Iringa',
						contactinfo: parameter.user.phone,
						passphrase: parameter.passphrase,
						signaturePlaceHolder: parameter.signaturePlaceHolder,
					}
				)
			);
			if (response) {
				return response;
			}
			return null;

			// this.settingService.viewFile(dataReturned[0].signedDocBase64Attachment, 'pdf');
		} catch (e) {
			console.error(e);

			this.notificationService.errorMessage(
				'Failed to sign document ' + e.message
			);
			return null;
		}
	}

	async signPDFWithPlaceholdersDocument(parameter: {
		user: AuthUser;
		fileUuid: string;
		location: string;
		passphrase: string;
		signaturePlaceHolder: string;
		placeholderDataList: {
			placeholder: string;
			value: string;
		}[];
	}) {
		try {
			const response = await firstValueFrom(
				this.http.post<any>(
					environment.AUTH_URL +
						`/nest-dsms/api/signature/sign-attachment-with-placeholders`,
					{
						userId: parameter.user.uuid,
						fileUid: parameter.fileUuid,
						reason: 'Signing',
						location: parameter.location,
						contactInfo: parameter.user.phone,
						passphrase: parameter.passphrase,
						signaturePlaceHolder: parameter.signaturePlaceHolder,
						placeholderDataList: parameter.placeholderDataList,
					}
				)
			);
			if (response) {
				return response;
			}
			return null;

			// this.settingService.viewFile(dataReturned[0].signedDocBase64Attachment, 'pdf');
		} catch (e) {
			console.error(e);

			this.notificationService.errorMessage(
				'Failed to sign document ' + e.message
			);
			return null;
		}
	}

	async deleteHTMLDocuments(attachmentUids: string[]) {
		try {
			const response = await firstValueFrom(
				this.http.delete<any>(
					environment.AUTH_URL + `/nest-dsms/api/attachment`,
					{ body: attachmentUids }
				)
			);
			return response.message;
			// this.settingService.viewFile(dataReturned[0].signedDocBase64Attachment, 'pdf');
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'Failed to Delete document ' + e.message
			);
			return null;
		}
	}
}
