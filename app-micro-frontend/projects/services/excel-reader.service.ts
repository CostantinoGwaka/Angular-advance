import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { Observable } from 'rxjs';
import {  GET_ECXEL_TEMPLATE_AUTOMATIC } from '../modules/nest-app/store/schedule-of-requirement/schedule-of-requirement.graphql';
import { GraphqlService } from './graphql.service';
import { GET_GENERAL_EXCEL_TEMPLATE } from "../modules/nest-tenderer-management/special-groups/special-group.graphql";

@Injectable({
  providedIn: 'root'
})
export class ExcelReaderService {

  constructor(
    private apollo: GraphqlService,
  ) { }

  async formatSheet(ws: { getRow: (arg0: number) => any; }, columns: any) {
    for (let i = 2; i <= 1000; i++) {
      const row = ws.getRow(i);
      for (const col of columns) {
        if (col.key) {
          const cell = row.getCell(col.key);
          if (col.options?.length) {
            cell.dataValidation = {
              type: 'list',
              allowBlank: true,
              showErrorMessage: true,
              formulae: [`"${col.options.join()}"`]
            };
          }
          if (col?.valueType === 'DATE') {
            cell.note = 'mm/dd/yyyy';
            cell.dataValidation = {
              type: 'date',
              operator: 'lessThan',
              showErrorMessage: true,
              // allowBlank: true,
              formulae: [new Date()]
            };
          }
        }
      }
    }
  }

  public uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public base64ToBlob2(b64Data: string, contentType: string, sliceSize: number = 512,) {
    let extension = "." + contentType.split("/")[1].toLowerCase();
    let fileName = this.uuid() + extension;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const dlink = document.createElement('a');
    dlink.href = URL.createObjectURL(new Blob(byteArrays, { type: contentType }));
    dlink.setAttribute('download', `${fileName}`);
    dlink.click();
    dlink.remove();
  }

  getExcelData(file: DataTransfer): Observable<{ [sheetName: string]: any[] }> {
    return new Observable(observer => {
      const excelData: { [sheetName: string]: any[] } = {};
      const target: DataTransfer = (file) as DataTransfer;
      if (target.files.length !== 1) {
        observer.error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
        for (const sheetName of Object.keys(wb.Sheets)) {
          const ws: XLSX.WorkSheet = wb.Sheets[sheetName];
          excelData[sheetName] = XLSX.utils.sheet_to_json(ws);
        }
        observer.next(excelData);
        observer.complete();
      };
    });
  }

  excelDateToJSDate(serial: number) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }


  public base64ToBlob(b64Data: string, fileName: string, sliceSize: number = 512) {
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const dlink = document.createElement('a');
    dlink.href = URL.createObjectURL(new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    dlink.setAttribute('download', `${fileName}.xlsx`);
    dlink.click();
    dlink.remove();
  }

  async generateExcelTemplate() {
    const excelFields = {
      title: " Schedule Of Requirements Template",
      columns: [
        {
          name: "Activity Code",
          options: []
        }, {
          name: "Activity Description",
          options: []
        }, {
          name: "GFS Code",
          options: []
        }, {
          name: "GFS Code Description",
          options: []
        }
      ]
    };

    try {
      const response: any = await this.apollo.fetchData({
        query: GET_ECXEL_TEMPLATE_AUTOMATIC,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          excelConfigDto: excelFields
        }
      });
      let bindData = response.data.getScheduleOfRequirementTemplate.data;
      this.base64ToBlob(bindData, 'SOR Template');
    } catch (e) {
      console.error(e);
    }

  }
  async generateTemplate(title: string, columns: { name: string, options?: string[] }[]) {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_GENERAL_EXCEL_TEMPLATE,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          excelConfigDto: {
            title,
            columns,
          }
        }
      });
      if (response.data.getExcelTemplate.code === 9000) {
        let bindData = response.data.getExcelTemplate.data;
        this.base64ToBlob(bindData, title);
      } else {
        throw new Error(response.data.getExcelTemplate.message)
      }
    } catch (e) {
      console.error(e);
    }

  }

  async generateExcelTemplateWithData(columns: { name: string; valueType: string; key?: string; options?: string[] }[], sheetNames: string, fileName: string, data: any[]) {
    const workbook = new Workbook();
    const worksheet = await this.addSheets(workbook, sheetNames, columns, 20);
    data.forEach(dataItem => {
      const row = worksheet.addRow(dataItem)
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const dlink = document.createElement('a');
    dlink.href = URL.createObjectURL(new Blob([buffer]));
    dlink.setAttribute('download', `${fileName}.xlsx`);
    dlink.click();
    dlink.remove();
  }

  async addSheets(workbook: Workbook, sheetName: string | undefined, columns: { name: string; valueType: string; key?: string; options?: string[] }[], width: number = 35) {
    const ws = workbook.addWorksheet(sheetName);
    ws.columns = columns.map((col) => {
      return { header: col.name, key: col.key, width };
    });
    ws.columns.forEach((column: any) => {
      if (!!column) {
        column!.eachCell((cell: { font: { name: string; family: number; bold: boolean; size: number; }; alignment: { vertical: string; horizontal: string; }; }, num: any) => {
          cell.font = {
            name: 'Arial',
            family: 2,
            bold: true,
            size: 12,
          };
          cell.alignment = {
            vertical: 'middle', horizontal: 'center'
          };
        });
      }

    });
    return ws;
  }

}
