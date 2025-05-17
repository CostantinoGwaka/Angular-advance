// import {createSelector} from '@ngrx/store';
// import * as fromUserReducer from './boq.reducer';
// import {User} from './user.model';
// import {getNestRegistrationState} from "../../nest-uaa.reducer";

// export const currentState = createSelector(getNestRegistrationState, (state) => state.users);

// export const selectAllUsers = createSelector(currentState, fromUserReducer.selectAll);

// export const selectModifiedUsers = createSelector(selectAllUsers, (users) => {
//   return users.map((user: any) => {
//     return {
//       ...user,
//       fullName: user?.fullName,
//       isdepartment: user?.department?.name,
//       iSdesignation: user?.designation?.designationName,
//       headDepartment: user?.headOfDepartment ? 'Head of Department' : '',
//       isBranch: user?.branch?.branchName,
//       otpToken: user?.otpToken,
//       isActive: user?.active ? 'ACTIVE' : 'IN-ACTIVE',
//       locked: user?.accountNonLocked ? 'LOCKED' : '-',
//       roles_: user?.rolesList?.name
//     };
//   });
// });

// export const selectUsersByDepartmentId = (params: { id: number }) => createSelector(
//   selectModifiedUsers,
//   (users: User[]) => {
//     return users.filter(user => user?.department?.id === params.id);
//   }
// );

// export const selectMyDetails = createSelector(
//   currentState,
// );
