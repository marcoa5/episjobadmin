import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectmonthComponent } from './selectmonth.component';

describe('SelectmonthComponent', () => {
  let component: SelectmonthComponent;
  let fixture: ComponentFixture<SelectmonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectmonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectmonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
