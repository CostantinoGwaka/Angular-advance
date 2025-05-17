import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegoDatePickerComponent } from './nego-date-picker.component';

describe('NegoDatePickerComponent', () => {
  let component: NegoDatePickerComponent;
  let fixture: ComponentFixture<NegoDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegoDatePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NegoDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
