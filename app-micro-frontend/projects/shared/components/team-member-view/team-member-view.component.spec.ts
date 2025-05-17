import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberViewComponent } from './team-member-view.component';

describe('TeamMemberViewComponent', () => {
  let component: TeamMemberViewComponent;
  let fixture: ComponentFixture<TeamMemberViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamMemberViewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TeamMemberViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
