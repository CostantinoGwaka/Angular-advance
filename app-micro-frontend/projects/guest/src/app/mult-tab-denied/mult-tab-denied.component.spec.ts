import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultTabDeniedComponent } from './mult-tab-denied.component';

describe('MultTabDeniedComponent', () => {
  let component: MultTabDeniedComponent;
  let fixture: ComponentFixture<MultTabDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MultTabDeniedComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MultTabDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
