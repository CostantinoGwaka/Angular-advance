import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { RenderPublicOpeningReportComponent } from '../render-public-opening-report/render-public-opening-report.component';
import { ParallaxContainerComponent } from '../../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
    selector: 'app-website-report-view',
    templateUrl: './website-report-view.component.html',
    styleUrls: ['./website-report-view.component.scss'],
    standalone: true,
    imports: [LayoutComponent, ParallaxContainerComponent, RenderPublicOpeningReportComponent]
})
export class WebsiteReportViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
