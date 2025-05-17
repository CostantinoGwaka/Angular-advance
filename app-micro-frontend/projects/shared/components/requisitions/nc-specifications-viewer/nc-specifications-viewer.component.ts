import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  NonConsultancyReqSpecification
} from "../../../../modules/nest-tender-initiation/store/non-consultancy-req-specification/non-consultancy-req-specification.model";
import { SortByPipe } from '../../../pipes/sort-pipe';


@Component({
    selector: 'app-nc-specifications-viewer',
    templateUrl: './nc-specifications-viewer.component.html',
    styleUrls: ['./nc-specifications-viewer.component.scss'],
    standalone: true,
    imports: [SortByPipe]
})
export class NcSpecificationsViewerComponent implements OnInit, OnChanges {

  @Input() ncSpecifications: NonConsultancyReqSpecification[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ncSpecifications'])
      this.ncSpecifications = changes['ncSpecifications'].currentValue;
  }

}
