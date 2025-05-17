import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { PublicTendersTenderCategoryStats } from '../../store/public-tenders-tender-category-stats';


@Component({
    selector: 'web-tender-category-filter',
    templateUrl: './category-filter.component.html',
    styleUrls: ['./category-filter.component.scss'],
    standalone: true,
    imports: [],
})
export class CategoryFilterComponent implements OnInit {
  @Input()
  tenderCategoriesStats: PublicTendersTenderCategoryStats[] = [];
  categories = [
    { name: 'ALL_TENDER_CATEGORIES', tenderCategoryAcronym: 'ALL', tenderCategoryName: 'All', count: 0 },
    { name: 'GOODS_TENDERS', tenderCategoryAcronym: 'G', tenderCategoryName: 'Goods', count: 0 },
    { name: 'WORKS_TENDERS', tenderCategoryAcronym: 'W', tenderCategoryName: 'Works', count: 0 },
    { name: 'CONSULTANCY_TENDERS', tenderCategoryAcronym: 'C', tenderCategoryName: 'Consultancy', count: 0 },
    { name: 'NON_CONSULTANCY_TENDERS', tenderCategoryAcronym: 'NC', tenderCategoryName: 'Non Consultancy', count: 0 },
  ];
  @Output()
  onCategorySelect: EventEmitter<PublicTendersTenderCategoryStats> =
    new EventEmitter();

  sortedTenderCategoriesStats: PublicTendersTenderCategoryStats[] = [];

  selectedIndex = 0;

  constructor() { }

  ngOnInit(): void {
    this.setCategories();
  }

  ngOnChanges() {
    this.setCategories();
  }

  setCategories() {
    this.sortedTenderCategoriesStats = [];
    this.categories = this.categories.map(i => {
      const count = i.tenderCategoryAcronym === 'ALL' ? this.tenderCategoriesStats.reduce(
        (total: number, cat: PublicTendersTenderCategoryStats) =>
          total + cat.count,
        0
      ) : this.tenderCategoriesStats.find(j => j.tenderCategoryAcronym === i.tenderCategoryAcronym)?.count || 0
      return {
        ...i,
        count
      }
    })
    this.sortedTenderCategoriesStats.push({
      count: this.tenderCategoriesStats.reduce(
        (total: number, cat: PublicTendersTenderCategoryStats) =>
          total + cat.count,
        0
      ),
      tenderCategoryAcronym: 'ALL',
      tenderCategoryName: 'All',
      tenderCategoryUUID: 'all',
    });

    let G: PublicTendersTenderCategoryStats = this.getTenderByAccronym('G');
    if (G != null) {
      this.sortedTenderCategoriesStats.push(G);
    }

    let W: PublicTendersTenderCategoryStats = this.getTenderByAccronym('W');
    if (W != null) {
      this.sortedTenderCategoriesStats.push(W);
    }

    let C: PublicTendersTenderCategoryStats = this.getTenderByAccronym('C');
    if (C != null) {
      this.sortedTenderCategoriesStats.push(C);
    }

    let NC: PublicTendersTenderCategoryStats = this.getTenderByAccronym('NC');
    if (NC != null) {
      this.sortedTenderCategoriesStats.push(NC);
    }

    this.sortedTenderCategoriesStats = [
      ...this.sortedTenderCategoriesStats,
      ...this.tenderCategoriesStats.filter(
        (cat: PublicTendersTenderCategoryStats) =>
          !['G', 'W', 'C', 'NC'].includes(cat.tenderCategoryAcronym)
      ),
    ];
  }

  getTenderByAccronym(accronum: string): PublicTendersTenderCategoryStats {
    let found: PublicTendersTenderCategoryStats = null;

    try {
      found = this.tenderCategoriesStats.filter(
        (foundTender: PublicTendersTenderCategoryStats) =>
          foundTender.tenderCategoryAcronym == accronum
      )[0];
    } catch (e) { }

    return found;
  }

  selectCategory(
    tenderCategory: PublicTendersTenderCategoryStats,
    index: number
  ) {
    this.selectedIndex = index;
    this.onCategorySelect.emit(tenderCategory);
  }

  selectCategory1(
    tenderCategory: any,
    index: number
  ) {
    this.selectedIndex = index;
    this.onCategorySelect.emit(tenderCategory);
  }
}
