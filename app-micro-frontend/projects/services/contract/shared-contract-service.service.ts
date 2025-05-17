import { Injectable } from '@angular/core';
import { GraphqlService } from '../graphql.service';
import { NotificationService } from '../notification.service';
import { GET_CONTRACT_DOCUMENT_UUID_BY_CONTRACT_UUID } from './shared-contract-service.graphql';
import { Contract } from '../../modules/nest-contracts/store/contract.model';
import { DigitalSignatureSignResponse } from '../../shared/components/attachment-viewer/digital-signature-input/digital-signature-input.component';
import { AttachmentService } from '../attachment.service';
import { SAVE_CONTRACT_DOCUMENT } from '../../modules/nest-contracts/store/contract.graphql';
import { ApolloNamespace } from '../../apollo.config';
import { StorageService } from '../storage.service';

export enum SignatoryType {
	TENDERER_POWER_OF_ATTORNEY = 'TENDERER_POWER_OF_ATTORNEY',
	TENDERER_WITNESS = 'TENDERER_WITNESS',
	PE_REPRESENTATIVE = 'PE_REPRESENTATIVE',
	PE_WITNESS = 'PE_WITNESS',
}

export interface SigningData {
	signaturePlaceholder: string;
	name: string;
	designation: string;
	namePlaceholder: string;
	designationPlaceholder: string;
}

@Injectable({
	providedIn: 'root',
})
export class SharedContractServiceService {
	constructor(
		private apollo: GraphqlService,
		private notificationService: NotificationService,
		private attachmentService: AttachmentService,
		private storageService: StorageService,
	) {}

	async getDocumentUuid(contractUuid: string): Promise<string> {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_CONTRACT_DOCUMENT_UUID_BY_CONTRACT_UUID,
				apolloNamespace: ApolloNamespace.contract,
				variables: {
					uuid: contractUuid,
				},
			});
			if (response.data.results?.data) {
				return response.data.results.data.contractDocumentUuid;
			} else {
				throw new Error(response.data.results?.message);
			}
		} catch (e) {
			this.notificationService.errorMessage('Failed to get contract document');
		}
		return null;
	}

	async signDocument(
		contract: Contract,
		signatoryType: SignatoryType,
		onSigned: (res: any) => void,
	) {
		let signingData = this.getSigningData(contract, signatoryType);

		this.notificationService.showLoader({
			title: 'Please wait',
			message: 'Getting contract information',
			allowCancel: false,
		});

		let documentToSign = await this.getDocumentUuid(contract.uuid);

		console.log('documentToSign', documentToSign);

		this.notificationService.hideLoader();

		if (!documentToSign) {
			this.notificationService.errorMessage('Failed to get document to sign');
			return;
		}

		this.attachmentService.signAttachment(
			{
				showDocumentPreview: true,
				documentTitle: 'Contract',
				type: 'PDF',
				digitalSignatureData: {
					signaturePlaceHolder: signingData.signaturePlaceholder,
					pdfData: {
						pdfUuid: documentToSign,
						pdfPlaceholderValuePair: [
							{
								placeholder: signingData.namePlaceholder,
								value: signingData.name,
							},
							{
								placeholder: signingData.designationPlaceholder,
								value: signingData.designation,
							},
						],
					},
				},
				previewOnly: false,
			},
			async (res: DigitalSignatureSignResponse) => {
				if (res.success) {
					this.notificationService.showLoader({
						title: 'Please wait',
						message: 'Updating signed contract',
						allowCancel: false,
					});

					let updated = await this.updateContractDocument(
						contract.uuid,
						res.data.signedDocumentUuid,
					);

					this.notificationService.hideLoader();

					if (updated) {
						onSigned(res);
					}
				}
			},
		);
	}

	getSigningData(
		contract: Contract,
		signatoryType: SignatoryType,
	): SigningData {
		let data: SigningData;
		switch (signatoryType) {
			case SignatoryType.PE_REPRESENTATIVE:
				data = {
					signaturePlaceholder: '#AUTH_PE_REP_SIGNATURE#',
					namePlaceholder: '#AUTH_PE_REP_NAME#',
					designationPlaceholder: '#AUTH_PE_REP_DESIGNATION#',
					name: contract.peRepresentativeName,
					designation: contract.peRepresentativeDesignation,
				};
				break;

			case SignatoryType.PE_WITNESS:
				data = {
					signaturePlaceholder: '#PE_WITNESS_SIGNATURE#',
					namePlaceholder: '#PE_WITNESS_NAME#',
					designationPlaceholder: '#PE_WITNESS_DESIGNATION#',
					name: contract.peWitnessName,
					designation: contract.peWitnessDesignation,
				};
				break;

			case SignatoryType.TENDERER_POWER_OF_ATTORNEY:
				data = {
					signaturePlaceholder: '#AUTH_TENDERER_REP_SIGNATURE#',
					namePlaceholder: '#AUTH_TENDERER_REP_NAME#',
					designationPlaceholder: '#AUTH_TENDERER_REP_DESIGNATION#',
					name: contract.powerOfAttorneyName,
					designation: contract.powerOfAttorneyLegalCapacity,
				};
				break;

			case SignatoryType.TENDERER_WITNESS:
				data = {
					signaturePlaceholder: '#TENDERER_WITNESS_SIGNATURE#',
					namePlaceholder: '#TENDERER_WITNESS_NAME#',
					designationPlaceholder: '#TENDERER_WITNESS_DESIGNATION#',
					name: contract.tendererWitnessName,
					designation: contract.tendererWitnessDesignation,
				};
				break;
		}

		return data;
	}

	async updateContractDocument(
		contractUuid: string,
		documentUuid: string,
	): Promise<boolean> {
		try {
			let input: any = {
				contractUuid,
				contractDocumentUuid: documentUuid,
			};

			const response: any = await this.apollo.mutate({
				mutation: SAVE_CONTRACT_DOCUMENT,
				apolloNamespace: ApolloNamespace.contract,
				variables: {
					input: input,
				},
			});

			if (response.data.results.code === 9000) {
				return true;
			} else {
				this.notificationService.errorMessage(
					'Failed to save new document: ' + response.data.results.message,
				);
			}
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'Failed to save contract new document, please try again',
			);
		}
		return false;
	}
}
