import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, forkJoin, map, Subscription } from 'rxjs';
import { GET_PROCURING_ENTITY_BY_UUID } from 'src/app/modules/nest-app/store/tender/tender.graphql';
import { Tender } from 'src/app/modules/nest-app/store/tender/tender.model';
import { GET_CONFLICT_REASONS, GET_APPLIED_TENDERERS } from 'src/app/modules/nest-tender-evaluation/store/conflict-of-interest/conflict-of-interest.graphql';
import { AttachmentService } from '../../../services/attachment.service';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import { StorageService } from '../../../services/storage.service';
import { TeamService } from '../../../services/team.service';
import { fadeIn } from 'src/app/shared/animations/basic-animation';
import { FieldConfig, FieldType } from 'src/app/shared/components/dynamic-forms-components/field.interface';
import { HTMLDocumentService } from "../../../services/html-document.service";
import { SettingsService } from "../../../services/settings.service";
import { select, Store } from "@ngrx/store";
import { selectAllAuthUsers } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { ApplicationState } from "../../../store";
import { Country } from "../../../modules/nest-tenderer-management/store/country/country.model";
import { SAVE_NEGOTIATION_PLAN_ATTACHMENT_BY_UUID } from "../../../modules/nest-tenderer-negotiation/store/negotiation-plan/negotiation-plan.graphql";
import { TitleCasePipe, NgClass } from "@angular/common";
import { GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ConflictOfInterestDto {
  conflictDeclarationReasonUuids: string[],
  evaluationCommitteeInfoUuid: string,
  tenderUuid: string,
  tendererUuid: string
}
@Component({
    selector: 'app-declaration-of-interest-manager',
    templateUrl: './declaration-of-interest.component.html',
    styleUrls: ['./declaration-of-interest.component.scss'],
    animations: [fadeIn],
    providers: [TitleCasePipe],
    standalone: true,
    imports: [NgClass, MatFormFieldModule, MatInputModule, FormsModule, LoaderComponent, MatButtonModule, MatIconModule, MatCheckboxModule, MatPaginatorModule, DoNotSanitizePipe]
})
export class DeclarationOfInterestManagementComponent implements OnInit, OnDestroy {
  @Input() type: string;
  @Input() tenderUuid: string;
  @Input() teamUuid: string;
  @Output() closeForm: EventEmitter<any> = new EventEmitter();
  searchString: string;
  conflictField: FieldConfig =
    {
      type: FieldType.select,
      label: 'Select Conflict Of Interest',
      key: 'conflictUuid',
      query: GET_CONFLICT_REASONS,
      searchFields: ['description'],
      options: [{ uuid: 'Other', description: 'Other' }],
      optionName: 'description',
      optionValue: 'uuid',
      mapFunction: (item) => {
        return ({
          uuid: item.uuid,
          description: item.description
        });
      },
      useObservable: true,
      validations: [],
      rowClass: 'col12',

    }
  availableConflict: any = {};

  tenderers: { uuid: string, name: string, email: string, postalAddress: string, registrationCountry: Country }[] = [];
  currentPage: number = 0;
  previousPage: number = 0;
  pageSize: number = 25;

  tenderPages: {
    uuid: string, name: string, email: string, phone: string, postalAddress: string, executiveLeaderTitle: string, executiveLeaderName: string, personnelInformationList: {
      firstName: string,
      middleName: string,
      lastName: string,
      jobTitle: string
    }[]
  }[][] = [];
  loadingTenderer: boolean = false;
  conflictReasonSettings: { uuid: string, reason: string }[] = [];
  triggerReasonForm: any = {};
  savingConflict: any = {};
  tender: Tender;
  pe: { uuid; string, name: string };
  loadingTenderInfo: boolean = false;
  hasConflict: boolean | any = null;
  triggerTemplate: boolean = false;
  noConflictButtonLabel = 'I have no conflict of interest';
  loadingTemplate: boolean = false;
  hasConflictTemplate: boolean;
  loadingMessage?: string;
  htmlContent?: string;
  htmlDocument?: string;
  showPassPhrase = false;
  hide = true;
  passphrase?: string;
  attachmentUid: string = null;
  fetchingLogo: boolean = false;
  logoData: any;
  conflictOfInterests: any[] = [];
  conflictReasonTenderer = [];
  moreInfo: any = {};
  otherPersonnelList: any = {};
  saving: boolean = false;
  loadingConflicts: boolean = true;
  routeSub = Subscription.EMPTY;

  constructor(
    private teamService: TeamService,
    private apollo: GraphqlService,
    private activeRoute: ActivatedRoute,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private htmlDocumentService: HTMLDocumentService,
    private settingServices: SettingsService,
    private store: Store<ApplicationState>,
    private attachmentService: AttachmentService,
    private titleCasePipe: TitleCasePipe
  ) {
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  selected(id: string) {
    this.availableConflict[id] = !this.availableConflict[id];
  }

  changes() {
    this.tenderPages = this.chunkItems(this.tenderers.filter((tenderer: { uuid: string, name: string, email: string, phone: string, postalAddress: string, registrationCountry: Country }) => {
      return tenderer.name.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 ||
        tenderer.email.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1;
    }), this.pageSize);
  }

  changedConflictForm(tendererUuid: string) {
    this.triggerReasonForm[tendererUuid] = false;
  }

  onChange(event: any) {
    const index = Object.keys(this.availableConflict).findIndex((key) => this.availableConflict[key].selection == true);
    this.hasConflict = index > -1;
  }

  openDropDown(tendererUuid: string) {
    this.triggerReasonForm[tendererUuid] = true;
    setTimeout(() => {
      var reasonListElement: any = document.getElementById("reason_" + tendererUuid);
      var length = reasonListElement.options.length;
      var evt: any = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      reasonListElement.dispatchEvent(evt);
    }, 100);

  }

  ngOnInit(): void {
    this.routeSub = this.activeRoute.queryParams.subscribe(items => {
      if (items['id'] && items['teamUuid']) {
        this.tenderUuid = items['id'];
        this.teamUuid = items['teamUuid'];
        if (this.tenderUuid) {
          this.initTender().then(
            async _ => {
              await this.getConflictsOfInterestReasonSettings();
              if (this.teamUuid) {
                await this.getAppliedTenderers();
                await this.getConflictOfInterest();
              }
              this.loadingTenderInfo = false;
              this.loadingConflicts = false;
            }
          );
        }
      }
    });


  }

  async initTender() {
    this.loadingTenderInfo = true;
    const response: any = await this.apollo.fetchData({
      query: GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_MINI,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        uuid: this.tenderUuid
      }
    });
    this.tender = response?.data?.getMergedProcurementRequisitionByUuid?.data?.mergedMainProcurementRequisition?.tender;
    this.loadingConflicts = true;
    await this.getProcuringEntity(this.tender?.procurementEntityUuid);
    this.loadingTenderInfo = false;
  }



  async getProcuringEntity(uuid: string) {
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_PROCURING_ENTITY_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: uuid
        }
      });
      this.pe = response?.data?.findProcuringEntityByUuid?.data;
    } catch (e) {

    }
  }

  async saveConflictOfInterest(attachmentID) {
    const dataList: any = this.transformConflictData();
    try {
      const code = await this.teamService.saveConflictOnInterest(this.type, dataList, this.teamUuid, attachmentID);
      if (code == 9000) {
        this.notificationService.successMessage("Saved successfully");
      } else {
        this.notificationService.errorMessage("Saving failed");
        //Delete Attachment
        await this.htmlDocumentService.deleteHTMLDocuments([attachmentID]);
      }
    } catch (e) {
      this.notificationService.errorMessage(e);
    }

  }

  async getConflictOfInterest() {
    try {
      this.conflictOfInterests = await this.teamService.loadConflictOfInterest(this.type, this.tenderUuid);
      if (this.conflictOfInterests.length !== 0) {
        this.hasConflict = true;
        this.conflictOfInterests.forEach((conflict: any) => {
          this.availableConflict[conflict?.tendererUuid] = {
            selection: true,
            reason: conflict?.conflictDeclarationReasons?.length > 0 ? conflict.conflictDeclarationReasons[0].conflictDeclarationReason.uuid : ''
          };
        });
      }
    } catch (e) {

    }
  }


  // async declareConflict() {
  //   this.hasConflict = true;
  //   try{
  //     let code = await this.teamService.setHasConflictOfInterest(this.type,this.tenderUuid);
  //   } catch(e){
  //
  //   }
  // }

  async declareNoConflict(attachmentUuid) {
    this.hasConflict = false;
    try {
      let code = await this.teamService.setHasNoConflictOfInterest(this.type, this.tenderUuid, attachmentUuid);
      if (code == 9000) {
        this.notificationService.successMessage("Saved Successfully");
        // additional
        this.triggerTemplate = true;
        this.noConflictButtonLabel = "View Signed Personal Covenant Form";
      } else {
        this.notificationService.errorMessage("Saving failed");
        this.triggerTemplate = false;
        //Delete Attachment
        await this.htmlDocumentService.deleteHTMLDocuments([attachmentUuid]);
        this.attachmentUid = undefined;
      }
      this.closeForm.emit();
    } catch (e) {

    }
  }

  async finishConflictOfInterest(attachmentUuid) {
    this.hasConflict = true;
    this.saving = true;
    let code = await this.teamService.setHasConflictOfInterest(this.type, this.tenderUuid, attachmentUuid);

    if (code == 9000) {
      this.saveConflictOfInterest(attachmentUuid).then();
      await this.getConflictOfInterest().then();
      this.saving = false;
      this.triggerTemplate = true;
    } else {
      this.notificationService.errorMessage("Saving failed");
      this.saving = false;
      this.triggerTemplate = false;
      await this.htmlDocumentService.deleteHTMLDocuments([attachmentUuid]);
      this.attachmentUid = undefined;
    }


  }

  close() {
    this.closeForm.emit();
  }

  async getCreatedTemplate(hasConflictTemplateStatus) {
    this.loadingTemplate = true;
    this.loadingMessage = 'Just a moment, getting template...';
    const user = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), map(i => i[0])));

    //get List of tenderer with conflict of reason
    if (hasConflictTemplateStatus == true) {
      const listOfTenderersWithConflict: any = this.transformConflictData();
      this.conflictReasonTenderer = listOfTenderersWithConflict.map(data => {
        const uuids = data.conflictDeclarationReasonUuids.flat();
        const conflictReasonTypesPull = this.conflictReasonSettings.filter(reason => uuids.includes(reason.uuid));

        return {
          uuid: data.tendererUuid,
          reasons: conflictReasonTypesPull
        }
      });
    }
    const listOfTenderers = this.tenderers.map(setData => {
      const tendererReasons = this.conflictReasonTenderer.find(data => data.uuid == setData.uuid);
      return {
        uuid: setData.uuid,
        name: setData.name,
        reasons: tendererReasons?.reasons || [],
        physicalAddress: setData.postalAddress || 'N/A',
        country: setData.registrationCountry.name.toUpperCase() || 'N/A',
      }
    });

    // const listOfTenderers = this.tenderers.map(setData => ({
    //   uuid : setData.uuid,
    //   name : setData.name,
    //   physicalAddress : setData.postalAddress || 'N/A',
    //   country : setData.registrationCountry.name.toUpperCase() || 'N/A',
    // }));

    this.htmlContent = undefined;
    this.htmlContent = await this.htmlDocumentService.createSimpleHTMLDocument({
      procuringEntityUuid: user.procuringEntity.uuid,
      nonSTDTemplateCategoryCode: !this.hasConflictTemplate ? 'PERSONAL_COVENANT_NO_CONFLICT' : 'PERSONAL_COVENANT_HAS_CONFLICT',
      specificTemplatePlaceholderValue:
        [
          { field: "tenderNumber", value: this.tender?.tenderNumber },
          { field: "teamMemberName", value: user.fullName },
          { field: "teamMemberDesignation", value: this.titleCasePipe.transform(user.jobTitle) },
          { field: "teamMemberProcuringName", value: user.procuringEntity.name },
          { field: "tenderDescription", value: this.tender?.descriptionOfTheProcurement },
          { field: "teamType", value: this.type },
          { field: "listOfTenderers", value: listOfTenderers },
        ]
    });
    this.loadingTemplate = false;
    this.htmlDocument = this.htmlContent;
  }

  templateClose() {
    this.htmlContent = undefined;
  }

  getSign() {
    this.htmlContent = undefined;
    this.showPassPhrase = true;
    this.passphrase = null;
    this.hide = true
  }

  async getSignedHtmlDocument() {
    this.loadingTemplate = true;
    this.loadingMessage = 'Prepare Personal Covenant Form';
    const userData = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), map(i => i[0])));
    if (this.htmlDocument) {
      this.loadingMessage = 'Signing Personal Covenant Form .....';
      this.attachmentUid = await this.htmlDocumentService.signHTMLDocument({
        description: 'Personal Covenant Form' + this.tender?.descriptionOfTheProcurement,
        title: 'Personal Covenant Form' + this.tender?.tenderNumber,
        passphrase: this.passphrase,
        htmlDoc: this.htmlDocument,
        signaturePlaceHolder: null,
        user: userData
      });

      if (this.attachmentUid) {
        this.loadingMessage = 'Saving Personal Covenant Document .....';
        if (this.hasConflictTemplate == true) {
          await this.finishConflictOfInterest(this.attachmentUid)
        } else {
          await this.declareNoConflict(this.attachmentUid)
        }
      } else {
        this.notificationService.errorMessage("Failed to sign document," +
          " please check your key phrase and try again ");
      }
    } else {
      this.notificationService.errorMessage("Failed to sign document," +
        " please check your key phrase and try again ");
    }
    this.loadingTemplate = false;
  }


  async previewSignedDocument(attachment) {
    this.loadingMessage = 'Getting Personal Covenant Form for ' + this.tender.descriptionOfTheProcurement + ' Document';
    this.loadingTemplate = true;
    if (attachment) {
      const data = await this.attachmentService.getSignedAttachment(attachment)
      this.settingServices.viewFile(data, 'pdf').then(() => {
        this.loadingTemplate = false;
      });
    } else {
      this.loadingTemplate = false;

    }
  }



  transformConflictData(): ConflictOfInterestDto[] {
    return Object.keys(this.availableConflict)
      .filter((tendererUuid) => this.availableConflict[tendererUuid].selection == true)
      .map((tendererUuid) => ({
        conflictDeclarationReasonUuids: [this.availableConflict[tendererUuid].reason],
        evaluationCommitteeInfoUuid: this.storageService.getItem('userUuid').replace(/^"(.+(?="$))"$/, '$1'),
        tenderUuid: this.tenderUuid,
        tendererUuid: tendererUuid,
        hasConflict: true
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

      this.conflictReasonSettings = await this.teamService.loadConflictReasons('PostQualification');
    } catch (e) {

    }

  }

  chunkItems(items: any[], chunckLength: number) {
    var chunks = [], chunkIndex = 0, numberOfItems = items.length;
    while (chunkIndex < numberOfItems) {
      chunks.push(items.slice(chunkIndex, chunkIndex += chunckLength));
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
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          entityUuid: this.tenderUuid
        }
      });
      const data = (response.data.getTenderersAppliedForTender.dataList || []);
      data.forEach((tenderer: any) => {
        this.availableConflict[tenderer.uuid] = { selection: false, reason: '' };
      })
      this.tenderers = data;
      this.tenderPages = this.chunkItems(this.tenderers, this.pageSize);

      //
      // this.loadingConflicts = false;
    } catch (e) {
      // this.loadingConflicts = false;
      console.error(e);
    }

  }

  async getLogo() {

    this.fetchingLogo = true;
    try {
      this.logoData = await this.attachmentService.getPELogo(this.tender.logoUuid);
      this.fetchingLogo = false;
    } catch (e) {
      this.fetchingLogo = false;
    }
  }

}
