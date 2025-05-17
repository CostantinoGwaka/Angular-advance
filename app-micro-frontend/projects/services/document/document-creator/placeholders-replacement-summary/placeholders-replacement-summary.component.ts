import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from '../../../../apollo.config';
import { MatDialog } from '@angular/material/dialog';
import { PlaceholdersViewerDilogComponent } from '../../../../modules/nest-tender-initiation/approved-requisitions/manage-merged-requisitions/tender-document-creator/placeholders-viewer-dilog/placeholders-viewer-dilog.component';
import { SummaryType } from '../../../../modules/nest-tender-initiation/approved-requisitions/manage-merged-requisitions/tender-document-creator/tender-document-creator.component';
import {
  PlaceholderReplacementSummary,
  SectionPlaceholder,
} from '../../../../modules/nest-tender-initiation/store/tender-document-creator/tender-document.model';
import { NotificationService } from '../../../notification.service';


@Component({
    selector: 'placeholders-replacement-summary',
    templateUrl: './placeholders-replacement-summary.component.html',
    standalone: true,
    imports: [],
})
export class PlaceholdersReplacementSummaryComponent implements OnInit {
  @Input()
  placeholderReplacementSummary: PlaceholderReplacementSummary;

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  viewSummaryDetails(summaryType: SummaryType) {
    this.dialog.open(PlaceholdersViewerDilogComponent, {
      width: '80%',
      data: {
        summaryType,
        summary: this.placeholderReplacementSummary,
      },
    });
  }

  getUniquePlaceholdersCountByName(placeholders: SectionPlaceholder[]) {
    return placeholders.reduce((acc, curr) => {
      if (!acc.includes(curr.placeholderName)) {
        acc.push(curr.placeholderName);
      }
      return acc;
    }, []).length;
  }
}
