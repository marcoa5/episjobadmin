import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustalreadyexistdialogComponent } from './custalreadyexistdialog.component';

describe('CustalreadyexistdialogComponent', () => {
  let component: CustalreadyexistdialogComponent;
  let fixture: ComponentFixture<CustalreadyexistdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustalreadyexistdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustalreadyexistdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
