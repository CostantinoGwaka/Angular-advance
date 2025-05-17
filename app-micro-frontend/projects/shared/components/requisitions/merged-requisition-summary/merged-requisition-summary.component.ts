import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Router } from '@angular/router';
import { MergedMainProcurementRequisition } from '../../../../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.model';
import { TemplateDocumentTypesEnum } from '../../../../services/document/store/document-creator.model';
import { DocumentReaderService } from 'src/app/modules/document-reader/services/document-reader.service';
import { GraphqlService } from '../../../../services/graphql.service';
import { GET_OBJECT_ACTUAL_DATE_AND_TIME_BY_UUID_AND_STAGE } from 'src/app/modules/nest-tender-initiation/tender-requisition/store/tender-requisition.graphql';
import { map, of } from 'rxjs';
import { ViewDetailsItemComponent } from '../../view-details-item/view-details-item.component';
import { AsyncPipe, DecimalPipe, JsonPipe } from '@angular/common';
import { SettingsService } from '../../../../services/settings.service';

@Component({
	selector: 'app-merged-requisition-summary',
	templateUrl: './merged-requisition-summary.component.html',
	styleUrls: ['./merged-requisition-summary.component.scss'],
	standalone: true,
	imports: [ViewDetailsItemComponent, AsyncPipe, DecimalPipe],
})
export class MergedRequisitionSummaryComponent implements OnChanges {
	@Input() mergedMainProcurementRequisition: MergedMainProcurementRequisition;
	@Input() contractorClasses = [];
	@Input() businessLinesTender = [];
	@Input() tendererTypes = [];
	businessLinesLabels?: string;
	contractorClassesLabels?: string;
	tendererTypeLabels?: string;

	invitationDate = of({ actualDate: null });
	constructor(
		private settingsService: SettingsService,
		private documentReaderService: DocumentReaderService,
		private graphqlService: GraphqlService,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		this.businessLinesLabels = this.settingsService
			.removeDuplicates(this.businessLinesTender, 'businessLineId')
			.map((i) => i.businessLineName)
			.filter((i) => i)
			.join(',');
		this.contractorClassesLabels = this.contractorClasses.join(',');

		this.tendererTypeLabels = (this.tendererTypes || [])
			.map((i) => i.name)
			.filter((i) => i)
			.join(',');
	}

	viewTenderDocument() {
		this.documentReaderService.getDocumentByTypeAndItemUuid(
			TemplateDocumentTypesEnum.TENDER_DOCUMENT,
			this.mergedMainProcurementRequisition.uuid,
		);
	}

	getInvitationDate() {
		this.invitationDate = this.graphqlService
			.fetchDataObservable({
				query: GET_OBJECT_ACTUAL_DATE_AND_TIME_BY_UUID_AND_STAGE,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					procurementStageCode: 'INVITATION',
					objectUuid: this.mergedMainProcurementRequisition.uuid,
				},
			})
			.pipe(
				map(
					(res: any) => res.data.getObjectActualDateAndTimeByUuidAndStage.data,
				),
			);
	}
}
