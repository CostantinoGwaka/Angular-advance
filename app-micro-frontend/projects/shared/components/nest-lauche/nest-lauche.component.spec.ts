import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestLaucheComponent } from './nest-lauche.component';

describe('NestLaucheComponent', () => {
  let component: NestLaucheComponent;
  let fixture: ComponentFixture<NestLaucheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestLaucheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NestLaucheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
