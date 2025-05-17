import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectWorkComponent } from './reject-work.component';

describe('RejectWorkComponent', () => {
  let component: RejectWorkComponent;
  let fixture: ComponentFixture<RejectWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RejectWorkComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RejectWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
