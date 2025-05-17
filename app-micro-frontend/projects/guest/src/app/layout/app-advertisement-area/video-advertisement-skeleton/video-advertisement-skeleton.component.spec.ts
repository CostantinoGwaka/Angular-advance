import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAdvertisementSkeletonComponent } from './video-advertisement-skeleton.component';

describe('VideoAdvertisementSkeletonComponent', () => {
  let component: VideoAdvertisementSkeletonComponent;
  let fixture: ComponentFixture<VideoAdvertisementSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoAdvertisementSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoAdvertisementSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
