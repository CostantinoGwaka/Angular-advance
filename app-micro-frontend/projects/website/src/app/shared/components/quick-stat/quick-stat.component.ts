import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-quick-stat',
    templateUrl: './quick-stat.component.html',
    styleUrls: ['./quick-stat.component.scss'],
    standalone: true
})
export class QuickStatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
