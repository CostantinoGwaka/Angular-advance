import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { TendersListComponent } from './tenders-list/tenders-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';

@Component({
    selector: 'app-tenders',
    templateUrl: './tenders.component.html',
    styleUrls: ['./tenders.component.scss'],
    standalone: true,
    imports: [
        LayoutComponent,
        ParallaxContainerComponent,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatMenuModule,
        MatIconModule,
        TendersListComponent,
    ],
})
export class TendersComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
