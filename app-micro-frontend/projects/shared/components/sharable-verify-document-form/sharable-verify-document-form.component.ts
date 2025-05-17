import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, Observable, ReplaySubject } from 'rxjs';
import { SettingsService } from '../../../services/settings.service';
import { AttachmentSharable } from 'src/app/store/global-interfaces/organizationHiarachy';
import { environment } from 'src/environments/environment';
import { fadeSmooth } from '../../animations/router-animation';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { SaveAreaComponent } from '../save-area/save-area.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';


export interface Data {
  name?: string;
  reason?: string;
  contact?: string;
  signedDate?: string;
  status?: string;
}

@Component({
    selector: 'app-sharable-verify-document-form',
    templateUrl: './sharable-verify-document-form.component.html',
    styleUrls: ['./sharable-verify-document-form.component.scss'],
    animations: [fadeSmooth],
    standalone: true,
    imports: [MatIconModule, MatTooltipModule, FormsModule, ReactiveFormsModule, MatRippleModule, RouterLink, MatProgressBarModule, SaveAreaComponent, ReplacePipe]
})
export class SharableVerifyDocumentFormComponent implements OnInit {
  close(arg0: boolean) {
    throw new Error('Method not implemented.');
  }
  isLoading: boolean;
  save() {
    throw new Error('Method not implemented.');
  }

  @Input() attachmentList: AttachmentSharable[] = [];

  file: File;
  fileName: any;
  fileSize: string;
  file_Size: number;
  message: string;
  extension: string;
  base64?: string;
  blob?: string;
  resultData: Data;

  attachmentForm: UntypedFormGroup;
  //attachmentTypes: any[] = [{id:1, name:'Drawings'}, {id:2, name:'Sample'}];
  showForm = false;
  showAttachBtn = true;

  constructor(
    private settingService: SettingsService,
    private fb: UntypedFormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {

    this.attachmentForm = this.fb.group({
      //description: [null, Validators.required],
      //attachmentType: [null, Validators.required],
      fileContent: [null],
    });

  }

  base64Output: string = '';

  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }


  async verifyDocument(base64Output: string) {
    const url = environment.SERVER_URL + '/nest-dsms/api/signature/validate-pdf'

    const headers = {
      headers: new HttpHeaders({
      })
    };

    const result = await firstValueFrom(this.http.post(url, base64Output, headers));
    this.resultData = result;
    return result
  }










  addAttachmentToList(event: any) {
    this.file = event.target.files[0] as File;
    //this.fileName =  (this.file?.name.length > 20) ? this.file?.name.substring(0, 12) + '...' : this.file?.name;
    this.fileName = this.file?.name;
    this.extension = this.file?.type;
    this.file_Size = +parseFloat((this.file.size / 1000000).toFixed(5));

    this.message = 'File Size : ' + this.fileSize + 'MB';

    if (this.file_Size > 20) return;

    const reader: any = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.base64 = reader?.result?.toString().split(',')[1];
        this.blob = this.settingService.b64toBlob(reader.result.toString().split(',')[1], this.extension); //'application/pdf'
        this.attachmentList.push({
          attachmentType: this.attachmentForm.get('attachmentType').value,
          description: this.attachmentForm.get('description').value,
          title: this.fileName,
          attachmentBase64: this.base64,
          // blob: this.blob
        });
        this.showAttachBtn = true;
        this.showForm = false;
        this.attachmentForm.reset();
      };
    }
  }





  showAttachForm() {
    if (!this.showForm) {
      this.showForm = true;
      this.showAttachBtn = false;
    }
  }

  removeAttachment(i: number) {
    if (this.attachmentList.length > 0) {
      this.attachmentList.splice(i);
    }
  }
}
