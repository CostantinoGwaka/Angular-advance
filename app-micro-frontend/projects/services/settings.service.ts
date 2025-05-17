import {Injectable} from '@angular/core';
import {ApolloNamespace} from '../apollo.config';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ViewAttachmentComponent} from '../shared/components/view-attachment/view-attachment.component';
import {OpenDialog} from "../store/global-interfaces/organizationHiarachy";
import * as moment from 'moment';
import {BehaviorSubject} from "rxjs";
import {UntypedFormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {


  show_help = new BehaviorSubject(false);

  constructor(public dialog?: MatDialog) {
  }

  showHelp() {
    this.show_help.next(true);
  }

  closeHelp() {
    this.show_help.next(false);
  }

  formatDateWithForwardSlash(date: Date) {

    return this.formatDate(date, 'dd/MM/yyyy');
  }

  decendingDateformatDate(date: string | number | Date, format: string = 'yyyy-MM-dd HH:mm'): string {
    return this.formatDate(date, format);
  }

  decendingDateformatDateTime(date: string | number | Date, format: string = 'dd/MM/yyyy HH:mm'): string {
    return this.formatDate(date, format);
  }


  formatDate(dateReceived, format: string = 'YYYY-MM-DD') {
    if (typeof dateReceived === 'string' && dateReceived !== '') {
      dateReceived = new Date(dateReceived);
    }
    return dateReceived ? moment(dateReceived).format(format) : undefined;
  }

  //new
  formatDateToISOString(dateReceived, format: string = 'YYYY-MM-DD') {
    // console.log("Initial dateReceived:", dateReceived);

    if (typeof dateReceived === 'string' && dateReceived !== '') {
      dateReceived = new Date(dateReceived);
      // console.log("Converted string to Date object:", dateReceived);
    }

    if (!(dateReceived instanceof Date) || isNaN(dateReceived.getTime())) {
      console.error("Invalid date detected:", dateReceived);
      return undefined;
    }

    const isoDate = dateReceived.toISOString();
    // console.log("ISO string of dateReceived:", isoDate);

    const formattedDate = moment(isoDate).format(format);
    // console.log("Formatted date using moment:", formattedDate);

    return formattedDate;
  }


  addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };


  reformatDate(dateReceived, format: string = 'MM/DD/YYYY') {
    if (typeof dateReceived === 'string' && dateReceived !== '') {
      dateReceived = new Date(dateReceived);
    }
    return dateReceived ? moment(dateReceived).format(format) : undefined;
  }

  formatDateStartWithYearAndDash(date: string | number | Date, format: string = 'yyyy-MM-dd'): string {
    return this.formatDate(date, format);
  }


  getFinancialYearFromStartAndEnd(startDate: string, endDate: string) {
    return startDate.substring(0, 4) + ' / ' + endDate.substring(0, 4)
  }

  formatDateToLocalDate(date: Date) {
    if (!date) return null;
    let startDate = this.formatDateWithForwardSlash(date);
    const splittedStartDate = startDate?.replace(/\//ig, '-')?.split('-');
    return !!splittedStartDate ? splittedStartDate[2] + '-' + splittedStartDate[1] + '-' + splittedStartDate[0] : '';
  }

  async viewFile(base64string: any, fileFormat: any, name?: string) {
    const dialogRef = this.dialog.open(ViewAttachmentComponent, {
      width: '80%',
      data: {
        file: base64string,
        format: fileFormat,
        name,
      },
    });

    return dialogRef.afterClosed().toPromise();
  }


  insertIntoArrIndex<T>(arr: any[], index: number, item: T): T[] {
    arr.splice(index, 0, item);
    return arr;
  }

  b64toBlob(b64Data: string, contentType: string, sliceSize = 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return URL.createObjectURL(blob);
  }

  encoder(data: string, loop = 2, key = 'secured'): string {
    let returnedData = btoa(data);
    const keyValue = btoa(key);
    returnedData = btoa(keyValue + returnedData);
    for (let i = 0; i < loop; i++) {
      returnedData = btoa(returnedData);
    }
    return returnedData;
  }

  decoder(data: any, loop = 2, key = 'secured') {
    let returnedData = data;

    for (let i = 0; i < loop; i++) {
      returnedData = atob(returnedData);
    }
    const keyValue = btoa(key);
    returnedData = atob(returnedData);

    return atob(returnedData.substr(keyValue.length));
  }

  openDialogModal(dialog: OpenDialog) {
    const dialogConfig = new MatDialogConfig();
    const classes: string[] = [];
    if (dialog?.panelClass && dialog?.panelClass?.length > 0) {
      classes.push(...dialog?.panelClass);
    }
    dialogConfig.panelClass = classes;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = dialog?.width ? dialog?.width : '50%';
    dialogConfig.data = dialog?.data;
    if (dialog?.position != null) {
      dialogConfig.position = dialog?.position;
    }
    if (dialog?.height != null) {
      dialogConfig.height = dialog?.height;
    }
    this.dialog.open(dialog?.component, dialogConfig);
  }

  generatePagination(current: number, lastPage: number) {
    // return  Array((totalPages === 1) ? 1 : totalPages).fill(0).map((x, i) => ({id: i}));
    const delta = 6;
    const range = [0];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = current - delta; i <= current + delta; i++) {
      if (i < lastPage && i > 1) {
        range.push(i);
      }
    }
    range.push(lastPage);

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  }

  formatDateMonthName(date: string | number | Date): string {
    return this.formatDate(date, 'mediumDate');
  }

  checkPdfStatus(filePath: string) {
    let isPdf: boolean;
    let fileExtension = filePath.split('.').pop();

    if (fileExtension?.startsWith('pdf')) {
      isPdf = true;

    } else {
      isPdf = false;
    }

    return isPdf
  }

  isNullOrUndefined(value: any) {
    return value === 'undefined' || value === 'null' || value === undefined || typeof value === 'undefined' || value === null || Number.isNaN(value)
      || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0);

  }

  isArray = (val: any) => {
    if (val === null) {
      return false;
    }
    return Object.prototype.toString.call(val) === '[object Array]';
  }


  sortArray(array: any[], property: any, order: 'ASC' | 'DESC', innerProperty?: string): any[] {
    try {
      if (array === null || property === null) {
        return array;
      }
      const pos = order === 'ASC' ? 1 : -1;
      const neg = order === 'ASC' ? -1 : 1;
      return innerProperty ? array.slice().sort((firstEl, secondEl) => {
        if (firstEl[property][innerProperty] < secondEl[property][innerProperty]) {
          return neg;
        }
        if (firstEl[property][innerProperty] > secondEl[property][innerProperty]) {
          return pos;
        }
        return 0;
      }) : array.slice().sort((firstEl, secondEl) => {
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

  isObject = (val) => {
    if (val === null) {
      return false;
    }
    return ((typeof val === 'function') || (typeof val === 'object'));
  }

  toTitleCase(str?: string) {
    if (!str) {
      return str;
    }
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  getDuplicatesFromArray(inputArray: any[], propertyToUse: string, propertyToUseTwo?: string) {
    const seen = new Map();
    const duplicates = [];

    inputArray.forEach(item => {
      const propertyValue = item[propertyToUse];
      const propertyValueTwo = item[propertyToUseTwo];
      const combinedKey = `${propertyValue}-${propertyValueTwo}`;

      if (seen.has(combinedKey)) {
        duplicates.push(item);
      } else {
        seen.set(combinedKey, true);
      }
    });

    return duplicates;
  }

  removeDuplicates(array: any[], property: any = null): any[] {
    if (array === null) {
      return [];
    }
    return array.filter((item, index, self) => {
      if (property != null) {
        const clone = [...array];
        if (!clone[0].hasOwnProperty(property)) {
          throw new Error(`Could not find property [${property}] in Object Array`);
        }
        return index === self.findIndex((t) => (
          t[property] === item[property]
        ));
      } else {
        const _item = JSON.stringify(item);
        return index === array.findIndex(obj => {
          return JSON.stringify(obj) === _item;
        });
      }
    });
  }

  makeId(): string {
    let text = '';
    const first_letter_possible_combinations =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const possible_combinations =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 18; i++) {
      if (i === 0) {
        text += first_letter_possible_combinations.charAt(
          Math.floor(Math.random() * possible_combinations.length)
        );
      } else {
        text += possible_combinations.charAt(
          Math.floor(Math.random() * possible_combinations.length)
        );
      }
    }
    return text;
  }


  generateYears(): Year[] {
    let years: Year[] = [];
    let currentYear: number = new Date().getFullYear();
    let yearsBackCount = 30;
    for (let i = 0; i < yearsBackCount; i++) {
      years.push({
        name: (currentYear - i).toString(),
        value: (currentYear - i)
      });
    }
    return years;
  }


  getBooleanFromString(value: string): boolean {
    if (value.toLowerCase() === "true") {
      return true;
    } else if (value.toLowerCase() === "false") {
      return false;
    } else {
      throw new Error("Invalid boolean string");
    }
  }

  sanitizeInput(text) {
    'use strict';
    return text.replace(/[\"&'\/<>]/g, function (a) {
      return {
        '"': '&quot;', '&': '&amp;', "'": '&#39;',
        '/': '&#47;', '<': '&lt;', '>': '&gt;'
      }[a];
    });
  }


  validateAllFormFields(formGroup?: UntypedFormGroup) {
    if (formGroup) {

      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.validateAllFormFields(control);
        }
      });
    }

  }


  formatMoney(num: number): string {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixNum = Math.floor(('' + num).length / 3);
    let result = num / Math.pow(1000, suffixNum);
    result = Math.round(result * 100) / 100;
    return result + suffixes[suffixNum];
  }

  compareObjects(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
    // Get the keys that exist in both objects
    const commonKeys = Object.keys(obj1).filter(key => obj2.hasOwnProperty(key));

    // Check if the values for these keys are equal in both objects
    for (const key of commonKeys) {
      if (obj1[key] !== obj2[key]) {
        return false; // Values for at least one common key are different
      }
    }

    // All values for common keys are the same
    return true;
  }


  deepEqualForObjects(obj1: object, obj2: object): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !this.deepEqualForObjects(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  getDifferentKeys(obj1: object, obj2: object): string[] {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = Array.from(new Set([...keys1, ...keys2]));
    const differentKeys = allKeys.filter(key => obj1[key] !== obj2[key]);
    return differentKeys;
  }

  combineObjects(arr: object[]): object {
    return arr.reduce((result, obj) => {
      Object.keys(obj).forEach((key) => {
        result[key] = obj[key];
      });
      return result;
    }, {});
  }

  removeObjectNullKeys(obj: { [key: string]: any }): { [key: string]: any } {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  subStringText(text: string, allowedLength: number) {
    if (text.length > allowedLength) {
      return text.substring(0, allowedLength) + '....';
    }
    return text;
  }

  formatNumber(value: number, minimumFractionDigits = 0, maximumFractionDigits = 0): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);
  }

  // checkExistenceInArray(arrayData: any[], key:string, value: string) {
  //   arrayData.
  // }
}

export interface Year {
  name: string,
  value: number
}


