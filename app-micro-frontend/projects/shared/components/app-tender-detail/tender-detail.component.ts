import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GET_LOT_ITEMS } from 'src/app/modules/nest-app/store/tender-lot/tender-lot.graphql';
import { TenderLot } from 'src/app/modules/nest-app/store/tender-lot/tender-lot.model';
import { GET_TENDER_LOTS } from 'src/app/modules/nest-app/store/tender/tender.graphql';
import { sorColumns } from '../../../services/excel-upload.service';
import { GraphqlService } from '../../../services/graphql.service';
import {
  GET_TENDER_FOR_TENDER_DETAIL,
  GET_TENDER_ITEMS,
} from '../../../modules/nest-app/store/tender-creation/tender-creation.graphql';
import {
  FIND_PRE_QUALIFICATIONS_BY_UID,
} from "../../../modules/nest-pre-qualification/store/pre-qualification.graphql";
import { TemplateDocumentTypesEnum } from "../../../services/document/store/document-creator.model";
import { DocumentReaderService } from "../../../modules/document-reader/services/document-reader.service";
import {
  PreQualification,
  PreSelectionSourceDefinitionMapping
} from "../../../modules/nest-pre-qualification/store/pre-qualification.model";
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SortArrayPipe } from '../../pipes/sort-array.pipe';
import { SharableCommentsViewerComponent } from '../sharable-comments-viewer/sharable-comments-viewer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FullDataTableComponent } from '../full-data-table/full-data-table.component';
import { ViewDetailsItemComponent } from '../view-details-item/view-details-item.component';
import { LoaderComponent } from '../loader/loader.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import {ApolloNamespace} from "../../../apollo.config";
export interface TaskDetailModel {
  possibleActions: string;
  approvals: any[];
}

@Component({
  selector: 'app-tender-detail',
  templateUrl: './tender-detail.component.html',
  styleUrls: ['./tender-detail.component.scss'],
  standalone: true,
  imports: [
    LoaderComponent,
    ViewDetailsItemComponent,
    FullDataTableComponent,
    MatPaginatorModule,
    MatIconModule,
    SharableCommentsViewerComponent,
    CurrencyPipe,
    DatePipe,
    SortArrayPipe,
    TranslatePipe,
    MatDividerModule
],
})
export class TenderDetailComponent implements OnInit {
  @Input() tenderUuid?: any;
  @Input() forTask?: boolean = false;
  @Input() preQualificationUuid?: any;
  tenderDetails: any;
  preQualification: PreQualification;
  loading: boolean;
  tableConfigurations = {
    tableColumns: sorColumns,
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: true,
    useFullObject: true,
    showBorder: true,
    allowPagination: true,
    actionIcons: {
      edit: false,
      delete: false,
      more: false,
      print: false,
      customPrimary: false,
    },
    doneLoading: false,
    deleting: {},
    active: {},
    hideExport: true,
    customPrimaryMessage: 'Activate',
    empty_msg: 'No  Records found',
  };
  viewTender: any = {};
  tenderItems: any[] = [];
  tenderLots: TenderLot[] = [];
  tenderLotItems: any[] = [];
  display: any = {};
  loadLotItem: boolean = false;
  lotPageSize: number = 10;
  lotPageIndex: number = 1;
  totalNumberOfLots: number = 0;

  itemPageSize: number = 10;
  itemPageIndex: number = 1;
  totalNumberOfItems: number = 0;

  preQualificationApprovals: any[];
  @Output() onViewMore: EventEmitter<TaskDetailModel> = new EventEmitter();

  constructor(
    private apollo: GraphqlService,
    private documentReaderService: DocumentReaderService
  ) {}

  ngOnInit(): void {
    if (this.tenderUuid) {
      this.getTender(this.tenderUuid).then();
    }

    if (this.preQualificationUuid) {
      this.getPreQualification().then();
    }
  }

  async viewTenderDocument() {
    this.documentReaderService.getDocumentByTypeAndItemUuid(
      TemplateDocumentTypesEnum.PRE_QUALIFICATION_DOCUMENT,
      this.preQualificationUuid
    ).then();
  }

  async getPreQualification():Promise<void> {
    try {
      this.loading = true;
      const response: any = await this.apollo.fetchData({
        query: FIND_PRE_QUALIFICATIONS_BY_UID,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: this.preQualificationUuid,
        },
      });
      if (response.data.findPreQualificationByUuid.code === 9000) {
        const data = response.data.findPreQualificationByUuid.data;console.log(data);
        this.preQualification = {
          ...data,
          preSelectionSourceDefinition:
            PreSelectionSourceDefinitionMapping[data?.preSelectionSource]?.replace(/_/g, ' ')
        };
        if(!this.tenderUuid){
          this.getTender(data.tender.uuid).then();
        }
      } else {
        console.error(response.data.findPreQualificationByUuid);
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.error(e);
    }
  }


  onlotPageChange(event: any): void {
    this.lotPageIndex = event.pageIndex;
    this.lotPageSize = event.pageSize;
    this.getTenderLots(this.tenderUuid).then();
  }

  onItemPageChange(event: any): void {
    this.itemPageIndex = event.pageIndex;
    this.itemPageSize = event.pageSize;
    this.getTenderItems(this.tenderUuid).then();
  }

  showLotDetail(lot: any) {
    this.tenderLotItems = [];
    const isConfirm: boolean = this.display[lot.uuid];
    this.display = {};
    this.display[lot.uuid] = !isConfirm;
    if (this.display[lot.uuid] == false) {
    } else {
      this.getTenderLotItems(lot.uuid).then();
    }
  }

  async getTenderLotItems(lotUuid: string) {
    this.loadLotItem = true;

    const response: any = await this.apollo.fetchData({
      query: GET_LOT_ITEMS,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        tenderUuid: lotUuid,
        input: {
          fields: [],
          mustHaveFilters: [],
          page: this.lotPageIndex,
          pageSize: this.lotPageSize
        },
        withMetaData: false
      }
    });
    this.tenderLotItems = (response.data.getTenderLotItems.data || []).map(
      (dataItem: any) => {
        const items = dataItem.scheduleOfRequirementItems || [];
        delete dataItem['scheduleOfRequirementItems'];
        return {
          ...dataItem,
          scheduleOfRequirements: items.map(
            (item) => item.scheduleOfRequirementItems
          ),
        };
      }
    );
    this.loadLotItem = false;
  }

  openMoreTenderItem(item: any) {
    const memory = this.viewTender[item.uuid];
    this.viewTender[item.uuid] = {};
    this.viewTender[item.uuid] = !memory;
  }

  mapFunction = (item: any) => {
    return {
      ...item,
      frequency: item.frequency ?? 1,
      totalPrice:
        (item.quantity ?? 0) * (item.frequency ?? 1) * (item.unitPrice ?? 0),
      costCenter: item.costCenter + '-' + item.costCenterDescription,
      procurementCategory: item.procurementCategoryName,
      procurementMethodCategory: item.procurementMethodCategory,
      sourceOfFund: item.sourceOfFund.name,
      unitOfMeasure: item.unitOfMeasure.name,
      gfsCode: item.gfsCode.code,
      timeLine: item.timeline,
      gfsCodeDescription: item.gfsCode.description,
    };
  };

  capitalizeWords(str) {
    return str
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async getTender(tenderUuid: string) {
    this.loading = true;
    const response: any = await this.apollo.fetchData({
      query: GET_TENDER_FOR_TENDER_DETAIL,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        tenderUuid: tenderUuid,
      },
    });
    this.tenderDetails = response.data.getTenderByUuid.data ?? {};
    this.onViewMore.emit({
      possibleActions: this.tenderDetails['possibleActions'],
      approvals: this.tenderDetails['approvals'],
    });
    this.getTenderItems(tenderUuid).then();
    this.getTenderLots(tenderUuid).then();
    this.loading = false;
  }

  async getTenderLots(tenderUuid: string) {
    const response: any = await this.apollo.fetchData({
      query: GET_TENDER_LOTS,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        tenderUuid: tenderUuid,
        input: {
          fields: [],
          mustHaveFilters: [],
          page: this.lotPageSize,
          pageSize: this.lotPageSize,
        },
        withMetaData: false,
      },
    });
    this.totalNumberOfLots =
      response.data.getTenderLotsByTenderUuidWithoutDefaultLot.totalRecords;
    this.tenderLots =
      response.data.getTenderLotsByTenderUuidWithoutDefaultLot.data ?? [];
  }

  async getTenderItems(tenderUuid: string) {
    const response: any = await this.apollo.fetchData({
      query: GET_TENDER_ITEMS,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        tenderUuid: tenderUuid,
        input: {
          fields: [],
          mustHaveFilters: [],
          page: this.itemPageIndex,
          pageSize: this.itemPageSize,
        },
      },
    });
    this.totalNumberOfItems =
      response.data.getTenderItemsByTenderUuid.totalRecords;
    this.tenderItems = response.data.getTenderItemsByTenderUuid.data;
  }
}
