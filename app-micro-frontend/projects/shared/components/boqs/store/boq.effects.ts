// import * as fromState from '../../nest-uaa.reducer';
// import {Injectable} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
// import {Actions, createEffect, ofType} from '@ngrx/effects';
// import * as fromActions from './boq.actions';
// import {Store} from '@ngrx/store';
// import * as fromGraphql from './boq.graphql';
// import {map, switchMap} from 'rxjs/operators';
// import { GraphqlService } from 'src/app/services/graphql.service';
// import { NotificationService } from 'src/app/services/notification.service';
// import { StorageService } from 'src/app/services/storage.service';

// @Injectable()
// export class UserEffects {
//   constructor(
//     private actions$: Actions,
//     private apollo: GraphqlService,
//     private store: Store<fromState.State>,
//     private notificationService: NotificationService,
//     private storage: StorageService
//   ) {}

//   listAllUsersByInstitution$ = createEffect(
//     () =>
//       this.actions$.pipe(
//         ofType(fromActions.listAllUsersByInstitutionID),
//         switchMap((action) => {
//           return this.apollo
//             .fetchDataObservable({
//               query: fromGraphql.GET_USER_BY_INSTITUTION,
//               variables: {
//                 institutionId: action.institutionId,
//                 pageable: action?.pageable
//                   ? action.pageable
//                   : initializedPageableParameter,
//               },
//             })
//             .pipe(
//               this.notificationService.catchError(
//                 'Problem occurred while fetching Institution Users'
//               ),
//               map(({ data }: any) => {
//                 if (data) {
//                   const result = data?.getAllUsersByInstitutionId;
//                   if (result.content.length > 0) {
//                   }
//                   this.store.dispatch(
//                     fromActions.loadUsers({
//                       users: data.getAllUsersByInstitutionId.content,
//                     })
//                   );
//                 }
//               })
//             );
//         })
//       ),
//     { dispatch: false }
//   );

// }
