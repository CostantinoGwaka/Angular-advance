import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { constant } from 'lodash';
import * as XLSX from 'xlsx';
import { SourceOfFund } from '../modules/nest-app/store/settings/source-of-fund/source-of-fund.model';
import { UnitOfMesure } from '../modules/nest-app/store/settings/unit-of-mesure/unit-of-mesure.model';
import { Department } from '../modules/nest-pe-management/store/department/department.model';
import { NotificationService } from './notification.service';
import { SorUpload } from '../modules/nest-app/app-departmental-need/upload-departmental-needs/sor-upload.interface';
import { AlertDialogService } from '../shared/components/alert-dialog/alert-dialog-service.service';
import { environment } from '../../environments/environment';

export let labels: {
	name: string;
	shownTable: boolean;
	id: string;
	type?: string;
}[] = [
	{ name: 'Cost Center', id: 'costCenter', shownTable: true },
	{ name: 'GL Account Code', id: 'glAccountCode', shownTable: true },
	{ name: 'Activity Code', id: 'activityCode', shownTable: true },
	{ name: 'Activity Description', id: 'activityDescription', shownTable: true },
	{ name: 'GFS Code', id: 'gfsCode', shownTable: true, type: 'string' },
	{ name: 'GFS Code Description', id: 'gfsCodeDescription', shownTable: true },
	{ name: 'Item Description', id: 'description', shownTable: true },
	{ name: 'Procurement Category', id: 'procurementCategory', shownTable: true },
	{ name: 'Source Of Funds', id: 'sourceOfFund', shownTable: true },
	{ name: 'Unit of Measure', id: 'unitOfMeasure', shownTable: true },
	{ name: 'Frequency', id: 'frequency', shownTable: true },
	{
		name: 'Quantity',
		id: 'originalQuantity',
		shownTable: true,
		type: 'number',
	},
	{ name: 'Unit Price', id: 'unitPrice', shownTable: true, type: 'number' },
	{ name: 'Total Price', id: 'totalPrice', shownTable: true, type: 'number' },
	// {name:'Time Line',id: 'timeline', shownTable:true},
	{ name: 'Time Line', id: 'timeLine', shownTable: true },
	// {name:'Cost Center', id: 'costCenterName',shownTable:false},
	// {name:'Activity Code',id: 'activityCode', shownTable:false}
];

export let sorColumns = labels
	.filter(
		(label: { name: string; shownTable: boolean; id: string; type?: any }) =>
			label.shownTable &&
			(environment.ALLOW_FINANCIAL_SYSTEM_INTEGRATION ||
				label.id !== 'glAccountCode')
	)

	.map(
		(
			label: { name: string; shownTable: boolean; id: string; type?: string },
			index: number
		) => ({ name: label.id, label: label.name, type: label.type })
	);
@Injectable({
	providedIn: 'root',
})
export class ExcelUploadService {
	uploadingErrorReport: { rowIndex: number; messages: any[] }[] = [];
	constructor(
		private notificationService: NotificationService,
		private alertDialogService: AlertDialogService
	) {}

	getErrorReport() {
		return this.uploadingErrorReport;
	}

	async prepareDepartmentalNeedData(
		event: any,
		departments: Department[],
		procurementCategorys: any[],
		sourceOfFunds: SourceOfFund[],
		unitOfMesures: UnitOfMesure[],
		timelines: { name: string; value: string }[]
	): Promise<SorUpload[]> {
		const data = await this.getFileJsonObject(event);
		if (this.isDataValid(data, labels)) {
			return this.transformToPayload(
				data,
				labels,
				departments,
				procurementCategorys,
				sourceOfFunds,
				unitOfMesures,
				timelines
			);
		} else {
			this.notificationService.warningSnackbar(
				'File Upload failed: Invalid Data Format'
			);
			return null;
		}
	}

	public extraColumn(
		item: SorUpload,
		columName: string,
		departments: Department[],
		procurementCategorys: any[],
		sourceOfFunds: SourceOfFund[],
		unitOfMesures: UnitOfMesure[],
		timelines: { name: string; value: string }[]
	): SorUpload {
		try {
			item['unitOfMeasureUuid'] = unitOfMesures.find(
				(unit: UnitOfMesure) => unit.name.trim() == item[columName.trim()]
			).uuid;
			item['unitOfMeasure'] = unitOfMesures.find(
				(unit: UnitOfMesure) => unit.name.trim() == item[columName.trim()]
			).name;
			// delete item[columName];
		} catch (e) {}

		try {
			item['procurementCategoryUuid'] = procurementCategorys.find(
				(unit: UnitOfMesure) => unit.name.trim() == item[columName.trim()]
			).uuid;
			item['procurementCategory'] = procurementCategorys.find(
				(unit: UnitOfMesure) => unit.name.trim() == item[columName.trim()]
			).name;
			// delete item[columName];
		} catch (e) {}

		try {
			item['sourceOfFundUuid'] = sourceOfFunds.find(
				(unit: UnitOfMesure) => unit.name.trim() == item[columName.trim()]
			).uuid;
			item['sourceOfFund'] = sourceOfFunds.find(
				(unit: UnitOfMesure) => unit.name.trim() == item[columName.trim()]
			).name;
			// delete item[columName];
		} catch (e) {}

		try {
			item['timeLine'] = timelines.find(
				(unit: { name: string; value: string }) =>
					unit.name.trim() == item[columName.trim()]
			).value;
			// delete item[columName];
		} catch (e) {}
		return item;
	}

	public transformToPayload(
		data: Array<any>,
		labels: Array<{ name: string; shownTable: boolean; id: string }>,
		departments: Department[],
		procurementCategorys: any[],
		sourceOfFunds: SourceOfFund[],
		unitOfMesures: UnitOfMesure[],
		timelines: { name: string; value: string }[]
	): SorUpload[] {
		let mappedValues = [];
		try {
			let dataList = [];
			if (data.length > 0) {
				dataList = data.map((item: any) => {
					let dataItem: any = {};
					Object.keys(data[0]).map((key) => {
						dataItem[key.trim()] = item[key];
					});
					return dataItem;
				});
			}
			mappedValues = dataList.map((element: any, id: number) => {
				let transformedItem: SorUpload = Object.assign({});
				labels.forEach(
					(
						column: {
							name: string;
							shownTable: boolean;
							id: string;
							type?: string;
						},
						index: number
					) => {
						try {
							if (column.type && column.type == 'string') {
								transformedItem[column.id.trim()] =
									element[column.name.trim()] + '';
							} else if (column.type && column.type == 'number') {
								transformedItem[column.id.trim()] =
									+element[column.name.trim()];
							} else if (!column.type) {
								transformedItem[column.id.trim()] =
									element[column.name.trim()] + '';
							} else {
								transformedItem[column.id.trim()] =
									element[column.name.trim()] + '';
							}
						} catch (e) {}
					}
				);
				transformedItem = this.extraColumn(
					transformedItem,
					'unitOfMeasure',
					departments,
					procurementCategorys,
					sourceOfFunds,
					unitOfMesures,
					timelines
				);
				transformedItem = this.extraColumn(
					transformedItem,
					'procurementCategory',
					departments,
					procurementCategorys,
					sourceOfFunds,
					unitOfMesures,
					timelines
				);
				transformedItem = this.extraColumn(
					transformedItem,
					'sourceOfFund',
					departments,
					procurementCategorys,
					sourceOfFunds,
					unitOfMesures,
					timelines
				);
				transformedItem = this.extraColumn(
					transformedItem,
					'timeLine',
					departments,
					procurementCategorys,
					sourceOfFunds,
					unitOfMesures,
					timelines
				);
				//
				return transformedItem;
			});
		} catch (e) {}
		return mappedValues;
	}

	isDataValid(data: any, labels: any[]): boolean {
		let uploadReports = [];

		// No data in excel file
		if (!data || data.length == 0) {
			uploadReports.push({ rowIndex: 0, messages: ['Uploaded file is empty'] });
		}

		// Check for empty columns
		data.forEach((dataItem: any, index: number) => {
			let reportItem: { rowIndex: number; messages: string[] };
			reportItem = { rowIndex: index, messages: [] };
			labels.forEach((label: any) => {
				const message = this.getMessagePhrase(dataItem, label);
				if (message) {
					reportItem.messages = [...reportItem.messages, message];
					uploadReports.push(reportItem);
				}
			});
		});

		this.uploadingErrorReport = Array.from(
			new Map(uploadReports.map((item) => [item.rowIndex, item])).values()
		);

		return data.length > 0 && uploadReports.length == 0;
	}

	getMessagePhrase(dataItemValue: any, label: any) {
		let dataItem: any = {};
		const dataKeys = Object.keys(dataItemValue);
		dataKeys.forEach((key: string) => {
			dataItem[key.trim()] = dataItemValue[key];
		});
		return dataItem[label.name.trim()] == null &&
			label.name.trim() != 'Total Price' &&
			label.name.trim() != 'GL Account Code'
			? "Missing value for column: <span class='font-medium'>" +
					label.name.trim() +
					'</span>'
			: null;
	}

	extractDataFromExcelFile(file: File): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				const fileName = file.name;
				const fileSize = parseFloat((file.size / 1000).toFixed(3));

				if (fileSize > 500) {
					reject('File size exceeds the maximum allowed size.');

					this.alertDialogService
						.openDialog({
							status: 'warning',
							title: 'Warning',
							showCancelBtn: false,
							message:
								'File size exceeded, required is less than 500Kb, Provided is ' +
								fileSize +
								'Kb',
						})
						.then(() => {
							return;
						});

					return;
				}

				const reader = new FileReader();
				let data: any;

				reader.readAsBinaryString(file);

				reader.onload = (e: any) => {
					try {
						const bstr: string = e.target.result;
						const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
						const wsname: string = wb.SheetNames[0];
						const ws: XLSX.WorkSheet = wb.Sheets[wsname];

						// Get basic sheet information
						const range = XLSX.utils.decode_range(ws['!ref']);
						const numCols = range.e.c + 1;
						const numRows = range.e.r + 1;

						data = XLSX.utils.sheet_to_json(ws);
						resolve(data);
					} catch (error) {
						reject('Error reading Excel file: ' + error);
					}
				};

				reader.onloadend = () => {
					resolve(data);
				};
			} catch (error) {
				reject('File Upload failed: ' + error);
			}
		});
	}

	prepareTemplateColumns(
		departments: any[],
		procurementCategorys: any[],
		sourceOfFunds: any[],
		unitOfMesures: any[],
		timelines: any[]
	): { name: string; options?: string[] }[] {
		let columns: { name: string; options?: string[] }[] = [];
		const arrayTypes = {
			'Cost Center': departments.map((i) => `${i.code}-${i.name}`),
			'Procurement Category': procurementCategorys.map((i) => i.name),
			'Source Of Funds': sourceOfFunds.map((i) => i.name),
			'Unit of Measure': unitOfMesures.map((i) => i.name),
			'Time Line': timelines.map((i) => i.value),
		};
		columns = labels.map(
			(labelItem: { name: string; shownTable: boolean; id: string }) => {
				if (arrayTypes[labelItem.name]) {
					return { name: labelItem.name, options: arrayTypes[labelItem.name] };
				}
				return { name: labelItem.name };
			}
		);
		return columns;
	}

	async getFileJsonObject(event: any) {
		let jsonData: any = null;
		if (this.fileIsExcel(event) == true) {
			try {
				const file: File = this.getFileObject(event);
				jsonData = await this.extractDataFromExcelFile(file);
			} catch (e) {
				this.notificationService.warningSnackbar('File Upload failed: ' + e);
			}
		} else {
			this.notificationService.warningSnackbar('Only Excel or CSV accepted!');
		}
		return jsonData || [];
	}

	getFileObject(event: any) {
		return event.target ? (event.target.files[0] as File) : event[0];
	}

	fileIsExcel(event: any) {
		return event.target
			? !!event.target.files[0].name.match(/(.xls|.xlsx|.csv)/)
			: !!event[0].name.match(/(.xls|.xlsx|.csv)/);
	}
}
