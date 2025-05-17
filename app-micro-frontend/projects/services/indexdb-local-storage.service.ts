import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { Observable } from 'rxjs';
import { AngularIndexedDB } from './angular2-indexddb';

export enum Tables {
  TemplateSections = 'TemplateSections',
  Templates = 'Templates',
  TemplateInfo = 'TemplateInfo',
  InstitutionLogo = 'InstitutionLogo',
}

@Injectable({
  providedIn: 'root',
})
export class IndexdbLocalStorageService {
  db: AngularIndexedDB;
  dbVersion = 5;
  offlineKeys: { [id: string]: Tables } = {
    [Tables.TemplateSections]: Tables.TemplateSections,
    [Tables.TemplateInfo]: Tables.TemplateInfo,
    [Tables.Templates]: Tables.Templates,
    [Tables.InstitutionLogo]: Tables.InstitutionLogo,
  };
  constructor() {
    this.db = new AngularIndexedDB('nest_local_data', this.dbVersion);
  }

  /**
   * Initiate the store
   * @returns {Promise<any>}
   * @private
   */
  async _initiateStoreObjects(): Promise<any> {
    return await this.db.createStore(this.dbVersion, (evt: any) => {
      Object.keys(this.offlineKeys).forEach((key) => {
        this.createStore(evt, this.offlineKeys[key], 'id');
      });
    });
  }

  createStore(evt: any, key: string, index: string) {
    try {
      const objectStore = evt.currentTarget.result.createObjectStore(key, {
        keyPath: index,
      });
      objectStore.createIndex(index, index, { unique: false });
    } catch (e) { }
  }

  /**
   * Add item to store in existing table
   * @param table
   * @param value
   * @returns {any}
   */
  async add(table: Tables, value: any): Promise<any> {
    await this._initiateStoreObjects();
    return this.db.add(table, value);
  }

  /**
   * Add or update item in store in existing table
   * @param table
   * @param value
   * @returns {any}
   */
  async put(table: Tables, value: any): Promise<any> {
    await this._initiateStoreObjects();
    return this.db.update(table, value);
  }

  /**
   * Update existing value in store
   * @param table
   * @param value // this should have the id same as one in system
   * @returns Observable{any}
   */
  async update(table: Tables, value: any) {
    await this._initiateStoreObjects();
    return this.db.update(table, value);
  }

  /**
   * get a single item by using index
   * @param table
   * @param index
   * @param index_value
   * @returns {any}
   */
  async getByIndex(
    table: Tables,
    index: string,
    index_value: string
  ): Promise<any> {
    await this._initiateStoreObjects();
    return this.db.getByIndex(table, index, index_value);
  }

  /**
   * get an item by key
   * @param table
   * @param key_value
   * @returns {any}
   */
  async getByKey(table: Tables, key_value: any): Promise<any> {
    await this._initiateStoreObjects();
    return this.db.getByKey(table, key_value);
  }

  async getByKeys(table: Tables, keys: Array<any>) {
    await this._initiateStoreObjects();
    return this.db.getByKeys(table, keys);
  }

  /**
   * get all keys in a store
   * @returns {any}
   * @param table
   * @param keys
   */
  async getAllKeys(table: Tables, keys: Array<any>): Promise<Array<string>> {
    await this._initiateStoreObjects();
    return this.db.getAllKeys(table, keys);
  }

  /**
   * get all items in a store
   * @param store_key
   * @returns {any}
   */
  async getAll(store_key: string): Promise<any> {
    await this._initiateStoreObjects();
    return this.db.getAll(store_key);
  }

  /**
   * delete all items in a store
   * @param store_key
   * @returns {any}
   */
  async clearAll(table: Tables): Promise<any> {
    await this._initiateStoreObjects();
    return this.db.clear(table);
  }

  /**
   * delete all items in a store
   * @returns {any}
   */
  async clearEverything(): Promise<any> {
    await this._initiateStoreObjects();
    Object.keys(this.offlineKeys).forEach((key) => {
      this.clearAll(this.offlineKeys[key]);
    });
  }

  /**
   * delete a single item in a store
   * @param store_key
   * @param index
   * @returns {any}
   */
  async delete(store_key: string, index: string): Promise<any> {
    await this._initiateStoreObjects();
    return this.db.delete(store_key, index);
  }

  /**
   * delete a single item in a store
   * @returns {any}
   */
  deleteDB(): Observable<any> {
    return new Observable((observer) => {
      const req = indexedDB.deleteDatabase('nest_local_data');
      req.onsuccess = () => {
        //
        observer.next('success');
        observer.complete();
      };
      req.onerror = () => {
        //
        observer.next('success');
        observer.complete();
      };
      req.onblocked = () => {
        //
        observer.error();
      };
    });
  }
}
