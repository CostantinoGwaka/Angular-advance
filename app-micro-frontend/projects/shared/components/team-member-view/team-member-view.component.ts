import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import { StorageService } from '../../../services/storage.service';
import { fadeInOut } from 'src/app/shared/animations/router-animation';
import {
  PREPARE_APPOINTMENT_LETTER,
  PREPARE_TEAM_MEMBER_APPOINTMENT_LETTER
} from '../invitation-letter/store/invitation-letter.graph';
import { fadeIn } from '../../animations/basic-animation';
import { AttachmentService } from '../../../services/attachment.service';
import { SettingsService } from '../../../services/settings.service';
import { AlertDialogService } from '../alert-dialog/alert-dialog-service.service';
import { LayoutService } from '../../../services/layout.service';
import {
  FIND_TEAM_ASSIGNMENT_BY_UUID,
  GET_EVALUATION_COMMITEE_BY_UUID
} from '../../../modules/nest-tender-evaluation/store/evaluation-commitee/evaluation-commitee.graphql';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { SortByPipe } from '../../pipes/sort-pipe';
import { FullDataTableComponent } from '../full-data-table/full-data-table.component';
import { LoaderComponent } from '../loader/loader.component';


@Component({
  selector: 'app-team-member-viewer',
  templateUrl: './team-member-view.component.html',
  styleUrls: ['./team-member-view.component.scss'],
  animations: [fadeIn, fadeInOut],
  standalone: true,
  imports: [LoaderComponent, FullDataTableComponent, SortByPipe],
})
export class TeamMemberViewerComponent implements OnInit {
  @Input() members: any[] = [];
  @Input() loading = false;
  @Input() hideActionButton = false;
  @Input() viewOnly = false;
  @Input() isForTask = false;
  @Input() allowLetterSigning = false;
  @Output() onViewLetterEvent: EventEmitter<any> = new EventEmitter();
  @Output() onPrepareLetterEvent: EventEmitter<any> = new EventEmitter();
  @Output() onUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onReplaceMemberEvent: EventEmitter<any> = new EventEmitter();
  userSystemAccessRoles: string;
  currentUserUuid: string;
  @Input() type: string;
  @Input() evaluationTeamUuid: string;
  committeeInfo: any = {};
  selectedMember: string;
  currentMember: any;
  currentView: string;
  showConfirm: boolean;
  loadingDocument: boolean;
  savingData: boolean;

  tableConfigurations: any = {
    tableColumns: [
      { label: 'Member', name: 'fullName' },
      { label: 'Institution', name: 'memberInstitution' },
      { label: 'Designation', name: 'designation' },
      { label: 'Position', name: 'appointedTitle' },
      { label: 'Email', name: 'email' },
      { label: 'Phone Number', name: 'phoneNumber' },
    ],
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: false,
    useFullObject: true,
    showBorder: true,
    allowPagination: false,
    actionIcons: {
      edit: false,
      delete: false,
      more: false,
      print: false,
      customPrimary: true,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    customPrimaryMessage: '',
    empty_msg: 'No  Records found',
  };

  constructor(
    private apollo: GraphqlService,
    private settingServices: SettingsService,
    private attachmentService: AttachmentService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private layoutService: LayoutService,
    private authService: AuthService,
    private alertDialogService: AlertDialogService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.evaluationTeamUuid) {
      this.fetchCommitteeDetails(this.evaluationTeamUuid).then();
    }

    this.initAccess();

    if (this.hideActionButton) {
      this.tableConfigurations.actionIcons.customPrimary = false;
    }
  }

  initAccess() {
    this.currentUserUuid = this.storageService.getItem('userUuid');

    if (this.currentUserUuid) {
      /** storageService.getItem gives a string with double quotes - use replace to remove them */
      this.currentUserUuid = this.currentUserUuid.replace(/"/g, '');
    }

    this.userSystemAccessRoles = this.storageService.getItem(
      'userSystemAccessRoles'
    );
    this.tableConfigurations = {
      ...this.tableConfigurations,
      userAccessRoles: {
        canSignLetter: this.authService.hasPermission(
          'ROLE_TNDR_EVL_TEAM_MANAGEMENT_SIGN_APPTMNT_LETTER'
        ),
        canPrepareLetter: this.authService.hasPermission(
          'ROLE_TNDR_EVL_TEAM_MANAGEMENT_PRAPR_APPTMNT_LETTER'
        ),
      },
    };
  }

  ofPE() {
    return true;
  }

  toggle(member: any) {
    if (this.selectedMember == member.uuid) {
      this.selectedMember = null;
    } else {
      this.selectedMember = member.uuid;
    }
  }

  replaceMember(member: any) {
    this.onReplaceMemberEvent.emit(member);
  }

  viewLetter(member) {
    this.onViewLetterEvent.emit(member);
  }

  async previewSignedDocument(attachment) {
    try {
      this.loadingDocument = true;
      if (attachment) {
        const data = await this.attachmentService.getSignedAttachment(
          attachment
        );
        this.settingServices.viewFile(data, 'pdf').then(() => {
          this.loadingDocument = false;
        });
      } else {
        this.loadingDocument = false;
        this.notificationService.errorSnackbar(
          'Failed to fetch appointment letter document '
        );
      }
    } catch (e) {
      console.error(e);
      this.loadingDocument = false;
      this.notificationService.errorSnackbar(
        'Failed to fetch appointment letter document '
      );
    }
  }

  async prepareLetterAppointmentLetter(member) {
    try {
      this.savingData = true;
      const response: any = await this.apollo.mutate({
        mutation: PREPARE_TEAM_MEMBER_APPOINTMENT_LETTER,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          memberUuid: member.uuid,
        },
      });

      if (response.data.prepareTeamMemberAppointmentLetter.code === 9000) {
        this.savingData = false;
        this.showConfirm = false;
        this.notificationService.successMessage(
          'Appointment letter prepared, successfully'
        );
        this.fetchCommitteeDetails(
          member?.teamAssignment?.uuid
        ).then((_) => {
          this.onPrepareLetterEvent.emit(this.committeeInfo);
        });
      } else {
        this.savingData = false;
        this.showConfirm = false;
        this.notificationService.errorSnackbar(
          'Failed to prepare appointment letter: ' +
          response.data.prepareTeamMemberAppointmentLetter.message +
          ', please try again....'
        );
      }
    } catch (e) {
      console.error(e);
      this.savingData = false;
      this.showConfirm = false;
      this.notificationService.errorSnackbar(
        'Failed to prepare appointment letter, please try again....'
      );
    }
  }

  async buttonSelected(member) {
    //
    const dialogRef = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
      data: {
        mainLoaderMessage: 'Getting Data...',
      },
    });

    if (member.appointmentLetterSigned) {
      await this.previewSignedDocument(
        member?.signedAppointmentLetterUuid
      ).then();
    } else if (member.hasAppointmentLetter) {
      this.viewLetter(member);
    } else {
      await this.prepareMemberLetter(member).then();
    }
    dialogRef.close();
  }

  mapFunction(item) {
    let primaryMessage = '';
    if (
      this.tableConfigurations.userAccessRoles?.canPrepareLetter &&
      !item.hasAppointmentLetter
    ) {
      primaryMessage = 'Prepare appointment letter';
    } else if (
      this.tableConfigurations.userAccessRoles?.canSignLetter &&
      item.hasAppointmentLetter &&
      !item.appointmentLetterSigned
    ) {
      primaryMessage = 'Sign appointment letter';
    } else if (item.hasAppointmentLetter || item.appointmentLetterSigned) {
      primaryMessage = 'View appointment letter';
    }

    return {
      ...item,
      appointedTitle: item.position,
      fullName: `${item?.firstName} ${item?.middleName} ${item?.lastName}`,
      customPrimaryMessage: primaryMessage,
      actionButtons: {
        delete: false,
        customPrimary: !this.viewOnly
          ? true
          : item.hasAppointmentLetter || item.appointmentLetterSigned,
        edit: false,
      },
    };
  }

  async prepareMemberLetter(event: any) {
    this.alertDialogService
      .openDialog({
        title:
          'You are about to prepare appointment letter for\n' + event.fullName,
        message: 'Do you want to continue?',
      })
      .then(async (action) => {
        if (action) {
          this.prepareLetterAppointmentLetter(event).then();
        }
      });
  }

  async fetchTeamAssignmentDetails(selectedUuid: string) {
    try {
      this.loading = true;
      const response: any = await this.apollo.fetchData({
        query: FIND_TEAM_ASSIGNMENT_BY_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: selectedUuid,
        },
      });

      if (response?.data?.findTeamAssignmentByUuid?.code === 9000) {
        this.committeeInfo = response?.data?.findTeamAssignmentByUuid?.data;
        this.members = this.committeeInfo?.teamMembers;
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }

  async fetchCommitteeDetails(selectedUuid: string) {
    try {
      this.loading = true;
      const response: any = await this.apollo.fetchData({
        query: GET_EVALUATION_COMMITEE_BY_UUID,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: selectedUuid,
        },
      });

      if (response?.data?.getTenderEvaluationCommittee?.code === 9000) {
        this.committeeInfo = response?.data?.getTenderEvaluationCommittee?.data;
        this.members = this.committeeInfo?.tenderEvaluationCommitteeInfos;
      } else {
        /// try team assignment
        await this.fetchTeamAssignmentDetails(selectedUuid);
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }
}
