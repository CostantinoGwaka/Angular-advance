import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptProfileComponent } from './accept-profile.component';

describe('AcceptProfileComponent', () => {
  let component: AcceptProfileComponent;
  let fixture: ComponentFixture<AcceptProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AcceptProfileComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AcceptProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
