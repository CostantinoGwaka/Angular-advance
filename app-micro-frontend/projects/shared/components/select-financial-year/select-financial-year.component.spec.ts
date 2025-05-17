import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFinancialYearComponent } from './select-financial-year.component';

describe('SelectFinancialYearComponent', () => {
  let component: SelectFinancialYearComponent;
  let fixture: ComponentFixture<SelectFinancialYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFinancialYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectFinancialYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
