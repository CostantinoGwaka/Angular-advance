import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-quick-info',
    templateUrl: './quick-info.component.html',
    styleUrls: ['./quick-info.component.scss'],
    standalone: true,
    imports: [MatIconModule, RouterLink]
})
export class QuickInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
