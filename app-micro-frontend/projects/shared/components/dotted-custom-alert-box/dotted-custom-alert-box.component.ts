import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'dotted-custom-alert-box',
    templateUrl: './dotted-custom-alert-box.component.html',
    styleUrls: ['./dotted-custom-alert-box.component.scss'],
    standalone: true
})
export class DottedCustomAlertBoxComponent implements OnInit {

  @Input() alertInfo: string;
  @Input() alertBackgroundClass?: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
