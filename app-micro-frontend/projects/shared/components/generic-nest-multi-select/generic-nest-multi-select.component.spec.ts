import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericNestMultiSelectComponent } from './generic-nest-multi-select.component';

describe('GenericNestMultiSelectComponent', () => {
  let component: GenericNestMultiSelectComponent;
  let fixture: ComponentFixture<GenericNestMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericNestMultiSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericNestMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
