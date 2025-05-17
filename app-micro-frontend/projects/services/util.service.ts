import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() { }

  get procuringEntityName() {
    const data = localStorage.getItem('institutionName');
    return data ? data : null;
  }

  get procuringEntityId() {
    const data = JSON.parse(localStorage.getItem('institutionId'));
    return data ? data : null;
  }

  get procuringEntityUuid() {
    const data = localStorage.getItem('institutionUuid');
    return data ? data : null;
  }
}
