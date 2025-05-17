import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqModifierTenderSelectorComponent } from './boq-modifier-tender-selector.component';

describe('BoqModifierTenderSelectorComponent', () => {
  let component: BoqModifierTenderSelectorComponent;
  let fixture: ComponentFixture<BoqModifierTenderSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoqModifierTenderSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoqModifierTenderSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
