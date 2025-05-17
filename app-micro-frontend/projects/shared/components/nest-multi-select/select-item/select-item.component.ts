import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-select-item',
    templateUrl: './select-item.component.html',
    styleUrls: ['./select-item.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class SelectItemComponent implements OnInit {
  @Input() userItem: any;
  @Input() hasChairman: boolean;
  @Input() origin: string = 'available';
  @Output() onSelected: EventEmitter<any> = new EventEmitter();
  @Output() onInterested: EventEmitter<any> = new EventEmitter();
  @Output() onTeamMemberPositionChanged: EventEmitter<any> = new EventEmitter();
  selected: any = {};
  constructor() { }

  ngOnInit(): void {
  }

  selectItem() {
    this.onSelected.emit(this.userItem);
  }

  interestItem() {
    this.selected[this.userItem.uuid] = !this.selected[this.userItem.uuid];
    this.onInterested.emit(this.userItem);
  }

  changed(event: any) {
    this.userItem = {
      ...this.userItem,
      position: event.value
    };
    this.onTeamMemberPositionChanged.emit(this.userItem);
  }

}
