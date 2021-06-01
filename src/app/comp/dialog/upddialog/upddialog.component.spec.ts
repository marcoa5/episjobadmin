import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpddialogComponent } from './upddialog.component';

describe('UpddialogComponent', () => {
  let component: UpddialogComponent;
  let fixture: ComponentFixture<UpddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
