import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitweekdialogComponent } from './submitweekdialog.component';

describe('SubmitweekdialogComponent', () => {
  let component: SubmitweekdialogComponent;
  let fixture: ComponentFixture<SubmitweekdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitweekdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitweekdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
