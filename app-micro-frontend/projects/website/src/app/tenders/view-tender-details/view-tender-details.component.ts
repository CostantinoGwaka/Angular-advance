import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { AttachmentService } from '../../../services/attachment.service';
import { GraphqlService } from '../../../services/graphql.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  GET_PUBLIC_TENDERS_PROCURING_ENTITY_BY_UUID_MINI
} from '../../store/public-tenders.graphql';
import {
  AttachmentSharable,
  SearchOperation,
} from 'src/app/store/global-interfaces/organizationHiarachy';
import { EntityObjectTypeEnum, ObjectForEntityDetail } from 'src/app/modules/nest-app/store/tender/tender.model';
import { DocumentReaderService } from 'src/app/modules/document-reader/services/document-reader.service';
import { ApplicationState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { selectSelectedPublishedEntity } from 'src/app/store/temporary/views/views.selectors';
import { Subscription } from 'rxjs';
import { ReplacePipe } from '../../../shared/pipes/replace.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ViewDetailsItemComponent } from '../../../shared/components/view-details-item/view-details-item.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ParallaxContainerComponent } from '../../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { Institution } from "../../../modules/nest-pe-management/store/institution/institution.model";
import { ApolloNamespace } from "../../../apollo.config";
import { MergedGoodsRequisitionViewerComponent } from 'src/app/shared/components/requisitions/merged-goods-requisition-viewer/merged-goods-requisition-viewer.component';
import { MergedNcRequisitionViewerComponent } from 'src/app/shared/components/requisitions/merged-nc-requisition-viewer/merged-nc-requisition-viewer.component';
import { MergedConsultancyRequisitionViewerComponent } from 'src/app/shared/components/requisitions/merged-consultancy-requisition-viewer/merged-consultancy-requisition-viewer.component';
import { MergedWorksRequisitionViewerComponent } from 'src/app/shared/components/requisitions/merged-works-requisition-viewer/merged-works-requisition-viewer.component';
import { DynamicViewComponent } from 'src/app/shared/components/dynamic-view/dynamic-view.component';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { NotificationService } from 'src/app/services/notification.service';
import { GET_ANY_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_LIGHT_PUBLIC } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { GET_ENTITY_EVALUATION_CRITERIA_BY_ENTITY_TYPE_FOR_MERGED_REQ_VIEW } from 'src/app/modules/nest-tender-evaluation/store/evaluation-criteria/evaluation-criterial.graphql';
import { ViewEvaluationCriteriasComponent } from 'src/app/shared/components/view-evaluation-criterias/view-evaluation-criterias.component';
import { GET_TENDER_ACTUAL_DATE_BY_UUID } from 'src/app/modules/nest-tender-initiation/tender-requisition/store/tender-requisition.graphql';
import { GET_ADDITIONAL_DETAIL_CUSTOM_DATA_BY_ENTITY_ID } from 'src/app/modules/nest-tender-initiation/store/tender-workspace/tender-workspace.graphql';
import { StorageService } from 'src/app/services/storage.service';
import { InfoWrapperComponent } from 'src/app/shared/components/info-wrapper/info-wrapper.component';
import { TendererBoqViewOnlyComponent } from 'src/app/shared/components/boqs/tenderer-boq-view-only/tenderer-boq-view-only.component';
export interface EntityDetails {
  uuid: string;
  entityNumber: string;
  description: string;
  procuringEntityName: string;
  entityCategory: string;
  procurementMethod: string;
  contractType: string;
  entitySubCategory: string;
  gradeType: string;
  numberOfStages: string;
  dateOfInvitation: string;
  entityType: string;
  unispcCode: string;
  submissionDeadLine: string;
  procuringEntity?: Institution
}

export function transformEntityDetails(
  entity: any,
  entityType: EntityObjectTypeEnum
): EntityDetails {
  let entityDefault: EntityDetails = {
    uuid: '',
    entityNumber: '',
    description: '',
    procuringEntityName: '',
    entityCategory: '',
    procurementMethod: '',
    contractType: '',
    entitySubCategory: '',
    gradeType: '',
    numberOfStages: '',
    dateOfInvitation: '',
    entityType: '',
    unispcCode: '',
    submissionDeadLine: '',
    procuringEntity: null,
  };

  entityDefault.procuringEntityName = entity.tender?.procuringEntityName;
  entityDefault.description = entity.tender?.descriptionOfTheProcurement;
  entityDefault.contractType = entity.tender?.contractType?.name;
  entityDefault.entityNumber = entity.tender?.donorTenderNumber != "" && entity.tender?.donorTenderNumber != null ? entity.tender?.donorTenderNumber : entity.tender?.tenderNumber;
  entityDefault.procurementMethod =
    entity.tender?.procurementMethod?.description;
  entityDefault.entityCategory = entity.tender?.procurementMethod?.description;
  entityDefault.entitySubCategory = entity.tender?.tenderSubCategoryName;
  entityDefault.gradeType = 'Medium';
  entityDefault.numberOfStages = entity.tender?.procurementStages;
  entityDefault.unispcCode = entity.tender?.unispc;

  switch (entityType) {
    case EntityObjectTypeEnum.TENDER:
      entityDefault.uuid = entity.uuid;
      entityDefault.dateOfInvitation =
        entity.objectActualDateViewEntity?.invitationDate;
      entityDefault.submissionDeadLine =
        entity.objectActualDateViewEntity?.submissionOrOpeningDate;
      entityDefault.entityType = 'Tender';
      break;
    case EntityObjectTypeEnum.PLANNED_TENDER:
      entityDefault.entityType = 'Pre Qualification';
      entityDefault.dateOfInvitation =
        entity.objectActualDateViewEntity?.invitationDate;
      entityDefault.submissionDeadLine =
        entity.objectActualDateViewEntity?.submissionOrOpeningDate;
      break;
    case EntityObjectTypeEnum.FRAMEWORK:

      entityDefault.entityNumber = entity.frameworkNumber;
      entityDefault.description = entity.description;
      entityDefault.procuringEntityName = entity.procuringEntityName;
      entityDefault.entityCategory = entity.tenderCategoryName;
      entityDefault.procurementMethod = entity.procurementMethodName
      entityDefault.entitySubCategory = entity.tenderSubCategoryName;
      entityDefault.dateOfInvitation = entity.invitationDate;
      entityDefault.entityType = 'Framework';
      entityDefault.submissionDeadLine = entity.submissionOrOpeningDate;



      break;
    case EntityObjectTypeEnum.CONTRACT:
      entityDefault.entityType = 'Contract';
      break;
    default:
      break;
  }

  return entityDefault;
}

interface MergedMainProcurementRequisitionData {
  id: number;
  uuid: string;
  marketApproach?: string;
  referenceNumber?: string;
  useBOQProcess?: boolean;
  mergedProcurementRequisitions?: any[],
  tender: {
    uuid: string;
    procurementCategoryAcronym: string;
    procurementCategoryName: string;
    tenderSubCategoryUuid: string;
    tenderNumber: string;
    tenderSubCategoryName: string;
    estimatedBudget: number;
    financialYearCode: string;
    donorTenderNumber: string;
    invitationDate: string;
    descriptionOfTheProcurement: string;
    procurementMethod: {
      procurementMethodCategory: string;
      description: string;
    };
    sourceOfFund: {
      name: string;
    };
    isCuis?: any;
  };
}

@Component({
  selector: 'app-view-tender-details',
  templateUrl: './view-tender-details.component.html',
  standalone: true,
  animations: [fadeIn],
  imports: [
    LayoutComponent,
    ParallaxContainerComponent,
    LoaderComponent,
    ViewDetailsItemComponent,
    MatButtonModule,
    MatIconModule,
    TitleCasePipe,
    ReplacePipe,
    DynamicViewComponent,
    InfoWrapperComponent
  ],
})
export class ViewTenderDetailsComponent implements OnInit, OnDestroy {
  entityType: EntityObjectTypeEnum;
  tenderData: any;
  reqUuid: any;
  loading: boolean = false;
  loadingPeDetails: boolean = false;
  loadFetchingRequisition: boolean = false;
  loadingEvaluationCriteria: boolean = false;
  objectForEntityDetail: ObjectForEntityDetail;
  tenderCalendars = [];
  additionalDetails: { [key: string]: any } = {};
  loadingAdditionalDetails = false;
  loadingTenderCalendar = false;
  evaluationCriterias: any[];
  selectedUuid: string;
  mergedMainProcurementRequisition: MergedMainProcurementRequisitionData;
  invitationDate: string;
  deadline: string;
  storeSub = Subscription.EMPTY;
  fields: {
    isSearchable?: boolean;
    isSortable?: boolean;
    operation?: SearchOperation;
    orderDirection?: 'ASC' | 'DESC';
    fieldName?: string;
    searchValue?: string;
    searchValue2?: string;
  }[] = [];
  loadViewAttachment: { [index: number]: boolean } = {};

  entity: EntityDetails = {
    uuid: '',
    entityNumber: '',
    description: '',
    procuringEntityName: '',
    entityCategory: '',
    procurementMethod: '',
    contractType: '',
    entitySubCategory: '',
    gradeType: '',
    numberOfStages: '',
    dateOfInvitation: '',
    entityType: '',
    unispcCode: '',
    submissionDeadLine: '',
    procuringEntity: null
  };
  selectedIndex = 0;
  accessToken: string = null;
  tenderDetails: any;
  requisitionDateForBOQViewer: any;

  constructor(
    private apollo: GraphqlService,
    private router: Router,
    private attachmentService: AttachmentService,
    private store: Store<ApplicationState>,
    private notificationService: NotificationService,
    private documentReaderService: DocumentReaderService,
    private storageService: StorageService,
  ) { }
  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  ngOnInit(): void {
    this.getSelectedItem()
    this.scrollToTop();
    this.checkAccessToken();
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  async getSelectedItem() {
    this.loading = true;
    this.storeSub = this.store.select(selectSelectedPublishedEntity).subscribe(
      (tenderDetails) => {
        this.loading = false;
        if (tenderDetails) {
          this.reqUuid = tenderDetails?.entityUuid || tenderDetails.uuid;
          this.tenderDetails = tenderDetails;
          if (tenderDetails.entityType === 'TENDER') {
            this.getTenderRequisitionByUuid(this.reqUuid);
          }
          this.selectedUuid = this.reqUuid;
          this.entityType = tenderDetails?.entityType;
          this.entity = {
            ...this.entity,
            uuid: tenderDetails.entityUuid,
            entityNumber: tenderDetails.entityNumber,
            description: tenderDetails.descriptionOfTheProcurement,
            procuringEntityName: tenderDetails.procuringEntityName,
            entityCategory: tenderDetails.procurementCategoryName,
            procurementMethod: '',
            contractType: '',
            entitySubCategory: tenderDetails.entitySubCategoryName,
            gradeType: '',
            numberOfStages: '',
            dateOfInvitation: tenderDetails.invitationDate,
            entityType: tenderDetails.entityType,
            unispcCode: '',
            submissionDeadLine: tenderDetails.submissionOrOpeningDate,
          };
          this.getProcuringEntityDetailsByUuid(tenderDetails.procuringEntityUuid).then();
        } else {
          this.router.navigate(['/']).then();
        }
      })
  }
  ngAfterViewInit() {
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  async viewAttachment(attachment: AttachmentSharable, i: number) {
    const splitFileTitles: string[] = attachment?.title.split('.');
    const fileType: string = splitFileTitles[splitFileTitles?.length - 1];
    this.loadViewAttachment[i] = true;
    await this.attachmentService.fetchAttachment(
      attachment.attachmentUuid,
      fileType || 'pdf'
    );
    this.loadViewAttachment[i] = false;
  }

  formatDate(date: string, withTime: boolean = false) {
    let formattedDate = moment(date).format('DD MMM YYYY');
    if (withTime) {
      formattedDate += ' ' + moment(date).format('h:mm A');
    }
    return formattedDate;
  }

  previewTenderDocument(requisitionUuid: string, entityType: EntityObjectTypeEnum) {
    this.documentReaderService.getDocumentByEntityTypeAndEntityUuid(
      entityType,
      requisitionUuid
    ).then();
  }

  async getTenderRequisitionByUuid(mergedRequisitionByUuid: string) {
    this.loadFetchingRequisition = true;
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query:
          GET_ANY_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_LIGHT_PUBLIC,
        variables: {
          uuid: mergedRequisitionByUuid,
        },
      });
      if (
        response.data.getAnyMergedMainProcurementRequisitionByUuid.code === 9000
      ) {
        this.mergedMainProcurementRequisition =
          response.data.getAnyMergedMainProcurementRequisitionByUuid.data;

        this.objectForEntityDetail = {
          objectUuid: this.mergedMainProcurementRequisition.uuid,
          objectId: this.mergedMainProcurementRequisition.id,
          objectType: EntityObjectTypeEnum.TENDER,
        };

        this.getTenderDetails();

        this.loadFetchingRequisition = false;
      } else {
        console.error(
          'Failed to get requisition, Please try again...',
        );
        console.error(
          response.data.getMergedProcurementRequisitionByUuid?.message,
        );
      }
    } catch (e) {
      console.error(e);
      this.loadFetchingRequisition = false;
      console.error(
        'Failed to get requisition, Please try again...',
      );
    }
  }

  checkAccessToken() {
    this.accessToken = this.storageService.getItem('currentClient');
  }

  async getTenderDetails() {
    try {
      if (this.objectForEntityDetail) {
        this.loadingAdditionalDetails = true;
        const response: any = await this.apollo.fetchData({
          apolloNamespace: ApolloNamespace.app,

          query: GET_ADDITIONAL_DETAIL_CUSTOM_DATA_BY_ENTITY_ID,
          variables: {
            entityId: this.objectForEntityDetail.objectId,
            entityType: this.objectForEntityDetail.objectType,
          },
        });
        this.loadingAdditionalDetails = false;
        if (
          response.data.getEntityAdditionalDetailsByIdAndTypeCustom?.code ===
          9000
        ) {
          let additionalDetails =
            response.data.getEntityAdditionalDetailsByIdAndTypeCustom?.data;
          if (Object.keys(additionalDetails).length === 0) {
            additionalDetails = null;
          } else {
            let sortedObj = {};
            const sortedKeys = Object.keys(additionalDetails).sort(
              (a, b) =>
                additionalDetails[a].appMetaDataFieldsFormDto.sortNumber -
                additionalDetails[b].appMetaDataFieldsFormDto.sortNumber,
            );
            for (const key of sortedKeys) {
              sortedObj[key] = additionalDetails[key];
            }

            Object.keys(sortedObj).forEach((key) => {
              if (sortedObj[key].value !== "NOT_SPECIFIED" && sortedObj[key].value !== "NOT_APPLICABLE" && sortedObj[key].value !== "NOT_ALLOWED" && sortedObj[key].value !== "NOT_REQUIRED") {
                this.additionalDetails[
                  sortedObj[key].appMetaDataFieldsFormDto.label
                ] = {
                  ...this.additionalDetails[
                  sortedObj[key].appMetaDataFieldsFormDto.label
                  ],
                  [key]: sortedObj[key].value,
                };
              }
            });

          }
        }
      }
    } catch (e) {
      this.loadingAdditionalDetails = false;
      console.error(e);
    }
  }

  async getProcuringEntityDetailsByUuid(peUuid: string) {
    this.loadingPeDetails = true;
    const response: any = await this.apollo.fetchData({
      apolloNamespace: ApolloNamespace.uaa,
      query: GET_PUBLIC_TENDERS_PROCURING_ENTITY_BY_UUID_MINI,
      variables: {
        uuid: peUuid,
      },
    });

    if (response.data.getProcuringEntityDetailsByUuid.data) {
      const procuringEntity = response.data.getProcuringEntityDetailsByUuid.data;

      this.entity = {
        ...this.entity,
        procuringEntity: procuringEntity,
      }
    }

    this.loadingPeDetails = false;
  }

}
