import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'web-section-header',
    templateUrl: './section-header.component.html',
    styleUrls: ['./section-header.component.scss'],
    standalone: true,
})
export class SectionHeaderComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
