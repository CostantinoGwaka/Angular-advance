import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from '../../../../services/graphql.service';
import { NotificationService } from '../../../../services/notification.service';
import { ProcurementRequisitionAttachment } from '../../../../modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model';
import { AttachmentSharable } from '../../../../store/global-interfaces/organizationHiarachy';
import { MergedMainProcurementRequisition } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model';
import { GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_WITH_ITEMS, GET_MERGED_PROCUREMENT_REQUISITIONS_BY_MERGED_MAIN_UUID, GET_MERGED_PROCUREMENT_REQUISITIONS_BY_MERGED_MAIN_UUID_BOQ_VIEWER } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { Specification } from '../../../../modules/nest-tender-initiation/store/settings/pe-specification/pe-specification-setting.model';
import { EditableSpecificationItem } from '../../nested-specifications-builder/store/model';
import { SharableAttachmentFormComponent } from '../../sharable-attachment-form/sharable-attachment-form.component';
import { BoqsViewerComponent } from '../../boqs/boqs-viewer/boqs-viewer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoaderComponent } from '../../loader/loader.component';
import { GET_MERGED_PROCUREMENT_REQUISITION_BY_UUID_FOR_TENDERER_CONTRACT } from 'src/app/modules/nest-tenderer/contract-management/store/tender-contract.graphql';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { BoqAccessFeaturesService } from 'src/app/services/boq-access-features.service';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { select, Store } from '@ngrx/store';
import { selectAllUsers } from 'src/app/modules/nest-uaa/store/user-management/user/user.selectors';
import { first, firstValueFrom, map } from 'rxjs';
import { ApplicationState } from 'src/app/store';

@Component({
	selector: 'app-merged-works-requisition-viewer',
	templateUrl: './merged-works-requisition-viewer.component.html',
	styleUrls: ['./merged-works-requisition-viewer.component.scss'],
	standalone: true,
	imports: [
		LoaderComponent,
		MatExpansionModule,
		MatIconModule,
		BoqsViewerComponent,
		SharableAttachmentFormComponent,
	],
})
export class MergedWorksRequisitionViewerComponent
	implements OnInit, OnChanges {
	@Input() mergedMainProcurementRequisitionUuid: string;
	@Input() forPPRAAdmin: boolean = false;
	@Input() fromTender: boolean = false;
	toggleViewReqItem: { [uuid: string]: boolean } = {};
	loadSavingMerged: boolean;
	mergedProcurementRequisition: MergedMainProcurementRequisition;
	showConfirm: boolean;
	requisitionDateForBOQViewer: Date;
	attachmentList = {};
	showUnitRateColumn: boolean = false;
	showTotalColumn: boolean = false;
	users: User;
	userSystemAccessRoles: string;

	loading: boolean = false;
	mergedMainProcurementRequisition: MergedMainProcurementRequisition;
	panelActivenessStatus: { [id: string]: boolean } = {};
	attachmentSharable = {};
	specification = {};


	// boq condutions
	constructor(
		private apollo: GraphqlService,
		private notificationService: NotificationService,
		private store: Store<ApplicationState>,
		private boqAccessFeaturesService: BoqAccessFeaturesService,
		private storageService: StorageService,
	) { }

	ngOnInit(): void {
		if (this.mergedMainProcurementRequisitionUuid) {
			this.initializer().then();
		}
		this.initAccess();
	}

	initAccess(): void {
		const userSystemAccessRoles =
			this.storageService.getItem('userSystemAccessRoles') ??
			this.storageService.getItem('userSystemAccessRoles');
		this.userSystemAccessRoles = userSystemAccessRoles;
	}

	isAO() {
		return this.userSystemAccessRoles?.indexOf('ACCOUNTING_OFFICER') >= 0;
	}

	isHPMU() {
		return this.userSystemAccessRoles?.indexOf('HEAD_OF_PMU') >= 0;
	}

	isHOD() {
		return this.userSystemAccessRoles?.indexOf('HEAD_OF_DEPARTMENT') >= 0;
	}


	async checkTenderStatusData(mergedMainProcurementRequisitionUuid) {


		this.boqAccessFeaturesService.checkRolesFeatures();

		this.users = await firstValueFrom(this.store.pipe(select(selectAllUsers), map(items => items[0]), first(i => !!i)));

		let contained = await this.boqAccessFeaturesService.containedListAssigned(mergedMainProcurementRequisitionUuid, this.users.username);


		if (this.boqAccessFeaturesService.hasPermissionUnitRate || this.boqAccessFeaturesService.hasPermissionTotal) {
			if (this.isAO() == false && this.boqAccessFeaturesService.allowedStatuses.includes(mergedMainProcurementRequisitionUuid?.tenderState)) {
				this.showUnitRateColumn = false;
				this.showTotalColumn = false;
			} else if (this.isAO() || this.isHOD() || this.isHPMU()) {
				this.showUnitRateColumn = true;
				this.showTotalColumn = true;
			} else if (contained && this.boqAccessFeaturesService.allowedStatuses.includes(mergedMainProcurementRequisitionUuid?.tenderState)) {
				this.showUnitRateColumn = true;
				this.showTotalColumn = true;
			} else if (!this.boqAccessFeaturesService.allowedStatuses.includes(mergedMainProcurementRequisitionUuid?.tenderState)) {
				this.showUnitRateColumn = true;
				this.showTotalColumn = true;
			} else {
				this.showUnitRateColumn = false;
				this.showTotalColumn = false;
			}
		} else {
			this.showUnitRateColumn = true;
			this.showTotalColumn = true;
		}
	}

	async initializer() {
		if (this.mergedMainProcurementRequisitionUuid) {
			await this.getMergedMainProcurementRequisitionItems(
				this.mergedMainProcurementRequisitionUuid
			);
			(
				this.mergedMainProcurementRequisition.mergedProcurementRequisitions ||
				[]
			).forEach((mergedProcurementRequisition) => {
				(
					mergedProcurementRequisition.mergedProcurementRequisitionItems || []
				).forEach((req) => {
					(req.mergedRequisitionItemizations || []).forEach((item) => {
						this.attachmentSharable[item.uuid] = this.mapAttachments(
							item?.mergedProcurementRequisitionAttachmentList || []
						);
						this.specification[item.uuid] = this.mapSpecifications(
							item?.mergedSpecifications || []
						);
					});
				});
			});
		}
	}

	mapSpecifications(
		specifications: Specification[]
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

	async getMergedMainProcurementRequisitionItems(uuid: string) {
		this.loading = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_MERGED_MAIN_PROCUREMENT_REQUISITION_BY_UUID_WITH_ITEMS,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					uuid: uuid,
				},
			});
			if (
				response.data.getMergedMainProcurementRequisitionByUuid?.code === 9000
			) {
				const values: MergedMainProcurementRequisition =
					response.data.getMergedMainProcurementRequisitionByUuid?.data;
				if (values) {
					this.mergedMainProcurementRequisition = values;
					this.requisitionDateForBOQViewer = new Date(
						this.mergedMainProcurementRequisition.approvalStartDate
					);
					this.getAttachmentData(this.mergedMainProcurementRequisition);
					this.checkTenderStatusData(this.mergedMainProcurementRequisition).then();
				}
				this.loading = false;
			}
		} catch (e) {
			this.loading = false;
		}
	}

	getAttachmentData(
		mergedMainProcurementRequisition: MergedMainProcurementRequisition
	) {
		mergedMainProcurementRequisition?.mergedProcurementRequisitions.forEach(
			(mergedProcurementRequisition) => {
				mergedProcurementRequisition?.mergedProcurementRequisitionItems.forEach(
					(item) => {
						this.attachmentList[item?.uuid] = this.mapAttachments(
							item?.mergedProcurementRequisitionAttachments || []
						);
					}
				);
			}
		);
	}

	onOpenPanel(uuid: string) {
		this.panelActivenessStatus = {};
		this.panelActivenessStatus[uuid] = true;
	}

	onClosePanel(uuid: string) {
		this.panelActivenessStatus = {};
		this.panelActivenessStatus[uuid] = false;
	}
	ngOnChanges(changes: SimpleChanges): void {
		// if (changes['mergedProcurementRequisitionItems']) {
		//   this.mergedProcurementRequisitionItems = changes['mergedProcurementRequisitionItems'].currentValue;
		//   (this.mergedProcurementRequisitionItems || []).forEach(item => {
		//     this.attachmentList[item.uuid] = this.mapAttachments(item?.mergedProcurementRequisitionAttachments || [])
		//   });
		// }

		if (changes['mergedMainProcurementRequisitionUuid']) {
			this.initializer().then();
		}
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
