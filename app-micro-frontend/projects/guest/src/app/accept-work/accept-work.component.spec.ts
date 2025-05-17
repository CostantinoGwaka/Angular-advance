import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptWorkComponent } from './accept-work.component';

describe('AcceptWorkComponent', () => {
  let component: AcceptWorkComponent;
  let fixture: ComponentFixture<AcceptWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AcceptWorkComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AcceptWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
