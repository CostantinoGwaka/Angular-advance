import {
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MainNavComponent } from '../../main-nav/main-nav.component';
import { VerticalTabsStep } from "../interfaces/vertical-tabs-step";
import { NgClass } from '@angular/common';

@Component({
    selector: 'vertical-tab-item',
    templateUrl: './vertical-tab-item.component.html',
    styleUrls: ['./vertical-tab-item.component.scss'],
    standalone: true,
    imports: [NgClass],
})

export class VerticalTabItemComponent implements OnInit {
  @Input() tab: VerticalTabsStep;
  @Input() useCheck: boolean = false;
  @Output() onClick = new EventEmitter();

  @ViewChild(MainNavComponent)
  mainNavComponent: MainNavComponent;

  mouseIn = false;

  constructor() { }

  ngOnInit(): void { }

  mouseEnter() {
    this.mouseIn = true;
  }

  handleClick() {
    this.onClick.emit();
  }

  mouseLeave() {
    this.mouseIn = false;
  }
}
