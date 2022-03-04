import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubeddialogComponent } from './subeddialog.component';

describe('SubeddialogComponent', () => {
  let component: SubeddialogComponent;
  let fixture: ComponentFixture<SubeddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubeddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubeddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
