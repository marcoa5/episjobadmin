import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdelbutComponent } from './editdelbut.component';

describe('EditdelbutComponent', () => {
  let component: EditdelbutComponent;
  let fixture: ComponentFixture<EditdelbutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditdelbutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdelbutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
