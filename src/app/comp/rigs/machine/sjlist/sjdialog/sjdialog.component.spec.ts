import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SjdialogComponent } from './sjdialog.component';

describe('SjdialogComponent', () => {
  let component: SjdialogComponent;
  let fixture: ComponentFixture<SjdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SjdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SjdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
