import { environment } from '../../../../environments/environment';
import { ViewportScroller, NgClass } from '@angular/common';
import { TENDERER_MY_DETAILS, TENDERER_USER_DESCRIPTION } from '../../../modules/nest-uaa/store/user-management/user/user.graphql';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SettingsService } from '../../../services/settings.service';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from "rxjs";
import { PersonnelInformation } from '../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Actions, } from "@ngrx/effects";
import { PersonnelWorkExperience } from '../../../modules/nest-tenderer/store/settings/personnel-work-experience/personnel-work-experience.model';
import { UserTendererLanguage } from '../../../modules/nest-tenderer/store/settings/user-academic-qualification/user-academic-qualification.model';
import { LIST_ALL_BUSINESS_LINES_LIST } from '../../../modules/nest-tenderer-management/store/business-line/business-line.graphql';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Store } from "@ngrx/store";
import { GraphqlService } from "../../../services/graphql.service";
import {
  DELETE_TENDERER_BUSINESS_LINE,
  SAVE_TENDERER_BUSINESS_LINE_LIST
} from "../../../modules/nest-tenderer-management/store/tenderer/tenderer.graphql";
import { ApplicationState } from "../../../store";
import { BusinessLine } from "../../../modules/nest-tenderer-management/store/business-line/business-line.model";
import { NotificationService } from "../../../services/notification.service";
import { fadeIn } from "../../animations/basic-animation";
import { Tenderer } from "../../../modules/nest-tenderer-management/store/tenderer/tenderer.model";
import { firstValueFrom } from 'rxjs';
import { TenderCategory } from "../../../modules/nest-tenderer-management/store/tender-category/tender-category.model";
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SearchPipe } from '../../pipes/search.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoaderComponent } from '../loader/loader.component';
import { FullDataTableComponent } from '../full-data-table/full-data-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-business-line-selection',
  templateUrl: './business-line-selection.component.html',
  styleUrls: ['./business-line-selection.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [MatStepperModule, MatIconModule, MatButtonModule, FullDataTableComponent, LoaderComponent, MatExpansionModule, MatFormFieldModule, MatInputModule, NgClass, MatProgressSpinnerModule, SearchPipe, TranslatePipe]
})
export class BusinessLineSelectionComponent implements OnInit {

  businessLines: BusinessLine[] = [];
  @Input() tendererUuid: string;
  @Input() currentRegistrations: Tenderer;
  loadtenders: boolean = false;
  @Output() lineItemSaved = new EventEmitter();
  @Output() showBusinessLineHelp = new EventEmitter();
  @Input() tendererType: string;
  tenderCategory: TenderCategory[] = [];
  businessLinesMap: { [id: string]: BusinessLine[] } = {};
  searchIndexMap: { [id: string]: string } = {};
  selectedLinesMap: { [id: string]: BusinessLine[] } = {};
  selectedLinesMapActive: { [id: string]: boolean } = {};
  selectedLinesMapUids: string[] = [];
  fetchingBusinessLines: boolean = false;
  selectedLines: BusinessLine[] = [];
  imagesMap: { [id: string]: string } = {};
  updating = false;
  currentLineList: { [id: string]: string } = {};
  deletingList: { [id: string]: boolean } = {};
  savingBusinessLine = false;
  selectedBusinessLine: any;
  @ViewChild(MatStepper) stepper: MatStepper;

  //basic info
  enableActions: boolean = true;
  savePersonal: boolean = false;
  personnelInformation: PersonnelInformation;
  tendererLanguage: UserTendererLanguage[];
  personnelWorkExperiences: PersonnelWorkExperience[];
  fetchingItem = false;
  fetchingExp = false;
  subscription: Subscription = new Subscription();
  deleting: { [id: string]: boolean } = {};
  showDeleting: { [id: string]: boolean } = {};
  deleted: { [id: string]: boolean } = {};

  refreshWork?: boolean = false;
  refreshBusinessLineSelection?: boolean = false;
  fetchingAttachment: { [id: string]: boolean } = {};

  businessLineSelectionTableConfigurations = {
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: false,
    useFullObject: true,
    showBorder: true,
    allowPagination: false,
    tableColumns: [
      { name: 'category', label: 'TENDER_CATEGORY' },
      { name: 'businessLine', label: 'BUSINESS_LINES' },
    ],
    actionIcons: {
      edit: false,
      delete: true,
      more: false,
      print: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    empty_msg: 'No Records found',
  }

  disableUpdateSelection: boolean = false;

  constructor(
    private apollo: GraphqlService,
    private store: Store<ApplicationState>,
    private _bottomSheet: MatBottomSheet,
    private actions$: Actions,
    private http: HttpClient,
    private scroller: ViewportScroller,
    private router: Router,
    private notificationService: NotificationService,
    private fb: UntypedFormBuilder,
    private settingService: SettingsService,
  ) {
  }

  ngOnInit(): void {
    this.initializeData().then();
  }

  async initializeData() {
    await this.initiateBusinessLine();
  }

  disableActionForSpecialGroup(tendererType: string) {
    if (tendererType == 'SPECIAL_GROUP' || tendererType == 'GOVERNMENT_ENTERPRISE') {
      this.businessLineSelectionTableConfigurations.actionIcons.delete = false;
      this.disableUpdateSelection = true;
    } else {
      this.businessLineSelectionTableConfigurations.actionIcons.delete = true;
      this.disableUpdateSelection = false;
    }
  }

  async fetchTendererDetails() {
    try {
      const result: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: TENDERER_MY_DETAILS,
      });
      const itemData = result.data.myDetails;
      if (itemData.data.tenderer) {
        this.currentRegistrations = itemData.data?.tenderer;
        this.disableActionForSpecialGroup(this.currentRegistrations?.tendererType);
        this.tendererUuid = this.currentRegistrations?.uuid;
        if (this.currentRegistrations) {
          if (this.currentRegistrations.tendererBusinessLineList) {
            if (this.currentRegistrations.tendererBusinessLineList.length == 0) {
              this.updating = true;
            }
            for (const item of this.currentRegistrations.tendererBusinessLineList) {
              this.currentLineList[item.businessLine.uuid] = item.uuid;
              await this.selectItem(item.businessLine.tenderCategory, item.businessLine, item.uuid);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async initiateData() {
    this.loadtenders = true;
    try {
      const result1: any = await this.apollo.fetchData({
        query: TENDERER_USER_DESCRIPTION,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.tendererUuid,
        },
      });
      this.currentRegistrations = result1.data.findTendererByUuid?.data;
      this.loadtenders = false;
    } catch (e) {
      this.loadtenders = false;
      console.error(e);
      this.notificationService.errorMessage('Failed to update Tenderer information');
    }
  }


  async buttonSelected($event: any) {

    this.fetchingAttachment[$event.attachmentUuid] = true;
    const data = await firstValueFrom(this.http.post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment/list/`, [
      $event.attachmentUuid
    ]));
    await this.settingService.viewFile(data[0].base64Attachment, 'pdf');
    this.fetchingAttachment[$event.attachmentUuid] = false;
  }

  // listenToActions() {
  //   this.subscription.add(
  //     this.actions$.pipe(ofType(upsertPersonnelWorkExperience)).subscribe(res => {
  //       this.fetchWorkExperienceByPersonnelInfo().then();
  //     }),
  //   );
  //   this.subscription.add(
  //     this.actions$.pipe(ofType(upsertUserAcademicQualification)).subscribe(res => {
  //       this.fetchAcademicInfo().then();
  //     }),
  //   );
  // }

  async initiateBusinessLine() {
    this.fetchingBusinessLines = true;
    try {
      const result: any = await this.apollo.fetchData({
        query: LIST_ALL_BUSINESS_LINES_LIST,
        apolloNamespace: ApolloNamespace.uaa,
      });
      this.businessLines = result.data.listAllBusinessLines;
      // filter business line based on tenderer type
      if (this.tendererType) {
        this.businessLines = this.businessLines.filter((businessLine) => {
          return businessLine.tenderType?.includes(this.tendererType);
        });
      }
      if (this.businessLines.length > 0) {
        this.initiateItems();
        await this.fetchTendererDetails();
      }
      this.fetchingBusinessLines = false;
    } catch (e) {
      console.error(e);
      this.fetchingBusinessLines = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  initiateItems() {
    for (const item of this.businessLines) {
      const found = this.tenderCategory.find(i => i.uuid === item.tenderCategory.uuid);
      if (!found) {
        this.tenderCategory.push(item.tenderCategory);
        if (item.tenderCategory.description.toLowerCase().indexOf('work') > -1) {
          this.imagesMap[item.tenderCategory.uuid] = 'works.png';
        } else if (item.tenderCategory.description.toLowerCase().indexOf('goods') > -1) {
          this.imagesMap[item.tenderCategory.uuid] = 'goods.png';
        } else if (item.tenderCategory.description.toLowerCase().indexOf('non') > -1
          && item.tenderCategory.description.toLowerCase().indexOf('consult') > -1) {
          this.imagesMap[item.tenderCategory.uuid] = 'non-consultancy.jpeg';
        } else {
          this.imagesMap[item.tenderCategory.uuid] = 'consultancy1.png';
        }
      }
      if (this.businessLinesMap[item.tenderCategory.uuid]) {
        this.businessLinesMap[item.tenderCategory.uuid].push(item);
      } else {
        this.businessLinesMap[item.tenderCategory.uuid] = [item];
      }
    }

  }

  async selectItem(activity: TenderCategory, businessLine: BusinessLine, uuid = null) {

    if (this.selectedLinesMap[activity.uuid]) {
      const found = this.selectedLinesMap[activity.uuid].find(i => i.uuid === businessLine.uuid);
      if (found) {
        if (found.tenderLineUuid) {
          await this.removeItem(businessLine, true);
        }
        this.selectedLinesMap[activity.uuid] = this.selectedLinesMap[activity.uuid].filter(i => i.uuid !== businessLine.uuid);
      } else {
        this.selectedLinesMap[activity.uuid].push({
          ...businessLine,
          tenderLineUuid: uuid,
        });
      }
    } else {
      this.selectedLinesMap[activity.uuid] = [{
        ...businessLine,
        tenderLineUuid: uuid,
      }];
    }

    if (this.selectedLinesMapUids.indexOf(businessLine.uuid) > -1) {
      this.selectedLinesMapUids = this.selectedLinesMapUids.filter(i => i !== businessLine.uuid);
    } else {
      this.selectedLinesMapUids.push(businessLine.uuid);
    }
    this.selectedLinesMapActive[businessLine.uuid] = this.selectedLinesMapUids.indexOf(businessLine.uuid) > -1;
    this.selectedLines = this.selectedLinesMapUids.map(i => this.businessLines.find(j => i === j.uuid));
  }

  async removeItem(data: BusinessLine, fromList: boolean = false) {
    if (this.currentLineList[data.uuid]) {
      this.deletingList[data.uuid] = true;
      try {
        const response1: any = await this.apollo.mutate({
          mutation: DELETE_TENDERER_BUSINESS_LINE,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            uuid: this.currentLineList[data.uuid],
          }
        });
        if (!fromList) {
          this.itemRemoved(data);
        }
        if (response1.data.deleteTendererBusinessLineByUuid?.code === 9000) {
          this.deletingList[data.uuid] = false;
          delete this.currentLineList[data.uuid];
          this.notificationService.successMessage('Business line removed successfully');
        } else {
          this.deletingList[data.uuid] = false;
          this.notificationService.errorMessage('Problem occurred while removing Business line');
        }
      } catch (e) {
        this.deletingList[data.uuid] = false;
        this.notificationService.errorMessage('Problem occurred while removing Business line');
      }
    } else {
      this.itemRemoved(data);
    }
    //
  }

  businessLineSelectionFunction(line: BusinessLine) {
    return {
      ...line,
      category: line?.tenderCategory?.description,
      businessLine: line?.description,
    };
  }

  searchBusinessLine(event, businessLineUuid) {
    /// Is used in filtering business lines to help user easy browsing
    this.searchIndexMap[businessLineUuid] = event.target.value;
  }

  itemRemoved(data: BusinessLine) {
    this.selectedLines = this.selectedLines.filter(i => i.uuid !== data.uuid);
    this.selectedLinesMapUids = this.selectedLinesMapUids.filter(i => i !== data.uuid);
    if (this.selectedLinesMap[data.tenderCategory.uuid]) {
      this.selectedLinesMap[data.tenderCategory.uuid] = this.selectedLinesMap[data.tenderCategory.uuid].filter(i => i.uuid !== data.uuid);
    }
    this.selectedLinesMapActive[data.uuid] = this.selectedLinesMapUids.indexOf(data.uuid) > -1;
  }

  async saveDetails() {
    if (this.updating) {
      this.savingBusinessLine = true;
      try {
        const response1: any = await this.apollo.mutate({
          mutation: SAVE_TENDERER_BUSINESS_LINE_LIST,
          apolloNamespace: ApolloNamespace.uaa,
          variables: {
            tendererBusinessLineDtoList: this.selectedLines.map(item => ({
              businessLineUuid: item.uuid,
              tendererUuid: this.tendererUuid,
              uuid: this.currentLineList[item.uuid] ?? null
            })),
          }
        });
        const result = response1.data?.createUpdateTendererBusinessLineByList;
        if (result.code === 9000) {
          this.selectedBusinessLine = result?.datalist;
          if (result?.datalist && result?.datalist?.length > 0) {
            result.datalist.forEach(item => {
              this.currentLineList[item.businessLine?.uuid] = item.uuid;
            });
            this.lineItemSaved.emit(this.currentLineList);
          } else {
            this.lineItemSaved.emit(null);
          }
          this.savingBusinessLine = false;
          this.notificationService.successMessage('Business line(s) selected successfully');
        } else {
          throw new Error('Failed to save information');
        }
      } catch (e) {
        console.error(e);
        this.savingBusinessLine = false;
        this.notificationService.errorMessage('Failed to  register business lines ' + e.message)
      }
    } else {
      this.lineItemSaved.emit(null);
    }
  }

  showHelp() {
    this.showBusinessLineHelp.emit(true);
  }
}
