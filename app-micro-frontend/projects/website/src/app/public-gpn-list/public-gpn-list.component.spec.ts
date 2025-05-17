import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGpnListComponent } from './public-gpn-list.component';

describe('PublicGpnListComponent', () => {
  let component: PublicGpnListComponent;
  let fixture: ComponentFixture<PublicGpnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicGpnListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PublicGpnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
