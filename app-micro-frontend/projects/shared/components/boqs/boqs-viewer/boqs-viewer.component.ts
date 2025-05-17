import {
	BoqsService,
	BOQSummarySums,
} from '../../../../modules/nest-tender-initiation/settings/boqs/boqs.service';
import {
	Component,
	input,
	Input,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

import { BoqSummaryComponent } from '../boq-summary/boq-summary.component';
import { MergedProcurementRequisitionItem } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition-item/merged-procurement-requisition-item.model';
import {
	BOQItem,
	MergedBOQItem,
} from '../../../../modules/nest-tender-initiation/store/settings/boqs/boq-items/boq-main-item.model';
import { ProcurementRequisitionAttachment } from '../../../../modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model';
import { AttachmentSharable } from '../../../../store/global-interfaces/organizationHiarachy';
import { NestedSpecificationsService } from '../../nested-specifications-builder/nested-specifications.service';
import {
	BOQFetchingConfiguration,
	BoqFetcherComponent,
} from '../boq-fetcher/boq-fetcher.component';
import {
	FlatNestedSpecificationItemView,
	NestedSpecificationItem,
} from '../../nested-specifications-builder/store/model';
import { FlatNestedSpecificationsComponent } from '../../nested-specifications-builder/flat-nested-specifications/flat-nested-specifications.component';

@Component({
	selector: 'app-boqs-viewer',
	templateUrl: './boqs-viewer.component.html',
	standalone: true,
	imports: [BoqFetcherComponent, FlatNestedSpecificationsComponent],
})
export class BoqsViewerComponent implements OnInit {
	@Input()
	endPointName: string = null;

	@Input()
	requisitionObjectFieldName: string = null;

	@Input()
	requisitionItemsFieldName: string = null;

	@Input()
	requisitionItemsItemizationsFieldName: string = null;

	@Input()
	itemUuid: string = null;

	@Input()
	requisitionUuid: string = null;

	requisitionDate = input.required<Date>();

	@Input()
	forPPRAAdmin: boolean = false;

	@Input()
	showUnitRateColumn: boolean = true;

	@Input()
	showTotalColumn: boolean = true;

	nestedSpecificationItems: NestedSpecificationItem[] = [];

	viewMode = 'readOnly';

	fetchingConfiguration: BOQFetchingConfiguration;

	showBOQFetcher: boolean = false;

	mergedProcurementRequisitionItem: MergedProcurementRequisitionItem;

	showMergedMode = false;

	isLoading = true;

	provisionSumPhysicalContingencyPercent: number = 2;

	vatRequired: boolean = true;

	provisionSumVariationOfPricesPercent: number = 2;

	boqSummarySums: BOQSummarySums = null;

	@ViewChild(BoqSummaryComponent, { static: false })
	boqSummaryComponent: BoqSummaryComponent;

	@ViewChild(FlatNestedSpecificationsComponent, { static: false })
	flatNestedSpecificationsComponent: FlatNestedSpecificationsComponent;

	@Input()
	items: BOQItem[] = [];

	show = false;

	flatNestedSpecificationItemsView: FlatNestedSpecificationItemView[] = [];

	constructor(
		private boqsService: BoqsService,
		private nestedSpecificationsService: NestedSpecificationsService
	) { }

	ngOnInit(): void {
		this.verifyInputs();
	}

	verifyInputs() {
		if (this.endPointName == null) throw new Error('endPointName is required');
		// if (this.requisitionObjectFieldName == null)
		//   throw new Error('requisitionObjectFieldName is required');
		if (this.requisitionItemsFieldName == null)
			throw new Error('requisitionItemsFieldName is required');
		if (this.requisitionItemsItemizationsFieldName == null)
			throw new Error('requisitionItemsItemizationsFieldName is required');
		if (this.itemUuid == null) throw new Error('itemUuid is required');
		if (this.requisitionUuid == null)
			throw new Error('requisitionUuid is required');
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['itemUuid'] || changes['boqItemSource']) {
			if (this.itemUuid != null) {
				this.setItems(this.itemUuid, this.requisitionUuid);
			}
		}
	}

	setItems(requisitionItemUuid: string, requisitionUuid?: string) {
		this.fetchingConfiguration = {
			fetchBy: 'query',
			endPointName: this.endPointName,
			requisitionObjectFieldName: this.requisitionObjectFieldName,
			requisitionItemsFieldName: this.requisitionItemsFieldName,
			requisitionItemsItemizationsFieldName:
				this.requisitionItemsItemizationsFieldName,
			fetchByParentValue: requisitionUuid,
			fetchByValue: requisitionItemUuid,
			isFilled: true,
		};
		this.showBOQFetcher = false;
		setTimeout(() => {
			this.showBOQFetcher = true;
		}, 100);
	}

	calculateItemsTotal() {
		this.nestedSpecificationsService.calculateFlatNestedSpecificationItemViewTotals(
			this.flatNestedSpecificationItemsView
		);
		setTimeout(() => {
			this.boqSummaryComponent?.calculateItemsTotal();
		}, 400);
	}

	onBOQFinishedLoading = (
		flatNestedSpecificationItemView: FlatNestedSpecificationItemView[],
		summary?: BOQSummarySums
	) => {
		this.showBOQFetcher = false;
		this.flatNestedSpecificationItemsView = flatNestedSpecificationItemView;

		this.provisionSumVariationOfPricesPercent =
			summary?.provisionSumVariationOfPricesPercent;
		this.provisionSumPhysicalContingencyPercent =
			summary?.provisionSumPhysicalContingencyPercent;
		this.vatRequired = summary?.vatRequired;

		setTimeout(() => {
			this.flatNestedSpecificationsComponent?.calculateTotal();
		}, 200);
	};

	showBOQs() {
		this.show = false;
		setTimeout(() => {
			this.show = true;
		}, 200);
	}

	getLinkedBoqItems(mergedLinkedBOQItems: MergedBOQItem[]): BOQItem[] {
		return mergedLinkedBOQItems.map((linkedBoq) => {
			return {
				id: linkedBoq.id,
				uuid: linkedBoq.uuid,
				sourceUuid: linkedBoq.sourceUuid,
				code: linkedBoq.code,
				boqCategory: linkedBoq.mergedBOQCategory,
				boqSubItems: linkedBoq.mergedBoqSubItems,
				name: linkedBoq.name,
				description: linkedBoq.description,
				boqItemUuid: linkedBoq.boqItemUuid,
				boqCategoryUuid: linkedBoq.boqCategoryUuid,
				boqItem: linkedBoq.mergedBoqItem,
				total: linkedBoq.total,
				linkedBOQItems: this.getLinkedBoqItems(linkedBoq.mergedLinkedBOQItems),
			};
		});
	}

	mapAttachments(
		requisitionAttachments: ProcurementRequisitionAttachment[]
	): AttachmentSharable[] {
		const attachmentSharable: AttachmentSharable[] = [];
		requisitionAttachments?.map(
			(attachment: ProcurementRequisitionAttachment) => {
				attachmentSharable.push({
					uuid: attachment?.uuid,
					attachmentUuid: attachment?.attachmentUuid,
					title: attachment?.title,
					attachmentType: attachment?.attachmentType,
					description: attachment?.description,
					attachmentBase64: null,
				});
			}
		);
		return attachmentSharable;
	}
}
