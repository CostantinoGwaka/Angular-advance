import { StorageService } from '../storage.service';
import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../apollo.config';

@Injectable({
  providedIn: 'root',
})
export class LivecharthelperService {
  constructor(private storageService: StorageService) { }

  loadUserDetails() {
    let userDetails: any = document.getElementById('liveChatUserDetails');

    var event = new Event('change');

    let jsonUserDetails = {
      email: this.storageService.getItem('clientUserName'),
      username: this.storageService.getItem('fullName'),
      institutionName: this.storageService.getItem('institutionName'),
      token: this.storageService.getItem('currentClient'),
      serviceUserType: this.storageService.getItem('serviceUserType'),
      userUuid: this.storageService.getItem('userUuid'),
      phoneNumber: this.storageService.getItem('phone'),
    };

    userDetails.value = JSON.stringify(jsonUserDetails);
    userDetails.dispatchEvent(event);
  }
}
