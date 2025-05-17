import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { NotificationService } from "./notification.service";
import { GraphqlService } from "./graphql.service";
import {
  AttachmentTypeEnum,
  ProcurementRequisitionAttachmentDtoInput
} from "../modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.model";
import * as fromPRGql2
  from "../modules/nest-tender-initiation/store/procurement-requisition-attachment/procurement-requisition-attachment.graphql";
import { AttachmentSharable } from "../store/global-interfaces/organizationHiarachy";
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageRequisitionAttachmentService {

  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService
  ) {
  }

  async save(newAttachmentData: ProcurementRequisitionAttachmentDtoInput): Promise<AttachmentSharable> {
    let savedAttachment: AttachmentSharable = null;
    try {
      const response: any = await this.apollo.mutate({
        mutation: fromPRGql2.CREATE_UPDATE_PROCUREMENT_REQUISITION_ATTACHMENT,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          attachment: [newAttachmentData]
        }
      });
      if (response?.data?.createProcurementRequisitionAttachment?.code === 9000) {
        savedAttachment = response?.data?.createProcurementRequisitionAttachment?.data;
        this.notificationService.successMessage('Your attachment saved successfully');
      } else {
        throw new Error(response.data.createProcurementRequisitionAttachment?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage('Failed to save attachment ' + e.message)
    }
    return savedAttachment;
  }

  async getAttachments(attachmentTypeEnum: AttachmentTypeEnum, sourceUuid: string): Promise<AttachmentSharable[]> {
    let attachments: AttachmentSharable[] = [];
    try {
      const response: any = await this.apollo.fetchData({
        query: fromPRGql2.GET_PROCUREMENT_REQUISITION_ATTACHMENT_BY_SOURCE,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          attachmentTypeEnum: attachmentTypeEnum,
          sourceUuid: sourceUuid
        }
      });
      if (response?.data?.getProcurementRequisitionAttachments?.code === 9000) {
        attachments = response?.data?.getProcurementRequisitionAttachments?.dataList || [];
      } else {
        throw new Error(response.data.getProcurementRequisitionAttachments?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage(e.message);
    }
    return attachments;
  }
  getAttachmentsObservable(attachmentTypeEnum: AttachmentTypeEnum, sourceUuid: string): Observable<AttachmentSharable[]> {
    return this.apollo.fetchDataObservable({
      query: fromPRGql2.GET_PROCUREMENT_REQUISITION_ATTACHMENT_BY_SOURCE,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        attachmentTypeEnum: attachmentTypeEnum,
        sourceUuid: sourceUuid
      }
    }).pipe(map((response: any) => response?.data?.getProcurementRequisitionAttachments?.dataList || []));
  }

  async deleteReqAttachment(attachmentUuid: string): Promise<boolean> {
    try {
      const response: any = await this.apollo.mutate({
        mutation: fromPRGql2.DELETE_PROCUREMENT_REQUISITION_ATTACHMENT_BY_UUID,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          uuid: attachmentUuid
        }
      });
      if (response?.data?.deleteProcurementRequisitionAttachment?.code === 9000) {
        this.notificationService.successMessage('Attachment deleted successfully...');
        return true;
      } else {
        throw new Error(response.data.deleteProcurementRequisitionAttachment?.message);
      }
    } catch (e) {
      this.notificationService.errorMessage(e.message);
      return false;
    }
  }
}
