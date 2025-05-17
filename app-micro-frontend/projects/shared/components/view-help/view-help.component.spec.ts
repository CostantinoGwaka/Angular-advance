import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHelpComponent } from './view-help.component';

describe('ViewHelpComponent', () => {
  let component: ViewHelpComponent;
  let fixture: ComponentFixture<ViewHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewHelpComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
