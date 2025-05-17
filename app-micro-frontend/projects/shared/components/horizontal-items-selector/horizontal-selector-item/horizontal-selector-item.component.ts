import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

export interface HorizontalSelectorItemInfo {
  id?: number;
  uuid?: string;
  title: string;
  description: string;
}
export interface HorizontalSelectorItem {
  name: string;
  leftInfo?: HorizontalSelectorItemInfo;
  rightInfo?: HorizontalSelectorItemInfo;
}

@Component({
    selector: 'app-horizontal-selector-item',
    templateUrl: './horizontal-selector-item.component.html',
    standalone: true,
})
export class HorizontalSelectorItemComponent implements OnInit, OnChanges {
  @Input()
  item: HorizontalSelectorItem = null;

  @Input()
  cardWidth: number = 400;

  @Input()
  isActive: boolean = false;

  @Output()
  onActive: EventEmitter<any> = new EventEmitter();

  itemRef: ElementRef;

  constructor(private elRef: ElementRef) {
    this.itemRef = elRef;
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['isActive'].previousValue == false &&
      changes['isActive'].currentValue == true
    ) {
      this.onActive.emit(this.itemRef);
    }
  }
}
