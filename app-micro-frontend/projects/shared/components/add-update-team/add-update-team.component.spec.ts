import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTeamComponent } from './add-update-team.component';

describe('AddUpdateTeamComponent', () => {
  let component: AddUpdateTeamComponent;
  let fixture: ComponentFixture<AddUpdateTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddUpdateTeamComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
