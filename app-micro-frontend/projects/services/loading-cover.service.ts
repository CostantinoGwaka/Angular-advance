import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { Subject } from 'rxjs';

export enum LoadingCoverChangeType {
  LOADING_STARTED = 'LOADING_STARTED',
  LOADING_FINISHED = 'LOADING_FINISHED',
  LOADING_ERROR = 'LOADING_ERROR',
}

export interface ItemBeingLoaded {
  id: string;
}

export interface ItemsFailedToLoad {
  id: string;
  retryCallBack: () => void;
}

export interface LoadingCoverChange {
  changeType: LoadingCoverChangeType;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingCoverService {
  itemsBeingLoaded: ItemBeingLoaded[] = [];
  itemsFailedToLoad: ItemsFailedToLoad[] = [];

  private loadingCoverChangeEvent = new Subject<LoadingCoverChange>();

  constructor() { }

  setItemBeingLoaded(item: ItemBeingLoaded) {
    this.itemsBeingLoaded.push(item);
    if (this.itemsBeingLoaded.length === 1) {
      this.broadcastLoadingChange({
        changeType: LoadingCoverChangeType.LOADING_STARTED,
      });
    }
  }

  getChange() {
    return this.loadingCoverChangeEvent.asObservable();
  }

  setItemFinishedLoading(idOfActionBeingLoaded: string) {
    this.itemsBeingLoaded = this.itemsBeingLoaded.filter(
      (i) => i.id !== idOfActionBeingLoaded
    );
    if (this.itemsBeingLoaded.length === 0) {
      this.broadcastLoadingChange({
        changeType: LoadingCoverChangeType.LOADING_FINISHED,
      });
    }
  }

  setError(idOfActionBeingLoaded: string, retryCallBack: () => void) {
    this.setItemFinishedLoading(idOfActionBeingLoaded);
    this.broadcastLoadingChange({
      changeType: LoadingCoverChangeType.LOADING_ERROR,
    });
    this.itemsFailedToLoad.push({
      id: idOfActionBeingLoaded,
      retryCallBack,
    });
  }

  retryAll() {
    this.itemsFailedToLoad.forEach((item) => item?.retryCallBack());
    this.itemsFailedToLoad = [];
  }

  broadcastLoadingChange(change: LoadingCoverChange) {
    this.loadingCoverChangeEvent.next(change);
  }
}
