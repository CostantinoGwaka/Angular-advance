import { createAction, props } from '@ngrx/store';
import { BOQFetchingConfiguration } from './boq.model';

export const getRequisitionItemBOQByBOQFetchingConfiguration = createAction(
  '[User/API] Get Requisition Item BOQ By BOQ Fetching Configuration',
  props<{ boqFetchingConfiguration: BOQFetchingConfiguration[] }>()
);
