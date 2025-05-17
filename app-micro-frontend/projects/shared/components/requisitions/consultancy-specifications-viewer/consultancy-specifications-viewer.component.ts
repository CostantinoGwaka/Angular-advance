import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  ConsultancyReqSpecification
} from "../../../../modules/nest-tender-initiation/store/consultancy-req-specification/consultancy-req-specification.model";
import { TenderWorkspaceService } from "../../../../modules/nest-tender-initiation/approved-requisitions/manage-merged-requisitions/tender-workspace/tender-workspace.service";
import { SortByPipe } from '../../../pipes/sort-pipe';


@Component({
    selector: 'app-consultancy-specifications-viewer',
    templateUrl: './consultancy-specifications-viewer.component.html',
    styleUrls: ['./consultancy-specifications-viewer.component.scss'],
    standalone: true,
    imports: [SortByPipe]
})
export class ConsultancySpecificationsViewerComponent implements OnInit, OnChanges {

  @Input() consultancySpecifications: ConsultancyReqSpecification[] = [];

  constructor(
    private tenderWorkspaceService: TenderWorkspaceService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consultancySpecifications']) {
      this.consultancySpecifications = changes['consultancySpecifications'].currentValue;
      this.consultancySpecifications = this.tenderWorkspaceService.sortDataAscending(this.consultancySpecifications, 'id');
      this.consultancySpecifications = this.consultancySpecifications.map(specification => {
        if (specification.consultancySubSpecifications.length > 0) {
          specification.consultancySubSpecifications = this.tenderWorkspaceService.sortDataAscending(specification.consultancySubSpecifications, 'id');
          return specification;
        }
        return specification;
      })
    }
  }

}
