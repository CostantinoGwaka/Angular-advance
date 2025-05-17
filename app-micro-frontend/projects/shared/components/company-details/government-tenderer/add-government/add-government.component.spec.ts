import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGovernmentComponent } from './add-government.component';

describe('AddGovernmentComponent', () => {
  let component: AddGovernmentComponent;
  let fixture: ComponentFixture<AddGovernmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddGovernmentComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AddGovernmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
