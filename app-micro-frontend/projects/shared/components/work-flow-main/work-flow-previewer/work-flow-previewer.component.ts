import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GraphqlService } from '../../../../services/graphql.service';
import { NotificationService } from '../../../../services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../loader/loader.component';


export interface WorkflowPreviewData {
  selectedUuid: string;
  currentServiceKey: string;
}

@Component({
    selector: 'app-work-flow-previewer',
    templateUrl: './work-flow-previewer.component.html',
    standalone: true,
    imports: [
    MatDialogModule,
    LoaderComponent,
    MatButtonModule
],
})
export class WorkFlowPreviewerComponent implements OnInit {
  selectedUuid: string;
  currentServiceKey: string;

  loading: boolean = false;
  errorMessage: string = '';
  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) private _data: WorkflowPreviewData
  ) {
    this.selectedUuid = _data.selectedUuid;
    this.currentServiceKey = _data.currentServiceKey;
  }

  ngOnInit() {}
}
