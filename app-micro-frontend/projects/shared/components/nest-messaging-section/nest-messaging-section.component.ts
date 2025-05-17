import { TENDERER_MY_DETAILS } from './../../../modules/nest-uaa/store/user-management/user/user.graphql';
import { SettingsService } from '../../../services/settings.service';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { CREATE_CLARIFICATION } from './../../../modules/nest-tenderer/store/clarification/clarification.graphql';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CREATE_CHAT_CONVERSATION } from './../../../modules/nest-communication-tool/store/chat/chat-tool.graphql';
import { NotificationService } from '../../../services/notification.service';
import { GraphqlService } from '../../../services/graphql.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Store } from '@ngrx/store';
import { ApplicationState } from 'src/app/store';
import { TOOL_BAR_POSITION, WordProcessorComponent } from '../../word-processor/word-processor.component';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SubjectSectionComponent } from './subject-section/subject-section.component';
import { MatIconModule } from '@angular/material/icon';
import { ToAreaComponent } from './to-area/to-area.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-nest-messaging-section',
  templateUrl: './nest-messaging-section.component.html',
  styleUrls: ['./nest-messaging-section.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [ToAreaComponent, MatIconModule, SubjectSectionComponent, MatFormFieldModule, MatInputModule, FormsModule, WordProcessorComponent, LoaderComponent, UpperCasePipe]
})
export class NestMessagingSectionComponent implements OnInit {
  selectedToolBarButtons: any = [
    ['bold', 'italic', 'underline', 'strike'],
    ['justifyLeft', 'justifyCenter', 'justifyRight'],
    ['orderedList', 'unOrderedList'],
    ['removeFormat'],
  ];

  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    private _bottomSheet: MatBottomSheet,
    private settingService: SettingsService,
    private store: Store<ApplicationState>
  ) { }

  toolBarPosition: TOOL_BAR_POSITION = TOOL_BAR_POSITION.BOTTOM;
  // editorContent:string = `Dear All.<br/> <br/>          is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
  editorContent: string = '';
  selectedTopicUid: string | null = null;
  message: string = "";
  selecetdEmail: string | null = null;
  @Output() sendMessageDone = new EventEmitter<any>();
  @Output() closeButtonComposed = new EventEmitter<boolean>();
  @Input() to: string = '';
  @Input() subject: string = '';
  @Input() entityType: string = 'TENDER';
  @Input() convo: string = '';
  userSubject: string = '';
  @Input() isInternalClarification: boolean;
  @Input() procurementRequisitionUuid: string = '';
  @Input() tenderUuid: string = '';
  @Input() procurementEntityUuid: string = '';
  @Input() tenderNumber: string = '';
  @Input() clarificationHeadSubject: string = '';
  @Input() draftsubject: string = '';
  @Input() draftMessage: string = '';
  @Input() uuidDraft: string = '';
  @Input() senderTag: string = '';
  @Input() procurementEntityId: number;
  sendMessageBtn: boolean = false;
  file: File;
  fileName: any;
  fileSize: string;
  subjectMin: string
  file_Size: number;
  extension: string;
  base64?: string;
  selectedFile: boolean = false;
  blob?: string;
  attachmentDocuments: any[] = [];
  itemData: any;
  loadmenu: boolean = false;

  ngOnInit(): void {
    if (this.draftsubject != '') {
      this.userSubject = this.draftsubject;
    }

    if (this.draftMessage != '') {
      this.editorContent = this.draftMessage;
    }

    this.getDetails();
  }

  selectedSubjectTitleUuid(event: any) {
    this.selectedTopicUid = event;
  }

  selectedEmail(event: any) {
    this.selecetdEmail = event;
  }

  async getDetails() {
    this.loadmenu = true;
    const result: any = await this.apollo.fetchData({
      apolloNamespace: ApolloNamespace.uaa,
      query: TENDERER_MY_DETAILS,
    });
    this.loadmenu = false;
    this.itemData = result.data?.myDetails;
  }

  closeBtn() {
    this.draftsubject = '';
    this.draftMessage = '';
    this.userSubject = '';
    this.closeButtonComposed.emit(false);
  }

  subStringSubjectTitle(title: string) {
    if (title.length > 70) {
      const subTitle = title.substring(0, 70)
      this.subjectMin = subTitle + "....";
    } else {
      this.subjectMin = title;
    }
    return this.subjectMin.toUpperCase();
  }

  checkMessageLength(message: string) {
    if ((message === null) || (message === ''))
      return false;
    else
      message = message.toString();
    return message.replace(/<[^>]*>/g, '');
  }

  attachFile(event: any) {
    this.file = event.target.files[0] as File;
    this.fileName = (this.file?.name.length > 20) ? this.file?.name.substring(0, 12) + '...' : this.file?.name;
    this.fileName = this.file?.name;
    this.extension = this.file?.type;
    this.file_Size = +parseFloat((this.file.size / 1000000).toFixed(5));

    // this.message =  'File Size : ' + this.fileSize + 'MB';

    if (this.file && this.file.type === 'application/pdf') {

      const reader: any = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.base64 = reader?.result?.toString().split(',')[1];
          this.blob = this.settingService.b64toBlob(reader.result.toString().split(',')[1], this.extension); //'application/pdf'
          this.selectedFile = true;
        };
      }

    } else {
      this.notificationService?.errorMessage('Only PDF files Allowed');
    }
  }


  async sendMessage() {
    let url: any;
    try {
      let response: any;
      this.sendMessageBtn = true;
      if (this.to == '' && this.subject == '') {
        //first time
        response = await this.apollo.mutate({
          mutation: CREATE_CHAT_CONVERSATION,
          apolloNamespace: ApolloNamespace.communication,
          variables: {
            chatDTO: {
              conversationTopicUuid: this.selectedTopicUid,
              message: this.message,
              recipientList: [this.selecetdEmail]
            },
          },
        });
        const message = {
          conversationTopicUuid: this.selectedTopicUid,
          message: this.message,
          sent: true,
        };
        if (response.data.createChat?.code != 9000) {
          throw new Error();
        } else {
          this.notificationService.successMessage('Message Sent Successfully');
          this.sendMessageDone.emit(message);
        }
        window.location.reload(); //reload after send
      } else if (this.subject == 'clarification') {

        if (this.userSubject == "") {
          this.notificationService.errorMessage('Provide your subject');
          return;
        }

        if (this.senderTag != '' && this.senderTag == "TENDERER") {
          url = "tender-initiation/published-tenders/" + this.tenderUuid;
        } else if (this.senderTag != '' && this.senderTag == "PE") {
          url = "tenders/" + this.tenderUuid;
        }

        //clarification creation
        if (this.uuidDraft != '') {

          response = await this.apollo.mutate({
            mutation: CREATE_CLARIFICATION,
            apolloNamespace: ApolloNamespace.submission,
            variables: {
              clarificationDto: {
                isInternalClarification: this.isInternalClarification,
                procurementRequisitionUuid: this.procurementRequisitionUuid,
                question: this.message,
                tenderUuid: this.tenderUuid,
                entityType: this.entityType,
                title: this.userSubject,
                procuringEntityUuid: this.procurementEntityUuid,
                tenderNumber: this.tenderNumber,
                attachmentList: this.selectedFile ? this.base64 : [],
                isDraft: false,
                uuid: this.uuidDraft,
                url: url,
              },
            },
          });
        } else {
          response = await this.apollo.mutate({
            mutation: CREATE_CLARIFICATION,
            apolloNamespace: ApolloNamespace.submission,
            variables: {
              clarificationDto: {
                isInternalClarification: this.isInternalClarification,
                procurementRequisitionUuid: this.procurementRequisitionUuid,
                question: this.message,
                tenderUuid: this.tenderUuid,
                entityType: this.entityType,
                title: this.userSubject,
                procuringEntityUuid: this.procurementEntityUuid,
                tenderNumber: this.tenderNumber,
                attachmentList: this.selectedFile ? this.base64 : [],
                isDraft: false,
                url: url,
              },
            },
          });
        }
        const message = {
          isInternalClarification: this.isInternalClarification,
          procurementRequisitionUuid: this.procurementRequisitionUuid,
          question: this.message,
          tenderUuid: this.tenderUuid,
          title: this.userSubject,
          procuringEntityUuid: this.procurementEntityUuid,
          tenderNumber: this.tenderNumber,
          attachmentList: this.selectedFile ? this.base64 : [],
          url: url,
          sent: true,
        };
        if (response.data.createClarification?.code != 9000) {
          throw new Error();
        } else {
          this.notificationService.successMessage('Clarification Sent Successfully');
          // window.location.reload(); //reload after sends
          this.sendMessageDone.emit(message);
        }
      } else {
        //replyg
        response = await this.apollo.mutate({
          mutation: CREATE_CHAT_CONVERSATION,
          apolloNamespace: ApolloNamespace.communication,
          variables: {
            chatDTO: {
              message: this.message,
              recipientList: [this.to],
              conversationUuid: this.convo
            },
          },
        });
        if (response.data.createChat?.code != 9000) {
          throw new Error();
        } else {
          this.notificationService.successMessage('Message Sent Successfully');
          window.location.reload(); //reload after send
          this.sendMessageDone.emit(true);
        }
      }

    } catch (e) {
      this.sendMessageBtn = true;
      if (this.message == "" || this.to == "" || this.selectedTopicUid == "" || this.convo) {
        this.notificationService.errorMessage('Please meake sure you provide message and receipent');
      } else {
        this.notificationService.errorMessage('Failed to Sent Message');

      }
      this.sendMessageDone.emit(true);
    }
    this.sendMessageBtn = true;
  }

  selectFile() { }

  async saveDraft() {
    try {
      let response: any;
      if (this.subject == 'clarification') {
        if (this.userSubject == "") {
          this.notificationService.errorMessage('Provide your subject');
          return;
        }
        //clarification creation
        if (this.draftsubject != '') {
          response = await this.apollo.mutate({
            mutation: CREATE_CLARIFICATION,
            apolloNamespace: ApolloNamespace.submission,
            variables: {
              clarificationDto: {
                isInternalClarification: this.isInternalClarification,
                procurementRequisitionUuid: this.procurementRequisitionUuid,
                question: this.message,
                tenderUuid: this.tenderUuid,
                title: this.userSubject,
                entityType: this.entityType,
                procuringEntityUuid: this.procurementEntityUuid,
                tenderNumber: this.tenderNumber,
                attachmentList: this.selectedFile ? this.base64 : [],
                isDraft: true,
                uuid: this.uuidDraft,
                url: "",
                procurementEntityId: this.procurementEntityId

              },
            },
          });
        } else {
          response = await this.apollo.mutate({
            mutation: CREATE_CLARIFICATION,
            apolloNamespace: ApolloNamespace.communication,
            variables: {
              clarificationDto: {
                isInternalClarification: this.isInternalClarification,
                procurementRequisitionUuid: this.procurementRequisitionUuid,
                question: this.message,
                tenderUuid: this.tenderUuid,
                title: this.userSubject,
                entityType: this.entityType,
                procuringEntityUuid: this.procurementEntityUuid,
                tenderNumber: this.tenderNumber,
                attachmentList: this.selectedFile ? this.base64 : [],
                isDraft: true,
                url: "",
                procurementEntityId: this.procurementEntityId

              },
            },
          });
        }

        if (response.data.createClarification?.code != 9000) {
          throw new Error();
        } else {
          this.notificationService.successMessage('Clarification Sent Successfully');
          window.location.reload(); //reload after send
          this.sendMessageDone.emit(true);
        }
      }

    } catch (e) {
      if (this.message == "" || this.to == "" || this.selectedTopicUid == "" || this.convo) {
        this.notificationService.errorMessage('Please meake sure you provide message and receipent');
      } else {
        this.notificationService.errorMessage('We understand you may have further questions, but please note that we have reached the limit for clarifications at this time. Thank you for your cooperation and understanding.');
      }
      this.sendMessageDone.emit(true);
    }
  }

  selectImage() {
  }

  onEditorChanged(event: any) {
    this.message = event;
  }

}
