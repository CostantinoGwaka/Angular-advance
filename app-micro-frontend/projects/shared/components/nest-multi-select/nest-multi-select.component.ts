import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import * as _ from 'lodash';
import { fadeIn } from 'src/app/shared/animations/basic-animation';
import { fadeInOut } from 'src/app/shared/animations/router-animation';
import { SearchPipe } from '../../pipes/search.pipe';
import { SelectItemComponent } from './select-item/select-item.component';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-nest-multi-select',
    templateUrl: './nest-multi-select.component.html',
    styleUrls: ['./nest-multi-select.component.scss'],
    animations: [fadeIn, fadeInOut],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, SelectItemComponent, NgClass, SearchPipe]
})
export class NestMultiSelectComponent implements OnInit, OnChanges {
  @Input() loading: boolean = true;
  @Input() label: string;
  @Input() selected: any[] = [];
  @Input() available: any[] = [];
  @Input() attemptedSave: boolean = true;

  @Input() hasChairman: boolean = false;

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onPositionChanged: EventEmitter<any> = new EventEmitter();

  interestedAvailableItems: any[] = [];
  interestedSelectedItems: any[] = [];

  selectedSearchString: string;
  availableSearchString: string;


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  pickAvailable(event: any) {
    this.available = this.available.filter((selectedItem: any) => selectedItem.uuid != event.uuid);
    if (this.hasChairman) {
      event = {
        ...event,
        position: 'MEMBER'
      };
    }
    this.selected = [...this.selected, event];
    this.onSelectionChange.emit(this.selected);
    this.interestedSelectedItems = [];
    this.interestedAvailableItems = [];
  }

  pickSelected(event: any) {
    this.selected = this.selected.filter((selectedItem: any) => selectedItem.uuid != event.uuid);
    this.available = [...this.available, event];
    this.onSelectionChange.emit(this.selected);
    this.interestedSelectedItems = [];
    this.interestedAvailableItems = [];
    this.hasChairman = this.hasChairmanMember(this.selected);
  }

  itemExists(item: any, list: any[]): boolean {
    return _.find(list, (listItem: any) => listItem.uuid == item.uuid) != null;
  }

  interestAvailable(event: any) {
    if (this.itemExists(event, this.interestedAvailableItems) == true) {
      this.interestedAvailableItems = this.interestedAvailableItems.filter((item: any) => item.uuid != event.uuid);
    } else {
      this.interestedAvailableItems.push(event);
    }
  }
  interestSelected(event: any) {
    if (this.itemExists(event, this.interestedSelectedItems) == true) {
      this.interestedSelectedItems = this.interestedSelectedItems.filter((item: any) => item.uuid != event.uuid);
    } else {
      this.interestedSelectedItems.push(event);
    }
    // this.interestedSelectedItems.push(event);
  }

  commitToLeft() {
    if (this.interestedSelectedItems.length > 0) {
      this.available = [...this.available, ...this.interestedSelectedItems];
      this.selected = this.selected.filter((selectedItem: any) => !_.find(this.available, ['uuid', selectedItem.uuid]));
      this.interestedSelectedItems = [];
      this.interestedAvailableItems = [];
      this.onSelectionChange.emit(this.selected);
      this.hasChairman = this.hasChairmanMember(this.selected);

    }
  }

  commitToRight() {
    if (this.interestedAvailableItems.length > 0) {
      if (this.hasChairman) {
        this.interestedAvailableItems = this.interestedAvailableItems.map((itemAvailable: any) => {
          return {
            ...itemAvailable,
            position: 'MEMBER'
          };
        });
      }
      this.selected = [...this.selected, ...this.interestedAvailableItems];
      this.available = this.available.filter((availableItem: any) => !_.find(this.selected, ['uuid', availableItem.uuid]));
      this.interestedSelectedItems = [];
      this.interestedAvailableItems = [];
      this.onSelectionChange.emit(this.selected);
    }

  }

  commitAllLeft() {

  }

  commitAllRight() {

  }

  itemPositionChanged(event: any) {
    this.selected = _.orderBy(this.selected.map((selectedItem: any) => {
      if (selectedItem.uuid == event.uuid) {
        return event;
      }
      return selectedItem;
    }), ['position'], ['asc']);
    this.onPositionChanged.emit(this.selected);
    this.interestedSelectedItems = [];
    this.interestedAvailableItems = [];
    this.hasChairman = this.hasChairmanMember(this.selected);
  }

  hasChairmanMember(items: any): boolean {
    return _.find(items, (item: any) => item.position == 'CHAIRPERSON') != null;
  }

}
