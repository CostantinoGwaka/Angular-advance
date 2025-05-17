import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummariesViewComponent } from './summaries-view.component';

describe('SummariesViewComponent', () => {
  let component: SummariesViewComponent;
  let fixture: ComponentFixture<SummariesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SummariesViewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SummariesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
