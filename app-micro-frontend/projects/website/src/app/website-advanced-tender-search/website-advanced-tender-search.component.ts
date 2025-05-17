import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ActivatedRoute } from '@angular/router';
import { AdvancedTenderSearchComponent } from '../../shared/components/advanced-tender-search/advanced-tender-search.component';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';

@Component({
    selector: 'app-website-advanced-tender-search',
    templateUrl: './website-advanced-tender-search.component.html',
    standalone: true,
    imports: [
        LayoutComponent,
        ParallaxContainerComponent,
        AdvancedTenderSearchComponent,
    ],
})
export class WebsiteAdvancedTenderSearchComponent implements OnInit {
  pageTitle = 'Advanced Tender Search';
  pageDescription = 'Filter tenders according to your preferences';
  seoDescription = this.pageDescription;
  subTitle: string = null;
  page = null;

  constructor(private activeRoute: ActivatedRoute) {
    const segments = this.activeRoute.snapshot.url.map(
      (segment) => segment.path
    );
    this.page = segments[segments.length - 1];
    this.getPage();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  setTitle(event) {
    this.pageTitle = event;
  }

  setSubTitle(event) {
    /** Set a respective page description */
    if (event.length) {
      const subTitles = event.join(' and ');
      /** Avoiding re-assigning the same page description with duplicated words */
      if (!this.subTitle) {
        this.subTitle = this.pageDescription;
      }
      this.pageDescription = this.subTitle + `\n, filtered by ` + subTitles;
    } else if (!this.subTitle) {
      this.pageDescription = this.subTitle;
    }
  }

  getPage() {
    switch (this.page) {
      case 'opened-tenders':
        this.pageTitle = 'Opened Tenders';
        this.pageDescription = 'A list of all opened tenders';

        break;
      case 'awarded-tenders':
      case 'all-awarded-tenders':
        this.pageTitle = 'Awarded Tenders';
        this.pageDescription = 'A list of all awarded tenders';
        this.seoDescription =
          'Explore our collection of published tenders from various government institutions in Tanzania. Find opportunities for your business and stay updated on the latest tender announcements. Submit your bids and proposals online. Join our platform and be part of the procurement ecosystem.';

        break;
      default:
        this.pageTitle = 'Currently Published Tenders';
        this.pageDescription = 'A list of all published/active tenders';
        this.seoDescription =
          'Explore our collection of published tenders from various government institutions in Tanzania. Find opportunities for your business and stay updated on the latest tender announcements. Submit your bids and proposals online. Join our platform and be part of the procurement ecosystem.';

        break;
    }
  }
}
