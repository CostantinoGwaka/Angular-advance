import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsItemComponent } from './view-details-item.component';

describe('ViewDetailsItemComponent', () => {
  let component: ViewDetailsItemComponent;
  let fixture: ComponentFixture<ViewDetailsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewDetailsItemComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ViewDetailsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
