import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from '../../animations/router-animation';
import {NgClass} from "@angular/common";


@Component({
    selector: 'app-linear-progress-bar',
    templateUrl: './linear-progress-bar.component.html',
    styleUrls: ['./linear-progress-bar.component.scss'],
    animations: [fadeIn],
    standalone: true,
  imports: [
    NgClass
  ]
})
export class LinearProgressBarComponent implements OnInit {
  @Input() totalValue = 0;
  @Input() completedValue = 0;
  @Input() color = '#154101b1';
  @Output() currentProgress = new EventEmitter();
  @Input() useFullWidth: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  get completionProgress() {
    const val = this.totalValue > 0 && this.completedValue > 0 ? Math.round((this.completedValue / this.totalValue) * 100) : 0;
    this.currentProgress.emit(val);
    return val;

  }
}
