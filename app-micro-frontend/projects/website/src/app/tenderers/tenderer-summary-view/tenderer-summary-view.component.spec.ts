import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendererSummaryViewComponent } from './tenderer-summary-view.component';

describe('TendererSummaryViewComponent', () => {
  let component: TendererSummaryViewComponent;
  let fixture: ComponentFixture<TendererSummaryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TendererSummaryViewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TendererSummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
