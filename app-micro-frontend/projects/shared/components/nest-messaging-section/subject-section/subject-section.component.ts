import { FieldRequestInput } from './../../paginated-data-table/field-request-input.model';
import { DataRequestInput } from './../../paginated-data-table/data-page.model';
import { GET_CONVERSATION_ALL_TOPICS } from './../../../../modules/nest-communication-tool/store/conversation/conversation-tool.graphql';
import { NotificationService } from '../../../../services/notification.service';
import { GraphqlService } from '../../../../services/graphql.service';
import { LayoutService } from '../../../../services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { Conversation } from './../../../../modules/nest-settings/store/conversation/conversation-tool-model';
import {
  PageableParam,
  initializedPageableParameter,
} from './../../../../store/global-interfaces/organizationHiarachy';
import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';


@Component({
  selector: 'app-subject-section',
  templateUrl: './subject-section.component.html',
  styleUrls: ['./subject-section.component.scss'],
  standalone: true,
  imports: [
    LoaderComponent,
    FormsModule
],
})
export class SubjectSectionComponent implements OnInit {
  constructor(
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private apollo: GraphqlService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadData().then();
  }

  titles$: Observable<Conversation[]>;
  subjectTitle?: Conversation[] = [];
  loading$: Observable<boolean>;
  pageable: PageableParam = initializedPageableParameter;
  pagePage: PageableParam = {
    size: 1000,
    first: 0,
    sortBy: 'id',
    sortDirection: 'DESC',
  };
  refreshDataTable: boolean = false;
  loading: boolean = false;
  fetchSubject: boolean = false;
  selectedSubjectUuid: string = 'Select a subject';
  selectedSubjectItem: Conversation | any;
  @Output() selectedSubjectTitleUuid = new EventEmitter<string>();

  async loadData() {
    this.loading = true;

    let fields: FieldRequestInput[] = [
      {
        fieldName: 'title',
        searchValue: null,
        orderDirection: 'ASC',
      },
    ];

    let input: DataRequestInput = {
      page: 1,
      pageSize: 1000,
      fields: fields,
      mustHaveFilters: [],
    };

    const result: any = await this.apollo.fetchData({
      query: GET_CONVERSATION_ALL_TOPICS,
      apolloNamespace: ApolloNamespace.communication,
      variables: {
        input: input,
      },
    });
    this.subjectTitle = result.data.getConversationTopicData?.data;
    this.loading = false;
    this.fetchSubject = true;
  }

  subjectSelected(event) {
    let uuidSelected = event.target.value;
    try {
      this.selectedSubjectItem = this.subjectTitle.find(
        (pc: Conversation) => pc.uuid == uuidSelected
      );
      this.selectedSubjectUuid = this.selectedSubjectItem.uuid;
    } catch (e: any) { }
    this.selectedSubjectTitleUuid.emit(this.selectedSubjectUuid);
    this.loadData().then();
  }
}
