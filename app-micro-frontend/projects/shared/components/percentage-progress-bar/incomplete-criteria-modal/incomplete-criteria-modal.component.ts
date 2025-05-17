import { Component, Inject, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../../store";
import * as fromActions from "../store/submission-progress/submission-progress.actions";
import { EvaluationCriteriaStatus } from "../store/evaluation-progress/evaluation-progress.model";
import { MatRippleModule } from '@angular/material/core';

import { ModalHeaderComponent } from '../../modal-header/modal-header.component';


@Component({
  selector: 'app-incomplete-criteria-modal',
  templateUrl: './incomplete-criteria-modal.component.html',
  styleUrls: ['./incomplete-criteria-modal.component.scss'],
  standalone: true,
  imports: [ModalHeaderComponent, MatRippleModule]
})
export class IncompleteCriteriaModalComponent implements OnInit {
  criteriaList = [];

  constructor(
    private store: Store<ApplicationState>,
    public dialogRef: MatDialogRef<IncompleteCriteriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.criteriaList = data.criteriaList;
  }

  ngOnInit(): void { }

  closeModal() {
    this.dialogRef.close();
  }

  goToIncompleteCriteria(criteria: EvaluationCriteriaStatus) {
    this.store.dispatch(fromActions.setIncompleteCriteria({ incompleteCriteria: criteria }));
    this.dialogRef.close();
  }
}
