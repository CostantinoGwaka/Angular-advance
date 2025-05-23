import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearProgressBarComponent } from './linear-progress-bar.component';

describe('LinearProgressBarComponent', () => {
  let component: LinearProgressBarComponent;
  let fixture: ComponentFixture<LinearProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LinearProgressBarComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(LinearProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
