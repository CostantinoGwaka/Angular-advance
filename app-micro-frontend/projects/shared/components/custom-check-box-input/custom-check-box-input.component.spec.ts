import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCheckBoxInputComponent } from './custom-check-box-input.component';

describe('CustomCheckBoxInputComponent', () => {
  let component: CustomCheckBoxInputComponent;
  let fixture: ComponentFixture<CustomCheckBoxInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CustomCheckBoxInputComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CustomCheckBoxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
