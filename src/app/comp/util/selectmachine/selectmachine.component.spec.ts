import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectmachineComponent } from './selectmachine.component';

describe('SelectmachineComponent', () => {
  let component: SelectmachineComponent;
  let fixture: ComponentFixture<SelectmachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectmachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
