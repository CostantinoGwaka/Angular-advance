import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Meta, Title } from '@angular/platform-browser';
import { NestUtils } from 'src/app/shared/utils/nest.utils';

@Component({
    selector: 'parallax-container',
    templateUrl: './parallax-container.component.html',
    styleUrls: ['./parallax-container.component.scss'],
    standalone: true,
})
export class ParallaxContainerComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() seo_description: string = '';
  constructor(private titleService: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.setPageTitleAndDescription();
  }

  ngOnChanges(changes: SimpleChange): void {
    if (changes['title'] || changes['description']) {
      this.setPageTitleAndDescription();
    }
  }

  setPageTitleAndDescription() {
    let title = this.title;
    this.titleService.setTitle(NestUtils.setPageTitle(title, this.meta));
    let description = this.seo_description
      ? this.seo_description
      : this.description
        ? this.description
        : title;
    NestUtils.setPageDescription(this.meta, description);
  }
}
