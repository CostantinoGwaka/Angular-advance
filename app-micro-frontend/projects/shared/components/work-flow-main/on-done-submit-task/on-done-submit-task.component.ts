import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/shared/animations/router-animation';

@Component({
  selector: 'app-on-done-submit-task',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './on-done-submit-task.component.html',
  styleUrl: './on-done-submit-task.component.scss'
})
export class OnDoneSubmitTaskComponent implements AfterViewInit, OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  player: any;
  loading: boolean = true;
  message: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private _dialogRef:
      MatDialogRef<OnDoneSubmitTaskComponent>
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.loadLottieScript()
      .then(() => {
        this.loadLottieAnimation();
      })
      .catch((error) => {
        console.error('Error loading Lottie script:', error);
      });
  }


  loadLottieScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('lottie-script')) {
        // console.log('Lottie script already loaded.');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'lottie-script';
      script.src = 'assets/js/lottie.min.js';
      script.onload = () => {
        // console.log('Lottie script loaded successfully.');
        resolve();
      };
      script.onerror = () => {
        console.error('Lottie script failed to load.');
        reject('Lottie script failed to load');
      };
      document.body.appendChild(script);
    });
  }

  loadLottieAnimation(): void {
    const container = document.getElementById('lottie-container');
    if (container) {
      // Access Lottie via the window object
      const lottie = (window as any).lottie;

      if (lottie) {
        lottie.loadAnimation({
          container: container, // the DOM element that will contain the animation
          renderer: 'svg', // 'canvas' or 'html' as renderer
          loop: true, // animation loops
          autoplay: true, // autoplay
          path: 'assets/animations/json/done-task.json', // path to your Lottie JSON file
        });
      } else {
        console.error('Lottie is not defined.');
      }
    } else {
      console.error('Container is missing.');
    }
  }


  closeModal() {
    this._dialogRef.close(true)
  }
}
