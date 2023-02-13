import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectcustomerComponent } from './selectcustomer.component';

describe('SelectcustomerComponent', () => {
  let component: SelectcustomerComponent;
  let fixture: ComponentFixture<SelectcustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectcustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
