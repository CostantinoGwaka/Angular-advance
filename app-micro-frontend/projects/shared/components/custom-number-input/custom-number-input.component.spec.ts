import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNumberInputComponent } from './custom-number-input.component';

describe('CustomNumberInputComponent', () => {
  let component: CustomNumberInputComponent;
  let fixture: ComponentFixture<CustomNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CustomNumberInputComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CustomNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
