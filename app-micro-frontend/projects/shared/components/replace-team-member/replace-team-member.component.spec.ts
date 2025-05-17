import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceTeamMemberComponent } from './replace-team-member.component';

describe('ReplaceTeamMemberComponent', () => {
  let component: ReplaceTeamMemberComponent;
  let fixture: ComponentFixture<ReplaceTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReplaceTeamMemberComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ReplaceTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
