import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopBannerComponent } from './top-banner.component';

describe('TopbannerComponent', () => {
  let component: TopBannerComponent;
  let fixture: ComponentFixture<TopBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TopBannerComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
