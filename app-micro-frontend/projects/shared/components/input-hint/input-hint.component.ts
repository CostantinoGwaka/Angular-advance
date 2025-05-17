import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../../store";
import * as fromInputHint from "../store/input-hint/input-hint.selectors";
import { Observable, Subscription } from "rxjs";
import { InputHint } from "../store/input-hint/input-hint.model";
import * as fromInputHintAction from "../store/input-hint/input-hint.actions";
import { GraphqlService } from "../../../services/graphql.service";
import { GET_INPUT_DESCRIPTION_BY_FIELD_NAME } from "../store/input-hint/input-hint.graphql";
import { LoaderComponent } from '../loader/loader.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-input-hint',
  templateUrl: './input-hint.component.html',
  styleUrls: ['./input-hint.component.scss'],
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, LoaderComponent]
})
export class InputHintComponent implements OnInit {
  isLoading: boolean = false;
  @ViewChild('sideInputField') sideInputField: MatSidenav;
  inputHints$: Observable<InputHint[]>;
  inputHint: InputHint;
  inside = false;
  public text: String;
  isOpened: boolean = false;
  subscriptions: Subscription = Subscription.EMPTY;
  constructor(
    private eRef: ElementRef,
    private store: Store<ApplicationState>,
    private apollo: GraphqlService,
  ) {

  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    setTimeout(() => {
      this.isOpened = this.sideInputField?.opened;
    }, 1000);

    if (this.isOpened) {
      if (!this.eRef.nativeElement.contains(event.target)) {
        this.sideInputField?.close()
      }
    }
  }

  ngOnInit(): void {
    this.inputHints$ = this.store.pipe(select(fromInputHint.selectAllInputHint));
    this.subscriptions.add(
      this.inputHints$.subscribe(async (inputHints) => {
        //
        if (inputHints.length > 0) {
          this.inputHint = inputHints[0];
          if (this.inputHint.showHint) {
            await this.sideInputField.open();
            this.isLoading = true;
            const response = await this.getInputHintData(this.inputHint.fieldName, this.inputHint.entity);
            if (response) {
              this.inputHint = {
                ...this.inputHint,
                ...response
              };
            }
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.sideInputField?.close();
          }
        }
      })
    );
  }

  async getInputHintData(fieldName: string, entity: string) {
    const response = await this.apollo.fetchData({
      apolloNamespace: ApolloNamespace.app,
      query: GET_INPUT_DESCRIPTION_BY_FIELD_NAME,
      variables: {
        fieldName: fieldName,
        entity: entity
      },
    });
    if (response?.data['getInputDescriptionByFieldNameAndEntity']?.data) {
      return response?.data['getInputDescriptionByFieldNameAndEntity']?.data
    }
    return null;
  }


  closeBackDrop() {
    this.sideInputField?.close();
    this.store.dispatch(fromInputHintAction.clearInputHints());
  }
  sideNavToggle() {
    this.isLoading = false;
    this.sideInputField?.close();
    this.store.dispatch(fromInputHintAction.clearInputHints());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
