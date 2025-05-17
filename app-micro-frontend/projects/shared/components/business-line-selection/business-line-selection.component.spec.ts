import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLineSelectionComponent } from './business-line-selection.component';

describe('BusinessLineSelectionComponent', () => {
  let component: BusinessLineSelectionComponent;
  let fixture: ComponentFixture<BusinessLineSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BusinessLineSelectionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BusinessLineSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
