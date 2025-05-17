import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedLayoutComponent } from './shared-layout.component';

describe('TableFormComponent', () => {
  let component: SharedLayoutComponent;
  let fixture: ComponentFixture<SharedLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SharedLayoutComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
