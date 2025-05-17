import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleLinearProgressBarComponent } from './simple-linear-progress-bar.component';

describe('SimpleLinearProgressBarComponent', () => {
  let component: SimpleLinearProgressBarComponent;
  let fixture: ComponentFixture<SimpleLinearProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SimpleLinearProgressBarComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SimpleLinearProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
