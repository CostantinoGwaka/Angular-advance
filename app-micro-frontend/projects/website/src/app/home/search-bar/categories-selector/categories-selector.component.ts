import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef, Output, EventEmitter,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'app-categories-selector',
    templateUrl: './categories-selector.component.html',
    styleUrls: ['./categories-selector.component.scss'],
    standalone: true,
    imports: [
    MatRippleModule,
    MatIconModule,
    TranslatePipe
],
})
export class CategoriesSelectorComponent implements OnInit {

  showCategories: boolean = false;
  mouseIn: boolean = false;
  selectedCategory: string = 'ALL_TENDER_CATEGORIES'; /// Translated key
  selectedCategoryValue: string = 'ALL';
  @Output() setSelectedCategory = new EventEmitter<string>();
  @ViewChild('container') container: ElementRef;

  categories = [
    { name: 'ALL_TENDER_CATEGORIES', value: 'ALL' },
    { name: 'GOODS_TENDERS', value: 'G' },
    { name: 'WORKS_TENDERS', value: 'W' },
    { name: 'CONSULTANCY_TENDERS', value: 'C' },
    { name: 'NON_CONSULTANCY_TENDERS', value: 'NC' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.setSelectedCategory.emit(this.selectedCategoryValue);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.container) {
      if (!this.container.nativeElement.contains(event.target)) {
        if (!this.mouseIn) {
          this.showCategories = false;
        }
      }
    }
  }

  selectCategory(selectedCategory) {
    this.selectedCategory = selectedCategory.name;
    this.selectedCategoryValue = selectedCategory.value;
    this.setSelectedCategory.emit(this.selectedCategoryValue);
    this.showCategories = false;
  }
}
