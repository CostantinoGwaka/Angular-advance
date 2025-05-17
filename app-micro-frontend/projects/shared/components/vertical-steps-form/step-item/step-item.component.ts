import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MainNavComponent } from '../../main-nav/main-nav.component';
import { VerticalStepsFormStep } from '../interfaces/vertical-steps-form-step';


@Component({
    selector: 'vertical-steps-form-step-item',
    templateUrl: './step-item.component.html',
    styleUrls: ['./step-item.component.scss'],
    standalone: true,
    imports: [],
})
export class StepItemComponent implements OnInit {
  @Input() step: VerticalStepsFormStep;
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
