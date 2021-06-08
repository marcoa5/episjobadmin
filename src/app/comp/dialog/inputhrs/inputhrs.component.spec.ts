import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputhrsComponent } from './inputhrs.component';

describe('InputhrsComponent', () => {
  let component: InputhrsComponent;
  let fixture: ComponentFixture<InputhrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputhrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputhrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
