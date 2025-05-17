import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'web-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        MatIconModule,
        TranslatePipe,
    ],
})
export class FooterComponent implements OnInit {
  constructor() { }

  curretYear = new Date().getFullYear();

  ngOnInit(): void { }
}
