import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import { NotificationService } from './notification.service';
import { SettingsService } from './settings.service';
import {
	PaginatedDataInput,
	PaginatedDataService,
} from './paginated-data.service';
import {
	GET_REQUISITION_ITEMIZATION_BY_PROCUREMENT_REQUISITION_ITEM_UUID_AND_WITH_ASSOCIATE_SERVICE,
	GET_REQUISITION_ITEMIZATION_DATA_ITEM_UUID_FOR_VIEW,
	GET_REQUISITION_ITEMIZATION_REQ_ITEMIZATION_UUID_AND_INSPECTION_REQUIRED,
} from '../modules/nest-tender-initiation/store/requisition-itemization/requisition-itemization.graphql';
import {
	GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_LIGHT,
	GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_LIGHT_PUBLIC,
	GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_FOR_VIEW,
	GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_FOR_VIEW_PUBLIC,
	GET_MERGED_REQUISITION_ITEMIZATIONS_BY_MERGED_ITEM_UUID_FOR_VIEW,
	GET_MERGED_REQUISITION_ITEMIZATIONS_BY_MERGED_ITEM_UUID_FOR_VIEW_PUBLIC,
	GET_MERGED_REQUISITION_ITEMIZATION_DATA_FOR_VIEW,
} from '../modules/nest-tender-initiation/store/merged-procurement-requisition/merged-procurement-requisition.graphql';
import { ApolloNamespace } from '../apollo.config';
import { GET_GOODS_INSPECTION_TESTS_BY_ITEMIZATION } from '../modules/nest-tender-initiation/store/goods-inspection-test/goods-inspection-test.graphql';
import { GET_GOODS_REQUISITION_SPECS_BY_REQ_ITEM_FOR_MERGE } from '../modules/nest-tender-initiation/store/goods-requisition-specification/goods-requisition-specification.graphql';
import { map } from 'rxjs';
import { SignalsStoreService } from './signals-store.service';
import {
	GET_BUSINESS_LINE_UNSPSC_CODES_DATA,
	GET_PROCUREMENT_REQUISITION_BUSINESS_LINE_DATA,
	GET_PROCUREMENT_REQUISITION_ITEMS_BY_PROCUREMENT_REQUISITION_PAGINATED,
	GET_PROCUREMENT_REQUISITION_ITEMS_BY_PROCUREMENT_REQUISITION_PAGINATED_WITH_CONSULTANCY_FOR_MERGE,
	GET_PROCUREMENT_REQUISITION_ITEMS_BY_PROCUREMENT_REQUISITION_PAGINATED_WITH_NON_CONSULTANCY_FOR_MERGE,
	UPDATE_PROCUREMENT_REQUISITION_CLASSES,
} from '../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.graphql';
import { GET_CONTRACTOR_TYPE_CLASS_MAPPING_DATA } from '../modules/nest-tender-initiation/store/contractor-type-class-mapping/contractor-type-class-mapping.graphql';
import { ContractorTypeClassMapping } from '../modules/nest-tender-initiation/store/contractor-type-class-mapping/contractor-type-class-mapping.model';
import { GET_WORKFLOW_APPROVALS_PAGINATED_IN_APP } from '../modules/nest-settings/work-flow-setup/store/flow/tender.graphql';
import { WorkflowApproval } from '../store/work-flow/work-flow-interfaces';
import { GET_GPSA_ITEM_ITEMIZATION_PAGINATED_FOR_REQUISITION } from '../modules/nest-tenderer-management/store/unspsc-commodity-code/unspsc-commodity-code.graphql';
// import {WorkflowApproval} from "../team-management/store/team.model";

@Injectable({
	providedIn: 'root',
})
export class TenderRequisitionService extends SignalsStoreService<any> {
	constructor(
		private graphqlService: GraphqlService,
		private notificationService: NotificationService,
		private settingsService: SettingsService,
		private paginatedDataService: PaginatedDataService,
	) {
		super();
	}

	// Method to retrieve requisition itemization by procurement requisition item UUID
	async getReqItemizationByReqItem(procurementRequisitionItemUuid: string) {
		try {
			// Fetch data from paginated data service
			const data = await this.paginatedDataService.getAllDataNew({
				multiQuery: true,
				pageSize: 50,
				query: GET_REQUISITION_ITEMIZATION_DATA_ITEM_UUID_FOR_VIEW,
				apolloNamespace: ApolloNamespace.app,
				additionalVariables: {
					procurementRequisitionItemUuid,
				},
			});
			// Map data and calculate estimated total amount
			return (data || []).map((item) => {
				return {
					...item,
					estimatedTotalAmount:
						item.quantity && item.estimatedUnitCost
							? +item.quantity * +item.estimatedUnitCost
							: 0,
				};
			});
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'We are having trouble loading requisition items',
			);
			return [];
		}
	}

	// Method to get requisition itemization by procurement requisition item UUID and inspection tests
	async getRequisitionItemizationByProcurementRequisitionItemUuidAndInspectionTests(
		proReqItemUuid: string,
		required = true,
	) {
		try {
			// Fetch data from GraphQL service
			const response: any = await this.graphqlService.fetchData({
				apolloNamespace: ApolloNamespace.app,
				query:
					GET_REQUISITION_ITEMIZATION_REQ_ITEMIZATION_UUID_AND_INSPECTION_REQUIRED,
				variables: {
					proReqItemUuid,
					required,
				},
			});
			if (
				response.data
					?.getRequisitionItemizationByProcurementRequisitionItemUuidAndInspectionTests
					?.code === 9000
			) {
				return (
					response?.data
						?.getRequisitionItemizationByProcurementRequisitionItemUuidAndInspectionTests
						?.data || []
				);
			} else {
				throw new Error(
					response.data.getRequisitionItemizationByProcurementRequisitionItemUuidAndInspectionTests?.message,
				);
			}
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'We are having trouble loading requisition items',
			);
			return [];
		}
	}

	// Method to get requisition itemization by procurement requisition item UUID and associate service
	async getRequisitionItemizationByProcurementRequisitionItemUuidAndWithAssociateService(
		procurementRequisitionItemUuid: string,
	) {
		try {
			// Fetch data from GraphQL service
			const response: any = await this.graphqlService.fetchData({
				apolloNamespace: ApolloNamespace.app,
				query:
					GET_REQUISITION_ITEMIZATION_BY_PROCUREMENT_REQUISITION_ITEM_UUID_AND_WITH_ASSOCIATE_SERVICE,
				variables: {
					procurementRequisitionItemUuid,
				},
			});
			if (
				response.data
					?.getRequisitionItemizationByProcurementRequisitionItemUuidAndWithAssociateService
					?.code === 9000
			) {
				return (
					response?.data
						?.getRequisitionItemizationByProcurementRequisitionItemUuidAndWithAssociateService
						?.data || []
				);
			} else {
				throw new Error(
					response.data.getRequisitionItemizationByProcurementRequisitionItemUuidAndWithAssociateService?.message,
				);
			}
		} catch (e) {
			console.error(e);
			this.notificationService.errorMessage(
				'We are having trouble loading requisition items',
			);
			return [];
		}
	}

	// Method to get inspection test responses
	getInspectionTestResponses(item: any) {
		return this.graphqlService
			.fetchDataObservable({
				query: GET_GOODS_INSPECTION_TESTS_BY_ITEMIZATION,
				apolloNamespace: ApolloNamespace.app,
				variables: { requisitionItemizationUuid: item.uuid },
			})
			.pipe(
				map(
					(response: any) =>
						response.data.getInspectionTestResponsesByRequisitionItemization
							.dataList,
				),
			);
	}

	// Method to get goods requisition specifications
	getGoodsRequisitionSpecifications(item: any) {
		return this.graphqlService
			.fetchDataObservable({
				query: GET_GOODS_REQUISITION_SPECS_BY_REQ_ITEM_FOR_MERGE,
				apolloNamespace: ApolloNamespace.app,
				variables: { uuid: item.uuid },
			})
			.pipe(map((response: any) => response.data.getGoodsSpecifications.data));
	}

	async getMergedProcurementRequisitionDataByMainEntity(
		mainEntityUuid: string,
	) {
		return await this.paginatedDataService.getAllDataOld({
			query: GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_LIGHT,
			apolloNamespace: ApolloNamespace.app,
			additionalVariables: {
				mainEntityUuid,
			},
		});
	}

	async publicgetMergedProcurementRequisitionDataByMainEntity(
		mainEntityUuid: string,
	) {
		return await this.paginatedDataService.getAllDataOld({
			query:
				GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY_LIGHT_PUBLIC,
			apolloNamespace: ApolloNamespace.app,
			additionalVariables: {
				mainEntityUuid,
			},
		});
	}

	async getProcurementRequisitionItemsByProcurementRequisitionPaginated(
		procurementRequisitionUuid: string,
	) {
		return await this.paginatedDataService.getAllDataOld({
			query:
				GET_PROCUREMENT_REQUISITION_ITEMS_BY_PROCUREMENT_REQUISITION_PAGINATED,
			apolloNamespace: ApolloNamespace.app,
			additionalVariables: {
				procurementRequisitionUuid,
			},
		});
	}

	async getProcurementRequisitionBusinessLineData(
		procurementRequisitionUuid: string,
	) {
		return await this.paginatedDataService.getAllDataOld({
			query: GET_PROCUREMENT_REQUISITION_BUSINESS_LINE_DATA,
			apolloNamespace: ApolloNamespace.app,
			additionalVariables: {
				procurementRequisitionUuid,
			},
		});
	}

	async getBusinessLineUNSPSCCodesData(unspscCodes: string[]) {
		return await this.paginatedDataService.getAllDataOld({
			query: GET_BUSINESS_LINE_UNSPSC_CODES_DATA,
			apolloNamespace: ApolloNamespace.app,
			mustHaveFilters: [
				{
					fieldName: 'unspscCode.uuid',
					operation: 'IN',
					inValues: unspscCodes,
				},
			],
		});
	}

	getMergedProcurementRequisitionItemsByMergedUuid(uuid: string) {
		return this.graphqlService
			.fetchDataObservable({
				apolloNamespace: ApolloNamespace.app,
				query: GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_FOR_VIEW,
				variables: {
					uuid: uuid,
				},
			})
			.pipe(
				map(
					(response: any) =>
						response.data.getMergedProcurementRequisitionItemsByMergedUuid ||
						[],
				),
			);
	}

	publicgetMergedProcurementRequisitionItemsByMergedUuid(uuid: string) {
		return this.graphqlService
			.fetchDataObservable({
				apolloNamespace: ApolloNamespace.app,
				query:
					GET_MERGED_PROCUREMENT_REQUISITION_ITEMS_BY_MERGED_UUID_FOR_VIEW_PUBLIC,
				variables: {
					uuid: uuid,
				},
			})
			.pipe(
				map(
					(response: any) =>
						response.data.getMergedProcurementRequisitionItemsByMergedUuid ||
						[],
				),
			);
	}
	// async getMergedRequisitionItemizationsData(mergedProcurementRequisitionUuid: string) {
	//     return await this.paginatedDataService.getAllDataNew({
	//         multiQuery: true,
	//         query: GET_MERGED_REQUISITION_ITEMIZATION_DATA_FOR_VIEW,
	//         apolloNamespace: ApolloNamespace.app,
	//         additionalVariables: {
	//             mergedProcurementRequisitionUuid
	//         }
	//     });
	// }
	async getMergedRequisitionItemizationsDataByMergedItem(
		mergedItemUuid: string,
	) {
		return await this.paginatedDataService.getAllDataOld({
			query: GET_MERGED_REQUISITION_ITEMIZATIONS_BY_MERGED_ITEM_UUID_FOR_VIEW,
			apolloNamespace: ApolloNamespace.app,
			additionalVariables: {
				mergedItemUuid,
			},
		});
	}

	async publicgetMergedRequisitionItemizationsDataByMergedItem(
		mergedItemUuid: string,
	) {
		return await this.paginatedDataService.getAllDataOld({
			query:
				GET_MERGED_REQUISITION_ITEMIZATIONS_BY_MERGED_ITEM_UUID_FOR_VIEW_PUBLIC,
			apolloNamespace: ApolloNamespace.app,
			additionalVariables: {
				mergedItemUuid,
			},
		});
	}
	async getGpsaItemItemizationPaginated(scheduleOfRequirementItemUuid: string) {
		return await this.paginatedDataService.getAllDataOld({
			query: GET_GPSA_ITEM_ITEMIZATION_PAGINATED_FOR_REQUISITION,
			apolloNamespace: ApolloNamespace.app,
			mustHaveFilters: [
				{
					fieldName: 'scheduleOfRequirementItemUuid',
					operation: 'EQ',
					value1: scheduleOfRequirementItemUuid,
				},
			],
		});
	}

	findByExactBudget(
		mappings: ContractorTypeClassMapping[],
		budget: number,
	): ContractorTypeClassMapping[] {
		return mappings.filter(
			(mapping) =>
				mapping.minBudgetLimit <= budget && mapping.maxBudgetLimit >= budget,
		);
	}

	async getContractorTypeClasses(
		budget: number,
		selectedUuid: string,
	): Promise<string[]> {
		try {
			const response: any = await this.graphqlService.fetchData({
				apolloNamespace: ApolloNamespace.app,
				query: GET_CONTRACTOR_TYPE_CLASS_MAPPING_DATA,
				variables: {
					input: {
						page: 1,
						pageSize: 50,
						mustHaveFilters: [
							{
								fieldName: 'contractorType.uuid',
								operation: 'EQ',
								value1: selectedUuid,
							},
						],
					},
				},
			});

			if (response.data?.items?.rows) {
				let values = response.data?.items?.rows || [];
				const mappedValues: ContractorTypeClassMapping[] =
					this.findByExactBudget(values, budget);
				return mappedValues.map((value) => value.contractorClass);
			}
			return [];
		} catch (e) {
			return [];
		}
	}

	async updateContractorClasses(
		procurementRequisitionUuid: string,
		contractorClasses: string[] = [],
	): Promise<any> {
		if (contractorClasses.length > 0 && procurementRequisitionUuid) {
			try {
				//  Check input variable "procurementRequisitionDto" backend
				const response: any = await this.graphqlService.mutate({
					apolloNamespace: ApolloNamespace.app,
					mutation: UPDATE_PROCUREMENT_REQUISITION_CLASSES,
					variables: {
						contractorClasses: contractorClasses,
						procurementRequisitionUuid: procurementRequisitionUuid,
					},
				});

				// this.foundRequisition = null;
				if (
					response.data.addProcurementRequisitionConctractorClasses?.code ===
					9000
				) {
					return response.data.addProcurementRequisitionConctractorClasses
						?.contractorClasses;
				}
			} catch (e) {
				console.error(e);
			}
		}
		return null;
	}

	async getWorkflowApprovalsInApp(
		entityId: String,
		approvalModelName: String = 'Tender',
	): Promise<WorkflowApproval[]> {
		try {
			const paginatedDataInput: PaginatedDataInput = {
				page: 1,
				pageSize: 5,
				fields: [],
				mustHaveFilters: [],
				query: GET_WORKFLOW_APPROVALS_PAGINATED_IN_APP,
				apolloNamespace: ApolloNamespace.app,
				additionalVariables: {
					entityUid: entityId,
					approvalModelName: approvalModelName,
				},
			};
			return await this.paginatedDataService.getAllData(paginatedDataInput);
		} catch (e) {
			return null;
		}
	}

	async getProcurementRequisitionItemsByProcurementRequisition(
		procurementRequisitionUuid: any,
		isConsultancy: boolean = false,
	) {
		try {
			return await this.paginatedDataService.getAllDataOld({
				query: isConsultancy
					? GET_PROCUREMENT_REQUISITION_ITEMS_BY_PROCUREMENT_REQUISITION_PAGINATED_WITH_CONSULTANCY_FOR_MERGE
					: GET_PROCUREMENT_REQUISITION_ITEMS_BY_PROCUREMENT_REQUISITION_PAGINATED_WITH_NON_CONSULTANCY_FOR_MERGE,
				apolloNamespace: ApolloNamespace.app,
				additionalVariables: {
					procurementRequisitionUuid,
				},
			});
		} catch (e) {
			this.notificationService.errorMessage('Failed to get items ' + e.message);

			return [];
		}
	}
}
