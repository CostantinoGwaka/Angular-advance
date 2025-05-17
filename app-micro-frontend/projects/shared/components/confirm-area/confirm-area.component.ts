import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from "../../animations/router-animation";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-confirm-area',
    templateUrl: './confirm-area.component.html',
    styleUrls: ['./confirm-area.component.scss'],
    animations: [fadeIn],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class ConfirmAreaComponent implements OnInit {

  @Input() title = 'Please verify';
  @Input() emitValue = null;
  @Input() useYesNo = false;
  @Input() confirmTextClass: string = '';
  @Input() useConfirmCancel = false;
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
