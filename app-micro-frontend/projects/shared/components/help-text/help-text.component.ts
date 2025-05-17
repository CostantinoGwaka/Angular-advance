import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-help-text',
    templateUrl: './help-text.component.html',
    styleUrls: ['./help-text.component.scss'],
    standalone: true
})
export class HelpTextComponent implements OnInit {

  @Input() helpText: string = '';

  @Input() isWarn = false;

  constructor() { }

  ngOnInit(): void {
  }

}
