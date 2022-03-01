import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsdialogComponent } from './partsdialog.component';

describe('PartsdialogComponent', () => {
  let component: PartsdialogComponent;
  let fixture: ComponentFixture<PartsdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
