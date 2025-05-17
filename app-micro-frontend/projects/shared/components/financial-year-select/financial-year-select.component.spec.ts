import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialYearSelectComponent } from './financial-year-select.component';

describe('FinancialYearSelectComponent', () => {
  let component: FinancialYearSelectComponent;
  let fixture: ComponentFixture<FinancialYearSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialYearSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialYearSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
