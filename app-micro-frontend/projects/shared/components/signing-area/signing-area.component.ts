import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-signing-area',
    templateUrl: './signing-area.component.html',
    standalone: true,
    imports: [
        MatCheckboxModule,
        FormsModule,
        MatButtonModule,
    ],
})
export class SigningAreaComponent implements OnInit {
  @Input({ required: true })
  confirmationText: string;

  @Input()
  title: string = 'Signing Area';

  @Input({ required: true })
  signButtonText: string = 'Sign';

  @Output()
  onSignButtonClick: EventEmitter<any> = new EventEmitter<any>();

  readyToSign: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onReadyToSignChange(event: any) {
    this.readyToSign = event.checked;
  }

  sing() {
    this.onSignButtonClick.emit();
  }
}
