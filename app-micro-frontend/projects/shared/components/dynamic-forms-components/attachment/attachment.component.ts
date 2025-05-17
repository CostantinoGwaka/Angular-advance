import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { AttachmentService } from '../../../../services/attachment.service';
import { SettingsService } from '../../../../services/settings.service';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { FieldConfig } from '../field.interface';
import { HelpTextService } from "../../../../services/help-text.service";
import { environment } from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { NotificationService } from "../../../../services/notification.service";
import { select, Store } from "@ngrx/store";
import { selectModifiedAuthUsers } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { first, map } from "rxjs/operators";
import { AuthUser } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { ApplicationState } from "../../../../store";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OnlyNumberDirective } from '../../../directives/only-number.directive';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-attachment',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './attachment.component.html',
    styleUrls: ['attachment.component.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatIconModule, MatInputModule, OnlyNumberDirective, MatProgressSpinnerModule, NgClass, TranslatePipe]
})

export class AttachmentComponent implements OnInit {
  @Input() field?: FieldConfig;
  @Input() loading = false;
  @Input() group: UntypedFormGroup = new UntypedFormGroup({});
  @Output() fieldValue = new EventEmitter();
  @Output() viewAttachedAttachment = new EventEmitter();

  fileUploadedName?: string;
  attachmentKey?: string;
  selectedFile?: string | ArrayBuffer;
  uploadedImage: any;
  accept?: string;
  attachmentUuid: string;
  showPhoto = false;
  uploading = false;
  deleting = false;
  fileFormat: any;
  uploadedMedia: Array<any> = [];
  uploadedSampleMedia: any = null;
  fileSizeUnit: number = 1024;
  inputValue: string;
  user$: Observable<AuthUser>;
  user: AuthUser;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private settings: SettingsService,
    private store: Store<ApplicationState>,
    private settingService: SettingsService,
    private helpTextService: HelpTextService,
    private attachmentService: AttachmentService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
  ) {
    this.user$ = this.store.pipe(select(selectModifiedAuthUsers), map(users => users[0]));
  }


  ngOnInit() {
    firstValueFrom(this.user$.pipe(first(i => !!i))).then(data => this.user = data);
    this.accept = this.field?.acceptType ? this.field.acceptType.join() : '';
    this.showPhoto = this.field?.acceptType ?
      this.field.acceptType.findIndex(item => item === '.jpg' || item === '.png') > -1 : false;

    /** check if its sample attachment */
    if (this.field?.type == 'sampleAttachment') {

      this.attachmentKey = this.field.key + '_attachment';
      this.group.addControl(
        this.field?.key || 'id',
        new UntypedFormControl('', [])
      );
      this.group.addControl(this.attachmentKey, new UntypedFormControl('', []));

      // check if has an attachment value
      const attachmentValue = this.group.get(this.attachmentKey).getRawValue();

      if (attachmentValue) {
        /// attachment value is available
        this.uploadedSampleMedia = {
          fileName: attachmentValue
        }
        /// set attachmentUuid for prev uploaded doc
        this.attachmentUuid = attachmentValue;
      }

    }
  }

  showAttachment() {
    this.settings.viewFile(this.uploadedImage, this.fileFormat, this.fileUploadedName).then();
  }

  getFileSize(fileSize: number): number {
    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSize = parseFloat(
          (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
        );
      }
    }
    return fileSize;
  }

  getFileSizeUnit(fileSize: number) {
    let fileSizeInWords = 'bytes';

    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit) {
        fileSizeInWords = 'bytes';
      } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSizeInWords = 'KB';
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSizeInWords = 'MB';
      }
    }

    return fileSizeInWords;
  }

  async startProgress(file, indexData) {
    let filteredFile = this.uploadedMedia
      .filter((u, index) => index === indexData)
      .pop();
    if (filteredFile != null) {
      let fileSize = this.getFileSize(file.size);
      let fileSizeInWords = this.getFileSizeUnit(file.size);
      for (
        let f = 0;
        f < fileSize + fileSize * 0.0001;
        f += fileSize * 0.01
      ) {
        filteredFile.fileProgressSize = f.toFixed(2) + ' ' + fileSizeInWords;
        filteredFile.fileProgress = Math.round((f / fileSize) * 100);
        await this.fakeWaiter(Math.floor(Math.random() * 35) + 1);
        this.cdr.detectChanges();
      }
    }
  }


  fakeWaiter(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  removeImage(idx: number) {
    this.uploadedMedia = this.uploadedMedia.filter((u, index) => index !== idx);
    const attachmentFiles = this.uploadedMedia.map(f => f.fileUrl);
    this.group?.controls[this.field?.key as string]?.setValue(!this.field.multiple ? attachmentFiles[0] : attachmentFiles);
    this.fieldValue.emit({
      value: !this.field.multiple ? attachmentFiles[0] : attachmentFiles,
      field: this.field,
      object: !this.field.multiple ? this.uploadedMedia[0] : this.uploadedMedia
    });
  }


  async handleUpload(files) {
    const file = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async (event: any) => {
      this.uploadedSampleMedia = {
        fileName: file.name,
        fileSize:
          this.getFileSize(file.size) +
          ' ' +
          this.getFileSizeUnit(file.size),
        fileType: file.type,
        isImage: file.type.includes('image') || file.type.includes('png')
          || file.type.includes('jpg') || file.type.includes('jpeg'),
        fileUrl: event.target.result,
        fileProgressSize: 0,
        fileProgress: 0,
        ngUnsubscribe: new Subject<any>(),
      }

      if (this.uploadedSampleMedia) {
        await this.uploadDocument(this.uploadedSampleMedia);
      }
    }

    // this.setSampleAttachmentValue();
  }


  async uploadDocument(selectedFile) {
    try {
      this.uploading = true;
      const attachData = await firstValueFrom(
        this.http.post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment`, [{
          createdByUuid: this.user.uuid,
          title: 'UPLOADED BY ' + this.user.email,
          description: 'PE-REQUIREMENT SAMPLE DOC ' + this.user.email,
          model: 'PE-REQUIREMENT',
          subModule: 'PE-REQUIREMENT',
          modelId: 2,
          modelUuid: this.settingService.makeId(),
          base64Attachment: selectedFile?.fileUrl.split(',')[1],
        }]));

      this.uploading = false;
      if (attachData.message === 'ERROR') {
        this.uploadedSampleMedia = null;
        this.notificationService.errorMessage('Failed to upload sample document. Please try again');
      } else {
        this.attachmentUuid = attachData.data[0].uuid;
        this.group.get(this.attachmentKey).setValue(attachData.data[0].uuid);
      }

    } catch (e) {
      console.error(e);
      this.uploading = false;
      this.uploadedSampleMedia = null;
      this.notificationService.errorMessage('Failed to upload sample document. Please try again');
    }
  }


  setSampleAttachmentValue() {
    const inputControl = this.group.get(this.field.key);
    if (this.inputValue && this.inputValue != '' && this.attachmentUuid) {
      this.fieldValue.emit({
        value: { value: this.inputValue, attachmentUuid: this.attachmentUuid },
        field: this.field,
        object: this.uploadedSampleMedia
      });
    }

    if (!this.uploadedSampleMedia) {
      setTimeout(() => {
        inputControl.setErrors({ attachment: true });
        inputControl.markAsDirty();
        inputControl.markAsTouched();
      }, 1);
    }
  }

  processFiles(files) {
    for (const file of files) {
      const reader = new FileReader();
      reader?.readAsDataURL(file); // read file as data url
      reader.onloadend = (event: any) => {
        // called once readAsDataURL is completed

        this.uploadedMedia.push({
          fileName: file.name,
          fileSize:
            this.getFileSize(file.size) +
            ' ' +
            this.getFileSizeUnit(file.size),
          fileType: file.type,
          isImage: file.type.includes('image') || file.type.includes('png')
            || file.type.includes('jpg') || file.type.includes('jpeg'),
          fileUrl: event.target.result,
          fileProgressSize: 0,
          fileProgress: 0,
          ngUnsubscribe: new Subject<any>(),
        });


        this.startProgress(file, this.uploadedMedia.length - 1).then();
        const attachmentFiles = this.uploadedMedia.map(f => f.fileUrl);
        this.group?.controls[this.field?.key as string]?.setValue(!this.field.multiple ? attachmentFiles[0] : attachmentFiles);
        this.fieldValue.emit({
          value: !this.field.multiple ? attachmentFiles[0] : attachmentFiles,
          field: this.field,
          object: !this.field.multiple ? this.uploadedMedia[0] : this.uploadedMedia
        });
      };

    }
  }

  async onFileSelected(event: any) {
    let files: any[] = event?.target?.files || [];

    if (this.field.type === 'sampleAttachment') {
      await this.handleUpload(files);
    } else {
      this.processFiles(files);
    }
  }

  openFile(event) {
    let extensionList = [
      "data:image/jpeg;base64,",
      "data:image/jpg;base64,",
      "data:application/pdf;base64,",
      "data:image/svg+xml;base64,",
      "data:image/png;base64,",
      "data:text/csv;base64,",
      "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
      "data:application/msword;base64,"
    ];

    let formattedFile = '';
    extensionList.forEach(element => {
      if (event.fileUrl.includes(element)) {
        formattedFile = event.fileUrl.replace(element, "");
      }
    })

    this.attachmentService.viewFile(formattedFile, (event.fileType?.split('/') || ['', ''])[1], event.fileName).then()
  }

  fieldChange(event) {
    this.inputValue = event.target.value;
  }

  openHelpPage() {
    this.helpTextService.openHelpPage(
      {
        key: this.field.key,
        label: this.field.label,
        hint: this.field.hint
      }).then();
  }

  async deleteDocument() {
    try {
      this.deleting = true;
      const response = await this.attachmentService.deleteAttachmentDocuments([this.attachmentUuid]);
      if (response === 'SUCCESS') {
        this.attachmentUuid = null;
        this.uploadedSampleMedia = null;
        this.group.get(this.attachmentKey).setValue(null);
        this.notificationService.successMessage('Document deleted successfully');
      } else {
        this.notificationService.errorMessage('Problem occurred while deleting document, please try again');
      }
      this.deleting = false;

    } catch (e) {
      console.error(e);
      this.deleting = false;
      this.notificationService.errorMessage('Problem occurred while deleting document, please try again');
    }
  }

}
