import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shared-hr-items-selector',
  templateUrl: './shared-hr-items-selector.component.html',
  styleUrls: ['./shared-hr-items-selector.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class SharedHrItemsSelectorComponent implements OnInit {

  @Input() itemsCount = 0;

  offsetMarginLeft: number = 100;
  marginLeft: number = this.offsetMarginLeft;
  cardWidth: number = 440;

  scrollCounter = 0;
  maxLimit = 0;
  minimumShownItems = 3;

  elRef: ElementRef;

  constructor(private elementRef: ElementRef) {
    this.elRef = elementRef;
  }

  ngOnInit(): void {
    this.maxLimit = this.itemsCount - this.minimumShownItems;
  }

  onItemActive = (clickItemRef: ElementRef) => {
    let parentLeft = this.elRef.nativeElement.offsetLeft;
    let parentRight = this.elRef.nativeElement.offsetLeft + this.elRef.nativeElement.offsetWidth;

    let itemLeftPosition = clickItemRef.nativeElement.offsetLeft;

    let itemRightPosition = clickItemRef.nativeElement.offsetLeft + this.cardWidth;

    if (itemLeftPosition < parentLeft) {
      setTimeout(() => {
        this.goPrevious();
      }, 100);
    }
    if ((itemRightPosition + 21) > parentRight) {
      setTimeout(() => {
        this.goNext();
      }, 100);
    }
  };

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
    if (this.itemsCount > 3 && this.scrollCounter < this.maxLimit) {
      if (this.scrollCounter <= this.itemsCount) {
        this.goNext();
      }
    }
  }
}
