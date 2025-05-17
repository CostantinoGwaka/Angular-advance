import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../store";
import { Back } from "../../../store/router/router.action";
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    standalone: true,
    imports: [MatIconModule]
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private store: Store<ApplicationState>
  ) { }

  ngOnInit(): void {
  }

  goBack() {
    this.store.dispatch(new Back())
  }

}
