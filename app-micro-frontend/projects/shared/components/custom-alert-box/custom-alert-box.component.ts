import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from "../../animations/router-animation";
import { CustomAlertBoxModel } from "./custom-alert-box.model";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-custom-alert-box',
    templateUrl: './custom-alert-box.component.html',
    styleUrls: ['./custom-alert-box.component.scss'],
    animations: [fadeIn],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatIconModule, HasPermissionDirective, NgTemplateOutlet, MatProgressSpinnerModule]
})
export class CustomAlertBoxComponent implements OnInit {

  @Input() alertInfo: CustomAlertBoxModel;
  @Input() alertClass: string = 'border-blue-300 bg-blue-50';
  @Input() alertTextClass: string = 'text-black-50';
  @Input() loading: boolean = false;
  @Input() permissions: string[] = [];
  @Input() alertButtonClass: string = 'border-primary !bg-primary hover:bg-indigo-700 text-white';
  @Output() buttonClicked = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if (!this.alertClass) {
      this.alertClass = 'border-blue-300 bg-blue-50';
    }
    if (!this.alertTextClass) {
      this.alertTextClass = 'text-black-50';
    }
  }

}
