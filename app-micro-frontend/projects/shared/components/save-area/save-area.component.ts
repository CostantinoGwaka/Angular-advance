import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from '../../animations/router-animation';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../loader/loader.component';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-save-area',
    templateUrl: './save-area.component.html',
    styleUrls: ['./save-area.component.scss'],
    animations: [fadeIn],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [LoaderComponent, NgStyle, MatButtonModule, MatIconModule, TranslatePipe]
})
export class SaveAreaComponent {
  @Input() saveDisabled = false;
  @Input() cancelDisabled = false;
  @Input() confirmFirst = false;
  @Input() showCancel = true;
  @Input() cancelConfirmFirst = false;
  @Input() saveText = 'Save';
  @Input() saveColor = 'primary';
  @Input() cancelColor = 'warn';
  @Input() saveIcon = 'save';
  @Input() closeIcon = 'close';
  @Input() isSubmit = false;
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Are you sure you want to perform this action?';
  @Input() cancelConfirmText = 'Are you sure you want to perform this action?';
  @Output() save = new EventEmitter();
  @Output() firstButtonClick = new EventEmitter();
  @Output() cancelShowConfirm = new EventEmitter();
  @Output() cancelShowCancelConfirm = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() loadingMessage = 'Saving Data Please Wait...';
  @Input() savingData = false;
  @Input() hideSave = false;
  @Input() buttonPosition = 'right';
  showConfirm = false;
  showCancelConfirm = false;
  constructor() { }

  onSave(sendRequest = false) {
    if (this.confirmFirst && sendRequest) {
      this.firstButtonClick.emit();
      this.showConfirm = true;
    } else {
      this.save.emit();
      this.showConfirm = false;
    }
  }

  onSubmit() {
    this.showConfirm = false;
  }

  onCancelShowConfirm() {
    this.showConfirm = false;
    this.cancelShowConfirm.emit();
  }

  onCancelShowCancelConfirm() {
    this.showCancelConfirm = false;
    this.cancelShowCancelConfirm.emit();
  }


  onClose(sendRequest = false) {
    if (this.cancelConfirmFirst && sendRequest) {
      this.showCancelConfirm = true;
    } else {
      this.cancel.emit();
      this.showCancelConfirm = false;
    }
  }
}
