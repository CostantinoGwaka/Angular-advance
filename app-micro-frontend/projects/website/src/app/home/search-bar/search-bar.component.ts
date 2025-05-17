import { MatFormField } from '@angular/material/form-field';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Router } from "@angular/router";
import { CategoriesSelectorComponent } from './categories-selector/categories-selector.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    standalone: true,
    imports: [
        MatIconModule,
        FormsModule,
        CategoriesSelectorComponent,
    ],
})
export class SearchBarComponent implements OnInit {
  @ViewChild('categorySelector', { static: true })
  categorySelector: ElementRef<MatFormField>;
  selectedCategory: string = null;
  searchText: string;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  setSelectedCategory(category: string) {
    this.selectedCategory = (category !== 'ALL') ? category : null;
  }

  async searchByInputFilters() {
    /** Add query parameters to URL  */
    const queryParams = {
      category: this.selectedCategory,
      search: this.searchText
    };

    /** Navigate to updated URL */
    await this.router.navigate(['tenders/published-tenders'], { queryParams: queryParams, queryParamsHandling: 'merge' });
  }
}
