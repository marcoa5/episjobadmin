import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractalreadyexistsdialogComponent } from './contractalreadyexistsdialog.component';

describe('ContractalreadyexistsdialogComponent', () => {
  let component: ContractalreadyexistsdialogComponent;
  let fixture: ComponentFixture<ContractalreadyexistsdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractalreadyexistsdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractalreadyexistsdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
