import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTeamNewComponent } from './add-update-team-new.component';

describe('AddUpdateTeamComponent', () => {
  let component: AddUpdateTeamNewComponent;
  let fixture: ComponentFixture<AddUpdateTeamNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddUpdateTeamNewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateTeamNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
