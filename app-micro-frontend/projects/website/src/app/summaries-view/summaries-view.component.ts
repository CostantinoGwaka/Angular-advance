import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-summaries-view',
    templateUrl: './summaries-view.component.html',
    styleUrls: ['./summaries-view.component.scss'],
    standalone: true,
    imports: [MatIconModule, RouterLink, TranslatePipe]
})
export class SummariesViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
