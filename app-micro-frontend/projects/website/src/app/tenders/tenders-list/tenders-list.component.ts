import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { PublicEntityItem } from '../../store/public-tenders-item.model';
import { Router } from '@angular/router';
import { AttachmentService } from '../../../services/attachment.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { AdvancedTenderSearchTenderItemComponent } from '../../../shared/components/advanced-tender-search/advanced-tender-search-tender-item/advanced-tender-search-tender-item.component';


@Component({
    selector: 'web-tenders-list',
    templateUrl: './tenders-list.component.html',
    styleUrls: ['./tenders-list.component.scss'],
    standalone: true,
    imports: [
    AdvancedTenderSearchTenderItemComponent,
    MatIconModule,
    TranslatePipe
],
})
export class TendersListComponent implements OnInit {
  @Input() showViewMore = false;
  @Input() categoryName: string;
  @Input() categoryAcronym: string;

  @Input()
  requisitionItems: PublicEntityItem[] = [];

  constructor(
    private router: Router,
    private attachmentService: AttachmentService
  ) { }

  ngOnInit(): void {
    this.fetchPELogo().then();
  }

  async fetchPELogo() {
    if ((this.requisitionItems || [])?.length > 0) {
      let uuidList = [];
      this.requisitionItems.forEach((result) => {
        if (!uuidList.includes(result.procuringEntityUuid)) {
          uuidList.push(result.procuringEntityUuid);
        }
      });
      uuidList = uuidList.filter((uuid) => uuid !== null);
      await this.fetchAttachments(uuidList);
    }
  }

  async fetchAttachments(uuidList: string[]) {
    await this.attachmentService.fetchPELogoBulk(uuidList);
  }

  async viewMoreTenders() {
    /** Add query parameters to URL  */
    const queryParams = {
      category: this.categoryAcronym,
    };

    /** Navigate to updated URL */
    await this.router.navigate(['tenders/published-tenders'], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
