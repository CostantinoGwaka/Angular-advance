import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAdvertisementComponent } from './video-advertisement.component';

describe('VideoAdvertisementComponent', () => {
  let component: VideoAdvertisementComponent;
  let fixture: ComponentFixture<VideoAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoAdvertisementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
