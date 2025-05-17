import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { EntityObjectTypeEnum } from "../../team-management/store/team.model";
import { GraphqlService } from "../../../services/graphql.service";
import {
  GET_PRE_QUALIFICATIONS_BY_UID,
  GET_SHORT_LISTED_APPLICANTS
} from "../../../modules/nest-pre-qualification/store/pre-qualification.graphql";
import { winner_badge } from "../../../services/svg/icons/winner_badge";
import { DatetimePipe } from '../../pipes/date-time';
import { SearchPipe } from '../../pipes/search.pipe';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';


@Component({
  selector: 'app-evaluation-shortlisted-applicants',
  templateUrl: './evaluation-shortlisted-applicants.component.html',
  styleUrls: ['./evaluation-shortlisted-applicants.component.scss'],
  standalone: true,
  imports: [LoaderComponent, FormsModule, MatIconModule, SearchPipe, DatetimePipe]
})
export class EvaluationShortlistedApplicantsComponent implements OnInit {
  @Input() entityUuid: string;
  @Input() entityType: EntityObjectTypeEnum | any;
  searchItem: string;
  preQualification: any;

  applicants: any[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  loadingShortilisted: boolean = true;
  // winner:string=winner_badge;
  constructor(private apollo: GraphqlService) { }

  ngOnInit(): void {
    this.getPreQualification().then((_: void): void => {
      this.getApplicants(this.pageIndex, this.pageSize).then();
    });
  }

  async getPreQualification(): Promise<void> {
    this.loadingShortilisted = true;
    const response: any = await this.apollo.fetchData({
      query: GET_PRE_QUALIFICATIONS_BY_UID,
      apolloNamespace: ApolloNamespace.app,
      variables: {
        uuid: this.entityUuid
      }
    });
    this.preQualification = response.data.findPreQualificationByUuid.data;
  }

  async getApplicants(page: number, pageSize: number): Promise<void> {
    const response: any = await this.apollo.fetchData({
      query: GET_SHORT_LISTED_APPLICANTS,
      apolloNamespace: ApolloNamespace.submission,
      variables: {
        entityUuid: this.preQualification.uuid,
        input: {
          page,
          pageSize,
        },
        withMetaData: false
      }
    });

    const dataReponse: any = response.data.getShortListedApplicants;
    this.applicants = dataReponse.data;
    this.totalRecords = dataReponse.totalRecords;
    this.loadingShortilisted = false;
  }

  protected readonly winner_badge = winner_badge;
}
