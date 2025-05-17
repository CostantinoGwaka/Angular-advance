import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-search-area',
    templateUrl: './search-area.component.html',
    styleUrls: ['./search-area.component.scss'],
    standalone: true
})
export class SearchAreaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
