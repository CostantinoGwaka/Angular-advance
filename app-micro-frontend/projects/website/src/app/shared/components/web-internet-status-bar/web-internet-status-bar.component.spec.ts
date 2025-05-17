import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebInternetStatusBarComponent } from './web-internet-status-bar.component';

describe('WebInternetStatusBarComponent', () => {
  let component: WebInternetStatusBarComponent;
  let fixture: ComponentFixture<WebInternetStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInternetStatusBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebInternetStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
