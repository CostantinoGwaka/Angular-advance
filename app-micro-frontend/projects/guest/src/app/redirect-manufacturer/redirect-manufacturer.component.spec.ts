import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectManufacturerComponent } from './redirect-manufacturer.component';

describe('RedirectManufacturerComponent', () => {
  let component: RedirectManufacturerComponent;
  let fixture: ComponentFixture<RedirectManufacturerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RedirectManufacturerComponent]
});
    fixture = TestBed.createComponent(RedirectManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
