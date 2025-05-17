import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { VerifyDocumentComponent } from '../../shared/components/verify-document/verify-document.component';
import { ParallaxContainerComponent } from '../shared/components/parallax-container/parallax-container.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss'],
    standalone: true,
    imports: [
        LayoutComponent,
        ParallaxContainerComponent,
        VerifyDocumentComponent,
    ],
})
export class VerifyComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
