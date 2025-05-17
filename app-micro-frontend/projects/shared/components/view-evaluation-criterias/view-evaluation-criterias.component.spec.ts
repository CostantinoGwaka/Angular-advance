import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEvaluationCriteriasComponent } from './view-evaluation-criterias.component';

describe('ViewEvaluationCriteriasComponent', () => {
  let component: ViewEvaluationCriteriasComponent;
  let fixture: ComponentFixture<ViewEvaluationCriteriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewEvaluationCriteriasComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ViewEvaluationCriteriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
