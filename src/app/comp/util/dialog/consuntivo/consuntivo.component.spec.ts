import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsuntivoComponent } from './consuntivo.component';

describe('ConsuntivoComponent', () => {
  let component: ConsuntivoComponent;
  let fixture: ComponentFixture<ConsuntivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsuntivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsuntivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
