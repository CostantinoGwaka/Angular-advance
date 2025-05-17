import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationLetterComponent } from './invitation-letter.component';

describe('InvitationLetterComponent', () => {
  let component: InvitationLetterComponent;
  let fixture: ComponentFixture<InvitationLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InvitationLetterComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(InvitationLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
