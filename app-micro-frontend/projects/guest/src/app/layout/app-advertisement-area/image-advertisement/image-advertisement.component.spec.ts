import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAdvertisementComponent } from './image-advertisement.component';

describe('ImageAdvertisementComponent', () => {
  let component: ImageAdvertisementComponent;
  let fixture: ComponentFixture<ImageAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageAdvertisementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
