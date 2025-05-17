import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Store } from '@ngrx/store';
import { ApplicationState } from 'src/app/store';
import { Back } from 'src/app/store/router/router.action';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-coming-soon-page',
    templateUrl: './coming-soon-page.component.html',
    styleUrls: ['./coming-soon-page.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
    ],
})
export class ComingSoonPageComponent implements OnInit {
  constructor(private store: Store<ApplicationState>) { }

  ngOnInit(): void { }

  goBack() {
    this.store.dispatch(new Back());
  }
}
