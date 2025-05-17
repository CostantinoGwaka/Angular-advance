import { NestUtils } from 'src/app/shared/utils/nest.utils';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { PaginatorInput } from '../../models/web-paginator.model';
import { fadeIn } from '../../../../shared/animations/basic-animation';
import { fadeOut } from '../../../../shared/animations/router-animation';
import { NgFor, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'web-page-paginator',
  templateUrl: './frontend-paginator.component.html',
  styleUrls: ['./frontend-paginator.component.scss'],
  animations: [fadeIn, fadeOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgFor
  ],
})
export class FrontendPaginatorComponent implements OnInit, OnChanges {
  constructor(private viewportScroller: ViewportScroller) { }

  @Input() loading = false;
  @Input() paginatorInput: PaginatorInput = {};
  @Output() pageOutput: EventEmitter<number> = new EventEmitter();
  @Output() pageSizeOutput: EventEmitter<any> = new EventEmitter();

  @Input() pageSizeOptions = [10, 25, 50];
  pageDisplayCount: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (!this.paginatorInput?.loading) {
      this.generatePaginatorLabel();
    }
  }

  ngOnInit(): void {
    if (this.paginatorInput.pageSizeList) {
      this.pageSizeOptions = this.paginatorInput.pageSizeList;
    }
  }

  goToPage(page: number) {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.pageOutput.emit(page);
  }

  onItemsPerPageChange() {
    let pageSize = parseInt(this.paginatorInput.pageSize.toString());
    this.viewportScroller.scrollToPosition([0, 0]);
    this.pageSizeOutput.emit(pageSize);
  }

  onPageChange() {
    let page = parseInt(this.paginatorInput.currentPage.toString());
    this.goToPage(page);
  }

  generatePaginatorLabel() {
    return NestUtils.getPaginationCountLabel(this.paginatorInput);
  }

  getRange(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index);
  }

  getRangeSubset(currentPage: number, totalPages: number): number[] {
    const buffer = 2; // Number of pages to show before and after the current page
    const start = Math.max(1, currentPage - buffer); // Ensure the start is at least 1
    const end = Math.min(totalPages, currentPage + buffer); // Ensure the end does not exceed total pages

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  trackByIndex(index: number, page: number): number {
    return page;
  }
}
