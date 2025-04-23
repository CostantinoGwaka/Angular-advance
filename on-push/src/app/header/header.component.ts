import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  counter = 0;

  constructor(private readonly cd: ChangeDetectorRef) {
    setInterval(() => {
      this.counter += 1;
      this.cd.detectChanges();
    }, 1000);
  }

}
