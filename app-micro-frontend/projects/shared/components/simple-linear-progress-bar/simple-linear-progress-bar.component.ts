import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from '../../animations/basic-animation';


@Component({
    selector: 'simple-linear-progress-bar',
    templateUrl: './simple-linear-progress-bar.component.html',
    styleUrls: ['./simple-linear-progress-bar.component.scss'],
    animations: [fadeIn],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [],
})
export class SimpleLinearProgressBarComponent implements OnInit {
  @Input() loaderWidth?: number = 100;
  @Input() loaderColor?: string = 'accent';
  @Input({ required: true }) loaderProgress: number = 0;
  @Input() loaderStatusMessage?: string = '';
  @Input() showStatus: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
