import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderersComponent } from './tenderers.component';

describe('TenderersComponent', () => {
  let component: TenderersComponent;
  let fixture: ComponentFixture<TenderersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TenderersComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TenderersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
