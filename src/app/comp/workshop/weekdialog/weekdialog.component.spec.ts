import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekdialogComponent } from './weekdialog.component';

describe('WeekdialogComponent', () => {
  let component: WeekdialogComponent;
  let fixture: ComponentFixture<WeekdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
