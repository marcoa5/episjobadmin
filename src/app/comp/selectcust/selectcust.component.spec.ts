import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectcustComponent } from './selectcust.component';

describe('SelectcustComponent', () => {
  let component: SelectcustComponent;
  let fixture: ComponentFixture<SelectcustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectcustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectcustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
