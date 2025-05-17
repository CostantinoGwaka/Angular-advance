import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { AttachmentSharable } from '../../../store/global-interfaces/organizationHiarachy';
import { SettingsService } from '../../../services/settings.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fadeSmooth } from '../../animations/router-animation';
import { AttachmentService } from '../../../services/attachment.service';
import { ManageRequisitionAttachmentService } from '../../../services/manage-requisition-attachment.service';
import { NotificationService } from '../../../services/notification.service';
import { LoaderComponent } from '../loader/loader.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InlineConfirmComponent } from '../inline-confirm/inline-confirm.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
    selector: 'app-sharable-attachment-form',
    templateUrl: './sharable-attachment-form.component.html',
    styleUrls: ['./sharable-attachment-form.component.scss'],
    animations: [fadeSmooth],
    standalone: true,
    imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    InlineConfirmComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
    LoaderComponent
],
})
export class SharableAttachmentFormComponent implements OnInit, OnChanges {
  @Input() attachmentList: AttachmentSharable[] = [];
  @Output() saveAttachmentFn = new EventEmitter<AttachmentSharable>();
  @Output() newListAfterRemove = new EventEmitter<any>();
  @Input() loadSavingAttachment: boolean;
  @Input() loadExistingAttachments: boolean;
  @Input() viewMode = false;
  @Input() actionFromMerging = false;
  @Input() showDescription = true;
  newAttachment: AttachmentSharable;

  file: File;
  fileName: any;
  fileSize: string;
  file_Size: number;
  message: string;
  extension: string;
  base64?: string;
  blob?: string;

  FILE_SIZE_LIMIT: number = 200; //200MB

  attachmentForm: UntypedFormGroup;
  attachmentTypes: any[] = [
    { id: 1, name: 'Drawings' },
    { id: 2, name: 'Sample' },
    { id: 3, name: 'Reports' },
    { id: 4, name: 'Specifications' },
    { id: 5, name: 'Other' },
  ];

  fileTypes = ['.pdf', '.jpeg', '.png', '.gif'];
  showForm = false;
  loadViewAttachment: { [index: number]: boolean } = {};
  confirmDeleteAttachment: { [index: number]: boolean } = {};
  loadDeletingAttachment: { [index: number]: boolean } = {};

  constructor(
    private settingService: SettingsService,
    private fb: UntypedFormBuilder,
    private attachmentService: AttachmentService,
    private notificationService: NotificationService,
    private manageRequisitionAttachmentService: ManageRequisitionAttachmentService
  ) {
  }

  ngOnInit(): void {
    this.attachmentForm = this.fb.group({
      description: [null, Validators.required],
      attachmentType: [null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['attachmentList'] !== undefined && changes['attachmentList'] !== null) {
      this.attachmentList = changes['attachmentList'].currentValue;
    }
    if (
      changes['loadSavingAttachment'] !== undefined && changes['loadSavingAttachment'] !== null) {
      this.loadSavingAttachment = changes['loadSavingAttachment'].currentValue;
    }
    if (
      changes['loadExistingAttachments'] !== undefined && changes['loadExistingAttachments'] !== null) {
      this.loadExistingAttachments =
        changes['loadExistingAttachments'].currentValue;
    }
  }

  addAttachmentToList(event: any) {
    this.file = event.target.files[0] as File;
    //this.fileName =  (this.file?.name.length > 20) ? this.file?.name.substring(0, 12) + '...' : this.file?.name;
    this.fileName = this.file?.name;
    this.extension = this.file?.type;
    this.file_Size = +parseFloat((this.file.size / 1000000).toFixed(5));

    this.message = 'File Size : ' + this.fileSize + 'MB';

    if (this.file_Size > this.FILE_SIZE_LIMIT) {
      this.notificationService.errorMessage(
        'File size should not exceede 200MB'
      );
      return;
    }

    const reader: any = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64 = reader?.result?.toString().split(',')[1];
        this.blob = this.settingService.b64toBlob(
          reader.result.toString().split(',')[1],
          this.extension
        ); //'application/pdf'
        this.newAttachment = {
          ... this.attachmentForm.value,
          title: this.fileName,
          attachmentBase64: this.base64,
        };
        this.showForm = false;
        this.attachmentForm.reset();
        this.saveAttachmentFn.emit(this.newAttachment);
      };
    }
  }


  cancelAnAction(i: number) {
    this.confirmDeleteAttachment[i] = false;
  }

  async removeAttachment(attachmentUuid: string, desc: string, title: string, type: string, i: number) {
    this.loadDeletingAttachment[i] = true;
    if (this.actionFromMerging) {
      const foundIndex = this.attachmentList.findIndex((a) => a.description === desc && a.title === title && a.attachmentType === type);
      if (foundIndex > -1) this.attachmentList.splice(foundIndex, 1);
      this.newListAfterRemove.emit(this.attachmentList);
    } else {
      await this.manageRequisitionAttachmentService
        .deleteReqAttachment(attachmentUuid)
        .then((rData) => {
          if (rData) {
            const foundIndex = this.attachmentList.findIndex(
              (a) => a.uuid === attachmentUuid
            );
            if (foundIndex > -1) this.attachmentList.splice(foundIndex, 1);
          }
        });
    }
    this.loadDeletingAttachment[i] = false;
    this.confirmDeleteAttachment[i] = false;
  }

  async viewAttachment(attachment: AttachmentSharable, i: number) {
    const splitFileTitles: string[] = attachment?.title.split('.');
    const fileType: string = splitFileTitles[splitFileTitles?.length - 1];
    this.loadViewAttachment[i] = true;
    const response = await this.attachmentService.fetchAttachment(
      attachment.attachmentUuid,
      fileType || 'pdf'
    );
    this.loadViewAttachment[i] = false;
  }
}
