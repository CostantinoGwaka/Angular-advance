import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationImportDialogComponent } from './specification-import-dialog.component';

describe('SpecificationImportDialogComponent', () => {
  let component: SpecificationImportDialogComponent;
  let fixture: ComponentFixture<SpecificationImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SpecificationImportDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SpecificationImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
