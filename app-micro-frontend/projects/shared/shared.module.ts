import { DataFetcherCircularProgressComponent } from './components/data-fetcher-circular-progress/data-fetcher-circular-progress.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageContainerComponent } from '../modules/page-container/page-container.component';
import { RouterModule } from '@angular/router';
import { QuickStatsComponent } from './components/stats/quick-stats/quick-stats.component';
import { CircularProgressBasStatsComponent } from './components/stats/circular-progress-bas-stats/circular-progress-bas-stats.component';
import { ChartComponent } from './components/chart/chart.component';
import { MaterialModule } from './material-module/material.module';
import { SearchPipe } from './pipes/search.pipe';
import { IsBase64Pipe } from './pipes/is-base64.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TimeSincePipe } from './pipes/time-since.pipe';
import { WithoutPipe } from './pipes/without.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SaveAreaComponent } from './components/save-area/save-area.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RemoveUnderScorePipe } from './pipes/remove-underscore.pipe';
import { DynamicPipe } from './pipes/dynamic.pipe';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { BottomFooterComponent } from './components/bottom-footer/bottom-footer.component';
import { PasswordStrengthBarComponent } from './components/password-strength-bar/password-strength-bar.component';
import { ViewAttachmentComponent } from './components/view-attachment/view-attachment.component';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { MenuItemsComponent } from './components/menu-items/menu-items.component';
import { ViewHelpComponent } from './components/view-help/view-help.component';
import { SharedLayoutComponent } from './components/shared-layout/shared-layout.component';
import { TopBannerComponent } from './components/topbanner/top-banner.component';
import { FullDataTableComponent } from './components/full-data-table/full-data-table.component';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ShowButtonPipe } from './components/full-data-table/show-button.pipe';
import { ShowOtherButtonsPipe } from './components/full-data-table/show-other-buttons.pipe';
import { TimePickerComponent } from './components/dynamic-forms-components/time/time-picker.component';
import { DynamicFieldDirective } from './components/dynamic-forms-components/dynamic-field/dynamic-field.directive';
import { InputComponent } from './components/dynamic-forms-components/input/input.component';
import { SelectSearchClearDirective } from './components/dynamic-forms-components/select/select-search/select-search-clear.directive';
import { TimeComponent } from './components/dynamic-forms-components/time/time.component';
import { AttachmentComponent } from './components/dynamic-forms-components/attachment/attachment.component';
import { MainDynamicFormComponent } from './components/dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';
import { ButtonComponent } from './components/dynamic-forms-components/button/button.component';
import { SelectSearchComponent } from './components/dynamic-forms-components/select/select-search/select-search.component';
import { RadiobuttonComponent } from './components/dynamic-forms-components/radiobutton/radiobutton.component';
import { TextareaComponent } from './components/dynamic-forms-components/textarea/textarea.component';
import { CheckboxComponent } from './components/dynamic-forms-components/checkbox/checkbox.component';
import { SelectComponent } from './components/dynamic-forms-components/select/select.component';
import { PaginatedSelectComponent } from './components/dynamic-forms-components/paginated-select/paginated-select.component';
import { GroupSelectComponent } from './components/dynamic-forms-components/group-select/group-select.component';
import { MatSelectSearchComponent } from './components/mat-select-search/mat-select-search.component';
import { WithLoadingPipe } from './components/with-loading.pipe';
import { DateComponent } from './components/dynamic-forms-components/date/date.component';
import { PaginatedSelectTableComponent } from './components/dynamic-forms-components/paginated-select/paginated-select-table/paginated-select-table.component';
import { PaginatedDataTableComponent } from './components/paginated-data-table/paginated-data-table.component';
import { OptionsObservablePipe } from './pipes/options-observable.pipe';
import { DisableDuplicatePipe } from './components/dynamic-forms-components/pipes/disable-duplicate.pipe';
import { ModalHeaderComponent } from './components/modal-header/modal-header.component';
import { WordProcessorComponent } from './word-processor/word-processor.component';
import { TableComponent } from './word-processor/table/table.component';
import { DoNotSanitizePipe } from './word-processor/pipes/do-not-sanitize.pipe';
import { ViewDetailsItemComponent } from './components/view-details-item/view-details-item.component';
import { ConfirmAreaComponent } from './components/confirm-area/confirm-area.component';
import { StepsSharedTitleComponent } from './components/steps-shared-title/steps-shared-title.component';
import { DndDirective } from './directives/file-drad-and-drop.directive';
import { SelectInfiniteScrollDirective } from './components/dynamic-forms-components/select/select-infinite-scroll.directive';
import { FilterBooleanPipe, FilterPipe } from './pipes/filter.pipe';
import { AnimatedDigitComponent } from './components/animated-digit/animated-digit.component';
import { VerticalStepsFormComponent } from './components/vertical-steps-form/vertical-steps-form.component';
import { StepItemComponent } from './components/vertical-steps-form/step-item/step-item.component';
import { CircularProgressBarComponent } from './components/circular-progress-bar/circular-progress-bar.component';
import { WorkFlowMainComponent } from './components/work-flow-main/work-flow-main.component';
import { MatInputCommaSeparatedDirective } from './directives/mat-input-comma-separated.directive';
import { NestMessagingSectionComponent } from './components/nest-messaging-section/nest-messaging-section.component';
import { SubjectSectionComponent } from './components/nest-messaging-section/subject-section/subject-section.component';
import { ToAreaComponent } from './components/nest-messaging-section/to-area/to-area.component';
import { ToolBarComponent } from './word-processor/tool-bar/tool-bar.component';
import { EditableListItemsSelectorComponent } from './components/editable-list-items-selector/editable-list-items-selector.component';
import { UserItemComponent } from './components/nest-messaging-section/to-area/user-item/user-item.component';
import { EditableListItemComponent } from './components/editable-list-items-selector/editable-list-item/editable-list-item.component';
import { GroupItemComponent } from './components/nested-specifications-builder/group-item/group-item.component';
import { SharableAttachmentFormComponent } from './components/sharable-attachment-form/sharable-attachment-form.component';
import { MustHavePipe } from './pipes/must-have.pipe';
import { EditableSpecsItemComponent } from './components/nested-specifications-builder/editable-specs-table/editable-specs-item/editable-specs-item.component';
import { EditableSpecsTableComponent } from './components/nested-specifications-builder/editable-specs-table/editable-specs-table.component';
import {
  TransitionGroupComponent,
  TransitionGroupItemDirective,
} from './directives/transition-group';
import { ValueExistsPipe } from './pipes/value-exists.pipe';
import { SharableVerifyDocumentFormComponent } from './components/sharable-verify-document-form/sharable-verify-document-form.component';
import { SortByPipe } from './pipes/sort-pipe';
import { TableItemPickerComponent } from './components/nested-specifications-builder/editable-specs-table/table-item-picker/table-item-picker.component';
import { VerticalTabsComponent } from './components/vertical-tabs/vertical-tabs.component';
import { VerticalTabItemComponent } from './components/vertical-tabs/tab-item/vertical-tab-item.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ClickStopPropagation } from './directives/stop-propagate-on-click.directive';
import { UserSubscriptionsComponent } from './components/user-subscriptions/user-subscriptions.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { CompanyExperienceComponent } from './components/company-details/company-experience/company-experience.component';
import { OfficeLocationInformationComponent } from './components/company-details/office-locations/office-location-information.component';
import { WorkEquipmentProfileInformationComponent } from './components/company-details/work-equipment/work-equipment-profile-information.component';
import { FinancialCapabilityComponent } from './components/company-details/financial-capability/financial-capability.component';
import { FinancialResourcesInformationComponent } from './components/company-details/financial-resources/financial-resources-information.component';
import { LitigationRecordInformationComponent } from './components/company-details/litigation-records/litigation-record-information.component';
import { PersonnelProfileInformationComponent } from './components/company-details/personel-information/personnel-profile-information.component';
import { ViewWorkExperienceComponent } from './components/company-details/company-experience/view-work-experience/view-work-experience.component';
import { ViewCashFlowsComponent } from './components/company-details/financial-capability/view-cash-flows/view-cash-flows.component';
import { EditUserProfileComponent } from './components/user-profile/edit-user-profile/edit-user-profile.component';
import { ItemDetailWithIcon } from './components/item-detail-with-icon/item-detail-with-icon';
import { HorizontalItemsSelectorComponent } from './components/horizontal-items-selector/horizontal-items-selector.component';
import { HorizontalSelectorItemComponent } from './components/horizontal-items-selector/horizontal-selector-item/horizontal-selector-item.component';
import { InlineConfirmComponent } from './components/inline-confirm/inline-confirm.component';
import { ViewOfficeLocationComponent } from './components/company-details/office-locations/view-office-location/view-office-location.component';
import { ViewPersonnelInformationComponent } from './components/company-details/personel-information/view-personnel-information/view-personnel-information.component';
import { BoqsViewerComponent } from './components/boqs/boqs-viewer/boqs-viewer.component';
import { VerifyDocumentComponent } from './components/verify-document/verify-document.component';
import { FooterComponent } from '../website/shared/components/footer/footer.component';
import { FeaturesAndServicesComponent } from '../website/features-and-services/features-and-services.component';
import { SectionHeaderComponent } from '../website/shared/components/section-header/section-header.component';
import { SummariesViewComponent } from '../website/summaries-view/summaries-view.component';
import { ViewLitigationRecordComponent } from './components/company-details/litigation-records/view-litigation-record/view-litigation-record.component';
import { CardIconCenterComponent } from './components/card-icon-center/card-icon-center.component';
import { SharableCommentsViewerComponent } from './components/sharable-comments-viewer/sharable-comments-viewer.component';
import { ComingSoonPageComponent } from './coming-soon-page/coming-soon-page.component';
import { CompanyBusinessLinesComponent } from './components/company-details/company-business-lines/company-business-lines.component';
import { BusinessLineSelectionComponent } from './components/business-line-selection/business-line-selection.component';
import { SortByDatePipe } from './pipes/sort-by-date.pipe';
import { AssignTaskToSubordinateComponent } from './components/work-flow-main/assign-task-to-subordinate/assign-task-to-subordinate.component';
import { InputHintComponent } from './components/input-hint/input-hint.component';
import { AdditionalDetailsComponent } from './components/company-details/additional-details/additional-details.component';
import { BusinessRegistrationDetailsComponent } from './components/company-details/additional-details/business-registration-details/business-registration-details.component';
import { AssociatesDetailsComponent } from './components/company-details/additional-details/associates-details/associates-details.component';
import { BusinessOwnersDetailsComponent } from './components/company-details/additional-details/business-owners-details/business-owners-details.component';
import { TaxDetailsComponent } from './components/company-details/additional-details/tax-details/tax-details.component';
import { CompleteSubtaskComponent } from './components/work-flow-main/complete-subtask/complete-subtask.component';
import { AdvicesViewerComponent } from './components/work-flow-main/advices-viewer/advices-viewer.component';
import { KeyValueListInputComponent } from './components/key-value-list-input/key-value-list-input.component';
import { KeyValueInputComponent } from './components/key-value-list-input/key-value-input/key-value-input.component';
import { EvaluationOptionsComponent } from './components/evaluation-options/evaluation-options.component';
import { AnnualTurnoverComponent } from './components/company-details/annual-turnover/annual-turnover.component';
import { NcSpecificationsViewerComponent } from './components/requisitions/nc-specifications-viewer/nc-specifications-viewer.component';
import { ViewWorkEquipmentComponent } from './components/company-details/work-equipment/view-work-equipment/view-work-equipment.component';
import { ViewAssignedUserComponent } from '../modules/nest-tenderer-management/assigned-users/view-assigned-user/view-assigned-user.component';
import { WordProcessorFormComponent } from './components/word-processor-form/word-processor-form.component';
import { ResumeComponent } from './components/resume/resume.component';
import { ConsultancySpecificationsViewerComponent } from './components/requisitions/consultancy-specifications-viewer/consultancy-specifications-viewer.component';
import { HelpTextComponent } from './components/help-text/help-text.component';
import { PhoneInputComponent } from './components/dynamic-forms-components/phone-input/phone-input.component';
import { BoqSummaryComponent } from './components/boqs/boq-summary/boq-summary.component';
import { TendererBoqsFillingComponent } from './components/boqs/tenderer-boqs-filling/tenderer-boqs-filling.component';
import { SubmissionProgressBarComponent } from './components/percentage-progress-bar/submission-progress-bar/submission-progress-bar.component';
import { MergedGoodsRequisitionViewerComponent } from './components/requisitions/merged-goods-requisition-viewer/merged-goods-requisition-viewer.component';
import { CurriculumVitaeComponent } from './components/company-details/additional-details/curriculum-vitae/curriculum-vitae.component';
import { MergedNcRequisitionViewerComponent } from './components/requisitions/merged-nc-requisition-viewer/merged-nc-requisition-viewer.component';
import { MergedConsultancyRequisitionViewerComponent } from './components/requisitions/merged-consultancy-requisition-viewer/merged-consultancy-requisition-viewer.component';
import { MergedWorksRequisitionViewerComponent } from './components/requisitions/merged-works-requisition-viewer/merged-works-requisition-viewer.component';
import { PreviewCvComponent } from './components/preview-cv/preview-cv.component';
import { WithdrawRequestComponent } from './components/percentage-progress-bar/withdraw-request/withdraw-request.component';
import { SharedHrItemsSelectorComponent } from './components/shared-hr-items-selector/shared-hr-items-selector.component';
import { NestMultiSelectComponent } from './components/nest-multi-select/nest-multi-select.component';
import { SelectItemComponent } from './components/nest-multi-select/select-item/select-item.component';
import { TeamViewTaskManagementComponent } from './components/team-view-task-management/team-view-task.component';
import { TeamMemberViewerComponent } from './components/team-member-view/team-member-view.component';
import { ApproveBusinessComponent } from './components/company-details/additional-details/business-registration-details/approve-business/approve-business.component';
import { ApproveTaxComponent } from './components/company-details/additional-details/tax-details/approve-business/approve-business.component';
import { DeclarationOfInterestManagementComponent } from './components/declaration-of-interest-manager/declaration-of-interest.component';
import { AddUpdateTeamComponent } from './components/add-update-team/add-update-team.component';
import { ReplaceTeamMemberFormComponent } from './components/replace-team-member/replace-team-member.component';
import { CustomAlertBoxComponent } from './components/custom-alert-box/custom-alert-box.component';
import { AppTimePickerComponent } from './components/dynamic-forms-components/app-time-picker/app-time-picker.component';
import { HoursDirective } from './components/dynamic-forms-components/app-time-picker/hours.directive';
import { MinutesDirective } from './components/dynamic-forms-components/app-time-picker/minutes.directive';
import { TimerPickerComponent } from './components/dynamic-forms-components/app-time-picker/time-picker.component';
import { AddNegotiationTeamComponent } from '../modules/nest-tenderer-negotiation/negotiation-team-management/add-negotiation-team/add-negotiation-team.component';
import { TerminateReqTenderComponent } from './components/work-flow-main/terminate-req-tender/terminate-req-tender.component';
import { NormalTableExpandableRow2Component } from './components/normal-table-expandable-row2/normal-table-expandable-row2.component';
import { CustomNumberInputComponent } from './components/custom-number-input/custom-number-input.component';
import { NumberPipePipe } from './pipes/number-pipe';
import { UnmergeGoodsItemizationComponent } from './components/requisitions/unmerge-goods-itemization/unmerge-goods-itemization.component';
import { PaginatedTableExpandableRowComponent } from './components/paginated-table-expandable-row/paginated-table-expandable-row.component';
import { TablePropertiesComponent } from './word-processor/table/table-properties/table-properties.component';
import { TableCellPropertiesComponent } from './word-processor/table/table-cell-properties/table-cell-properties.component';
import { SystemSearchAreaComponent } from './components/app-bar/system-search-area/system-search-area.component';
import { TendererSelectionComponent } from './components/requisitions/tenderer-selection/tenderer-selection.component';
import { ExcelUploaderComponent } from './components/excel-uploader/excel-uploader.component';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { NumberInputComponent } from './components/dynamic-forms-components/number-input/number-input.component';
import { TextAreaDialogComponent } from './components/text-area-dialog/text-area-dialog.component';
import { EvaluationProgressBarComponent } from './components/percentage-progress-bar/evaluation-progress-bar/evaluation-progress-bar.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { ViewPendingTenderAwardComponent } from '../modules/nest-tender-award/pending-tender-award/view-pending-tender-award/view-pending-tender-award.component';
import { FlatNestedSpecificationsComponent } from './components/nested-specifications-builder/flat-nested-specifications/flat-nested-specifications.component';
import { InternetStatusBarComponent } from './components/internet-status-bar/internet-status-bar.component';
import { NestedSpecificationsInfoBarComponent } from './components/nested-specifications-builder/nested-specifications-info-bar/nested-specifications-info-bar.component';
import { BoqFetcherComponent } from './components/boqs/boq-fetcher/boq-fetcher.component';
import { ItemsSorterComponent } from './components/items-sorter/items-sorter.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { HelpDialogComponent } from './components/dynamic-forms-components/help-dialog-component/help-dialog-component.component';
import { EditableSpecsTableRowComponent } from './components/nested-specifications-builder/editable-specs-table/editable-specs-table-row/editable-specs-table-row.component';
import { SortArrayPipe } from './pipes/sort-array.pipe';
import { LinearProgressBarComponent } from './components/linear-progress-bar/linear-progress-bar.component';
import { SafeDatePipe } from './pipes/safe-date.pipe';
import { CdkDetailRowDirective } from './components/normal-table-expandable-row2/cdk-detail-row.directive';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { InvitationLetterComponent } from './components/invitation-letter/invitation-letter.component';
import { AdvancedTenderSearchComponent } from './components/advanced-tender-search/advanced-tender-search.component';
import { AdvancedTenderSearchTenderItemComponent } from './components/advanced-tender-search/advanced-tender-search-tender-item/advanced-tender-search-tender-item.component';
import { UrlListenerReportViewerComponent } from './components/url-listener-report-viewer/url-listener-report-viewer.component';
import { NormalTableExpandableRowComponent } from './components/normal-table-expandable-row/normal-table-expandable-row.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { SpecificationItemManagerDialogComponent } from './components/nested-specifications-builder/specification-item-manager-dialog/specification-item-manager-dialog.component';
import { InlineAlertBoxComponent } from './components/custom-alerts/inline-alert/inline-alert-box.component';
import { FormStepsComponent } from '../modules/nest-tender-initiation/additional-details-setting/form-steps/form-steps.component';
import { UpsertFormStepsComponent } from '../modules/nest-tender-initiation/additional-details-setting/form-steps/upsert-form-steps/upsert-form-steps.component';
import { TenderWorkspaceComponent } from '../modules/nest-tender-initiation/approved-requisitions/manage-merged-requisitions/tender-workspace/tender-workspace.component';
import { TenderCalendarConfirmationFormComponent } from '../modules/nest-tender-initiation/tender-requisition/publish-tender-dialog/tender-calendar-confirmation-form/tender-calendar-confirmation-form.component';
import { TenderDocumentCreatorComponent } from '../modules/nest-tender-initiation/approved-requisitions/manage-merged-requisitions/tender-document-creator/tender-document-creator.component';
import { AddEvaluationCriteriaComponent } from '../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/add-evaluation-criteria.component';
import { EvaluationCriteriaSelectionComponent } from '../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-selection/evaluation-criteria-selection.component';
import { EvaluationCriteriaDetailsComponent } from '../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/evaluation-criteria-details.component';
import { EvaluationCriteriaScoreComponent } from '../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-score/evaluation-criteria-score.component';
import { EvaluationStageMarkFormComponent } from '../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-score/evaluation-stage-mark-form/evaluation-stage-mark-form.component';
import { CriteriaDetailsFormComponent } from '../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-details/criteria-details-form/criteria-details-form.component';
import { MergedRequisitionSummaryComponent } from './components/requisitions/merged-requisition-summary/merged-requisition-summary.component';
import { SingleHorizontalStackedBarChartComponent } from './components/bar-charts/single-horizontal-stacked-bar-chart/single-horizontal-stacked-bar-chart.component';
import { HorizontalStackedBarChartComponent } from './components/bar-charts/horizontal-stacked-bar-chart/horizontal-stacked-bar-chart.component';
import { TenderInfoSummaryComponent } from './components/tender-info-summary/tender-info-summary.component';
import { DynamicViewComponent } from './components/dynamic-view/dynamic-view.component';
import { SaveTenderCalenderComponent } from './components/save-tender-calender/save-tender-calender.component';
import { PeRequirementListComponent } from './components/pe-requirement-list/pe-requirement-list.component';
import { CircularProgressLoaderComponent } from './components/circular-progress-loader/circular-progress-loader.component';
import { ViewEvaluationCriteriasComponent } from './components/view-evaluation-criterias/view-evaluation-criterias.component';
import { IncompleteCriteriaModalComponent } from './components/percentage-progress-bar/incomplete-criteria-modal/incomplete-criteria-modal.component';
import { TenderDetailComponent } from './components/app-tender-detail/tender-detail.component';
import { ViewTendererSubmissionComponent } from './components/view-tenderer-submission/view-tenderer-submission.component';
import { DocumentPublishStatusComponent } from '../services/document/document-creator/document-publish-status/document-publish-status.component';
import { PeRequirementComponent } from './components/view-pe-requirement/pe-requirement.component';
import { SubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/submission.component';
import { CriteriaSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/criteria-submission/criteria-submission.component';
import { FinancialProposalConsultancyComponent } from '../modules/nest-tenderer/tender-submission/submission/components/financial-proposal-consultancy/financial-proposal-consultancy.component';
import { PricingComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/pricing.component';
import { FieldsComponent } from '../modules/nest-tenderer/tender-submission/submission/components/fields/fields.component';
import { SignedAttachmentComponent } from '../modules/nest-tenderer/tender-submission/submission/components/signed-attachment/signed-attachment.component';
import { ConfirmationComponent } from '../modules/nest-tenderer/tender-submission/submission/components/confirmation/confirmation.component';
import { SpecificationComponent } from '../modules/nest-tenderer/tender-submission/submission/components/specification/specification.component';
import { FromProfileComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/from-profile.component';
import { CustomTemplateSubmissionFormComponent } from '../modules/nest-tenderer/tender-submission/submission/components/custom-template-submission-form/custom-template-submission-form.component';
import { SummaryOfCostComponent } from '../modules/nest-tenderer/tender-submission/submission/components/financial-proposal-consultancy/summary-of-cost/summary-of-cost.component';
import { AddRemunirationExpenseComponent } from '../modules/nest-tenderer/tender-submission/submission/components/financial-proposal-consultancy/add-remuniration-expense/add-remuniration-expense.component';
import { AddReimbursementExpenseComponent } from '../modules/nest-tenderer/tender-submission/submission/components/financial-proposal-consultancy/add-reimbursement-expense/add-reimbursement-expense.component';
import { AddTaxBreakdownComponent } from '../modules/nest-tenderer/tender-submission/submission/components/financial-proposal-consultancy/add-tax-breakdown/add-tax-breakdown.component';
import { CompleteSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/complete-submission/complete-submission.component';
import { PersonnelSubmissionFormComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/personnel/submission/personnel-submission-form.component';
import { PersonnelSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/personnel/submitted/personnel-submitted.component';
import { WorkExperienceSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/work-experience/submitted/work-experience-submitted.component';
import { WorkExperienceSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/work-experience/submission/work-experience-submission.component';
import { KeyActivitySubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/key-activity/submission/key-activity-submission.component';
import { KeyActivitySubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/key-activity/submitted/key-activity-submitted.component';
import { FinancialResourceSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/financial-resource/submission/financial-resource-submission.component';
import { FinancialResourceSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/financial-resource/submitted/financial-resource-submitted.component';
import { FinancialStatementSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/financial-statement/submission/financial-statement-submission.component';
import { FinancialStatementSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/financial-statement/submitted/financial-statement-submitted.component';
import { LitigationRecordSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/litigation-record/submission/litigation-record-submission.component';
import { LitigationRecordSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/litigation-record/submitted/litigation-record-submitted.component';
import { WorkEquipmentSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/work-equipment/submission/work-equipment-submission.component';
import { WorkEquipmentSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/work-equipment/submitted/work-equipment-submitted.component';
import { BusinessDetailsSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/business-details/submission/business-details-submission.component';
import { BusinessDetailsSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/business-details/submitted/business-details-submitted.component';
import { OrganizationStructureSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/organization-structure/submitted/organization-structure-submitted.component';
import { OrganizationStructureSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/organization-structure/submission/organization-structure-submission.component';
import { AnnualTurnoverSubmittedComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/annual-turnover/submitted/annual-turnover-submitted.component';
import { AnnualTurnoverSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/from-profile/registration/annual-turnover/submission/annual-turnover-submission.component';
import { AddGoodsSubmissionItemizationComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-requisition-itemization/add-goods-requisition-itemization.component';
import { AddGoodsRequisitionItemsSpecsComponent } from '../modules/nest-tenderer/tender-submission/submission/components/specification/add-goods-requisition-items-specs/add-goods-requisition-items-specs.component';
import { AddWorksSubmissionItemizationComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-works-submission-itemization/add-works-submission-itemization.component';
import { AddNonConsultancySubmissionItemizationComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-non-consultancy-submission-itemization/add-non-consultancy-submission-itemization.component';
import { AddWorksRequisitionItemsSpecsComponent } from '../modules/nest-tenderer/tender-submission/submission/components/specification/add-works-requisition-items-specs/add-works-requisition-items-specs.component';
import { AddConsultancyRequisitionItemsSpecsComponent } from '../modules/nest-tenderer/tender-submission/submission/components/specification/add-consultancy-requisition-items-specs/add-consultancy-requisition-items-specs.component';
import { AddNonConsultancyRequisitionItemsSpecsComponent } from '../modules/nest-tenderer/tender-submission/submission/components/specification/add-non-consultancy-requisition-items-specs/add-non-consultancy-requisition-items-specs.component';
import { AuthorizedRepresentativeComponent } from '../modules/nest-tenderer/tender-submission/submission/authorized-representative/authorized-representative.component';
import { ViewServiceBillComponent } from './components/view-service-bill/view-service-bill.component';
import { CalendarDisplayComponent } from '../modules/nest-app/app-tender-creation/components/calendar-display/calendar-display.component';
import { TinyCircularProgressComponent } from './components/tiny-circular-progress/tiny-circular-progress.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { RenderPdfComponent } from './components/render-pdf/render-pdf.component';
import { StatisticsItemComponent } from '../modules/nest-tenderer-management/tenderer-management-dashboard/statistics-item/statistics-item.component';
import { ItemsSortFilterComponent } from './components/items-sort-filter/items-sort-filter.component';
import { AdvancedSearchFilterComponent } from './components/advanced-search-filter/advanced-search-filter.component';
import { SubmittedForEvaluationComponent } from '../modules/nest-tender-evaluation/evaluation/submitted/submitted-for-evaluation.component';
import { TendersListComponent } from '../modules/nest-tenderer/all-tenders/tenders-list/tenders-list.component';
import { TendererDetailsComponent } from '../modules/nest-tender-initiation/tenderer-filter/tenderer-details/tenderer-details.component';
import { TenderItemComponent } from '../modules/nest-tenderer/all-tenders/tender-item/tender-item.component';
import { OpeningReportComponent } from '../modules/nest-tender-evaluation/evaluation/opening-report/opening-report.component';

import { ViewSummaryComponent } from '../modules/nest-tenderer-registration/register-tenderer/view-summary/view-summary.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { CreateRangePipe } from './pipes/create-range.pipe';
import { CalenderViewItemComponent } from './components/calender-view-form/calender-view-item/calender-view-item.component';
import { CalenderViewFormComponent } from './components/calender-view-form/calender-view-form.component';
import { DisableTypingInsideConditionBlockDirective } from './directives/disable-typing-inside-condition-block.directive';
import { SearchDropdownComponent } from './components/search-dropdown/search-dropdown.component';
import { NestStepperComponent } from './components/nest-stepper/nest-stepper.component';
import { StepComponent } from './components/nest-stepper/step/step.component';
import { FrontendPaginatorComponent } from '../website/shared/components/frontend-paginator/frontend-paginator.component';
import { EvaluationShortlistedApplicantsComponent } from './components/evaluation-shortlisted-applicants/evaluation-shortlisted-applicants.component';
import { RealTimeComponent } from './components/real-time/real-time.component';
import { CommonRealtimeClockComponent } from './components/real-time/common-reatime-clock/common-realtime-clock.component';
import { UpsertOwnersComponent } from './components/company-details/additional-details/business-owners-details/upsert-owners/upsert-owners.component';
import { BillPaymentDetailComponent } from './components/bill-payment-detailed/bill-payment-detail.component';
import { DatetimePipe } from './pipes/date-time';
import { ViewTenderBoardResolutionComponent } from '../modules/nest-tender-evaluation/view-tender-board-resolution/view-tender-board-resolution.component';
import { ViewMergedRequisitionComponent } from '../modules/nest-tender-initiation/approved-requisitions/view-merged-requisition/view-merged-requisition.component';
import { ViewEvaluationReportComponent } from '../modules/nest-tender-evaluation/evaluation-reports/view-evaluation-report/view-evaluation-report.component';
import { TenderFormComponent } from './components/percentage-progress-bar/submission-progress-bar/tender-form/tender-form.component';
import { UnderMaintenanceComponent } from './under-maintenance/under-maintenance.component';
import { CustomAccordionComponent } from './components/custom-accordion/custom-accordion.component';
import { AccordionItemComponent } from './components/custom-accordion/accordion-item/accordion-item.component';
import { UpsertTaxBreakdownComponent } from '../modules/nest-tenderer/tender-submission/submission/components/financial-proposal-consultancy/upsert-tax-breakdown/upsert-tax-breakdown.component';
import { ProgressCircularLoaderComponent } from '../modules/nest-tenderer/tender-submission/submission/progress-circular-loader/progress-circular-loader.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { LinearCircularCheckerLoaderComponent } from '../modules/nest-tenderer/tender-submission/submission/linear-circular-checker-loader/linear-circular-checker-loader.component';
import { SubmissionCriteriaItemComponent } from '../modules/nest-tenderer/tender-submission/submission/submission-criteria-item/submission-criteria-item.component';
import { SpecificationDescriptionEditorComponent } from './components/nested-specifications-builder/specification-description-editor/specification-description-editor.component';
import { EvaluationResultByCriteriaComponent } from '../modules/nest-tender-evaluation/evaluation-team/evaluation-result-by-criteria/evaluation-result-by-criteria.component';
import { CurrencyChangeComponent } from './components/currency-change/currency-change.component';
import { GoodsSummaryComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-requisition-itemization/goods-summary/goods-summary.component';
import { HtmlCodeEditorComponent } from './word-processor/html-code-editor/html-code-editor.component';
import { GoodsItemCollectionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-requisition-itemization/goods-item-collection/goods-item-collection.component';
import { GoodsItemComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-requisition-itemization/goods-item-collection/goods-item/goods-item.component';
import { CustomCheckBoxInputComponent } from './components/custom-check-box-input/custom-check-box-input.component';
import { GoodsItemInputManagerComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-requisition-itemization/goods-item-collection/goods-item-input-manager/goods-item-input-manager.component';
import { GoodsItemInputFieldComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-requisition-itemization/goods-item-collection/goods-item-input-manager/goods-item-input-field/goods-item-input-field.component';
import { AddGoodsSparePartsItemizationComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/add-goods-spare-parts-itemization.component';
import { GoodsSparePartCollectionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/goods-spare-part-collection/goods-spare-part-collection.component';
import { NestVerticalStepperComponent } from './components/nest-vertical-stepper/nest-vertical-stepper.component';
import { NestVerticalStepComponent } from './components/nest-vertical-stepper/nest-vertical-step/nest-vertical-step.component';
import { GoodsRelatedResvicesCollectionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/goods-related-resvices-collection/goods-related-resvices-collection.component';
import { GoodsIncidentalResvicesCollectionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/goods-incidental-resvices-collection/goods-incidental-resvices-collection.component';
import { GoodsAfterSellResvicesCollectionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/goods-after-sell-resvices-collection/goods-after-sell-resvices-collection.component';
import { GoodsSpareItemComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/goods-spare-part-collection/goods-spare-item/goods-spare-item.component';
import { GoodsSpareItemInputManagerComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/goods-spare-part-collection/goods-spare-item-input-manager/goods-spare-item-input-manager.component';
import { CustomTableFormComponent } from './components/custom-table-form/custom-table-form.component';
import { UnicodeToEmojiPipe } from './pipes/unicode-to-emoje.pipe';
import { SpecificationImportDialogComponent } from './components/nested-specifications-builder/specification-import-dialog/specification-import-dialog.component';
import { ViewTendererFrameworkComponent } from './components/view-tenderer-framework/view-tenderer-framework.component';
import { EvaluationCuisComponent } from './components/evaluation-cuis/evaluation-cuis.component';
import { GovernmentTendererComponent } from './components/company-details/government-tenderer/government-tenderer.component';
import { AddGovernmentComponent } from './components/company-details/government-tenderer/add-government/add-government.component';
import { ConsultancyExpertsComponent } from '../modules/nest-tenderer/tender-submission/submission/components/consultancy-experts/consultancy-experts.component';
import { ExpertViewComponent } from '../modules/nest-tenderer/tender-submission/submission/components/consultancy-experts/expert-view/expert-view.component';
import { TableFormComponent } from '../modules/nest-tenderer/tender-submission/submission/components/consultancy-experts/table-form/table-form.component';
import { DataGenerationStepComponent } from './components/data-generation-step/data-generation-step.component';
import { EvaluationReportGeneratorComponent } from '../modules/nest-tender-evaluation/evaluation-team/evaluation-report-generator/evaluation-report-generator.component';
import { SimpleLinearProgressBarComponent } from './components/simple-linear-progress-bar/simple-linear-progress-bar.component';
import { DottedCustomAlertBoxComponent } from './components/dotted-custom-alert-box/dotted-custom-alert-box.component';
import { OpeningReportGeneratorComponent } from '../modules/nest-opening/opening-report-generator/opening-report-generator.component';
import { LotSelectionSubmissionComponent } from '../modules/nest-tenderer/tender-submission/lot-selection-submission/lot-selection-submission.component';
import { GoodsCustomSubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/goods-custom-submission/goods-custom-submission.component';
import { PlainTableComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/plain-table/plain-table.component';
import { CustomTableComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-table/custom-table.component';
import { GoodsFinancialFormDesignComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/goods-financial-form-design.component';
import { FormDesignStudioComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/form-design-studio.component';
import { BasicInformationComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/basic-information/basic-information.component';
import { FormElementsComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/form-elements/form-elements.component';
import { FormPreviewComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/form-preview/form-preview.component';
import { GroupFormComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/group-form/group-form.component';
import { ElementContainerComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/form-elements/element-container/element-container.component';
import { FormStudioGenericFieldComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/form-studio-generic-field/form-studio-generic-field.component';
import { CustomFormInputFieldComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-form-input-field/custom-form-input-field.component';
import { CustomFormSelectFieldComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-form-select-field/custom-form-select-field.component';
import { CustomTableWithServiceComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-table/custom-table-with-service/custom-table-with-service.component';
import { CustomTableWithoutServiceComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-table/custom-table-without-service/custom-table-without-service.component';
import { CustomTableItemContainerComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-table/custom-table-item-container/custom-table-item-container.component';
import { CustomTableInputManagerComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-table/custom-table-input-manager/custom-table-input-manager.component';
import { CustomTableInputFieldComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/custom-table/custom-table-input-field/custom-table-input-field.component';
import { FormulaCreationContainerComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/form-elements/create-element/formula-creation-container/formula-creation-container.component';
import { CreateElementComponent } from '../modules/nest-tender-initiation/goods-financial-form-design/form-design-studio/components/form-elements/create-element/create-element.component';
import { PreQualificationDocumentCreatorComponent } from '../modules/nest-pre-qualification/pre-qualification-management/manage-tender-pre-qualification/pre-qualification-document-creator/pre-qualification-document-creator.component';
import { PreQualificationCalenderConfirmationFormComponent } from '../modules/nest-pre-qualification/pre-qualification-management/manage-tender-pre-qualification/pre-qualification-calender-confirmation-form/pre-qualification-calender-confirmation-form.component';
import { GoodsFinancialSummaryComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/goods-custom-submission/goods-financial-summary/goods-financial-summary.component';
import { FilterElementsPipe } from './pipes/filter-elements.pipe';
import { ConsultancySubmissionComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/consultancy-submission/consultancy-submission.component';
import { ConsultancyWorkScheduleComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/consultancy-submission/consultancy-work-schedule/consultancy-work-schedule.component';
import { KeyPersonnelQualificationComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/consultancy-submission/key-personnel-qualification/key-personnel-qualification.component';
import { FinancialProposalComponent } from '../modules/nest-tenderer/tender-submission/submission/components/pricing/consultancy-submission/financial-proposal/financial-proposal.component';
import { CustomNotificationComponent } from './components/app-bar/custom-notification/custom-notification.component';
import { CleanHtmlPipe } from './pipes/clean-html.pipe';
import { CustomAlertBoxDialogComponent } from './components/custom-alert-box-dialog/custom-alert-box-dialog.component';
import { AttachmentViewerComponent } from './components/attachment-viewer/attachment-viewer.component';
import { DigitalSignatureInputComponent } from './components/attachment-viewer/digital-signature-input/digital-signature-input.component';
import { HtmlViewerComponent } from './components/attachment-viewer/html-viewer/html-viewer.component';
import { AllCommentsViewerDialogComponent } from './components/sharable-comments-viewer/all-comments-viewer-dialog/all-comments-viewer-dialog.component';
import { AllCommentsViewerComponent } from './components/sharable-comments-viewer/all-comments-viewer/all-comments-viewer.component';
import { SubmissionActionDialogComponent } from './components/percentage-progress-bar/submission-action-dialog/submission-action-dialog.component';
import { BlockingLoaderComponent } from './components/blocking-loader/blocking-loader.component';
import { TextInputModelComponent } from './components/text-input-model/text-input-model.component';
import { InfoWrapperComponent } from './components/info-wrapper/info-wrapper.component';
import { DynamicDetailsViewerComponent } from './components/dynamic-details-viewer/dynamic-details-viewer.component';
import { WorkFlowActionSelectorComponent } from './components/work-flow-main/work-flow-action-selector/work-flow-action-selector.component';
import { WorkflowUsersListComponent } from './components/work-flow-main/workflow-users-list/workflow-users-list.component';
import { WorkFlowQuickTaskInfoComponent } from './components/work-flow-main/work-flow-action-selector/work-flow-quick-task-info/work-flow-quick-task-info.component';
import { WorkFlowPreviewerComponent } from './components/work-flow-main/work-flow-previewer/work-flow-previewer.component';
import { HtmlViewerContentComponent } from './components/attachment-viewer/html-viewer/html-viewer-content/html-viewer-content.component';
import { TenderTrackerStagesComponent } from '../modules/nest-tender-initiation/tender-tracker/tender-tracker-steps/tender-tracker-steps.component';
import { TenderTrackerMiniStagesComponent } from '../modules/nest-tender-initiation/tender-tracker/tender-tracker-steps/tender-tracker-mini-stages/tender-tracker-mini-stages.component';
import { TenderTrackApprovalsComponent } from '../modules/nest-tender-initiation/tender-tracker/tender-tracker-steps/tender-track-approvals/tender-track-approvals.component';
import { TenderTrackHtmlViewComponent } from '../modules/nest-tender-initiation/tender-tracker/tender-track-html-view/tender-track-html-view.component';
import { BlockingNotificationErrorComponent } from './components/blocking-notification-error/blocking-notification-error.component';
import { UserPickerModalComponent } from './components/user-picker-modal/user-picker-modal.component';
import { BlockingNotificationMessageComponent } from './components/blocking-notification-message/blocking-notification-message.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SimpleVerticalStepsComponent } from './simple-vertical-steps/simple-vertical-steps.component';
import { SigningAreaComponent } from './components/signing-area/signing-area.component';
import { AwardWinnerViewerComponent } from './award-winner-viewer/award-winner-viewer.component';
import { FilledBoqItemsLoaderComponent } from './components/boqs/filled-boq-items-loader/filled-boq-items-loader.component';
import { PostQualificationRecommandationComponent } from '../modules/nest-tender-evaluation/evaluation-team/post-qualification-recommandation/post-qualification-recommandation.component';
import { CriteriaSelectionComponent } from '../modules/nest-tender-evaluation/evaluation-team/post-qualification-recommandation/criteria-selection/criteria-selection.component';
import { BlockingProgressLoaderComponent } from './components/blocking-progress-loader/blocking-progress-loader.component';
import { DiscountContainerComponent } from './components/discount-container/discount-container.component';
import { CostNotificationBannerComponent } from './cost-notification-banner/cost-notification-banner.component';
import { ForceUppercaseAndAlphanumericDirective } from './directives/force-uppercase-and-alphanumeric.directive';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import { TaskManagerComponent } from './components/gantt-chart/task-manager/task-manager.component';
import { NestedSelectorComponent } from './components/nested-selector/nested-selector.component';
import { MergedItemizationComponent } from './components/requisitions/merged-goods-requisition-viewer/merged-itemization/merged-itemization.component';
import { SelectionProcessComponent } from '../modules/nest-tender-initiation/tender-requisition/add-evaluation-criteria/evaluation-criteria-selection/selection-proccess/selection-process.component';
import { SharableCommentsViewerCustomComponent } from './components/sharable-comments-viewer-custom/sharable-comments-viewer-custom.component';
import { NegotiationPlanComponent } from '../modules/nest-tenderer-negotiation/negotiation-plan/negotiation-plan.component';

const declarations = [
  // Components
  AdvancedTenderSearchComponent,
  AdvancedTenderSearchTenderItemComponent,
  AdvancedSearchFilterComponent,
  SubmissionComponent,
  LotSelectionSubmissionComponent,
  SubmittedForEvaluationComponent,
  ItemsSortFilterComponent,
  RenderPdfComponent,
  PageNotFoundComponent,
  PageContainerComponent,
  QuickStatsComponent,
  CircularProgressBasStatsComponent,
  ChartComponent,
  SaveAreaComponent,
  LoaderComponent,
  BottomFooterComponent,
  PasswordStrengthBarComponent,
  ViewAttachmentComponent,
  AppBarComponent,
  NotificationsComponent,
  MainNavComponent,
  MenuItemsComponent,
  ViewHelpComponent,
  SharedLayoutComponent,
  TopBannerComponent,
  FullDataTableComponent,
  MatSelectSearchComponent,
  ModalHeaderComponent,
  ConfirmAreaComponent,
  VerticalTabsComponent,
  VerticalStepsFormComponent,
  CircularProgressBarComponent,
  WorkFlowMainComponent,
  EditableSpecsItemComponent,
  EditableSpecsTableComponent,
  EditableListItemsSelectorComponent,
  KeyValueListInputComponent,
  KeyValueInputComponent,
  EditableListItemComponent,
  BusinessLineSelectionComponent,
  GoodsSummaryComponent,
  ResumeComponent,
  HorizontalItemsSelectorComponent,
  HorizontalSelectorItemComponent,
  ViewAssignedUserComponent,
  BoqsViewerComponent,
  AddNegotiationTeamComponent,
  IncompleteCriteriaModalComponent,
  CriteriaSubmissionComponent,
  PricingComponent,
  SpecificationComponent,
  ConfirmationComponent,
  FieldsComponent,
  SignedAttachmentComponent,
  FromProfileComponent,
  AuthorizedRepresentativeComponent,
  AddGoodsSparePartsItemizationComponent,
  AddGoodsSubmissionItemizationComponent,
  AddGoodsRequisitionItemsSpecsComponent,
  AddWorksSubmissionItemizationComponent,
  AddGoodsSparePartsItemizationComponent,
  AddNonConsultancySubmissionItemizationComponent,
  AddWorksRequisitionItemsSpecsComponent,
  AddConsultancyRequisitionItemsSpecsComponent,
  AddNonConsultancyRequisitionItemsSpecsComponent,
  AnnualTurnoverSubmittedComponent,
  AnnualTurnoverSubmissionComponent,
  FinancialResourceSubmissionComponent,
  FinancialResourceSubmittedComponent,
  FinancialStatementSubmissionComponent,
  FinancialStatementSubmittedComponent,
  LitigationRecordSubmissionComponent,
  LitigationRecordSubmittedComponent,
  WorkEquipmentSubmissionComponent,
  WorkEquipmentSubmittedComponent,
  BusinessDetailsSubmissionComponent,
  BusinessDetailsSubmittedComponent,
  OrganizationStructureSubmittedComponent,
  OrganizationStructureSubmissionComponent,
  PersonnelSubmissionFormComponent,
  PersonnelSubmittedComponent,
  KeyActivitySubmissionComponent,
  KeyActivitySubmittedComponent,
  WorkExperienceSubmittedComponent,
  WorkExperienceSubmissionComponent,
  FinancialProposalConsultancyComponent,
  CustomTemplateSubmissionFormComponent,
  ItemDetailWithIcon,
  UserProfileComponent,
  UserSubscriptionsComponent,
  CompanyDetailsComponent,
  CompanyBusinessLinesComponent,
  ApproveBusinessComponent,
  ApproveTaxComponent,
  FinancialCapabilityComponent,
  EditUserProfileComponent,
  FinancialResourcesInformationComponent,
  LitigationRecordInformationComponent,
  OfficeLocationInformationComponent,
  PersonnelProfileInformationComponent,
  ViewWorkEquipmentComponent,
  WorkEquipmentProfileInformationComponent,
  ViewWorkExperienceComponent,
  ViewCashFlowsComponent,
  ViewOfficeLocationComponent,
  CompanyExperienceComponent,
  ViewPersonnelInformationComponent,
  VerifyDocumentComponent,
  ViewLitigationRecordComponent,
  CardIconCenterComponent,
  AdditionalDetailsComponent,
  AssociatesDetailsComponent,
  TaxDetailsComponent,
  CurriculumVitaeComponent,
  BusinessOwnersDetailsComponent,
  BusinessRegistrationDetailsComponent,
  EvaluationOptionsComponent,
  BoqSummaryComponent,
  WithdrawRequestComponent,
  EvaluationProgressBarComponent,
  SubmissionProgressBarComponent,
  TendererBoqsFillingComponent,
  SharedHrItemsSelectorComponent,
  NestMultiSelectComponent,
  SelectItemComponent,
  ReplaceTeamMemberFormComponent,
  CustomNumberInputComponent,
  InlineAlertBoxComponent,
  TendersListComponent,
  TendererDetailsComponent,
  CalenderViewFormComponent,
  EvaluationResultByCriteriaComponent,
  DataGenerationStepComponent,
  EvaluationReportGeneratorComponent,
  OpeningReportGeneratorComponent,
  RenderPdfComponent,
  TenderFormComponent,
  //Dynamic Form
  PaginatedSelectComponent,
  InputComponent,
  ButtonComponent,
  SelectComponent,
  SelectSearchComponent,
  SelectSearchClearDirective,
  SelectInfiniteScrollDirective,
  OnlyNumberDirective,
  ClickStopPropagation,
  AttachmentComponent,
  PhoneInputComponent,
  TimeComponent,
  TimePickerComponent,
  RadiobuttonComponent,
  CheckboxComponent,
  TextareaComponent,
  DynamicFieldDirective,
  CdkDetailRowDirective,
  DndDirective,
  MatInputCommaSeparatedDirective,
  MainDynamicFormComponent,
  GroupSelectComponent,
  DateComponent,
  PaginatedSelectTableComponent,
  PaginatedDataTableComponent,
  ViewDetailsItemComponent,
  StepsSharedTitleComponent,
  NestMessagingSectionComponent,
  ToolBarComponent,
  FooterComponent,
  FeaturesAndServicesComponent,
  SectionHeaderComponent,
  SummariesViewComponent,
  WordProcessorFormComponent,
  TeamMemberViewerComponent,
  CustomAlertBoxComponent,
  CustomAlertBoxDialogComponent,
  DottedCustomAlertBoxComponent,
  WordProcessorComponent,
  AnimatedDigitComponent,
  TeamViewTaskManagementComponent,
  ProgressCircularLoaderComponent,
  SubmissionCriteriaItemComponent,
  DeclarationOfInterestManagementComponent,
  //custom time picker
  HoursDirective,
  MinutesDirective,
  TimerPickerComponent,
  TendererDetailsComponent,
  ViewSummaryComponent,
  TableComponent,
  StepItemComponent,
  VerticalTabItemComponent,
  SubjectSectionComponent,
  ToAreaComponent,
  GroupItemComponent,
  EditableSpecsItemComponent,
  SharableAttachmentFormComponent,
  SharableVerifyDocumentFormComponent,
  TableItemPickerComponent,
  InlineConfirmComponent,
  SharableCommentsViewerComponent,
  SharableCommentsViewerCustomComponent,
  ComingSoonPageComponent,
  AssignTaskToSubordinateComponent,
  InputHintComponent,
  CompleteSubtaskComponent,
  AdvicesViewerComponent,
  AnnualTurnoverComponent,
  MergedNcRequisitionViewerComponent,
  MergedConsultancyRequisitionViewerComponent,
  MergedWorksRequisitionViewerComponent,
  MergedRequisitionSummaryComponent,
  PreviewCvComponent,
  AddUpdateTeamComponent,
  TenderInfoSummaryComponent,
  PeRequirementListComponent,
  CompleteSubmissionComponent,
  SummaryOfCostComponent,
  AddTaxBreakdownComponent,
  AddRemunirationExpenseComponent,
  AddReimbursementExpenseComponent,
  TenderTrackHtmlViewComponent,
  TenderTrackApprovalsComponent,
  UpsertTaxBreakdownComponent,
  TenderTrackerStagesComponent,
  OpeningReportComponent,
  TenderTrackerMiniStagesComponent,
  SearchDropdownComponent,
  RealTimeComponent,
  CommonRealtimeClockComponent,
  ViewTenderBoardResolutionComponent,
  ViewMergedRequisitionComponent,
  ViewEvaluationReportComponent,
  LinearCircularCheckerLoaderComponent,
  SubmissionActionDialogComponent,
  NegotiationPlanComponent,
  // Pipes
  SafeUrlPipe,
  SearchPipe,
  IsBase64Pipe,
  ReplacePipe,
  CreateRangePipe,
  SafeHtmlPipe,
  CleanHtmlPipe,
  SafeDatePipe,
  TimeSincePipe,
  WithoutPipe,
  TruncatePipe,
  DynamicPipe,
  RemoveUnderScorePipe,
  EllipsisPipe,
  ShowButtonPipe,
  ShowOtherButtonsPipe,
  WithLoadingPipe,
  OptionsObservablePipe,
  DisableDuplicatePipe,
  DoNotSanitizePipe,
  FilterBooleanPipe,
  FilterPipe,
  MustHavePipe,
  SortByPipe,
  SortByDatePipe,
  DigitOnlyDirective,
  HasPermissionDirective,
  ClickOutsideDirective,
  ValueExistsPipe,
  UserItemComponent,
  TransitionGroupComponent,
  TransitionGroupItemDirective,
  NcSpecificationsViewerComponent,
  ConsultancySpecificationsViewerComponent,
  HelpTextComponent,
  MergedGoodsRequisitionViewerComponent,
  NumberPipePipe,
  UnmergeGoodsItemizationComponent,
  NormalTableExpandableRowComponent,
  NormalTableExpandableRow2Component,
  NumberPipePipe,
  SortArrayPipe,
  DatetimePipe,
  UnicodeToEmojiPipe,
  PaginatedTableExpandableRowComponent,
  TendererSelectionComponent,
  TextAreaDialogComponent,
  ViewPendingTenderAwardComponent,
  NestedSpecificationsInfoBarComponent,
  BoqFetcherComponent,
  InvitationLetterComponent,
  FlatNestedSpecificationsComponent,
  LinearProgressBarComponent,
  SimpleLinearProgressBarComponent,
  AlertDialogComponent,
  AdvancedTenderSearchComponent,
  UrlListenerReportViewerComponent,
  TranslatePipe,
  SpecificationItemManagerDialogComponent,
  FormStepsComponent,
  UpsertFormStepsComponent,
  TenderWorkspaceComponent,
  TenderCalendarConfirmationFormComponent,
  TenderDocumentCreatorComponent,
  AddEvaluationCriteriaComponent,
  EvaluationCriteriaSelectionComponent,
  EvaluationCriteriaDetailsComponent,
  EvaluationCriteriaScoreComponent,
  EvaluationStageMarkFormComponent,
  CriteriaDetailsFormComponent,
  EditableSpecsTableRowComponent,
  AdvancedTenderSearchTenderItemComponent,
  SingleHorizontalStackedBarChartComponent,
  HorizontalStackedBarChartComponent,
  DynamicViewComponent,
  SaveTenderCalenderComponent,
  CircularProgressLoaderComponent,
  DataFetcherCircularProgressComponent,
  ViewEvaluationCriteriasComponent,
  TenderDetailComponent,
  ViewTendererSubmissionComponent,
  DocumentPublishStatusComponent,
  SubmissionComponent,
  ViewTendererFrameworkComponent,
  PeRequirementComponent,
  CalendarDisplayComponent,
  StatisticsItemComponent,
  ItemsSortFilterComponent,
  TenderItemComponent,
  ApproveBusinessComponent,
  AppTimePickerComponent,
  TerminateReqTenderComponent,
  TablePropertiesComponent,
  TableCellPropertiesComponent,
  SystemSearchAreaComponent,
  ExcelUploaderComponent,
  NumberInputComponent,
  InternetStatusBarComponent,
  ItemsSorterComponent,
  UnderConstructionComponent,
  HelpDialogComponent,
  ViewServiceBillComponent,
  TinyCircularProgressComponent,
  DeleteConfirmationComponent,
  CalenderViewItemComponent,
  NestStepperComponent,
  StepComponent,
  DisableTypingInsideConditionBlockDirective,
  FrontendPaginatorComponent,
  EvaluationShortlistedApplicantsComponent,
  BillPaymentDetailComponent,
  UpsertOwnersComponent,
  UnderMaintenanceComponent,
  CustomAccordionComponent,
  AccordionItemComponent,
  LoadingDialogComponent,
  GoodsItemCollectionComponent,
  GoodsSparePartCollectionComponent,
  GoodsRelatedResvicesCollectionComponent,
  GoodsIncidentalResvicesCollectionComponent,
  GoodsAfterSellResvicesCollectionComponent,
  GoodsSpareItemInputManagerComponent,
  GoodsItemInputManagerComponent,
  GoodsItemComponent,
  GoodsSpareItemComponent,
  GoodsItemInputFieldComponent,
  SpecificationDescriptionEditorComponent,
  CurrencyChangeComponent,
  HtmlCodeEditorComponent,
  CustomCheckBoxInputComponent,
  NestVerticalStepperComponent,
  NestVerticalStepComponent,
  CalenderViewItemComponent,
  CustomAccordionComponent,
  AccordionItemComponent,
  PageContainerComponent,
  GoodsItemInputFieldComponent,
  SpecificationImportDialogComponent,
  CustomTableFormComponent,
  EvaluationCuisComponent,
  GovernmentTendererComponent,
  AddGovernmentComponent,
  ConsultancyExpertsComponent,
  ExpertViewComponent,
  TableFormComponent,
  GoodsCustomSubmissionComponent,
  GoodsFinancialFormDesignComponent,
  FormDesignStudioComponent,
  BasicInformationComponent,
  FormElementsComponent,
  FormPreviewComponent,
  GroupFormComponent,
  ElementContainerComponent,
  FormStudioGenericFieldComponent,
  CustomTableComponent,
  CustomFormInputFieldComponent,
  CustomFormSelectFieldComponent,
  PlainTableComponent,
  CustomTableWithServiceComponent,
  CustomTableWithoutServiceComponent,
  CustomTableItemContainerComponent,
  CustomTableInputManagerComponent,
  CustomTableInputFieldComponent,
  FormulaCreationContainerComponent,
  CreateElementComponent,
  GoodsFinancialSummaryComponent,
  PreQualificationDocumentCreatorComponent,
  PreQualificationCalenderConfirmationFormComponent,
  FilterElementsPipe,
  CustomNotificationComponent,
  ConsultancySubmissionComponent,
  ConsultancyWorkScheduleComponent,
  KeyPersonnelQualificationComponent,
  FinancialProposalComponent,
  AttachmentViewerComponent,
  InfoWrapperComponent,
  BlockingLoaderComponent,
  TextInputModelComponent,
  DynamicDetailsViewerComponent,
  WorkFlowQuickTaskInfoComponent,
  WorkFlowPreviewerComponent,
  CustomNotificationComponent,
  DigitalSignatureInputComponent,
  HtmlViewerComponent,
  AllCommentsViewerDialogComponent,
  AllCommentsViewerComponent,
  WorkFlowActionSelectorComponent,
  WorkflowUsersListComponent,
  HtmlViewerContentComponent,
  AwardWinnerViewerComponent,
  BlockingNotificationErrorComponent,
  FilledBoqItemsLoaderComponent,
  UserPickerModalComponent,
  BlockingNotificationMessageComponent,
  ConfirmationDialogComponent,
  SimpleVerticalStepsComponent,
  SigningAreaComponent,
  PostQualificationRecommandationComponent,
  CriteriaSelectionComponent,
  GanttChartComponent,
  SelectionProcessComponent,
  MergedItemizationComponent,
];

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    RouterModule,
    MaterialModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    RouterModule,
    MaterialModule,
    RecaptchaModule,
    FilledBoqItemsLoaderComponent,
    BlockingProgressLoaderComponent,
    FilledBoqItemsLoaderComponent,
    DiscountContainerComponent,
    CostNotificationBannerComponent,
    ForceUppercaseAndAlphanumericDirective,
    TaskManagerComponent,
    NestedSelectorComponent,
    GanttChartComponent,
  ],
})
export class SharedModule {}
