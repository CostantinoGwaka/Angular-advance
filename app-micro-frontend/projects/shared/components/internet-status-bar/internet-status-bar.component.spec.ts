import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetStatusBarComponent } from './internet-status-bar.component';

describe('InternetStatusBarComponent', () => {
  let component: InternetStatusBarComponent;
  let fixture: ComponentFixture<InternetStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InternetStatusBarComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(InternetStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
