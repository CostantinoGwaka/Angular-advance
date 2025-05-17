import { Component, ElementRef, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { HorizontalSelectorItem, HorizontalSelectorItemComponent } from './horizontal-selector-item/horizontal-selector-item.component';

import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-horizontal-items-selector',
    templateUrl: './horizontal-items-selector.component.html',
    standalone: true,
    imports: [
    MatIconModule,
    HorizontalSelectorItemComponent
],
})
export class HorizontalItemsSelectorComponent implements OnInit {
  items: HorizontalSelectorItem[] = [];
  activeIndex: number = 0;

  offsetMarginLeft: number = 100;
  marginLeft: number = this.offsetMarginLeft;
  cardWidth: number = 440;

  scrollCounter = 0;
  maxLimit = 0;
  minimumShownItems = 3;

  elRef: ElementRef;

  constructor(elRef: ElementRef) {
    this.elRef = elRef;
  }

  ngOnInit(): void {
    this.items = [
      {
        name: 'Item 1 name',
        leftInfo: {
          title: 'Total Budget',
          description: '89,000,000,234,000',
        },
        rightInfo: {
          title: 'Total Budget',
          description: '89,000,000,234,000',
        },
      },
      {
        name: 'Item 2 name',
        leftInfo: {
          title: 'Total Budget',
          description: '12,444,000,000',
        },
        rightInfo: {
          title: 'Total Budget',
          description: '123,000,000',
        },
      },

      {
        name: 'Item 5 name',
        leftInfo: {
          title: 'Total Budget',
          description: '12,444,000,000',
        },
        rightInfo: {
          title: 'Total Budget',
          description: '123,000,000',
        },
      },

      {
        name: 'Item 5 name',
        leftInfo: {
          title: 'Total Budget',
          description: '12,444,000,000',
        },
        rightInfo: {
          title: 'Total Budget',
          description: '123,000,000',
        },
      },
      {
        name: 'Item 5 name',
        leftInfo: {
          title: 'Total Budget',
          description: '12,444,000,000',
        },
        rightInfo: {
          title: 'Total Budget',
          description: '123,000,000',
        },
      },
    ];

    this.maxLimit = this.items.length - this.minimumShownItems;
  }

  onItemActive = (clickItemRef: ElementRef) => {
    let parentLeft = this.elRef.nativeElement.offsetLeft;
    let parentRight =
      this.elRef.nativeElement.offsetLeft +
      this.elRef.nativeElement.offsetWidth;

    let itemLeftPosition = clickItemRef.nativeElement.offsetLeft;

    let itemRightPosition =
      clickItemRef.nativeElement.offsetLeft + this.cardWidth;

    if (itemLeftPosition < parentLeft) {
      setTimeout(() => {
        this.goPrevious();
      }, 100);
    }

    if (itemRightPosition > parentRight) {
      setTimeout(() => {
        this.goNext();
      }, 100);
    }
  };

  onItemClick(item: HorizontalSelectorItem, index: number) {
    this.activeIndex = index;
  }

  previous() {
    if (this.scrollCounter >= 1) {
      this.goPrevious();
    }
  }

  goPrevious() {
    this.scrollCounter--;
    this.marginLeft += this.cardWidth;
  }

  goNext() {
    this.scrollCounter++;
    this.marginLeft -= this.cardWidth;
  }

  next() {
    if (this.items.length > 3 && this.scrollCounter < this.maxLimit) {
      if (this.scrollCounter <= this.items.length) {
        this.goNext();
      }
    }
  }
}
