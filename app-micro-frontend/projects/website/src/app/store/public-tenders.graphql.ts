import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { gql } from 'apollo-angular';

// export const publicTendersField = `
// uuid
// tenderState
// objectActualDateViewEntity{
//   invitationDate
//   submissionOrOpeningDate
//   approvalOfAwardDate
//   awardNotificationDate
//   coolOfPeriodEndDate
//   coolOfPeriodStartDate
// }
// mergedProcurementRequisitionItems{
//   mergedProcurementRequisitionAttachments{
//     description
//     attachmentUuid
//     title
//     attachmentType
//   }
// }
// tender{
//   uuid
//   UNSPSC
//   procurementStages
//   descriptionOfTheProcurement
//   procurementCategoryAcronym
//   procurementCategoryName
//   procurementMethod{
//     description
//   }
//   procuringEntityName
//   procurementEntityUuid
//   contractType{
//     name
//   }
//   tenderNumber
//   tenderSubCategoryName
//   tenderSubCategoryAcronym
//   tenderSubCategoryUuid
//   tenderCalenderDates{
//     actualDate
//     procurementStage{
//       procurementStageTypeEnum
//       columnName
//       name
//     }
//   }
// }
// `;

export const commonEntityFields = `
descriptionOfTheProcurement
entityId
entityNumber
entityStatus
entitySubCategoryAcronym
entitySubCategoryName
entityType
uuid:entityUuid
financialYearCode
id
invitationDate
procurementCategoryName
procurementCategoryAcronym:entityCategoryAcronym
procuringEntityLogoUuid
procuringEntityName
procuringEntityUuid
submissionOrOpeningDate
`;

export const GET_UNFILTERED_PUBLIC_ENTITIES = gql`
  query getPublishedEntitiesUnFiltered($input: DataRequestInputInput) {
    items:getPublishedEntitiesUnFiltered(input: $input withMetaData: false){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        descriptionOfTheProcurement:descriptionOfTheProcurement
        entityId
        entityNumber
        entityStatus
        entitySubCategoryAcronym:entitySubcategoryAcronym
        entitySubCategoryName:entitySubcategoryName
        entityType
        uuid:entityUuid
        financialYearCode
        id
        invitationDate
        procurementCategoryName
        procurementCategoryAcronym:entityCategoryAcronym
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        submissionOrOpeningDate
      }
    }
  }
`;

export const GET_PUBLISHED_ENTITIES_UN_FILTERED_BY_VISIBILITY = gql`
  query getPublishedEntitiesUnFilteredByVisibility($input: DataRequestInputInput) {
    items:getPublishedEntitiesUnFilteredByVisibility(input: $input withMetaData: false){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        descriptionOfTheProcurement:descriptionOfTheProcurement
        entityId
        entityNumber
        entityStatus
        entitySubCategoryAcronym:entitySubcategoryAcronym
        entitySubCategoryName:entitySubcategoryName
        entityType
        uuid:entityUuid
        financialYearCode
        id
        invitationDate
        procurementCategoryName
        procurementCategoryAcronym:entityCategoryAcronym
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        submissionOrOpeningDate
      }
    }
  }
`;


export const GET_AWARD_TENDER_VIEW_FILTERED_BY_VISIBILITY_STATUS_DATA = gql`
  query getAwardTenderViewFilteredByVisibilityStatusData($input: DataRequestInputInput) {
    items:getAwardTenderViewFilteredByVisibilityStatusData(input: $input withMetaData: false){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        entityDescription
        entityId
        entityNumber
        entityType
        uuid:entityUuid
        id
        letterDate
        tendererName
        procurementCategoryName
        createdAt
        procuringEntityName
        procuringEntityUuid
        contractAmount
        currency
        tzAmount
      }
    }
  }
`;

export const GET_PUBLIC_AWARDED_ENTITIES = gql`
  query getAwardTenderViewData($input: DataRequestInputInput) {
    items:getAwardTenderViewData(input: $input withMetaData: false){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        entityDescription
        entityId
        entityNumber
        entityType
        uuid:entityUuid
        id
        letterDate
        tendererName
        procurementCategoryName
        createdAt
        procuringEntityName
        procuringEntityUuid
        contractAmount
        currency
        tzAmount
      }
    }
  }
`;

export const GET_SUBMISSION_RESULT_ENTITY_DATA_ENTITIES = gql`
  query getSubmissionResultsByEntityUuidData( $input: DataRequestInputInput,$entityUuid: String,$withMetaData: Boolean ) {
    items:getSubmissionResultsByEntityUuidData( input: $input, entityUuid: $entityUuid, withMetaData: $withMetaData ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        createdAt
        evaluationComment
        hasBeenEvaluated
        isWinner
        submission{
          bidAmount
          currency
          email
          entityNumber
          entityStatus
          entitySubcategoryAcronym
          entitySubcategoryName
          entityUuid
          uuid
        }
        uuid
        winnerOrder
      }
    }
  }
`;

export const GET_PUBLIC_PUBLISHED_ENTITIES = gql`
  query getPublishedEntityViewData( $input: DataRequestInputInput $withMetaData: Boolean ) {
    items:getPublishedEntityViewData( input: $input withMetaData: $withMetaData ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        descriptionOfTheProcurement
        entityId
        entityNumber
        entityStatus
        entitySubCategoryAcronym
        entitySubCategoryName
        entityType
        uuid:entityUuid
        entityUuid
        financialYearCode
        id
        invitationDate
        lotCount
        hasAddendum
        eligibleTypes
        procurementCategoryName
        procurementCategoryAcronym:entityCategoryAcronym
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        submissionOrOpeningDate
      }
    }
  }
`;

// active: Boolean
// createdAt: LocalDateTime
// deletedAt: LocalDateTime
// descriptionOfTheProcurement: String
// entityCategoryAcronym: String
// entityId: Long
// entityNumber: String
// entityStatus: String
// entitySubcategoryAcronym: String
// entitySubcategoryName: String
// entityType: String
// entityUuid: String
// financialYearCode: String
// id: Long
// interested: BigInteger
// invitationDate: LocalDateTime
// lotCount: Int
// procurementCategoryName: String
// procurementMethod: String
// procurementMethodCategory: String
// procuringEntityLogoUuid: String
// procuringEntityName: String
// procuringEntityUuid: String
// selectionMethod: String
// sourceOfFund: String
// submissionOrOpeningDate: LocalDateTime
// submitted: BigInteger
// updatedAt: LocalDateTime

export const GET_PUBLIC_PUBLISHED_ENTITIES_TRAINNING = gql`
  query getPublishedOpenedTendersData( $input: DataRequestInputInput  ) {
    items:getPublishedOpenedTendersData( input: $input withMetaData: false ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        descriptionOfTheProcurement
        entityId
        entityNumber
        entityStatus
        entitySubCategoryAcronym:entitySubcategoryAcronym
        entitySubCategoryName:entitySubcategoryName
        entityType
        uuid:entityUuid
        entityUuid
        financialYearCode
        id
        invitationDate
        lotCount
        procurementCategoryName
        procurementCategoryAcronym:entityCategoryAcronym
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        submissionOrOpeningDate
      }
    }
  }
`;

export const GET_PUBLIC_PUBLISHED_ENTITIES_FOR_EXTEND = gql`
  query getAllTendersForOpeningViewPaginated( $input: DataRequestInputInput) {
    items:getAllTendersForOpeningViewPaginated( input: $input withMetaData: false ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        descriptionOfTheProcurement
        entityId
        entityNumber
        entityStatus
        entitySubcategoryAcronym
        entitySubcategoryName
        entityType
        uuid:entityUuid
        entityUuid
        financialYearCode
        id
        invitationDate
        lotCount
        submissionOrOpeningDate
      }
    }
  }
`;

// export const GET_PUBLIC_PUBLISHED_ENTITIES_FOR_EXTEND = gql`
//   query getPublishedEntitiesUnFiltered( $input: DataRequestInputInput) {
//     items:getPublishedEntitiesUnFiltered( input: $input withMetaData: false ){
//       ${NestUtils.GraphqlPaginationFields}
//       rows:data{
//         descriptionOfTheProcurement
//         entityId
//         entityNumber
//         entityStatus
//         entitySubcategoryAcronym
//         entitySubcategoryName
//         entityType
//         uuid:entityUuid
//         entityUuid
//         financialYearCode
//         id
//         invitationDate
//         lotCount
//         procurementCategoryName
//         entityCategoryAcronym
//         procuringEntityLogoUuid
//         procuringEntityName
//         procuringEntityUuid
//         submissionOrOpeningDate
//       }
//     }
//   }
// `;
export const GET_PUBLIC_PUBLISHED_FOR_NEST_ENTITIES = gql`
  query getPublishedEntityViewNestData( $input: DataRequestInputInput $withMetaData: Boolean ) {
    items:getPublishedEntityViewNestData( input: $input withMetaData: $withMetaData ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        createdAt
        deletedAt
        descriptionOfTheProcurement
        entityId
        entityNumber
        entityStatus
        entitySubCategoryAcronym: entitySubcategoryAcronym
        entitySubCategoryName: entitySubcategoryName
        entityType
        uuid:entityUuid
        hasAddendum
        eligibleTypes
        financialYearCode
        id
        lotCount
        invitationDate
        procurementCategoryName
        procurementCategoryAcronym:entityCategoryAcronym
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        submissionOrOpeningDate
        updatedAt
      }
    }
  }
`;

export const GET_MERGED_PROCUREMENT_REQUISITION_DATA_BY_MAIN_ENTITY = gql`
  query getMergedProcurementRequisitionDataByMainEntity(
     $input: DataRequestInputInput, $mainEntityUuid: String
     ) {
    items:getMergedProcurementRequisitionDataByMainEntity(
        mainEntityUuid: $mainEntityUuid,
        input: $input,
        withMetaData:true){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        uuid
        tenderState
        lotNumber
        lotDescription
        requisitionDate
      }
    }
  }
`;

export const GET_PUBLISHED_ENTITIES_FOR_OPENING = gql`
  query getPublishedEntitiesForOpening( $input: DataRequestInputInput ) {
    items:getPublishedEntitiesForOpening( input: $input withMetaData:true ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        active
        createdAt
        deletedAt
        descriptionOfTheProcurement
        entityCategoryAcronym
        entityId
        entityNumber
        entityStatus
        entitySubcategoryAcronym
        entitySubcategoryName
        entityType
        entityUuid
        financialYearCode
        id
        invitationDate
        lotCount
        interested
        submitted
        procurementCategoryName
        procurementMethod
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        selectionMethod
        sourceOfFund
        submissionOrOpeningDate
        updatedAt
      }
    }
  }
`;

export const GET_PUBLISHED_TENDER_FOR_OPENING = gql`
  query getMergedMainProcurementRequisitionData( $input: DataRequestInputInput ) {
    items:getMergedMainProcurementRequisitionData( input: $input withMetaData:true ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data {
        uuid
        active
        createdAt
        deletedAt
        descriptionOfProcurement
        procurementCategoryName
        sourceOfFundName
        tenderOpenningDateTime
        procurementCategoryAcronym
        serialNumber
        tenderNumber
      }
    }
  }
`;

export const ACCEPT_REPORT_EVALUATION_CUIS = gql`
	mutation updateReportStatus(
		$autoEvaluationReportCustomRequestDto: AutoEvaluationReportCustomRequestDtoInput
	) {
		updateReportStatus(
			autoEvaluationReportCustomRequestDto: $autoEvaluationReportCustomRequestDto
		) {
			code
			message
			status
		}
	}
`;

export const GET_FRAMEWORK_HISTORY = gql`
  query getAutoEvaluationReportByPEData($input: DataRequestInputInput) {
    items: getAutoEvaluationReportByPEData(
      input: $input
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        id
        uuid
        entityNumber
        entityType
        evaluationReportUuid
        createdAt
        entityUuid
        reportStatus
        descriptionOfTheProcurement
        entitySubCategoryAcronym
        entitySubCategoryName
        procurementMethod
        procurementCategoryName
      }
    }
  }
`;

export const GET_PUBLISHED_ENTITIES_FOR_AUTO_EVALUATION = gql`
  query getMergedRequisitionPendingAwardByTenderStateData($input: DataRequestInputInput) {
    items: getMergedRequisitionPendingAwardByTenderStateData(
      input: $input
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        id
        uuid
        tenderState
        lotNumber
        createdAt
        requisitionNumber
        lotDescription
        requisitionDate
        tenderSubCategoryAcronym
        objectActualDateViewEntity{
          submissionOrOpeningDate
        }
        mergedMainProcurementRequisition {
          uuid
          tender {
            uuid
            invitationDate
            tenderSubCategoryAcronym
            tenderSubCategoryUuid
            descriptionOfTheProcurement
            procurementCategoryName
            tenderSubCategoryName
            estimatedBudget
            tenderNumber
            donorTenderNumber
            financialYearCode
            procurementMethod {
              description
            }
            selectionMethod {
              name
            }
            sourceOfFund {
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_PUBLISHED_ENTITIES_FOR_CLARIFICATION = gql`
  query getPublishedEntitiesForOpening( $input: DataRequestInputInput ) {
    items:getPublishedEntitiesForOpening( input: $input withMetaData:true ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        active
        createdAt
        deletedAt
        descriptionOfTheProcurement
        entityCategoryAcronym
        entityId
        entityNumber
        entityStatus
        entitySubcategoryAcronym
        entitySubcategoryName
        entityType
        entityUuid
        financialYearCode
        id
        invitationDate
        lotCount
        procurementCategoryName
        procurementMethod
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        selectionMethod
        sourceOfFund
        submissionOrOpeningDate
        updatedAt
      }
    }
  }
`;

export const GET_PUBLISHED_DATA = gql`
  query getPublishedEntitiesData( $input: DataRequestInputInput ) {
    items:getPublishedEntitiesData( input: $input withMetaData:true ){
      ${NestUtils.GraphqlPaginationFields}
      rows:data{
        active
        createdAt
        deletedAt
        descriptionOfTheProcurement
        entityCategoryAcronym
        entityId
        entityNumber
        entityStatus
        entitySubcategoryAcronym
        entitySubcategoryName
        entityType
        entityUuid
        financialYearCode
        id
        invitationDate
        lotCount
        procurementCategoryName
        procurementMethod
        procuringEntityLogoUuid
        procuringEntityName
        procuringEntityUuid
        selectionMethod
        sourceOfFund
        submissionOrOpeningDate
        updatedAt
      }
    }
  }
`;

export const GET_PUBLIC_TENDERS_FOR_STATISTICS = gql`
  query getPublishedEntityViewData($input: DataRequestInputInput) {
    items: getPublishedEntityViewData(input: $input, withMetaData: false) {
      ${NestUtils.GraphqlPaginationFields}
      recordsFilteredCount
      rows: data {
        id
        entityStatus
      }
    }
  }
`;

export const GET_PUBLIC_TENDERS_DETAILS = gql`
query getPublicMergedMainProcurementRequisitions(
  $input: DataRequestInputInput
) {
  items: getPublicMergedMainProcurementRequisitions(
    input: $input
    withMetaData: false
  ) {
   ${NestUtils.GraphqlPaginationFields}
    rows: data {
      uuid
       objectActualDateViewEntity {
         invitationDate
         submissionOrOpeningDate
       }
      tender {
        uuid
        descriptionOfTheProcurement
        procurementCategoryName
        procuringEntityName
        procurementEntityUuid
        tenderNumber
        tenderSubCategoryName
        tenderSubCategoryAcronym
        procurementStages
        UNSPSC
        contractType{
          name
        }
        procurementMethod{
          description
        }
      }
    }
  }
}
`;

export const GET_PUBLIC_TENDERS = gql`
query getPublicMergedMainProcurementRequisitions(
  $input: DataRequestInputInput
) {
  items: getPublicMergedMainProcurementRequisitions(
    input: $input
    withMetaData: false
  ) {
   ${NestUtils.GraphqlPaginationFields}
    rows: data {
      uuid
      numberOfLots
       objectActualDateViewEntity {
         invitationDate
         submissionOrOpeningDate
       }
      tender {
        uuid
        descriptionOfTheProcurement
        procurementCategoryAcronym
        procurementCategoryName
        procuringEntityName
        procurementEntityUuid
        tenderNumber
        tenderSubCategoryName
        tenderSubCategoryAcronym
        procurementStages
        UNSPSC
        estimatedBudget
        contractType{
          name
        }
        procurementMethod{
          description
        }
      }
    }
  }
}
`;

export const GET_MERGED_TENDER_BY_UUID = gql`
	query getMergedMainProcurementRequisitionByUuid($uuid: String) {
		getMergedMainProcurementRequisitionByUuid(uuid: $uuid) {
			code
			data {
				uuid
				tenderState
				objectActualDateViewEntity {
					invitationDate
					submissionOrOpeningDate
					approvalOfAwardDate
					awardNotificationDate
					coolOfPeriodEndDate
					coolOfPeriodStartDate
				}
				mergedProcurementRequisitions {
					uuid
					lotDescription
					lotNumber
					objectActualDateViewEntity {
						invitationDate
						submissionOrOpeningDate
						approvalOfAwardDate
						awardNotificationDate
						coolOfPeriodEndDate
						coolOfPeriodStartDate
					}
          mergedProcurementRequisitionItems {
						id
						uuid
						departmentName
						quantity
						# estimatedUnitCost
						gfsCode {
							description
							code
						}
						mergedRequisitionItemizations {
							id
							description
							quantity
							# estimatedUnitCost
							unitOfMeasure
							unspscCode {
								commodityTitleCode
								commodityTitle
							}
						}
						mergedConsultancyRequisitionSpecifications {
							id
							uuid
							description
							name
							mergedConsultancySubRequisitionSpecifications {
								id
								uuid
								subSpecificationDescription
								subSpecificationName
							}
						}
					}
				}
				tender {
					uuid
					UNSPSC
					procurementStages
					descriptionOfTheProcurement
					procurementCategoryAcronym
					procurementCategoryName
					procurementMethod {
						description
					}
					procuringEntityName
					procurementEntityUuid
					contractType {
						name
					}
					tenderNumber
					donorTenderNumber
					tenderSubCategoryName
					tenderSubCategoryAcronym
					tenderSubCategoryUuid
					tenderCalenderDates {
						actualDate
						procurementStage {
							procurementStageTypeEnum
							columnName
							name
						}
					}
				}
			}
			message
			status
		}
	}
`;

export const GET_MERGED_TENDER_BY_UUID_DIRECT_FROM_MANUFACTURER = gql`
	query getMergedMainProcurementRequisitionByUuid($uuid: String) {
		getMergedMainProcurementRequisitionByUuid(uuid: $uuid) {
			code
			data {
				uuid
				hasLot
				numberOfLots
				tenderState
				objectActualDateViewEntity {
					invitationDate
					submissionOrOpeningDate
					approvalOfAwardDate
					awardNotificationDate
					coolOfPeriodEndDate
					coolOfPeriodStartDate
				}
				tender {
					uuid
					UNSPSC
					procurementStages
					descriptionOfTheProcurement
					procurementCategoryAcronym
					procurementCategoryName
					procurementMethod {
						description
					}
					procuringEntityName
					procurementEntityUuid
					contractType {
						name
					}
					tenderNumber
					donorTenderNumber
					tenderSubCategoryName
					tenderSubCategoryAcronym
					tenderSubCategoryUuid
					tenderCalenderDates {
						actualDate
						procurementStage {
							procurementStageTypeEnum
							columnName
							name
						}
					}
				}
			}
			message
			status
		}
	}
`;

export const GET_PUBLIC_TENDER_BY_MAIN_UUID = gql`
	query getDefaultMergedLot($entityUuid: String) {
		getDefaultMergedLot(entityUuid: $entityUuid) {
			code
			data {
				uuid
				lotNumber
				lotDescription
				financialYearCode
			}
			message
			status
		}
	}
`;

export const GET_PUBLIC_TENDERS_PROCURING_ENTITY_BY_UUID = gql`
	query findProcuringEntityByUuid($uuid: String) {
		findProcuringEntityByUuid(uuid: $uuid) {
			code
			data {
				uuid
				acronym
				name
				logoUuid
			}
			message
			status
		}
	}
`;

export const GET_PUBLIC_TENDERS_PROCURING_ENTITY_BY_UUID_MINI = gql`
	query getProcuringEntityDetailsByUuid($uuid: String) {
		getProcuringEntityDetailsByUuid(uuid: $uuid) {
			code
			data {
				uuid
				acronym
				name
				logoUuid
				physicalAddress
				phone
				postalAddress
				region {
					areaName
				}
				district {
					areaName
				}
				council {
					areaName
				}
				ward {
					areaName
				}
			}
			message
			status
		}
	}
`;

export const GET_TENDERERS_STATISTICS = gql`
	query getTendererStatisticsByCategory {
		getTendererStatisticsByCategory {
			code
			dataList {
				category
				tenderers
			}
			message
			status
		}
	}
`;
export const GET_ACTUAL_TENDERER_REGISTRATION_STATUS_BY_CATEGORY = gql`
	query getActualTendererRegistrationStatusByCategory {
		getActualTendererRegistrationStatusByCategory {
			approvedCount
			description
			id
			notApprovedCount
			submittedCount
			tendererType
		}
	}
`;

export const GET_TENDERER_REGISTRATION_STATUS = gql`
	query getTendererApplicationStatus {
		getTendererApplicationStatus {
			code
			data {
				approved
				notApproved
				submitted
				total
			}
			message
			status
		}
	}
`;

export const GET_BUSINESS_LINE_APPROVAL_STATUS_COUNT = gql`
	query getBusinessLineApprovalStatusCount {
		getBusinessLineApprovalStatusCount {
			approvalStatus
			count
			id
		}
	}
`;

export const GET_TOP_FIFTH_AWARDED_TENDERERS = gql`
	query getTopFifthAwardedTenderers {
		getTopFifthAwardedTenderers {
			code
			status
			data {
				tendererName
				count
			}
			dataList {
				tendererName
				count
			}
			message
		}
	}
`;

export const GET_TOP_FIFTH_PUBLISHED_PROCURING_ENTITY_STATISTICS = gql`
	query getTopFifthPublishedProcuringEntityStatistics(
		$procuringEntityCategories: [Long]
	) {
		getTopFifthPublishedProcuringEntityStatistics(
			procuringEntityCategories: $procuringEntityCategories
		) {
			code
			status
			data {
				procuringEntityName
				count
			}
			dataList {
				procuringEntityName
				count
			}
			message
		}
	}
`;

export const GET_TOP_FIFTH_AWARDED_PROCURING_ENTITY_STATISTICS = gql`
	query getTopFifthAwardedProcuringEntityStatistics(
		$procuringEntityCategories: [Long]
	) {
		getTopFifthAwardedProcuringEntityStatistics(
			procuringEntityCategories: $procuringEntityCategories
		) {
			code
			status
			data {
				procuringEntityName
				count
			}
			dataList {
				procuringEntityName
				count
			}
			message
		}
	}
`;

export const GET_RANKED_AWARDS_FOR_PROCURING_ENTITY = gql`
	query getRankedAwardsForProcuringEntity($procuringEntityCategoryIds: [Long]) {
		getRankedAwardsForProcuringEntity(
			procuringEntityCategoryIds: $procuringEntityCategoryIds
		) {
			code
			status
			data {
				procuringEntityName
				numberOfTenders
				awardedAmount
			}
			dataList {
				procuringEntityName
				numberOfTenders
				awardedAmount
			}
			message
		}
	}
`;

export const GET_TOP_FIFTH_TENDERER_SUBMISSIONS = gql`
	query getTopFifthTendererSubmissions {
		getTopFifthTendererSubmissions {
			code
			status
			data {
				tendererName
				count
			}
			dataList {
				tendererName
				count
			}
			message
		}
	}
`;

export const GET_ALL_GOOD_FINANCIAL_DATA = gql`
	query getAllGoodFinancialData($input: DataRequestInputInput) {
		items: getAllGoodFinancialData(input: $input, withMetaData: false) {
			totalPages
			totalRecords
			currentPage
			last
			first
			hasNext
			hasPrevious
			numberOfRecords
			recordsFilteredCount
			metaData {
				fieldName
				isSearchable
				isSortable
				isEnum
			}
			rows: data {
				uuid
				id
				tendererName
				tenderNumber
				itemizationDescription
				hasDiscount
				estimatedCost
				totalPricePerItem
				deliveryDate
				priceScheduleOriginType
				submissionCriteria {
					uuid
					submission {
						entityNumber
						uuid
					}
				}
			}
		}
	}
`;

export const GET_SINGLE_DATE_STATISTICAL_SUBMISSION_REPORT_PAGINATED = gql`
	query getSubmittedOpenedTablesCountPaginated($input: DataRequestInputInput $submissionDateUuid: String) {
		items: getSubmittedOpenedTablesCountPaginated(input: $input,submissionDateUuid: $submissionDateUuid, withMetaData: false) {
			 ${NestUtils.GraphqlPaginationFields}
      		rows: data {
              descriptionoftheprocurement
              district
              entityNumber
              id
              notSubmitted
              procurementCategory
              procurementMethod
              procuringEntityCategory
              procuringentityname
              submissionDate
              submissionDateUuid
              submitted
				}

			}
	}
`;

export const GET_TENDERER_REGISTRATION_LIST_BY_STATUS_ASSIGNED_USER = gql`
  query getTendererByBusinessLineApprovalStatusTestData(
    $input: DataRequestInputInput
    $withMetaData: Boolean
    $approvalStatus: BusinessLineApprovalStatusEnum
  ) {
    getTendererByBusinessLineApprovalStatusTestData(
      input: $input
      withMetaData: $withMetaData
      approvalStatus: $approvalStatus
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        id
        name
        phone
        physicalAddress
        registrationNumber
        tendererType
        uuid
        uniqueIdentificationNumber
      }
    }
  }
`;

export const GET_TENDERER_REGISTRATION_LIST_BY_JVC = gql`
  query getApprovedTenderersForJVCData(
    $input: DataRequestInputInput
    $withMetaData: Boolean
  ) {
    getApprovedTenderersForJVCData(input: $input, withMetaData: $withMetaData) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        approvedCount
        email
        id
        name
        notApprovedCount
        phone
        physicalAddress
        postalAddress
        registrationNumber
        submittedCount
        tendererId
        tendererType
        uniqueCode
        tendererUuid
        updatedAt
        uniqueIdentificationNumber
      }
    }
  }
`;
export const GET_ALL_SUBMISSIONS_STATISTICS_PAGINATED = gql`
  query getSubmittedTendersTobeOpened($input: DataRequestInputInput) {
    getSubmittedTendersTobeOpened(input: $input, withMetaData: true) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        id
        submissionDateUuid
        interestedButNotSubmitted
        notInterested
        openingDate
        submitted
        tenderToBeOpened
      }
    }
  }
`;

export const GET_TENDERER_BUSINESS_LINE_SUMMARIES_COMMENT_DATA = gql`
  query getTendererBusinessLineCommentData(
    $input: DataRequestInputInput
  ) {
    getTendererBusinessLineCommentData(
      input: $input
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        uuid
        action
        comment
        commentedBy
        createdAt
        active
        deleted
        tendererBusinessLine{
          approvalStatus
          approvedBy
          businessLine{
            name
          }
          updatedAt
          tenderer{
            name
          }
          tendererBusinessLineComments{
            comment
            active
            businessLineCommentType
            commentedBy
            commentedAt
            uuid
            action
          }
          tendererCertificateList{
            active
            name
            website
            phone
            email
            address
            postalAddress
            attachmentUuid
            certificateNumber
            isOtherCertificate
            description
            expiryDate
            registrationDate
            className
            classType
            uuid
            isVerified
          }
        }
      }
    }
  }
`;

export const GET_TENDERER_BUSINESS_LINE_SUMMARY_DATA = gql`
  query getTendererBusinessLineData(
    $input: DataRequestInputInput
    $withMetaData: Boolean
  ) {
    getTendererBusinessLineData(
      input: $input
      withMetaData: $withMetaData
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        uuid
        approvalStatus
        approvedBy
        businessLine{
          name
        }
        updatedAt
        tenderer{
          name
        }
        tendererBusinessLineComments{
          comment
          active
          businessLineCommentType
          commentedBy
          commentedAt
          uuid
          action
        }
        tendererCertificateList{
          active
          name
          website
          phone
          email
          address
          postalAddress
          attachmentUuid
          certificateNumber
          isOtherCertificate
          description
          expiryDate
          registrationDate
          className
          classType
          uuid
          isVerified
        }
      }
    }
  }
`;

export const GET_TENDERER_REGISTRATION_LIST_BY_STATUS = gql`
  query getTenderersByApprovalStatusData(
    $input: DataRequestInputInput
    $withMetaData: Boolean
  ) {
    getTenderersByApprovalStatusData(
      input: $input
      withMetaData: $withMetaData
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        approvedCount
        email
        id
        name
        notApprovedCount
        phone
        physicalAddress
        postalAddress
        registrationNumber
        submittedCount
        registrationCountryName
        hasRegisteredByBrela
        tendererId
        tendererType
        uniqueCode
        tendererUuid
        updatedAt
        uniqueIdentificationNumber
      }
    }
  }
`;

export const GET_ACTUAL_TENDERER_REGISTRATION_STATUS = gql`
	query getActualTendererRegistrationStatus {
		getActualTendererRegistrationStatus {
			approvedCount
			id
			notApprovedCount
			submittedCount
			tendererType
		}
	}
`;

export const GET_PUBLIC_PUBLISHED_APP = gql`
  query getPublicPublishedApp(
    $input: DataRequestInputInput
    $withMetaData: Boolean
  ) {
    getPublicPublishedApp(input: $input, withMetaData: $withMetaData) {
      ${NestUtils.GraphqlPaginationFields}
      data {
        active
        appUuid
        estimatedBudget
        financialYearCode
        generalProcurementNoticeAdvertDate
        id
        logoUuid
        procurementEntityUuid
        procuringEntityId
        procuringEntityName
        totalTenderCount
      }
    }
  }
`;

export const GET_COUNT_OF_TENDERS_TO_BE_OPENED = gql`
	query queryStats {
		results: getCountOfTenderToBeOpened
	}
`;

export const GET_COUNT_OF_AWARDED_CONTRACT = gql`
	query queryStats {
		results: getCountOfAwardedContract {
			awardContract
			awardContractValue
		}
	}
`;
export const GET_COUNT_OF_AWARDED_CONTRACT_BY_FINANCIAL_YEAR = gql`
	query getAwardContractsByFinancialYear($financialYear: String) {
		results: getAwardContractsByFinancialYear(financialYear: $financialYear) {
			data {
				awardContract
				awardContractValue
			}
		}
	}
`;

export const GET_ACTUAL_TENDERER_REGISTRATION_APPROVED_STATUS = gql`
	query getActualTendererRegistrationApprovedStatus {
		results: getActualTendererRegistrationApprovedStatus
	}
`;

export const GET_COUNT_OF_TENDER_CATEGORIES = gql`
	query queryStats {
		results: getTenderDashStat {
			count: idadi
			tenderCategoryAcronym
			tenderCategoryName
			tenderCategoryUUID: tenderCategoryUuid
		}
	}
`;

export const GET_COUNT_OF_TENDER_CATEGORIES_NEW = gql`
	query queryStats {
		results: getTenderDashStat2 {
			count
			tenderCategoryAcronym
			tenderCategoryName
		}
	}
`;

export const GET_PE_STATUS = gql`
  query getTenderStateDetailsAndCount(
    $input: DataRequestInputInput
    $withMetaData: Boolean
  ) {
    getTenderStateDetailsAndCount(input: $input, withMetaData: $withMetaData) {
      ${NestUtils.GraphqlPaginationFields}
      data {
        financialYearCode
        logoUuid
        procurementEntityId
        procurementEntityUuid
        procuringEntityName
        publishedApp
        tenderCount
        website
        appUuid
      }
    }
  }
`;

export const GET_ENTITY_DATES_FLAT_BY_ENTITY_UUIDS = gql`
	query getEntitiesDatesFlatByEntityUuids($objectUuids: String) {
		results: getEntitiesDatesFlatByEntityUuids(objectUuids: $objectUuids) {
			code
			data {
				id
				objectUuid
				tenderEntityId
				objectType
				invitationDate
				submissionOrOpeningDate
			}
			message
			status
		}
	}
`;


//lower level statistical information
export const GET_LOWER_LEVEL_REGISTERED_DATA = gql`
  query getLowerLevelRegisteredData(
    $input: DataRequestInputInput
  ) {
    getLowerLevelRegisteredData(
      input: $input
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        id
        numberOfPe
        procuringEntityCategoryName
      }
    }
  }
`;

export const GET_LOWER_LEVEL_REGISTERED_COUNT_DATA = gql`
  query getLowerLevelRegisteredCountData(
    $input: DataRequestInputInput,
    $peCategoryName: String
  ) {
    getLowerLevelRegisteredCountData(
      input: $input
      peCategoryName: $peCategoryName,
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        procuringEntityCategoryName
        procuringEntityName
      }
    }
  }
`;



export const GET_LOWER_LEVEL_AWARD_COUNT_DATA = gql`
  query getLowerLevelAwardCountData(
    $input: DataRequestInputInput,
    $peCategoryName: String
  ) {
    getLowerLevelAwardCountData(
      input: $input
      peCategoryName: $peCategoryName,
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        awardId
        entityDescription
        entityNumber
        expectedEquivalentAmount
        financialYearCode
        id
        letterDate
        procuringEntityCategoryName
        procuringEntityId
        procuringEntityName
        tendererName
      }
    }
  }
`;



export const GET_LOWER_LEVEL_PUBLISHED_GPN_COUNT_DATA = gql`
  query getLowerLevelPublishedGpnCountData(
    $input: DataRequestInputInput,
    $peCategoryName: String
  ) {
    getLowerLevelPublishedGpnCountData(
      input: $input
      peCategoryName: $peCategoryName,
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        approvalStatus
        estimatedBudget
        financialYearCode
        id
        procuringEntityCategoryName
        procuringEntityId
        procuringEntityName
        status
        tenderId
        tenderStatus
      }
    }
  }
`;


export const GET_LOWER_LEVEL_PUBLISHED_SPN_COUNT_DATA = gql`
  query getLowerLevelPublishedSpnCountData(
    $input: DataRequestInputInput,
    $peCategoryName: String
  ) {
    getLowerLevelPublishedSpnCountData(
      input: $input
      peCategoryName: $peCategoryName,
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        description
        financialYearCode
        id
        mergedMainId
        procuringEntityCategoryName
        procuringEntityId
        procuringEntityName
        tenderNumber
        tenderState
        totalCost
      }
    }
  }
`;

export const GET_LOWER_LEVEL_PUBLISHED_SPN_DATA = gql`
  query getLowerLevelPublishedSpnData(
    $input: DataRequestInputInput,
  ) {
    getLowerLevelPublishedSpnData(
      input: $input
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        numberOfPe
        procuringEntityCategoryName
        tenders
        value
      }
    }
  }
`;


export const GET_LOWER_LEVEL_PUBLISHED_GPN_DATA = gql`
  query getLowerLevelPublishedGpnData(
    $input: DataRequestInputInput,
  ) {
    getLowerLevelPublishedGpnData(
      input: $input
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        numberOfPe
        procuringEntityCategoryName
        numberOfTender
        values
      }
    }
  }
`;

export const GET_LOWER_LEVEL_AWARD_DATA = gql`
  query getLowerLevelAwardData(
    $input: DataRequestInputInput,
  ) {
    getLowerLevelAwardData(
      input: $input
      withMetaData: false
    ) {
      ${NestUtils.GraphqlPaginationFields}
      rows: data {
        active
        numberOfPe
        procuringEntityCategoryName
        tenders
        value
      }
    }
  }
`;





