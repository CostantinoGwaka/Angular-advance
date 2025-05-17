import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-view-help',
    templateUrl: './view-help.component.html',
    styleUrls: ['./view-help.component.scss'],
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class ViewHelpComponent implements OnInit {

  @Input() title = 'help';
  @Output() closeHelp = new EventEmitter();
  constructor() { }

  ngOnInit(): void { }
  onClose() {
    this.closeHelp.emit();
  }
}
