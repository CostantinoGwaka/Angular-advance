import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestVerticalStepperComponent } from './nest-vertical-stepper.component';

describe('NestVerticalStepperComponent', () => {
  let component: NestVerticalStepperComponent;
  let fixture: ComponentFixture<NestVerticalStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NestVerticalStepperComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NestVerticalStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
