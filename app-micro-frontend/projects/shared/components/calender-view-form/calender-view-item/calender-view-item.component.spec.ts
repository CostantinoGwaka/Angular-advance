import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderViewItemComponent } from './calender-view-item.component';

describe('CalenderViewComponent', () => {
  let component: CalenderViewItemComponent;
  let fixture: ComponentFixture<CalenderViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CalenderViewItemComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CalenderViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
