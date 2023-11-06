import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpirocvsfeaComponent } from './epirocvsfea.component';

describe('EpirocvsfeaComponent', () => {
  let component: EpirocvsfeaComponent;
  let fixture: ComponentFixture<EpirocvsfeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpirocvsfeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpirocvsfeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
