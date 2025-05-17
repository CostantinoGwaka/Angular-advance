import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { NumberPipePipe } from '../../pipes/number-pipe';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-custom-number-input',
    templateUrl: './custom-number-input.component.html',
    styleUrls: ['./custom-number-input.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, ClickOutsideDirective, DecimalPipe, NumberPipePipe]
})
export class CustomNumberInputComponent implements OnInit {
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Input() isReadOnly: boolean = false;
  @Input() useOnKeyUp: boolean = false;
  @Input() value: number;
  changeAttempted: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  onChange(event: any) {
    this.value = event.value;
    this.dataChange.emit(this.value);
  }

  attemptChange() {
    if (this.isReadOnly == false) {
      setTimeout(() => {
        this.changeAttempted = true;
        setTimeout(() => {
          document.getElementById("inputField").focus();
        }, 100);
      }, 100);
    }
  }

  clickedOutside() {
    if (this.changeAttempted == true && this.isReadOnly == false && !this.useOnKeyUp) {
      this.changeAttempted = false;
      this.dataChange.emit(this.value);
    }
  }

  registerChange(event: any) {
    this.value = +(event?.replace(/,/g, ''));
    if (this.useOnKeyUp) {
      this.dataChange.emit(this.value);
    }
  }
}
