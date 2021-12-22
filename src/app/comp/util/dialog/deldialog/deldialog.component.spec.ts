import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeldialogComponent } from './deldialog.component';

describe('DeldialogComponent', () => {
  let component: DeldialogComponent;
  let fixture: ComponentFixture<DeldialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeldialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
