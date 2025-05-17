import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { GraphqlService } from './graphql.service';
import { ApolloNamespace } from '../apollo.config';
import { GET_REQUISITION_ASSIGNMENTS } from '../modules/nest-tender-initiation/store/procurement-requisition/procurement-requisition.graphql';

@Injectable({
  providedIn: 'root'
})
export class BoqAccessFeaturesService {

  userSystemAccessRoles: string;
  hasPermissionUnitRate: boolean = false;
  hasPermissionTotal: boolean = false;
  loading: boolean = false;
  allowedStatuses = ['PUBLISHED', 'DRAFTED', 'RE_ADVERTISED', 'INITIATED'];

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private apollo: GraphqlService
  ) { }


  initAccess(): void {
    const userSystemAccessRoles =
      this.storageService.getItem('userSystemAccessRoles') ??
      this.storageService.getItem('userSystemAccessRoles');
    this.userSystemAccessRoles = userSystemAccessRoles;
  }

  ngOnInit(): void {
    this.initAccess();
    const userSystemAccessRoles = this.storageService.getItem(
      'userSystemAccessRoles'
    );
  }

  checkUserRole(userRole: string) {
    const userSystemAccessRoles = this.storageService.getItem(
      'userSystemAccessRoles'
    );
    return this.userSystemAccessRoles?.includes(userRole);
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

  isDO() {
    return this.userSystemAccessRoles?.indexOf('DEPARTMENT_OFFICER') >= 0;
  }

  async containedListAssigned(mergedMainProcurementRequisitionUuid, username) {
    let listofAssingedUsers = await this.getRequisitionAssignments(mergedMainProcurementRequisitionUuid);

    if (listofAssingedUsers.length > 0) {
      listofAssingedUsers = listofAssingedUsers.map(item => item.userEmail);

      if (listofAssingedUsers.length === 0 || listofAssingedUsers.includes(username)) {
        return true;
      }
    }
    return false;
  }

  checkRolesFeatures() {
    this.hasPermissionUnitRate = this.authService.hasAccessFeatures('FEATURE_TNDR_INTN_BOQS_VIEW_UNIT_RATE_COLUMN');
    this.hasPermissionTotal = this.authService.hasAccessFeatures('FEATURE_TNDR_INTN_BOQS_VIEW_TOTAL_COLUMN');
  }

  async getRequisitionAssignments(requisitionUuid) {
    this.loading = true;
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.app,
        query: GET_REQUISITION_ASSIGNMENTS,
        variables: {
          requisitionUuid: requisitionUuid,
        },
      });
      const values: any = response.data.getRequisitionAssignments;
      if (values.code === 9000) {
        this.loading = false;
        return values.dataList;
      } else {
        this.loading = false;
        return [];
      }
    }
    catch (e) {
      console.log(e);
      this.loading = false;
      return [];
    }
  }
}
