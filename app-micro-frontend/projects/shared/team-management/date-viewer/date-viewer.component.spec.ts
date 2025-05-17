import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateViewerComponent } from './date-viewer.component';

describe('DateViewerComponent', () => {
  let component: DateViewerComponent;
  let fixture: ComponentFixture<DateViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DateViewerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DateViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
