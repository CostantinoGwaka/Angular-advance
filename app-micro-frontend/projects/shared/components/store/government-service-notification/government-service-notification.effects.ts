import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromActions from "../government-service-notification/government-service-notification.actions";
import { map, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { GraphqlService } from "../../../../services/graphql.service";
import { Store } from "@ngrx/store";
import * as fromState from "../../../../modules/nest-app/store/nest-app.reducer";
import { NotificationService } from "../../../../services/notification.service";
import { DataRequestInput } from "../../paginated-data-table/data-page.model";
import { GovernmentServiceNotification } from "./government-service-notification.model";
import {SearchOperation} from "../../../../store/global-interfaces/organizationHiarachy";
import {
  GET_DELIVERY_NOTE_COUNT,
  GET_DELIVERY_NOTE_FOR_PE_COUNT
} from "../../../../modules/nest-government/store/delivery-note/delivery-note.graphql";
import {
  GET_DELIVERY_ADVISE_COUNT,
  GET_DELIVERY_ADVISE_FOR_PE_COUNT
} from "../../../../modules/nest-government/store/delivery-advise/delivery-advise.graphql";
import {GET_GSP_ORDERS_COUNT} from "../../../../modules/nest-government/store/government-service-requisition/government-service-requisition.graphql";
import {ApprovalStatusEnum} from "../../../../modules/nest-government/store/delivery-advise/delivery-advise.model";
import {ApolloNamespace} from "../../../../apollo.config";

@Injectable()
export class GovernmentServiceNotificationEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private apollo: GraphqlService,
    private store: Store<fromState.State>,
    private notificationService: NotificationService,
  ) {
  }

  getDeliveryNotePESideByApprovalStatus$ = createEffect((): any => this.actions$.pipe(
    ofType(fromActions.getDeliveryNotePESideByApprovalStatus),
    switchMap((action) => {
      let pageSize = 10000;
      let input: DataRequestInput = {
        page: 1,
        pageSize: pageSize,
        fields: [],
        mustHaveFilters: [
          {
            fieldName: "approvalStatus",
            operation: SearchOperation.EQ,
            value1: action.approvalStatus,
          }
        ]
      };
      return this.apollo.fetchDataObservable({
        query: GET_DELIVERY_NOTE_FOR_PE_COUNT,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          input: input,
        },
      }).pipe(
        this.notificationService.catchError('Problem occurred while listing my task'),
        map((result: any) => {
          const id = action.approvalStatus+'+DeliveryNotePESide';
          if (result && result.data?.items && result.data.items?.totalRecords) {
            let data: GovernmentServiceNotification = {
              id: id,
              count: result.data.items?.totalRecords,
              message: '#',
              model: 'DeliveryNotePESide',
              url: '/modules/government-supplier/delivery-note/await-delivery-confirmation',
            }
            this.store.dispatch(fromActions.upsertGovernmentServiceNotification({governmentServiceNotification: data}));
          } else {
            this.store.dispatch(fromActions.deleteGovernmentServiceNotification({id: id}));
          }
        })
      );
    })
  ), { dispatch: false });

  getDeliveryNoteGSPSideByApprovalStatus = createEffect((): any => this.actions$.pipe(
    ofType(fromActions.getDeliveryNoteGSPSideByApprovalStatus),
    switchMap((action) => {
      let pageSize = 10000;
      let input: DataRequestInput = {
        page: 1,
        pageSize: pageSize,
        fields: [],
        mustHaveFilters: [
          {
            fieldName: "approvalStatus",
            operation: SearchOperation.EQ,
            value1: action.approvalStatus,
          }
        ]
      };
      return this.apollo.fetchDataObservable({
        query: GET_DELIVERY_NOTE_COUNT,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          input: input,
        },
      }).pipe(
        this.notificationService.catchError('Problem occurred while listing my task'),
        map((result: any) => {
          const id = action.approvalStatus+'+DeliveryNoteGSPSide';
          if (result && result.data?.items && result.data.items?.totalRecords) {
            let data: GovernmentServiceNotification = {
              id: id,
              count: result.data.items?.totalRecords ?? 0,
              message: '#',
              model: 'DeliveryNoteGSPSide',
              url: this.getDeliveryNoteGSPSideUrl(action.approvalStatus),
            }
            this.store.dispatch(fromActions.upsertGovernmentServiceNotification({governmentServiceNotification: data}));
          }  else {
            this.store.dispatch(fromActions.deleteGovernmentServiceNotification({id: id}));
          }
        })
      );
    })
  ), { dispatch: false });

  getDeliveryNoteGSPSideUrl(status: string) {
    if (status === 'DRAFT') {
      return 'modules/government-supplier/delivery-note/draft';
    }
    return '#';
  }

  getDeliveryAdvisePESideUrl(status: string) {
    if (status === 'AWAIT_PAYMENT') {
      return 'modules/government-supplier/delivery-advise/await-payment';
    }
    if (status === 'WAIT_FOR_PE_CONFIRMATION') {
      return 'modules/government-supplier/delivery-advise/await-confirmation';
    }
    return '#';
  }


  getDeliveryAdvisePESideByApprovalStatus = createEffect((): any => this.actions$.pipe(
    ofType(fromActions.getDeliveryAdvisePESideByApprovalStatus),
    switchMap((action) => {
      let pageSize = 10000;
      let input: DataRequestInput = {
        page: 1,
        pageSize: pageSize,
        fields: [],
        mustHaveFilters: [
          {
            fieldName: "approvalStatus",
            operation: SearchOperation.EQ,
            value1: action.approvalStatus,
          }
        ]
      };
      return this.apollo.fetchDataObservable({
        query: GET_DELIVERY_ADVISE_FOR_PE_COUNT,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          input: input,
        },
      }).pipe(
        this.notificationService.catchError('Problem occurred while listing my task'),
        map((result: any) => {
          const id = action.approvalStatus+'+DeliveryAdvisePESide';
          if (result && result.data?.items && result.data.items?.totalRecords) {
            let data: GovernmentServiceNotification = {
              id: id,
              count: result.data.items?.totalRecords ?? 0,
              message: '#',
              model: 'DeliveryAdvisePESide',
              url: this.getDeliveryAdvisePESideUrl(action.approvalStatus),
            }
            this.store.dispatch(fromActions.upsertGovernmentServiceNotification({governmentServiceNotification: data}));
          } else {
            this.store.dispatch(fromActions.deleteGovernmentServiceNotification({id: id}));
          }
        })
      );
    })
  ), { dispatch: false });

  getDeliveryAdviseGSPSideByApprovalStatus = createEffect((): any => this.actions$.pipe(
    ofType(fromActions.getDeliveryAdviseGSPSideByApprovalStatus),
    switchMap((action) => {
      let pageSize = 10000;
      let input: DataRequestInput = {
        page: 1,
        pageSize: pageSize,
        fields: [],
        mustHaveFilters: [
          {
            fieldName: "approvalStatus",
            operation: SearchOperation.EQ,
            value1: action.approvalStatus,
          }
        ]
      };
      return this.apollo.fetchDataObservable({
        query: GET_DELIVERY_ADVISE_COUNT,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          input: input,
        },
      }).pipe(
        this.notificationService.catchError('Problem occurred while listing my task'),
        map((result: any) => {
          const id = action.approvalStatus+'+DeliveryAdviseGSPSide';
          if (result && result.data?.items && result.data.items?.totalRecords) {
            let data: GovernmentServiceNotification = {
              id: id,
              count: result.data.items?.totalRecords ?? 0,
              message: '#',
              model: 'DeliveryAdviseGSPSide',
              url: this.getDeliveryAdviseGSPSideUrl(action.approvalStatus),
            }
            this.store.dispatch(fromActions.upsertGovernmentServiceNotification({governmentServiceNotification: data}));
          } else {
            this.store.dispatch(fromActions.deleteGovernmentServiceNotification({id: id}));
          }
        })
      );
    })
  ), { dispatch: false });


  getDeliveryAdviseGSPSideWaitForPayment = createEffect((): any => this.actions$.pipe(
    ofType(fromActions.getDeliveryAdviseGSPSideWaitForPayment),
    switchMap((action) => {
      let pageSize = 10000;
      let input: DataRequestInput = {
        page: 1,
        pageSize: pageSize,
        fields: [],
        mustHaveFilters: [
          {
            fieldName: "approvalStatus",
            operation: SearchOperation.EQ,
            value1: 'WAIT_FOR_PAYMENT_APPROVAL',
          }
        ]
      };

      return this.apollo.fetchDataObservable({
        query: GET_DELIVERY_ADVISE_COUNT,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          input: input,
        },
      }).pipe(
        this.notificationService.catchError('Problem occurred while listing my task'),
        map((result: any) => {
          const id = 'WAIT_FOR_PAYMENT_APPROVAL+DeliveryAdviseGSPSide';
          if (result && result.data?.items && result.data.items?.totalRecords) {
            let data: GovernmentServiceNotification = {
              id: id,
              count: result.data.items?.totalRecords ?? 0,
              message: '#',
              model: 'DeliveryAdviseGSPSide',
              url: '/modules/government-supplier/delivery-advise/wait-for-payment',
            }
            this.store.dispatch(fromActions.upsertGovernmentServiceNotification({governmentServiceNotification: data}));
          } else {
            this.store.dispatch(fromActions.deleteGovernmentServiceNotification({id: id}));
          }
        })
      );
    })
  ), { dispatch: false });


  getDeliveryAdviseGSPSideUrl(approvalStatus: string) {
    if (approvalStatus === ApprovalStatusEnum.PE_CONFIRMED) {
      return '/modules/government-supplier/delivery-advise/confirmed'
    } else if (approvalStatus === ApprovalStatusEnum.WAIT_FOR_PAYMENT_APPROVAL) {
      return '/modules/government-supplier/delivery-advise/wait-for-payment'
    }  else if (approvalStatus === ApprovalStatusEnum.AWAIT_GSP_ACCOUNTANT_ACTION) {
      return '/modules/government-supplier/delivery-advise/gsp-accountant-confirmation'
    } else {
      return '#';
    }
  }

  getGSPReceivedOrder = createEffect((): any => this.actions$.pipe(
    ofType(fromActions.getGSPReceivedOrder),
    switchMap((action) => {
      let pageSize = 10000;
      let input: DataRequestInput = {
        page: 1,
        pageSize: pageSize,
        fields: [],
        mustHaveFilters: [
          {
            fieldName: "orderStatus",
            operation: SearchOperation.EQ,
            value1: 'SUBMITTED',
          }
        ]
      };
      return this.apollo.fetchDataObservable({
        query: GET_GSP_ORDERS_COUNT,
        apolloNamespace: ApolloNamespace.app,
        variables: {
          input: input,
        },
      }).pipe(
        this.notificationService.catchError('Problem occurred while listing my task'),
        map((result: any) => {
          const id = 'SUBMITTED'+'+GovernmentServiceRequisition';
          if (result && result.data?.items && result.data.items?.totalRecords) {
            let data: GovernmentServiceNotification = {
              id: id,
              count: result.data.items?.totalRecords ?? 0,
              message: '#',
              model: 'GovernmentServiceRequisition',
              url: '/modules/government-supplier/gsp-received-order',
            }
            this.store.dispatch(fromActions.upsertGovernmentServiceNotification({governmentServiceNotification: data}));
          } else {
            this.store.dispatch(fromActions.deleteGovernmentServiceNotification({id: id}));
          }
        })
      );
    })
  ), { dispatch: false });

}
