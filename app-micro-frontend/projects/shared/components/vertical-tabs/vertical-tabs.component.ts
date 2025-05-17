import {
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { colors } from 'src/app/shared/colors';
import { VerticalTabsStep } from "./interfaces/vertical-tabs-step";
import { VerticalTabItemComponent } from './tab-item/vertical-tab-item.component';



@Component({
    selector: 'vertical-tabs',
    templateUrl: './vertical-tabs.component.html',
    standalone: true,
    imports: [VerticalTabItemComponent],
})
export class VerticalTabsComponent implements OnInit, OnChanges {
  colors = colors;

  @Output()
  onStepSelection = new EventEmitter();

  @Input()
  tabTitle: string;

  @Input() useCheck: boolean = false;

  @Input()
  tabItems: VerticalTabsStep[];

  @Input() defaultStep: string;


  constructor() { }


  ngOnInit(): void {
    if (this.defaultStep) {
      this.setActiveStep(this.defaultStep);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultStep']) {
      this.setActiveStep(this.defaultStep);
    }
  }

  scrollToTop() {
    this.onStepSelection.emit();
  }

  setActiveStep(stepIndex) {
    this.tabItems = this.tabItems.map(
      (_step: VerticalTabsStep, _index: number) => ({
        ..._step,
        isActive: _step.id == stepIndex,
      })
    );
  }
  onTabClick(index: number, step: VerticalTabsStep) {
    this.tabItems = this.tabItems.map(
      (_step: VerticalTabsStep, _index: number) => ({
        ..._step,
        isActive: _index == index,
      })
    );
    this.onStepSelection.emit(step.id);
  }
}
