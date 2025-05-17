import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { LoaderComponent } from '../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-info-wrapper',
  templateUrl: './info-wrapper.component.html',
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0',
          paddingTop: '0',
          paddingBottom: '0',
          overflow: 'hidden',
          opacity: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          padding: '*',
          overflow: 'hidden',
          opacity: '1',
        })
      ),
      transition('expanded <=> collapsed', animate('300ms ease-out')),
    ]),
  ],
  standalone: true,
  imports: [
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    LoaderComponent
],
})
export class InfoWrapperComponent implements OnInit {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() isLoading: boolean = false;
  @Input() isExpanded: boolean = false;
  @Input() loadingMessage: string = 'Loading, please wait...';
  @Input() errorMessage: string = null;
  @Output() onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  toggleContent() {
    this.isExpanded = !this.isExpanded;
    if (this.onToggle) {
      this.onToggle.emit(this.isExpanded);
    }
  }
}
