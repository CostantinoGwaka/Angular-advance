import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmAreaComponent } from './confirm-area.component';

describe('ConfirmAreaComponent', () => {
  let component: ConfirmAreaComponent;
  let fixture: ComponentFixture<ConfirmAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ConfirmAreaComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
