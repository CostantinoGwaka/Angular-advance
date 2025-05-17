import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from "../../../animations/basic-animation";
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-inline-alert-box',
    templateUrl: './inline-alert-box.component.html',
    styleUrls: ['./inline-alert-box.component.scss'],
    animations: [fadeIn],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatIconModule]
})
export class InlineAlertBoxComponent implements OnInit {
  /***  if alert type is set to custom a custom class must m=be provided */
  @Input() title: string;
  @Input() alertType: 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' | 'CUSTOM';
  @Input() icon: string = 'info';
  @Input() customClass: string = '!bg-blue-50 !text-black-50';
  generalClass: string = '';
  classWarning: string = 'bg-red-100 text-red-500';
  classSuccess: string = 'bg-accent/10 text-green-500';
  classDanger: string = 'bg-red-500 text-white';
  classInfo: string = 'bg-blue-100 text-black-50';
  constructor() { }

  ngOnInit() {
    this.checkAlertType(this.alertType)
  }

  checkAlertType(alertType) {
    switch (alertType) {
      case 'SUCCESS': {
        this.generalClass = this.classSuccess;
        break;
      }
      case 'WARNING': {
        this.generalClass = this.classWarning;
        break;
      }
      case 'DANGER': {
        this.generalClass = this.classDanger;
        break;
      }
      case 'INFO': {
        this.generalClass = this.classInfo;
        break;
      }
      case 'CUSTOM': {
        this.generalClass = this.customClass;
        break;
      }
      default: break;
    }
  }
}
