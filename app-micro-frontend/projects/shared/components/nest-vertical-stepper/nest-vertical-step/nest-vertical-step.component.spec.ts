import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestVerticalStepComponent } from './nest-vertical-step.component';

describe('NestVerticalStepComponent', () => {
  let component: NestVerticalStepComponent;
  let fixture: ComponentFixture<NestVerticalStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NestVerticalStepComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NestVerticalStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
