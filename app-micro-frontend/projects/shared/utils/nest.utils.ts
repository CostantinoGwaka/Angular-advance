import { Country } from 'src/app/modules/nest-tenderer-management/store/country/country.model';
import { Meta } from '@angular/platform-browser';
import { PaginatorInput } from 'src/app/website/shared/models/web-paginator.model';
import { EditableSpecificationItem } from '../components/nested-specifications-builder/store/model';
import { EntityObjectTypeEnum } from '../team-management/store/team.model';
import { TemplateDocumentTypesEnum } from '../../services/document/store/document-creator.model';
import { Contract } from 'src/app/modules/nest-contracts/store/contract.model';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { environment } from 'src/environments/environment';
import { countries } from 'src/app/modules/nest-tenderer-management/store/country/countries';
import { StorageService } from 'src/app/services/storage.service';

export type StatsNumberFormat =
	| 'comma-separated'
	| 'thousand-separated'
	| 'thousand-separated-with-short-suffix'
	| 'thousand-separated-object';

export class NestUtils {
	static get GraphqlPaginationFields(): string {
		return `
    totalPages
    totalRecords
    currentPage
    last
    first
    hasNext
    hasPrevious
    numberOfRecords
    recordsFilteredCount
    pageSize
    metaData {
      fieldName
      isSearchable
      isSortable
      isEnum
    }
    `;
	}

	static async hashString(input: string): Promise<string> {
		try {
			const encoder = new TextEncoder();
			const data = encoder.encode(input);
			const hash = await crypto.subtle.digest('SHA-256', data);
			const hashArray = Array.from(new Uint8Array(hash));
			const hashHex = hashArray
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			return hashHex;
		} catch (error) {
			console.warn(error);
			return input;
		}
	}

	static isLiveEnvironment(): boolean {
		const url = window.location.href;

		if (
			url.includes('nest.go.tz') &&
			!url.includes('staging.nest.go.tz') &&
			!url.includes('training.nest.go.tz')
		) {
			return true;
		}

		return false;
	}

	static sortByCreatedAtDescending<T>(items: T[]): T[] {
		return items.sort(
			(a, b) =>
				new Date(b['createdAt']).getTime() - new Date(a['createdAt']).getTime(),
		);
	}

	static sortByFieldName<T>(
		array: any[],
		property: any,
		order: 'ASC' | 'DESC',
		innerProperty?: string,
	): any[] {
		try {
			if (array === null || property === null) {
				return array;
			}
			const pos = order === 'ASC' ? 1 : -1;
			const neg = order === 'ASC' ? -1 : 1;
			return innerProperty
				? array.slice().sort((firstEl, secondEl) => {
						if (
							firstEl[property][innerProperty] <
							secondEl[property][innerProperty]
						) {
							return neg;
						}
						if (
							firstEl[property][innerProperty] >
							secondEl[property][innerProperty]
						) {
							return pos;
						}
						return 0;
				  })
				: array.slice().sort((firstEl, secondEl) => {
						if (firstEl[property] < secondEl[property]) {
							return neg;
						}
						if (firstEl[property] > secondEl[property]) {
							return pos;
						}
						return 0;
				  });
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	static convertEntityTypeToDocumentType(entityType: EntityObjectTypeEnum) {
		let documentType: TemplateDocumentTypesEnum;
		switch (entityType) {
			case EntityObjectTypeEnum.FRAMEWORK:
				documentType = TemplateDocumentTypesEnum.AGREEMENT_DOCUMENT;
				break;
			case EntityObjectTypeEnum.PLANNED_TENDER:
				documentType = TemplateDocumentTypesEnum.PRE_QUALIFICATION_DOCUMENT;
				break;
			case EntityObjectTypeEnum.CONTRACT:
				documentType = TemplateDocumentTypesEnum.TENDER_CONTRACT;
				break;
			case EntityObjectTypeEnum.TENDER:
			default:
				documentType = TemplateDocumentTypesEnum.TENDER_DOCUMENT;
				break;
		}
		return documentType;
	}

	static getServerNameByCurrentURLAddress(): string {
		const url = window.location.href;

		let name = null;

		if (url.includes('staging.nest.go.tz')) {
			name = 'staging';
		} else if (url.includes('training.nest.go.tz')) {
			name = 'training';
		} else if (url.includes('nest.go.tz')) {
			name = 'live';
		} else if (
			url.includes('localhost') ||
			url.includes('192.') ||
			url.includes('127.0.')
		) {
			name = 'dev';
		} else {
			name = 'dev';
		}

		return name;
	}

	static sortArrays(
		data: any,
		arrayFieldName: string,
		sortField: string,
		sortOrder: 'ASC' | 'DESC',
	) {
		let sortedData: any;
		if (Array.isArray(data)) {
			sortedData = [...data]; // Create a shallow copy of the data array
			sortedData.sort((a: any, b: any) => {
				if (sortOrder === 'ASC') {
					return a[sortField] - b[sortField];
				} else if (sortOrder === 'DESC') {
					return b[sortField] - a[sortField];
				}
				return 0;
			});
			return sortedData; // Return the sorted array
		}

		if (arrayFieldName) {
			for (const key in data) {
				if (typeof data[key] === 'object') {
					this.sortArrays(data[key], arrayFieldName, sortField, sortOrder);
				}
			}
		}

		if (sortedData) {
			data = { ...sortedData };
		}

		return data;
	}

	static sortArraysOfStrings(
		data: any,
		arrayFieldName: string,
		sortField: string,
		sortOrder: 'ASC' | 'DESC',
	) {
		if (Array.isArray(data)) {
			data.sort((a, b) => {
				if (sortOrder === 'ASC') {
					return a.sortField.localeCompare(b.sortField);
				} else if (sortOrder === 'DESC') {
					return b.sortField.localeCompare(a.sortField);
				}
				return 0;
			});
		}

		if (arrayFieldName) {
			for (const key in data) {
				if (typeof data[key] === 'object') {
					this.sortArrays(data[key], arrayFieldName, sortField, sortOrder);
				}
			}
		}
	}

	static setPageTitle(title: string, meta: Meta) {
		let finalTitle = null;
		if (!title) {
			finalTitle = 'NeST - National e-Procurement System of Tanzania';
		}

		finalTitle = title + ' | NeST - National e-Procurement System of Tanzania';

		meta.updateTag({
			name: 'title',
			content: finalTitle,
		});

		meta.updateTag({
			property: 'og:title',
			content: finalTitle,
		});

		meta.updateTag({
			name: 'twitter:title',
			content: finalTitle,
		});

		return finalTitle;
	}

	static isProvisionSumItem(specification: EditableSpecificationItem) {
		let unitOfMeasure = specification.unitOfMeasure
			?.trim()
			?.toLocaleLowerCase();
		return (
			unitOfMeasure == 'ps' ||
			unitOfMeasure == 'provisional sum' ||
			unitOfMeasure == 'provisional sums'
		);
	}

	static setPageDescription(meta: Meta, description: string) {
		let fallbackDescription =
			"Tanzania's electronic system that facilitates e-registration, e-tendering, e-contract management, e-catalogue, and e-auction. (Mfumo wa kielektroni unaowezesha kufanya Usajili, Kuchakata Zabuni, Kusimamia Mikataba na kununua kupitia Katalogi na Minada kimtandao.)";
		if (!description) {
			description = fallbackDescription;
		}

		meta.updateTag({
			name: 'description',
			content: description,
		});
		meta.updateTag({
			name: 'og:description',
			content: description,
		});
		meta.updateTag({
			name: 'twitter:description',
			content: description,
		});

		meta.updateTag({
			property: 'description',
			content: description,
		});
		meta.updateTag({
			property: 'og:description',
			content: description,
		});
		meta.updateTag({
			property: 'twitter:description',
			content: description,
		});
	}

	static getPaginationCountLabel(paginatorInput: PaginatorInput): string {
		if (!paginatorInput) {
			return '';
		}

		if (paginatorInput.totalRecords === 0) {
			return 'No items found';
		}

		if (paginatorInput.totalRecords === 1) {
			return 'Found 1 item';
		}

		if (paginatorInput.totalRecords < paginatorInput.pageSize) {
			return `Showing 1 - ${paginatorInput.totalRecords} of ${paginatorInput.totalRecords} items`;
		}

		if (paginatorInput.currentPage === 1) {
			return `Showing 1 - ${paginatorInput.pageSize} of ${paginatorInput.totalRecords} items`;
		}

		const currentPage = paginatorInput.currentPage - 1;
		let pageDisplayCount =
			paginatorInput.numberOfRecords + paginatorInput.pageSize * currentPage;
		const totalPageViewItems = 1 + paginatorInput.pageSize * currentPage;
		return `Showing ${totalPageViewItems} - ${pageDisplayCount} of ${paginatorInput.totalRecords} items`;
	}

	static debounce(func: (...args: any) => void, delay = 500) {
		let timerId: any;

		return (...args: any) => {
			clearTimeout(timerId);
			timerId = setTimeout(() => {
				func(...args);
			}, delay);
		};
	}

	static encodeBase64(input: string): string {
		const encodedText = encodeURIComponent(input);
		const base64 = btoa(encodedText);
		return base64;
	}

	static decodeBase64(input: string): string {
		const decodedText = atob(input);
		const decoded = decodeURIComponent(decodedText);
		return decoded;
	}

	static scrollToTaskResponseArea() {
		let element = document.getElementById('response-area');
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest',
		});
	}

	static generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (c) {
				var r = (Math.random() * 16) | 0,
					v = c === 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			},
		);
	}

	static scrollToBottom() {
		this.scrollToTaskResponseArea();
	}

	static getContractSignAs(contract: Contract, user: AuthUser) {
		if (contract.tendererWitnessUuid === user?.uuid) {
			return {
				code: 'tenderer_witness',
				text: 'Witness',
			};
		}

		if (contract.peWitnessUuid === user?.uuid) {
			return {
				code: 'pe_witness',
				text: 'Witness',
			};
		}

		if (contract.powerOfAttorneyUuid === user?.uuid) {
			return {
				code: 'donee',
				text: 'Donee',
			};
		}

		if (contract.peRepresentativeUuid === user?.uuid) {
			return {
				code: 'pe_rep',
				text: 'PE Representative',
			};
		}

		return null;
	}

	static getCanSign(contract: Contract, user: AuthUser) {
		if (!contract || !user) {
			return false;
		}
		if (
			contract.tendererWitnessUuid === user?.uuid ||
			contract.peWitnessUuid === user?.uuid ||
			contract.powerOfAttorneyUuid === user?.uuid ||
			contract.peRepresentativeUuid === user?.uuid
		) {
			return true;
		}

		return false;
	}

	static separateNumberIntoThousands(number: number): {
		number: number;
		suffix: string;
	} {
		if (number >= 1000000000000000) {
			return {
				number: number / 1000000000000000,
				suffix: 'Quadrillion',
			};
		} else if (number >= 1000000000000) {
			return {
				number: number / 1000000000000,
				suffix: 'Trillion',
			};
		} else if (number >= 1000000000) {
			return {
				number: number / 1000000000,
				suffix: 'Billion',
			};
		} else if (number >= 1000000) {
			return {
				number: number / 1000000,
				suffix: 'Million',
			};
		} else if (number >= 1000) {
			return {
				number: number / 1000,
				suffix: 'K',
			};
		} else {
			return {
				number: number,
				suffix: '',
			};
		}
	}

	static getThousandSeparatedNumber(
		number: number,
		decimalPlaces: number = 1,
	): string {
		let _number = this.separateNumberIntoThousands(number);
		return (
			this.roundNumber(_number.number, decimalPlaces) + ' ' + _number.suffix
		);
	}

	static getNumberWithFormat(
		number: number,
		format: StatsNumberFormat,
	): string | number | Object {
		let decimalPlaces = 1;
		let _number = this.separateNumberIntoThousands(number);
		switch (format) {
			case 'comma-separated':
				return this.commasSeparateNumber(number);
			case 'thousand-separated':
				return `${this.roundNumber(_number.number, decimalPlaces)} ${
					_number.suffix
				}`;
			case 'thousand-separated-with-short-suffix':
				return `${this.roundNumber(
					_number.number,
					decimalPlaces,
				)} ${_number.suffix.charAt(0)}`;
			case 'thousand-separated-object':
				return _number;
		}
	}

	static commasSeparateNumber(value: number) {
		const parts = value.toString().split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return parts.join('.');
	}

	static roundNumber(num: number, decimalPlaces: number) {
		const factor = Math.pow(10, decimalPlaces);
		return Math.round(num * factor) / factor;
	}

	static convertEnumToTitleCase(enumValue: string): string {
		return enumValue
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	static getGreetings(): string {
		const date = new Date();
		const hours = date.getHours();
		let greeting = '';
		if (hours < 12) {
			greeting = 'Good Morning';
		} else if (hours < 18) {
			greeting = 'Good Afternoon';
		} else {
			greeting = 'Good Evening';
		}
		return greeting;
	}

	static getCountryNameByCode(code: string): string {
		let countryList = countries;
		let country = countryList.find((c) => c.isoCode === code);
		return country?.name;
	}

	static getTenderCategoryNameByAcronym(acronym: string): string {
		let category = '';
		switch (acronym) {
			case 'G':
				category = 'Goods';
				break;
			case 'W':
				category = 'Works';
				break;
			case 'C':
				category = 'Consultancy';
				break;
			case 'NC':
				category = 'Non-Consultancy';
				break;
			default:
				category = acronym;
				break;
		}
		return category;
	}

	static forceIsNaNToZero(value: number): number {
		return isNaN(value) ? 0 : value;
	}
}
