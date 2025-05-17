import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GET_PUBLIC_APP_TENDERS } from 'src/app/modules/nest-app/store/tender/tender.graphql';
import { GraphqlService } from '../../../../services/graphql.service';

import * as XLSX from 'xlsx';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { NormalTableExpandableRow2Component } from '../../../../shared/components/normal-table-expandable-row2/normal-table-expandable-row2.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { ViewTenderCalendarComponent } from "./view-tender-calendar/view-tender-calendar.component";
export interface TenderView {
  active: boolean
  awardApprovalDate: string
  awardNotificationDate: string
  budgetPurpose: String
  contractSigningDate: string
  contractStartDate: string
  contractType: String
  contractVettingDate: string
  coolOffEndDate: string
  coolOffStartDate: string
  invitationDate: string
  prequalificationNotificationDate: string
  prequalificationSubOpenDate: string
  procurementCategoryName: string
  procurementMethod: string
  selectionMethod: string
  sourceOfFund: string
  submissionOpeningDate: string
  tenderDescription: string
  tenderNumber: string
  cuis: boolean
  tenderUuid: string
}

@Component({
  selector: 'app-render-tender-gpn',
  templateUrl: './render-tender-gpn.component.html',
  styleUrls: ['./render-tender-gpn.component.scss'],
  standalone: true,
  imports: [LoaderComponent, MatFormFieldModule, MatInputModule, FormsModule, MatProgressSpinnerModule, MatButtonModule, NormalTableExpandableRow2Component, MatIconModule, MatPaginatorModule, ViewTenderCalendarComponent, JsonPipe]
})
export class RenderTenderGpnComponent implements OnInit {
  loading: boolean = false;
  @Input() appUuid: string;
  @Input() procuringEntityName: string;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  tenders: TenderView[] = [];
  fieldValue: string;
  page: number = 1; pageSize: number = 10;
  totalLength: number = 0;
  expandedRowItem: any;
  paginatedList: number[] = [5, 10, 25, 100];
  fields: any[] = [];
  downloadingExcel: boolean = false;

  tableConfigurations = {
    tableColumns: [
      { label: 'Tender #', name: 'tenderNumber' },
      { label: 'CUIS', name: 'isCuisStatus' },
      { label: 'Description', name: 'tenderDescription' },
      { label: 'Tender Category', name: 'procurementCategoryName' },
      { label: 'Tender Sub Category', name: 'tenderSubCategoryName' },
      { label: 'Procurement method', name: 'procurementMethod' },
      { label: 'Selection method', name: 'selectionMethod' },
      { label: 'Budget purpose', name: 'budgetPurpose' },
      { label: 'Source of fund', name: 'sourceOfFund' },
      { label: 'Contract type', name: 'contractType' }
    ],
    tableCaption: '',
    showNumbers: true,
    tableNotifications: '',
    showSearch: false,
    useFullObject: true,
    showBorder: false,
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
    hideExport: false,
    customPrimaryMessage: 'Tender Calendar',
    empty_msg: 'No  Records found',
  };

  constructor(private apollo: GraphqlService) { }

  ngOnInit(): void {
    this.getPublicTenderByApp(this.appUuid).then();
  }

  listenToChanges() {
    this.getPublicTenderByApp(this.appUuid, this.page, this.pageSize, this.fieldValue).then();
  }

  expandedRowClose() {
    this.onClose.emit(this.appUuid);
  }

  async downloadExcel(tableId: string, filename: string = "Data") {
    this.downloadingExcel = true;
    const response: any = await this.apollo.fetchData({
      query: GET_PUBLIC_APP_TENDERS,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        appUuid: this.appUuid,
        input: {
          page: this.page,
          pageSize: this.totalLength,
          fields: [
            ...this.fields
          ],
          mustHaveFilters: [

          ],
        },
        withMetadata: false
      }
    });
    const dataList: any[] = response.data.getPublicPublishedTenders.data || [];

    const mappedValues = dataList.map((tenderView: any) => {
      return {
        "Tender No.": tenderView.donorTenderNumber != "" && tenderView.donorTenderNumber != null ? tenderView.donorTenderNumber : tenderView.tenderNumber,
        "CUIS": tenderView.cuis ? 'Is CUIS' : 'Not CUIS',
        "Description": tenderView.tenderDescription,
        "Tender Category": tenderView.procurementCategoryName,
        "Procurement Method": tenderView.procurementMethod,
        "Selection Method": tenderView.selectionMethod,
        "Budget Purpose": tenderView.budgetPurpose,
        "Source Of Fund": tenderView.sourceOfFund,
        "Contract Type": tenderView.contractType,
        "Invitation Date": tenderView.cuis == true ? "N/A" : tenderView.invitationDate,
        "Submission / Opening Date": tenderView.cuis == true ? "N/A" : tenderView.submissionOpeningDate,
        "Approval Of Award Date": tenderView.cuis == true ? "N/A" : tenderView.awardApprovalDate,
        "Cool Off Period Start": tenderView.cuis == true ? "N/A" : tenderView.coolOffStartDate,
        "Cool Off Period End": tenderView.cuis == true ? "N/A" : tenderView.coolOffEndDate,
        "Award Notification Date": tenderView.cuis == true ? "N/A" : tenderView.awardNotificationDate,
        "Vetting Of Contract": tenderView.cuis == true ? "N/A" : tenderView.contractVettingDate,
        "Signing Of Contract": tenderView.cuis == true ? "N/A" : tenderView.contractSigningDate
      }
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(mappedValues);
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, `${filename + " - " + this.procuringEntityName}.xlsx`);
    this.downloadingExcel = false;
  }

  handlePageEvent(event: any) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getPublicTenderByApp(this.appUuid, this.page, this.pageSize, this.fieldValue).then();
  }

  async getPublicTenderByApp(app: string = null, page: number = 1, pageSize: number = 10, fieldValue: string = null) {
    //
    // let dateFilters = [
    //   {
    //     fieldName: "invitationDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "coolOffStartDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "coolOffEndDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "contractVettingDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "contractStartDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "contractSigningDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "awardNotificationDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "awardApprovalDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "submissionOpeningDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "prequalificationSubOpenDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   }, {
    //     fieldName: "prequalificationNotificationDate",
    //     operation: "LK",
    //     isSearchable: true,
    //     searchValue: fieldValue
    //   },
    // ]
    this.fields = fieldValue ? [
      {
        fieldName: "tenderNumber",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }, {
        fieldName: "tenderDescription",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }, {
        fieldName: "sourceOfFund",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }, {
        fieldName: "selectionMethod",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }, {
        fieldName: "procurementMethod",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }, {
        fieldName: "procurementCategoryName",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }, {
        fieldName: "contractType",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }, {
        fieldName: "budgetPurpose",
        operation: "LK",
        isSearchable: true,
        searchValue: fieldValue
      }
      // ...dateFilters
    ] : [];


    this.loading = true;
    const response: any = await this.apollo.fetchData({
      query: GET_PUBLIC_APP_TENDERS,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        appUuid: app,
        input: {
          page: page,
          pageSize: pageSize ?? 10,
          fields: [
            ...this.fields
          ],
          mustHaveFilters: [],
        },
        withMetada: false
      }
    });
    this.tenders = response.data.getPublicPublishedTenders.data;
    const dataEntry: any = response.data.getPublicPublishedTenders;
    this.totalLength = dataEntry.totalRecords;
    this.paginatedList = this.paginatedList.filter((list: number) => {
      return list < this.totalLength;
    });
    this.paginatedList.push(this.totalLength);
    this.loading = false;

  }

  expandedRow(event) {


    if (!event) {
      const oldData = this.expandedRowItem
      this.expandedRowItem = {};
      setTimeout(this.expandedRowItem = oldData, 300);
    }
    this.expandedRowItem = (event) ? event : {};
  }

  mapFunction(item) {
    return {
      ...item,
      isCuisStatus: item.cuis ? 'Is CUIS' : 'Not CUIS'
    }
  }

}
