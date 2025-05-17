import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss'],
    standalone: true
})
export class UserItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
