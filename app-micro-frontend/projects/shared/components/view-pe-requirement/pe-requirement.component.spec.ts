import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeRequirementComponent } from './pe-requirement.component';

describe('PeRequirementComponent', () => {
  let component: PeRequirementComponent;
  let fixture: ComponentFixture<PeRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PeRequirementComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PeRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
