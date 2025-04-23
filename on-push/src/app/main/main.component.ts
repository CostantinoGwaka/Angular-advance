import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
  @Input() counter = 0;

  counterObject = {counter: 0}

  constructor() {
    setInterval(() => {
      this.counterObject = {
        counter: this.counterObject.counter+=1
      }
    }, 1000)
  }

}
