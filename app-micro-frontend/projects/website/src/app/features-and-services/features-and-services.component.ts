import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeaderComponent } from '../shared/components/section-header/section-header.component';

@Component({
    selector: 'app-features-and-services',
    templateUrl: './features-and-services.component.html',
    styleUrls: ['./features-and-services.component.scss'],
    standalone: true,
    imports: [SectionHeaderComponent, MatIconModule, TranslatePipe]
})
export class FeaturesAndServicesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
