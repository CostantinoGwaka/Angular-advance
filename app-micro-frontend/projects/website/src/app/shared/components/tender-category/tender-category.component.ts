import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-tender-category',
    templateUrl: './tender-category.component.html',
    styleUrls: ['./tender-category.component.scss'],
    standalone: true
})
export class TenderCategoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
