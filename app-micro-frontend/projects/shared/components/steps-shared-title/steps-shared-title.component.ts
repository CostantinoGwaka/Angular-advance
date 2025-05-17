import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-steps-shared-title',
    templateUrl: './steps-shared-title.component.html',
    styleUrls: ['./steps-shared-title.component.scss'],
    standalone: true
})
export class StepsSharedTitleComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
