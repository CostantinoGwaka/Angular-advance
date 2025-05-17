import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipAdvertisementComponent } from './tip-advertisement.component';

describe('TipAdvertisementComponent', () => {
  let component: TipAdvertisementComponent;
  let fixture: ComponentFixture<TipAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipAdvertisementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
