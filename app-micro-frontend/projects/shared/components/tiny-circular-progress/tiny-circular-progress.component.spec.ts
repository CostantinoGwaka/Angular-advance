import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyCircularProgressComponent } from './tiny-circular-progress.component';

describe('TinyCircularProgressComponent', () => {
  let component: TinyCircularProgressComponent;
  let fixture: ComponentFixture<TinyCircularProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TinyCircularProgressComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TinyCircularProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
