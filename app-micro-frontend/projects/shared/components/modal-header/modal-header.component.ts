import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  standalone: true,
  imports: [MatDialogModule, CdkDrag, CdkDragHandle, MatIconModule]
})
export class ModalHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() showClose = true;
  @Output() closeModal = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  closeOpenModal() {
    this.closeModal.emit(true);
  }

}
