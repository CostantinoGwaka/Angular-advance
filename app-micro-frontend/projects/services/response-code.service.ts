import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { ResponseCode } from "../store/global-interfaces/organizationHiarachy";

@Injectable({
  providedIn: 'root'
})
export class ResponseCodeService {

  constructor() { }

  private responseCodes: ResponseCode[] = [
    {
      code: 9000,
      description: 'Operation Successful',
    },
    {
      code: 9001,
      description: 'Invalid Request'
    },
    {
      code: 9002,
      description: 'Record does not exist'
    },
    {
      code: 9003,
      description: 'Unauthorized'
    },
    {
      code: 9004,
      description: 'Duplicate record'
    },
    {
      code: 9005,
      description: 'Failure'
    },
    {
      code: 9006,
      description: 'Data in Use'
    },
    {
      code: 9007,
      description: 'Bad Request'
    },
    {
      code: 9008,
      description: 'Method Not Allowed'
    },
    {
      code: 9009,
      description: 'Restricted Access'
    },
    {
      code: 9010,
      description: 'Limit Reach'
    },
    {
      code: 9011,
      description: 'Null Argument'
    },
    {
      code: 9012,
      description: 'Email already exists'
    },
    {
      code: 9013,
      description: 'Phone number already exists'
    },
    {
      code: 9012,
      description: 'Transfer Not Initialized'
    },
    {
      code: 9014,
      description: 'No Data Changed'
    },
    {
      code: 9015,
      description: 'Constraint Violation'
    },
    {
      code: 9016,
      description: 'Concept Note Document is Required'
    },
    {
      code: 9017,
      description: 'Approve stages not defined'
    },
    {
      code: 9018,
      description: 'Duplicate Employee ID'
    },
    {
      code: 9019,
      description: 'Atleast one attachment iis Required'
    },
    {
      code: 9020,
      description: 'Milestone start date should be within project start and end date'
    },
    {
      code: 9021,
      description: 'Milestone end date should be within project start and end date'
    },
    {
      code: 9022,
      description: 'Milestone start date can not be behind start end date'
    },
    {
      code: 9023,
      description: 'Minimum Requirement Not Meet'
    },
  ];

  getCodeDescription(code: any) {
    const result = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.responseCodes.length; i++) {
      for (const data in this.responseCodes[i]) {
        const item: any = this.responseCodes[i];
        if ((item[data]) === code) {
          result.push(this.responseCodes[i]);
        }
      }
    }
    return result;
  }

}
