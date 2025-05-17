import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-nest-vertical-step',
    templateUrl: './nest-vertical-step.component.html',
    styleUrls: ['./nest-vertical-step.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class NestVerticalStepComponent implements OnInit {
  @Input() index: number;
  @Input() title: string = '';
  @Input() active: boolean = false;
  @Output() onStepSelected: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  onStepClickEvent() {
    this.onStepSelected.emit();
  }

}
