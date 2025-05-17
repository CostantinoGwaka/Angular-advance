import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { MergedRequisitionItemization } from 'src/app/modules/nest-tender-initiation/store/merged-requisition-itemization/merged-requisition-itemization.model';
import { TenderRequisitionService } from '../../../../../services/tender-requisition.service';
import { fadeIn } from 'src/app/shared/animations/basic-animation';
import { EditableSpecificationItem } from '../../../nested-specifications-builder/store/model';
import { ManageRequisitionAttachmentService } from '../../../../../services/manage-requisition-attachment.service';
import { AttachmentTypeEnum } from 'src/app/modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model';
import { lastValueFrom } from 'rxjs';
import { PaginatedDataService } from '../../../../../services/paginated-data.service';
import {
	GET_CONSULTANCY_SPECIFICATIONS_FOR_MERGE,
	GET_MERGED_NON_CONSULTANCY_REQUISITION_SPECIFICATIONS_BY_MERGED_ITEM_UUID_FOR_VIEW,
	GET_MERGED_SPECIFICATION_PAGINATED,
	GET_NON_CONSULTANCY_SPECIFICATIONS_FOR_MERGE,
} from 'src/app/modules/nest-tender-initiation/store/goods-requisition-specification/goods-requisition-specification.graphql';
import { Specification } from 'src/app/modules/nest-tender-initiation/store/settings/pe-specification/pe-specification-setting.model';
import { MergedProcurementRequisitionItem } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition-item/merged-procurement-requisition-item.model';
import { GraphqlService } from '../../../../../services/graphql.service';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GET_MERGED_NON_CONSULTANCY_REQUISITION_SPECIFICATIONS_BY_MERGED_ITEM_UUID } from 'src/app/modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { WithLoadingPipe } from '../../../with-loading.pipe';
import { EditableSpecsTableComponent } from '../../../nested-specifications-builder/editable-specs-table/editable-specs-table.component';
import { MatButtonModule } from '@angular/material/button';
import { SharableAttachmentFormComponent } from '../../../sharable-attachment-form/sharable-attachment-form.component';
import { LoaderComponent } from '../../../loader/loader.component';
import { AsyncPipe, DecimalPipe, JsonPipe, NgClass } from '@angular/common';

@Component({
	selector: 'app-merged-itemization',
	templateUrl: './merged-itemization.component.html',
	styleUrls: ['./merged-itemization.component.scss'],
	animations: [fadeIn],
	standalone: true,
	imports: [
		LoaderComponent,
		SharableAttachmentFormComponent,
		MatButtonModule,
		EditableSpecsTableComponent,
		AsyncPipe,
		DecimalPipe,
		WithLoadingPipe,
	],
})
export class MergedItemizationComponent implements OnInit {
	@Input() procurementCategoryAcronym = 'G';
	@Input() lotItems: MergedProcurementRequisitionItem[] = [];
	@Input() showEstimatedBudget: boolean = true;
	requisitionItemTotalObj: { [id: string]: number } = {};
	lotItemItemization: { [key: string]: MergedRequisitionItemization[] } = {};
	loadingItemization: { [id: string]: boolean } = {};
	showSpecifications: { [id: string]: boolean } = {};
	showInspectionTests: { [id: string]: boolean } = {};
	showNeedAfterSale: { [id: string]: boolean } = {};
	showAttachmentDetails: { [id: string]: boolean } = {};
	mergedItemizationsTotalObj: { [id: string]: number } = {};
	specifications: { [key: string]: EditableSpecificationItem[] } = {};
	loadingSpecifications: { [key: string]: boolean } = {};
	attachmentSharable = {};
	currentSpecPage = {};
	totalSpecsPages = 1;
	totalSpecRecords = 0;
	constructor(
		private tenderRequisitionService: TenderRequisitionService,
		private manageRequisitionAttachmentService: ManageRequisitionAttachmentService,
		private paginatedDataService: PaginatedDataService,
		private graphqlService: GraphqlService,
	) { }

	ngOnInit(): void {
		for (let lotItem of this.lotItems) {
			this.requisitionItemTotalObj[lotItem.uuid] = 0;
		}
	}

	ngOnChanges(changes: SimpleChanges): void { }

	async getLotItemItemization(uuid: string) {
		this.loadingItemization[uuid] = true;
		if (this.showEstimatedBudget) {
			this.lotItemItemization[uuid] =
				await this.tenderRequisitionService.getMergedRequisitionItemizationsDataByMergedItem(
					uuid,
				);
		} else {
			this.lotItemItemization[uuid] =
				await this.tenderRequisitionService.publicgetMergedRequisitionItemizationsDataByMergedItem(
					uuid,
				);
		}


		this.loadingItemization[uuid] = false;

		for (let item of this.lotItemItemization[uuid] || []) {
			this.mergedItemizationsTotalObj[item.uuid] = 0;
			for (let i of item.mergedItemizations || []) {
				this.showAttachmentDetails[i.requisitionItemization.uuid] = false;
				// this.requisitionItemTotalObj[uuid] += item.quantity * item.estimatedUnitCost;
				this.mergedItemizationsTotalObj[item.uuid] =
					this.mergedItemizationsTotalObj[item.uuid] +
					(i?.requisitionItemization?.quantity || 0) *
					(i?.requisitionItemization?.estimatedUnitCost || 0);
				this.getItemizationAttachment(i.requisitionItemization.uuid);
			}
		}
		this.requisitionItemTotalObj[uuid] = Object.values(
			this.mergedItemizationsTotalObj,
		).reduce((acc, curr) => acc + curr, 0);
	}

	getItemizationAttachment(itemizationUuid: string) {
		this.attachmentSharable[itemizationUuid] =
			this.manageRequisitionAttachmentService.getAttachmentsObservable(
				AttachmentTypeEnum.REQUISITION_ITEMIZATION,
				itemizationUuid,
			);
	}
	async getNCSpecificationsByItemization(
		itemization: MergedRequisitionItemization,
	) {
		if (!this.specifications[itemization.uuid]) {
			try {
				this.loadingSpecifications[itemization.uuid] = true;
				const response: any = await this.graphqlService.fetchData({
					apolloNamespace: ApolloNamespace.app,
					query:
						GET_MERGED_NON_CONSULTANCY_REQUISITION_SPECIFICATIONS_BY_MERGED_ITEM_UUID_FOR_VIEW,
					variables: {
						procurementRequisitionItem: { uuid: itemization.uuid },
					},
				});
				this.loadingSpecifications[itemization.uuid] = false;

				this.specifications[itemization.uuid] =
					response.data
						.getMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid
						?.data || [];
			} catch (error) {
				console.error(error);
				this.loadingSpecifications[itemization.uuid] = false;
			}
		}
	}
	async getCSpecificationsByItemization(
		itemization: MergedRequisitionItemization,
	) {
		if (!this.specifications[itemization.uuid]) {
			try {
				this.loadingSpecifications[itemization.uuid] = true;
				const response: any = await this.graphqlService.fetchData({
					apolloNamespace: ApolloNamespace.app,
					query: GET_CONSULTANCY_SPECIFICATIONS_FOR_MERGE,
					variables: {
						procurementRequisitionItem: { uuid: itemization.uuid },
					},
				});
				this.loadingSpecifications[itemization.uuid] = false;
				this.specifications[itemization.uuid] =
					response.data.getConsultancySpecifications?.data || [];
			} catch (error) {
				console.error(error);
				this.loadingSpecifications[itemization.uuid] = false;
			}
		}
	}
	async getMergedSpecificationPaginated(item: MergedRequisitionItemization) {
		this.loadingSpecifications[item.uuid] = true;
		if (!this.currentSpecPage[item.uuid]) {
			this.currentSpecPage[item.uuid] = 1;
		}
		const dataPage = await lastValueFrom(
			this.paginatedDataService.getDataFromSource({
				apolloNamespace: ApolloNamespace.app,
				page: this.currentSpecPage[item.uuid],
				fields: [
					{
						fieldName: 'id',
						isSortable: true,
						orderDirection: 'ASC',
					},
				],
				pageSize: 10,
				query: GET_MERGED_SPECIFICATION_PAGINATED,
				additionalVariables: { mergedRequisitionItemizationUuid: item.uuid },
			}),
		);
		this.totalSpecsPages = dataPage.totalPages;
		this.totalSpecRecords = dataPage.totalRecords;
		if (!dataPage.isLast) {
			this.currentSpecPage[item.uuid]++;
		}
		this.specifications[item.uuid] = [
			...(this.specifications[item.uuid] || []),
			...this.mapSpecifications(dataPage.rows || []),
		];
		this.loadingSpecifications[item.uuid] = false;
	}

	mapSpecifications(
		specifications: Specification[],
	): EditableSpecificationItem[] {
		const editableSpecs: EditableSpecificationItem[] = [];
		specifications?.map((spec: Specification) => {
			editableSpecs.push({
				id: spec?.id,
				uuid: spec?.uuid,
				value: spec?.value,
				description: spec?.name,
			});
		});
		return editableSpecs;
	}

	async itemSpecsSelected(item: MergedRequisitionItemization) {
		this.showSpecifications = {};
		this.showSpecifications[item.uuid] = true;
		if (this.procurementCategoryAcronym == 'G') {
			await this.getMergedSpecificationPaginated(item);
		} else {
			await this.getMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid(
				item,
			);
		}
	}
	async viewInspectionTests(item: MergedRequisitionItemization) {
		this.showInspectionTests = {};
		this.showInspectionTests[item.uuid] = true;
		if (this.procurementCategoryAcronym == 'G') {
			await this.getMergedSpecificationPaginated(item);
		}
	}
	async viewNeedAfterSales(item: MergedRequisitionItemization) {
		this.showNeedAfterSale = {};
		this.showNeedAfterSale[item.uuid] = true;
		if (this.procurementCategoryAcronym == 'G') {
			await this.getMergedSpecificationPaginated(item);
		}
	}

	async getMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid(
		item: any,
	) {
		this.specifications[item.uuid] = [];
		try {
			this.loadingSpecifications[item.uuid] = true;
			const response: any = await this.graphqlService.fetchData({
				query:
					GET_MERGED_NON_CONSULTANCY_REQUISITION_SPECIFICATIONS_BY_MERGED_ITEM_UUID,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					uuid: item.uuid,
				},
			});

			this.specifications[item.uuid] =
				response.data.getMergedNonConsultancyRequisitionSpecificationsByMergedItemUuid;

			this.loadingSpecifications[item.uuid] = false;
		} catch (error) {
			console.error(error);
			this.loadingSpecifications[item.uuid] = false;
		}
	}
}
