import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationOfInterestComponent } from './declaration-of-interest.component';

describe('DeclarationOfInterestComponent', () => {
  let component: DeclarationOfInterestComponent;
  let fixture: ComponentFixture<DeclarationOfInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DeclarationOfInterestComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
