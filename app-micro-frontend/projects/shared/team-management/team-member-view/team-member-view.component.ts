import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeInOut } from 'src/app/shared/animations/router-animation';
import { TeamMemberViewerComponent } from '../../components/team-member-view/team-member-view.component';


@Component({
    selector: 'app-team-member-view',
    templateUrl: './team-member-view.component.html',
    styleUrls: ['./team-member-view.component.scss'],
    animations: [fadeInOut],
    standalone: true,
    imports: [TeamMemberViewerComponent]
})
export class TeamMemberViewComponent implements OnInit {
  @Input() members: any[] = [];
  @Input() loading: boolean = false;
  @Input() viewOnly: boolean = false;
  @Input() isForTask: boolean = false;
  @Output() onViewLetterEvent: EventEmitter<any> = new EventEmitter();
  @Output() onReplaceMemberEvent: EventEmitter<any> = new EventEmitter();

  selectedMember: string;
  constructor() { }

  ngOnInit(): void {
  }

  toggle(member: any) {
    if (this.selectedMember == member.uuid) {
      this.selectedMember = null;
    } else {
      this.selectedMember = member.uuid;
    }
  }

  deleteTeamMember(member: any) {
  }

  viewLetter(member: any) {
    this.onViewLetterEvent.emit(member);
  }

  replaceMember(member: any) {
    this.onReplaceMemberEvent.emit(member);
  }

}
