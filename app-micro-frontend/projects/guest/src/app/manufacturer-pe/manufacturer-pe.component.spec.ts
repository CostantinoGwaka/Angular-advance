import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerPeComponent } from './manufacturer-pe.component';

describe('ManufacturerPeComponent', () => {
  let component: ManufacturerPeComponent;
  let fixture: ComponentFixture<ManufacturerPeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ManufacturerPeComponent]
});
    fixture = TestBed.createComponent(ManufacturerPeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
