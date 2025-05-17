import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-to-area',
    templateUrl: './to-area.component.html',
    styleUrls: ['./to-area.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatIconModule]
})
export class ToAreaComponent implements OnInit {

  constructor() { }
  @Output() selectedEmailList = new EventEmitter<any>();
  @Output() closeBtnToArea = new EventEmitter<boolean>();
  email: string;
  ngOnInit(): void {
  }

  selectedEmail(event: any) {
    this.selectedEmailList.emit(event.target.value);
  }

  closeButtonBtnToArea() {
    this.closeBtnToArea.emit(false);
  }


}
