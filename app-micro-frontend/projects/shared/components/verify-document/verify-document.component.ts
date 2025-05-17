import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { firstValueFrom, Observable, ReplaySubject } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Data } from "../sharable-verify-document-form/sharable-verify-document-form.component";
import { NotificationService } from "../../../services/notification.service";
import { fadeIn } from "../../animations/router-animation";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../loader/loader.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-verify-document',
    templateUrl: './verify-document.component.html',
    styleUrls: ['./verify-document.component.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [
    LoaderComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    DatePipe
],
})

export class VerifyDocumentComponent implements OnInit {

  loading: boolean = true;
  resultData: Data;
  currentView: string = 'fileUploader';

  @Input() buttonText: string = 'Go Back';
  @Input() buttonIcon: string = 'arrow_back';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void { }


  onFileSelected(event) {
    this.currentView = 'uploading';
    this.convertFile(event.target.files[0]).subscribe(async (base64) => {
      await this.verifyDocument(base64);
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

    try {
      const url = environment.SERVER_URL + '/nest-dsms/api/signature/validate-pdf';
      const headers = {
        headers: new HttpHeaders({
        })
      };

      const result: any = await firstValueFrom(this.http.post(url, base64Output, headers));



      // {"name":null,"reason":null,"contact":null,"signedDate":null,"status":"DOCUMENT_NOT_SIGNED"}
      if (result['status'] == 'VERIFIED') {
        this.currentView = 'validSignature';
        this.resultData = result;
      } else {
        this.resultData = null;
        this.currentView = 'invalidSignature';
      }
    } catch (e) {

      this.resetVerification();
      this.notificationService.errorMessage('Something went wrong while validating. Please try again');
    }

  }

  resetVerification() {
    this.currentView = 'fileUploader';
  }
}
