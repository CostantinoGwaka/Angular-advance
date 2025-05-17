import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  fadeIn,
  fadeInOut,
  fadeSmooth,
} from '../../animations/router-animation';
import { NgClass } from '@angular/common';
import {
  OriginType
} from "../../../modules/nest-tenderer/tender-submission/submission/components/pricing/price-schedule-for-goods/models";

export interface CheckBoxOption {
  id: string;
  label: string;
  value: OriginType | any;
  selected: boolean;
}
@Component({
  selector: 'app-custom-check-box-input',
  templateUrl: './custom-check-box-input.component.html',
  styleUrls: ['./custom-check-box-input.component.scss'],
  animations: [fadeSmooth, fadeInOut, fadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass
],
})
export class CustomCheckBoxInputComponent implements OnInit, OnChanges {
  @Input() checkOptions: CheckBoxOption[];
  @Input() exclusiveHabit: boolean = true;
  @Input() initialValue: OriginType;
  @Input() isEvaluating: boolean;
  @Input() isVertical: boolean = false;
  @Output() onItemCheckedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() goodItem: any;
  constructor(private cdRef: ChangeDetectorRef) { }

  checkItem(item: CheckBoxOption) {
    let selectedOption: any;
    this.checkOptions = this.checkOptions.map((option: CheckBoxOption) => {
      if (option.value == item.value) {
        option.selected = !option.selected;
        selectedOption = option.value;
        this.cdRef.detectChanges();
      }
      return option;
    });
    if (this.goodItem) {
      this.onItemCheckedEvent.emit({
        item,
        uuid: this.goodItem?.uuid + '_' + selectedOption,
      });
    } else {
      this.onItemCheckedEvent.emit({ item, uuid: selectedOption });
    }
  }

  ngOnInit(): void { }

  ngOnChanges() {
    if (this.initialValue) {
      this.checkOptions = this.checkOptions.map((option: CheckBoxOption) => {
        option.selected = option.value == this.initialValue;
        return option;
      });

    }
  }
}
