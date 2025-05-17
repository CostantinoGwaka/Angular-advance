import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeSmooth } from "../../../animations/router-animation";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-accordion-item',
    templateUrl: './accordion-item.component.html',
    styleUrls: ['./accordion-item.component.scss'],
    animations: [fadeSmooth],
    standalone: true,
    imports: [MatIconModule, MatFormFieldModule, MatTooltipModule]
})
export class AccordionItemComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() viewMoreToolTip: string;
  @Input() index: number;
  @Input() isCurrentItem: boolean = false;
  @Input() useColoredIndex: boolean = false;
  @Output() onSelection: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewMoreAction: EventEmitter<any> = new EventEmitter<any>();
  currentIndex: number = -1;
  constructor() { }

  ngOnInit(): void {
  }

  viewMoreAction(): void {
    this.onViewMoreAction.emit();
  }

  toggleItem(index): void {
    this.onSelection.emit(index - 1);
    this.currentIndex = index - 1;
  }

}
