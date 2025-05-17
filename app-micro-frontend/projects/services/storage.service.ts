import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // The set method is used for encryption the value
  keys = '*n%^+-$#@$^@1ERF';

  stickyKeys: string[] = [
    'deviceId',
    'activate',
    'loginRedirectURL',
    'previousUserID',
    'hasSeenLaunchCelebration',
  ];

  set(value: any) {
    if (value || value === 0) {
      const key = CryptoJS.enc.Utf8.parse(this.keys);
      const iv: CryptoJS.lib.WordArray = CryptoJS.enc.Utf8.parse(this.keys);
      const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(value.toString()),
        key,
        {
          keySize: 128 / 32,
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // replacing a '/' character in the encrypted string with 'erms' in order to avoid unkown routes
      return encrypted.toString().replace(new RegExp('/', 'g'), 'erms');
      //  return encrypted.toString().replace('/', 'erms');
    } else {
      return null;
    }
  }

  // The get method is used for decrypting the value.
  get(value: any) {
    if (value) {
      const key = CryptoJS.enc.Utf8.parse(this.keys);
      const iv = CryptoJS.enc.Utf8.parse(this.keys);

      // return a '/' character before decryption
      const replacedValue = value.replace(new RegExp('erms', 'g'), '/');
      // const replacedValue3 =  replacedValue.replace('erms', '/');
      const decrypted = CryptoJS.AES.decrypt(replacedValue, key, {
        keySize: 128 / 32,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  setItem(key: string, value: any) {
    if (environment.ALLOW_PERMISSIONS) {
      localStorage.setItem(this.set(key)!, this.set(value)!);
    } else {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string) {
    if (environment.ALLOW_PERMISSIONS) {
      return this.get(localStorage.getItem(this.set(key)!));
    } else {
      return localStorage.getItem(key);
    }
  }
  removeItem(key: string) {
    if (environment.ALLOW_PERMISSIONS) {
      return localStorage.removeItem(this.set(key)!);
    } else {
      return localStorage.removeItem(key);
    }
  }
  clearStorage() {
    const stickyKeyValues = this.getStickyKeyValues();

    Object.keys(localStorage).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Restore sticky key values
    this.restoreStickyKeyValues(stickyKeyValues);
  }

  getStickyKeyValues() {
    let stickyKeyValues = {};
    this.stickyKeys.forEach((key) => {
      stickyKeyValues[key] = this.getItem(key);
    });
    return stickyKeyValues;
  }

  restoreStickyKeyValues(stickyKeyValues: any) {
    this.stickyKeys.forEach((key) => {
      if (stickyKeyValues[key]) {
        this.setItem(key, stickyKeyValues[key]);
      }
    });
  }
}
