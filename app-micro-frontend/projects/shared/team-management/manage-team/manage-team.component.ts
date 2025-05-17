import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { EntityObjectTypeEnum, TeamDto } from '../store/team.model';
import { TeamDetailComponent } from '../team-detail/team-detail.component';

@Component({
    selector: 'app-manage-team',
    templateUrl: './manage-team.component.html',
    styleUrls: ['./manage-team.component.scss'],
    standalone: true,
    imports: [TeamDetailComponent]
})
export class ManageTeamComponent implements OnInit {
  @Input() entityType: EntityObjectTypeEnum;
  @Input() teamType: any;
  @Input() selectedUuid: string;
  @Input() team: any;
  teamDto: TeamDto =
    {
      entityType: null,
      entityUuid: null,
      teamType: null,
      plannedNumberOfDays: null,
      plannedEvaluationEndDate: null,
      plannedEvaluationStartDate: null,
      teamMemberDtos: []
    };
  @Output() closeForm: EventEmitter<any> = new EventEmitter();
  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

}
