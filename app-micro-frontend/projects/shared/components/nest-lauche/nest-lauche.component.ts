import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { fadeIn, fadeOut, fadeSmooth } from '../../animations/router-animation';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-nest-lauche',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './nest-lauche.component.html',
  styleUrl: './nest-lauche.component.scss',
  animations: [fadeSmooth, fadeIn, fadeOut],
})
export class NestLaucheComponent implements OnInit {
  @Input()
  replay: boolean = false;
  showBanner: boolean = false;
  paused = true;
  hasSeenLaunchCelebration = false;

  // custom setting confetti
  defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['2494D2', 'FBD506', '040707', '2DB34B', '040707'],
  };

  constructor(private storageService: StorageService) {
    if (
      this.storageService.getItem('hasSeenLaunchCelebration') === null ||
      this.storageService.getItem('hasSeenLaunchCelebration') === undefined ||
      this.storageService.getItem('hasSeenLaunchCelebration') === '' ||
      this.storageService.getItem('hasSeenLaunchCelebration') === 'false'
    ) {
      this.storageService.setItem('hasSeenLaunchCelebration', 'true');
      this.hasSeenLaunchCelebration = false;
    } else if (
      this.storageService.getItem('hasSeenLaunchCelebration') === 'true'
    ) {
      this.hasSeenLaunchCelebration = true;
    }
  }

  ngOnInit(): void {
    if (!this.hasSeenLaunchCelebration) {
      this.toggle();
    }
  }

  toggle(): void {
    this.showBanner = false;
    this.shoo_one();
    setTimeout(() => {
      this.showBanner = true;
      this.shoot_two();
    }, 4000); // 6000 milliseconds = 6 seconds
  }

  closeBanner() {
    this.showBanner = false;
  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  confetti(args: any) {
    return window['confetti'].apply(this, arguments);
  }

  shoo_one() {
    const colors = ['2494D2', 'FBD506', '040707', '2DB34B', '040707'];
    const end = Date.now() + 10 * 300; // 6 seconds from now
    function frame(this: any) {
      this.confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      this.confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame.bind(this));
      }
    }

    frame.call(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['replay']) {
      if (this.replay) {
        this.toggle();
      }
    }
  }

  shoot_two() {
    const duration = 6 * 1000; // 6 seconds
    const animationEnd = Date.now() + duration;
    const defaults_two = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ['2494D2', 'FBD506', '040707', '2DB34B', '040707'],
    };

    const interval = setInterval(
      function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        this.confetti({
          ...defaults_two,
          particleCount,
          origin: { x: this.random(0.1, 0.3), y: Math.random() - 0.2 },
        });
        this.confetti({
          ...defaults_two,
          particleCount,
          origin: { x: this.random(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }.bind(this),
      250
    );
  }
}
