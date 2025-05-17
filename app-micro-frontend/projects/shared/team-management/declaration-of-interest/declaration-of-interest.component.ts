import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { firstValueFrom, map } from 'rxjs';
import { GET_PROCURING_ENTITY_BY_UUID } from 'src/app/modules/nest-app/store/tender/tender.graphql';
import { EntityObjectTypeEnum, Tender } from 'src/app/modules/nest-app/store/tender/tender.model';
import { AttachmentService } from '../../../services/attachment.service';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import { StorageService } from '../../../services/storage.service';
import { fadeIn } from 'src/app/shared/animations/basic-animation';
import { fadeInOut } from 'src/app/shared/animations/router-animation';
import {
  FieldConfig,
  FieldType,
} from 'src/app/shared/components/dynamic-forms-components/field.interface';

import { TitleCasePipe, NgClass } from '@angular/common';
import { GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { Store, select } from '@ngrx/store';
import { GET_CONFLICT_REASONS, CREATE_CONFLICT_OF_INTEREST, GET_CONFLICT_OF_INTEREST_BY_MEMBER_UUID, CLOSE_CONFLICT_DECLARATION, GET_APPLIED_TENDERERS } from 'src/app/modules/nest-tender-evaluation/store/conflict-of-interest/conflict-of-interest.graphql';
import { HTMLDocumentService } from '../../../services/html-document.service';
import { SettingsService } from '../../../services/settings.service';
import { ApplicationState } from 'src/app/store';
import { Country } from '../../components/dynamic-forms-components/phone-input/store/input-country.model';
import { GET_PRE_QUALIFICATIONS_BY_UID } from 'src/app/modules/nest-pre-qualification/store/pre-qualification.graphql';
import { selectAllAuthUsers } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import {
  PaginatedDataInput,
  PaginatedDataService,
} from '../../../services/paginated-data.service';
import * as fromConflictInterestGraphQl
  from "../../../modules/nest-tender-evaluation/store/conflict-of-interest/conflict-of-interest.graphql";
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';
import { ConfirmAreaComponent } from '../../components/confirm-area/confirm-area.component';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { LoaderComponent } from '../../components/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ConflictOfInterestDto {
  conflictDeclarationReasonUuids: string[];
  evaluationCommitteeInfoUuid: string;
  entityUuid: string;
  tendererUuid: string;
}
@Component({
  selector: 'app-declaration-of-interest',
  templateUrl: './declaration-of-interest.component.html',
  styleUrls: ['./declaration-of-interest.component.scss'],
  animations: [fadeInOut, fadeIn],
  providers: [TitleCasePipe],
  standalone: true,
  imports: [
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    LoaderComponent,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    HasPermissionDirective,
    ConfirmAreaComponent,
    DoNotSanitizePipe
  ],
})
export class DeclarationOfInterestComponent implements OnInit {
  @Input() entityType: EntityObjectTypeEnum;
  @Input() entityUuid: string;
  @Input() teamUuid: string;
  @Input() memberUuid: string;
  @Output() closeForm: EventEmitter<any> = new EventEmitter();
  searchString: string;
  conflictField: FieldConfig = {
    type: FieldType.select,
    label: 'Select Conflict Of Interest',
    key: 'conflictUuid',
    query: GET_CONFLICT_REASONS,
    searchFields: ['description'],
    options: [{ uuid: 'Other', description: 'Other' }],
    optionName: 'description',
    optionValue: 'uuid',
    mapFunction: (item) => {
      return {
        uuid: item.uuid,
        description: item.description,
      };
    },
    useObservable: true,
    validations: [],
    rowClass: 'col12',
  };
  availableConflict: any = {};
  oldAvailableConflict: any = {};

  tenderers: {
    uuid: string;
    name: string;
    email: string;
    postalAddress: string;
    registrationCountry: Country;
  }[] = [];
  currentPage: number = 0;
  previousPage: number = 0;
  pageSize: number = 25;

  tenderPages: {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    postalAddress: string;
    executiveLeaderTitle: string;
    executiveLeaderName: string;
    personnelInformationList: {
      firstName: string;
      middleName: string;
      lastName: string;
      jobTitle: string;
    }[];
  }[][] = [];
  loadingTenderer: boolean = false;
  conflictReasonSettings: { uuid: string; reason: string }[] = [];
  triggerReasonForm: any = {};
  savingConflict: any = {};
  tender: Tender;
  pe: { uuid; string; name: string };
  loadingTenderInfo: boolean = false;
  hasConflict: boolean | any = null;
  fetchingLogo: boolean = false;
  logoData: any;
  conflictOfInterests = [];
  tenderWithConflict = 0;
  moreInfo: any = {};
  otherPersonnelList: any = {};
  saving: boolean = false;
  loadingConflicts: boolean = true;

  loadingTemplate: boolean = false;
  hasConflictTemplate: boolean;
  loadingMessage?: string;
  htmlContent?: string;
  htmlDocument?: string;
  showPassPhrase = false;
  hide = true;
  passphrase?: string;
  attachmentUid: string = null;
  conflictReasonTenderer = [];
  showConfirm: boolean = false;
  triggerTemplate: boolean = false;

  declaredSomething: any = {};
  selectedOption: { [id: string]: boolean } = {};

  // declaredNoConflicts: any = {};
  declaringNoConflicts: any = {};
  constructor(
    private apollo: GraphqlService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private htmlDocumentService: HTMLDocumentService,
    private settingServices: SettingsService,
    private store: Store<ApplicationState>,
    private titleCasePipe: TitleCasePipe,
    private attachmentService: AttachmentService,
    private paginatedDataService: PaginatedDataService,
  ) { }

  selected(id: string) {
    this.availableConflict[id] = !this.availableConflict[id];
  }

  changes() {
    this.tenderPages = this.chunkItems(
      this.tenderers.filter(
        (tenderer: {
          uuid: string;
          name: string;
          email: string;
          phone: string;
          postalAddress: string;
          registrationCountry: Country;
        }) => {
          return (
            tenderer.name
              .toLowerCase()
              .indexOf(this.searchString.toLowerCase()) > -1 ||
            tenderer.email
              .toLowerCase()
              .indexOf(this.searchString.toLowerCase()) > -1
          );
        }
      ),
      this.pageSize
    );
  }

  changedConflictForm(tendererUuid: string) {
    this.triggerReasonForm[tendererUuid] = false;
  }

  clearSelection(tendererUuid: string) {
    if (this.oldAvailableConflict[tendererUuid]) {
      this.availableConflict[tendererUuid] =
        this.oldAvailableConflict[tendererUuid];
      this.declaredSomething[tendererUuid] = true;
    } else {
      this.availableConflict[tendererUuid].reason = null;
      this.availableConflict[tendererUuid].selection = null;
      this.selectedOption[tendererUuid] = null;
    }
  }

  async onChange(tendererUuid: string) {
    this.availableConflict[tendererUuid].selection =
      this.selectedOption[tendererUuid];

    if (!this.selectedOption[tendererUuid]) {
      /// auto save has no conflict
      await this.saveSingleConflictOfInterest(tendererUuid);
    }
  }

  // noTenderConflictOfInterest(tendererUuid: string) { }

  openDropDown(tendererUuid: string) {
    this.triggerReasonForm[tendererUuid] = true;
    setTimeout(() => {
      const reasonListElement: any = document.getElementById(
        'reason_' + tendererUuid
      );
      // const length = reasonListElement.options.length;
      const evt: any = document.createEvent('HTMLEvents');
      evt.initEvent('change', false, true);
      reasonListElement.dispatchEvent(evt);
    }, 100);
  }

  ngOnInit(): void {
    if (this.entityUuid) {

      switch (this.entityType) {
        case EntityObjectTypeEnum.PLANNED_TENDER:
          this.initAppTender().then(async (_) => {
            await this.getConflictsOfInterestReasonSettings();
            if (this.teamUuid) {
              await this.getAppliedTenderers();
              await this.getConflictOfInterest();
            }
            this.loadingTenderInfo = false;
            this.loadingConflicts = false;
          });
          break;
        case EntityObjectTypeEnum.TENDER:
          this.initTender().then(async (_) => {
            await this.getConflictsOfInterestReasonSettings();
            if (this.teamUuid) {

              await this.getAppliedTenderers();
              await this.getConflictOfInterest();
            }
            this.loadingTenderInfo = false;
            this.loadingConflicts = false;
          });
          break;
        case EntityObjectTypeEnum.FRAMEWORK:
          break;
        case EntityObjectTypeEnum.CONTRACT:
          break;
        default:
          break;
      }

    }
  }

  async initAppTender() {
    this.loadingTenderInfo = true;
    const response: any = await this.apollo.fetchData({
      query: GET_PRE_QUALIFICATIONS_BY_UID,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        uuid: this.entityUuid,
      },
    });
    this.tender =
      response?.data?.findPreQualificationByUuid?.data?.tender;
    this.loadingConflicts = true;
    await this.getProcuringEntity(this.tender.procurementEntityUuid);
    this.loadingTenderInfo = false;
  }

  async initTender() {
    this.loadingTenderInfo = true;
    const response: any = await this.apollo.fetchData({
      query: GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        uuid: this.entityUuid,
      },
    });
    this.tender =
      response?.data?.getMergedProcurementRequisitionByUuid?.data?.mergedMainProcurementRequisition?.tender;
    this.loadingConflicts = true;
    await this.getProcuringEntity(this.tender.procurementEntityUuid);
    this.loadingTenderInfo = false;
  }

  async getProcuringEntity(uuid: string) {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_PROCURING_ENTITY_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: uuid,
        },
      });
      this.pe = response?.data?.findProcuringEntityByUuid?.data;
    } catch (e) {
      console.error(e);
    }
  }

  async saveSingleConflictOfInterest(tendererUuid: string) {
    try {
      let reasonsUuids: string[] = [];
      let hasConflict = false;

      if (this.selectedOption[tendererUuid]) {
        reasonsUuids = this.availableConflict[tendererUuid]?.reason;
        hasConflict = true;
      }

      const results = await this.apollo.mutate({
        mutation: CREATE_CONFLICT_OF_INTEREST,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          conflictOfInterestDto: {
            conflictDeclarationReasonUuids: reasonsUuids,
            evaluationCommitteeInfoUuid: this.memberUuid,
            tenderUuid: this.entityUuid,
            tendererUuid: tendererUuid,
            hasConflict: hasConflict,
          },
        },
      });

      if (results.data.createConflictOfInterest.code === 9000) {
        this.saving = false;
        this.notificationService.successMessage(
          'Conflict of interest is declared successfully'
        );
        await this.getConflictOfInterest();
      } else {
        console.error(results.data.createConflictOfInterest.message);
        this.notificationService.errorMessage(
          'Problem occurred while declaring conflicts of interests, please try again'
        );
      }
    } catch (e) {
      this.saving = false;
      console.error(e);
      this.notificationService.errorMessage(
        'Problem occurred while declaring conflicts of interests, please try again'
      );
    }
  }

  // async saveConflictOfInterest() {
  //   try {
  //     const results = await firstValueFrom(
  //       forkJoin(
  //         this.transformConflictData().map((conflict: ConflictOfInterestDto) =>
  //           this.apollo.mutate({
  //             mutation: CREATE_CONFLICT_OF_INTEREST,
  //             variables: {
  //               conflictOfInterestDto: {
  //                 conflictDeclarationReasonUuids:
  //                   conflict.conflictDeclarationReasonUuids,
  //                 evaluationCommitteeInfoUuid: this.teamUuid,
  //                 tenderUuid: conflict.entityUuid,
  //                 tendererUuid: conflict.tendererUuid,
  //                 hasConflict: true,
  //               },
  //             },
  //           })
  //         )
  //       )
  //     );
  //     await this.getConflictOfInterest();
  //     this.saving = false;
  //     this.notificationService.successMessage('Save successfully');
  //   } catch (e) {
  //     console.error(e);
  //     this.notificationService.errorMessage(e.message);
  //     this.saving = false;
  //   }
  // }

  // async saveConflictOfInterest(tendererUuid:string) {
  //   try{
  //     // const results = await firstValueFrom(forkJoin(this.transformConflictData().map((conflict: ConflictOfInterestDto) => )));
  //     this.transformConflictData();
  //     const results = this.apollo.mutate({
  //       mutation: CREATE_CONFLICT_OF_INTEREST,
  //       variables: {
  //         conflictOfInterestDto: {
  //           conflictDeclarationReasonUuids:[this.availableConflict[tendererUuid].reason],
  //           evaluationCommitteeInfoUuid:eval(this.storageService.getItem('userUuid')),
  //           entityUuid:this.entityUuid,
  //           tendererUuid:tendererUuid,
  //           hasConflict:false
  //         }
  //       }
  //     })
  //     await this.getConflictOfInterest();
  //     this.declaringNoConflicts[tendererUuid] = false;
  //     this.notificationService.successMessage('Save successfully');
  //   } catch(e){
  //
  //     this.notificationService.errorMessage(e.message);
  //     this.declaringNoConflicts[tendererUuid] = false;
  //   }
  //
  // }

  // CREATE TEMPLATE
  async getCreatedTemplate() {
    const index = Object.keys(this.availableConflict).findIndex(
      (key) => this.availableConflict[key].selection == true
    );
    this.hasConflictTemplate = index > -1;

    this.loadingTemplate = true;
    this.loadingMessage = 'Just a moment, getting template...';

    const user = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), map(i => i[0])));

    //get List of tenderer with conflict of reason
    if (this.hasConflictTemplate == true) {
      const listOfTenderersWithConflict: any = this.transformConflictData();
      this.conflictReasonTenderer = listOfTenderersWithConflict.map((data) => {
        const uuids = data.conflictDeclarationReasonUuids.flat();
        const conflictReasonTypesPull = this.conflictReasonSettings.filter(
          (reason) => uuids.includes(reason.uuid)
        );

        return {
          uuid: data.tendererUuid,
          reasons: conflictReasonTypesPull,
        };
      });
    }
    const listOfTenderers = this.tenderers.map((setData) => {
      const tendererReasons = this.conflictReasonTenderer.find(
        (data) => data.uuid == setData.uuid
      );
      return {
        uuid: setData.uuid,
        name: setData.name,
        reasons: tendererReasons?.reasons || [],
        physicalAddress: setData.postalAddress || 'N/A',
        country: setData.registrationCountry.name.toUpperCase() || 'N/A',
      };
    });

    this.htmlContent = undefined;
    this.htmlContent = await this.htmlDocumentService.createSimpleHTMLDocument({
      procuringEntityUuid: this.tender?.procurementEntityUuid,
      nonSTDTemplateCategoryCode: !this.hasConflictTemplate
        ? 'PERSONAL_COVENANT_NO_CONFLICT'
        : 'PERSONAL_COVENANT_HAS_CONFLICT',
      specificTemplatePlaceholderValue: [
        { field: 'tenderNumber', value: this.tender?.tenderNumber },
        { field: 'teamMemberName', value: user.fullName },
        {
          field: 'teamMemberDesignation',
          value: this.titleCasePipe.transform(user.jobTitle) || ' N/A',
        },
        {
          field: 'teamMemberProcuringName',
          value: user.procuringEntity.name,
        },
        {
          field: 'tenderDescription',
          value: this.tender?.descriptionOfTheProcurement,
        },
        { field: 'teamType', value: this.entityType || 'Evaluation' },
        { field: 'listOfTenderers', value: listOfTenderers },
      ],
    });
    this.loadingTemplate = false;
    this.showConfirm = false;
    this.htmlDocument = this.htmlContent;
  }

  templateClose() {
    this.htmlContent = undefined;
  }

  getSign() {
    this.htmlContent = undefined;
    this.showPassPhrase = true;
    this.passphrase = null;
    this.hide = true;
  }

  updateTendererDeclaration(tendererUuid: string) {
    this.oldAvailableConflict[tendererUuid] = this.availableConflict[tendererUuid];
    this.availableConflict[tendererUuid].reason = null;
    this.availableConflict[tendererUuid].selection = null;
    this.selectedOption[tendererUuid] = null;
    this.declaredSomething[tendererUuid] = null;
  }

  async getSignedHtmlDocument() {
    this.loadingTemplate = true;
    this.loadingMessage = 'Prepare Personal Covenant Form';
    const userData = await firstValueFrom(
      this.store.pipe(
        select(selectAllAuthUsers),
        map((i) => i[0])
      )
    );
    if (this.htmlDocument) {
      this.loadingMessage = 'Signing Personal Covenant Form .....';
      this.attachmentUid = await this.htmlDocumentService.signHTMLDocument({
        description:
          'Personal Covenant Form' + this.tender?.descriptionOfTheProcurement,
        title: 'Personal Covenant Form' + this.tender?.tenderNumber,
        passphrase: this.passphrase,
        htmlDoc: this.htmlDocument,
        user: userData as any,
        signaturePlaceHolder: null,
      });
      if (this.attachmentUid) {
        this.loadingMessage = 'Saving Personal Covenant Document .....';
        await this.closeConflictDeclaration(
          this.attachmentUid,
          this.hasConflictTemplate
        );
      }
    } else {
      this.notificationService.errorSnackbar('Failed to sign document ');
    }
    this.loadingTemplate = false;
  }
  // END TEMPLATE CREATION

  async getConflictOfInterest() {
    try {
      const response: any = await this.apollo.fetchData({
        query:
          GET_CONFLICT_OF_INTEREST_BY_MEMBER_UUID,
        apolloNamespace:ApolloNamespace.submission,
        variables: {
          memberUuid: this.memberUuid,
        },
      });

      if (response.data.getMemberConflictOfInterests.code === 9000) {
        this.conflictOfInterests =
          response.data.getMemberConflictOfInterests.dataList;
        let declaredCount = 0;
        this.tenderWithConflict = 0;
        if (this.conflictOfInterests.length !== 0) {
          this.conflictOfInterests.forEach((conflict: any) => {
            this.declaredSomething[conflict.tendererUuid] = conflict.hasConflict;

            if (conflict.hasConflict !== null) {
              declaredCount += 1;

              if (conflict.hasConflict) {
                this.tenderWithConflict += 1;
              }
            }
            this.availableConflict[conflict.tendererUuid] = {
              selection: conflict.hasConflict,
              hasDeclared: conflict.hasConflict !== null,
              reason:
                conflict.conflictDeclarationReasons.length > 0
                  ? conflict.conflictDeclarationReasons[0]
                    .conflictDeclarationReason.uuid
                  : '',
            };
          });
        }

        if (this.tenderers.length === declaredCount) {
          /// field has conflict supposed to be changed to completedDeclaration
          this.hasConflict = true;
        }
      } else {
        console.error(response.data.getMemberConflictOfInterests.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async closeConflictDeclaration(attachmentUuid: string, hasConflict: boolean) {
    try {
      const dataToSave = {
        memberUuid: this.memberUuid,
        attachmentUuid: attachmentUuid,
        hasConflict: hasConflict,
      };

      const response: any = await this.apollo.mutate({
        mutation: CLOSE_CONFLICT_DECLARATION,
        apolloNamespace: ApolloNamespace.submission,
        variables: {
          conflictClosingDTO: dataToSave,
        },
      });

      if (response.data.closeConflictDeclaration.code == 9000) {
        this.notificationService.successMessage('Saved Successfully');
        this.triggerTemplate = true;
        this.closeForm.emit();
      } else {
        console.error(
          'closeConflictDeclaration',
          response.data.closeConflictDeclaration
        );
        this.notificationService.errorMessage(
          'Problem occurred while declaring conflicts of interests, please try again'
        );
        await this.htmlDocumentService.deleteHTMLDocuments([attachmentUuid]);
      }
    } catch (e) {
      console.error(e);
      this.notificationService.errorMessage(
        'Problem occurred while declaring conflicts of interests, please try again'
      );
      await this.htmlDocumentService.deleteHTMLDocuments([attachmentUuid]);
    }
  }

  close() {
    this.closeForm.emit();
  }

  transformConflictData(): ConflictOfInterestDto[] {
    return Object.keys(this.availableConflict)
      .filter(
        (tendererUuid) => this.availableConflict[tendererUuid].selection == true
      )
      .map((tendererUuid) => ({
        conflictDeclarationReasonUuids: [
          this.availableConflict[tendererUuid].reason,
        ],
        evaluationCommitteeInfoUuid: this.storageService.getItem('userUuid'),
        entityUuid: this.entityUuid,
        tendererUuid: tendererUuid,
        hasConflict: true,
      }));
  }

  otherPersonnel(uuid: string) {
    this.otherPersonnelList[uuid] = !this.otherPersonnelList[uuid];
  }

  toggleMore(uuid: string) {
    this.moreInfo[uuid] = !this.moreInfo[uuid];
  }

  async getConflictsOfInterestReasonSettings() {
    try {
      const paginatedDataInput: PaginatedDataInput = {
        page: 1,
        pageSize: 20,
        fields: [],
        mustHaveFilters: [],
        query: fromConflictInterestGraphQl.GET_CONFLICT,
        apolloNamespace: ApolloNamespace.submission,
        additionalVariables: {},
      };

      const response = await this.paginatedDataService.getAllData(paginatedDataInput);

      // const response: any = await this.apollo.fetchData({
      //   query: GET_CONFLICT,
      //   variables: {
      //     input: {
      //       fields: [],
      //       mustHaveFilters: [],
      //       page: 1,
      //       pageSize: 1000,
      //     },
      //   },
      // });

      this.conflictReasonSettings = (
        response || []
      )
        .filter(
          (conflict: any) =>
            conflict.conflictDeclarationCategory.applyToEvaluationTeam == true
        )
        .map((conflict: any) => ({
          uuid: conflict.uuid,
          reason: conflict.reason,
        }));
    } catch (e) {
      console.error(e);
    }
  }

  chunkItems(items: any[], chunckLength: number) {
    let chunks = [],
      chunkIndex = 0,
      numberOfItems = items.length;
    while (chunkIndex < numberOfItems) {
      chunks.push(items.slice(chunkIndex, (chunkIndex += chunckLength)));
    }
    return chunks;
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.previousPage = event.previousPage;
    this.pageSize = event.pageSize;
    this.tenderPages = this.chunkItems(this.tenderers, this.pageSize);
  }

  async getAppliedTenderers() {
    this.loadingConflicts = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_APPLIED_TENDERERS,
        apolloNamespace:ApolloNamespace.uaa,
        variables: {
          entityUuid: this.entityUuid,
        },
      });
      const data = response.data.getTenderersAppliedForTender.dataList || [];
      data.forEach((tenderer: any) => {
        this.availableConflict[tenderer.uuid] = {
          selection: false,
          reason: '',
          hasDeclared: false,
        };
      });
      this.tenderers = data;
      this.tenderPages = this.chunkItems(this.tenderers, this.pageSize);
      // this.loadingConflicts = false;
    } catch (e) {
      // this.loadingConflicts = false;
      console.error(e);
    }
  }

  async getLogo() {
    this.fetchingLogo = true;
    try {
      this.logoData = await this.attachmentService.getPELogo(
        this.tender.logoUuid
      );
      this.fetchingLogo = false;
    } catch (e) {
      this.fetchingLogo = false;
    }
  }
}
