import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from "../../animations/router-animation";
import { CustomAlertBoxModel } from "../custom-alert-box/custom-alert-box.model";
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
import { CustomAlertDialogData } from "../../../services/general.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-custom-alert-box-dialog',
    templateUrl: './custom-alert-box-dialog.component.html',
    styleUrls: ['./custom-alert-box-dialog.component.scss'],
    animations: [fadeIn],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatIconModule, HasPermissionDirective, NgTemplateOutlet, MatProgressSpinnerModule]
})
export class CustomAlertBoxDialogComponent implements OnInit {

  @Input() alertInfo: CustomAlertBoxModel;
  @Input() alertClass: string = 'border-blue-300 bg-blue-50';
  @Input() alertTextClass: string = 'text-black-50';
  @Input() loading: boolean = false;
  @Input() permissions: string[] = [];
  @Input() alertButtonClass: string = 'border-primary !bg-primary hover:bg-indigo-700 text-white';
  constructor(
    @Inject(MAT_DIALOG_DATA) data: CustomAlertDialogData,
    private dialogRef: MatDialogRef<CustomAlertBoxDialogComponent>
  ) {
    if (data.alertInfo) {
      this.alertInfo = data.alertInfo;
    }
    if (data.alertClass) {
      this.alertClass = data.alertClass;
    }
    if (data.alertTextClass) {
      this.alertTextClass = data.alertTextClass;
    }
    if (data.loading) {
      this.loading = data.loading ?? false;
    }
    if (data.alertButtonClass) {
      this.alertButtonClass = data.alertButtonClass;
    }
  }

  ngOnInit() {

  }

  closeModal(close: boolean = false) {
    this.dialogRef.close(close);
  }

  closeDialog() {
    this.closeModal(true);
  }

}
