import { NotificationService } from '../../../../services/notification.service';
import {
	FullBOQSummary,
	SummarySection,
	BoqSummaryCodes,
} from './../../../../modules/nest-tender-initiation/settings/boqs/boqs.service';
import { Subscription } from 'rxjs';
import {
	BOQItem,
	GroupedBOQ,
} from './../../../../modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import { NestedSpecificationsViewMode } from './../../nested-specifications-builder/group-item/group-item.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	BoqsService,
	BOQSummarySums,
} from 'src/app/modules/nest-tender-initiation/settings/boqs/boqs.service';

import { FlatNestedSpecificationItemView } from '../../nested-specifications-builder/store/model';
import {
	NestedSpecificationChange,
	NestedSpecificationsService,
} from '../../nested-specifications-builder/nested-specifications.service';
import { BOQCategory } from 'src/app/modules/nest-tender-initiation/store/settings/boqs/boq-categories/boq-categories.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { DecimalPipe, NgClass } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-boq-summary',
	templateUrl: './boq-summary.component.html',
	standalone: true,
	imports: [
		LoaderComponent,
		FormsModule,
		MatCheckboxModule,
		DecimalPipe,
		NgClass,
		MatIconModule,
	],
})
export class BoqSummaryComponent implements OnInit {
	@Input()
	flatNestedSpecificationItemsView: FlatNestedSpecificationItemView[] = [];

	@Input()
	groupedItems: GroupedBOQ[] = [];

	boqSummarySums: BOQSummarySums = null;
	fullBOQSummary: FullBOQSummary = null;

	@Input()
	viewMode: NestedSpecificationsViewMode = 'edit';

	@Input()
	provisionSumPhysicalContingencyPercent: number;

	@Input()
	vatRequired: boolean;

	@Input()
	provisionSumVariationOfPricesPercent: number;

	boqCategoryId: string;

	@Input()
	itemsHash: string = null;

	@Input()
	boqChanges$: any;

	@Output()
	onBoqSummarySumsChange = new EventEmitter<BOQSummarySums>();

	changeSubscription: Subscription;

	changeTimerId: any;

	fetchingBOQCategory: boolean = false;

	boqCategory: BOQCategory = null;

	constructor(
		private boqsService: BoqsService,
		private nestedSpecificationsService: NestedSpecificationsService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.changeSubscription = this.nestedSpecificationsService
			.getChange()
			.subscribe((change: NestedSpecificationChange) => {
				this.onItemChanges(change);
			});

		this.init();
	}

	async init() {
		await this.setUpBOQSummaryByCategory();
		await this.boqsService.setTMAFees();
	}

	ngOnChanges() {
		this.calculateItemsTotal('SUMMARY-ngOnChanges');

		setTimeout(() => {
			this.getSummary();
		}, 200);
	}

	onItemChanges(change: NestedSpecificationChange) {
		this.calculateItemsTotal('SUMMARY-onItemChanges');
		setTimeout(() => {
			this.getSummary();
		}, 200);
	}

	async getBOQCategory() {
		let firstBOQItem = this.flatNestedSpecificationItemsView.find(
			(item) => item.type === 'ItemDescription'
		);

		if (!firstBOQItem) return null;
		this.fetchingBOQCategory = true;

		let results = await this.boqsService.getBOQCategoryByBOQItemUuid(
			firstBOQItem.nestedSpecificationItem.sourceUuid
		);

		this.fetchingBOQCategory = false;

		return results;
	}

	async setUpBOQSummaryByCategory() {
		let boqItem: BOQItem = await this.getBOQCategory();
		this.boqCategory = boqItem?.boqCategory;
		this.boqsService.setBOQCategory(this.boqCategory);
	}

	async calculateItemsTotal(
		source: string = 'outside'
	): Promise<BOQSummarySums> {
		this.boqSummarySums = (await this.getSummary())?.boqSummarySums;
		if (this.onBoqSummarySumsChange) {
			clearTimeout(this.changeTimerId);
			this.changeTimerId = setTimeout(() => {
				this.onBoqSummarySumsChange.emit(this.boqSummarySums);
			}, 3000);
		}

		return this.boqSummarySums;
	}

	async getSummary() {
		this.fullBOQSummary = await this.boqsService.getFullBOQSummary(
			this.flatNestedSpecificationItemsView,
			this.provisionSumPhysicalContingencyPercent,
			this.provisionSumVariationOfPricesPercent,
			this.vatRequired
		);
		return this.fullBOQSummary;
	}

	getSummarySectionByCode(code: string, summarySections: SummarySection[]) {
		return summarySections.find((section) => section.code === code);
	}

	getSummarySectionById(id: string, summarySections: SummarySection[]) {
		return summarySections.find((section) => section.id === id);
	}

	summaryCodeExists(code: string): boolean {
		return (
			this.fullBOQSummary.summarySections.find(
				(section) => section.code === code
			) !== undefined
		);
	}

	summaryIdExists(id: string): boolean {
		return (
			this.fullBOQSummary.summarySections.find(
				(section) => section.id === id
			) !== undefined
		);
	}

	confirmVATRequirement(checked: boolean) {
		if (!checked) {
			this.notificationService.showConfirmMessage({
				message:
					'Are you sure you want to remove VAT from this BOQ?<br/><br/>Contractor will not be able to claim VAT for this BOQ and Bidders will not be able to include VAT in their BOQs.',
				title: 'Confirm',
				confirmationText: 'REMOVE',
				cancelButtonText: 'No',
				acceptButtonText: 'Yes, remove VAT',
				onConfirm: () => {
					this.vatRequired = false;
					this.calculateItemsTotal();
				},
				onCancel: () => {
					this.vatRequired = true;
					this.calculateItemsTotal();
				},
			});
		} else {
			this.calculateItemsTotal();
		}
	}

	openInfoDialog(summarySection: SummarySection) {
		alert('Coming soon!');
	}
}
