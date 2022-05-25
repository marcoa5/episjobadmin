import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SjnumberdialogComponent } from './sjnumberdialog.component';

describe('SjnumberdialogComponent', () => {
  let component: SjnumberdialogComponent;
  let fixture: ComponentFixture<SjnumberdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SjnumberdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SjnumberdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
