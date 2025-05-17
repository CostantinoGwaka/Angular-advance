import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-redirect-manufacturer',
  templateUrl: './redirect-manufacturer.component.html',
  styleUrls: ['./redirect-manufacturer.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatFormFieldModule]
})
export class RedirectManufacturerComponent {


  constructor(private storageService: StorageService) {

  }

  goTo() {
    const loginRedirect = this.storageService.getItem('loginRedirectURL')

    window.location.href = loginRedirect;

  }


}
