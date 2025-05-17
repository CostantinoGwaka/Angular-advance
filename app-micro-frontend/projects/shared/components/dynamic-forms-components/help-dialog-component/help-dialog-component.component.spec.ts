import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDialogComponentComponent } from './help-dialog-component.component';

describe('HelpDialogComponentComponent', () => {
  let component: HelpDialogComponentComponent;
  let fixture: ComponentFixture<HelpDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HelpDialogComponentComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(HelpDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
