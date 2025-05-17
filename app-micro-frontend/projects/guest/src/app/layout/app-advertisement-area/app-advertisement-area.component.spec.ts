import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAdvertisementAreaComponent } from './app-advertisement-area.component';

describe('AppAdvertisementAreaComponent', () => {
  let component: AppAdvertisementAreaComponent;
  let fixture: ComponentFixture<AppAdvertisementAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAdvertisementAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppAdvertisementAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
