import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderViewFormComponent } from './calender-view-form.component';

describe('CalenderViewFormComponent', () => {
  let component: CalenderViewFormComponent;
  let fixture: ComponentFixture<CalenderViewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CalenderViewFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CalenderViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
