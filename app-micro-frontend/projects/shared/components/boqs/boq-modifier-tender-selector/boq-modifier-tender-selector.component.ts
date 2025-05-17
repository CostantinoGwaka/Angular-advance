import { requisition } from '../../../../services/svg/icons/requisition';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaginatedDataTableComponent } from '../../paginated-data-table/paginated-data-table.component';
import { SharedLayoutComponent } from '../../shared-layout/shared-layout.component';
import { ViewTendererSubmissionComponent } from '../../view-tenderer-submission/view-tenderer-submission.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GET_MERGED_MAIN_PROCUREMENT_REQUISITION_DATA } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { BidInterest } from 'src/app/modules/nest-tenderer/store/submission/submission.model';
import { GraphqlService } from '../../../../services/graphql.service';
import { LayoutService } from '../../../../services/layout.service';
import { NotificationService } from '../../../../services/notification.service';
import { TableConfiguration } from '../../paginated-data-table/paginated-table-configuration.model';
import { BOQModifierComponent } from '../boq-modifier/boq-modifier.component';
import { ApolloNamespace } from '../../../../apollo.config';

@Component({
	selector: 'app-boq-modifier-tender-selector',
	standalone: true,
	imports: [
		SharedLayoutComponent,
		PaginatedDataTableComponent,
		ViewTendererSubmissionComponent,
		MatFormFieldModule,
		FormsModule,
		MatInputModule,
		BOQModifierComponent,
	],
	templateUrl: './boq-modifier-tender-selector.component.html',
	styleUrl: './boq-modifier-tender-selector.component.scss',
})
export class BoqModifierTenderSelectorComponent implements OnInit, OnDestroy {
	tenderNumber: string;
	showResults = false;
	viewDetails: boolean = false;
	refreshDataTable: boolean = false;
	viewType: string = 'table';
	submissionUuid: string;
	query = GET_MERGED_MAIN_PROCUREMENT_REQUISITION_DATA;
	apolloNamespace = ApolloNamespace.app;

	tableFilter: any;
	tableConfigurations: TableConfiguration = {
		tableColumns: [
			{
				name: 'tender.tenderNumber',
				label: 'Tender Number',
				type: 'string',
				align: 'left',
			},
			{
				name: 'tender.descriptionOfTheProcurement',
				label: 'Tender Description',
				type: 'string',
				align: 'left',
			},
			{
				name: 'tender.tenderSubCategoryName',
				label: 'Tender Sub Category',
				align: 'left',
			},
			{ name: 'referenceNumber', label: 'Reference Number', align: 'left' },
		],
		tableCaption: '',
		allowPagination: true,
		allowDataEdition: false,
		showSearch: false,
		tableNotifications: null,
		showNumbers: true,
		actionIcons: {
			edit: false,
			delete: false,
			more: false,
			customPrimary: true,
		},
		hideExport: true,
		doneLoading: false,
		deleting: {},
		active: {},
		error: {},
		loading: {},
		showBorder: true,
		empty_msg: 'No Data',
		customPrimaryMessage: 'Modify BOQ',
		useFullObject: true,
	};

	constructor(
		private notificationService: NotificationService,
		private apollo: GraphqlService,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private layoutService: LayoutService
	) {}

	ngOnInit(): void {
		this.activeRoute.queryParams.subscribe(async (items) => {
			this.viewDetails = !!items['action'];
			this.viewType = items['action'] ?? 'table';
			this.submissionUuid = items['bid'] ?? '';
		});
	}

	search() {
		this.refreshDataTable = false;
		this.tenderNumber = this.tenderNumber.trim();
		if (this.tenderNumber.length > 0) {
			this.refreshDataTable = true;
			setTimeout(() => {
				this.showResults = true;
			}, 400);

			this.tableFilter = {
				input: {
					page: 1,
					pageSize: 10,
					mustHaveFilters: [
						{
							fieldName: 'tender.tenderNumber',
							operation: 'EQ',
							value1: this.tenderNumber,
						},
					],
				},
			};
		} else {
			this.showResults = false;
		}
	}

	ngOnDestroy(): void {}

	async modifyBOQ(requisition: any) {
		console.log('requisition', requisition);
		this.router
			.navigateByUrl(`/modules/tender-initiation/${requisition.uuid}`)
			.then();
	}

	closeDetails() {
		this.layoutService.closePanel();
	}
}
