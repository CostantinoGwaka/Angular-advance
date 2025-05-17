import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectProfileComponent } from './reject-profile.component';

describe('RejectProfileComponent', () => {
  let component: RejectProfileComponent;
  let fixture: ComponentFixture<RejectProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RejectProfileComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RejectProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
