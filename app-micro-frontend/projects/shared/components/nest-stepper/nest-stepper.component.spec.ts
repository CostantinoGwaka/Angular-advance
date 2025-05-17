import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestStepperComponent } from './nest-stepper.component';

describe('NestStepperComponent', () => {
  let component: NestStepperComponent;
  let fixture: ComponentFixture<NestStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NestStepperComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NestStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
