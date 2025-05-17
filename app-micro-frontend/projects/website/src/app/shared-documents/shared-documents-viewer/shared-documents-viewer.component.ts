import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ParallaxContainerComponent } from '../../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { LoaderComponent } from 'projects/shared/components/loader/loader.component';
import { SearchOperation } from 'projects/shared/components/store/data-request-input/data-request-input.model';

export interface DocumentInterface {
  code: string;
  description: string;
  title: string;
  attachmentUuid: string;
  shareableDocumentCategoryUuid: string;
  uuid: string;
  createdAt: any;
}
@Component({
  selector: 'app-shared-documents-viewer',
  templateUrl: './shared-documents-viewer.component.html',
  styleUrls: ['./shared-documents-viewer.component.scss'],
  standalone: true,
  imports: [LayoutComponent, ParallaxContainerComponent, LoaderComponent, MatProgressSpinnerModule, MatIconModule]
})
export class SharedDocumentsViewerComponent implements OnInit {
  documentUuid?: string;
  document?: DocumentInterface;
  loading: boolean = false;
  loadingAttachment: any = {};

  fields: {
    isSearchable?: boolean;
    isSortable?: boolean;
    operation?: SearchOperation;
    orderDirection?: 'ASC' | 'DESC';
    fieldName?: string;
    searchValue?: string;
    searchValue2?: string;
  }[] = [];

  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    this.documentUuid = JSON.parse(
      this.activatedRoute.snapshot.queryParamMap.get('search')
    );

    this.getSharedDocumentDetails().then()
  }

  ngAfterViewInit() {
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  async getSharedDocumentDetails() {
    this.loading = true;
    try {
      let response: any = await this.apollo.fetchData({
        query: GET_SHAREABLE_DOCUMENT_DATA_BY_UUID,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuid: this.documentUuid,
        },
      });
      this.document = response.data.getShareableDocumentByUuid?.data;
      if (this.document === null || !this.document.attachmentUuid) {
        this.delay(5000).then(() => {
          this.viewAttachment(this.documentUuid).then();
        });
      }
      this.loading = false;
    } catch (e) {
      this.loading = true;
    }
  }

  formatDate(date: string, withTime: boolean = false) {
    let formattedDate = moment(date).format('DD MMM YYYY');
    if (withTime) {
      formattedDate += ' ' + moment(date).format('h:mm A');
    }
    return formattedDate;
  }

  async viewAttachment(attachmentUuid: string) {
    this.loadingAttachment[attachmentUuid] = true;
    const response = await this.attachmentService.fetchAttachment(
      attachmentUuid,
      'pdf',
    );
    this.loadingAttachment[attachmentUuid] = false;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
