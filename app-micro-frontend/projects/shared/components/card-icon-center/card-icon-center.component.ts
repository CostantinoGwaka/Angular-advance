import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from "../../animations/basic-animation";
import { LoaderComponent } from '../loader/loader.component';

import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'card-icon-center',
    templateUrl: './card-icon-center.component.html',
    styleUrls: ['./card-icon-center.component.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [MatIconModule, LoaderComponent]
})
export class CardIconCenterComponent implements OnInit {
  @Input() icon = '';
  @Input() iconClass = '!text-primary';
  @Input() iconStyles = '';
  @Input() btnClass = 'regBtnClass';
  @Input() title;
  @Input() btnTitle;
  @Input() loading: boolean;
  @Input() description: string;
  @Output() onClick = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  actionClicked() {
    this.onClick.emit();
  }
}
