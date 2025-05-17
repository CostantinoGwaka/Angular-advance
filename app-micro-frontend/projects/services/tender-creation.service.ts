import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { GraphqlService } from "./graphql.service";
import { CREATE_TENDER_DETAILS, CREATE_TENDER_DETAILS_PRE_QUALIFICATION } from "../modules/nest-app/store/tender-creation/tender-creation.graphql";
import { ApolloNamespace } from "../apollo.config";



@Injectable({
    providedIn: 'root'
})
export class TenderCreationService {

    constructor(
        private notificationService: NotificationService,
        private graphqlService: GraphqlService
    ) { }

    async createTenderDetails(tenderDto: any) {
        return await this.graphqlService.mutate({
            mutation: CREATE_TENDER_DETAILS,
            apolloNamespace: ApolloNamespace.app,
            variables: {
                tenderDto
            }
        });
    }


    async createUpdatePrequalificationDetails(tenderDto: any) {
        return await this.graphqlService.mutate({
            mutation: CREATE_TENDER_DETAILS_PRE_QUALIFICATION,
            apolloNamespace: ApolloNamespace.app,
            variables: {
                tenderDto
            }
        });
    }
}
