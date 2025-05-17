import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerSorComponent } from './manufacturer-sor.component';

describe('ManufacturerSorComponent', () => {
  let component: ManufacturerSorComponent;
  let fixture: ComponentFixture<ManufacturerSorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ManufacturerSorComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerSorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
