import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveBusinessComponent } from './approve-business.component';

describe('ApproveBusinessComponent', () => {
  let component: ApproveBusinessComponent;
  let fixture: ComponentFixture<ApproveBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ApproveBusinessComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ApproveBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
