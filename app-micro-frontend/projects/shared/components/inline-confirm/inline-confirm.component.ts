import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-inline-confirm',
    templateUrl: './inline-confirm.component.html',
    styleUrls: ['./inline-confirm.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class InlineConfirmComponent implements OnInit {

  @Output() confirmYes = new EventEmitter();
  @Output() confirmCancel = new EventEmitter();
  @Input() message = '';

  constructor() { }

  ngOnInit(): void {
  }

}
