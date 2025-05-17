import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DottedCustomAlertBoxComponent } from './dotted-custom-alert-box.component';

describe('DottedCustomAlertBoxComponent', () => {
  let component: DottedCustomAlertBoxComponent;
  let fixture: ComponentFixture<DottedCustomAlertBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DottedCustomAlertBoxComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DottedCustomAlertBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
