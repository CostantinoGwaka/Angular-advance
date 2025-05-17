import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationShortlistedApplicantsComponent } from './evaluation-shortlisted-applicants.component';

describe('EvaluationShortlistedApplicantsComponent', () => {
  let component: EvaluationShortlistedApplicantsComponent;
  let fixture: ComponentFixture<EvaluationShortlistedApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EvaluationShortlistedApplicantsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationShortlistedApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
