import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderTenderGpnComponent } from './render-tender-gpn.component';

describe('RenderTenderGpnComponent', () => {
  let component: RenderTenderGpnComponent;
  let fixture: ComponentFixture<RenderTenderGpnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RenderTenderGpnComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RenderTenderGpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
