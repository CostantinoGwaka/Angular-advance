import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSectionComponent } from './subject-section.component';

describe('SubjectSectionComponent', () => {
  let component: SubjectSectionComponent;
  let fixture: ComponentFixture<SubjectSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SubjectSectionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SubjectSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
