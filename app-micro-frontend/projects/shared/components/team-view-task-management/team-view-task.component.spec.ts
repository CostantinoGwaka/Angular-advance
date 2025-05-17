import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamViewTaskComponent } from './team-view-task.component';

describe('TeamViewTaskComponent', () => {
  let component: TeamViewTaskComponent;
  let fixture: ComponentFixture<TeamViewTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamViewTaskComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TeamViewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
