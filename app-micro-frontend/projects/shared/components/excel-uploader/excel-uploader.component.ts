import { success } from '../../../services/svg/icons/success';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import * as XLSX from 'xlsx';
import { MatRippleModule } from '@angular/material/core';


type currentViewTypes = 'fileUploader' | 'uploading' | 'errorView';

export interface ExcelValidationReport {
  status: 'failed' | 'success';
  error?: string;
  message?: string;
}

export interface ExcelUploaderData {
  identifier?: string;
  columns: ExcelUploadColumn[];
  onFileSelected: (
    rows: any[],
    identifier: string,
    uploader: ExcelUploaderComponent
  ) => void;
}

export interface ExcelUploadColumn {
  excelColumnName: string;
  systemColumnName: string;
  isRequired: boolean;
}

@Component({
    selector: 'app-excel-uploader',
    templateUrl: './excel-uploader.component.html',
    standalone: true,
    imports: [MatRippleModule],
})
export class ExcelUploaderComponent implements OnInit {
  currentView: currentViewTypes = 'fileUploader';

  @Input()
  private columns: ExcelUploadColumn[] = [];

  @Input()
  private templateFileName: string = 'template';

  private foundColumnHeaders: string[] = [];

  progress: number = 0;

  errorMessage: string = '';

  constructor(
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ExcelUploaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExcelUploaderData
  ) {
    this.columns = data.columns;
  }

  ngOnInit(): void { }

  public setUploadStarted() {
    this.currentView = 'uploading';
  }

  public setUploadFinished() {
    this.dialogRef.close();
  }

  public showErrorMessage(message: string) {
    this.currentView = 'errorView';
    this.errorMessage = message;
  }

  async onFileSelected(event: any) {
    let jsonData = await this.getFileJsonObject(event);

    if (jsonData?.length > 0) {
      this.data.onFileSelected(jsonData, this.data.identifier, this);
    }
  }

  retryImport() {
    this.currentView = 'fileUploader';
    this.errorMessage = '';
  }

  private extractDataFromExcelFile(file: File): Promise<any[]> {
    let data: any;
    return new Promise((resolve, reject) => {
      try {
        const fileName = file.name;
        const fileSize = parseFloat((file.size / 1000000).toFixed(3)) + 'MB';
        const reader = new FileReader();

        reader.readAsBinaryString(file);
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          this.foundColumnHeaders = Object.entries(ws)
            .filter(([key]) => key.charAt(1) === '1')
            .map(([, value]) => value.v);

          let columnValidation = this.validateColumnsInUploadedFile();

          if (columnValidation.status == 'success') {
            data = XLSX.utils.sheet_to_json(ws);
          } else {
            this.notificationService.errorMessage(columnValidation.message);
          }
        };
        reader.onloadend = () => {
          try {
            resolve(data);
          } catch (e: any) {
            this.notificationService.warningSnackbar(
              'Upload failed, File is empty'
            );
          }
        };
      } catch (e: any) {
        this.notificationService.warningSnackbar('File Upload failed: ' + e);
      }
    });
  }

  private createSampleExcelFile(filename = '') {
    let tableString =
      '<table><tr>' +
      this.columns
        .map((column) => '<th>' + column.excelColumnName + '</th>')
        .join('') +
      '</tr></table>';

    var uri = 'data:application/vnd.ms-excel;base64,',
      table =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table{font-size:12.0pt;}</style></head><body>' +
        tableString +
        '</body></html>',
      base64 = function (s: string) {
        return window.btoa(unescape(encodeURIComponent(s)));
      };

    var link = document.createElement('a');
    link.download = filename + '.xls';
    link.href = uri + base64(table);
    link.click();
  }

  private async getFileJsonObject(event: any) {
    let jsonData: any[] = null;
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
    return jsonData;
  }

  private getFileObject(event: any) {
    return event.target.files[0] as File;
  }

  private fileIsExcel(event: any) {
    return !!event.target.files[0].name.match(/(.xls|.xlsx|.csv)/);
  }

  private validateColumnsInUploadedFile(): ExcelValidationReport {
    let report: ExcelValidationReport = {
      status: 'success',
    };

    if (this.foundColumnHeaders.length < this.columns.length) {
      report.status = 'failed';
    }

    if (report.status == 'success') {
      for (let i = 0; i < this.columns.length; i++) {
        if (
          this.foundColumnHeaders.indexOf(this.columns[i].excelColumnName) < 0
        ) {
          report.status = 'failed';
          report.message =
            "'" + this.columns[i].excelColumnName + "' column was not found";
        }
      }
    }

    return report;
  }

  private validateUploadedFile(data: any[]) {
    let report: ExcelValidationReport = {
      status: 'success',
    };

    if (data.length < 1) {
      report.status = 'failed';
      report.error = 'No data found';
    }

    return report;
  }

  downloadTemplate() {
    this.createSampleExcelFile(this.templateFileName);
    //let workBook = this.createSampleExcelFile();
    //XLSX.writeFile(workBook, this.templateFileName);
  }
}
