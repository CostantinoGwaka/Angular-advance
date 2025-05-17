import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { AttachmentService } from "../../../services/attachment.service";
import { SharedDocuments } from "../../../modules/nest-settings/store/shared-documents/shared-documents.model";
import { Router } from "@angular/router";
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { DatetimePipe } from '../../../shared/pipes/date-time';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'shared-documents-items',
    templateUrl: './shared-documents-items.component.html',
    styleUrls: ['./shared-documents-items.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatProgressSpinnerModule, DatetimePipe, TranslatePipe]
})
export class SharedDocumentsItemsComponent implements OnInit {

  @Input() document: SharedDocuments;
  loadingAttachment: any = {};

  peLogo: string = null;
  loadingLogo: boolean = false;

  constructor(
    private attachmentService: AttachmentService,
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  async viewAttachment(attachmentUuid: string) {
    this.loadingAttachment[attachmentUuid] = true;
    const response = await this.attachmentService.fetchAttachment(
      attachmentUuid,
      'pdf',
    );
    this.loadingAttachment[attachmentUuid] = false;
  }

  navigateViewDetails(document) {
    if (document) {
      const QueryParamString = JSON.stringify(document);
      this.router
        .navigate(['/documents-details'], {
          queryParams: {
            search: QueryParamString,
          },
        })
        .then();
    }
  }

}
