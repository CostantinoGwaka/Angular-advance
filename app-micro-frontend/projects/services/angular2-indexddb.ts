export class AngularIndexedDB {
  private utils: Utils;
  private dbWrapper: DbWrapper;

  constructor(dbName: string, version: number) {
    this.utils = new Utils();
    this.dbWrapper = new DbWrapper(dbName, version);
  }

  // tslint:disable-next-line:ban-types
  createStore(version: number, upgradeCallback: Function) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      try {
        this.dbWrapper.dbVersion = version;
        const request = this.utils.indexedDB.open(
          this.dbWrapper.dbName,
          version
        );
        request.onsuccess = (e) => {
          self.dbWrapper.db = request.result;
          resolve(e);
        };

        request.onerror = (e) => {
          reject('IndexedDB error: ' + (e.target as any).errorCode);
        };

        request.onupgradeneeded = (e) => {
          upgradeCallback(e, self.dbWrapper.db);
        };
      } catch (e) {

      }
    });
  }

  getByKey(storeName: string, key: any) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readOnly,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => { },
        abort(e: Event) { },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);
        const request: IDBRequest = objectStore.get(key);
        request.onsuccess = (event: Event) => {
          resolve((event.target as any).result);
        };
      } else {
        reject('No transaction created');
      }
    });
  }

  getByKeys(storeName: string, keys: Array<any>) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readOnly,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => { },
        abort(e: Event) { },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);
        const keyStatus: any = {};
        keys.forEach((key) => {
          keyStatus[key] = false;
        });
        const items: any[] = [];
        keys.forEach(
          this.fetchKey(objectStore, (result: any, key: any) => {
            keyStatus[key] = true;
            items.push(result);
            let finished = true;
            keys.forEach((key1) => {
              if (!keyStatus[key1]) {
                finished = false;
              }
            });
            if (finished) {
              resolve(items);
            }
          })
        );
        let finished1 = true;
        keys.forEach((key) => {
          if (!keyStatus[key]) {
            finished1 = false;
          }
        });
        if (finished1) {
          resolve(items);
        }
      } else {
        reject('Transaction does not exit');
      }
    });
  }

  getAllKeys(storeName: string, uuids: string[]): Promise<string[]> {
    const self = this;

    return new Promise((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readOnly,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => { },
        abort(e: Event) { },
      });
      if (transaction) {
        const index = transaction.objectStore(storeName);

        const keys: string[] = [];
        let count = 0;

        uuids.forEach((uuid) => {
          const request = index.getKey(uuid);
          request.onsuccess = () => {
            if (request.result !== undefined) {
              keys.push(<string>request.result);
            }
            count++;
            if (count === uuids.length) {
              resolve(keys);
            }
          };
          request.onerror = () => {
            reject(request.error);
          };
        });
      } else {
        reject('Transaction does not exit');
      }
    });
  }

  fetchKey(objectStore: any, callback: any) {
    return (key: string) => {
      const request = objectStore.get(key);
      request.onsuccess = (event: Event) => {
        callback((event.target as any).result, key);
      };
    };
  }

  getAll(
    storeName: string,
    keyRange?: IDBKeyRange,
    indexDetails?: IndexDetails
  ) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readOnly,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => { },
        abort(e: Event) { },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);
        const result: Array<any> = [];
        let request: IDBRequest;
        if (indexDetails) {
          const index = objectStore.index(indexDetails.indexName);
          const order = indexDetails.order === 'desc' ? 'prev' : 'next';
          request = index.openCursor(keyRange, order);
        } else {
          request = objectStore.openCursor(keyRange);
        }

        request.onerror = (e) => {
          reject(e);
        };

        request.onsuccess = (evt: Event) => {
          const cursor: any = (evt.target as IDBOpenDBRequest).result;
          if (cursor) {
            result.push(cursor.value);
            cursor.continue();
          } else {
            resolve(result);
          }
        };
      } else {
        reject('Transaction does not exit');
      }
    });
  }

  add(storeName: string, value: any, key?: any) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readWrite,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {
          resolve({ key, value });
        },
        abort(e: Event) { },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);

        objectStore.add(value, key);
      }
    });
  }

  update(storeName: string, value: any, key?: any) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readWrite,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {
          resolve(value);
        },
        abort: (e: Event) => {
          reject(e);
        },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);
        objectStore.put(value, key);
      }
    });
  }

  delete(storeName: string, key: any) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readWrite,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {
          resolve(e);
        },
        abort: (e: Event) => {
          reject(e);
        },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);

        objectStore.delete(key);
      }
    });
  }

  openCursor(
    storeName: string,
    cursorCallback: (evt: Event) => void,
    keyRange?: IDBKeyRange
  ) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readOnly,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {
          resolve(e);
        },
        abort: (e: Event) => {
          reject(e);
        },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.openCursor(keyRange);

        request.onsuccess = (evt: Event) => {
          cursorCallback(evt);
          resolve(evt);
        };
      } else {
        reject('Transaction not available');
      }
    });
  }

  clear(storeName: string) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readWrite,
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {
          resolve(e);
        },
        abort: (e: Event) => {
          reject(e);
        },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);
        objectStore.clear();
        resolve(null);
      } else {
        reject('Transaction not available');
      }
    });
  }

  getByIndex(storeName: string, indexName: string, key: any) {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      const transaction = self.dbWrapper.createTransaction({
        storeName,
        dbMode: self.utils.dbMode.readOnly,
        error: (e: Event) => {
          reject(e);
        },
        abort: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => { },
      });
      if (transaction) {
        const objectStore = transaction.objectStore(storeName);
        const index = objectStore.index(indexName);
        const request = index.get(key);

        request.onsuccess = (event) => {
          resolve((event.target as IDBOpenDBRequest).result);
        };
      } else {
        reject('Transaction does exist');
      }
    });
  }
}

class Utils {
  dbMode: DbMode;
  indexedDB: IDBFactory;

  constructor() {
    this.indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).webkitIndexedDB ||
      (window as any).msIndexedDB;
    this.dbMode = {
      readOnly: 'readonly',
      readWrite: 'readwrite',
    };
  }
}

export interface IndexDetails {
  indexName: string;
  order: string;
}

interface DbMode {
  readOnly: string;
  readWrite: string;
}

class DbWrapper {
  dbName: string;
  dbVersion: number;
  db: IDBDatabase | null;

  constructor(dbName: string, version: number) {
    this.dbName = dbName;
    this.dbVersion = version || 2;
    this.db = null;
  }

  validateStoreName(storeName: string) {
    return this.db?.objectStoreNames.contains(storeName);
  }

  // tslint:disable-next-line:ban-types
  validateBeforeTransaction(storeName: string, reject: Function) {
    if (!this.db) {
      reject(
        'You need to use the createStore function to create a database before you query it!'
      );
    }
    if (!this.validateStoreName(storeName)) {
      reject('objectStore does not exists: ' + storeName);
    }
  }

  //app-advanced-tender-search-tender-item

  createTransaction(options: {
    storeName: string;
    dbMode: any;
    error: (e: Event) => any;
    complete: (e: Event) => any;
    abort: (e: Event) => any;
  }): IDBTransaction | undefined {
    const trans: IDBTransaction | undefined = this.db?.transaction(
      options.storeName,
      options.dbMode
    );
    if (trans) {
      trans.onerror = options.error;
      trans.oncomplete = options.complete;
      trans.onabort = options.abort;
    }
    return trans;
  }
}
