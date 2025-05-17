import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceBillComponent } from './view-service-bill.component';

describe('ViewServiceBillComponent', () => {
  let component: ViewServiceBillComponent;
  let fixture: ComponentFixture<ViewServiceBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewServiceBillComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ViewServiceBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
