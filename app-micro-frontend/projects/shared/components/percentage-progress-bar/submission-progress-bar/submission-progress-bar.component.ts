import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { colors } from 'src/app/shared/colors';
import { CircularProgressBarComponent } from "../../circular-progress-bar/circular-progress-bar.component";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";
import { first, firstValueFrom, Observable, Subscription } from "rxjs";
import {
  selectCriteriaStatus,
  selectedSubmissionUuid,
  selectEntityDetails,
  selectEntityType,
  selectSubmissionCriteriaGroups
} from "../store/submission-progress/submission-progress.selectors";
import { SubmissionProgress } from "../store/submission-progress/submission-progress.model";
import { GraphqlService } from "../../../../services/graphql.service";
import { NotificationService } from "../../../../services/notification.service";
import {
  COMPLETE_SUBMISSION,
  GET_TENDERER_BID_INTEREST,
  RESEND_SUBMISSION_MODIFICATION_EMAIL
} from "../../../../modules/nest-tenderer/store/submission/submission.graphql";
import { BidInterest } from "../../../../modules/nest-tenderer/store/submission/submission.model";
import { WithdrawRequestComponent } from "../withdraw-request/withdraw-request.component";
import { MatBottomSheet, MatBottomSheetConfig } from "@angular/material/bottom-sheet";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IncompleteCriteriaModalComponent } from "../incomplete-criteria-modal/incomplete-criteria-modal.component";
import { ActivatedRoute, Router } from '@angular/router';
import { BillPaymentCheck, EntityObjectTypeEnum } from 'src/app/modules/nest-app/store/tender/tender.model';
import { selectAllUsers } from "../../../../modules/nest-uaa/store/user-management/user/user.selectors";
import { map } from "rxjs/operators";
import { User } from "../../../../modules/nest-uaa/store/user-management/user/user.model";
import { RealTimeClockChange, RealTimeClockChangeType, RealTimeClockService } from "../../../real-time-clock.service";
import {
  GET_OBJECT_ACTUAL_DATE_AND_TIME_BY_UUID_AND_STAGE
} from "../../../../modules/nest-tender-initiation/tender-requisition/store/tender-requisition.graphql";
import { TenderFormComponent } from "./tender-form/tender-form.component";
import { EntityInfoSummary } from "../../tender-info-summary/store/entity-info-summary.model";
import { AttachmentService } from "../../../../services/attachment.service";
import { SettingsService } from "../../../../services/settings.service";
import {
  CHECK_PAYMENT_BY_ENTITY_UUID,
  GENERATE_TENDER_APPLICATION_BILL
} from "../../../../modules/nest-app/store/annual-procurement-plan/annual-procurement-plan.graphql";
import { AuthUser } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import {
  selectModifiedAuthUsers
} from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { GeneratedBill, ViewServiceBillComponent } from "../../view-service-bill/view-service-bill.component";
import {
  SystemPaymentCodeEnum
} from "../../../../modules/nest-billing/billing-settings/payment-code/upsert-payment-code/payment-code-form";
import { PaymentCode } from "../../../../modules/nest-billing/store/billing-settings/payment-code/payment-code.model";
import {
  FIND_PAYMENT_CODE_BY_SYSTEM_CODE
} from "../../../../modules/nest-billing/store/billing-settings/payment-code/payment-code.graphql";
import { SubmissionCriteriaGroup } from "../store/evaluation-progress/evaluation-progress.model";
import { GET_JVC_FOR_SPECIFIC_TENDER } from 'src/app/modules/nest-tenderer/store/joint-venture/joint-venture.graphql';
import { EntityTypeEnum, EntityTypeToEntityModelNameMapping } from "../../../../services/team.service";
import {
  TenderSubCategory,
  TenderSubCategoryProcessApplicableToEntityTypeEnum
} from "../../../../modules/nest-tenderer-management/store/tender-sub-category/tender-sub-category.model";
import {
  GET_PROCESS_APPLICABLE_TO_FROM_TENDER_SUB_CATEGORY_BY_UUID
} from "../../../../modules/nest-tenderer-management/store/tender-sub-category/tender-sub-category.graphql";
import {
  MergedMainProcurementRequisition
} from "../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model";
import {
  GET_MERGED_MAIN_PROCUREMENT_REQUISITION_MINI_BY_UUID_FOR_BILLING,
} from "../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql";
import {
  GET_BILLING_GLOBAL_SETTING_BY_KEY
} from "../../../../modules/nest-billing/store/billing-global-setting/billing-global-setting.graphql";
import { GeneralService } from "../../../../services/general.service";
import { SubmissionActionDialogComponent } from "../submission-action-dialog/submission-action-dialog.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { ConfirmAreaComponent } from '../../confirm-area/confirm-area.component';
import { TinyCircularProgressComponent } from '../../tiny-circular-progress/tiny-circular-progress.component';
import { LoaderComponent } from '../../loader/loader.component';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgTemplateOutlet } from '@angular/common';
import { ApolloNamespace } from "../../../../apollo.config";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedDataInput, PaginatedDataService } from 'src/app/services/paginated-data.service';
import { GET_SUBMISSION_FORM_SUB_CATEGORY_PAGINATED } from 'src/app/modules/nest-tender-evaluation/settings/submission-form-mapping/submission-mapping.graphql';


@Component({
  selector: 'app-submission-progress-bar',
  templateUrl: './submission-progress-bar.component.html',
  styleUrls: ['./submission-progress-bar.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, MatRippleModule, CircularProgressBarComponent, LoaderComponent, TinyCircularProgressComponent, ConfirmAreaComponent, HasPermissionDirective, MatButtonModule, NgTemplateOutlet, MatIconModule]
})
export class SubmissionProgressBarComponent implements OnInit, OnDestroy {
  colors = colors;
  @Input() title: string = 'Submission Progress';
  @Input() showProgress: boolean = true;
  @Input() completionProgress: number = 0;
  @Input() submissionUuid: string;
  @Input() description: string = 'You can only submit your bid once your submission progress has reached 100%';
  @ViewChild(CircularProgressBarComponent) progressRef: CircularProgressBarComponent;
  infoText: { title: string, color: string, showButton: boolean };
  deadlineDate: any;
  showConfirm = false;
  showMoreOptions = false;
  resending = false;
  submissionOpeningDate: string;
  submissionOpeningTime: string;
  deadlineCountDown: string = '';
  deadlineCountClass: string = '';
  deadlineCountTextClass: string = 'text-white';
  deadlineDateHasPassed: boolean = false;
  showDeadlineClock: boolean = false;
  currentLoggedInUser: User;
  summaryList: SubmissionProgress[] = [];
  selectedSubmissionUuid$: Observable<string>;
  selectedEntityDetails$: Observable<EntityInfoSummary>;
  selectedEntityDetails: EntityInfoSummary;
  inCompleteCriteriaList$: Observable<any[]>;
  submissionCriteriaGroups$: Observable<SubmissionCriteriaGroup[]>;
  submissionCriteriaGroups: SubmissionCriteriaGroup[] = [];
  realTimeClockService$: Observable<RealTimeClockChange>;
  totalSubmittedCriteria: number = 0;
  submission: BidInterest;
  powerOfAttorney: {
    uuid: string,
    email: string,
    fullName: string,
    legalCapacity: string
  }
  totalCriteria: number = 0;
  isLoading: boolean = true;
  isSaving: boolean = false;
  checking: boolean = false; /// loader to check criteria
  isWithdrawn: boolean = false;
  hasPowerOfAttorney: boolean = false;
  confirmSubmission: boolean = false;
  loadingForm: boolean = false;
  submissionStatus: boolean = false;
  incompleteCriteriaList = [];
  entityType: EntityObjectTypeEnum;
  subscriptions: Subscription[] = [];
  realTime: string;
  clockIsLoading: boolean = false;

  entitytype: string;
  entityname: string;
  entitynumber: string;
  tenderers: any;
  founderUuid: string;
  founderName: string;
  entityuuid: string;
  nameTenderers: any;
  name: string;
  isSubcontractOrJVC: boolean = false;

  // for billing
  billingStatus: boolean = false;
  failedToGetBillingStatus: boolean = false;
  user$: Observable<AuthUser>;
  currentUser: AuthUser;
  paymentCode: PaymentCode;

  useSubmissionDialog: boolean = true;
  selectedEntityType: EntityTypeEnum = null;
  constructor(
    private notificationService: NotificationService,
    private store: Store<ApplicationState>,
    private apollo: GraphqlService,
    private dialog: MatDialog,
    private bottomSheetDialog: MatBottomSheet,
    private generalService: GeneralService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private attachmentService: AttachmentService,
    private settingServices: SettingsService,
    private paymentDialog: MatDialog,
    private realTimeClockService: RealTimeClockService,
    private paginatedDataService: PaginatedDataService,
    private http: HttpClient,
  ) {
    this.user$ = this.store.pipe(select(selectModifiedAuthUsers), map(users => users[0]));
    this.selectedSubmissionUuid$ = this.store.pipe(select(selectedSubmissionUuid));
    this.subscriptions.push(this.selectedSubmissionUuid$.subscribe(uuid => {
      if (uuid) {
        this.submissionUuid = uuid;
        this.getTendererBidInterest().then();
        // return;

        this.getParams().then(_ => {
          this.inCompleteCriteriaList$ = this.store.pipe(select(selectCriteriaStatus));
          this.submissionCriteriaGroups$ = this.store.pipe(select(selectSubmissionCriteriaGroups));
          this.subscriptions.push(this.submissionCriteriaGroups$.subscribe(list => {
            if (list) {
              this.submissionCriteriaGroups = list;
            }
          }));
          this.subscriptions.push(this.inCompleteCriteriaList$.subscribe(list => {
            if (list) {
              this.calculateSubmissionProgress(list);
              this.incompleteCriteriaList = list.filter(item => !item.isCompleted);
            }
          }));
        });
      }
    })
    );

    this.selectedEntityDetails$ = this.store.pipe(select(selectEntityDetails));
    this.subscriptions.push(this.selectedEntityDetails$.subscribe((entityDetail: EntityInfoSummary) => {
      this.selectedEntityDetails = entityDetail;
    }));
    this.subscriptions.push(this.store.pipe(select(selectEntityType)).subscribe((entityType: EntityTypeEnum) => {
      this.selectedEntityType = entityType;
    }));
  }

  ngOnInit(): void {
    this.initializer().then();
  }

  formatName(stage: string) {
    if (stage.indexOf('Evaluation') >= 0) {
      return stage.replace('Evaluation', "").trim();
    }
    return stage;
  }

  calculateSubmissionProgress(list: any) {
    //// Reset calculations
    this.summaryList = [];
    this.totalCriteria = 0;
    this.totalSubmittedCriteria = 0;

    if (this.submissionCriteriaGroups.length) {
      /// sort groups
      const groupList = [...this.submissionCriteriaGroups];
      this.submissionCriteriaGroups = groupList.sort(
        (a, b) => a.sortNumber - b.sortNumber);

      //// Loop groups
      this.submissionCriteriaGroups.forEach(group => {
        const criteriaList = list.filter(item => item.groupUuid == group.uuid);
        const totalCriteria: number = criteriaList.length;
        const totalSubmittedCriteria: number = criteriaList.filter(item => item.isCompleted).length;

        this.totalCriteria += totalCriteria;
        this.totalSubmittedCriteria += totalSubmittedCriteria;

        this.summaryList.push({
          criteriaGroupUuid: group.uuid,
          totalSubmittedCriteria: totalSubmittedCriteria,
          totalCriteria: totalCriteria,
          criteriaGroupName: this.formatName(group.name),
          percentage: parseInt(
            ((totalSubmittedCriteria / totalCriteria) * 100).toString()
          )
        });
      });

      //// Update main group status
      this.completionProgress = parseInt(
        ((this.totalSubmittedCriteria / this.totalCriteria) * 100).toString()
      );
      this.progressRef?.updateValue(this.completionProgress);
    }
  }

  async initializer(): Promise<void> {
    this.currentUser = await firstValueFrom(this.user$.pipe(first(i => !!i && ['TENDERER', 'DIRECT_MANUFACTURER'].includes(i.userTypeEnum))));
    this.realTimeClockService$ = this.realTimeClockService.getChange();
    this.subscriptions.push(
      this.realTimeClockService$.subscribe((change: RealTimeClockChange) => {
        this.onRealTimeClockChangeEvent(change);
      })
    );
  }

  /// TODO marked for removal
  async onCheckTenderJVC(ruuid, rtype) {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_JVC_FOR_SPECIFIC_TENDER,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererUuid: this.currentUser?.tenderer?.uuid,
          entityUuid: ruuid,
          entityType: rtype,
        },
      });
      const values: any = response.data?.getJointVentureByEntityUuidAndTypeData;
      if (values) {
        this.tenderers = values.data?.jointVentureTenderers;
        this.name = values.data?.name;
        this.nameTenderers = values.data?.jointVentureTenderers?.map((i) => i.tenderer?.name).join(', ');
        this.entitytype = values.data?.entityType;
        this.entityname = values.data?.entityName;
        this.entitynumber = values.data?.entityNumber;
        this.founderUuid = values.data?.founder?.uuid;
        this.founderName = values.data?.founder?.name;
        this.isSubcontractOrJVC = values.data?.isSubcontractOrJVC;
      }
    }

    catch (e) {

    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  async getParams() {
    try {
      const items = await firstValueFrom(this.activeRoute.queryParams);
      this.entityType = items['entityType'];
    } catch (error) {
      console.error('Error retrieving query params:', error);
    }
  }

  async modifyBid() {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      actionBidModify: true,
      entityNumber: this.submission.entityNumber,
      submissionUuid: this.submissionUuid
    };
    config.panelClass = ['bottom__sheet'];
    const bottomSheetDialogRef = this.bottomSheetDialog.open(WithdrawRequestComponent, config);
    bottomSheetDialogRef.afterDismissed().subscribe(async (_) => {
      await this.getTendererBidInterest();
    });

  }
  async submitBidAfterBilling() {
    if (this.useSubmissionDialog) {
      this.openTenderForm();
    } else {
      await this.submitBid();
    }
  }

  async getTenderSumissionForm(): Promise<any[]> {
    this.loadingForm = true;
    const paginatedDataInput: PaginatedDataInput = {
      page: 1,
      pageSize: 20,
      fields: [
        {
          fieldName: "id",
          isSortable: true,
          orderDirection: 'DESC'
        }
      ],
      mustHaveFilters: [
        {
          fieldName: 'subCategoryCode',
          operation: 'EQ',
          value1: this.submission?.entitySubcategoryAcronym,
        }
      ],
      query: GET_SUBMISSION_FORM_SUB_CATEGORY_PAGINATED,
      apolloNamespace: ApolloNamespace.submission,
    };
    this.loadingForm = false;
    return await this.paginatedDataService.getAllData(paginatedDataInput);
  }

  async submitBidWithDialog() {
    this.confirmSubmission = false;
    await this.getBillingStatus();
    if (this.billingStatus && !this.failedToGetBillingStatus) {
      const isNestTenderer = this.currentUser?.tenderer?.isForNest ?? false;
      if (isNestTenderer) {
        await this.submitBidAfterBilling();
      } else {
        this.paymentCode = await this.getPaymentCodeByServiceCode(SystemPaymentCodeEnum.TENDER_APPLICATION);
        if (this.paymentCode) {
          await this.manageTenderPayments(this.selectedEntityDetails?.mainEntityUuid, this.selectedEntityType);
        } else {
          this.notificationService.errorMessage("Tender application code is not available. Please contact system administrator for further assistance");
        }
      }
    }
    else if (!this.billingStatus && !this.failedToGetBillingStatus) {
      await this.submitBidAfterBilling();
    }
    else {
      this.notificationService.errorMessage("Something went wrong. Please retry...");
    }
  }

  async submitBid() {
    try {
      this.isSaving = true;
      const response = await this.apollo.mutate({
        mutation: COMPLETE_SUBMISSION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionUuid: this.submissionUuid,
        },
      });
      if (response.data.completeSubmission) {
        await this.getTendererBidInterest();
        this.notificationService.successMessage('Congratulations your Bid is submitted Successfully.');
      } else {
        console.error(response.data);
      }
      this.isSaving = false;
      this.confirmSubmission = false;
    } catch (e) {
      console.error(e);
      this.isSaving = false;
      this.confirmSubmission = false;
      this.notificationService.errorMessage('Failed to submit bid, Please try again');
    }
  }

  openWithdrawDialog() {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      actionBidModify: false,
      entityNumber: this.submission.entityNumber,
      submissionUuid: this.submissionUuid
    };
    config.panelClass = ['bottom__sheet'];
    const bottomSheetDialogRef = this.bottomSheetDialog.open(WithdrawRequestComponent, config);

    bottomSheetDialogRef.afterDismissed().subscribe(async (_) => {

      await this.getTendererBidInterest();
    });
  }

  requestCancellationRequestDialog() {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      entityNumber: this.submission.entityNumber,
      submissionUuid: this.submissionUuid
    };
    config.panelClass = ['bottom__sheet'];
    const bottomSheetDialogRef = this.bottomSheetDialog.open(SubmissionActionDialogComponent, config);

    bottomSheetDialogRef.afterDismissed().subscribe(async (_) => {
      this.showMoreOptions = false;
      await this.getTendererBidInterest();
    });
  }

  /// TODO marked for removal
  async getObjectActualDateAndTimeByUuidAndStage(mergedMainProcurementUuid: string) {
    try {

      let results: any = await this.apollo.fetchData({
        query: GET_OBJECT_ACTUAL_DATE_AND_TIME_BY_UUID_AND_STAGE,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          procurementStageCode: (this.entityType === EntityObjectTypeEnum.TENDER) ?
            'SUBMISSION_OR_OPENING' : 'PRE_SUBMISSION_OR_OPENING',
          objectUuid: mergedMainProcurementUuid
        }
      });
      if (results.data.getObjectActualDateAndTimeByUuidAndStage?.code === 9000) {
        const data = results.data.getObjectActualDateAndTimeByUuidAndStage.data;

        this.submissionOpeningDate = data?.actualDate;
        this.submissionOpeningTime = data?.actualTime;
        this.deadlineDate = new Date(data?.actualDate + 'T' + data?.actualTime);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /// TODO marked for removal
  async getTendererBidInterest() {
    this.isLoading = true;
    this.infoText = null;
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_TENDERER_BID_INTEREST,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          uuid: this.submissionUuid
        }
      });

      if (response.data.getSubmission.code == 9000) {
        this.submission = response.data.getSubmission.data;
        if (this.submission) {
          this.deadlineDateHasPassed = this.submission.entityStatus === 'OPENED';
          this.showDeadlineClock = this.submission.entityStatus !== 'OPENED';

          this.getObjectActualDateAndTimeByUuidAndStage(this.submission.mainSubmission.entityUuid).then();
          this.onCheckTenderJVC(this.submission.mainSubmission.entityUuid, this.submission.mainSubmission.entityType).then();
          const fullName = this.submission.mainSubmission.powerOfAttorneyFirstName + ' ' +
            this.submission.mainSubmission.powerOfAttorneyLastName;

          this.powerOfAttorney = {
            uuid: this.submission.mainSubmission.powerOfAttorneyUuid,
            email: this.submission.mainSubmission.powerOfAttorneyEmail,
            fullName: fullName,
            legalCapacity: this.submission.mainSubmission.powerOfAttorneyLegalCapacity
          }

          this.currentLoggedInUser = await firstValueFrom(
            this.store.pipe(
              select(selectAllUsers),
              map((items) => items[0]),
              first((i) => !!i)
            )
          );

          this.hasPowerOfAttorney = this.powerOfAttorney.email == this.currentLoggedInUser.email;
          if (!this.hasPowerOfAttorney) {
            this.description = null;
            this.title = `To submit, modify or withdraw bid requires a person appointed as power of attorney to
            submit this bid Appointed power of attorney is ${this.powerOfAttorney.fullName},
            contact email is ${this.powerOfAttorney.email}`
          }
          this.submissionStatus = this.submission.submitted;

          if (this.submission.submissionWithdrawState == 'ACTIVE' && this.submissionStatus) {
            this.title = 'Submission Completed';
            this.description = 'Congratulations, your submission is submitted successfully'
          } else if (this.submission.submissionWithdrawState == 'PENDING_WITHDRAW' && this.submissionStatus) {
            this.title = 'Submission is pending withdraw approval';
            this.description = 'Approval request is sent to tenderer email, check the email to confirm withdraw request'
          } else if (this.submission.submissionWithdrawState == 'WITHDRAWN') {
            this.isWithdrawn = true;
            this.title = 'Submission withdrawn';
            this.description = 'Your submission is marked as withdrawn, this means you will not participate again in this tender'
          }

          if (this.submission.modificationStatus == 'PENDING_APPROVAL' && this.submissionStatus) {
            this.title = 'Submission is pending modification approval';
            this.description = 'Modification request is sent to tenderer email, check the email to confirm modification request'
            this.infoText = {
              title: 'Pending modification approval',
              color: 'bg-[#1190d4]',
              showButton: true
            };
          }
          this.confirmSubmission = false;
        }
      }
      this.isLoading = false;
    } catch (e) {
      console.error(e);
      this.isLoading = false;
    }
  }

  async showTenderForm() {

    this.checking = true;
    const data = await this.attachmentService.getSignedAttachment(
      this.submission.signedTenderFormUuid
    );


    this.settingServices.viewFile(data, 'pdf').then(() => {
      this.checking = false;
    });
  }

  showIncompleteCriteria() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = { criteriaList: this.incompleteCriteriaList }
    const dialogRef = this.dialog.open(IncompleteCriteriaModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((_) => {

    });
  }

  onRealTimeClockChangeEvent(change: RealTimeClockChange) {
    switch (change.changeType) {
      case RealTimeClockChangeType.FETCHING_TIME:
        this.clockIsLoading = true;
        break;
      case RealTimeClockChangeType.TIME_FETCHED:
        this.clockIsLoading = false;
        break;
      case RealTimeClockChangeType.TIME_FETCH_FAILED:
        this.clockIsLoading = false;
        break;
      case RealTimeClockChangeType.TIME_PULSE:
        this.realTime = change.timeString;
        this.checkEndingTime(change.timeObject);
        this.clockIsLoading = false;
        break;
      default:
        break;
    }
  }


  checkEndingTime(currentDate) {
    currentDate = currentDate.toDate();
    if (this.deadlineDate && !this.deadlineDateHasPassed) {
      // this.deadlineDate = new Date();
      // this.deadlineDate.setHours(this.deadlineDate.getHours() - 2);
      const timeDifference = this.deadlineDate.getTime() - currentDate.getTime();
      // Compare the current date with the deadline date
      if (currentDate.getTime() > this.deadlineDate.getTime()) {
        //
        this.deadlineDateHasPassed = true;
        this.showDeadlineClock = false;
      } else {
        //
        // Check if the deadline is within the next 2 hours (2 hours = 2 * 60 * 60 * 1000 milliseconds)
        this.showDeadlineClock = true;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);
        this.deadlineCountDown = 'Closing in';
        this.deadlineCountDown = this.deadlineCountDown + ` ${days}d : ${hours}h: ${minutes}m : ${seconds}s`;
        this.setTimerColors(timeDifference);
      }
    }
  }


  setTimerColors(timeDifference) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const millisecondsPerWeek = 7 * millisecondsPerDay; // Number of milliseconds in a week
    this.deadlineCountTextClass = 'text-white'
    if (timeDifference >= millisecondsPerWeek) {
      this.deadlineCountClass = 'bg-[#348433]';
    } else if (timeDifference >= millisecondsPerDay) {
      this.deadlineCountClass = 'bg-[#FBD306]';
      this.deadlineCountTextClass = 'text-black'
    } else {
      this.deadlineCountClass = 'bg-[#ff0000]';
    }
  }

  async openTenderForm() {
    let formListTenderSubmissionForm: any[];
    if (environment.SHOW_TENDERER_SUBMISSION) {
      formListTenderSubmissionForm = await this.getTenderSumissionForm();
    }
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.disableClose = true;
    config.data = {
      tenderForm: {
        entityUuid: this.submission?.mainSubmission?.entityUuid,
        entityType: 'TENDER',
        tenderNumber: this.selectedEntityDetails?.lotNumber,
        tendererName: (this.founderName == null || this.founderName == "") ? this.submission?.tendererName : " Joint Venture Name " + this.name + ' Lead member name ' + this.founderName + ' with ' + '(' + this.nameTenderers + ')',
        tendererNumber: this.submission?.tendererNumber,
        tendererAddress: this.submission?.physicalAddress ?? 'Address not provided',
        deadlineForTenderSubmissionDate: this.submissionOpeningDate,
        deadlineForTenderSubmissionTime: this.submissionOpeningTime,
        tenderDescription: this.selectedEntityDetails?.lotDescription,
        tenderCurrency: "",
        tendererAuthorizedRepresentative: this.powerOfAttorney?.fullName,
        uuid: this.submission?.uuid,
        tendererAuthorizedLegalRepresentativeCapacity: this.powerOfAttorney?.legalCapacity,
        formListTenderSubmissionForm: formListTenderSubmissionForm?.length > 0 ? formListTenderSubmissionForm : [],
      },
      submission: this.submission,
      submissionUuid: this.submission?.uuid,
      procuringEntityUuid: this.submission?.procuringEntityUuid,
    };
    config.panelClass = ['bottom__sheet'];
    this.bottomSheetDialog.open(TenderFormComponent, config).afterDismissed().subscribe(async _ => {
      await this.getTendererBidInterest();
    });
  }

  // billing functions
  async getBillingStatus() {
    try {
      // const result: any = await this.apollo.fetchData({
      //   query: GET_GLOBAL_SETTING_BY_SETTING_KEY,
      //   apolloNamespace: ApolloNamespace.uaa,
      //   variables: { settingKey: 'ALLOW_BILLING' }
      // });

      // if (result.data.findGlobalSettingByKey?.code === 9000) {
      //   const billingSettingsData = result.data.findGlobalSettingByKey.data;
      // const data: any = await firstValueFrom(
      //   this.http.get<any>(
      //     environment.AUTH_URL + `/nest-cache/settings/by/key/ALLOW_BILLING`
      //   )
      // );
      //
      // const billingSettingsData = data?.value;
      //
      // if (billingSettingsData) {
      //   this.billingStatus = billingSettingsData.value === 'ON';
      //   this.failedToGetBillingStatus = false;
      // } else {
      //   this.failedToGetBillingStatus = true;
      // }
      this.billingStatus = environment.ALLOW_BILLING_SERVICE;
      this.failedToGetBillingStatus = false;
    } catch (e) {
      this.failedToGetBillingStatus = true;
      console.error(e);
    }
  }

  async getPaymentCodeByServiceCode(serviceCode: string): Promise<PaymentCode> {
    try {
      const result: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.billing,
        query: FIND_PAYMENT_CODE_BY_SYSTEM_CODE,
        variables: { systemPaymentCode: serviceCode }
      });

      if (result.data.findPaymentCodeBySystemCode.code === 9000) {
        return result.data.findPaymentCodeBySystemCode.data;
      }
      return null
    } catch (e) {
      return null
    }
  }

  async getDenyServiceForPendingBills(): Promise<{ denyServiceForPendingBills: boolean, failedToGetDenyServiceForPendingBillsStatus: boolean }> {
    try {
      const result: any = await this.apollo.fetchData({
        query: GET_BILLING_GLOBAL_SETTING_BY_KEY,
        apolloNamespace: ApolloNamespace.billing,
        variables: { key: 'DENY_SERVICE_FOR_PENDING_BILLS' }
      });

      if (result.data.findBillingGlobalSettingByKey.code === 9000) {
        const billingGlobalSetting = result.data.findBillingGlobalSettingByKey.data;
        return {
          denyServiceForPendingBills: billingGlobalSetting.value === 'ON',
          failedToGetDenyServiceForPendingBillsStatus: false
        };
      } else {
        return {
          denyServiceForPendingBills: false,
          failedToGetDenyServiceForPendingBillsStatus: true
        };
      }
    } catch (e) {
      return {
        denyServiceForPendingBills: false,
        failedToGetDenyServiceForPendingBillsStatus: true
      };
    }
  }


  async manageTenderPayments(mergedMainProcurementRequisitionUuid: string, entityType: EntityTypeEnum): Promise<void> {
    const denyService = await this.getDenyServiceForPendingBills();
    let hasPendingBills = false;
    let hasBeenWaived = false;
    let isPaid = false;
    if (denyService.denyServiceForPendingBills && !denyService.failedToGetDenyServiceForPendingBillsStatus) {
      const billPaymentCheck: BillPaymentCheck = await this.checkForTenderPayments(mergedMainProcurementRequisitionUuid, entityType);

      if (billPaymentCheck == null) {
        /** handle if bill info  is unavailable */
        this.notificationService.errorMessage("Failed to get billing information, please try again");
        return;
      }
      hasPendingBills = billPaymentCheck.pendingBillStatus;
      hasBeenWaived = billPaymentCheck.hasBeenWaived;
      isPaid = billPaymentCheck.itemPaymentStatus;
    }

    if (hasPendingBills && !hasBeenWaived) {
      const isClosed = await this.generalService.customAlertBoxDialog(
        {
          alertInfo: {
            title: 'Failed to publish tender application. Please settle your pending bill(s) before proceeding',
            buttonTitle: 'View Pending Bill(s)',
            showButton: true,
          },
          alertClass: 'bg-red-100 border-red-300  rounded',
          alertButtonClass: 'border-grey !bg-white',
          alertTextClass: 'text-[#302e2e] text-lg'
        }
      );
      if (isClosed) {
        await this.router.navigate(['nest-tenderer/wallet/pending-bills']);
      }
      // if institutional has no pending bills || hand pending bill and waived
    } else if ((!hasPendingBills) || (hasPendingBills && hasBeenWaived)) {
      if (!isPaid) {
        // GENERATE BILL FOR PAYMENT
        await this.generateBillForPayment(mergedMainProcurementRequisitionUuid, entityType);
      } else {
        await this.submitBidAfterBilling();
      }
    } else {
      this.notificationService.errorMessage("Failed to generate tender application bill please try again");
    }
  }


  async checkForTenderPayments(mergedMainProcurementRequisitionUuid: string, entityType: EntityTypeEnum): Promise<BillPaymentCheck> {

    const response: any = await this.apollo.fetchData({
      query: CHECK_PAYMENT_BY_ENTITY_UUID,
      apolloNamespace: ApolloNamespace.billing,
      variables: {
        verifyingPaymentDto: {
          billableEntityType: "TENDERER",
          billableEntityUuid: this.currentUser?.tenderer?.uuid,
          entityUuid: mergedMainProcurementRequisitionUuid,
          serviceFeeType: 'TENDER_APPLICATION_CHARGES',
          entityName: EntityTypeToEntityModelNameMapping[entityType],
          financialYear: this.selectedEntityDetails?.financialYearCode,
          servicePaymentCode: this.paymentCode.code
        }
      }
    });
    if ([9000, 9005].includes(response.data.getCurrentBillAndPendingBillsPaymentStatus.code)) {
      return response.data?.getCurrentBillAndPendingBillsPaymentStatus?.data;
    } else {
      return null;
    }
  }

  async getTenderSubCategoryByUuid(tenderSubCategoryUuid: string): Promise<TenderSubCategory> {
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_PROCESS_APPLICABLE_TO_FROM_TENDER_SUB_CATEGORY_BY_UUID,
        variables: {
          uuid: tenderSubCategoryUuid,
        },
      });

      if (response.data.findTenderSubCategoryByUuid.code === 9000) {
        return response.data.findTenderSubCategoryByUuid.data;
      }
    } catch (e) { }
    return null;
  };

  async getMergedMainProcurementRequisition(uuid: string): Promise<{ status: boolean, data?: MergedMainProcurementRequisition }> {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_MERGED_MAIN_PROCUREMENT_REQUISITION_MINI_BY_UUID_FOR_BILLING,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: uuid,
        },
      });
      if (response.data.getMergedMainProcurementRequisitionByUuid?.code === 9000) {
        return {
          status: true,
          data: response.data.getMergedMainProcurementRequisitionByUuid?.data
        };
      } else {
        return { status: false, data: null };
      }
    } catch (e) {
      throw new Error('Failed to get tender details');
    }
  }

  async generateBillForPayment(mergedMainProcurementRequisitionUuid: string, entityType: EntityTypeEnum): Promise<void> {
    try {

      let billingEntityType = null;
      // get tender kubwa.
      const mergedMainProcurementRequisition: { status: boolean, data?: MergedMainProcurementRequisition }
        = await this.getMergedMainProcurementRequisition(mergedMainProcurementRequisitionUuid)

      if (mergedMainProcurementRequisition.status && mergedMainProcurementRequisition?.data?.tender?.isCuis) {
        const tenderSubcategory: TenderSubCategory = await this.getTenderSubCategoryByUuid(mergedMainProcurementRequisition?.data.tender?.tenderSubCategoryUuid);
        if (tenderSubcategory && tenderSubcategory?.processApplicableTo) {
          billingEntityType = TenderSubCategoryProcessApplicableToEntityTypeEnum[tenderSubcategory?.processApplicableTo];
        } else {
          this.notificationService.errorMessage(
            'Tender sub categories process applicable to not found'
          );
          // console.error('Tender sub categories process applicable to not found');
        }
      }
      else if (mergedMainProcurementRequisition.status && !mergedMainProcurementRequisition?.data?.tender?.isCuis) {
        billingEntityType = entityType;
      }
      else if (!mergedMainProcurementRequisition.status) {
        billingEntityType = entityType;
      }

      if (billingEntityType) {
        const response: any = await this.apollo.fetchData({
          query: GENERATE_TENDER_APPLICATION_BILL,
          apolloNamespace: ApolloNamespace.billing,
          variables: {
            tenderApplicationBillDto: {
              billableEntityUuid: this.currentUser?.tenderer?.uuid,
              tendererType: this.currentUser?.tenderer?.tendererType,
              entityName: EntityTypeToEntityModelNameMapping[entityType],
              entityType: billingEntityType,
              entityUuid: mergedMainProcurementRequisitionUuid,
              financialYearCode: this.selectedEntityDetails?.financialYearCode,
              entityDescription: this.selectedEntityDetails?.lotDescription,
              entityNumber: this.selectedEntityDetails?.entityNumber ?? this.selectedEntityDetails?.lotNumber,
              numberOfTender: 1,
              paymentCode: this.paymentCode?.code,
            }
          }
        });

        if (response.data.generateBillForTenderApplication.code === 9000) {
          const bill: GeneratedBill = response.data.generateBillForTenderApplication.data;
          this.openBillDialog(bill);
        } else {
          if (response?.data?.generateBillForTenderApplication?.message) {
            this.notificationService.errorMessage(response.data.generateBillForTenderApplication?.message);
          } else {
            this.notificationService.errorMessage("Problem occurred while generating bill, please try again...");
          }
        }
      } else {
        this.notificationService.errorMessage('Failed to get billable entity type');
      }
    } catch (e) {
      console.error(e);
      this.notificationService.errorMessage("Problem occurred while generating bill, please try again...");
    }
  }

  openBillDialog(bill: GeneratedBill): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
      bill: bill,
      type: "TENDERER"
    };
    this.paymentDialog.open(ViewServiceBillComponent, dialogConfig).afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submitBidAfterBilling();
      }
    });
  }

  async resendSubmissionModificationEmail() {
    try {
      this.resending = true;
      const response = await this.apollo.mutate({
        mutation: RESEND_SUBMISSION_MODIFICATION_EMAIL,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          submissionUuid: this.submissionUuid
        },
      });

      if (response.data.resendSubmissionModificationEmail.code == 9000) {
        this.notificationService.successMessage(
          'Email is sent successfully. Please Check your email'
        );
        this.showMoreOptions = false;
      } else {
        console.error(response.data);
        this.notificationService.errorMessage('Problem occurred while resending email, Please try again');
      }
      this.resending = false;
    } catch (e) {
      this.resending = false;
      this.notificationService.errorMessage('Problem occurred while resending email, Please try again');
    }
  }

}


