import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectdialogComponent } from './selectdialog.component';

describe('SelectdialogComponent', () => {
  let component: SelectdialogComponent;
  let fixture: ComponentFixture<SelectdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
