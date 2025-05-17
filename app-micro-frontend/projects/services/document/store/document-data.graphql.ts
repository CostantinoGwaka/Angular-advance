import { gql } from 'apollo-angular';

const mergedConsultancyRequisitionSpecificationsFields = `
id
uuid
description
name
mergedConsultancySubRequisitionSpecifications{
  id
  uuid
  subSpecificationDescription
  subSpecificationName
}
`;

const goodsFields = `
id
uuid
description
uuid
quantity
deliveryPeriod
deliverySite
goodsRequisitionSpecificationList {
    id
    uuid
    name
    unitOfMeasure
    value
    specificationConfiguration {
        groupName
    }
}
mergedInspectionTestResponseList {
    id
    inspectionTestResponse
    inspectionTests{
        id
        inspectionQuestion
        inspectionTestQuestion
        inputType
    }
}
`;

const requisitionData = `
id
uuid
lotNumber
lotDescription
departmentName
requisitionDate
mergedProcurementRequisitionItems {
    uuid
    departmentName
    quantity
    mergedRequisitionItemizations {
        ${goodsFields}
    }
    mergedWorksRequisitionItemizations {
        uuid
        description
    }
    gfsCode {
        description
    }
    mergedConsultancyRequisitionSpecifications {
       ${mergedConsultancyRequisitionSpecificationsFields}
    }
    mergedProcurementRequisitionAttachments {
        attachmentType
        attachmentTypeEnum
        attachmentUuid
        description
        title
    }
}
`;

export const GET_MERGED_PROCUREMENT_REQUISITION_WITH_ITEMS_BY_UUID_FOR_DOCUMENT = gql`
  query getMergedProcurementRequisitionByUuid($uuid: String) {
    getMergedProcurementRequisitionByUuid(uuid: $uuid) {
      code
      message
      status
      data {
        ${requisitionData}
        mergedMainProcurementRequisition {
          uuid
          id
        }
      }
    }
  }
`;

export const GET_MERGED_MAIN_PROCUREMENT_REQUISITION_FOR_CONTRACT_BY_UUID = gql`
	query getMergedMainProcurementRequisitionByUuid($uuid: String) {
		getMergedMainProcurementRequisitionByUuid(uuid: $uuid) {
			code
			message
			status
			data {
				id
				uuid
			}
		}
	}
`;
