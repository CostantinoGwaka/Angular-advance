import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-accept-work',
    templateUrl: './accept-work.component.html',
    styleUrls: ['./accept-work.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule]
})
export class AcceptWorkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
