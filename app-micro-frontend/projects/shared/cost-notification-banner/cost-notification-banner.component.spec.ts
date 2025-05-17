import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostNotificationBannerComponent } from './cost-notification-banner.component';

describe('CostNotificationBannerComponent', () => {
  let component: CostNotificationBannerComponent;
  let fixture: ComponentFixture<CostNotificationBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CostNotificationBannerComponent]
});
    fixture = TestBed.createComponent(CostNotificationBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
