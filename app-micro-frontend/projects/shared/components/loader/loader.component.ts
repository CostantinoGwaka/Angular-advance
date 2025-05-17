import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatProgressBarModule]
})
export class LoaderComponent implements OnInit {

  @Input() message?: string;
  @Input() progressMode?: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() progressValue = 0;
  @Input() showMessage = true;
  itTakesLongTime = false;
  constructor() { }

  ngOnInit() {

  }

}
