import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-password-strength-bar',
    templateUrl: './password-strength-bar.component.html',
    styleUrls: ['./password-strength-bar.component.scss'],
    standalone: true
})
export class PasswordStrengthBarComponent implements OnChanges {

  @Input() passwordToCheck: string;
  @Input() barLabel: string;
  @Output() strength = new EventEmitter();
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string;

  private colors = ['#F00', '#F90', '#FF0', '#FF0', '#0F0'];
  message: string;

  private static measureStrength(pass: string) {
    // bonus points for mixing it up
    // variations will compensate up to 100%
    const variations: { [id: string]: boolean } = {
      digits: /\d/.test(pass),
      length: (pass.length >= 8 && pass.length <= 64),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
      ...PasswordStrengthBarComponent.checkForRepetitionAndSequential(pass, 3)
    };

    let variationCount = 0;
    for (const check in variations) {
      variationCount += (variations[check]) ? 1 : 0;
    }
    let score = (variationCount * 100) / 7;
    return Math.trunc(score);
  }

  private getColor(score: number) {
    let idx = 0;
    if (score == 100) {
      idx = 4;
      this.message = 'Strong password';
    } else if (score > 80) {
      idx = 3;
      this.message = 'Good password';

    } else if (score >= 60) {
      idx = 2;
      this.message = 'Weak password';
    } else if (score >= 40) {
      idx = 1;
      this.message = 'Bad password';
    }

    return {
      idx: idx + 1,
      col: this.colors[idx],
      message: this.message
    };
  }

  private static checkForRepetitionAndSequential(str: string, n: number) {
    let rep: boolean = false;
    let seq: boolean = false;
    let result = [];

    const num = '0123456789';
    const abc = 'abcdefghijklmnopqrstuvqxyz';

    if (str.length < n) {
      return {
        noRepetition: true,
        noSequential: true,
      };
    }

    for (let i = 0; i < str.length; i++) {
      if (i + n > str.length) break;

      let chunk = str.slice(i, i + n);
      let seqABC = abc.indexOf(chunk) > -1;
      let seq123 = num.indexOf(chunk) > -1;

      if (seq123 || seqABC) {
        seq = true;
        result.push(chunk);
      }

      if ([...chunk].every(v => v.toLowerCase() === chunk[0].toLowerCase())) {
        rep = true;
        result.push(chunk);
      }
    }

    return {
      noRepetition: !rep,
      noSequential: !seq,
    };
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;
    this.setBarColors(5, '#DDD');
    if (password) {
      let strength = PasswordStrengthBarComponent.measureStrength(password);
      const c = this.getColor(strength);
      this.setBarColors(c.idx, c.col);
      this.strength.emit(strength);
    }
  }

  private setBarColors(count: number, col: string) {
    for (let _n = 0; _n < count; _n++) {
      // @ts-ignore
      this['bar' + _n] = col;
    }
  }

}
