import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  counter = 0;

  asyncCounter = new Observable((subscriber) => {
    setInterval(() => {
      subscriber.next(this.counter+=1);
    }, 1000);
  })


  // constructor(private readonly cd: ChangeDetectorRef,
  //             private ngZone: NgZone) {
  //   this.ngZone.runOutsideAngular(() => {
  //     setInterval((): void => {
  //       this.counter += 1;
  //       console.log(this.counter);
  //     }, 1000);
  //   })
  // }


}
